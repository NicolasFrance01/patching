# WUU - Windows Update Utility

## Introduccion

`WUU` es una utilidad de automatizacion de patching para infraestructura Windows, implementada en PowerShell con interfaz WPF.  
Su objetivo es orquestar, desde un unico punto de control, el ciclo tecnico completo de actualizacion en servidores remotos: descubrimiento de updates, descarga, instalacion, validacion de reinicio, remediacion del agente WU/WSUS y generacion de evidencia operativa.

La herramienta esta orientada a escenarios corporativos donde se requiere:

- Ejecucion masiva y controlada por grupos de servidores.
- Trazabilidad de acciones y errores por host.
- Operacion no interactiva en equipos remotos usando `PsExec` y contexto `SYSTEM`.
- Integracion con un dashboard via API para consolidacion de reportes.

## Arquitectura funcional

- **Capa de orquestacion**: `WUU.ps1`.
- **Capa de interfaz**: `WUU.xaml` y `OUPicker.xaml`.
- **Capa de ejecucion remota**: scripts en `Scripts\`.
- **Capa de parches especiales**: carpeta `Update Especial\` + `Scripts\Install-SpecialUpdate.ps1`.
- **Capa de observabilidad**: `WUU_Log.csv` + reporte CSV + sincronizacion JSON al dashboard.

## Requisitos tecnicos

- Windows PowerShell con soporte WPF.
- Ejecucion en `STA`.
- Credenciales administrativas sobre equipos destino.
- `PsExec.exe` en la misma carpeta que `WUU.ps1`.
- Conectividad de red (DNS, SMB admin share, RPC/WinRM segun accion).
- Politicas de seguridad que permitan operaciones WU remotas.

## Flujo operativo estandar

1. Ejecutar:

```powershell
powershell.exe -STA -File .\WUU.ps1
```

2. Recargar grupos desde `Servidores\*.csv`.
3. Seleccionar grupo y validar carga de hosts en grilla.
4. Marcar servidores objetivo (`Sel`).
5. Ejecutar `Iniciar` para ciclo de actualizacion.
6. (Opcional) Ejecutar `Update Especial` para instalar un KB/paquete puntual desde `Update Especial\`.
7. Ejecutar `Reiniciar seleccionados` cuando aplique.
8. Emitir `Reporte` para evidencia local y sincronizacion remota.

## Interfaz y semantica de estados

Botones principales:

- `Seleccionar todo`
- `Limpiar seleccion`
- `Iniciar`
- `Reiniciar seleccionados`
- `Reporte`
- `Update Especial` (habilitado solo si `Update Especial\` contiene paquetes `.msu`, `.cab` o `.exe`)
- `Recargar grupos`
- `Detener y refrescar`

Codigo de colores por fila:

- `Khaki`: chequeo WSUS/WU.
- `Orange`: remediacion de agente WU.
- `LightSkyBlue`: descarga/instalacion.
- `Orange` parpadeante: reinicio requerido.
- `LightGreen`: actualizado.
- `LightGray`: no seleccionado.

## Funcionamiento tecnico de cada script

### `WUU.ps1` (motor principal)

Responsabilidades:

- Inicializa entorno (`Admin`, `STA`, dependencias de scripts y `PsExec`).
- Carga XAML y enlaza eventos de UI.
- Gestiona lista de servidores, counters y estados visuales.
- Ejecuta acciones asincronas por servidor mediante runspaces.
- Orquesta pipeline de patching, reinicios, reportes y manejo de errores.
- Implementa funciones de control operacional (`Detener y refrescar`, habilitado/deshabilitado de acciones, confirmaciones).

Pipeline base de `Iniciar` por servidor seleccionado:

1. `PrepareWUAgentBeforeCheck`
2. `GetUpdates`
3. `MaybeAutoDownloadAfterInitialCheck`
4. `SetUpdatesStatus`

### `WUU.xaml` (interfaz principal)

Define:

- Disposicion de controles y columnas de grilla.
- Estilos visuales por estado (`Phase`, `IsChecked`).
- Leyenda de colores y panel de contadores operativos.

### `OUPicker.xaml` (selector AD)

Ventana auxiliar para:

- Navegar OUs de Active Directory.
- Seleccionar OU origen para importacion de equipos habilitados.

### `Scripts\Test-WUAgent.ps1`

Objetivo:

- Verificar salud basica del stack Windows Update en host remoto.

Validaciones:

- Estado de servicios `wuauserv` y `bits`.
- Creacion de sesion COM `Microsoft.Update.Session`.
- Ejecucion de busqueda de updates.

Codigos de salida:

- `0`: operativo.
- `2`: servicios no running.
- `3`: error COM o consulta WU.

### `Scripts\Repair-WUAgent.ps1`

Objetivo:

- Remediar fallas frecuentes del agente WU/WSUS.

Acciones:

- Stop de `wuauserv`, `bits`, `cryptsvc`.
- Limpieza de `SoftwareDistribution`.
- Start de servicios.
- Refresco de deteccion/politicas (`UsoClient`, `wuauclt`, `gpupdate`).

### `Scripts\Download-Patches.ps1`

Objetivo:

- Descargar updates pendientes en el host remoto.

Funcionamiento:

- Consulta updates no instaladas/no ocultas.
- Filtra las no descargadas.
- Descarga por lote unitario para tracking estable.
- Publica progreso y resultado en:
  - `C:\Admin\Scripts\WU-DownloadProgress.txt`
  - `C:\Admin\Scripts\WU-DownloadResult.txt`

### `Scripts\Install-Patches.ps1`

Objetivo:

- Instalar updates previamente descargadas.

Funcionamiento:

- Filtra `IsDownloaded = true`.
- Ejecuta instalador COM (`CreateUpdateInstaller().Install()`).
- Devuelve conteo de instalaciones exitosas y expone error ante excepcion.

### `Scripts\Install-SpecialUpdate.ps1`

Objetivo:

- Instalar un paquete puntual copiado previamente en `C:\Temp` del servidor remoto.

Funcionamiento:

- Lee el nombre del paquete desde `C:\Temp\WU-SpecialPackageName.txt`.
- Instala segun extension:
  - `.msu` → `wusa.exe /quiet /norestart`
  - `.cab` → `dism /Online /Add-Package`
  - `.exe` → instalador silencioso (`/quiet /norestart`)
- Publica progreso en `C:\Temp\WU-SpecialProgress.txt` (formato `porcentaje|mensaje`).
- Escribe resultado JSON en `C:\Temp\WU-SpecialResult.txt`.

### `Scripts\Get-ReportInfo.ps1`

Objetivo:

- Recolectar metadatos del host remoto para el reporte CSV.

Funcionamiento:

- Consulta dominio, SO, IPs IPv4 (excluye loopback y APIPA), ultimo reinicio, ultima fecha de hotfix y KBs instaladas hoy.
- Usa respaldo WMI (`Win32_NetworkAdapterConfiguration`) si `Get-NetIPAddress` no esta disponible.
- Escribe JSON en `C:\Temp\WU-ReportInfo.json`.

## Update Especial

Carpeta de entrada:

- `Update Especial\` (colocar aqui el paquete a desplegar, por ejemplo `KB5034123-x64.msu`).

Flujo desde la UI:

1. Marcar servidores en la grilla (`Sel`).
2. Clic en `Update Especial` (o menu contextual **Update Especial**).
3. Si hay varios paquetes en la carpeta, seleccionar uno en el dialogo.
4. Por cada servidor:
   - **0–50%** en columna `Download %`: copia del paquete a `C:\Temp` (crea la carpeta si no existe).
   - **50–100%**: instalacion remota via PsExec.
5. Al finalizar, la fila queda en verde (`Updated`) o naranja parpadeante si requiere reinicio.

Notas:

- El boton permanece **deshabilitado** mientras `Update Especial\` este vacia.
- Requiere los mismos permisos que el resto de WUU (`\\servidor\C$` + PsExec).

## Reporte tecnico

Salida local:

- `Reportes\Reporte_Instalacion_KBs_yyyyMMdd_HHmm.csv`

Campos:

- `Dominio`
- `Servidor`
- `IP`
- `Sistema_Operativo`
- `Fecha_Instalacion`
- `KBs_Instaladas`
- `Fecha_Reinicio`
- `Descripcion_Error`

Recoleccion de datos (`Get-RemoteReportInfo` en `WUU.ps1`):

1. **Intento WinRM** (`Invoke-Command`) si el host responde y WinRM esta habilitado.
2. **Respaldo PsExec** (recomendado en entornos corporativos): ejecuta `Scripts\Get-ReportInfo.ps1` y lee `C:\Temp\WU-ReportInfo.json` via recurso administrativo.

Fuentes de datos en el servidor remoto:

- `Win32_ComputerSystem` → dominio.
- `Win32_OperatingSystem` → sistema operativo y `LastBootUpTime` (ultimo reinicio).
- `Get-NetIPAddress` / WMI → direcciones IPv4 (sin `127.x` ni APIPA).
- `Get-HotFix` → ultima fecha de instalacion y KBs instaladas **el dia de la corrida**.

Campos del reporte:

| Campo | Descripcion |
|-------|-------------|
| `Fecha_Instalacion` | Fecha del hotfix mas reciente instalado en el servidor |
| `KBs_Instaladas` | KBs cuya fecha de instalacion es **hoy** (si no hubo parches hoy: `Ninguna/No detectada`) |
| `Fecha_Reinicio` | Fecha/hora del ultimo arranque (`LastBootUpTime`) |

Sincronizacion con dashboard:

- Endpoint por defecto: `https://algeibapatching.vercel.app/api/upload`
- Payload JSON en formato **array** de objetos (un elemento por servidor).
- Reintentos automaticos y registro en `WUU_Log.csv` (`DashboardUpload`).
- Configuracion opcional en `WUU_Upload.config.json` (copiar desde `WUU_Upload.config.example.json`):

```json
{
  "DashboardUrl": "https://algeibapatching.vercel.app/api/upload",
  "VercelProtectionBypass": "SECRET_DE_VERCEL_DEPLOYMENT_PROTECTION",
  "UploadApiKey": ""
}
```

Si la sincronizacion falla por red corporativa (timeout/403), el **CSV local se genera igualmente** en `Reportes\`.

## Estructura de carpetas

```
ScriptAutomatization\
├── WUU.ps1
├── WUU.xaml
├── OUPicker.xaml
├── PsExec.exe
├── WUU_Log.csv
├── WUU_Upload.config.json          (opcional, ver ejemplo)
├── WUU_Upload.config.example.json
├── Servidores\                     (*.csv de grupos)
├── Update Especial\                (paquetes .msu / .cab / .exe)
├── Reportes\                       (CSV generados)
├── Scripts\
│   ├── Test-WUAgent.ps1
│   ├── Repair-WUAgent.ps1
│   ├── Download-Patches.ps1
│   ├── Install-Patches.ps1
│   ├── Install-SpecialUpdate.ps1
│   └── Get-ReportInfo.ps1
└── dashboard\                      (app web Next.js)
```

## Archivos de salida y trazabilidad

- `WUU_Log.csv`: eventos, errores y acciones por host.
- `Reportes\*.csv`: evidencia operativa por corrida.
- Archivos temporales remotos:
  - `C:\Admin\Scripts\` (descarga/instalacion WU estandar).
  - `C:\Temp\` (Update Especial y metadatos de reporte).

## Conclusion

`WUU` consolida un proceso operativo complejo de patching en un marco tecnico reproducible, auditable y orientado a ejecucion masiva.  
La separacion entre orquestador, UI y scripts remotos simplifica mantenimiento, permite evolucion incremental y reduce riesgo operacional frente a ejecuciones manuales no estandarizadas.  
Para entornos de alta escala, la herramienta ofrece una base robusta para continuar optimizando concurrencia, telemetria y gobierno del ciclo de actualizaciones.
