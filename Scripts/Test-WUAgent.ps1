# Prueba rapida del agente Windows Update / WSUS (ejecutar en el equipo destino como SYSTEM via PsExec).
# Codigos de salida: 0 = operativo, 2 = servicios WU/BITS no en ejecucion, 3 = fallo COM o busqueda de actualizaciones.

try {
    $wuSt = (Get-Service wuauserv -ErrorAction SilentlyContinue).Status
    $bitsSt = (Get-Service bits -ErrorAction SilentlyContinue).Status
    if ($wuSt -ne 'Running' -or $bitsSt -ne 'Running') {
        exit 2
    }
    $sess = New-Object -ComObject Microsoft.Update.Session
    $searcher = $sess.CreateUpdateSearcher()
    [void]$searcher.Search('IsInstalled=0 and IsHidden=0')
    exit 0
}
catch {
    exit 3
}
