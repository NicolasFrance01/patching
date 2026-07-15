# Preparacion del agente Windows Update (equipo local; invocado remotamente via PsExec).
# Detiene servicios, limpia cache de descargas, reinicia servicios y aplica politicas de grupo.

try {
    Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
    Stop-Service bits -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    if (Test-Path 'C:\Windows\SoftwareDistribution') {
        Remove-Item 'C:\Windows\SoftwareDistribution' -Recurse -Force -ErrorAction SilentlyContinue
    }

    Start-Service wuauserv -ErrorAction SilentlyContinue
    Start-Service bits -ErrorAction SilentlyContinue
    $null = Start-Process -FilePath 'gpupdate.exe' -ArgumentList '/force' -WindowStyle Hidden -Wait -ErrorAction SilentlyContinue

    exit 0
}
catch {
    exit 1
}
