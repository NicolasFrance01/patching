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
#endregion Synchronized collections

$ScriptRoot = Split-Path -Path $PSCommandPath -Parent
$PsExecPath = Join-Path $ScriptRoot 'PsExec.exe'
$LogFile = Join-Path $ScriptRoot 'WUU_Log.csv'

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
        
        #Extract NetBIOS name from FQDN if needed
        if ($computer -like '*.') {
            $computerName = ($computer -split '\.')[0]
        }
        else {
            $computerName = $computer
        }
        
        #Validate computer name format (NetBIOS part)
        if ($computerName -notmatch '^[a-zA-Z0-9\-_]+$') {
            Write-Log -Computer $computer -Action 'AddEntry' -Result 'Error' -Details 'Invalid computer name format'
            continue
        }
        if ($computerName.Length -gt 15) {
            Write-Log -Computer $computer -Action 'AddEntry' -Result 'Error' -Details 'Computer name too long'
            continue
        }
        
        if ($exempt -contains $computerName) { continue } #Do not add excluded
        if (($uiHash.Listview.Items | Select-Object -Expand Computer) -contains $computerName) { continue } #Do not add duplicate

        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.clientObservable.Add((
                        New-Object PSObject -Property @{
                            Computer       = $computerName
                            Available      = 0 -as [int]
                            Downloaded     = 0 -as [int]
                            InstallErrors  = ''
                            Status         = "Initializing."
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

    #Setup runspace & start checking for updates.
    ($uiHash.Listview.Items | Where-Object { $_.Runspace -eq $Null }) | % {
        $newRunspace = [runspacefactory]::CreateRunspace()
        $newRunspace.ApartmentState = "STA"
        $newRunspace.ThreadOptions = "ReuseThread"
        $newRunspace.Open()
        $newRunspace.SessionStateProxy.SetVariable("uiHash", $uiHash)
        $newRunspace.SessionStateProxy.SetVariable("updatesHash", $updatesHash)
        $newRunspace.SessionStateProxy.SetVariable("path", $ScriptRoot)
        $newRunspace.SessionStateProxy.SetVariable("ScriptRoot", $ScriptRoot)
        $newRunspace.SessionStateProxy.SetVariable("PsExecPath", $PsExecPath)
        $newRunspace.SessionStateProxy.SetVariable('DownloadUpdates', $DownloadUpdates)
        $newRunspace.SessionStateProxy.SetVariable('GetUpdates', $GetUpdates)
        $newRunspace.SessionStateProxy.SetVariable('SetUpdatesStatus', $SetUpdatesStatus)
        $newRunspace.SessionStateProxy.SetVariable('InstallUpdates', $InstallUpdates)
        $newRunspace.SessionStateProxy.SetVariable('RestartComputer', $RestartComputer)
        $newRunspace.SessionStateProxy.SetVariable('MaybeAutoDownloadAfterInitialCheck', $MaybeAutoDownloadAfterInitialCheck)

        $_.Runspace = $newRunspace

        # Check for updates when computers are addded to the app (tras validar/reparar agente WU/WSUS; descarga automatica si aplica)
        $PowerShell = [powershell]::Create().AddScript($PrepareWUAgentBeforeCheck).AddArgument($_)
        $PowerShell.AddScript($GetUpdates).AddArgument($_)
        $PowerShell.AddScript($SetUpdatesStatus).AddArgument($_)
        $PowerShell.AddScript($MaybeAutoDownloadAfterInitialCheck).AddArgument($_)
        $PowerShell.Runspace = $_.Runspace

        #Save handle so we can later end the runspace
        $temp = New-Object PSObject -Property @{
            PowerShell = $PowerShell
            Runspace   = $PowerShell.BeginInvoke()
        }

        $jobs.Add($temp) | Out-Null
    }
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
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })		
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
                $computer.EndTime = Get-Date
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
    Catch {
        Write-Log -Computer $Computer.Computer -Action 'DownloadUpdates' -Result 'Error' -Details $_.Exception.Message
        $rs = "\\$($Computer.Computer)\C$\Admin\Scripts"
        Remove-Item "$rs\Download-Patches.ps1" -Force -ErrorAction SilentlyContinue
        Remove-Item "$rs\WU-DownloadProgress.txt", "$rs\WU-DownloadResult.txt" -Force -ErrorAction SilentlyContinue
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Error occurred: $($_.Exception.Message)."
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Cancel any remaining actions
        #exit  # Removed to prevent script termination
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
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        if (-not (Test-Path -Path $remoteScripts)) {
            New-Item -Path $remoteScripts -ItemType Directory -Force | Out-Null
        }
        Copy-Item -Path $testLocal -Destination "$remoteScripts\Test-WUAgent.ps1" -Force
        $null = & $PsExecPath -accepteula -nobanner -s "\\$($Computer.Computer)" cmd.exe /c 'echo . | powershell.exe -NoProfile -ExecutionPolicy Bypass -file C:\Admin\Scripts\Test-WUAgent.ps1'
        $probeExit = $LASTEXITCODE
        Remove-Item -Path "$remoteScripts\Test-WUAgent.ps1" -Force -ErrorAction SilentlyContinue

        if ($probeExit -ne 0) {
            $uiHash.ListView.Dispatcher.Invoke('Normal', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Agente WU con problemas; reparando (servicios, cache, registro WSUS)...'
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
                        $uiHash.Listview.Items.CommitEdit()
                        $uiHash.Listview.Items.Refresh()
                    })
            }
        }
        else {
            $null = & $PsExecPath -accepteula -nobanner -s "\\$($Computer.Computer)" cmd.exe /c 'echo . | wuauclt /detectnow'
            $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                    $uiHash.Listview.Items.EditItem($Computer)
                    $computer.Status = 'Agente WU operativo; sincronizando con WSUS...'
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
        }
    }
    catch {
        Write-Log -Computer $Computer.Computer -Action 'PrepareWUAgentBeforeCheck' -Result 'Error' -Details $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Validacion WU omitida por error: $($_.Exception.Message). Continuando busqueda..."
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
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $computer.Status = "Error occurred: $($_.Exception.Message)"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Cancel any remaining actions
        #exit  # Removed to prevent script termination
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
                }
                else {
                    $computer.RebootRequired = $False
                }
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
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
            $computer.Runspace.Dispose()
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
            $updatesHash.Remove($computer.computer)
            $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                    $uiHash.Listview.Items.EditItem($computer)
                    $uiHash.clientObservable.Remove($computer)
                    $uiHash.Listview.Items.CommitEdit()
                    $uiHash.Listview.Items.Refresh()
                })
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
    try {
        #Set path for psexec and scripts
        Set-Location $ScriptRoot

        #Update status
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $Computer.Status = 'Reporting status to WSUS server.'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        $ExecStatus = & $PsExecPath -accepteula -nobanner -s "\\$($Computer.Computer)" cmd.exe /c 'echo . | wuauclt /reportnow'
        if ($LASTEXITCODE -ne 0) {
            throw "PsExec failed with error code $LASTEXITCODE"
        }

        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $Computer.Status = 'Finished updating status.'
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })
    }
    catch {
        Write-Log -Computer $Computer.Computer -Action 'ReportStatus' -Result 'Error' -Details $_.Exception.Message
        $uiHash.ListView.Dispatcher.Invoke('Background', [action] {
                $uiHash.Listview.Items.EditItem($Computer)
                $Computer.Status = "Error occurred: $($_.Exception.Message)"
                $uiHash.Listview.Items.CommitEdit()
                $uiHash.Listview.Items.Refresh()
            })

        #Cancel any remaining actions
        #exit  # Removed to prevent script termination
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
$uiHash.ActionMenu = $uiHash.Window.FindName('ActionMenu')
$uiHash.AddADContext = $uiHash.Window.FindName('AddADContext')
$uiHash.AddADMenu = $uiHash.Window.FindName('AddADMenu')
$uiHash.AddFileContext = $uiHash.Window.FindName('AddFileContext')
$uiHash.AddComputerContext = $uiHash.Window.FindName('AddComputerContext')
$uiHash.AddComputerMenu = $uiHash.Window.FindName('AddComputerMenu')
$uiHash.AutoRebootCheckBox = $uiHash.Window.FindName('AutoRebootCheckBox')
$uiHash.BrowseFileMenu = $uiHash.Window.FindName('BrowseFileMenu')
$uiHash.CheckUpdatesContext = $uiHash.Window.FindName('CheckUpdatesContext')
$uiHash.ClearComputerListMenu = $uiHash.Window.FindName('ClearComputerListMenu')
$uiHash.DownloadUpdatesContext = $uiHash.Window.FindName('DownloadUpdatesContext')
$uiHash.ExitMenu = $uiHash.Window.FindName('ExitMenu')
$uiHash.GridView = $uiHash.Window.FindName('GridView')
$uiHash.ExportListMenu = $uiHash.Window.FindName('ExportListMenu')
$uiHash.InstallUpdatesContext = $uiHash.Window.FindName('InstallUpdatesContext')
$uiHash.ReportStatusContext = $uiHash.Window.FindName('ReportStatusContext')
$uiHash.Listview = $uiHash.Window.FindName('Listview')
$uiHash.ListviewContextMenu = $uiHash.Window.FindName('ListViewContextMenu')
$uiHash.OfflineHostsMenu = $uiHash.Window.FindName('OfflineHostsMenu')
$uiHash.RemoteDesktopContext = $uiHash.Window.FindName('RemoteDesktopContext')
$uiHash.RemoveComputerContext = $uiHash.Window.FindName('RemoveComputerContext')
$uiHash.RestartContext = $uiHash.Window.FindName('RestartContext')
$uiHash.SelectAllMenu = $uiHash.Window.FindName('SelectAllMenu')
$uiHash.ShowUpdatesContext = $uiHash.Window.FindName('ShowUpdatesContext')
$uiHash.ShowInstalledContext = $uiHash.Window.FindName('ShowInstalledContext')
$uiHash.StatusTextBox = $uiHash.Window.FindName('StatusTextBox')
$uiHash.UpdateHistoryMenu = $uiHash.Window.FindName('UpdateHistoryMenu')
$uiHash.ViewErrorMenu = $uiHash.Window.FindName('ViewErrorMenu')
$uiHash.ViewUpdateLogContext = $uiHash.Window.FindName('ViewUpdateLogContext')
$uiHash.WindowsUpdateServiceMenu = $uiHash.Window.FindName('WindowsUpdateServiceMenu')
$uiHash.WURestartServiceMenu = $uiHash.Window.FindName('WURestartServiceMenu')
$uiHash.WUStartServiceMenu = $uiHash.Window.FindName('WUStartServiceMenu')
$uiHash.WUStopServiceMenu = $uiHash.Window.FindName('WUStopServiceMenu')
$uiHash.ExportReportMenu = $uiHash.Window.FindName('ExportReportMenu')
#endregion Connect to controls

#region Event ScriptBlocks
$eventWindowInit = { #Runs before opening window
    $Script:SortHash = @{ }
    
    #Sort event handler
    [System.Windows.RoutedEventHandler]$Global:ColumnSortHandler = {
        If ($_.OriginalSource -is [System.Windows.Controls.GridViewColumnHeader]) {
            Write-Verbose ('{0}' -f $_.Originalsource.getType().FullName)
            If ($_.OriginalSource -AND $_.OriginalSource.Role -ne 'Padding') {
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

    #Create and bind the observable collection to the GridView
    $uiHash.clientObservable = New-Object System.Collections.ObjectModel.ObservableCollection[object]
    $uiHash.ListView.ItemsSource = $uiHash.clientObservable

    #Auto-load computers from Servers.txt on startup (if present)
    $serversFilePath = Join-Path $ScriptRoot 'Servers.txt'
    if (Test-Path -Path $serversFilePath) {
        $serversFromFile = @(
            Get-Content -Path $serversFilePath -ErrorAction SilentlyContinue |
            ForEach-Object { $_.Trim() } |
            Where-Object { $_ -and -not $_.StartsWith('#') }
        )
        if ($serversFromFile.Count -gt 0) {
            &$AddEntry $serversFromFile
            $uiHash.StatusTextBox.Dispatcher.Invoke('Background', [action] {
                    $uiHash.StatusTextBox.Foreground = 'Black'
                    $uiHash.StatusTextBox.Text = "Equipos cargados automaticamente desde Servers.txt: $($serversFromFile.Count)"
                })
        }
    }
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
$eventActionMenu = { #Enable/disable action menu items
    $uiHash.ClearComputerListMenu.IsEnabled = ($uiHash.Listview.Items.Count -gt 0)
    $uiHash.OfflineHostsMenu.IsEnabled = ($uiHash.Listview.Items.Count -gt 0)
    $uiHash.ViewErrorMenu.IsEnabled = ($Error.Count -gt 0)
}
$eventAddAD = { #Add computers from Active Directory
    #region OUPicker
    $OUPickerHash = [hashtable]::Synchronized(@{ })
    try {
        $ouPickerPath = Join-Path $ScriptRoot 'OUPicker.xaml'
        if (-not (Test-Path $ouPickerPath)) {
            Write-Warning "No se encontró OUPicker.xaml en $ScriptRoot"
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
$eventGetUpdates = {
    $uiHash.Listview.SelectedItems | % {
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
        $temp = "" | Select-Object PowerShell, Runspace
        $temp.PowerShell = [powershell]::Create().AddScript($RemoveOfflineComputer).AddArgument($_).AddArgument($RemoveEntry)
        $temp.PowerShell.Runspace = $_.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
$eventRestartComputer = {
    $uiHash.Listview.SelectedItems | % {
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
    #Enable/Disable buttons as needed
    If ($uiHash.Listview.SelectedItems.count -eq 0) {
        $uiHash.RemoveComputerContext.IsEnabled = $False
        $uiHash.RemoteDesktopContext.IsEnabled = $False
        $uiHash.CheckUpdatesContext.IsEnabled = $False
        $uiHash.DownloadUpdatesContext.IsEnabled = $False
        $uiHash.InstallUpdatesContext.IsEnabled = $False
        $uiHash.RestartContext.IsEnabled = $False
        $uiHash.ShowInstalledContext.IsEnabled = $False
        $uiHash.ShowUpdatesContext.IsEnabled = $False
        $uiHash.UpdateHistoryMenu.IsEnabled = $False
        $uiHash.ViewUpdateLogContext.IsEnabled = $False
        $uiHash.WindowsUpdateServiceMenu.IsEnabled = $False
        $uiHash.ReportStatusContext.IsEnabled = $False
    }
    ElseIf ($uiHash.Listview.SelectedItems.count -eq 1) {
        $uiHash.RemoveComputerContext.IsEnabled = $True
        $uiHash.RemoteDesktopContext.IsEnabled = $True
        $uiHash.CheckUpdatesContext.IsEnabled = $True
        if ($uiHash.Listview.SelectedItems[0].Downloaded -ge 1) {
            $uiHash.InstallUpdatesContext.IsEnabled = $True
        }
        else {
            $uiHash.InstallUpdatesContext.IsEnabled = $False
        }
        $uiHash.RestartContext.IsEnabled = $True
        $uiHash.ShowInstalledContext.IsEnabled = $True
        if ($uiHash.Listview.SelectedItems[0].Available -gt 0) {
            $uiHash.ShowUpdatesContext.IsEnabled = $True
            $uiHash.DownloadUpdatesContext.IsEnabled = $True
        }
        else {
            $uiHash.ShowUpdatesContext.IsEnabled = $False
            $uiHash.DownloadUpdatesContext.IsEnabled = $False
        }
        $uiHash.UpdateHistoryMenu.IsEnabled = $True
        $uiHash.ViewUpdateLogContext.IsEnabled = $True
        $uiHash.WindowsUpdateServiceMenu.IsEnabled = $True
        $uiHash.ReportStatusContext.IsEnabled = $True
    }
    Else {
        $uiHash.RemoveComputerContext.IsEnabled = $True
        $uiHash.RemoteDesktopContext.IsEnabled = $False
        $uiHash.CheckUpdatesContext.IsEnabled = $True
        $uiHash.DownloadUpdatesContext.IsEnabled = $True
        $uiHash.InstallUpdatesContext.IsEnabled = $True
        $uiHash.ReportStatusContext.IsEnabled = $True
        $uiHash.RestartContext.IsEnabled = $True
        $uiHash.ShowInstalledContext.IsEnabled = $False
        $uiHash.ShowUpdatesContext.IsEnabled = $False
        $uiHash.UpdateHistoryMenu.IsEnabled = $False
        $uiHash.ViewUpdateLogContext.IsEnabled = $False
        $uiHash.WindowsUpdateServiceMenu.IsEnabled = $True
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
        $temp = '' | Select-Object PowerShell, Runspace
        $temp.PowerShell = [powershell]::Create().AddScript($ReportStatus).AddArgument($sel)
        $temp.PowerShell.Runspace = $sel.Runspace
        $temp.Runspace = $temp.PowerShell.BeginInvoke()
        $jobs.Add($temp) | Out-Null
    }
}
#endregion Event ScriptBlocks

#region Event Handlers
$uiHash.ActionMenu.Add_SubmenuOpened($eventActionMenu) #Action Menu
$uiHash.AddADContext.Add_Click($eventAddAD) #Add Computers From AD (Context)
$uiHash.AddADMenu.Add_Click($eventAddAD) #Add Computers From AD (Menu)
$uiHash.AddComputerContext.Add_Click($eventAddComputer) #Add Computers (Context)
$uiHash.AddComputerMenu.Add_Click($eventAddComputer) #Add Computers (Menu)
$uiHash.AddFileContext.Add_Click($eventAddFile) #Add Computers From File (Context)
$uiHash.BrowseFileMenu.Add_Click($eventAddFile) #Add Computers From File (Menu)
$uiHash.CheckUpdatesContext.Add_Click($eventGetUpdates) #Check For Updates (Context)
$uiHash.ClearComputerListMenu.Add_Click($clearComputerList) #Clear Computer List
$uiHash.DownloadUpdatesContext.Add_Click($eventDownloadUpdates) #Download Updates
$uiHash.ExitMenu.Add_Click( { $uiHash.Window.Close() }) #Exit
$uiHash.UpdateHistoryMenu.Add_Click($eventShowUpdateHistory) #Get Update History
$uiHash.ExportListMenu.Add_Click($eventSaveComputerList) #Exports Computer To File
$uiHash.InstallUpdatesContext.Add_Click($eventInstallUpdates) #Install Updates
$uiHash.ReportStatusContext.Add_Click($eventReportStatus) #Report status to WSUS
$uiHash.Listview.Add_MouseRightButtonUp($eventRightClick) #On Right Click
$uiHash.OfflineHostsMenu.Add_Click($eventRemoveOfflineComputer) #Remove Offline Computers
$uiHash.RemoteDesktopContext.Add_Click( { mstsc.exe /v $uiHash.Listview.SelectedItems.Computer }) #RDP
$uiHash.RemoveComputerContext.Add_Click( { &$removeEntry @($uiHash.Listview.SelectedItems) }) #Delete Computers
$uiHash.RestartContext.Add_Click($eventRestartComputer) #Restart Computer
$uiHash.SelectAllMenu.Add_Click( { $uiHash.Listview.SelectAll() }) #Select All
$uiHash.ShowUpdatesContext.Add_Click($eventShowAvailableUpdates) #Show Available Updates
$uiHash.ShowInstalledContext.Add_Click($eventShowInstalledUpdates) #Show Installed Updates
$uiHash.ViewUpdateLogContext.Add_Click($eventViewUpdateLog) #Show Installed Updates
$uiHash.Window.Add_Closed($eventWindowClose) #On Window Close
$uiHash.Window.Add_SourceInitialized($eventWindowInit) #On Window Open
$uiHash.Window.Add_KeyDown($eventKeyDown) #On key down
$uiHash.WURestartServiceMenu.Add_Click( { &$eventWUServiceAction 'Restart' }) #Restart Windows Update Service
$uiHash.WUStartServiceMenu.Add_Click( { &$eventWUServiceAction 'Start' }) #Start Windows Update Service
$uiHash.WUStopServiceMenu.Add_Click( { &$eventWUServiceAction 'Stop' }) #Stop Windows Update Service
$uiHash.ViewErrorMenu.Add_Click( { &$GetErrors | Out-GridView }) #View Errors
$uiHash.ExportReportMenu.Add_Click({
        $serversFilePath = Join-Path $ScriptRoot 'Servers.txt'
        if (-not (Test-Path -Path $serversFilePath)) {
            [System.Windows.MessageBox]::Show("No se encontro Servers.txt en: $ScriptRoot")
            return
        }
        $serversFromFile = @(
            Get-Content -Path $serversFilePath -ErrorAction SilentlyContinue |
            ForEach-Object { $_.Trim() } |
            Where-Object { $_ -and -not $_.StartsWith('#') }
        )
        if ($serversFromFile.Count -eq 0) {
            [System.Windows.MessageBox]::Show("Servers.txt no contiene equipos validos.")
            return
        }

        $ReportesDir = Join-Path $ScriptRoot "Reportes"
        if (-not (Test-Path -Path $ReportesDir)) {
            New-Item -Path $ReportesDir -ItemType Directory -Force | Out-Null
        }

        $CsvFileName = "Reporte_Instalacion_KBs_$(Get-Date -Format 'yyyyMMdd_HHmm').csv"
        $CsvPath = Join-Path $ReportesDir $CsvFileName
        $ReportData = New-Object System.Collections.Generic.List[PSObject]
        $currentItemsByComputer = @{}
        foreach ($currentItem in $uiHash.clientObservable) {
            if ($currentItem.Computer) {
                $currentItemsByComputer[$currentItem.Computer.ToUpperInvariant()] = $currentItem
            }
        }
        $uiHash.Window.Cursor = [System.Windows.Input.Cursors]::Wait

        foreach ($Computer in $serversFromFile) {
            $IP = "N/A"; $Domain = "N/A"; $OS = "N/A"; $KBsInstaladas = "Ninguna/No detectada"; $FechaInstalacion = "N/A"
            $DescripcionError = 'N/A'
            $lookupKey = $Computer.ToUpperInvariant()
            if ($currentItemsByComputer.ContainsKey($lookupKey)) {
                $gridItem = $currentItemsByComputer[$lookupKey]
                if ($gridItem.InstallErrors) {
                    $DescripcionError = [string]$gridItem.InstallErrors
                }
            }

            try {
                if (Test-Connection -ComputerName $Computer -Count 1 -Quiet) {
                    # 1. Obtener IP y Sistema Operativo
                    $SysInfo = Get-WmiObject -Class Win32_OperatingSystem -ComputerName $Computer -ErrorAction SilentlyContinue
                    $IP = [System.Net.Dns]::GetHostAddresses($Computer) | Where-Object { $_.AddressFamily -eq 'InterNetwork' } | Select-Object -ExpandProperty IPAddressToString -First 1
                    $OS = $SysInfo.Caption
                    $Domain = $SysInfo.Domain

                    # 2. Consultar hotfixes para obtener ultima fecha de instalacion
                    $HotFixes = Get-HotFix -ComputerName $Computer -ErrorAction SilentlyContinue
                    $HotFixesConFecha = @($HotFixes | Where-Object { $_.InstalledOn })

                    # Fecha de la ultima instalacion registrada (cualquier dia)
                    if ($HotFixesConFecha.Count -gt 0) {
                        $UltimoHotFix = $HotFixesConFecha | Sort-Object InstalledOn -Descending | Select-Object -First 1
                        if ($UltimoHotFix -and $UltimoHotFix.InstalledOn) {
                            $FechaUltimaInstalacion = ([datetime]$UltimoHotFix.InstalledOn).ToString("dd/MM/yyyy")
                        }
                    }
                    else {
                        $FechaUltimaInstalacion = "N/A"
                    }

                    # KBs instaladas hoy
                    $FechaHoy = (Get-Date).Date
                    $KBs = @(
                        $HotFixesConFecha |
                        Where-Object { ([datetime]$_.InstalledOn).Date -ge $FechaHoy } |
                        Select-Object -ExpandProperty HotFixID
                    )

                    if ($KBs.Count -gt 0) {
                        $KBsInstaladas = $KBs -join ", "
                        $FechaInstalacion = $FechaUltimaInstalacion
                    }
                    else {
                        # Si no hubo instalacion hoy, mostrar la fecha de la ultima instalacion conocida.
                        $FechaInstalacion = $FechaUltimaInstalacion
                    }
                }
            }
            catch {
                # Error de conexion o permisos
            }

            # Crear el objeto con las columnas exactas solicitadas
            $Obj = [PSCustomObject]@{
                Dominio             = $Domain
                Servidor            = $Computer
                IP                  = $IP
                Sistema_Operativo   = $OS
                Fecha_Instalacion   = $FechaInstalacion
                KBs_Instaladas      = $KBsInstaladas
                Descripcion_Error   = $DescripcionError
            }
            $ReportData.Add($Obj)
        }

        $ReportData | Export-Csv -Path $CsvPath -NoTypeInformation -Encoding UTF8 -Delimiter ","
        
        # Enviar JSON al Dashboard Web
        try {
            $JsonData = @($ReportData) | ConvertTo-Json -Depth 5 -Compress
            # NOTA: Cambiar esta URL por la de Vercel (ej: https://tu-repo.vercel.app/api/upload) cuando esté en producción
            $DashboardUrl = "https://algeibapatching.vercel.app/api/upload" 
            
            Invoke-RestMethod -Uri $DashboardUrl -Method Post -Body $JsonData -ContentType "application/json" -ErrorAction Stop | Out-Null
            $UploadMsg = "`n`nDatos sincronizados exitosamente con el Dashboard."
        }
        catch {
            $UploadMsg = "`n`nError al sincronizar con el Dashboard: $($_.Exception.Message)"
        }

        $uiHash.Window.Cursor = [System.Windows.Input.Cursors]::Arrow
        [System.Windows.MessageBox]::Show("Reporte generado con exito en: $CsvPath$UploadMsg", "WUU")
    })
#endregion       

#Start the GUI
$uiHash.Window.ShowDialog() | Out-Null