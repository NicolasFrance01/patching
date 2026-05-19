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
- **Capa de observabilidad**: `WUU_Log.csv` + reporte CSV + sincronizacion JSON.

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
6. Ejecutar `Reiniciar seleccionados` cuando aplique.
7. Emitir `Reporte` para evidencia local y sincronizacion remota.

## Interfaz y semantica de estados

Botones principales:

- `Seleccionar todo`
- `Limpiar seleccion`
- `Iniciar`
- `Reiniciar seleccionados`
- `Reporte`
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

Fuentes de datos remotas:

- `Get-CimInstance Win32_ComputerSystem`: obtiene metadatos del equipo, principalmente el dominio (`Domain`) para identificar contexto AD/tenant.
- `Get-CimInstance Win32_OperatingSystem`: obtiene informacion del sistema operativo (nombre/version) y `LastBootUpTime` para calcular la fecha/hora del ultimo reinicio.
- `Get-NetIPAddress -AddressFamily IPv4`: enumera direcciones IPv4 activas para registrar conectividad de red del host en el reporte.
- `Get-HotFix`: consulta hotfixes/KBs instalados, utilizado para derivar la ultima fecha de instalacion y el conjunto de KBs instaladas en la ventana analizada.

Sincronizacion:

- Serializacion JSON del reporte y POST a endpoint dashboard (`/api/upload`), con reintentos y log de error local.

## Archivos de salida y trazabilidad

- `WUU_Log.csv`: eventos, errores y acciones por host.
- `Reportes\*.csv`: evidencia operativa por corrida.
- Archivos temporales remotos de progreso en `C:\Admin\Scripts\`.

## Conclusion

`WUU` consolida un proceso operativo complejo de patching en un marco tecnico reproducible, auditable y orientado a ejecucion masiva.  
La separacion entre orquestador, UI y scripts remotos simplifica mantenimiento, permite evolucion incremental y reduce riesgo operacional frente a ejecuciones manuales no estandarizadas.  
Para entornos de alta escala, la herramienta ofrece una base robusta para continuar optimizando concurrencia, telemetria y gobierno del ciclo de actualizaciones.
