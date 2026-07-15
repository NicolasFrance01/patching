# Recolecta datos para el reporte CSV (ejecutar en el servidor remoto via PsExec).
# Escribe JSON en C:\Temp\WU-ReportInfo.json

$ErrorActionPreference = 'Stop'
$tempDir = 'C:\Temp'
$resultFile = Join-Path $tempDir 'WU-ReportInfo.json'

if (-not (Test-Path -LiteralPath $tempDir)) {
    New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
}

function Get-ReportIPv4Addresses {
    $ips = [System.Collections.Generic.List[string]]::new()
    try {
        Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
            Where-Object {
                $_.IPAddress -and
                $_.IPAddress -notlike '127.*' -and
                $_.IPAddress -notlike '169.254.*'
            } |
            ForEach-Object { [void]$ips.Add($_.IPAddress) }
    }
    catch {}

    if ($ips.Count -eq 0) {
        try {
            Get-CimInstance Win32_NetworkAdapterConfiguration -Filter 'IPEnabled=True' -ErrorAction SilentlyContinue |
                ForEach-Object {
                    foreach ($addr in @($_.IPAddress)) {
                        if ($addr -and $addr -notlike '127.*' -and $addr -notlike '169.254.*' -and $addr -match '^\d+\.\d+\.\d+\.\d+$') {
                            [void]$ips.Add($addr)
                        }
                    }
                }
        }
        catch {}
    }

    return @($ips | Select-Object -Unique)
}

try {
    $domain = $null
    $osCaption = $null
    $osVersion = $null
    $lastBoot = $null
    $runningTime = $null

    $cs = Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue
    if ($cs) { $domain = $cs.Domain }

    $osInfo = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
    if ($osInfo) {
        $osCaption = $osInfo.Caption
        if ($osInfo.LastBootUpTime) {
            $lastBoot = [datetime]$osInfo.LastBootUpTime
            $up = (Get-Date) - $lastBoot
            $runningTime = '{0:00}:{1:00}:{2:00}' -f [int]$up.TotalHours, $up.Minutes, $up.Seconds
        }
    }

    # Version del SO segun netlogon.dll (formato file version).
    try {
        $osVersion = (Get-Item -Path 'C:\Windows\System32\netlogon.dll' -ErrorAction Stop).VersionInfo.FileVersion
    }
    catch { $osVersion = $null }

    $ips = @(Get-ReportIPv4Addresses)
    $hotFixes = @(Get-HotFix -ErrorAction SilentlyContinue | Where-Object { $_.InstalledOn })

    $latestInstall = $null
    if ($hotFixes.Count -gt 0) {
        $latestInstall = ($hotFixes | Sort-Object InstalledOn -Descending | Select-Object -First 1).InstalledOn
    }

    $today = (Get-Date).Date
    $kbsToday = @(
        $hotFixes |
        Where-Object { $_.InstalledOn -and ([datetime]$_.InstalledOn).Date -ge $today } |
        Select-Object -ExpandProperty HotFixID -Unique
    )

    $payload = [ordered]@{
        Domain      = if ($domain) { [string]$domain } else { 'N/A' }
        IP          = if ($ips.Count -gt 0) { ($ips -join ', ') } else { 'N/A' }
        OS          = if ($osCaption) { [string]$osCaption } else { 'N/A' }
        OSVersion   = if ($osVersion) { [string]$osVersion } else { 'N/A' }
        LastBoot    = if ($lastBoot) { $lastBoot.ToString('o') } else { $null }
        RunningTime = if ($runningTime) { [string]$runningTime } else { 'N/A' }
        LastInstall = if ($latestInstall) { ([datetime]$latestInstall).ToString('o') } else { $null }
        KBsToday    = if ($kbsToday.Count -gt 0) { ($kbsToday -join ', ') } else { 'Ninguna/No detectada' }
    }

    $json = $payload | ConvertTo-Json -Compress
    Set-Content -LiteralPath $resultFile -Value $json -Encoding UTF8 -Force
    Write-Output "WUU_REPORT_JSON:$json"
    exit 0
}
catch {
    $fail = [ordered]@{
        Domain      = 'N/A'
        IP          = 'N/A'
        OS          = 'N/A'
        OSVersion   = 'N/A'
        LastBoot    = $null
        RunningTime = 'N/A'
        LastInstall = $null
        KBsToday    = 'Ninguna/No detectada'
        Error       = $_.Exception.Message
    }
    $json = $fail | ConvertTo-Json -Compress
    Set-Content -LiteralPath $resultFile -Value $json -Encoding UTF8 -Force -ErrorAction SilentlyContinue
    Write-Error $_.Exception.Message
    exit 1
}
