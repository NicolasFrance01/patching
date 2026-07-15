# Instala actualizaciones ya descargadas en el equipo local (invocado por PsExec como SYSTEM).
# Escribe resultado en C:\Admin\Scripts\WU-InstallResult.json

$resultFile = 'C:\Admin\Scripts\WU-InstallResult.json'

function Write-InstallResult {
    param(
        [int]$InstalledCount = 0,
        [bool]$RebootRequired = $false,
        [string]$ErrorDescription = ''
    )
    $payload = @{
        InstalledCount   = $InstalledCount
        RebootRequired   = $RebootRequired
        ErrorDescription = $ErrorDescription
    }
    $json = $payload | ConvertTo-Json -Compress
    Set-Content -LiteralPath $resultFile -Value $json -Encoding ascii -Force
    Write-Output "WUU_RESULT_JSON:$json"
}

try {
    Remove-Item $resultFile -Force -ErrorAction SilentlyContinue

    $updateSession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', 'localhost'))
    $updateSearcher = $updateSession.CreateUpdateSearcher()
    $searchResult = $updateSearcher.Search('IsInstalled=0 and IsHidden=0')

    $updatesToInstall = @($searchResult.Updates | Where-Object { $_.IsDownloaded -eq $true })

    if ($updatesToInstall.Count -eq 0) {
        Write-InstallResult -InstalledCount 0 -RebootRequired $false
        exit 0
    }

    $installer = $updateSession.CreateUpdateInstaller()
    $installer.Updates = $updatesToInstall
    $installResult = $installer.Install()

    $installedCount = @($installResult.GetUpdateResult() | Where-Object { $_.ResultCode -eq 2 }).Count
    $rebootRequired = $false
    try { $rebootRequired = [bool]$installResult.RebootRequired } catch {}
    if (-not $rebootRequired) {
        try {
            $rebootRequired = [bool](New-Object -ComObject 'Microsoft.Update.SystemInfo').RebootRequired
        }
        catch {}
    }

    $failed = @($installResult.GetUpdateResult() | Where-Object { $_.ResultCode -ne 2 })
    $errorDescription = ''
    if ($failed.Count -gt 0) {
        $codes = ($failed | ForEach-Object { $_.ResultCode }) -join ','
        $errorDescription = "Algunas actualizaciones fallaron (codigos: $codes)"
    }

    Write-InstallResult -InstalledCount $installedCount -RebootRequired $rebootRequired -ErrorDescription $errorDescription
    if ($installedCount -eq 0 -and $updatesToInstall.Count -gt 0) { exit 1 }
    exit 0
}
catch {
    $msg = $_.Exception.Message
    Write-InstallResult -InstalledCount 0 -RebootRequired $false -ErrorDescription $msg
    exit 1
}
