# Reparacion del agente Windows Update / WSUS (equipo local; invocado remotamente).
# Detiene servicios, limpia cache de descargas, reinicia servicios y fuerza re-registro/deteccion en WSUS.

try {
    Stop-Service wuauserv, bits, cryptsvc -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    if (Test-Path 'C:\Windows\SoftwareDistribution') {
        Remove-Item 'C:\Windows\SoftwareDistribution' -Recurse -Force -ErrorAction SilentlyContinue
    }

    Start-Service cryptsvc -ErrorAction SilentlyContinue
    Start-Service bits -ErrorAction SilentlyContinue
    Start-Service wuauserv -ErrorAction SilentlyContinue

    $uso = Join-Path $env:windir 'System32\UsoClient.exe'
    if (Test-Path $uso) {
        Start-Process -FilePath $uso -ArgumentList 'RefreshSettings' -WindowStyle Hidden -Wait -ErrorAction SilentlyContinue
    }

    $wuau = Join-Path $env:windir 'System32\wuauclt.exe'
    if (Test-Path $wuau) {
        $null = Start-Process -FilePath $wuau -ArgumentList @('/resetauthorization', '/detectnow') -WindowStyle Hidden -Wait -ErrorAction SilentlyContinue
    }
    $null = Start-Process -FilePath 'gpupdate.exe' -ArgumentList '/force' -WindowStyle Hidden -Wait -ErrorAction SilentlyContinue

    exit 0
}
catch {
    exit 1
}
