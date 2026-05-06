# Descarga actualizaciones en el equipo local (invocado por PsExec como SYSTEM).
# Escribe progreso en C:\Admin\Scripts\WU-DownloadProgress.txt y el conteo final en WU-DownloadResult.txt

$progressFile = 'C:\Admin\Scripts\WU-DownloadProgress.txt'
$resultFile = 'C:\Admin\Scripts\WU-DownloadResult.txt'

try {
    Remove-Item $progressFile, $resultFile -Force -ErrorAction SilentlyContinue

    $updateSession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', 'localhost'))
    $updateSearcher = $updateSession.CreateUpdateSearcher()
    $searchResult = $updateSearcher.Search('IsInstalled=0 and IsHidden=0')
    $all = @($searchResult.Updates | Where-Object { $_.IsDownloaded -eq $false })
    $total = $all.Count

    if ($total -eq 0) {
        Set-Content -LiteralPath $resultFile -Value '0' -Encoding ascii
        Write-Output 0
        exit 0
    }

    $downloadedOk = 0
    $i = 0
    foreach ($u in $all) {
        $i++
        $pct = if ($total -gt 0) { [math]::Min(99, [math]::Floor(100 * ($i - 1) / $total)) } else { 0 }
        Set-Content -LiteralPath $progressFile -Value "Descarga paquete $i de $total (aprox. $pct% cola)" -Encoding ascii

        $coll = $null
        try {
            $coll = $updateSession.CreateUpdateCollection()
        }
        catch {
            $coll = New-Object -ComObject Microsoft.Update.UpdateColl
        }
        [void]$coll.Add($u)
        $downloader = $updateSession.CreateUpdateDownloader()
        $downloader.Updates = $coll
        $downloadResult = $downloader.Download()
        $ur = $downloadResult.GetUpdateResult(0)
        if ($ur.ResultCode -eq 2) {
            $downloadedOk++
        }
    }

    Set-Content -LiteralPath $progressFile -Value "Descarga finalizada ($downloadedOk de $total correctos)" -Encoding ascii
    Set-Content -LiteralPath $resultFile -Value ([string]$downloadedOk) -Encoding ascii
    Write-Output $downloadedOk
    exit 0
}
catch {
    Set-Content -LiteralPath $progressFile -Value "ERROR: $($_.Exception.Message)" -Encoding ascii -ErrorAction SilentlyContinue
    Write-Error "Error downloading updates: $($_.Exception.Message)"
    exit 1
}
