# PatchControl

Sistema de parcheo y monitoreo de servidores Windows para entornos corporativos. El núcleo operativo es **`WUU.ps1`** (*Windows Update Utility*): una consola de escritorio en PowerShell + WPF que parchea servidores en paralelo vía PsExec. Opcionalmente, un **dashboard web** (Next.js) centraliza los reportes enviados desde WUU.

> **Guía técnica detallada:** ver [`GUIA_TECNICA.md`](GUIA_TECNICA.md) (runbooks, arquitectura, referencia de API, troubleshooting extendido).

---

## Índice

1. [Arquitectura general](#arquitectura-general)
2. [Estructura del repositorio](#estructura-del-repositorio)
3. [WUU.ps1 — Documentación detallada del script](#wuups1--documentación-detallada-del-script)
   - [Arranque y auto-elevación](#arranque-y-auto-elevación)
   - [Interfaz gráfica (WPF)](#interfaz-gráfica-wpf)
   - [Inventario CSV y carga de servidores](#inventario-csv-y-carga-de-servidores)
   - [Motor de parcheo (Windows Update)](#motor-de-parcheo-windows-update)
   - [Instalación de Fix (.msu / .cab)](#instalación-de-fix-msu--cab)
   - [Reporte de parcheo](#reporte-de-parcheo)
   - [Sincronización con Vercel](#sincronización-con-vercel)
   - [Reporte programado (modo headless)](#reporte-programado-modo-headless)
   - [Historial acumulado](#historial-acumulado)
   - [Auto-reinicio tras parcheo](#auto-reinicio-tras-parcheo)
   - [Menú contextual y monitoreo post-reinicio](#menú-contextual-y-monitoreo-post-reinicio)
   - [config.json — Configuración externa](#configjson--configuración-externa)
   - [Paralelismo, archivos remotos y temporales](#paralelismo-archivos-remotos-y-temporales)
   - [Logging](#logging)
   - [Variables de configuración](#variables-de-configuración)
4. [Dashboard web](#dashboard-web)
5. [Instalación y uso](#instalación-y-uso)
6. [Solución de problemas](#solución-de-problemas)

---

## Arquitectura general

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Estación de trabajo del operador (administrador)                        │
│                                                                          │
│  WUU.ps1                                                                 │
│    │                                                                     │
│    ├── Lee CSV desde .\Servidores\                                       │
│    ├── Interfaz WPF (grilla en vivo, botones, menú contextual)           │
│    │                                                                     │
│    ├── Por cada servidor (PsExec + SMB C$):                              │
│    │      Copia script → C:\Windows\Temp\WUU\                            │
│    │      Ejecuta como SYSTEM (-s)                                       │
│    │      Lee progreso vía JSON (status.json, report.json, etc.)         │
│    │                                                                     │
│    ├── Lee config.json (Dashboard, historial, etc.)                      │
│    ├── Genera .\Reportes\Reporte_*.csv                                   │
│    ├── Acumula .\Historial\ (CSV + JSON por corrida)                     │
│    ├── Escribe .\Logs\WUU_*.log                                          │
│    │                                                                     │
│    └── [Opcional] POST → https://...vercel.app/api/upload                │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  Dashboard Next.js + PostgreSQL (Neon) en Vercel                         │
│  /  /historial  /reportes  /login  /usuarios                             │
└──────────────────────────────────────────────────────────────────────────┘
```

**Principio de diseño:** WUU no instala parches desde la estación local. Copia scripts a cada servidor remoto y los ejecuta allí con el agente nativo de Windows Update (`Microsoft.Update.*`) o herramientas del SO (`wusa.exe`, `dism.exe`). La consola solo orquesta y refleja el estado leyendo archivos JSON por SMB.

---

## Estructura del repositorio

```
PatchControl/
├── WUU.ps1                 # Script principal (~2.100 líneas, PowerShell + WPF)
├── config.json             # Configuración externa (Dashboard, historial, etc.)
├── PsExec.exe              # Sysinternals (NO incluido; colocar junto a WUU.ps1)
│
├── Servidores/             # Inventario en CSV (uno o más archivos)
│   └── servidores.csv
├── Fix/                    # Paquetes .msu o .cab para el botón Fix
├── Reportes/               # CSV generados por cada corrida de reporte
├── Historial/              # Historial acumulado (resumen CSV + detalle JSON)
├── Logs/                   # Un log por sesión de WUU
│
└── dashboard/              # App web Next.js 16 + Prisma + PostgreSQL
    ├── prisma/schema.prisma
    ├── src/app/api/upload/route.ts
    └── src/components/
```

---

## WUU.ps1 — Documentación detallada del script

### Arranque y auto-elevación

Al abrir `WUU.ps1`, el script:

1. **Verifica privilegios de administrador.** Si no los tiene, se relanza a sí mismo con `-Verb runas` (UAC) y cierra la instancia sin privilegios. Si el usuario cancela el UAC, el script termina sin mostrar la ventana.
2. **Carga ensamblados WPF:** `PresentationFramework`, `PresentationCore`, `WindowsBase`, `System.Xaml`.
3. **Registra clases C# embebidas** (`Add-Type`) para filas de datos con notificación de cambios (`INotifyPropertyChanged`), necesarias para que la grilla se refresque en vivo.
4. **Parsea la ventana XAML** embebida en el script y obtiene referencias a controles.
5. **Inicializa logging** en `Logs\WUU_YYYY-MM-DD_HH-mm-ss.log`.
6. **Carga `config.json`** con `Load-Config` (si no existe, lo crea con valores por defecto).
7. **Escribe scripts trabajadores locales** en `%TEMP%` (worker, report, history, wulog, verify, fix).
8. **Ejecuta `Load-Csv`** para cargar el inventario.
9. **Muestra la ventana** con `$Window.ShowDialog()` (modo normal) o ejecuta el flujo headless con `-Scheduled`.

Comando recomendado de ejecución:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\WUU.ps1"
```

---

### Interfaz gráfica (WPF)

#### Zona superior — Búsqueda y grupos

- **Buscar:** campo de texto con autocompletado por nombre o IP. Permite agregar servidores del CSV a la grilla sin seleccionar todo el grupo.
- Botón desplegable **"Seleccionar grupos"** con popup de checkboxes.
- Cada checkbox corresponde a un valor único de la columna `Grupo` del CSV.
- Al marcar/desmarcar grupos, la grilla se reconstruye con los servidores de esos grupos.
- Tras 1,5 s de estabilidad en la selección de grupos, WUU registra la sesión en el log (`Sesion iniciada...`).
- Contador: `Servidores cargados: N | Seleccionados: M`.

#### Leyenda de colores

| Color en grilla | Valor interno `State` | Etapa |
|-----------------|----------------------|-------|
| Gris claro | `Unselected` | Sin proceso activo |
| Khaki | `CheckWSUS` | Chequeo WSUS / Windows Update |
| Naranja | `Remediation` | Remediación del agente WU |
| Celeste | `DownloadInstall` | Descarga o instalación |
| Rojo parpadeante | `RebootRequired` | Reinicio pendiente |
| Verde claro | `Updated` | Completado sin pendientes |

#### Columnas de la grilla principal

| Columna UI | Propiedad `ServerRow` | Origen del dato |
|------------|----------------------|-----------------|
| Sel | `Sel` | Checkbox del operador; al marcarlo inicia el parcheo |
| Servidor | `Servidor` | CSV |
| IP | `IP` | CSV; se actualiza en vivo desde `status.json` remoto |
| Servidor WSUS | `Wsus` | Registro `WUServer` o "No configurado (WU directo)" |
| Available | `Available` | Updates pendientes detectados |
| Downloaded | `Downloaded` | Updates descargados (contador) |
| Download % | `DownloadPct` | Porcentaje de descarga |
| Error | `Error` | Mensaje de error del trabajador remoto |
| Status | `Status` | Texto descriptivo de la etapa actual |
| Running Time | `RunningTime` | Cronómetro `hh:mm:ss` desde inicio del job |

Campos del CSV no visibles en grilla pero usados en reportes: `Grupo`, `Dominio`, `OS`, `Ambiente`.

#### Botones inferiores

| Botón | Función detallada |
|-------|-------------------|
| **Limpiar selección** | Desmarca todos los `Sel`, resetea `State` a `Unselected` y limpia columnas de progreso. No detiene jobs en curso. |
| **Reporte** | Lanza `Show-Report`: consulta remota en paralelo de todos los servidores visibles en la grilla. |
| **Recargar grupos** | Detiene jobs activos, desmarca todos los grupos, vacía la grilla. Permite elegir otros grupos. |
| **Fix** | Lanza `Start-FixFlow`: instala un `.msu` o `.cab` de la carpeta `Fix\` en servidores elegidos. |
| **Programar** | Abre ventana para crear/eliminar la tarea programada de Windows que ejecuta `WUU.ps1 -Scheduled`. |
| **Detener y refrescar** | Escribe `stop.flag` en servidores con job activo, cierra runspaces, detiene monitores de reinicio, auto-reinicios pendientes y jobs Fix. Resetea la UI. |

---

### Inventario CSV y carga de servidores

#### Función `Load-Csv`

1. Busca la carpeta `Servidores\` junto a `WUU.ps1`.
2. Importa **todos** los `.csv` encontrados y los fusiona en memoria.
3. Detecta delimitador automáticamente: `;` si la primera línea contiene `;` y no `,`; si no, usa `,`.
4. Valida columnas obligatorias: **`Grupo`** y **`Servidor`**. Si faltan, muestra error y aborta.
5. Construye la lista de grupos únicos ordenados alfabéticamente.

#### Función `Rebuild-Grid`

Se ejecuta al cambiar la selección de grupos:

1. Filtra filas del CSV cuyo `Grupo` está marcado.
2. **Deduplica por `Servidor`:** si el mismo servidor aparece en varios grupos o filas repetidas del CSV, solo se muestra **una fila** (primera ocurrencia).
3. Crea objetos `ServerRow` y los agrega a la colección observable de la grilla.
4. Cada fila registra un handler `PropertyChanged` en `Sel` que llama a `On-ServerSelChanged`.

#### Columnas del CSV

| Columna | Obligatoria | Uso |
|---------|-------------|-----|
| `Grupo` | Sí | Agrupación en el selector desplegable |
| `Servidor` | Sí | Nombre DNS / hostname para PsExec y SMB |
| `Dominio` | No | Reporte y dashboard |
| `IP` | No | Referencia; puede completarse en vivo durante parcheo |
| `OS` | No | Referencia del inventario |
| `Ambiente` | No | Producción, Desarrollo, Test, etc. |

Ejemplo:

```csv
Grupo;Dominio;IP;OS;Servidor;Ambiente
Producción1;petersen.corp;10.50.89.98;Windows Server 2019 Standard;BERENROLLWEB02P;Producción
```

---

### Motor de parcheo (Windows Update)

#### Disparo del proceso

Al marcar el checkbox **Sel** de una fila:

1. `On-ServerSelChanged` → `Start-ServerJob`.
2. Si ya existe un job para ese servidor, no hace nada (evita duplicados).
3. Verifica que exista `PsExec.exe`.
4. Resetea columnas visuales y arranca un cronómetro (`Stopwatch`).
5. Abre un **runspace** en segundo plano que:
   - Crea `\\SERVIDOR\C$\Windows\Temp\WUU\`
   - Elimina `status.json` y `stop.flag` previos
   - Copia `%TEMP%\WUU_worker.ps1` → `worker.ps1` remoto
   - Ejecuta:

     ```text
     PsExec \\SERVIDOR -accepteula -nobanner -s powershell.exe -ExecutionPolicy Bypass -NonInteractive -File C:\Windows\Temp\WUU\worker.ps1
     ```

     `-s` = cuenta **SYSTEM** en el servidor remoto. La autenticación de red usa las credenciales del operador que abrió WUU.

#### Refresco en vivo — `On-TimerTick` (cada 2 segundos)

1. Lee `\\SERVIDOR\C$\Windows\Temp\WUU\status.json`.
2. Mapea el campo `stage` del JSON al color de fila (`Apply-Status`).
3. Actualiza columnas `Wsus`, `IP`, `Available`, `Downloaded`, `DownloadPct`, `Error`, `Status`.
4. Actualiza `RunningTime` con el cronómetro local.
5. Cuando el runspace de PsExec termina (`sync.done`), cierra recursos y registra en log.

#### Flujo del script remoto `worker.ps1`

```
INICIO
  │
  ├─ Obtener IP y servidor WSUS (registro HKLM\...\WindowsUpdate\WUServer)
  │
  ├─ CHEQUEO: Microsoft.Update.Session → Search("IsInstalled=0 and IsHidden=0")
  │     │
  │     ├─ Error → REMEDIACIÓN:
  │     │     Stop wuauserv / bits
  │     │     Borrar C:\Windows\SoftwareDistribution
  │     │     Start servicios + gpupdate /force
  │     │     Re-chequeo
  │     │
  │     ├─ 0 updates → verificar RebootRequired → stage: done | reboot
  │     │
  │     └─ N updates → verificar espacio C: (mínimo 2 GB libres)
  │           │
  │           ├─ DESCARGA: update por update (para calcular % en vivo)
  │           │     Acepta EULA, descarga si no está descargado
  │           │     Escribe downloaded, downloadPct en status.json
  │           │
  │           └─ INSTALACIÓN: CreateUpdateInstaller → Install()
  │                 Verifica códigos de resultado por update
  │                 stage: done | reboot | error
  │
  └─ En cada punto seguro: si existe stop.flag → stage: stopped
```

#### Esquema de `status.json` (escrito en el servidor remoto)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `stage` | string | `check`, `remediate`, `download`, `install`, `reboot`, `done`, `stopped`, `error` |
| `wsus` | string | URL del WSUS o "No configurado (WU directo)" |
| `ip` | string | IPv4 detectada en el servidor |
| `available` | int | Cantidad de updates pendientes |
| `downloaded` | int | Updates descargados hasta el momento |
| `downloadPct` | int | Porcentaje 0–100 |
| `error` | string | Mensaje de error (vacío si no hay) |
| `status` | string | Texto legible para la columna Status |
| `rebootRequired` | bool | Si el servidor necesita reinicio |

El archivo se escribe de forma atómica: primero a `status.json.tmp`, luego `Move-Item` a `status.json`.

#### Detención segura — `Stop-ServerJob`

1. Escribe `\\SERVIDOR\C$\Windows\Temp\WUU\stop.flag`.
2. El trabajador remoto detecta la bandera entre etapas (no interrumpe una instalación a mitad).
3. Detiene y libera el runspace local.
4. Con `-Reset`, vuelve la fila a `Unselected`.

---

### Instalación de Fix (.msu / .cab)

Funcionalidad independiente del ciclo de Windows Update para instalar parches puntuales.

#### Carpeta `Fix\`

Colocar uno o más archivos `.msu` o `.cab`. El botón **Fix** de la barra inferior inicia el flujo.

#### Flujo `Start-FixFlow`

1. Verifica que exista la carpeta `Fix\` con al menos un `.msu` o `.cab`.
2. Si hay varios archivos, muestra ventana para elegir uno.
3. Muestra ventana para elegir servidores destino (desde los cargados en la grilla).
4. Pide confirmación al operador.
5. Por cada servidor: `Start-FixJob`.

#### Script remoto `fix.ps1`

1. Recibe el nombre del archivo como parámetro.
2. Busca el archivo en `C:\Windows\Temp\WUU\`.
3. Instala según extensión:
   - **`.msu`** → `wusa.exe "archivo" /quiet /norestart`
   - **`.cab`** → `dism.exe /online /add-package /packagepath:"archivo" /quiet /norestart`
4. Interpreta códigos de salida:

| Exit code | Significado |
|-----------|-------------|
| `0` | Fix instalado |
| `3010` | Instalado, requiere reinicio |
| `2359302` | Ya estaba instalado |
| `-2145124329` | No aplicable a este servidor |
| Otro | Error |

5. Escribe resultado en `fix.json`.

WUU copia tanto `fix.ps1` como el paquete al servidor antes de ejecutar PsExec.

---

### Reporte de parcheo

#### Disparo — botón **Reporte** → `Show-Report`

1. Toma **todos** los servidores actualmente visibles en la grilla (`$script:Servers`).
2. Lanza un runspace por servidor (paralelo).
3. Timeout global: **10 minutos** (`RepDeadline`).
4. Muestra progreso en el botón: `Generando N/Total...`.

#### Por cada servidor (runspace `$rjob`)

1. Copia `%TEMP%\WUU_report.ps1` → `\\SERVIDOR\C$\Windows\Temp\WUU\report.ps1`
2. Ejecuta vía PsExec como SYSTEM.
3. Lee `report.json` generado remotamente.
4. Si falla la conexión o no hay JSON, crea objeto fallback:

   ```powershell
   Descripcion_Error = "Sin conexion o sin datos"
   Servidor = <nombre esperado>
   # resto de campos vacíos
   ```

5. Agrega el resultado a `$script:RepBag` (ArrayList sincronizado).

#### Script remoto `report.ps1` — campos recolectados

| Campo JSON | Comando / origen |
|------------|------------------|
| `Dominio` | `(Get-CimInstance Win32_ComputerSystem).Domain` |
| `Servidor` | `[System.Net.Dns]::GetHostName()` |
| `IP` | Primera IPv4 que no sea 127.x ni 169.254.x |
| `Sistema_Operativo` | `(Get-CimInstance Win32_OperatingSystem).Caption` |
| `Version_Sistema_Operativo` | Versión de `C:\Windows\System32\netlogon.dll` |
| `Fecha_Instalacion` | Ver lógica de KBs abajo |
| `KBs_Instaladas` | Ver lógica de KBs abajo |
| `Fecha_Reinicio` | `LastBootUpTime` formateado `yyyy-MM-dd HH:mm:ss` |
| `Running_Time` | Tiempo transcurrido desde último boot (`hh:mm:ss`) |
| `Descripcion_Error` | Primer evento Error del proveedor `Microsoft-Windows-WindowsUpdateClient` en log System |

#### Lógica de KBs (mes en curso)

El script consulta `Get-HotFix` y aplica esta regla:

**Si hay KBs instalados en el mes actual** (mismo año y mes que `Get-Date`):

- `KBs_Instaladas` = lista de `HotFixID` separados por coma (ej. `KB5034441, KB5036896`)
- `Fecha_Instalacion` = fecha del parche más reciente de ese mes (`yyyy-MM-dd`)

**Si no hay KBs este mes:**

- `KBs_Instaladas` = vacío
- `Fecha_Instalacion` = fecha del último hotfix registrado en el servidor (cualquier mes)

#### Al finalizar la recolección — `On-ReportTick`

1. **Deduplica por `Servidor`** (conserva la última entrada por nombre).
2. Convierte a objetos `ReportRow` ordenados alfabéticamente.
3. **`Save-ReportCsv`** → escribe `Reportes\Reporte_YYYY-MM-DD_HH-mm-ss.csv`
   - Delimitador `;` (compatible con Excel locale es-AR)
   - Encoding UTF-8
   - Sin fila de tipo (`-NoTypeInformation`)
4. **`Show-ReportWindow`** → abre ventana modal con grilla de reporte.

#### Ventana de reporte

- Muestra las 10 columnas del reporte.
- Indica ruta del CSV guardado.
- Al cargar, intenta sincronizar con Vercel en segundo plano (`Dispatcher.BeginInvoke`).
- Botón **Reintentar sincronización** vuelve a llamar `Sync-ToVercel`.

---

### Sincronización con Vercel

#### Configuración en `config.json`

```json
"Dashboard": {
  "Enabled": true,
  "Url": "https://algeibapatching.vercel.app/api/upload"
}
```

WUU lee estos valores al arrancar y los expone como `$script:WUUDashboardUploadEnabled` y `$script:WUUDashboardUploadUrl`.

| Valor de `Dashboard.Enabled` | Comportamiento |
|------------------------------|----------------|
| `false` | Solo reporte local (grilla + CSV). Mensaje: *"Sincronizacion con Vercel suspendida (solo reporte local)."* |
| `true` | Envía POST al dashboard al abrir el reporte, al reintentar y en modo `-Scheduled` |

Para desactivar el envío web, poner `"Enabled": false` en `config.json` y reiniciar WUU.

#### Función `Sync-ToVercel` — pasos internos

1. Verifica `$WUUDashboardUploadEnabled` y `$WUUDashboardUploadUrl`.
2. Construye array de objetos ordenados con las 10 propiedades del reporte.
3. **Deduplica por `Servidor`** antes de serializar (evita error 500 en PostgreSQL por filas duplicadas en el mismo batch).
4. Serializa con `ConvertTo-Json -Depth 5`.
   - Corrección PowerShell 5.1: si hay un solo servidor, envuelve en `[...]` manualmente.
5. `Invoke-WebRequest` POST con timeout de **120 segundos**, TLS 1.2.
6. En éxito: muestra cantidad de servidores sincronizados (`result.count` del API).
7. En error: intenta leer el cuerpo JSON del response (`error`) para mostrar el detalle real (no solo "500 Internal Server Error").

#### Formato JSON enviado al API

Array directo (no envoltorio):

```json
[
  {
    "Dominio": "petersen.corp",
    "Servidor": "BERENROLLWEB02P",
    "IP": "10.50.89.98",
    "Sistema_Operativo": "Microsoft Windows Server 2019 Standard",
    "Version_Sistema_Operativo": "10.0.17763.5458",
    "Fecha_Instalacion": "2026-06-17",
    "KBs_Instaladas": "KB5034441, KB5036896",
    "Fecha_Reinicio": "2026-06-17 08:30:00",
    "Running_Time": "06:08:12",
    "Descripcion_Error": ""
  }
]
```

El API en producción persiste en PostgreSQL (`ServerStatus`) y puede registrar un `syncRunId` de historial. El endpoint **`/api/upload` no requiere autenticación** para permitir el envío desde la estación de parcheo.

---

### Reporte programado (modo headless)

WUU puede ejecutarse **sin interfaz** para tareas programadas de Windows:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File ".\WUU.ps1" -Scheduled
```

#### Flujo `-Scheduled`

1. Carga `config.json` y todos los servidores del CSV (todos los grupos).
2. Consulta cada servidor en paralelo (mismo `report.ps1` que el botón **Reporte**).
3. Guarda `Reportes\Reporte_YYYY-MM-DD_HH-mm-ss.csv`.
4. Sincroniza con Vercel si `Dashboard.Enabled = true`.
5. Registra en `Historial\` si `History.Enabled = true`.
6. Escribe log en `Logs\` y termina con `exit 0`.

#### Crear la tarea desde la UI

Botón **Programar** → ventana **Reporte programado**:

- Define nombre de tarea, hora y minuto diarios.
- Registra una tarea en el **Programador de tareas de Windows** que ejecuta `WUU.ps1 -Scheduled`.
- Persiste `ScheduledReport` en `config.json`.

---

### Historial acumulado

Si `History.Enabled = true` en `config.json`, cada corrida de parcheo o reporte agrega entradas en:

```
Historial/
├── Resumen_YYYY-MM.csv      # Una fila por corrida (fecha, tipo, totales)
└── Detail/
    └── YYYY-MM-DD_HH-mm-ss_Tipo.json   # Detalle por servidor
```

`RetentionDays` define cuántos días de archivos se conservan (limpieza automática).

---

### Auto-reinicio tras parcheo

Si un servidor termina en etapa `reboot` y `AutoReboot.Enabled = true`:

1. WUU espera `AutoReboot.DelaySeconds` (por defecto 60 s).
2. Ejecuta `shutdown /r /t 10` vía PsExec.
3. El operador puede cancelar desde el menú contextual (**Reiniciar servidor** cancela el countdown pendiente).

Configuración en `config.json`:

```json
"AutoReboot": {
  "Enabled": true,
  "DelaySeconds": 60
}
```

---

### Menú contextual y monitoreo post-reinicio

Clic derecho sobre una fila de la grilla principal:

| Opción | Función | Script remoto | JSON leído |
|--------|---------|---------------|------------|
| **Reiniciar servidor** | `shutdown /r /t 10` vía PsExec + monitoreo | — | — |
| **Check for Updates** | Marca `ManualCheck` e inicia `Start-ServerJob` | `worker.ps1` | `status.json` |
| **Ver historial de updates** | Últimos 200 registros del agente WU | `history.ps1` | `history.json` |
| **Log WU** | Eventos recientes del cliente WU | `wulog.ps1` | `wulog.json` |

#### Monitoreo post-reinicio — `Start-RebootMonitor`

Se activa automáticamente tras confirmar un reinicio desde el menú contextual.

```
Fase A (hasta 4 min)  → Esperar que SMB (puerto 445) deje de responder
Fase B (hasta 20 min) → Esperar que SMB vuelva a responder
Pausa 25 seg           → Margen para servicios del SO
Fase C                 → Ejecutar verify.ps1 remoto
                         Lee verify.json: available, rebootRequired
                         Actualiza fila: "Actualizado tras reinicio", etc.
```

`verify.ps1` solo **consulta** updates pendientes; no instala nada.

---

### Paralelismo, archivos remotos y temporales

#### Modelo de concurrencia

WUU usa **runspaces de PowerShell** (`runspacefactory::CreateRunspace`) con estado compartido en `[hashtable]::Synchronized`. La interfaz WPF corre en el hilo principal; los timers (`DispatcherTimer`) actualizan la grilla sin bloquearla.

| Timer | Intervalo | Función |
|-------|-----------|---------|
| `$script:Timer` | 2 s | Refresco de jobs de parcheo (`On-TimerTick`) |
| `$script:RepTimer` | 400 ms | Progreso del reporte (`On-ReportTick`) |
| `$script:RebootTimer` | 3 s | Monitoreo post-reinicio (`On-RebootTick`) |
| `$script:FixTimer` | 700 ms | Jobs de Fix (`On-FixTick`) |

#### Carpeta remota en cada servidor

Ruta absoluta: **`C:\Windows\Temp\WUU\`** (configurable vía `$script:RemoteRel = 'Windows\Temp\WUU'`).

Acceso desde WUU: `\\NOMBRE_SERVIDOR\C$\Windows\Temp\WUU\`

| Archivo remoto | Generado por | Propósito |
|----------------|--------------|-----------|
| `worker.ps1` | WUU al iniciar job de parcheo | Ciclo Windows Update |
| `status.json` | `worker.ps1` | Progreso en vivo del parcheo |
| `stop.flag` | WUU al detener | Señal de aborto seguro |
| `report.ps1` / `report.json` | Reporte | Consulta de inventario/KBs |
| `history.ps1` / `history.json` | Menú contextual | Historial WU |
| `wulog.ps1` / `wulog.json` | Menú contextual | Eventos WU |
| `verify.ps1` / `verify.json` | Post-reinicio | Verificación ligera |
| `fix.ps1` / `fix.json` | Botón Fix | Instalación .msu/.cab |
| `*.msu` / `*.cab` | WUU (copiado) | Paquete a instalar |

#### Archivos locales temporales (`%TEMP%`)

| Archivo | Contenido |
|---------|-----------|
| `WUU_worker.ps1` | Script de parcheo (generado al arrancar WUU) |
| `WUU_report.ps1` | Script de reporte |
| `WUU_history.ps1` | Script historial WU |
| `WUU_wulog.ps1` | Script log WU |
| `WUU_verify.ps1` | Script verificación post-reinicio |
| `WUU_fix.ps1` | Script instalador Fix |

Estos archivos se regeneran cada vez que se abre WUU a partir de las cadenas here-string embebidas en el script.

#### Clases de datos embebidas (C#)

| Clase | Uso |
|-------|-----|
| `ServerRow` | Fila de la grilla principal (con `INotifyPropertyChanged`) |
| `GroupItem` | Checkbox de grupo en el popup |
| `ReportRow` | Fila de la ventana de reporte |
| `HistoryRow` | Fila del historial WU (menú contextual) |
| `WuLogRow` | Fila del log WU (menú contextual) |

---

### config.json — Configuración externa

WUU lee **`config.json`** desde la misma carpeta que `WUU.ps1`. Si no existe, lo crea al primer arranque con valores por defecto embebidos en el script.

#### Archivo completo de referencia

```json
{
  "PsExecPath": "",
  "RemoteRel": "Windows\\Temp\\WUU",
  "PatchTimeoutMinutes": 90,
  "ConnectivityTimeoutSec": 3,
  "CleanupRemoteOnSuccess": true,
  "Dashboard": {
    "Enabled": true,
    "Url": "https://algeibapatching.vercel.app/api/upload"
  },
  "ScheduledReport": {
    "Enabled": false,
    "Hour": 8,
    "Minute": 0,
    "TaskName": "WUU_ReporteAutomatico"
  },
  "History": {
    "Enabled": true,
    "RetentionDays": 90
  },
  "AutoReboot": {
    "Enabled": true,
    "DelaySeconds": 60
  }
}
```

#### Descripción de campos

| Sección / campo | Descripción |
|-----------------|-------------|
| `PsExecPath` | Ruta a `PsExec.exe`. Vacío = buscar junto a `WUU.ps1` |
| `RemoteRel` | Ruta relativa a `C:\` en servidores remotos (`Windows\Temp\WUU`) |
| `PatchTimeoutMinutes` | Timeout por servidor en jobs de parcheo (default 90) |
| `ConnectivityTimeoutSec` | Timeout de conectividad SMB |
| `CleanupRemoteOnSuccess` | Eliminar archivos remotos tras parcheo exitoso |
| `Dashboard.Enabled` | Activar sincronización con Vercel |
| `Dashboard.Url` | Endpoint POST (`/api/upload`) |
| `ScheduledReport.*` | Parámetros de la tarea programada (botón **Programar**) |
| `History.Enabled` | Acumular historial en `Historial\` |
| `History.RetentionDays` | Días de retención de archivos de historial |
| `AutoReboot.Enabled` | Reiniciar automáticamente servidores en `reboot` |
| `AutoReboot.DelaySeconds` | Segundos de espera antes del reinicio |

**Importante:** WUU **no lee** otros archivos como `config1.json`. Solo `config.json` junto al script.

---

### Logging

Función `Write-Log($level, $message)`:

- Archivo: `Logs\WUU_YYYY-MM-DD_HH-mm-ss.log` (uno por sesión).
- Formato: `[YYYY-MM-DD HH:mm:ss] [LEVEL] mensaje`
- Niveles usados: `INFO`, `WARN`, `ERROR`
- Eventos registrados: inicio, carga de `config.json`, jobs de parcheo/reinicio/reporte/fix, sincronización Vercel, fin de procesos, errores no controlados.
- Handler `Dispatcher.UnhandledException` evita que WUU se cierre abruptamente ante excepciones no controladas en la UI.

---

## Dashboard web

Aplicación **Next.js 16** en `dashboard/`, desplegada en Vercel. Base de datos **PostgreSQL** (Neon) vía **Prisma**.

### Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard: métricas, gráfico de torta, tabla con búsqueda |
| `/historial` | Historial de sincronizaciones (`SyncRun`) |
| `/reportes` | Estadísticas de parcheo |
| `/usuarios` | Gestión de usuarios (admin) |
| `/login` | Autenticación por credenciales |

### API `POST /api/upload`

- Público (sin login) para recibir reportes desde WUU.
- Acepta array JSON de servidores o `{ "servers": [...] }`.
- Deduplica por `Servidor` antes del upsert.
- Persiste en tabla `ServerStatus` (clave única: `serverName`).

### Autenticación del dashboard

Middleware en `src/proxy.ts` redirige a `/login` excepto rutas públicas (`/api/upload`, `/api/auth`, assets).

Variables de entorno:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=clave-secreta-segura
```

Usuario admin inicial:

```bash
cd dashboard
npx tsx scripts/seed-admin.ts
```

---

## Instalación y uso

### WUU (estación de parcheo)

1. Colocar `WUU.ps1`, `config.json` y `PsExec.exe` en la misma carpeta.
2. Editar `config.json` (Dashboard, historial, etc.).
3. Crear `Servidores\` con el CSV de inventario.
4. (Opcional) Crear `Fix\` con paquetes `.msu` / `.cab`.
5. Ejecutar como administrador:

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\WUU.ps1"
   ```

6. Seleccionar grupos → marcar servidores → operar.

Modo programado (sin UI):

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File ".\WUU.ps1" -Scheduled
```

### Dashboard (desarrollo local)

```bash
cd dashboard
npm install
npx prisma generate
npx prisma db push
npx tsx scripts/seed-admin.ts
npm run dev
```

---

## Solución de problemas

### "Sincronizacion con Vercel suspendida (solo reporte local)"

`Dashboard.Enabled` está en `false` en `config.json`. Para enviar reportes al dashboard web, cambiar a `"Enabled": true` y reiniciar WUU.

### `Sync-ToVercel` no se reconoce como cmdlet

Ocurre si el archivo `WUU.ps1` está incompleto o desactualizado. Verificar que exista `function Sync-ToVercel` (~línea 1119). Copiar la versión completa del repositorio.

### Error 400 Bad Request al sincronizar

El API espera un **array JSON** de servidores. Verificar que `WUU.ps1` esté actualizado (no enviar objeto envoltorio `{ generatedAt, servers }`).

### Error 500 Internal Server Error al sincronizar

Causa habitual: **servidores duplicados** en el mismo envío. El script actual deduplica en grilla, reporte y `Sync-ToVercel`. Si persiste, el mensaje de error en la ventana del reporte muestra el detalle del API.

### PsExec código distinto de 0

Servidor inaccesible, credenciales insuficientes, firewall bloqueando SMB, o recurso `C$` no disponible.

### Filas del reporte con "Sin conexion o sin datos"

PsExec no pudo ejecutar `report.ps1` o no se generó `report.json`. Revisar conectividad, permisos y log en `Logs\`.

### KBs Instaladas vacías en el reporte

Normal si **no hubo parches en el mes en curso**. `Fecha Instalacion` mostrará la fecha del último hotfix histórico.

### Servidor duplicado en la grilla

El CSV tiene el mismo `Servidor` en varias filas o grupos. WUU deduplica al cargar; revisar el inventario para evitar confusiones.

### WUU no abre la ventana

El UAC fue cancelado o no se ejecutó como administrador.

---

## Herramientas de terceros

- **PsExec** — Sysinternals / Microsoft
- **WUU** — Herramienta interna Algeiba
- **Dashboard** — Next.js, Prisma, Tailwind CSS, Recharts
