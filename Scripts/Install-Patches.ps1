# Install-Patches.ps1
# Script to install downloaded Windows Updates remotely

try {
    $updateSession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', 'localhost'))
    $updateSearcher = $updateSession.CreateUpdateSearcher()
    $searchResult = $updateSearcher.Search('IsInstalled=0 and IsHidden=0')

    $updatesToInstall = $searchResult.Updates | Where-Object { $_.IsDownloaded -eq $true }

    if ($updatesToInstall.Count -gt 0) {
        $installer = $updateSession.CreateUpdateInstaller()
        $installer.Updates = $updatesToInstall
        $installResult = $installer.Install()

        # Count installed updates
        $installedCount = ($installResult.GetUpdateResult() | Where-Object { $_.ResultCode -eq 2 }).Count
        Write-Output $installedCount
    } else {
        Write-Output 0
    }
} catch {
    Write-Error "Error installing updates: $($_.Exception.Message)"
    exit 1
}