<#
.SYNOPSIS
This script provides a GUI for remotely managing Windows Updates.

.DESCRIPTION
This script provides a GUI for remotely managing Windows Updates. You can check for, download, and install updates remotely. Restart must be triggered manually from the context menu when required.

.EXAMPLE
.\WUU.ps1

This example open the Windows Update Utility.

.NOTES
Author: Tyler Siegrist
Date: 12/14/2016

This script needs to be run as an administrator with the credentials of an administrator on the remote computers.

There is limited feedback on the download and install processes due to Microsoft restricting the ability to remotely download or install Windows Updates. This is done by using psexec to run a script locally on the remote machine.
#>

#region Synchronized collections
$uiHash = [hashtable]::Synchronized(@{ })
$runspaceHash = [hashtable]::Synchronized(@{ })
$jobs = [system.collections.arraylist]::Synchronized((New-Object System.Collections.ArrayList))
$jobCleanup = [hashtable]::Synchronized(@{ })
$updatesHash = [hashtable]::Synchronized(@{ })
$selectedComputersSet = [hashtable]::Synchronized(@{ })
$pendingRebootSet = [hashtable]::Synchronized(@{ })
#endregion Synchronized collections

$ScriptRoot = Split-Path -Path $PSCommandPath -Parent
$PsExecPath = Join-Path $ScriptRoot 'PsExec.exe'
$LogFile = Join-Path $ScriptRoot 'WUU_Log.csv'
$groupServersHash = [hashtable]::Synchronized(@{ })

function Invoke-PsExec {
    param(
        [Parameter(Mandatory)] [string]$Computer,
        [Parameter(Mandatory)] [string]$Command,
        [string]$ErrorMessage = 'PsExec failed'
    )
    $result = & $PsExecPath -accepteula -nobanner -s "\\$Computer" 'cmd.exe' '/c' $Command
    if ($LASTEXITCODE -ne 0) {
        throw "$ErrorMessage. Exit code $LASTEXITCODE"
    }
    return $result
}

function Update-Status {
    param(
        [Parameter(Mandatory)] $Computer,
        [Parameter(Mandatory)] [string]$Text,
        [ValidateSet('Normal', 'Background')] [string]$Priority = 'Background'
    )
    $uiHash.ListView.Dispatcher.Invoke($Priority, [action] {
            $uiHash.Listview.Items.EditItem($Computer)
            $Computer.Status = $Text
            $uiHash.Listview.Items.CommitEdit()
            $uiHash.Listview.Items.Refresh()
        })
}

function Write-Log {
    param(
        [Parameter(Mandatory)] [string]$Computer,
        [Parameter(Mandatory)] [string]$Action,
        [Parameter(Mandatory)] [string]$Result,
        [string]$Details = ''
    )
    $logEntry = [PSCustomObject]@{
        Timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        Computer  = $Computer
        Action    = $Action
        Result    = $Result
        Details   = $Details
    }
    $logEntry | Export-Csv -Path $LogFile -Append -NoTypeInformation
}

function Set-ComputerUpdatesStatus {
    param($Computer)
    $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
            $uiHash.Listview.Items.EditItem($Computer)
            if ($Computer.Available -gt 0) {
                $Computer.UpdatesStatus = 'Updates required'
            }
            elseif ($Computer.RebootRequired) {
                $Computer.UpdatesStatus = 'Reboot required'
            }
            else {
                $Computer.UpdatesStatus = 'All updates installed'
            }
            $uiHash.Listview.Items.CommitEdit()
            $uiHash.Listview.Items.Refresh()
        })
}

function Set-ComputerPhase {
    param(
        [Parameter(Mandatory)] $Computer,
        [Parameter(Mandatory)] [string]$Phase
    )
    $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
            $uiHash.Listview.Items.EditItem($Computer)
            $Computer.Phase = $Phase
            $uiHash.Listview.Items.CommitEdit()
            $uiHash.Listview.Items.Refresh()
        })
}

function Get-CheckedComputers {
    return @($uiHash.Listview.Items | Where-Object { $_.IsChecked -eq $true })
}

function Ensure-ComputerRunspace {
    param([Parameter(Mandatory)]$Computer)
    if ($null -ne $Computer.Runspace) {
        try {
            if ($Computer.Runspace.RunspaceStateInfo.State -eq 'Opened') {
                return
            }
            $Computer.Runspace.Dispose()
        }
        catch {}
        $Computer.Runspace = $null
    }
    $newRunspace = [runspacefactory]::CreateRunspace()
    $newRunspace.ApartmentState = "STA"
    $newRunspace.ThreadOptions = "ReuseThread"
    $newRunspace.Open()
    $newRunspace.SessionStateProxy.SetVariable("uiHash", $uiHash)
    $newRunspace.SessionStateProxy.SetVariable("updatesHash", $updatesHash)
    $newRunspace.SessionStateProxy.SetVariable("path", $ScriptRoot)
    $newRunspace.SessionStateProxy.SetVariable("ScriptRoot", $ScriptRoot)
    $newRunspace.SessionStateProxy.SetVariable("PsExecPath", $PsExecPath)
    $newRunspace.SessionStateProxy.SetVariable("selectedComputersSet", $selectedComputersSet)
    $newRunspace.SessionStateProxy.SetVariable("pendingRebootSet", $pendingRebootSet)
    $newRunspace.SessionStateProxy.SetVariable("UpdateCountersUiScript", $UpdateCountersUiScript)
    $newRunspace.SessionStateProxy.SetVariable('DownloadUpdates', $DownloadUpdates)
    $newRunspace.SessionStateProxy.SetVariable('GetUpdates', $GetUpdates)
    $newRunspace.SessionStateProxy.SetVariable('SetUpdatesStatus', $SetUpdatesStatus)
    $newRunspace.SessionStateProxy.SetVariable('InstallUpdates', $InstallUpdates)
    $newRunspace.SessionStateProxy.SetVariable('RestartComputer', $RestartComputer)
    $newRunspace.SessionStateProxy.SetVariable('MaybeAutoDownloadAfterInitialCheck', $MaybeAutoDownloadAfterInitialCheck)
    $Computer.Runspace = $newRunspace
}

function Sync-ComputerCounters {
    param([Parameter(Mandatory)]$Computer)
    $key = [string]$Computer.Computer
    if ([string]::IsNullOrWhiteSpace($key)) { return }
    if ($Computer.IsChecked) {
        $selectedComputersSet[$key] = $true
        if ($Computer.RebootRequired) {
            $pendingRebootSet[$key] = $true
        }
        else {
            $pendingRebootSet.Remove($key) | Out-Null
        }
    }
    else {
        $selectedComputersSet.Remove($key) | Out-Null
        $pendingRebootSet.Remove($key) | Out-Null
    }
}

function Remove-ComputerFromCounters {
    param([Parameter(Mandatory)][string]$ComputerName)
    $selectedComputersSet.Remove($ComputerName) | Out-Null
    $pendingRebootSet.Remove($ComputerName) | Out-Null
}

function Update-CounterSetsForComputer {
    param([Parameter(Mandatory)]$Computer)
    $key = [string]$Computer.Computer
    if ([string]::IsNullOrWhiteSpace($key)) { return }
    if ($Computer.IsChecked) {
        $selectedComputersSet[$key] = $true
        if ($Computer.RebootRequired) {
            $pendingRebootSet[$key] = $true
        }
        else {
            $pendingRebootSet.Remove($key) | Out-Null
        }
    }
    else {
        $selectedComputersSet.Remove($key) | Out-Null
        $pendingRebootSet.Remove($key) | Out-Null
    }
}

$UpdateCountersUiScript = {
    if (-not $uiHash.Window -or -not $uiHash.Listview -or -not $uiHash.RestartSelectedButton -or -not $uiHash.StartButton) {
        return
    }
    $dispatcher = $uiHash.Window.Dispatcher

    $selectedCount = 0
    try { $selectedCount = [int]$selectedComputersSet.Count } catch {}
    $pendingCount = 0
    try { $pendingCount = [int]$pendingRebootSet.Count } catch {}
    $isRefreshing = $false
    try { $isRefreshing = [bool]$uiHash.IsRefreshing } catch {}
    $uiRef = $uiHash

    $refreshAction = [action] {
        try {
            if ($uiRef.UpdateTargetsTextBlock) {
                $uiRef.UpdateTargetsTextBlock.Text = "Cantidad de servidores para actualizar: $selectedCount"
                if ($selectedCount -gt 0) {
                    $uiRef.UpdateTargetsTextBlock.Foreground = 'DarkGreen'
                }
                else {
                    $uiRef.UpdateTargetsTextBlock.Foreground = 'DimGray'
                }
            }
        }
        catch {}
        try {
            if ($uiRef.PendingRebootTextBlock) {
                $uiRef.PendingRebootTextBlock.Text = "Servidores con reinicio pendiente: $pendingCount"
                if ($pendingCount -gt 0) {
                    $uiRef.PendingRebootTextBlock.Foreground = 'DarkOrange'
                }
                else {
                    $uiRef.PendingRebootTextBlock.Foreground = 'DimGray'
                }
            }
        }
        catch {}
        try {
            $startBtn = $uiRef.StartButton
            $restartBtn = $uiRef.RestartSelectedButton
            if ($isRefreshing) {
                if ($startBtn) { try { $startBtn.IsEnabled = $false } catch {} }
                if ($restartBtn) { try { $restartBtn.IsEnabled = $false } catch {} }
            }
            else {
                if ($startBtn) { try { $startBtn.IsEnabled = ($selectedCount -gt 0) } catch {} }
                if ($restartBtn) { try { $restartBtn.IsEnabled = ($pendingCount -gt 0) } catch {} }
            }
        }
        catch {}
    }
    try {
        if ($dispatcher.CheckAccess()) {
            $refreshAction.Invoke()
        }
        else {
            $null = $dispatcher.BeginInvoke([System.Windows.Threading.DispatcherPriority]::Background, $refreshAction)
        }
    }
    catch [System.InvalidOperationException] {
        try {
            $null = $dispatcher.BeginInvoke([System.Windows.Threading.DispatcherPriority]::ApplicationIdle, $refreshAction)
        }
        catch {
            # Ignore transient dispatcher suspension during window initialization.
        }
    }
}

function Update-RestartSelectedButtonState {
    & $UpdateCountersUiScript
}

function Set-MainActionControlsEnabled {
    param(
        [Parameter(Mandatory)][bool]$Enabled,
        [bool]$KeepStopEnabled = $true
    )
    $controls = @(
        $uiHash.GroupComboBox,
        $uiHash.SelectAllButton,
        $uiHash.ClearSelectionButton,
        $uiHash.StartButton,
        $uiHash.RestartSelectedButton,
        $uiHash.ReportButton,
        $uiHash.ReloadGroupsButton
    )
    foreach ($control in $controls) {
        if ($control) {
            $control.IsEnabled = $Enabled
        }
    }
    if ($uiHash.StopRefreshButton) {
        $uiHash.StopRefreshButton.IsEnabled = if ($KeepStopEnabled) { $true } else { $Enabled }
    }
}

function Get-GroupData {
    $servFolder = Join-Path $ScriptRoot 'Servidores'
    $groupServersHash.Clear()
    if (-not (Test-Path -Path $servFolder)) {
        return @()
    }

    $allRows = @()
    foreach ($csv in (Get-ChildItem -Path $servFolder -Filter '*.csv' -File -ErrorAction SilentlyContinue)) {
        try {
            $lines = @(Get-Content -Path $csv.FullName -ErrorAction Stop | Where-Object { $_ -and $_.Trim() })
            if ($lines.Count -lt 2) {
                continue
            }

            # Avoid Import-Csv header collisions (duplicate column names in source files).
            $dataLines = @($lines | Select-Object -Skip 1)
            $maxCols = ($dataLines | ForEach-Object { ($_ -split ';').Count } | Measure-Object -Maximum).Maximum
            if (-not $maxCols -or $maxCols -lt 5) {
                continue
            }
            $headers = 1..$maxCols | ForEach-Object { "Col$_" }
            $rows = @($dataLines | ConvertFrom-Csv -Delimiter ';' -Header $headers)

            foreach ($row in $rows) {
                $groupValue = [string]$row.Col1
                $serverValue = [string]$row.Col5
                if (-not [string]::IsNullOrWhiteSpace($groupValue) -and -not [string]::IsNullOrWhiteSpace($serverValue)) {
                    $allRows += [PSCustomObject]@{
                        Grupo    = $groupValue.Trim()
                        Servidor = $serverValue.Trim()
                    }
                }
            }
        }
        catch {
            Write-Log -Computer 'LOCAL' -Action 'Get-GroupData' -Result 'Error' -Details "No se pudo leer $($csv.FullName): $($_.Exception.Message)"
        }
    }

    $groups = @($allRows | Where-Object { $_.Grupo -and $_.Servidor } | Select-Object -ExpandProperty Grupo -Unique | Sort-Object)
    foreach ($groupName in $groups) {
        $servers = @(
            $allRows |
            Where-Object { $_.Grupo -eq $groupName -and $_.Servidor } |
            Select-Object -ExpandProperty Servidor -Unique |
            ForEach-Object { $_.Trim() } |
            Where-Object { $_ }
        )
        $groupServersHash[$groupName] = $servers
    }
    return $groups
}

#region Environment validation
#Validate user is an Administrator
Write-Verbose 'Checking Administrator credentials.'
If (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "This script must be elevated!`nNow attempting to elevate."
    Start-Process -Verb 'Runas' -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList "-STA -noprofile -WindowStyle Hidden -file `"$PSCommandPath`""
    return
}

#Ensure that we are running the GUI from the correct location so that scripts & psexec can be accessed.
Set-Location $ScriptRoot

#Check for PsExec
Write-Verbose 'Checking for psexec.exe.'
If (-Not (Test-Path $PsExecPath)) {
    Write-Warning ("Psexec.exe missing from {0}!`nPlease place PsExec.exe in the same folder as WUU.ps1." -f $ScriptRoot)
    return
}

#Check for Scripts directory and files
$downloadScriptPath = Join-Path $ScriptRoot 'Scripts\Download-Patches.ps1'
$installScriptPath = Join-Path $ScriptRoot 'Scripts\Install-Patches.ps1'
If (-Not (Test-Path $downloadScriptPath)) {
    Write-Warning ("Download-Patches.ps1 missing from {0}!`nPlease ensure the Scripts directory and files are present." -f $ScriptRoot)
    return
}
If (-Not (Test-Path $installScriptPath)) {
    Write-Warning ("Install-Patches.ps1 missing from {0}!`nPlease ensure the Scripts directory and files are present." -f $ScriptRoot)
    return
}
$testWUAgentPath = Join-Path $ScriptRoot 'Scripts\Test-WUAgent.ps1'
$repairWUAgentPath = Join-Path $ScriptRoot 'Scripts\Repair-WUAgent.ps1'
If (-Not (Test-Path $testWUAgentPath)) {
    Write-Warning ("Test-WUAgent.ps1 missing from {0}!`nPlease ensure the Scripts directory and files are present." -f $ScriptRoot)
    return
}
If (-Not (Test-Path $repairWUAgentPath)) {
    Write-Warning ("Repair-WUAgent.ps1 missing from {0}!`nPlease ensure the Scripts directory and files are present." -f $ScriptRoot)
    return
}

#Determine if this instance of PowerShell can run WPF (required for GUI)
Write-Verbose 'Checking the apartment state.'
If ($host.Runspace.ApartmentState -ne 'STA') {
    Write-Warning "This script must be run in PowerShell started using -STA switch!`nScript will attempt to re-launch in STA mode."
    Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList "-STA -noprofile -WindowStyle Hidden -file `"$PSCommandPath`""
    return
}
#endregion Environment validation

#region Load required assemblies
Write-Verbose 'Loading required assemblies.'
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase
Add-Type -AssemblyName Microsoft.VisualBasic
Add-Type -AssemblyName System.Windows.Forms
#endregion Load required assemblies

#region Load XAML
Write-Verbose 'Loading XAML data.'
try {
    [xml]$xaml = Get-Content (Join-Path $ScriptRoot 'WUU.xaml')
    $reader = (New-Object System.Xml.XmlNodeReader $xaml)
    $uiHash.Window = [Windows.Markup.XamlReader]::Load($reader)
}
catch {
    Write-Warning 'Unable to load XAML data!'
    return
}
#endregion

#region ScriptBlocks
#Add new computer(s) to list
$AddEntry = {
    Param ($ComputerName)
    Write-Verbose "Adding $ComputerName."

    If (Test-Path Exempt.txt) {
        Write-Verbose 'Collecting systems from exempt list.'
        [string[]]$exempt = Get-Content Exempt.txt
    }

    #Add to list
    ForEach ($computer in $ComputerName) {
        $computer = $computer.Trim() #Remove any whitespace
        If ([System.String]::IsNullOrEmpty($computer)) { continue } #Do not add if name empty
        
        # Normalize host token and extract first DNS label when FQDN comes in.
        $computerName = $computer.Trim().TrimStart('.')
        if ($computerName -like '*.*') {
            $computerName = ($computerName -split '\.')[0]
        }
        if ([string]::IsNullOrWhiteSpace($computerName)) {
            Write-Log -Computer $computer -Action 'AddEntry' -Result 'Error' -Details 'Empty host after normalization'
            continue
        }
        
        # Validate host token format (letters, numbers, dash, underscore).
        if ($computerName -notmatch '^[a-zA-Z0-9][a-zA-Z0-9\-_]*$') {
            Write-Log -Computer $computer -Action 'AddEntry' -Result 'Error' -Details 'Invalid computer name format'
            continue
        }
        # Allow DNS hostnames up to 63 chars to avoid dropping valid modern names.
        if ($computerName.Length -gt 63) {
            Write-Log -Computer $computer -Action 'AddEntry' -Result 'Error' -Details 'Computer name too long'
            continue
        }
        
        if ($exempt -contains $computerName) { continue } #Do not add excluded
        if (($uiHash.Listview.Items | Select-Object -Expand Computer) -contains $computerName) { continue } #Do not add duplicate

        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.clientObservable.Add((
                        New-Object PSObject -Property @{
                            Computer       = $computerName
                            IsChecked      = $false -as [bool]
                            CanCheck       = $true -as [bool]
                            WsusServer     = 'Sin consultar'
                            Available      = 0 -as [int]
                            Downloaded     = 0 -as [int]
                            DownloadPercent = '0%'
                            InstallErrors  = ''
                            Status         = "Listo para iniciar."
                            Phase          = 'Idle'
                            RebootRequired = $false -as [bool]
                            UpdatesStatus  = "Unknown"
                            StartTime      = $null
                            EndTime        = $null
                            Runspace       = $null
                        }))
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    } # foreach compuer

    Update-RestartSelectedButtonState
}

#Clear computer list
$SetUpdatesStatus = {
    Param ($Computer)
    Try {
        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                if ($computer.Available -gt 0) {
                    $computer.UpdatesStatus = 'Updates required'
                }			
                elseif ($computer.rebootRequired) {
                    $computer.UpdatesStatus = 'Reboot required'
                }
                else {
                    $computer.UpdatesStatus = 'All updates installed'
                }
                if ($computer.IsChecked -eq $false) {
                    $computer.Phase = 'Idle'
                }
                elseif ($computer.RebootRequired) {
                    $computer.Phase = 'RebootRequired'
                }
                elseif ($computer.Available -gt 0) {
                    $computer.Phase = 'DownloadingInstalling'
                }
                else {
                    $computer.Phase = 'Updated'
                }
                if ($computer.Available -gt 0) {
                    $pct = [int][math]::Min(100, [math]::Max(0, [math]::Round((100.0 * $computer.Downloaded) / $computer.Available)))
                    $computer.DownloadPercent = "$pct%"
                }
                else {
                    $computer.DownloadPercent = '0%'
                }
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })		
        if ($Computer.IsChecked) {
            $selectedComputersSet[[string]$Computer.Computer] = $true
            if ($Computer.RebootRequired) {
                $pendingRebootSet[[string]$Computer.Computer] = $true
            }
            else {
                $pendingRebootSet.Remove([string]$Computer.Computer) | Out-Null
            }
        }
        else {
            $selectedComputersSet.Remove([string]$Computer.Computer) | Out-Null
            $pendingRebootSet.Remove([string]$Computer.Computer) | Out-Null
        }
        & $UpdateCountersUiScript
    }
    Catch {
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Error occurred: $($_.Exception.Message)."
                $computer.UpdatesStatus = 'Unknown'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

    }
}

#Clear computer list
$ClearComputerList = {
    #Remove computers & associated updates
    &$removeEntry @($uiHash.Listview.Items)

    #Update status
    $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
            $uiHash.StatusTextBox.Foreground = 'Black'
            $uiHash.StatusTextBox.Text = 'Computer List Cleared!'
        })
    Update-RestartSelectedButtonState
}

#Download available updates
$DownloadUpdates = {
    Param ($Computer)
    Try {
        #Set start time
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.StartTime = Get-Date
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Set path for psexec and scripts
        Set-Location $ScriptRoot

        #Check download size
        $dlStats = ($updatesHash[$Computer.computer] | Where-Object { $_.IsDownloaded -eq $false } | Select-Object -ExpandProperty MaxDownloadSize | Measure-Object -Sum)

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Downloading $($dlStats.Count) Updates ($([math]::Round($dlStats.Sum/1MB))MB)."
                $computer.Phase = 'DownloadingInstalling'
                if ($computer.Available -gt 0) {
                    $pct = [int][math]::Min(100, [math]::Max(0, [math]::Round((100.0 * $computer.Downloaded) / $computer.Available)))
                    $computer.DownloadPercent = "$pct%"
                }
                else {
                    $computer.DownloadPercent = '0%'
                }
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Copy script to remote Computer and execute
        if ( ! ( Test-Path -Path "\\$($Computer.Computer)\C$\Admin\Scripts") ) {
            New-Item -Path "\\$($Computer.Computer)\C$\Admin\Scripts" -ItemType Directory
        }
        $remoteScripts = "\\$($Computer.Computer)\C$\Admin\Scripts"
        $progressUnc = Join-Path $remoteScripts 'WU-DownloadProgress.txt'
        $resultUnc = Join-Path $remoteScripts 'WU-DownloadResult.txt'
        Remove-Item -LiteralPath $progressUnc, $resultUnc -Force -ErrorAction SilentlyContinue
        Copy-Item (Join-Path $ScriptRoot 'Scripts\Download-Patches.ps1') "$remoteScripts\Download-Patches.ps1" -Force

        $psexecArgs = @(
            '-accepteula', '-nobanner', '-s', "\\$($Computer.Computer)",
            'cmd.exe', '/c', 'echo . | powershell.exe -NoProfile -ExecutionPolicy Bypass -file C:\Admin\Scripts\Download-Patches.ps1'
        )
        $dlProc = Start-Process -FilePath $PsExecPath -ArgumentList $psexecArgs -WindowStyle Hidden -PassThru
        $lastProgress = ''
        while (-not $dlProc.WaitForExit(700)) {
            if (Test-Path -LiteralPath $progressUnc) {
                $line = Get-Content -LiteralPath $progressUnc -Tail 1 -ErrorAction SilentlyContinue
                if ($line -and $line -ne $lastProgress) {
                    $lastProgress = $line
                    $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                            $uiHash.Listview.Items.EditItem($Computer)
                            $computer.Status = $line
                            if ($line -match '(\d+)%') {
                                $pct = [int]$matches[1]
                                $pct = [int][math]::Min(100, [math]::Max(0, $pct))
                                $computer.DownloadPercent = "$pct%"
                            }
                            $uiHash.Listview.Items.CommitEdit()
                            $uiHash.Listview.Items.Refresh()
                        })
                }
            }
        }
        $dlExit = $dlProc.ExitCode
        Remove-Item "$remoteScripts\Download-Patches.ps1" -Force -ErrorAction SilentlyContinue
        if ($dlExit -ne 0) {
            Remove-Item -LiteralPath $progressUnc, $resultUnc -Force -ErrorAction SilentlyContinue
            throw "PsExec failed with error code $dlExit"
        }

        [int]$numDownloaded = 0
        if (Test-Path -LiteralPath $resultUnc) {
            [int]$numDownloaded = [int]((Get-Content -LiteralPath $resultUnc -Raw -ErrorAction SilentlyContinue).Trim())
        }
        Remove-Item -LiteralPath $progressUnc, $resultUnc -Force -ErrorAction SilentlyContinue

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Download complete.'
                $computer.Downloaded += $numDownloaded
                if ($computer.Available -gt 0) {
                    $pct = [int][math]::Min(100, [math]::Max(0, [math]::Round((100.0 * $computer.Downloaded) / $computer.Available)))
                    $computer.DownloadPercent = "$pct%"
                }
                else {
                    $computer.DownloadPercent = '0%'
                }
                $computer.EndTime = Get-Date
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
    Catch {
        Write-Log -Computer $Computer.Computer -Action 'DownloadUpdates' -Result 'Error' -Details $_.Exception.Message
        $errMsg = $_.Exception.Message
        $rs = "\\$($Computer.Computer)\C$\Admin\Scripts"
        Remove-Item "$rs\Download-Patches.ps1" -Force -ErrorAction SilentlyContinue
        Remove-Item "$rs\WU-DownloadProgress.txt", "$rs\WU-DownloadResult.txt" -Force -ErrorAction SilentlyContinue
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Error occurred: $errMsg."
                $computer.InstallErrors = "Download: $errMsg"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
}

# Validar agente WU/WSUS y reparar si es necesario antes de buscar actualizaciones
$PrepareWUAgentBeforeCheck = {
    Param ($Computer)
    try {
        Set-Location $ScriptRoot
        $testLocal = Join-Path $ScriptRoot 'Scripts\Test-WUAgent.ps1'
        $repairLocal = Join-Path $ScriptRoot 'Scripts\Repair-WUAgent.ps1'
        $remoteScripts = "\\$($Computer.Computer)\C$\Admin\Scripts"

        $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Validando agente Windows Update / WSUS...'
                $computer.Phase = 'WSUSCheck'
                $computer.InstallErrors = ''
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        # Resolve configured WSUS server URL from the remote registry and show it in the grid.
        $wsusUrl = 'Consultando...'
        try {
            $wsusUrl = Invoke-Command -ComputerName $Computer.Computer -ErrorAction Stop -ScriptBlock {
                try {
                    $val = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate' -Name WUServer -ErrorAction Stop).WUServer
                    if ([string]::IsNullOrWhiteSpace($val)) { 'Microsoft Update (sin WSUS)' } else { $val }
                }
                catch {
                    'Microsoft Update (sin WSUS)'
                }
            }
        }
        catch {
            $wsusUrl = "No accesible: $($_.Exception.Message)"
        }
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.WsusServer = $wsusUrl
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
        Write-Log -Computer $Computer.Computer -Action 'WSUSCheck' -Result 'Info' -Details "Servidor WSUS configurado en $($Computer.Computer): $wsusUrl"

        if (-not (Test-Path -Path $remoteScripts)) {
            New-Item -Path $remoteScripts -ItemType Directory -Force | Out-Null
        }
        Copy-Item -Path $testLocal -Destination "$remoteScripts\Test-WUAgent.ps1" -Force
        Write-Log -Computer $Computer.Computer -Action 'WSUSCheck' -Result 'Info' -Details "Validando comunicacion WSUS en servidor $($Computer.Computer)..."
        $null = & $PsExecPath -accepteula -nobanner -s "\\$($Computer.Computer)" cmd.exe /c 'echo . | powershell.exe -NoProfile -ExecutionPolicy Bypass -file C:\Admin\Scripts\Test-WUAgent.ps1'
        $probeExit = $LASTEXITCODE
        Remove-Item -Path "$remoteScripts\Test-WUAgent.ps1" -Force -ErrorAction SilentlyContinue

        switch ($probeExit) {
            0 { Write-Log -Computer $Computer.Computer -Action 'WSUSCheck' -Result 'Success' -Details "Agente WU/WSUS operativo en $($Computer.Computer) (Test-WUAgent exit=0)." }
            2 { Write-Log -Computer $Computer.Computer -Action 'WSUSCheck' -Result 'Warning' -Details "Servicios WU/BITS detenidos en $($Computer.Computer) (Test-WUAgent exit=2). Se intentara reparar." }
            3 { Write-Log -Computer $Computer.Computer -Action 'WSUSCheck' -Result 'Warning' -Details "Fallo COM o consulta de actualizaciones en $($Computer.Computer) (Test-WUAgent exit=3). Se intentara reparar." }
            default { Write-Log -Computer $Computer.Computer -Action 'WSUSCheck' -Result 'Warning' -Details "Test-WUAgent en $($Computer.Computer) devolvio codigo inesperado $probeExit. Se intentara reparar." }
        }

        if ($probeExit -ne 0) {
            $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Agente WU con problemas; reparando (servicios, cache, registro WSUS)...'
                    $computer.Phase = 'WURepair'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
            Copy-Item -Path $repairLocal -Destination "$remoteScripts\Repair-WUAgent.ps1" -Force
            $null = & $PsExecPath -accepteula -nobanner -s "\\$($Computer.Computer)" cmd.exe /c 'echo . | powershell.exe -NoProfile -ExecutionPolicy Bypass -file C:\Admin\Scripts\Repair-WUAgent.ps1'
            $repairExit = $LASTEXITCODE
            Remove-Item -Path "$remoteScripts\Repair-WUAgent.ps1" -Force -ErrorAction SilentlyContinue
            if ($repairExit -ne 0) {
                Write-Log -Computer $Computer.Computer -Action 'PrepareWUAgentBeforeCheck' -Result 'Warning' -Details "Reparacion remota termino con codigo $repairExit (sigue la busqueda de actualizaciones)."
                $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                        $uiHash.Listview.Items.EditItem($Computer)
                        $computer.Status = 'Reparacion con advertencias; continuando busqueda de actualizaciones...'
                        $uiHash.Listview.Items.CommitEdit()
                        $uiHash.Listview.Items.Refresh()
                    })
            }
            else {
                $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                        $uiHash.Listview.Items.EditItem($Computer)
                        $computer.Status = 'Reparacion del agente WU completada; refrescando catalogo WSUS...'
                        $computer.Phase = 'WSUSCheck'
                        $uiHash.Listview.Items.CommitEdit()
                        $uiHash.Listview.Items.Refresh()
                    })
            }
        }
        else {
            $null = & $PsExecPath -accepteula -nobanner -s "\\$($Computer.Computer)" cmd.exe /c 'echo . | wuauclt /detectnow'
            $detectExit = $LASTEXITCODE
            if ($detectExit -eq 0) {
                Write-Log -Computer $Computer.Computer -Action 'WSUSDetect' -Result 'Success' -Details "Sincronizacion WSUS (detectnow) correcta en $($Computer.Computer) (exit=$detectExit)."
            }
            else {
                Write-Log -Computer $Computer.Computer -Action 'WSUSDetect' -Result 'Warning' -Details "Sincronizacion WSUS (detectnow) devolvio codigo $detectExit en $($Computer.Computer)."
            }
            $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Agente WU operativo; sincronizando con WSUS...'
                    $computer.Phase = 'WSUSCheck'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
        }
    }
    catch {
        Write-Log -Computer $Computer.Computer -Action 'PrepareWUAgentBeforeCheck' -Result 'Error' -Details $_.Exception.Message
        $errMsg = $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Validacion WU omitida por error: $errMsg. Continuando busqueda..."
                $computer.InstallErrors = "PrepareWU: $errMsg"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
}

#Check for available updates
$GetUpdates = {
    Param ($Computer)
    Try {
        #Set start time
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.StartTime = Get-Date
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Checking for updates, this may take some time.'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        Set-Location $ScriptRoot

        #Check for updates
        try {

            $updatesession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', $Computer.computer))
            $updatesearcher = $updatesession.CreateUpdateSearcher()
            $searchresult = $updatesearcher.Search('IsInstalled=0 and IsHidden=0')
        }
        catch {
            $command = {
                $updatesession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', 'localhost'))
                $updatesearcher = $updatesession.CreateUpdateSearcher()
                $searchresult = $updatesearcher.Search('IsInstalled=0 and IsHidden=0')
                $out = $searchresult | Select-Object -ExpandProperty updates
                $out | Select-Object Title, Description, IsDownloaded, IsMandatory, IsUninstallable, InstallationBehavior, LastDeploymentChangeTime, MaxDownloadSize, MinDownloadSize , RecommendedCpuSpeed, RecommendedHardDiskSpace, RecommendedMemory, DriverClass, DriverManufacturer, DriverModel, DriverProvider, DriverVerDate
            }
            $RetriveUpdate = Invoke-Command -ComputerName $Computer.computer -command $command -HideComputerName
            $searchresult = @{
                updates = $RetriveUpdate
            }
        }

        #Save update info in hash to view with 'Show Available Updates'
        $updatesHash[$computer.computer] = $searchresult.Updates
        
        #Update status
        $dlCount = @($searchresult.Updates | Where-Object { $_.IsDownloaded -eq $true }).Count
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Available = $searchresult.Updates.Count
                $computer.Downloaded = $dlCount
                if ($computer.Available -gt 0) {
                    $pct = [int][math]::Min(100, [math]::Max(0, [math]::Round((100.0 * $computer.Downloaded) / $computer.Available)))
                    $computer.DownloadPercent = "$pct%"
                }
                else {
                    $computer.DownloadPercent = '0%'
                }
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

		
        #Check if there is a pending update
		
        $rebootRequired = (& $PsExecPath -accepteula -nobanner -s "\\$($Computer.computer)" cmd.exe /c 'echo . | powershell.exe -ExecutionPolicy Bypass -Command "&{return (New-Object -ComObject "Microsoft.Update.SystemInfo").RebootRequired}"') -eq $true
		
        #Don't bother checking for reboot if there is nothing to be pending.
        #if($dlCount -gt 0){
        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Checking for a pending reboot.'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                if ($rebootRequired -eq $True) {
                    $computer.RebootRequired = $True
                }
                else {
                    $computer.RebootRequired = $False
                }
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
        if ($Computer.IsChecked) {
            $selectedComputersSet[[string]$Computer.Computer] = $true
            if ($Computer.RebootRequired) {
                $pendingRebootSet[[string]$Computer.Computer] = $true
            }
            else {
                $pendingRebootSet.Remove([string]$Computer.Computer) | Out-Null
            }
        }
        else {
            $selectedComputersSet.Remove([string]$Computer.Computer) | Out-Null
            $pendingRebootSet.Remove([string]$Computer.Computer) | Out-Null
        }
        & $UpdateCountersUiScript
        #}		

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Finished checking for updates.'
                $computer.EndTime = Get-Date
                #$computer.Style.BackGround = 'Red'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
    Catch {
        Write-Log -Computer $Computer.Computer -Action 'GetUpdates' -Result 'Error' -Details $_.Exception.Message
        $errMsg = $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Error occurred: $errMsg"
                $computer.InstallErrors = "GetUpdates: $errMsg"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
}

# Solo al dar de alta equipos: si el chequeo inicial dejo parches sin descargar, descarga automatica y refresca el listado
$MaybeAutoDownloadAfterInitialCheck = {
    Param ($Computer)
    try {
        $list = $updatesHash[$Computer.computer]
        if ($null -eq $list) { return }
        $pending = @($list | Where-Object { $_.IsDownloaded -eq $false })
        if ($pending.Count -eq 0) { return }

        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Descarga automatica: $($pending.Count) actualizacion(es) pendiente(s)..."
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        & $DownloadUpdates $Computer
        & $GetUpdates $Computer
        $toInstall = @($updatesHash[$Computer.computer] | Where-Object { $_.IsDownloaded -and $_.InstallationBehavior.CanRequestUserInput -eq $false })
        if ($toInstall.Count -gt 0) {
            & $InstallUpdates $Computer
            & $GetUpdates $Computer
        }
        & $SetUpdatesStatus $Computer
    }
    catch {
        Write-Log -Computer $Computer.Computer -Action 'AutoDownloadAfterInitialCheck' -Result 'Error' -Details $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Descarga automatica: $($_.Exception.Message)"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
}

#Format errors for Out-GridView
$GetErrors = {
    ForEach ($err in $error) {
        Switch ($err) {
            { $err -is [System.Management.Automation.ErrorRecord] } {
                $hash = @{
                    Category        = $err.categoryinfo.Category
                    Activity        = $err.categoryinfo.Activity
                    Reason          = $err.categoryinfo.Reason
                    Type            = $err.GetType().ToString()
                    Exception       = ($err.exception -split ': ')[1]
                    QualifiedError  = $err.FullyQualifiedErrorId
                    CharacterNumber = $err.InvocationInfo.OffsetInLine
                    LineNumber      = $err.InvocationInfo.ScriptLineNumber
                    Line            = $err.InvocationInfo.Line
                    TargetObject    = $err.TargetObject
                }
            }               
            Default {
                $hash = @{
                    Category        = $err.errorrecord.categoryinfo.category
                    Activity        = $err.errorrecord.categoryinfo.Activity
                    Reason          = $err.errorrecord.categoryinfo.Reason
                    Type            = $err.GetType().ToString()
                    Exception       = ($err.errorrecord.exception -split ': ')[1]
                    QualifiedError  = $err.errorrecord.FullyQualifiedErrorId
                    CharacterNumber = $err.errorrecord.InvocationInfo.OffsetInLine
                    LineNumber      = $err.errorrecord.InvocationInfo.ScriptLineNumber
                    Line            = $err.errorrecord.InvocationInfo.Line
                    TargetObject    = $err.errorrecord.TargetObject
                }
            }
        }
        $object = New-Object PSObject -Property $hash
        $object.PSTypeNames.Insert(0, 'ErrorInformation')
        $object
    }
}

#Install downloaded updates
$InstallUpdates = {
    Param ($Computer)
    Try {
        #Set path for psexec and scripts
        Set-Location $ScriptRoot

        #Update status
        $installCount = ($updatesHash[$Computer.computer] | Where-Object { $_.IsDownloaded -eq $true -and $_.InstallationBehavior.CanRequestUserInput -eq $false } | Measure-Object).Count
        $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Installing $installCount Updates, this may take some time."
                $computer.InstallErrors = ''
                $computer.Phase = 'DownloadingInstalling'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

      
        #Copy script to remote Computer and execute
        if ( ! ( Test-Path -Path "\\$($Computer.Computer)\C$\Admin\Scripts") ) {
            New-Item -Path "\\$($Computer.Computer)\C$\Admin\Scripts" -ItemType Directory
        }
        Copy-Item (Join-Path $ScriptRoot 'Scripts\Install-Patches.ps1') "\\$($Computer.Computer)\C$\Admin\Scripts" -Force
        $installOutput = @(& $PsExecPath -accepteula -nobanner -s "\\$($Computer.Computer)" cmd.exe /c 'echo . | powershell.exe -ExecutionPolicy Bypass -file C:\Admin\Scripts\Install-Patches.ps1')
        Remove-Item "\\$($Computer.Computer)\C$\Admin\Scripts\Install-Patches.ps1"
        if ($LASTEXITCODE -ne 0) {
            throw "PsExec failed with error code $LASTEXITCODE"
        }

        $installErrorDescription = 'Sin errores'
        $resultLine = $installOutput | Where-Object { $_ -like 'WUU_RESULT_JSON:*' } | Select-Object -Last 1
        if ($resultLine) {
            $jsonPayload = $resultLine.Substring('WUU_RESULT_JSON:'.Length)
            try {
                $resultObj = $jsonPayload | ConvertFrom-Json
                if ($resultObj.ErrorDescription) {
                    $installErrorDescription = [string]$resultObj.ErrorDescription
                }
            }
            catch {
                $installErrorDescription = 'No se pudo interpretar el detalle del error'
            }
        }

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Checking if a reboot is required.'
                $computer.InstallErrors = $installErrorDescription
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Check if any updates require reboot
        $rebootRequired = (& $PsExecPath -accepteula -nobanner -s "\\$($Computer.computer)" cmd.exe /c 'echo . | powershell.exe -ExecutionPolicy Bypass -Command "&{return (New-Object -ComObject "Microsoft.Update.SystemInfo").RebootRequired}"') -eq $true
        if ($LASTEXITCODE -ne 0) {
            throw "PsExec failed with error code $LASTEXITCODE"
        }

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Install complete.'
                if ($rebootRequired -eq $True) {
                    $computer.RebootRequired = $True
                    $computer.Phase = 'RebootRequired'
                }
                else {
                    $computer.RebootRequired = $False
                    $computer.Phase = 'Updated'
                }
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
        if ($Computer.IsChecked) {
            $selectedComputersSet[[string]$Computer.Computer] = $true
            if ($Computer.RebootRequired) {
                $pendingRebootSet[[string]$Computer.Computer] = $true
            }
            else {
                $pendingRebootSet.Remove([string]$Computer.Computer) | Out-Null
            }
        }
        else {
            $selectedComputersSet.Remove([string]$Computer.Computer) | Out-Null
            $pendingRebootSet.Remove([string]$Computer.Computer) | Out-Null
        }
        & $UpdateCountersUiScript
    }
    Catch {
        Write-Log -Computer $Computer.Computer -Action 'InstallUpdates' -Result 'Error' -Details $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Error occurred: $($_.Exception.Message)"
                $computer.InstallErrors = $_.Exception.Message
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Cancel any remaining actions
        #exit  # Removed to prevent script termination
    }
}

#Remove computer(s) from list
$RemoveEntry = {
    Param ($Computers)

    #Remove computers from list
    ForEach ($computer in $Computers) {
        Remove-ComputerFromCounters -ComputerName ([string]$computer.Computer)
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($computer)
                $uiHash.clientObservable.Remove($computer)
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }

    $CleanUp = {
        Param($Computers)
        ForEach ($computer in $Computers) {
            $updatesHash.Remove($computer.computer)
            if ($computer.Runspace) {
                $computer.Runspace.Dispose()
            }
        }
    }

    $newRunspace = [runspacefactory]::CreateRunspace()
    $newRunspace.ApartmentState = "STA"
    $newRunspace.ThreadOptions = "ReuseThread"
    $newRunspace.Open()
    $newRunspace.SessionStateProxy.SetVariable("uiHash", $uiHash)
    $newRunspace.SessionStateProxy.SetVariable("updatesHash", $updatesHash)

    $PowerShell = [powershell]::Create().AddScript($CleanUp).AddArgument($Computers)
    $PowerShell.Runspace = $newRunspace

    #Save handle so we can later end the runspace
    $temp = New-Object PSObject -Property @{
        PowerShell = $PowerShell
        Runspace   = $PowerShell.BeginInvoke()
    }

    $jobs.Add($temp) | Out-Null
    Update-RestartSelectedButtonState
}

#Remove computer that cannot be pinged
$RemoveOfflineComputer = {
    Param ($computer, $RemoveEntry)
    try {
        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                $uiHash.Listview.Items.EditItem($computer)
                $computer.Status = 'Testing Connectivity.'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
        #Verify connectivity
        if (Test-Connection -Count 1 -ComputerName $computer.Computer -Quiet) {
            $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                    $uiHash.Listview.Items.EditItem($computer)
                    $computer.Status = 'Online.'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
        }
        else {
            #Remove unreachable computers
            $selectedComputersSet.Remove([string]$computer.Computer) | Out-Null
            $pendingRebootSet.Remove([string]$computer.Computer) | Out-Null
            $updatesHash.Remove($computer.computer)
            $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                    $uiHash.Listview.Items.EditItem($computer)
                    $uiHash.clientObservable.Remove($computer)
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
            & $UpdateCountersUiScript
        }
    }
    Catch {
        Write-Log -Computer $computer.Computer -Action 'RemoveOfflineComputer' -Result 'Error' -Details $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($computer)
                $computer.Status = "Error occurred: $($_.Exception.Message)"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Cancel any remaining actions
        #exit  # Removed to prevent script termination
    }
}

#Report status to WSUS server
$ReportStatus = {
    Param ($Computer)
    $serverName = [string]$Computer.Computer
    try {
        Set-Location $ScriptRoot

        $wsusServerUrl = 'desconocido'
        try {
            $wsusServerUrl = Invoke-Command -ComputerName $serverName -ErrorAction Stop -ScriptBlock {
                $regPath = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate'
                $val = $null
                try {
                    $val = (Get-ItemProperty -Path $regPath -Name WUServer -ErrorAction Stop).WUServer
                }
                catch {
                    $val = $null
                }
                if (-not $val) { 'No definido (Microsoft Update directo)' } else { $val }
            }
        }
        catch {
            $wsusServerUrl = "No se pudo consultar registro WSUS: $($_.Exception.Message)"
        }

        Write-Log -Computer $serverName -Action 'WSUSReport' -Result 'Info' -Details "Iniciando reporte a WSUS. Servidor objetivo: $serverName. WSUS configurado: $wsusServerUrl"

        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $Computer.WsusServer = $wsusServerUrl
                $Computer.Status = "Reportando estado al servidor WSUS ($wsusServerUrl)..."
                $Computer.InstallErrors = ''
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        $null = & $PsExecPath -accepteula -nobanner -s "\\$serverName" cmd.exe /c 'echo . | wuauclt /reportnow'
        $reportExit = $LASTEXITCODE
        if ($reportExit -ne 0) {
            Write-Log -Computer $serverName -Action 'WSUSReport' -Result 'Error' -Details "Fallo el reporte a WSUS en $serverName. PsExec exit code: $reportExit. WSUS configurado: $wsusServerUrl"
            throw "PsExec failed with error code $reportExit"
        }

        Write-Log -Computer $serverName -Action 'WSUSReport' -Result 'Success' -Details "Reporte WSUS enviado correctamente desde $serverName a $wsusServerUrl (wuauclt /reportnow exit=$reportExit)"

        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $Computer.Status = "Reporte WSUS OK ($serverName -> $wsusServerUrl)"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
    catch {
        $errMsg = $_.Exception.Message
        Write-Log -Computer $serverName -Action 'WSUSReport' -Result 'Error' -Details "Error al reportar a WSUS desde $serverName : $errMsg"
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $Computer.Status = "Error al reportar a WSUS ($serverName): $errMsg"
                $Computer.InstallErrors = "WSUSReport: $errMsg"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
}


#Reboot remote computer
$RestartComputer = {
    Param ($Computer, $afterInstall)
    try {
        # No reinicio automatico tras instalacion; usar el menu contextual Restart.
        if ($afterInstall) { return }
        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Restarting... Waiting for computer to shutdown.'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Restart and wait until remote COM can be connected
        Restart-Computer $Computer.computer -Force
        While (Test-Connection -Count 1 -ComputerName $computer.Computer -Quiet) { Start-Sleep -Milliseconds 500 } #Wait for computer to go offline

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Restarting... Waiting for computer to come online.'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        While ($true) {
            #Wait for computer to come online
            start-Sleep 5 
            try {
                [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', $Computer.computer))
                Break
            }

            # Access denied cross domain
            catch [System.Management.Automation.MethodInvocationException] {

                $commandrestart = {
                    [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', 'localhost'))
                } # script block command
                try {
                    
                    $restart = Invoke-Command  -ScriptBlock $commandrestart -ComputerName $computer.computer -ErrorAction stop
                    Break
                }
                catch {

                    start-Sleep 5 
                }

            }
            catch { 
                start-Sleep 5 
            }
        }
    }
    catch {
        Write-Log -Computer $Computer.Computer -Action 'RestartComputer' -Result 'Error' -Details $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = 'Error occurred: $($_.Exception.Message)'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Cancel any remaining actions
        #exit  # Removed to prevent script termination
    }
}

#Start, stop, or restart Windows Update Service
$WUServiceAction = {
    Param($Computer, $Action)
    try {
        #Start Windows Update Service
        if ($Action -eq 'Start') {
            #Update status
            $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Starting Windows Update Service'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })

            #Start service
            Get-Service -ComputerName $computer.computer -Name wuauserv -ErrorAction Stop | Start-Service -ErrorAction Stop

            #Update status
            $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Windows Update Service Started'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
        }
    
        #Stop Windows Update Service
        ElseIf ($Action -eq 'Stop') {
            #Update status
            $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Stopping Windows Update Service'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })

            #Stop service
            Get-Service -ComputerName $computer.computer -Name wuauserv -ErrorAction Stop | Stop-Service -ErrorAction Stop

            #Update status
            $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Windows Update Service Stopped'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
        }

        #Restart Windows Update Service
        ElseIf ($Action -eq 'Restart') {
            #Update status
            $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Restarting Windows Update Service'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })

            #Restart service
            Get-Service -ComputerName $computer.computer -Name wuauserv -ErrorAction Stop | Restart-Service -ErrorAction Stop

            #Update status
            $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Windows Update Service Restarted'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
        }

        #Invalid action
        Else { Write-Error 'Invalid action specified.' }
    }
    Catch {
        Write-Log -Computer $Computer.Computer -Action 'WUServiceAction' -Result 'Error' -Details $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Error occurred: $($_.Exception.Message)"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Cancel any remaining actions
        #exit  # Removed to prevent script termination
    }
}
#endregion ScriptBlocks
 
#region Background runspace to clean up jobs
$jobCleanup.Flag = $True
$newRunspace = [runspacefactory]::CreateRunspace()
$newRunspace.ApartmentState = 'STA'
$newRunspace.ThreadOptions = 'ReuseThread'
$newRunspace.Open()
$newRunspace.SessionStateProxy.SetVariable('jobCleanup', $jobCleanup)
$newRunspace.SessionStateProxy.SetVariable('jobs', $jobs)
$jobCleanup.PowerShell = [PowerShell]::Create().AddScript( {
        #Routine to handle completed runspaces
        Do {
            ForEach ($runspace in $jobs) {
                If ($runspace.Runspace.isCompleted) {
                    $runspace.powershell.EndInvoke($runspace.Runspace) | Out-Null
                    $runspace.powershell.dispose()
                    $runspace.Runspace = $null
                    $runspace.powershell = $null
                    $jobs.remove($runspace)
                } 
            }
            Start-Sleep -Seconds 1
        } While ($jobCleanup.Flag)
    })
$jobCleanup.PowerShell.Runspace = $newRunspace
$jobCleanup.Thread = $jobCleanup.PowerShell.BeginInvoke()
#endregion

#region Connect to controls
$uiHash.GroupComboBox = $uiHash.Window.FindName('GroupComboBox')
$uiHash.ReloadGroupsButton = $uiHash.Window.FindName('ReloadGroupsButton')
$uiHash.SelectAllButton = $uiHash.Window.FindName('SelectAllButton')
$uiHash.ClearSelectionButton = $uiHash.Window.FindName('ClearSelectionButton')
$uiHash.StartButton = $uiHash.Window.FindName('StartButton')
$uiHash.RestartSelectedButton = $uiHash.Window.FindName('RestartSelectedButton')
$uiHash.ReportButton = $uiHash.Window.FindName('ReportButton')
$uiHash.StopRefreshButton = $uiHash.Window.FindName('StopRefreshButton')
$uiHash.UpdateTargetsTextBlock = $uiHash.Window.FindName('UpdateTargetsTextBlock')
$uiHash.PendingRebootTextBlock = $uiHash.Window.FindName('PendingRebootTextBlock')
$uiHash.GridView = $uiHash.Window.FindName('GridView')
$uiHash.Listview = $uiHash.Window.FindName('Listview')
$uiHash.StatusTextBox = $uiHash.Window.FindName('StatusTextBox')

# ContextMenu items live in a separate name scope and FindName from the Window
# can return $null. Resolve them from the ContextMenu first, then fall back to
# the listview, then to the window. Missing items remain $null but consumers
# now check for $null before touching them.
$uiHash.ListviewContextMenu = $uiHash.Window.FindName('ListViewContextMenu')
if (-not $uiHash.ListviewContextMenu -and $uiHash.Listview) {
    try { $uiHash.ListviewContextMenu = $uiHash.Listview.ContextMenu } catch {}
}
function Resolve-UiName {
    param([string]$Name)
    $found = $null
    if ($uiHash.ListviewContextMenu) {
        try { $found = $uiHash.ListviewContextMenu.FindName($Name) } catch {}
    }
    if (-not $found -and $uiHash.Listview) {
        try { $found = $uiHash.Listview.FindName($Name) } catch {}
    }
    if (-not $found -and $uiHash.Window) {
        try { $found = $uiHash.Window.FindName($Name) } catch {}
    }
    return $found
}

$uiHash.AddADContext = Resolve-UiName 'AddADContext'
$uiHash.AddFileContext = Resolve-UiName 'AddFileContext'
$uiHash.AddComputerContext = Resolve-UiName 'AddComputerContext'
$uiHash.CheckUpdatesContext = Resolve-UiName 'CheckUpdatesContext'
$uiHash.DownloadUpdatesContext = Resolve-UiName 'DownloadUpdatesContext'
$uiHash.InstallUpdatesContext = Resolve-UiName 'InstallUpdatesContext'
$uiHash.ReportStatusContext = Resolve-UiName 'ReportStatusContext'
$uiHash.RemoteDesktopContext = Resolve-UiName 'RemoteDesktopContext'
$uiHash.RemoveComputerContext = Resolve-UiName 'RemoveComputerContext'
$uiHash.RestartContext = Resolve-UiName 'RestartContext'
$uiHash.ShowUpdatesContext = Resolve-UiName 'ShowUpdatesContext'
$uiHash.ShowInstalledContext = Resolve-UiName 'ShowInstalledContext'
$uiHash.UpdateHistoryMenu = Resolve-UiName 'UpdateHistoryMenu'
$uiHash.ViewUpdateLogContext = Resolve-UiName 'ViewUpdateLogContext'
$uiHash.WindowsUpdateServiceMenu = Resolve-UiName 'WindowsUpdateServiceMenu'
$uiHash.WURestartServiceMenu = Resolve-UiName 'WURestartServiceMenu'
$uiHash.WUStartServiceMenu = Resolve-UiName 'WUStartServiceMenu'
$uiHash.WUStopServiceMenu = Resolve-UiName 'WUStopServiceMenu'
$uiHash.ExportReportMenu = Resolve-UiName 'ExportReportMenu'
$uiHash.IsRefreshing = $false
#endregion Connect to controls

#region Event ScriptBlocks
$eventWindowInit = { #Runs before opening window
    $Script:SortHash = @{ }
    
    #Sort event handler
    [System.Windows.RoutedEventHandler]$Global:ColumnSortHandler = {
        If ($_.OriginalSource -is [System.Windows.Controls.GridViewColumnHeader]) {
            Write-Verbose ('{0}' -f $_.Originalsource.getType().FullName)
            If ($_.OriginalSource -AND $_.OriginalSource.Role -ne 'Padding') {
                if (-not $_.Originalsource.Column.DisplayMemberBinding) { return }
                $Column = $_.Originalsource.Column.DisplayMemberBinding.Path.Path
                Write-Debug ('Sort: {0}' -f $Column)
                If ($SortHash[$Column] -eq 'Ascending') {
                    $SortHash[$Column] = 'Descending'
                }
                Else {
                    $SortHash[$Column] = 'Ascending'
                }
                $lastColumnsort = $Column
                $uiHash.Listview.Items.SortDescriptions.clear()
                Write-Verbose ('Sorting {0} by {1}' -f $Column, $SortHash[$Column])
                $uiHash.Listview.Items.SortDescriptions.Add((New-Object System.ComponentModel.SortDescription $Column, $SortHash[$Column]))
                $uiHash.Listview.Items.Refresh()
            }
        }
    }
    $uiHash.Listview.AddHandler([System.Windows.Controls.GridViewColumnHeader]::ClickEvent, $ColumnSortHandler)
    # Capture script-scope references so the global event handler can see them.
    $selSetRef = $selectedComputersSet
    $pendSetRef = $pendingRebootSet
    $countersUiRef = $UpdateCountersUiScript
    $Global:ServerCheckChangedHandler = {
        try {
            if ($_.OriginalSource -and $_.OriginalSource.DataContext) {
                $ctx = $_.OriginalSource.DataContext
                $key = [string]$ctx.Computer
                if (-not [string]::IsNullOrWhiteSpace($key)) {
                    if ($ctx.IsChecked) {
                        $selSetRef[$key] = $true
                        if ($ctx.RebootRequired) {
                            $pendSetRef[$key] = $true
                        }
                        else {
                            if ($pendSetRef.ContainsKey($key)) { $pendSetRef.Remove($key) | Out-Null }
                        }
                    }
                    else {
                        if ($selSetRef.ContainsKey($key)) { $selSetRef.Remove($key) | Out-Null }
                        if ($pendSetRef.ContainsKey($key)) { $pendSetRef.Remove($key) | Out-Null }
                    }
                }
            }
            if ($countersUiRef) { & $countersUiRef }
        }
        catch {
            try {
                Write-Log -Computer 'LOCAL' -Action 'ServerCheckChanged' -Result 'Error' -Details $_.Exception.Message
            }
            catch {}
        }
    }.GetNewClosure()
    $uiHash.Listview.AddHandler([System.Windows.Controls.Primitives.ToggleButton]::CheckedEvent, [System.Windows.RoutedEventHandler]$Global:ServerCheckChangedHandler)
    $uiHash.Listview.AddHandler([System.Windows.Controls.Primitives.ToggleButton]::UncheckedEvent, [System.Windows.RoutedEventHandler]$Global:ServerCheckChangedHandler)

    #Create and bind the observable collection to the GridView
    $uiHash.clientObservable = New-Object System.Collections.ObjectModel.ObservableCollection[object]
    $uiHash.ListView.ItemsSource = $uiHash.clientObservable

    $groups = @(Get-GroupData)
    $uiHash.GroupComboBox.Items.Clear()
    foreach ($groupName in $groups) {
        [void]$uiHash.GroupComboBox.Items.Add($groupName)
    }
    $uiHash.GroupComboBox.SelectedIndex = -1
    $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
            $uiHash.StatusTextBox.Foreground = 'Black'
            $uiHash.StatusTextBox.Text = "Seleccione un grupo para cargar servidores. Grupos detectados: $($groups.Count)"
        })
    Update-RestartSelectedButtonState
}
$eventWindowClose = { #Runs when WUU closes
    #Halt job processing
    $jobCleanup.Flag = $False

    #Stop all runspaces
    $jobCleanup.PowerShell.Dispose()
    
    #Cleanup
    [gc]::Collect()
    [gc]::WaitForPendingFinalizers()    
}
$eventAddAD = { #Add computers from Active Directory
    #region OUPicker
    $OUPickerHash = [hashtable]::Synchronized(@{ })
    try {
        $ouPickerPath = Join-Path $ScriptRoot 'OUPicker.xaml'
        if (-not (Test-Path $ouPickerPath)) {
            Write-Warning "No se encontro OUPicker.xaml en $ScriptRoot"
            return
        }
        [xml]$xaml = Get-Content -LiteralPath $ouPickerPath
        $reader = (New-Object System.Xml.XmlNodeReader $xaml)
        $OUPickerHash.Window = [Windows.Markup.XamlReader]::Load($reader)
    }
    catch {
        Write-Warning 'Unable to load XAML data for OUPicker!'
        return
    }

    $OUPickerHash.OKButton = $OUPickerHash.Window.FindName('OKButton')
    $OUPickerHash.CancelButton = $OUPickerHash.Window.FindName('CancelButton')
    $OUPickerHash.OUTree = $OUPickerHash.Window.FindName('OUTree')

    $OUPickerHash.OKButton.Add_Click( {
            if ($OUPickerHash.OUTree.SelectedItem) {
                $OUPickerHash.SelectedOU = $OUPickerHash.OUTree.SelectedItem.Tag
            }
            $OUPickerHash.Window.Close()
        })
    $OUPickerHash.CancelButton.Add_Click( { $OUPickerHash.Window.Close() })

    $Searcher = New-Object System.DirectoryServices.DirectorySearcher
    $Searcher.Filter = "(objectCategory=organizationalUnit)"
    $Searcher.SearchScope = "OneLevel"

    $rootItem = New-Object System.Windows.Controls.TreeViewItem
    $rootItem.Header = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().Name
    $rootItem.Tag = $Searcher.SearchRoot.distinguishedName

    function Populate-Children($node) {
        $Searcher.SearchRoot = New-Object System.DirectoryServices.DirectoryEntry("LDAP://$($node.Tag)")
        $Searcher.FindAll() | % {
            $childItem = New-Object System.Windows.Controls.TreeViewItem
            $childItem.Header = $_.Properties.name[0]
            $childItem.Tag = $_.Properties.distinguishedname
            Populate-Children($childItem)
            $node.AddChild($childItem)
        }
    }
    Populate-Children($rootItem)
    $OUPickerHash.OUTree.AddChild($rootItem)

    $OUPickerHash.Window.ShowDialog() | Out-Null
    #endregion
    
    #Verify user didn't hit 'cancel' before processing
    if ($OUPickerHash.SelectedOU) {
        #Update status
        $uiHash.StatusTextBox.Dispatcher.Invoke('Normal', [action] {
                $uiHash.StatusTextBox.Foreground = 'Black'
                $uiHash.StatusTextBox.Text = 'Querying Active Directory for Computers...'
            })

        #Search LDAP path
        $Searcher = [adsisearcher]''
        $Searcher.SearchRoot = [adsi]"LDAP://$($OUPickerHash.SelectedOU)"
        $Searcher.Filter = ('(&(objectCategory=computer)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))')
        $Searcher.PropertiesToLoad.Add('name') | Out-Null
        $Results = $Searcher.FindAll()
        if ($Results) {
            #Add computers found
            &$AddEntry ($Results | % { $_.Properties.name })

            #Update status
            $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                    $uiHash.StatusTextBox.Text = "Successfully Imported $($Results.Count) computers from Active Directory."
                })
        }
        else {
            #Update status
            $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                    $uiHash.StatusTextBox.Foreground = 'Red'
                    $uiHash.StatusTextBox.Text = 'No computers found, verify LDAP path...'
                })
        }
    }
}
$eventAddComputer = { #Add computers by typing them in manually
    #Open prompt
    $computer = [Microsoft.VisualBasic.Interaction]::InputBox('Enter a computer name or names. Separate computers with a comma (,) or semi-colon (;).', 'Add Computer(s)')

    #Verify computers were input
    If (-Not [System.String]::IsNullOrEmpty($computer)) {
        [string[]]$computername = $computer -split ',|;' #Parse
    }
    if ($computername) { &$AddEntry $computername } #Add computers
}
$eventAddFile = { #Add computers from a file
    #Open file dialog
    $dlg = new-object microsoft.win32.OpenFileDialog
    $dlg.DefaultExt = '*.txt'
    $dlg.Filter = 'Text Files |*.txt;*.csv'
    $dlg.InitialDirectory = $pwd
    [void]$dlg.showdialog()
    $File = $dlg.FileName

    #Verify file was selected
    If (-Not ([system.string]::IsNullOrEmpty($File))) {
        $entries = @(Get-Content $File | Where-Object { $_ -ne '' })
        Write-Verbose "Loaded $($entries.Count) entries from file"
        &$AddEntry $entries #Add computers

        #Update Status
        $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                $uiHash.StatusTextBox.Foreground = 'Black'
                $uiHash.StatusTextBox.Text = "Successfully Added $($entries.Count) Computers from $File."
            })
    }
}
$eventReloadGroups = {
    $groups = @(Get-GroupData)
    $uiHash.GroupComboBox.Items.Clear()
    foreach ($groupName in $groups) {
        [void]$uiHash.GroupComboBox.Items.Add($groupName)
    }
    $uiHash.GroupComboBox.SelectedIndex = -1
    $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
            $uiHash.StatusTextBox.Foreground = 'Black'
            $uiHash.StatusTextBox.Text = "Grupos recargados correctamente: $($groups.Count)"
        })
    Update-RestartSelectedButtonState
}
$eventGroupChanged = {
    $selectedGroup = [string]$uiHash.GroupComboBox.SelectedItem
    if ([string]::IsNullOrWhiteSpace($selectedGroup)) {
        return
    }
    if (-not $groupServersHash.ContainsKey($selectedGroup)) {
        $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                $uiHash.StatusTextBox.Foreground = 'Red'
                $uiHash.StatusTextBox.Text = "No se encontraron servidores para el grupo '$selectedGroup'."
            })
        return
    }
    &$ClearComputerList
    $servers = @($groupServersHash[$selectedGroup])
    if ($servers.Count -eq 0) {
        $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                $uiHash.StatusTextBox.Foreground = 'Red'
                $uiHash.StatusTextBox.Text = "El grupo '$selectedGroup' no contiene servidores validos."
            })
        return
    }
    &$AddEntry $servers
    $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
            $uiHash.StatusTextBox.Foreground = 'Black'
            $uiHash.StatusTextBox.Text = "Grupo '$selectedGroup' cargado con $($servers.Count) servidor(es)."
        })
    Update-RestartSelectedButtonState
}
$eventSelectAllChecked = {
    $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
            foreach ($item in $uiHash.Listview.Items) {
                $uiHash.Listview.Items.EditItem($item)
                $item.IsChecked = $true
                if ($item.Phase -eq 'Idle') { $item.Phase = 'Idle' }
                $uiHash.Listview.Items.CommitEdit()
            }
            $uiHash.Listview.Items.Refresh()
        })
    Update-RestartSelectedButtonState
}
$eventClearChecked = {
    $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
            foreach ($item in $uiHash.Listview.Items) {
                $uiHash.Listview.Items.EditItem($item)
                $item.IsChecked = $false
                $item.Phase = 'Idle'
                $uiHash.Listview.Items.CommitEdit()
            }
            $uiHash.Listview.Items.Refresh()
        })
    Update-RestartSelectedButtonState
}
$eventStartSelected = {
    try {
        $targets = @(Get-CheckedComputers)
        if ($targets.Count -eq 0) {
            $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                    $uiHash.StatusTextBox.Foreground = 'Red'
                    $uiHash.StatusTextBox.Text = 'No hay servidores seleccionados para iniciar.'
                })
            return
        }

        # Lock every row's checkbox so the operator cannot toggle selection while
        # the cycle is running. The locks are released by Detener y refrescar.
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                foreach ($item in $uiHash.Listview.Items) {
                    try {
                        $uiHash.Listview.Items.EditItem($item)
                        $item.CanCheck = $false
                        $uiHash.Listview.Items.CommitEdit()
                    }
                    catch {}
                }
                $uiHash.Listview.Items.Refresh()
            })

        $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                $uiHash.StatusTextBox.Foreground = 'Black'
                $uiHash.StatusTextBox.Text = "Iniciando actualizacion en $($targets.Count) servidor(es) seleccionados. Seleccion bloqueada hasta Detener y refrescar."
            })

        $targets | ForEach-Object {
            $target = $_
            try {
                Ensure-ComputerRunspace $target
                $temp = "" | Select-Object PowerShell, Runspace
                $temp.PowerShell = [powershell]::Create().AddScript($PrepareWUAgentBeforeCheck).AddArgument($target)
                $temp.PowerShell.AddScript($GetUpdates).AddArgument($target)
                $temp.PowerShell.AddScript($MaybeAutoDownloadAfterInitialCheck).AddArgument($target)
                $temp.PowerShell.AddScript($SetUpdatesStatus).AddArgument($target)
                $temp.PowerShell.Runspace = $target.Runspace
                $temp.Runspace = $temp.PowerShell.BeginInvoke()
                $jobs.Add($temp) | Out-Null
            }
            catch {
                Write-Log -Computer $target.Computer -Action 'StartSelected' -Result 'Error' -Details $_.Exception.Message
                $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                        $uiHash.Listview.Items.EditItem($target)
                        $target.Status = "Error al iniciar: $($_.Exception.Message)"
                        $uiHash.Listview.Items.CommitEdit()
                        $uiHash.Listview.Items.Refresh()
                    })
            }
        }
    }
    catch {
        Write-Log -Computer 'LOCAL' -Action 'StartSelected' -Result 'Error' -Details $_.Exception.Message
        $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                $uiHash.StatusTextBox.Foreground = 'Red'
                $uiHash.StatusTextBox.Text = "Error general al iniciar: $($_.Exception.Message)"
            })
    }
}
$eventRestartSelected = {
    $targets = @(
        Get-CheckedComputers | Where-Object { $_.RebootRequired -eq $true }
    )
    if ($targets.Count -eq 0) {
        $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                $uiHash.StatusTextBox.Foreground = 'Red'
                $uiHash.StatusTextBox.Text = 'No hay servidores seleccionados que requieran reinicio.'
            })
        return
    }

    $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
            $uiHash.StatusTextBox.Foreground = 'Black'
            $uiHash.StatusTextBox.Text = "Reiniciando $($targets.Count) servidor(es) seleccionado(s) con reinicio pendiente..."
        })

    $targets | ForEach-Object {
        $target = $_
        Ensure-ComputerRunspace $target
        $temp = "" | Select-Object PowerShell, Runspace
        $temp.PowerShell = [powershell]::Create().AddScript($RestartComputer).AddArgument($target).AddArgument($false)
        $temp.PowerShell.AddScript($GetUpdates).AddArgument($target)
        $temp.PowerShell.AddScript($SetUpdatesStatus).AddArgument($target)
        $temp.PowerShell.Runspace = $target.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
    Update-RestartSelectedButtonState
}
# Capture script-scope references so the click handler resolves them via closure
# regardless of the scope WPF/Add_Click invokes the scriptblock in.
$stopRefreshUiRef = $uiHash
$stopRefreshJobsRef = $jobs
$stopRefreshSelSetRef = $selectedComputersSet
$stopRefreshPendSetRef = $pendingRebootSet
$stopRefreshUpdatesRef = $updatesHash
$stopRefreshCountersUiRef = $UpdateCountersUiScript

$eventStopAndRefresh = {
    try {
        Write-Log -Computer 'LOCAL' -Action 'StopAndRefresh' -Result 'Info' -Details 'Click recibido en Detener y refrescar.'
    }
    catch {}

    if ($null -eq $stopRefreshUiRef) {
        try { Write-Log -Computer 'LOCAL' -Action 'StopAndRefresh' -Result 'Error' -Details 'uiHash no disponible en el handler.' } catch {}
        return
    }

    if ($stopRefreshUiRef['IsRefreshing']) {
        try {
            Write-Log -Computer 'LOCAL' -Action 'StopAndRefresh' -Result 'Warning' -Details 'Refresh ya estaba en progreso; se resetea el flag para permitir reintento.'
        }
        catch {}
        $stopRefreshUiRef['IsRefreshing'] = $false
    }

    try {
        $confirmResult = [System.Windows.MessageBox]::Show(
            $stopRefreshUiRef['Window'],
            'Esto detendra las tareas en ejecucion y refrescara el estado de todos los servidores. Deseas continuar?',
            'Confirmar detener y refrescar',
            [System.Windows.MessageBoxButton]::YesNo,
            [System.Windows.MessageBoxImage]::Question
        )
    }
    catch {
        try {
            Write-Log -Computer 'LOCAL' -Action 'StopAndRefresh' -Result 'Error' -Details "MessageBox fallo: $($_.Exception.Message). Continuando sin confirmacion."
        }
        catch {}
        $confirmResult = [System.Windows.MessageBoxResult]::Yes
    }
    if ($confirmResult -ne [System.Windows.MessageBoxResult]::Yes) {
        return
    }

    $stopRefreshUiRef['IsRefreshing'] = $true

    $setControlsEnabled = {
        param([bool]$On)
        $controlKeys = @('GroupComboBox','SelectAllButton','ClearSelectionButton','StartButton','RestartSelectedButton','ReportButton','ReloadGroupsButton')
        foreach ($k in $controlKeys) {
            $ctrl = $stopRefreshUiRef[$k]
            if ($ctrl) { try { $ctrl.IsEnabled = $On } catch {} }
        }
        $stopBtn = $stopRefreshUiRef['StopRefreshButton']
        if ($stopBtn) { try { $stopBtn.IsEnabled = $true } catch {} }
    }

    try { & $setControlsEnabled $false } catch {}

    $statusBox = $stopRefreshUiRef['StatusTextBox']
    if ($statusBox -and $statusBox.Dispatcher) {
        try {
            $statusBox.Dispatcher.Invoke('Background', [action] {
                    $statusBox.Foreground = 'DarkBlue'
                    $statusBox.Text = 'Deteniendo tareas en ejecucion y refrescando estado...'
                })
        }
        catch {}
    }

    try {
        if ($stopRefreshJobsRef) {
            $snapshotJobs = @($stopRefreshJobsRef)
            foreach ($jobItem in $snapshotJobs) {
                try { if ($jobItem.PowerShell) { $jobItem.PowerShell.Stop() } } catch {}
                try { if ($jobItem.Runspace -and $jobItem.PowerShell) { $jobItem.PowerShell.EndInvoke($jobItem.Runspace) | Out-Null } } catch {}
                try { if ($jobItem.PowerShell) { $jobItem.PowerShell.Dispose() } } catch {}
                try { $stopRefreshJobsRef.Remove($jobItem) | Out-Null } catch {}
            }
        }

        $listView = $stopRefreshUiRef['Listview']
        $items = @()
        if ($listView) {
            try { $items = @($listView.Items) } catch {}
        }
        if ($stopRefreshSelSetRef) { try { $stopRefreshSelSetRef.Clear() } catch {} }
        if ($stopRefreshPendSetRef) { try { $stopRefreshPendSetRef.Clear() } catch {} }
        if ($stopRefreshUpdatesRef) { try { $stopRefreshUpdatesRef.Clear() } catch {} }

        foreach ($item in $items) {
            try { if ($item.Runspace) { $item.Runspace.Dispose() } } catch {}
        }

        if ($listView -and $listView.Dispatcher) {
            try {
                $listView.Dispatcher.Invoke('Background', [action] {
                        foreach ($item in $items) {
                            try { $listView.Items.EditItem($item) } catch {}
                            try { $item.Available = 0 } catch {}
                            try { $item.Downloaded = 0 } catch {}
                            try { $item.DownloadPercent = '0%' } catch {}
                            try { $item.InstallErrors = '' } catch {}
                            try { $item.WsusServer = 'Sin consultar' } catch {}
                            try { $item.CanCheck = $true } catch {}
                            try { $item.Status = 'Refrescado. Listo para iniciar.' } catch {}
                            try { $item.RebootRequired = $false } catch {}
                            try { $item.UpdatesStatus = 'Unknown' } catch {}
                            try { $item.Phase = 'Idle' } catch {}
                            try { $item.StartTime = $null } catch {}
                            try { $item.EndTime = $null } catch {}
                            try { $item.Runspace = $null } catch {}
                            try { $listView.Items.CommitEdit() } catch {}
                        }
                        try { $listView.Items.Refresh() } catch {}
                    })
            }
            catch {}
        }

        foreach ($item in $items) {
            try {
                if ($item.IsChecked -and $stopRefreshSelSetRef) {
                    $stopRefreshSelSetRef[[string]$item.Computer] = $true
                }
            }
            catch {}
        }

        if ($statusBox -and $statusBox.Dispatcher) {
            try {
                $statusBox.Dispatcher.Invoke('Background', [action] {
                        $statusBox.Foreground = 'DarkGreen'
                        $statusBox.Text = 'Refresh finalizado. Ya puedes ejecutar Iniciar nuevamente.'
                    })
            }
            catch {}
        }
    }
    catch {
        try {
            Write-Log -Computer 'LOCAL' -Action 'StopAndRefresh' -Result 'Error' -Details $_.Exception.Message
        }
        catch {}
        if ($statusBox -and $statusBox.Dispatcher) {
            try {
                $statusBox.Dispatcher.Invoke('Background', [action] {
                        $statusBox.Foreground = 'Red'
                        $statusBox.Text = "Error durante refresh: $($_.Exception.Message)"
                    })
            }
            catch {}
        }
    }
    finally {
        try { $stopRefreshUiRef['IsRefreshing'] = $false } catch {}
        try { & $setControlsEnabled $true } catch {}
        try { if ($stopRefreshCountersUiRef) { & $stopRefreshCountersUiRef } } catch {}
        try {
            Write-Log -Computer 'LOCAL' -Action 'StopAndRefresh' -Result 'Success' -Details 'Refresh completado.'
        }
        catch {}
    }
}.GetNewClosure()
$eventGetUpdates = {
    $uiHash.Listview.SelectedItems | % {
        Ensure-ComputerRunspace $_
        $temp = "" | Select-Object PowerShell, Runspace
        $temp.PowerShell = [powershell]::Create().AddScript($PrepareWUAgentBeforeCheck).AddArgument($_)
        $temp.PowerShell.AddScript($GetUpdates).AddArgument($_)
        $temp.PowerShell.AddScript($SetUpdatesStatus).AddArgument($_)
        $temp.PowerShell.Runspace = $_.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
$eventDownloadUpdates = {
    $uiHash.Listview.SelectedItems | % {
        Ensure-ComputerRunspace $_
        #Don't bother downloading if nothing available.
        if ($_.Available -eq $_.Downloaded) {
            #Update status
            $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                    $uiHash.Listview.Items.EditItem($_)
                    $_.Status = 'There are no updates available to download.'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
            return
        }

        $temp = "" | Select-Object PowerShell, Runspace
        $temp.PowerShell = [powershell]::Create().AddScript($DownloadUpdates).AddArgument($_)
        $temp.PowerShell.AddScript($SetUpdatesStatus).AddArgument($_)
        $temp.PowerShell.Runspace = $_.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
$eventInstallUpdates = {
    $uiHash.Listview.SelectedItems | % {
        Ensure-ComputerRunspace $_
        #Check if there are any updates that are downloaded and don't require user input
        if (-not ($updatesHash[$_.computer] | Where-Object { $_.IsDownloaded -and $_.InstallationBehavior.CanRequestUserInput -eq $false })) {
            #Update status
            $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                    $uiHash.Listview.Items.EditItem($_)
                    $_.Status = 'There are no updates available that can be installed remotely.'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
			
            #No need to continue if there are no updates to install.
            return
        }

        $temp = "" | Select-Object PowerShell, Runspace
        # Instalacion sin reinicio automatico; refrescar estado de actualizaciones
        $temp.PowerShell = [powershell]::Create().AddScript($InstallUpdates).AddArgument($_)
        $temp.PowerShell.AddScript($GetUpdates).AddArgument($_)
        $temp.PowerShell.AddScript($SetUpdatesStatus).AddArgument($_)
        $temp.PowerShell.Runspace = $_.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
$eventRemoveOfflineComputer = {
    $uiHash.Listview.Items | % {
        Ensure-ComputerRunspace $_
        $temp = "" | Select-Object PowerShell, Runspace
        $temp.PowerShell = [powershell]::Create().AddScript($RemoveOfflineComputer).AddArgument($_).AddArgument($RemoveEntry)
        $temp.PowerShell.Runspace = $_.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
$eventRestartComputer = {
    $uiHash.Listview.SelectedItems | % {
        Ensure-ComputerRunspace $_
        $temp = "" | Select-Object PowerShell, Runspace
        # Solo comprobar actualizaciones tras el reinicio (sin descarga automatica ni Prepare)
        $temp.PowerShell = [powershell]::Create().AddScript($RestartComputer).AddArgument($_).AddArgument($false)
        $temp.PowerShell.AddScript($GetUpdates).AddArgument($_)
        $temp.PowerShell.AddScript($SetUpdatesStatus).AddArgument($_)		
        $temp.PowerShell.Runspace = $_.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
$eventKeyDown = { 
    If ([System.Windows.Input.Keyboard]::IsKeyDown('RightCtrl') -OR [System.Windows.Input.Keyboard]::IsKeyDown('LeftCtrl')) {
        Switch ($_.Key) {
            'A' { $uiHash.Listview.SelectAll() }
            'O' { &$eventAddFile }
            'S' { &$eventSaveComputerList }
            Default { $Null }
        }
    }
    ElseIf ($_.Key -eq 'Delete') { &$removeEntry @($uiHash.Listview.SelectedItems) }
}
$eventRightClick = {
    # Helper to safely toggle IsEnabled on any context-menu item that may be $null
    # when WPF's FindName fails to resolve children of a ContextMenu's name scope.
    $setEnabled = {
        param([string]$Key, [bool]$On)
        $ctrl = $uiHash[$Key]
        if ($null -ne $ctrl) {
            try { $ctrl.IsEnabled = $On } catch {}
        }
    }

    $selectedItems = @()
    try { $selectedItems = @($uiHash.Listview.SelectedItems) } catch {}
    $count = $selectedItems.Count

    if ($count -eq 0) {
        foreach ($k in @('RemoveComputerContext','RemoteDesktopContext','CheckUpdatesContext','DownloadUpdatesContext','InstallUpdatesContext','RestartContext','ShowInstalledContext','ShowUpdatesContext','UpdateHistoryMenu','ViewUpdateLogContext','WindowsUpdateServiceMenu','ReportStatusContext')) {
            & $setEnabled $k $false
        }
    }
    elseif ($count -eq 1) {
        foreach ($k in @('RemoveComputerContext','RemoteDesktopContext','CheckUpdatesContext','RestartContext','ShowInstalledContext','UpdateHistoryMenu','ViewUpdateLogContext','WindowsUpdateServiceMenu','ReportStatusContext')) {
            & $setEnabled $k $true
        }
        $hasDownloaded = $false
        try { $hasDownloaded = ($selectedItems[0].Downloaded -ge 1) } catch {}
        & $setEnabled 'InstallUpdatesContext' $hasDownloaded

        $hasAvailable = $false
        try { $hasAvailable = ($selectedItems[0].Available -gt 0) } catch {}
        & $setEnabled 'ShowUpdatesContext' $hasAvailable
        & $setEnabled 'DownloadUpdatesContext' $hasAvailable
    }
    else {
        foreach ($k in @('RemoveComputerContext','CheckUpdatesContext','DownloadUpdatesContext','InstallUpdatesContext','ReportStatusContext','RestartContext','WindowsUpdateServiceMenu')) {
            & $setEnabled $k $true
        }
        foreach ($k in @('RemoteDesktopContext','ShowInstalledContext','ShowUpdatesContext','UpdateHistoryMenu','ViewUpdateLogContext')) {
            & $setEnabled $k $false
        }
    }
}
$eventSaveComputerList = {
    If ($uiHash.Listview.Items.count -gt 0) {
        #Save dialog
        $dlg = new-object Microsoft.Win32.SaveFileDialog
        $dlg.FileName = 'Computer List'
        $dlg.DefaultExt = '*.txt'
        $dlg.Filter = 'Text files (*.txt)|*.txt|CSV files (*.csv)|*.csv'
        $dlg.InitialDirectory = $pwd
        [void]$dlg.showdialog()
        $filePath = $dlg.FileName

        #Verify file was selected
        If (-Not ([system.string]::IsNullOrEmpty($filepath))) {
            #Save file
            $uiHash.Listview.Items | Select -Expand Computer | Out-File $filePath -Force

            #Update status
            $uiHash.StatusTextBox.Dispatcher.Invoke('Normal', [action] {
                    $uiHash.StatusTextBox.Foreground = 'Black'
                    $uiHash.StatusTextBox.Text = "Computer List saved to $filePath"
                }) 
        }
    }
    Else {
        #No items selected
        #Update status
        $uiHash.StatusTextBox.Dispatcher.Invoke('Normal', [action] {
                $uiHash.StatusTextBox.Foreground = 'Red'
                $uiHash.StatusTextBox.Text = 'Computer List not saved, there are no computers in the list!' 
            })        
    }
}
$eventShowAvailableUpdates = {
    ForEach ($Computer in $uiHash.Listview.SelectedItems) {
        $updatesHash[$computer.computer] | Select Title, Description, IsDownloaded, IsMandatory, IsUninstallable, @{n = 'CanRequestUserInput'; e = { $_.InstallationBehavior.CanRequestUserInput } }, LastDeploymentChangeTime, @{n = 'MaxDownloadSize (MB)'; e = { '{0:N2}' -f ($_.MaxDownloadSize / 1MB) } }, @{n = 'MinDownloadSize (MB)'; e = { '{0:N2}' -f ($_.MinDownloadSize / 1MB) } }, RecommendedCpuSpeed, RecommendedHardDiskSpace, RecommendedMemory, DriverClass, DriverManufacturer, DriverModel, DriverProvider, DriverVerDate | Out-GridView -Title "$($Computer.computer)'s Available Updates"
    }
}
$eventShowInstalledUpdates = {
    ForEach ($Computer in $uiHash.Listview.SelectedItems) {
        try {

            $updatesession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', $Computer.computer))
            $updatesearcher = $updatesession.CreateUpdateSearcher()
            $updatesearcher.Search('IsInstalled=1').Updates | Select Title, Description, IsUninstallable, SupportUrl | Out-GridView -Title "$($Computer.computer)'s Installed Updates"
        }
        catch [System.Management.Automation.MethodInvocationException] {
            $commandEvent = {
                
                $updatesession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', 'localhost'))
                $updatesearcher = $updatesession.CreateUpdateSearcher()
                $out = $updatesearcher.Search('IsInstalled=1').Updates
                Write-Output $out

            }
            $InstalledEvent = Invoke-Command -ScriptBlock $commandEvent -ComputerName $computer.computer -HideComputerName
            $InstalledEvent | Select Title, Description, IsUninstallable, SupportUrl | Out-GridView -Title "$($Computer.computer)'s Installed Updates"
        } # try catch
    } # foreach
}
$eventShowUpdateHistory = {
    Try {
        $computer = $uiHash.Listview.SelectedItems | Select -First 1
        #Get installed hotfix, create popup
        try {
            $updatesession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', $computer.computer))
            $updatesearcher = $updatesession.CreateUpdateSearcher()
            $updates = $updateSearcher.QueryHistory(1, $updateSearcher.GetTotalHistoryCount())
            $updates | Select-Object -Property `
            @{name = "Operation"; expression = { switch ($_.Operation) { 1 { "Installation" }; 2 { "Uninstallation" }; 3 { "Other" } } } }, `
            @{name = "Result"; expression = { switch ($_.ResultCode) { 1 { "Success" }; 2 { "Success (reboot required)" }; 4 { "Failure" } } } }, `
            @{n = 'HResult'; e = { '0x' + [Convert]::ToString($_.HResult, 16) } }, `
                Date, Title, Description, SupportUrl | Out-GridView -Title "$($computer.computer)'s Update History"
            
        }
        catch [System.Management.Automation.MethodInvocationException] {
            $commandHistory = {
                $updatesession = [activator]::CreateInstance([type]::GetTypeFromProgID('Microsoft.Update.Session', 'localhost'))
                $updatesearcher = $updatesession.CreateUpdateSearcher()
                $updates = $updateSearcher.QueryHistory(1, $updateSearcher.GetTotalHistoryCount())
                Write-Output $updates
                
            }
            $Updates = Invoke-Command -ScriptBlock $commandHistory -ComputerName $computer.computer -HideComputerName
            $updates | Select-Object -Property `
            @{name = "Operation"; expression = { switch ($_.Operation) { 1 { "Installation" }; 2 { "Uninstallation" }; 3 { "Other" } } } }, `
            @{name = "Result"; expression = { switch ($_.ResultCode) { 1 { "Success" }; 2 { "Success (reboot required)" }; 4 { "Failure" } } } }, `
            @{n = 'HResult'; e = { '0x' + [Convert]::ToString($_.HResult, 16) } }, `
                Date, Title, Description, SupportUrl | Out-GridView -Title "$($computer.computer)'s Update History"
        }
    }
    Catch {
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($computer)
                $computer.Status = "Error occurred: $($_.exception.Message)"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
}
$eventViewUpdateLog = {
    $uiHash.Listview.SelectedItems | % {
        &"\\$($_.computer)\c$\windows\windowsupdate.log"
    }
}
$eventWUServiceAction = {
    Param ($Action)
    $uiHash.Listview.SelectedItems | % {
        Ensure-ComputerRunspace $_
        $temp = "" | Select-Object PowerShell, Runspace
        $temp.PowerShell = [powershell]::Create().AddScript($WUServiceAction).AddArgument($_).AddArgument($Action)
        $temp.PowerShell.Runspace = $_.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
$eventReportStatus = {
    $uiHash.Listview.SelectedItems | ForEach-Object {
        $sel = $_
        Ensure-ComputerRunspace $sel
        $temp = '' | Select-Object PowerShell, Runspace
        $temp.PowerShell = [powershell]::Create().AddScript($ReportStatus).AddArgument($sel)
        $temp.PowerShell.Runspace = $sel.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
$eventExportReport = {
    $targets = @(Get-CheckedComputers)
    if ($targets.Count -eq 0) {
        $targets = @($uiHash.clientObservable)
    }
    if ($targets.Count -eq 0) {
        [System.Windows.MessageBox]::Show('No hay servidores para reportar.')
        return
    }

    $ReportesDir = Join-Path $ScriptRoot "Reportes"
    if (-not (Test-Path -Path $ReportesDir)) {
        New-Item -Path $ReportesDir -ItemType Directory -Force | Out-Null
    }

    $CsvFileName = "Reporte_Instalacion_KBs_$(Get-Date -Format 'yyyyMMdd_HHmm').csv"
    $CsvPath = Join-Path $ReportesDir $CsvFileName
    $ReportData = New-Object System.Collections.Generic.List[PSObject]
    $uiHash.Window.Cursor = [System.Windows.Input.Cursors]::Wait

    foreach ($target in $targets) {
        $Computer = [string]$target.Computer
        $Domain = 'N/A'
        $IP = 'N/A'
        $OS = 'N/A'
        $FechaInstalacion = 'N/A'
        $KBsInstaladas = 'Ninguna/No detectada'
        $FechaReinicio = 'N/A'
        $DescripcionError = if ($target.InstallErrors) { [string]$target.InstallErrors } else { 'N/A' }

        try {
            if (Test-Connection -ComputerName $Computer -Count 1 -Quiet) {
                $remoteInfo = Invoke-Command -ComputerName $Computer -ScriptBlock {
                    $domain = (Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue).Domain
                    $osInfo = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
                    $ips = @(
                        Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
                        Where-Object { $_.IPAddress -and $_.IPAddress -notlike '169.254*' } |
                        Select-Object -ExpandProperty IPAddress
                    )
                    $hotFixes = @(Get-HotFix -ErrorAction SilentlyContinue | Where-Object { $_.InstalledOn })
                    $lastBoot = if ($osInfo) { [datetime]$osInfo.LastBootUpTime } else { $null }
                    $latestInstall = $null
                    if ($hotFixes.Count -gt 0) {
                        $latestInstall = ($hotFixes | Sort-Object InstalledOn -Descending | Select-Object -First 1).InstalledOn
                    }
                    $today = (Get-Date).Date
                    $kbsToday = @(
                        $hotFixes |
                        Where-Object { ([datetime]$_.InstalledOn).Date -ge $today } |
                        Select-Object -ExpandProperty HotFixID
                    )
                    [PSCustomObject]@{
                        Domain = if ($domain) { $domain } else { 'N/A' }
                        IP = if ($ips.Count -gt 0) { ($ips -join ', ') } else { 'N/A' }
                        OS = if ($osInfo) { $osInfo.Caption } else { 'N/A' }
                        LastBoot = $lastBoot
                        LastInstall = $latestInstall
                        KBsToday = if ($kbsToday.Count -gt 0) { $kbsToday -join ', ' } else { 'Ninguna/No detectada' }
                    }
                } -ErrorAction Stop

                if ($remoteInfo) {
                    $Domain = $remoteInfo.Domain
                    $IP = $remoteInfo.IP
                    $OS = $remoteInfo.OS
                    if ($remoteInfo.LastInstall) {
                        $FechaInstalacion = ([datetime]$remoteInfo.LastInstall).ToString('dd/MM/yyyy')
                    }
                    if ($remoteInfo.LastBoot) {
                        $FechaReinicio = ([datetime]$remoteInfo.LastBoot).ToString('dd/MM/yyyy HH:mm')
                    }
                    $KBsInstaladas = [string]$remoteInfo.KBsToday
                }
            }
        }
        catch {
            if ($DescripcionError -eq 'N/A') {
                $DescripcionError = $_.Exception.Message
            }
        }

        $Obj = [PSCustomObject]@{
            Dominio           = $Domain
            Servidor          = $Computer
            IP                = $IP
            Sistema_Operativo = $OS
            Fecha_Instalacion = $FechaInstalacion
            KBs_Instaladas    = $KBsInstaladas
            Fecha_Reinicio    = $FechaReinicio
            Descripcion_Error = $DescripcionError
        }
        $ReportData.Add($Obj)
    }

    $ReportData | Export-Csv -Path $CsvPath -NoTypeInformation -Encoding UTF8 -Delimiter ","

    # Enviar JSON al Dashboard Web (con preflight, timeouts mas largos y reintentos espaciados)
    $UploadMsg = ''
    $DashboardUrl = 'https://algeibapatching.vercel.app/api/upload'
    if ([string]::IsNullOrWhiteSpace($DashboardUrl)) {
        $UploadMsg = "`n`nSincronizacion con Dashboard deshabilitada (URL vacia)."
        Write-Log -Computer 'LOCAL' -Action 'DashboardUpload' -Result 'Info' -Details 'Upload omitido: URL del dashboard sin configurar.'
    }
    else {
        try {
            $JsonData = @($ReportData) | ConvertTo-Json -Depth 5 -Compress
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
            try { [System.Net.WebRequest]::DefaultWebProxy.Credentials = [System.Net.CredentialCache]::DefaultNetworkCredentials } catch {}

            # Preflight: confirmar resolucion DNS y handshake TCP antes de subir el payload.
            $dashboardHost = ([System.Uri]$DashboardUrl).Host
            $dashboardPort = ([System.Uri]$DashboardUrl).Port
            if ($dashboardPort -le 0) { $dashboardPort = 443 }
            $preflightOk = $false
            try {
                $tcpClient = New-Object System.Net.Sockets.TcpClient
                $iar = $tcpClient.BeginConnect($dashboardHost, $dashboardPort, $null, $null)
                $preflightOk = $iar.AsyncWaitHandle.WaitOne(5000, $false) -and $tcpClient.Connected
                try { $tcpClient.Close() } catch {}
            }
            catch {
                $preflightOk = $false
            }
            if (-not $preflightOk) {
                throw "No se pudo abrir conexion TCP a $dashboardHost`:$dashboardPort en 5s (posible bloqueo de proxy/firewall)."
            }

            Write-Log -Computer 'LOCAL' -Action 'DashboardUpload' -Result 'Info' -Details "Subiendo reporte (size=$([Math]::Ceiling(($JsonData.Length/1KB)))KB) a $DashboardUrl"

            $uploadAttempts = 3
            $uploadOk = $false
            $lastUploadError = $null
            $perAttemptTimeoutSec = 90
            $stopWatch = [System.Diagnostics.Stopwatch]::StartNew()
            for ($attempt = 1; $attempt -le $uploadAttempts; $attempt++) {
                try {
                    $attemptSw = [System.Diagnostics.Stopwatch]::StartNew()
                    Invoke-RestMethod -Uri $DashboardUrl -Method Post -Body $JsonData -ContentType 'application/json' -TimeoutSec $perAttemptTimeoutSec -ErrorAction Stop | Out-Null
                    $attemptSw.Stop()
                    Write-Log -Computer 'LOCAL' -Action 'DashboardUpload' -Result 'Success' -Details "Subida OK en intento $attempt ($([Math]::Round($attemptSw.Elapsed.TotalSeconds,1))s)."
                    $uploadOk = $true
                    break
                }
                catch {
                    $lastUploadError = $_
                    $errDetail = $_.Exception.Message
                    if ($_.Exception.InnerException -and $_.Exception.InnerException.Message) {
                        $errDetail = "$errDetail | $($_.Exception.InnerException.Message)"
                    }
                    Write-Log -Computer 'LOCAL' -Action 'DashboardUpload' -Result 'Warning' -Details "Intento $attempt fallo: $errDetail"
                    if ($attempt -lt $uploadAttempts) {
                        Start-Sleep -Seconds (5 * $attempt)
                    }
                }
            }
            $stopWatch.Stop()

            if (-not $uploadOk) {
                throw $lastUploadError
            }
            $UploadMsg = "`n`nDatos sincronizados con el Dashboard en $([Math]::Round($stopWatch.Elapsed.TotalSeconds,1))s."
        }
        catch {
            $uploadErrorText = $_.Exception.Message
            if ($_.Exception.InnerException -and $_.Exception.InnerException.Message) {
                $uploadErrorText = "$uploadErrorText | Detalle: $($_.Exception.InnerException.Message)"
            }
            Write-Log -Computer 'LOCAL' -Action 'DashboardUpload' -Result 'Error' -Details $uploadErrorText
            $UploadMsg = "`n`nNo se pudo sincronizar con el Dashboard tras varios intentos:" +
                         "`nURL: $DashboardUrl" +
                         "`nDetalle: $uploadErrorText" +
                         "`n`nEl reporte CSV quedo guardado igualmente y se puede reintentar la subida mas tarde."
        }
    }

    $uiHash.Window.Cursor = [System.Windows.Input.Cursors]::Arrow
    [System.Windows.MessageBox]::Show("Reporte generado con exito en: $CsvPath$UploadMsg", 'WUU')
}
#endregion Event ScriptBlocks

#region Event Handlers
$uiHash.AddADContext.Add_Click($eventAddAD) #Add Computers From AD (Context)
$uiHash.AddComputerContext.Add_Click($eventAddComputer) #Add Computers (Context)
$uiHash.AddFileContext.Add_Click($eventAddFile) #Add Computers From File (Context)
$uiHash.CheckUpdatesContext.Add_Click($eventGetUpdates) #Check For Updates (Context)
$uiHash.DownloadUpdatesContext.Add_Click($eventDownloadUpdates) #Download Updates
$uiHash.UpdateHistoryMenu.Add_Click($eventShowUpdateHistory) #Get Update History
$uiHash.InstallUpdatesContext.Add_Click($eventInstallUpdates) #Install Updates
$uiHash.ReportStatusContext.Add_Click($eventReportStatus) #Report status to WSUS
$uiHash.Listview.Add_MouseRightButtonUp($eventRightClick) #On Right Click
$uiHash.RemoteDesktopContext.Add_Click( { mstsc.exe /v $uiHash.Listview.SelectedItems.Computer }) #RDP
$uiHash.RemoveComputerContext.Add_Click( { &$removeEntry @($uiHash.Listview.SelectedItems) }) #Delete Computers
$uiHash.RestartContext.Add_Click($eventRestartComputer) #Restart Computer
$uiHash.ShowUpdatesContext.Add_Click($eventShowAvailableUpdates) #Show Available Updates
$uiHash.ShowInstalledContext.Add_Click($eventShowInstalledUpdates) #Show Installed Updates
$uiHash.ViewUpdateLogContext.Add_Click($eventViewUpdateLog) #Show Installed Updates
$uiHash.ExportReportMenu.Add_Click($eventExportReport)
$uiHash.Window.Add_Closed($eventWindowClose) #On Window Close
$uiHash.Window.Add_SourceInitialized($eventWindowInit) #On Window Open
$uiHash.Window.Add_KeyDown($eventKeyDown) #On key down
$uiHash.WURestartServiceMenu.Add_Click( { &$eventWUServiceAction 'Restart' }) #Restart Windows Update Service
$uiHash.WUStartServiceMenu.Add_Click( { &$eventWUServiceAction 'Start' }) #Start Windows Update Service
$uiHash.WUStopServiceMenu.Add_Click( { &$eventWUServiceAction 'Stop' }) #Stop Windows Update Service
$uiHash.GroupComboBox.Add_SelectionChanged($eventGroupChanged)
$uiHash.ReloadGroupsButton.Add_Click($eventReloadGroups)
$uiHash.SelectAllButton.Add_Click($eventSelectAllChecked)
$uiHash.ClearSelectionButton.Add_Click($eventClearChecked)
$uiHash.StartButton.Add_Click($eventStartSelected)
$uiHash.RestartSelectedButton.Add_Click($eventRestartSelected)
$uiHash.ReportButton.Add_Click($eventExportReport)
$uiHash.StopRefreshButton.Add_Click($eventStopAndRefresh)
#endregion       

#Start the GUI
$uiHash.Window.ShowDialog() | Out-Null