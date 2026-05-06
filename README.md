# PowerShell Windows Update Utility (WUU)

## Descripción general

`WUU` es una utilidad gráfica desarrollada en PowerShell (WPF/XAML) para administrar Windows Update en equipos remotos desde una única consola.

La herramienta permite:
- Cargar equipos manualmente, desde archivo o desde Active Directory.
- Consultar, descargar e instalar actualizaciones de forma remota.
- Reiniciar equipos y refrescar su estado operativo.
- Ejecutar diagnóstico y reparación del agente de Windows Update.
- Exportar listas y reportes operativos en formato CSV.

## Características principales

- Interfaz gráfica basada en `WUU.xaml`, con menú principal y menú contextual.
- Ejecución remota en paralelo mediante runspaces para mejorar tiempos de operación.
- Integración con `PsExec` para acciones remotas específicas.
- Registro estructurado de eventos en `WUU_Log.csv`.
- Exportación de reporte detallado de instalación por servidor.

## Estructura del proyecto

- `WUU.ps1`: script principal (carga UI, eventos, runspaces y lógica operativa).
- `WUU.xaml`: interfaz principal de la aplicación.
- `OUPicker.xaml`: selector de OU para carga de equipos desde AD.
- `Scripts/Download-Patches.ps1`: descarga remota de parches.
- `Scripts/Install-Patches.ps1`: instalación remota de parches.
- `Scripts/Test-WUAgent.ps1`: validación del agente Windows Update/WSUS.
- `Scripts/Repair-WUAgent.ps1`: reparación del agente Windows Update cuando la validación falla.
- `Automatización.xlsm`: plantilla operativa para preparar/gestionar la carga de equipos del proceso.
- `Servers.txt`: archivo opcional de entrada para importar equipos.

## Requisitos

- Windows PowerShell con soporte WPF.
- Ejecución del script en modo `STA`.
- Consola PowerShell abierta como administrador.
- `PsExec.exe` en la misma carpeta que `WUU.ps1`.
- Permisos administrativos sobre los equipos remotos.
- Conectividad de red y resolución DNS hacia los equipos destino.
- WinRM habilitado para funciones que utilizan `Invoke-Command`.

## Inicio rápido

1. Abrir PowerShell como administrador.
2. Ir a la carpeta del proyecto.
3. Validar que `Automatización.xlsm` esté disponible en la carpeta de trabajo (si aplica al proceso del equipo).
4. Ejecutar el script principal:

```powershell
powershell.exe -STA -File .\WUU.ps1
```

Al iniciar, la aplicación valida elevación, compatibilidad con WPF y dependencias críticas.

## Flujo recomendado de operación

1. Preparar la lista objetivo en `Automatización.xlsm` y exportarla (si corresponde) a formato de carga.
2. Agregar equipos con `Add Computers`, `Add Computers From File` o `Add Computers From AD`.
3. Seleccionar los equipos en la grilla.
4. Ejecutar `Check For Updates`.
5. Ejecutar `Download Updates`.
6. Ejecutar `Install Updates`.
7. Reiniciar con `Restart Computer` cuando sea necesario.
8. Exportar resultados con `Export Detailed Report (CSV)`.

## Acciones disponibles en la UI

- `Add Computers`: agrega equipos por ingreso manual.
- `Add Computers From AD`: importa equipos desde Active Directory.
- `Add Computers From File`: importa equipos desde archivos `.txt` o `.csv`.
- `Export Computer List`: exporta la lista actual de equipos.
- `Clear Computer List`: limpia la grilla de equipos.
- `Remove Offline Computers`: elimina equipos sin conectividad.
- `Check For Updates`: consulta actualizaciones disponibles.
- `Download Updates`: descarga parches en equipos remotos.
- `Install Updates`: instala parches descargados.
- `Restart Computer`: reinicia el equipo remoto.
- `Windows Update Service`: iniciar, detener o reiniciar `wuauserv`.
- `Show Available Updates`: muestra actualizaciones detectadas.
- `Show Installed Updates`: muestra actualizaciones instaladas.
- `Show Update History`: muestra historial de actualizaciones.
- `View Windows Update Log`: visualiza log de Windows Update.
- `Report Status to WSUS`: ejecuta reporte de estado al WSUS.
- `View ErrorLog`: muestra errores capturados por la herramienta.
- `Export Detailed Report (CSV)`: genera un CSV de instalación por equipo.

## Archivos generados

- `WUU_Log.csv`: bitácora de acciones con fecha/hora, equipo, acción y resultado.
- `Reportes\Reporte_Instalacion_KBs_yyyyMMdd_HHmm.csv`: reporte detallado de instalación por equipo.

Notas:
- La carpeta `Reportes` se crea automáticamente junto a `WUU.ps1` si no existe.
- El reporte se guarda automáticamente en esa carpeta (sin diálogo de selección de ruta).

## Formato del reporte CSV

El reporte detallado exporta, como mínimo, las siguientes columnas:
- `Dominio`
- `Servidor`
- `IP`
- `Sistema_Operativo`
- `Fecha_Instalacion`
- `KBs_Instaladas`
- `Errores_Instalacion`

## Solución de problemas

- Verificar que `PsExec.exe` exista en la carpeta raíz del proyecto.
- Validar resolución DNS y conectividad hacia los equipos remotos.
- Confirmar permisos administrativos y políticas de ejecución remota.
- Revisar `WUU_Log.csv` para identificar errores por equipo y operación.
- Si una acción no retorna resultados, repetir `Check For Updates` antes de descargar o instalar.

## Consideraciones operativas

- El comportamiento remoto puede variar por GPO, firewall y hardening de cada servidor.
- Algunas operaciones dependen de servicios de Windows Update disponibles y en estado correcto.
- Los tiempos de ejecución dependen de conectividad, carga del equipo remoto y volumen de parches.

## Mantenimiento

Si se extiende la herramienta, se recomienda mantener alineados:
- `WUU.ps1` (lógica y eventos).
- `WUU.xaml` (controles y acciones de UI).
- `README.md` (documentación funcional y operativa).
