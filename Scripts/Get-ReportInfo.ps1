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
    $lastBoot = $null

    $cs = Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue
    if ($cs) { $domain = $cs.Domain }

    $osInfo = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
    if ($osInfo) {
        $osCaption = $osInfo.Caption
        if ($osInfo.LastBootUpTime) {
            $lastBoot = [datetime]$osInfo.LastBootUpTime
        }
    }

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
        LastBoot    = if ($lastBoot) { $lastBoot.ToString('o') } else { $null }
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
        LastBoot    = $null
        LastInstall = $null
        KBsToday    = 'Ninguna/No detectada'
        Error       = $_.Exception.Message
    }
    $json = $fail | ConvertTo-Json -Compress
    Set-Content -LiteralPath $resultFile -Value $json -Encoding UTF8 -Force -ErrorAction SilentlyContinue
    Write-Error $_.Exception.Message
    exit 1
}
