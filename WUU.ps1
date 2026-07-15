<#
================================================================================
  WUU.ps1  -  Windows Update Utility
  --------------------------------------------------------------------------
  Consola de parcheo para servidores Windows (PowerShell + WPF).
  --------------------------------------------------------------------------
  Modos de ejecucion:
    Normal   : abrir directamente (interfaz grafica)
    Headless : WUU.ps1 -Scheduled  (tarea programada, sin interfaz)

  Configuracion externa: config.json junto a WUU.ps1
================================================================================
#>
param(
  [switch]$Scheduled    # modo headless: genera reporte y sincroniza con Vercel
)

#--- Auto-elevacion a administrador -------------------------------------------
# Si WUU no se abrio como administrador, se relanza solo (mostrando el UAC) y
# cierra la instancia sin privilegios. Asi basta con abrirlo de cualquier forma.
$principal = New-Object Security.Principal.WindowsPrincipal(
               [Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  try {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName  = (Get-Process -Id $PID).Path
    $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" + $(if ($Scheduled) { ' -Scheduled' } else { '' })
    $psi.Verb      = "runas"
    [System.Diagnostics.Process]::Start($psi) | Out-Null
  } catch {
    # El usuario cancelo el UAC: no se puede continuar sin privilegios.
  }
  exit
}

#--- Ensamblados WPF ----------------------------------------------------------
Add-Type -AssemblyName PresentationFramework, PresentationCore, WindowsBase, System.Xaml

#--- Clases de datos (con notificacion de cambios para refresco en vivo) -------
Add-Type -TypeDefinition @"
using System;
using System.ComponentModel;

public class ServerRow : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;
    private void N(string p){ if(PropertyChanged!=null) PropertyChanged(this, new PropertyChangedEventArgs(p)); }

    private bool _sel; public bool Sel { get{return _sel;} set{ if(_sel!=value){_sel=value; N("Sel");}}}
    private string _servidor=""; public string Servidor { get{return _servidor;} set{_servidor=value; N("Servidor");}}
    private string _ip=""; public string IP { get{return _ip;} set{_ip=value; N("IP");}}
    private string _wsus=""; public string Wsus { get{return _wsus;} set{_wsus=value; N("Wsus");}}
    private string _available=""; public string Available { get{return _available;} set{_available=value; N("Available");}}
    private string _downloaded=""; public string Downloaded { get{return _downloaded;} set{_downloaded=value; N("Downloaded");}}
    private string _downloadPct=""; public string DownloadPct { get{return _downloadPct;} set{_downloadPct=value; N("DownloadPct");}}
    private string _error=""; public string Error { get{return _error;} set{_error=value; N("Error");}}
    private string _status=""; public string Status { get{return _status;} set{_status=value; N("Status");}}
    private string _runningTime=""; public string RunningTime { get{return _runningTime;} set{_runningTime=value; N("RunningTime");}}

    // Estado que controla el color de la fila:
    // Unselected | CheckWSUS | Remediation | DownloadInstall | RebootRequired | Updated
    private string _state="Unselected"; public string State { get{return _state;} set{_state=value; N("State");}}

    // Campos extra del CSV (se usan en el reporte de la FASE 2)
    public string Grupo {get;set;}
    public string Dominio {get;set;}
    public string OS {get;set;}
    public string Ambiente {get;set;}
}

public class GroupItem : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;
    private void N(string p){ if(PropertyChanged!=null) PropertyChanged(this, new PropertyChangedEventArgs(p)); }
    private string _name=""; public string Name { get{return _name;} set{_name=value; N("Name");}}
    private bool _isChecked; public bool IsChecked { get{return _isChecked;} set{ if(_isChecked!=value){_isChecked=value; N("IsChecked");}}}
}

// Fila del reporte (se rellena completa por servidor; columnas exactas pedidas)
public class ReportRow
{
    public string Dominio {get;set;}
    public string Servidor {get;set;}
    public string IP {get;set;}
    public string Sistema_Operativo {get;set;}
    public string Version_Sistema_Operativo {get;set;}
    public string Fecha_Instalacion {get;set;}
    public string KBs_Instaladas {get;set;}
    public string Fecha_Reinicio {get;set;}
    public string Running_Time {get;set;}
    public string Descripcion_Error {get;set;}
}

// Fila del historial de updates (menu contextual)
public class HistoryRow
{
    public string Fecha {get;set;}
    public string Titulo {get;set;}
    public string Operacion {get;set;}
    public string Resultado {get;set;}
}

// Fila del log de Windows Update (menu contextual)
public class WuLogRow
{
    public string Fecha {get;set;}
    public string Nivel {get;set;}
    public string Id {get;set;}
    public string Mensaje {get;set;}
}
// Resultado del buscador de servidores
public class SearchResultItem
{
    public string Display { get; set; }   // nombre del servidor
    public string Sub     { get; set; }   // IP | Grupo | Ambiente
    public object Tag     { get; set; }   // fila del CSV (PSObject)
}

public class FixPickItem : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;
    private void N(string p){ if(PropertyChanged!=null) PropertyChanged(this, new PropertyChangedEventArgs(p)); }
    private bool _isChecked;
    public bool IsChecked { get{return _isChecked;} set{ if(_isChecked!=value){_isChecked=value; N("IsChecked");}}}
    public string Servidor {get;set;}
}
"@

#--- Definicion de la ventana (XAML) ------------------------------------------
[xml]$xaml = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU  -  Windows Update Utility"
        Height="660" Width="1200" WindowStartupLocation="CenterScreen"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">

  <Window.Resources>
    <!-- Boton base -->
    <Style x:Key="Btn" TargetType="Button">
      <Setter Property="Padding" Value="14,7"/>
      <Setter Property="Margin" Value="0,0,8,0"/>
      <Setter Property="Background" Value="#FF2563EB"/>
      <Setter Property="Foreground" Value="White"/>
      <Setter Property="BorderThickness" Value="0"/>
      <Setter Property="Cursor" Value="Hand"/>
      <Setter Property="FontWeight" Value="SemiBold"/>
      <Setter Property="Template">
        <Setter.Value>
          <ControlTemplate TargetType="Button">
            <Border CornerRadius="6" Background="{TemplateBinding Background}" Padding="{TemplateBinding Padding}">
              <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
          </ControlTemplate>
        </Setter.Value>
      </Setter>
      <Style.Triggers>
        <Trigger Property="IsEnabled" Value="False">
          <Setter Property="Background" Value="#FFB8C0CC"/>
          <Setter Property="Foreground" Value="#FFEDEFF2"/>
          <Setter Property="Cursor" Value="Arrow"/>
        </Trigger>
      </Style.Triggers>
    </Style>

    <!-- Estilo de fila con colores por estado -->
    <Style x:Key="RowStyle" TargetType="{x:Type DataGridRow}">
      <Setter Property="Background" Value="White"/>
      <Style.Triggers>
        <DataTrigger Binding="{Binding State}" Value="Unselected">
          <Setter Property="Background" Value="LightGray"/>
        </DataTrigger>
        <DataTrigger Binding="{Binding State}" Value="CheckWSUS">
          <Setter Property="Background" Value="Khaki"/>
        </DataTrigger>
        <DataTrigger Binding="{Binding State}" Value="Remediation">
          <Setter Property="Background" Value="Orange"/>
        </DataTrigger>
        <DataTrigger Binding="{Binding State}" Value="DownloadInstall">
          <Setter Property="Background" Value="LightSkyBlue"/>
        </DataTrigger>
        <DataTrigger Binding="{Binding State}" Value="Updated">
          <Setter Property="Background" Value="LightGreen"/>
        </DataTrigger>
        <!-- Reinicio requerido: rojo parpadeante -->
        <DataTrigger Binding="{Binding State}" Value="RebootRequired">
          <Setter Property="Foreground" Value="White"/>
          <Setter Property="Background">
            <Setter.Value><SolidColorBrush Color="Red"/></Setter.Value>
          </Setter>
          <DataTrigger.EnterActions>
            <BeginStoryboard Name="sbBlink">
              <Storyboard>
                <ColorAnimation Storyboard.TargetProperty="(Control.Background).(SolidColorBrush.Color)"
                                From="Red" To="#FFFF8A80" Duration="0:0:0.6"
                                AutoReverse="True" RepeatBehavior="Forever"/>
              </Storyboard>
            </BeginStoryboard>
          </DataTrigger.EnterActions>
          <DataTrigger.ExitActions>
            <StopStoryboard BeginStoryboardName="sbBlink"/>
          </DataTrigger.ExitActions>
        </DataTrigger>
      </Style.Triggers>
    </Style>
  </Window.Resources>

  <Grid Margin="14">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>

    <!-- ===== Fila 0: Selector de grupos ===== -->
    <DockPanel Grid.Row="0" LastChildFill="False">
      <TextBlock Text="Grupos:" VerticalAlignment="Center" FontWeight="SemiBold" Margin="0,0,8,0"/>
      <ToggleButton x:Name="btnGroups" Content="Seleccionar grupos  &#x25BE;"
                    MinWidth="240" Padding="12,7" VerticalAlignment="Center"
                    Background="White" BorderBrush="#FFCBD5E1" BorderThickness="1"/>
      <Popup x:Name="popGroups" PlacementTarget="{Binding ElementName=btnGroups}" Placement="Bottom"
             StaysOpen="False" IsOpen="{Binding IsChecked, ElementName=btnGroups, Mode=TwoWay}"
             AllowsTransparency="True">
        <Border Background="White" BorderBrush="#FFCBD5E1" BorderThickness="1" CornerRadius="6"
                Padding="6" MinWidth="240" SnapsToDevicePixels="True">
          <ScrollViewer MaxHeight="280" VerticalScrollBarVisibility="Auto">
            <ItemsControl x:Name="icGroups">
              <ItemsControl.ItemTemplate>
                <DataTemplate>
                  <CheckBox Content="{Binding Name}" Margin="6,4"
                            IsChecked="{Binding IsChecked, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>
                </DataTemplate>
              </ItemsControl.ItemTemplate>
            </ItemsControl>
          </ScrollViewer>
        </Border>
      </Popup>
      <TextBlock x:Name="lblCount" Text="Servidores cargados: 0" VerticalAlignment="Center"
                 Margin="16,0,0,0" Foreground="#FF475569"/>

      <!-- Buscador de servidores -->
      <Rectangle Width="1" Height="20" Fill="#FFE2E8F0" Margin="16,0,12,0" VerticalAlignment="Center"/>
      <TextBlock Text="Buscar:" VerticalAlignment="Center" FontWeight="SemiBold" Margin="0,0,8,0"/>
      <Grid VerticalAlignment="Center">
        <TextBox x:Name="txtSearch" Width="240" Padding="8,5" BorderBrush="#FFCBD5E1" BorderThickness="1" Background="White"/>
        <TextBlock x:Name="lblSearchHint" Text="Nombre o IP del servidor..."
                   IsHitTestVisible="False" Foreground="#FF94A3B8"
                   VerticalAlignment="Center" Margin="10,0"/>
        <Popup x:Name="popSearch" PlacementTarget="{Binding ElementName=txtSearch}"
               Placement="Bottom" StaysOpen="True" AllowsTransparency="True" Width="320">
          <Border Background="White" BorderBrush="#FFCBD5E1" BorderThickness="1"
                  CornerRadius="0,0,6,6" SnapsToDevicePixels="True">
            <ListBox x:Name="lbSearch" BorderThickness="0" MaxHeight="280"
                     ScrollViewer.HorizontalScrollBarVisibility="Disabled"
                     Background="Transparent">
              <ListBox.ItemContainerStyle>
                <Style TargetType="ListBoxItem">
                  <Setter Property="Padding" Value="10,8"/>
                  <Setter Property="Cursor" Value="Hand"/>
                  <Setter Property="HorizontalContentAlignment" Value="Stretch"/>
                </Style>
              </ListBox.ItemContainerStyle>
              <ListBox.ItemTemplate>
                <DataTemplate>
                  <StackPanel>
                    <TextBlock Text="{Binding Display}" FontWeight="SemiBold" FontSize="13"/>
                    <TextBlock Text="{Binding Sub}" Foreground="#FF64748B" FontSize="11"/>
                  </StackPanel>
                </DataTemplate>
              </ListBox.ItemTemplate>
            </ListBox>
          </Border>
        </Popup>
      </Grid>
    </DockPanel>

    <!-- ===== Fila 1: Leyenda de colores ===== -->
    <Border Grid.Row="1" Margin="0,12,0,8" Padding="10,8" Background="White"
            BorderBrush="#FFE2E8F0" BorderThickness="1" CornerRadius="6">
      <WrapPanel>
        <StackPanel Orientation="Horizontal" Margin="0,0,18,0">
          <Border Width="16" Height="16" Background="Khaki" BorderBrush="#FF94A3B8" BorderThickness="1" CornerRadius="3"/>
          <TextBlock Text="Chequeo WSUS/WU" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <StackPanel Orientation="Horizontal" Margin="0,0,18,0">
          <Border Width="16" Height="16" Background="Orange" BorderBrush="#FF94A3B8" BorderThickness="1" CornerRadius="3"/>
          <TextBlock Text="Remediacion agente WU" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <StackPanel Orientation="Horizontal" Margin="0,0,18,0">
          <Border Width="16" Height="16" Background="LightSkyBlue" BorderBrush="#FF94A3B8" BorderThickness="1" CornerRadius="3"/>
          <TextBlock Text="Descarga/Instalacion" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <StackPanel Orientation="Horizontal" Margin="0,0,18,0">
          <Border Width="16" Height="16" Background="Red" BorderBrush="#FF94A3B8" BorderThickness="1" CornerRadius="3"/>
          <TextBlock Text="Reinicio requerido (parpadea)" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <StackPanel Orientation="Horizontal" Margin="0,0,18,0">
          <Border Width="16" Height="16" Background="LightGreen" BorderBrush="#FF94A3B8" BorderThickness="1" CornerRadius="3"/>
          <TextBlock Text="Actualizado" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <StackPanel Orientation="Horizontal" Margin="0,0,0,0">
          <Border Width="16" Height="16" Background="LightGray" BorderBrush="#FF94A3B8" BorderThickness="1" CornerRadius="3"/>
          <TextBlock Text="No seleccionado" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
      </WrapPanel>
    </Border>

    <!-- ===== Fila 2: Grilla ===== -->
    <DataGrid x:Name="dgServers" Grid.Row="2" AutoGenerateColumns="False" IsReadOnly="True"
              CanUserAddRows="False" CanUserDeleteRows="False" HeadersVisibility="Column"
              GridLinesVisibility="Horizontal" RowHeaderWidth="0" SelectionMode="Single"
              Background="White" BorderBrush="#FFE2E8F0" RowStyle="{StaticResource RowStyle}"
              VerticalScrollBarVisibility="Auto">
      <DataGrid.Columns>
        <DataGridTemplateColumn Header="Sel" Width="44" CanUserResize="False" CanUserSort="False">
          <DataGridTemplateColumn.CellTemplate>
            <DataTemplate>
              <CheckBox HorizontalAlignment="Center" VerticalAlignment="Center"
                        IsChecked="{Binding Sel, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>
            </DataTemplate>
          </DataGridTemplateColumn.CellTemplate>
        </DataGridTemplateColumn>
        <DataGridTextColumn Header="Servidor"      Binding="{Binding Servidor}"    Width="150"/>
        <DataGridTextColumn Header="IP"            Binding="{Binding IP}"          Width="120"/>
        <DataGridTextColumn Header="Servidor WSUS" Binding="{Binding Wsus}"        Width="150"/>
        <DataGridTextColumn Header="Available"     Binding="{Binding Available}"   Width="80"/>
        <DataGridTextColumn Header="Downloaded"    Binding="{Binding Downloaded}"  Width="90"/>
        <DataGridTextColumn Header="Download %"    Binding="{Binding DownloadPct}" Width="90"/>
        <DataGridTextColumn Header="Error"         Binding="{Binding Error}"       Width="180"/>
        <DataGridTextColumn Header="Status"        Binding="{Binding Status}"      Width="*"/>
        <DataGridTextColumn Header="Running Time"  Binding="{Binding RunningTime}" Width="110"/>
      </DataGrid.Columns>
    </DataGrid>

    <!-- ===== Fila 3: Botones ===== -->
    <DockPanel Grid.Row="3" Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnSelectAll" Content="Seleccionar todos" Style="{StaticResource Btn}" Background="#FF22C55E" Margin="0,0,8,0"/>
      <Button x:Name="btnClear"     Content="Limpiar seleccion"   Style="{StaticResource Btn}" Background="#FF64748B" Margin="0,0,8,0"/>
      <Button x:Name="btnReport"    Content="Reporte"             Style="{StaticResource Btn}" Background="#FF0EA5E9" Margin="0,0,8,0"/>
      <Button x:Name="btnFix"       Content="Fix"                 Style="{StaticResource Btn}" Background="#FF16A34A" Margin="0,0,8,0"/>
      <Button x:Name="btnReload"    Content="Recargar grupos"     Style="{StaticResource Btn}" Background="#FF6366F1" Margin="0,0,8,0"/>
      <Button x:Name="btnProgramar" Content="Programar"           Style="{StaticResource Btn}" Background="#FF7C3AED"/>
      <Button x:Name="btnStop"      Content="Detener y refrescar" Style="{StaticResource Btn}" Background="#FFEF4444"
              DockPanel.Dock="Right" Margin="0"/>
    </DockPanel>
  </Grid>
</Window>
'@

#--- Cargar la ventana --------------------------------------------------------
$reader  = New-Object System.Xml.XmlNodeReader $xaml
$Window  = [Windows.Markup.XamlReader]::Load($reader)

# Referencias a controles
$script:dg        = $Window.FindName('dgServers')
$script:icGroups  = $Window.FindName('icGroups')
$script:btnGroups = $Window.FindName('btnGroups')
$script:lblCount       = $Window.FindName('lblCount')
$script:txtSearch      = $Window.FindName('txtSearch')
$script:lblSearchHint  = $Window.FindName('lblSearchHint')
$script:popSearch      = $Window.FindName('popSearch')
$script:lbSearch       = $Window.FindName('lbSearch')
$btnSelectAll     = $Window.FindName('btnSelectAll')
$btnClear         = $Window.FindName('btnClear')
$btnReport        = $Window.FindName('btnReport')
$btnFix           = $Window.FindName('btnFix')
$btnReload        = $Window.FindName('btnReload')
$btnProgramar     = $Window.FindName('btnProgramar')
$btnStop          = $Window.FindName('btnStop')

#--- Estado del script --------------------------------------------------------
$script:ScriptDir   = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$script:Csv         = @()
$script:Groups      = New-Object System.Collections.ObjectModel.ObservableCollection[object]
$script:Servers     = New-Object System.Collections.ObjectModel.ObservableCollection[object]
$script:Suspend     = $false
$script:ManualCheck = @{}
$script:JobRebootAfter = @{}

#--- Configuracion externa (config.json) --------------------------------------
# Valores por defecto (se sobreescriben con lo que haya en config.json)
$script:Cfg = [ordered]@{
  PsExecPath                = ''
  RemoteRel                 = 'Windows\Temp\WUU'
  PatchTimeoutMinutes       = 90
  ConnectivityTimeoutSec    = 3
  CleanupRemoteOnSuccess    = $true
  Dashboard = [ordered]@{
    Enabled = $true
    Url     = 'https://algeibapatching.vercel.app/api/upload'
  }
  ScheduledReport = [ordered]@{
    Enabled  = $false
    Hour     = 8
    Minute   = 0
    TaskName = 'WUU_ReporteAutomatico'
  }
  History = [ordered]@{
    Enabled       = $true
    RetentionDays = 90
  }
  AutoReboot = [ordered]@{
    Enabled      = $true    # reinicia automaticamente si el parcheo lo requiere
    DelaySeconds = 60       # margen antes de ejecutar el reinicio
  }
}

function Load-Config {
  $cfgPath = Join-Path $script:ScriptDir 'config.json'
  if (-not (Test-Path $cfgPath)) {
    try { $script:Cfg | ConvertTo-Json -Depth 5 | Set-Content -Path $cfgPath -Encoding UTF8 } catch {}
    return
  }
  try {
    $raw = Get-Content -Path $cfgPath -Raw | ConvertFrom-Json
    foreach ($key in @('PsExecPath','RemoteRel','PatchTimeoutMinutes','ConnectivityTimeoutSec','CleanupRemoteOnSuccess')) {
      if ($null -ne $raw.$key) { $script:Cfg[$key] = $raw.$key }
    }
    foreach ($sec in @('Dashboard','ScheduledReport','History','AutoReboot')) {
      if ($raw.$sec) {
        foreach ($k in @($script:Cfg[$sec].Keys)) {
          if ($null -ne $raw.$sec.$k) { $script:Cfg[$sec][$k] = $raw.$sec.$k }
        }
      }
    }
    Write-Log 'INFO' "config.json cargado desde $cfgPath"
  } catch { Write-Log 'WARN' "No se pudo leer config.json: $($_.Exception.Message)" }
}

#--- Control de corrida (historial al finalizar parcheo) ----------------------
$script:Run = @{ Started=$null; TotalServers=0; Notified=$false }

#--- Debounce de seleccion de grupos (log de inicio de sesion) ----------------
$script:GroupSelTimer   = $null   # DispatcherTimer de 1.5s
$script:GroupSelPending = $false  # hay un log de sesion pendiente de escribir

#--- Auto-reinicio: contadores por servidor -----------------------------------
$script:AutoRebootPending = @{}   # servidor -> DateTime (momento del reinicio)
$script:AutoRebootTimer   = $null

#--- Logging del propio WUU ---------------------------------------------------
$script:LogFile = $null
try {
  $logDir = Join-Path $script:ScriptDir 'Logs'
  if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }
  $script:LogFile = Join-Path $logDir ("WUU_{0}.log" -f (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'))
} catch { $script:LogFile = $null }

function Write-Log($level, $message) {
  if (-not $script:LogFile) { return }
  try {
    $line = "[{0}] [{1}] {2}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $level, $message
    Add-Content -Path $script:LogFile -Value $line -Encoding UTF8
  } catch { }
}

Load-Config    # carga config.json sobreescribiendo los defaults

$script:icGroups.ItemsSource = $script:Groups
$script:dg.ItemsSource       = $script:Servers

Write-Log 'INFO' 'WUU iniciado.'

#==============================================================================
#  MOTOR (FASE 2) - Transporte PsExec + agente nativo de Windows Update
#==============================================================================

# Ruta de PsExec: usa config.json; si esta vacio, busca junto a WUU.ps1
$script:PsExecPath = if ($script:Cfg.PsExecPath) { $script:Cfg.PsExecPath }
                     else { Join-Path $script:ScriptDir 'PsExec.exe' }

# Estructuras de control de los procesos en paralelo
$script:Jobs        = @{}
$script:FixJobs     = @{}
$script:FixTimer    = $null
$script:Sync        = [hashtable]::Synchronized(@{})
$script:Timer       = $null
$script:LocalWorker = Join-Path $env:TEMP 'WUU_worker.ps1'

# Carpeta remota en cada servidor (relativa a C:\)
$script:RemoteRel   = $script:Cfg.RemoteRel

#------------------------------------------------------------------------------
#  SCRIPT TRABAJADOR
#  Se copia y ejecuta en cada servidor. Usa el agente nativo de Windows Update
#  (Microsoft.Update.*), respeta el WSUS configurado y va escribiendo su avance
#  en C:\Windows\Temp\WUU\status.json para que la consola lo lea en vivo.
#  Es una cadena literal (no se interpreta aqui); corre tal cual en el servidor.
#------------------------------------------------------------------------------
$script:WorkerScript = @'
param(
  [ValidateSet('Check','Install')]
  [string]$Mode = 'Install',
  [switch]$ClearCacheFirst,
  [switch]$RebootAfter
)
$ErrorActionPreference = "Stop"
$base       = "C:\Windows\Temp\WUU"
$statusPath = Join-Path $base "status.json"
$stopPath   = Join-Path $base "stop.flag"
New-Item -ItemType Directory -Path $base -Force | Out-Null

$state = [ordered]@{
  stage="check"; wsus=""; ip=""; available=0; downloaded=0; downloadPct=0;
  error=""; status="Iniciando..."; rebootRequired=$false
}
function Save-State {
  $tmp = "$statusPath.tmp"
  ($state | ConvertTo-Json -Compress) | Set-Content -Path $tmp -Encoding UTF8
  Move-Item -Path $tmp -Destination $statusPath -Force
}
function Is-Stopped { Test-Path $stopPath }

function Clear-WuCache([string]$label) {
  $state.stage = "remediate"
  $state.status = $label
  Save-State
  Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
  Stop-Service bits     -Force -ErrorAction SilentlyContinue
  if (Test-Path "C:\Windows\SoftwareDistribution") {
    Get-ChildItem "C:\Windows\SoftwareDistribution" -Force -ErrorAction SilentlyContinue |
      Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
  }
  $catroot = "C:\Windows\System32\catroot2"
  $catold  = "C:\Windows\System32\catroot2.old"
  if (Test-Path $catold) { Remove-Item $catold -Recurse -Force -ErrorAction SilentlyContinue }
  if (Test-Path $catroot) { Rename-Item -Path $catroot -NewName "catroot2.old" -Force -ErrorAction SilentlyContinue }
  Start-Service wuauserv -ErrorAction SilentlyContinue
  Start-Service bits     -ErrorAction SilentlyContinue
  try { & gpupdate /force 2>$null | Out-Null } catch {}
}

function Invoke-RebootIfRequested([bool]$shouldReboot) {
  if (-not $RebootAfter -or -not $shouldReboot) { return }
  $state.status = "Reiniciando en 10 segundos..."
  Save-State
  Start-Process shutdown.exe -ArgumentList "/r","/t","10","/c","Reinicio post-actualizacion WUU" -NoNewWindow -Wait
}

try {
  # --- Datos basicos: IP y WSUS configurado --------------------------------
  $state.ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
               Where-Object { $_.IPAddress -notmatch "^(127\.|169\.254\.)" } |
               Select-Object -First 1 -ExpandProperty IPAddress)
  $wuKey = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate"
  $wsus  = (Get-ItemProperty -Path $wuKey -Name WUServer -ErrorAction SilentlyContinue).WUServer
  $state.wsus = if ($wsus) { $wsus } else { "No configurado (WU directo)" }
  $state.status = "Chequeando WSUS/WU..."
  Save-State
  if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }

  if ($ClearCacheFirst) {
    Clear-WuCache "Limpiando cache de actualizacion..."
    if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }
  }

  # --- CHEQUEO WSUS/WU ------------------------------------------------------
  $session  = New-Object -ComObject Microsoft.Update.Session
  $searcher = $session.CreateUpdateSearcher()
  $needRemediate = $false
  try {
    $result = $searcher.Search("IsInstalled=0 and IsHidden=0")
  } catch {
    $needRemediate = $true
    $state.error = "Fallo chequeo WU: " + $_.Exception.Message
    Save-State
  }

  # --- REMEDIACION (solo si fallo el chequeo) ------------------------------
  if ($needRemediate) {
    Clear-WuCache "Remediando agente WU..."
    $state.stage="check"; $state.status="Re-chequeando tras remediacion..."; $state.error=""; Save-State
    $session  = New-Object -ComObject Microsoft.Update.Session
    $searcher = $session.CreateUpdateSearcher()
    $result   = $searcher.Search("IsInstalled=0 and IsHidden=0")   # si vuelve a fallar -> catch general
  }

  $available = $result.Updates.Count
  $state.available = $available
  $state.status = "$available update(s) disponibles"
  Save-State

  if ($Mode -eq 'Check') {
    $state.stage = 'checked'
    if ($available -eq 0) {
      $reboot = $false
      try { $reboot = (New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired } catch {}
      if ($reboot) { $state.rebootRequired=$true; $state.status='Chequeo: requiere reinicio (0 updates pendientes)' }
      else         { $state.status='Chequeo: actualizado (0 updates pendientes)' }
    } else {
      $state.status = "Chequeo: $available update(s) disponibles (sin instalar)"
    }
    Save-State; return
  }

  # --- Sin updates: verificar reinicio y cerrar ----------------------------
  if ($available -eq 0) {
    $reboot = $false
    try { $reboot = (New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired } catch {}
    if ($reboot) { $state.stage="reboot"; $state.rebootRequired=$true; $state.status="Requiere reinicio" }
    else         { $state.stage="done";   $state.status="Actualizado (sin updates pendientes)" }
    Save-State
    Invoke-RebootIfRequested $reboot
    return
  }

  # --- Chequeo de espacio en disco C: --------------------------------------
  $freeGB = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
  if ($freeGB -lt 2) {
    $state.stage="error"; $state.status="Error"
    $state.error = "Espacio insuficiente en C: ($freeGB GB libres)"
    Save-State; return
  }
  if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }

  # --- DESCARGA (una a una para mostrar % en vivo) -------------------------
  $state.stage="download"; Save-State
  $toInstall = New-Object -ComObject Microsoft.Update.UpdateColl
  $i = 0
  foreach ($u in $result.Updates) {
    if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }
    try {
      if (-not $u.EulaAccepted) { $u.AcceptEula() }
      if (-not $u.IsDownloaded) {
        $coll = New-Object -ComObject Microsoft.Update.UpdateColl
        $coll.Add($u) | Out-Null
        $dl = $session.CreateUpdateDownloader()
        $dl.Updates = $coll
        $dl.Download() | Out-Null
      }
      $toInstall.Add($u) | Out-Null
    } catch {
      $state.error = "Descarga: " + $_.Exception.Message
    }
    $i++
    $state.downloaded  = $i
    $state.downloadPct = [int][math]::Round(($i / $available) * 100)
    $state.status      = "Descargando $i de $available..."
    Save-State
  }
  if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }

  # --- INSTALACION ---------------------------------------------------------
  $state.stage="install"; $state.status="Instalando..."; Save-State
  $installer = $session.CreateUpdateInstaller()
  $installer.Updates = $toInstall
  $instResult = $installer.Install()

  $errs = @()
  for ($k = 0; $k -lt $toInstall.Count; $k++) {
    $r = $instResult.GetUpdateResult($k)
    if ($r.ResultCode -ne 2) { $errs += ("0x{0:X8}" -f $r.HResult) }
  }
  if ($errs.Count -gt 0) { $state.error = "Codigos de error: " + ($errs -join ", ") }
  $state.status = "Instalacion finalizada (codigo $($instResult.ResultCode))"
  Save-State

  # --- Reinicio requerido? -------------------------------------------------
  $reboot = $instResult.RebootRequired
  if (-not $reboot) { try { $reboot = (New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired } catch {} }
  if ($reboot) { $state.stage="reboot"; $state.rebootRequired=$true; $state.status="Instalado. Requiere reinicio" }
  else         { $state.stage="done";   $state.status="Actualizado" }
  Save-State
  Invoke-RebootIfRequested ($reboot -or $available -gt 0)
}
catch {
  $state.stage="error"; $state.status="Error"; $state.error = $_.Exception.Message
  try { Save-State } catch {}
}
'@

# Escribe el trabajador a disco (local) una sola vez al arrancar
Set-Content -Path $script:LocalWorker -Value $script:WorkerScript -Encoding UTF8
$script:WorkerScript = $null   # liberar ~6KB de memoria

#------------------------------------------------------------------------------
#  REPORTE - configuracion
#------------------------------------------------------------------------------

# Dashboard: valores leidos desde config.json (ya cargado en $script:Cfg)
$script:WUUDashboardUploadUrl     = $script:Cfg.Dashboard.Url
$script:WUUDashboardUploadEnabled = [bool]$script:Cfg.Dashboard.Enabled
$script:LocalReportWorker = Join-Path $env:TEMP 'WUU_report.ps1'
$script:RepBag            = $null
$script:RepPool           = @()
$script:RepTimer          = $null

# Script de consulta que corre en cada servidor (escribe report.json). Usa los
# comandos pedidos. Es texto literal; corre tal cual en el servidor.
$script:ReportWorker = @'
$ErrorActionPreference = "SilentlyContinue"
$base = "C:\Windows\Temp\WUU"
New-Item -ItemType Directory -Path $base -Force | Out-Null

$o = [ordered]@{
  Dominio=""; Servidor=""; IP=""; Sistema_Operativo=""; Version_Sistema_Operativo="";
  Fecha_Instalacion=""; KBs_Instaladas=""; Fecha_Reinicio=""; Running_Time=""; Descripcion_Error=""
}
try { $o.Dominio = (Get-CimInstance Win32_ComputerSystem).Domain } catch {}
try { $o.Servidor = [System.Net.Dns]::GetHostName() } catch {}
try {
  $o.IP = (Get-NetIPAddress -AddressFamily IPv4 |
           Where-Object { $_.IPAddress -notmatch "^(127\.|169\.254\.)" } |
           Select-Object -First 1 -ExpandProperty IPAddress)
} catch {}
try { $o.Sistema_Operativo = (Get-CimInstance Win32_OperatingSystem).Caption } catch {}
try { $o.Version_Sistema_Operativo = (Get-Item "C:\Windows\System32\netlogon.dll").VersionInfo.FileVersion } catch {}
try {
  $all = @(Get-HotFix | Where-Object { $_.InstalledOn })
  $now = Get-Date
  $last = $all | Sort-Object InstalledOn -Descending | Select-Object -First 1
  $monthKbs = @($all | Where-Object {
    $_.InstalledOn.Year -eq $now.Year -and $_.InstalledOn.Month -eq $now.Month
  } | Sort-Object InstalledOn -Descending | Select-Object -ExpandProperty HotFixID -Unique)
  if ($monthKbs.Count -gt 0) {
    $o.KBs_Instaladas = ($monthKbs -join ", ")
    $latestInMonth = $all | Where-Object {
      $_.InstalledOn.Year -eq $now.Year -and $_.InstalledOn.Month -eq $now.Month
    } | Sort-Object InstalledOn -Descending | Select-Object -First 1
    if ($latestInMonth) { $o.Fecha_Instalacion = $latestInMonth.InstalledOn.ToString("yyyy-MM-dd") }
  } elseif ($last) {
    $o.KBs_Instaladas = ""
    $o.Fecha_Instalacion = $last.InstalledOn.ToString("yyyy-MM-dd")
  }
} catch {}
try {
  $boot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
  $o.Fecha_Reinicio = $boot.ToString("yyyy-MM-dd HH:mm:ss")
  $up = (Get-Date) - $boot
  $o.Running_Time = "{0:00}:{1:00}:{2:00}" -f [int]$up.TotalHours, $up.Minutes, $up.Seconds
} catch {}
try {
  $ev = Get-WinEvent -FilterHashtable @{ LogName="System"; ProviderName="Microsoft-Windows-WindowsUpdateClient"; Level=2 } -MaxEvents 1
  if ($ev) { $o.Descripcion_Error = (($ev.Message -split "`r?`n")[0]).Trim() }
} catch {}

($o | ConvertTo-Json -Compress) | Set-Content -Path "$base\report.json" -Encoding UTF8
'@
Set-Content -Path $script:LocalReportWorker -Value $script:ReportWorker -Encoding UTF8
$script:ReportWorker = $null

#------------------------------------------------------------------------------
#  CONSULTAS DEL MENU CONTEXTUAL (historial de updates y log WU)
#------------------------------------------------------------------------------
$script:LocalHistoryWorker = Join-Path $env:TEMP 'WUU_history.ps1'
$script:LocalWuLogWorker   = Join-Path $env:TEMP 'WUU_wulog.ps1'

# Historial de updates (agente nativo); escribe history.json
$script:HistoryWorker = @'
$ErrorActionPreference = "SilentlyContinue"
$base = "C:\Windows\Temp\WUU"; New-Item -ItemType Directory -Path $base -Force | Out-Null
$list = @()
try {
  $s  = New-Object -ComObject Microsoft.Update.Session
  $se = $s.CreateUpdateSearcher()
  $n  = $se.GetTotalHistoryCount()
  if ($n -gt 0) {
    $max = [Math]::Min($n, 200)
    foreach ($e in $se.QueryHistory(0, $max)) {
      $op  = switch ($e.Operation)  { 1 {"Instalacion"} 2 {"Desinstalacion"} default {"Otro"} }
      $res = switch ($e.ResultCode) { 1 {"En progreso"} 2 {"Correcto"} 3 {"Con errores"} 4 {"Fallido"} 5 {"Cancelado"} default {"-"} }
      $f = ""
      try { $f = (Get-Date $e.Date -Format "yyyy-MM-dd HH:mm:ss") } catch {}
      $list += [ordered]@{ Fecha=$f; Titulo="$($e.Title)"; Operacion=$op; Resultado=$res }
    }
  }
} catch {}
if ($list.Count -eq 0) { "[]" | Set-Content "$base\history.json" -Encoding UTF8 }
else { ($list | ConvertTo-Json) | Set-Content "$base\history.json" -Encoding UTF8 }
'@
Set-Content -Path $script:LocalHistoryWorker -Value $script:HistoryWorker -Encoding UTF8
$script:HistoryWorker = $null

# Log de Windows Update (eventos recientes del cliente WU); escribe wulog.json
$script:WuLogWorker = @'
$ErrorActionPreference = "SilentlyContinue"
$base = "C:\Windows\Temp\WUU"; New-Item -ItemType Directory -Path $base -Force | Out-Null
$list = @()
function Add-Events($events) {
  foreach ($e in $events) {
    $lvl = switch ($e.Level) { 2 {"Error"} 3 {"Advertencia"} 4 {"Informacion"} 0 {"Informacion"} default {"$($e.LevelDisplayName)"} }
    $msg = ""
    try { $msg = (($e.Message -split "`r?`n")[0]).Trim() } catch {}
    $script:list += [ordered]@{ Fecha=$e.TimeCreated.ToString("yyyy-MM-dd HH:mm:ss"); Nivel=$lvl; Id=[string]$e.Id; Mensaje=$msg }
  }
}
try {
  $ev = Get-WinEvent -FilterHashtable @{ LogName="System"; ProviderName="Microsoft-Windows-WindowsUpdateClient" } -MaxEvents 200
  Add-Events $ev
} catch {}
if ($list.Count -eq 0) {
  try { $ev = Get-WinEvent -LogName "Microsoft-Windows-WindowsUpdateClient/Operational" -MaxEvents 200; Add-Events $ev } catch {}
}
if ($list.Count -eq 0) { "[]" | Set-Content "$base\wulog.json" -Encoding UTF8 }
else { ($list | ConvertTo-Json) | Set-Content "$base\wulog.json" -Encoding UTF8 }
'@
Set-Content -Path $script:LocalWuLogWorker -Value $script:WuLogWorker -Encoding UTF8
$script:WuLogWorker = $null

#------------------------------------------------------------------------------
#  MONITOREO POST-REINICIO
#------------------------------------------------------------------------------
$script:LocalVerifyWorker = Join-Path $env:TEMP 'WUU_verify.ps1'
$script:RebootJobs  = @{}      # servidor -> { ps; handle; rs; sync }
$script:RebootTimer = $null

# Verificacion ligera tras el reinicio: cuenta updates pendientes y reinicio
# requerido (sin instalar nada). Escribe verify.json.
$script:VerifyWorker = @'
$ErrorActionPreference = "SilentlyContinue"
$base = "C:\Windows\Temp\WUU"; New-Item -ItemType Directory -Path $base -Force | Out-Null
$o = [ordered]@{ available=0; rebootRequired=$false; error="" }
try {
  $s  = New-Object -ComObject Microsoft.Update.Session
  $se = $s.CreateUpdateSearcher()
  $r  = $se.Search("IsInstalled=0 and IsHidden=0")
  $o.available = $r.Updates.Count
} catch { $o.error = $_.Exception.Message }
try { $o.rebootRequired = [bool](New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired } catch {}
($o | ConvertTo-Json -Compress) | Set-Content -Path "$base\verify.json" -Encoding UTF8
'@
Set-Content -Path $script:LocalVerifyWorker -Value $script:VerifyWorker -Encoding UTF8
$script:VerifyWorker = $null

#--- Trabajador Fix (.msu / .cab) ---------------------------------------------
$script:LocalFixWorker = Join-Path $env:TEMP 'WUU_fix.ps1'
$script:FixWorker = @'
param([string]$PackageName)
$ErrorActionPreference = "Stop"
$base = "C:\Windows\Temp\WUU"
$outPath = Join-Path $base "fix.json"
$pkg = Join-Path $base $PackageName
$o = [ordered]@{ exitCode=-1; message=""; rebootRequired=$false }
try {
  if (-not (Test-Path $pkg)) { throw "Paquete no encontrado: $PackageName" }
  $ext = [System.IO.Path]::GetExtension($PackageName).ToLower()
  if ($ext -eq ".msu") {
    $p = Start-Process -FilePath "wusa.exe" -ArgumentList "`"$pkg`" /quiet /norestart" -Wait -PassThru -WindowStyle Hidden
    $code = $p.ExitCode
  } elseif ($ext -eq ".cab") {
    $p = Start-Process -FilePath "dism.exe" -ArgumentList "/online /add-package /packagepath:`"$pkg`" /quiet /norestart" -Wait -PassThru -WindowStyle Hidden
    $code = $p.ExitCode
  } else { throw "Extension no soportada: $ext" }
  $o.exitCode = $code
  switch ($code) {
    0 { $o.message = "Fix instalado" }
    3010 { $o.message = "Fix instalado, requiere reinicio"; $o.rebootRequired = $true }
    2359302 { $o.message = "Ya estaba instalado" }
    -2145124329 { $o.message = "No aplicable a este servidor" }
    default { $o.message = "Error codigo $code" }
  }
} catch { $o.message = $_.Exception.Message }
($o | ConvertTo-Json -Compress) | Set-Content -Path $outPath -Encoding UTF8
'@
Set-Content -Path $script:LocalFixWorker -Value $script:FixWorker -Encoding UTF8
$script:FixWorker = $null

#--- Funciones de interfaz ----------------------------------------------------

function Update-GroupButtonText {
  $n = @($script:Groups | Where-Object { $_.IsChecked }).Count
  if ($n -eq 0) { $script:btnGroups.Content = "Seleccionar grupos  $([char]0x25BE)" }
  else          { $script:btnGroups.Content = "$n grupo(s) seleccionado(s)  $([char]0x25BE)" }
}

function Update-ButtonStates {
  $hasRows = $script:Servers.Count -gt 0
  $btnReload.IsEnabled    = $hasRows
  $btnSelectAll.IsEnabled = $hasRows
  $btnClear.IsEnabled     = $hasRows
  $btnReport.IsEnabled    = $hasRows
  $hasFix = $false
  try {
    $fixDir = Join-Path $script:ScriptDir 'Fix'
    if (Test-Path $fixDir) {
      $hasFix = @(Get-ChildItem -Path $fixDir -File -ErrorAction SilentlyContinue |
                 Where-Object { $_.Extension -in @('.msu','.cab') }).Count -gt 0
    }
  } catch {}
  $btnFix.IsEnabled = $hasRows -and $hasFix
  $selCount = @($script:Servers | Where-Object { $_.Sel }).Count
  $btnStop.IsEnabled = ($selCount -gt 0) -or ($script:Jobs.Count -gt 0) -or ($script:FixJobs.Count -gt 0)
  $script:lblCount.Text = "Servidores cargados: $($script:Servers.Count)     |     Seleccionados: $selCount"
}

# Reaccion al marcar/desmarcar el check de un servidor
function On-ServerSelChanged($row) {
  if ($row.Sel) { Start-ServerJob $row }
  else          { Stop-ServerJob $row.Servidor -Reset }
  Update-ButtonStates
}

#------------------------------------------------------------------------------
#  Motor: arrancar, refrescar y detener procesos por servidor
#------------------------------------------------------------------------------

# Formatea un TimeSpan como hh:mm:ss
function Format-Elapsed($ts) { '{0:00}:{1:00}:{2:00}' -f [int]$ts.TotalHours, $ts.Minutes, $ts.Seconds }

# Devuelve la fila (ServerRow) de un servidor por nombre
function Get-Row($server) { $script:Servers | Where-Object { $_.Servidor -eq $server } | Select-Object -First 1 }

# Arranca el proceso de parcheo en un servidor (en su propio runspace)
function Start-ServerJob($row, [string]$WorkerMode = 'Install', [switch]$ClearCacheFirst, [switch]$RebootAfter) {
  $server = $row.Servidor
  if ($script:Jobs.ContainsKey($server) -or $script:FixJobs.ContainsKey($server)) { return }

  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show(
      "No se encuentra PsExec.exe en:`n$script:PsExecPath`n`nColocalo junto a WUU.ps1 o ajusta PsExecPath en config.json.",
      "WUU", 'OK', 'Error') | Out-Null
    $row.Sel = $false
    return
  }

  # Verificacion rapida de conectividad (puerto 445 / SMB) antes de lanzar PsExec
  $row.State='CheckWSUS'; $row.Status='Verificando conectividad...'; $row.Error=''
  $row.Available=''; $row.Downloaded=''; $row.DownloadPct=''
  $toSec = [int]$script:Cfg.ConnectivityTimeoutSec
  $canReach = $false
  try {
    $tc  = New-Object System.Net.Sockets.TcpClient
    try {
      $iar = $tc.BeginConnect($server, 445, $null, $null)
      $canReach = $iar.AsyncWaitHandle.WaitOne($toSec * 1000) -and $tc.Connected
    } finally {
      try { $tc.Close() } catch {}
    }
  } catch {}
  if (-not $canReach) {
    $row.State='Unselected'; $row.Sel=$false
    $row.Error="Sin conectividad (puerto 445, timeout ${toSec}s)"
    $row.Status='Error de conexion'
    Write-Log 'ERROR' "Sin conectividad a $server (puerto 445)"
    return
  }

  # Reset y arranque del cronometro
  $row.Status='Conectando...'
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $deadline = (Get-Date).AddMinutes([int]$script:Cfg.PatchTimeoutMinutes)
  $script:Sync[$server] = [hashtable]::Synchronized(@{ done=$false; transportError=''; exit=$null })

  # Control de corrida para historial al finalizar (solo instalacion real)
  if ($WorkerMode -eq 'Install') {
    if (-not $script:Run.Started) { $script:Run.Started = Get-Date; $script:Run.Notified = $false }
    $script:Run.TotalServers++
  }
  if ($RebootAfter) { $script:JobRebootAfter[$server] = $true }

  $job = {
    param($server, $psexec, $worker, $rel, $sync, $mode, $doClearCache, $doRebootAfter)
    try {
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\status.json" -ErrorAction SilentlyContinue
      Remove-Item "$remoteDir\stop.flag"   -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\worker.ps1" -Force -ErrorAction Stop
      $psCmd = @('-ExecutionPolicy','Bypass','-NonInteractive','-File',"C:\$rel\worker.ps1",'-Mode',$mode)
      if ($doClearCache)   { $psCmd += '-ClearCacheFirst' }
      if ($doRebootAfter)  { $psCmd += '-RebootAfter' }
      $out = & $psexec "\\$server" -accepteula -nobanner -s powershell.exe @psCmd 2>&1
      $code = $LASTEXITCODE
      $sync[$server].exit = $code
      if ($code -ne 0) {
        $sync[$server].transportError = "PsExec codigo $code. " + (($out | Select-Object -Last 3) -join ' ')
      }
    } catch {
      $sync[$server].transportError = $_.Exception.Message
    } finally {
      $sync[$server].done = $true
    }
  }

  $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState='MTA'; $rs.Open()
  $ps = [powershell]::Create(); $ps.Runspace = $rs
  $ps.AddScript($job.ToString()).
      AddArgument($server).AddArgument($script:PsExecPath).
      AddArgument($script:LocalWorker).AddArgument($script:RemoteRel).
      AddArgument($script:Sync).AddArgument($WorkerMode).
      AddArgument([bool]$ClearCacheFirst).AddArgument([bool]$RebootAfter) | Out-Null
  $handle = $ps.BeginInvoke()

  $flags = @()
  if ($ClearCacheFirst) { $flags += 'ClearCache' }
  if ($RebootAfter)     { $flags += 'RebootAfter' }
  $flagStr = if ($flags.Count) { " [$($flags -join ',')]" } else { '' }
  $script:Jobs[$server] = @{ ps=$ps; handle=$handle; rs=$rs; sw=$sw; deadline=$deadline; mode=$WorkerMode }
  Write-Log 'INFO' "Proceso iniciado: $server (modo: $WorkerMode$flagStr, timeout: $($script:Cfg.PatchTimeoutMinutes)min)"
  Start-Timer
}

# Detiene el proceso de un servidor (escribe bandera de stop + cierra el runspace)
function Stop-ServerJob($server, [switch]$Reset) {
  $job = $script:Jobs[$server]
  if ($job) {
    # Bandera de stop: el trabajador la detecta en puntos seguros y aborta sin
    # cortar una instalacion a la mitad.
    try { Set-Content -Path "\\$server\C`$\$($script:RemoteRel)\stop.flag" -Value '1' -ErrorAction SilentlyContinue } catch {}
    try { $job.ps.Stop() }    catch {}
    try { $job.ps.Dispose() } catch {}
    try { $job.rs.Close(); $job.rs.Dispose() } catch {}
    try { $job.sw.Stop() }    catch {}
    $script:Jobs.Remove($server)
  }
  if ($Reset) {
    $row = Get-Row $server
    if ($row) { $row.State='Unselected'; $row.Status=''; $row.Available=''; $row.Downloaded=''; $row.DownloadPct='' }
  }
}

# Mapea el estado leido del JSON a la fila (color + columnas)
function Apply-Status($row, $st) {
  switch ("$($st.stage)") {
    'check'     { $row.State='CheckWSUS' }
    'remediate' { $row.State='Remediation' }
    'download'  { $row.State='DownloadInstall' }
    'install'   { $row.State='DownloadInstall' }
    'reboot'    { $row.State='RebootRequired' }
    'done'      { $row.State='Updated' }
    'checked'   { $row.State='CheckWSUS' }
    'stopped'   { $row.State='Unselected' }
    'error'     { }   # mantiene el color de la ultima etapa; el error se ve en la columna
  }
  if ($st.wsus) { $row.Wsus = "$($st.wsus)" }
  if ($st.ip)   { $row.IP   = "$($st.ip)" }
  $row.Available   = "$($st.available)"
  $row.Downloaded  = "$($st.downloaded)"
  $row.DownloadPct = if ([int]$st.downloadPct -gt 0) { "$($st.downloadPct)%" } else { '' }
  $row.Error       = "$($st.error)"
  $row.Status      = "$($st.status)"
}

# Crea/arranca el temporizador que refresca la grilla en vivo
function Start-Timer {
  if (-not $script:Timer) {
    $script:Timer = New-Object System.Windows.Threading.DispatcherTimer
    $script:Timer.Interval = [TimeSpan]::FromSeconds(2)
    $script:Timer.add_Tick({ On-TimerTick })
  }
  if (-not $script:Timer.IsEnabled) { $script:Timer.Start() }
}

# Tick del temporizador: lee el estado de cada servidor activo y actualiza la grilla
function On-TimerTick {
  if ($script:Jobs.Count -eq 0) {
    if ($script:Timer) { $script:Timer.Stop() }
    # Todos los servidores terminaron: guardar historial si corresponde
    if ($script:Run.Started -and -not $script:Run.Notified) {
      $script:Run.Notified = $true
      $script:Run.Started  = $null
      $script:Run.TotalServers = 0
      Save-History -Rows @($script:Servers) -Type 'Parcheo'
    }
    return
  }

  foreach ($server in @($script:Jobs.Keys)) {
    $job = $script:Jobs[$server]
    $row = Get-Row $server
    if (-not $row) { continue }

    $now = Get-Date
    $row.RunningTime = Format-Elapsed $job.sw.Elapsed

    # Timeout del proceso principal
    if ($now -gt $job.deadline) {
      Write-Log 'ERROR' "Timeout en $server ($($script:Cfg.PatchTimeoutMinutes)min). Deteniendo."
      try { Set-Content "\\$server\C`$\$($script:RemoteRel)\stop.flag" '1' -ErrorAction SilentlyContinue } catch {}
      try { $job.ps.Stop() }    catch {}
      try { $job.ps.Dispose() } catch {}
      try { $job.rs.Close(); $job.rs.Dispose() } catch {}
      $job.sw.Stop()
      $row.RunningTime = Format-Elapsed $job.sw.Elapsed
      $row.Error  = "Proceso detenido por timeout ($($script:Cfg.PatchTimeoutMinutes)min)"
      $row.Status = 'Timeout'
      $script:Jobs.Remove($server)
      continue
    }

    # Leer status.json del servidor por el recurso C$
    $unc = "\\$server\C`$\$($script:RemoteRel)\status.json"
    $st  = $null
    try {
      if (Test-Path $unc) {
        $raw = Get-Content -Path $unc -Raw -ErrorAction Stop
        if ($raw) { $st = $raw | ConvertFrom-Json }
      }
    } catch { $st = $null }
    if ($st) { Apply-Status $row $st }

    # Si el proceso PsExec termino, finalizar
    $sync = $script:Sync[$server]
    if ($sync.done) {
      if (-not $st -and $sync.transportError) {
        $row.Status = 'Error de conexion'
        $row.Error  = "$($sync.transportError)"
      }
      $job.sw.Stop()
      $row.RunningTime = Format-Elapsed $job.sw.Elapsed
      try { if ($job.handle.IsCompleted) { $job.ps.EndInvoke($job.handle) } } catch {}
      try { $job.ps.Dispose() } catch {}
      try { $job.rs.Close(); $job.rs.Dispose() } catch {}
      $script:Jobs.Remove($server)
      $script:Sync.Remove($server)   # liberar memoria de la entrada sincronizada

      $finalStage = if ($st) { "$($st.stage)" } else { 'desconocido' }
      if ($row.Error) { Write-Log 'ERROR' "Fin $server (etapa: $finalStage) - $($row.Error)" }
      else            { Write-Log 'INFO'  "Fin $server (etapa: $finalStage) - $($row.Status)" }

      if ($script:ManualCheck.ContainsKey($server)) {
        if ($row.State -eq 'Updated') { $row.Status = 'Actualizado tras reinicio' }
        $script:ManualCheck.Remove($server)
      }

      if ($script:JobRebootAfter.ContainsKey($server)) {
        $script:JobRebootAfter.Remove($server)
        if ($finalStage -in @('reboot','done')) {
          $row.Status = 'Reinicio remoto iniciado (10s)'
          Start-RebootMonitor $server
        }
      } elseif ($finalStage -eq 'reboot' -and [bool]$script:Cfg.AutoReboot.Enabled `
          -and -not $script:AutoRebootPending.ContainsKey($server)) {
        $delay = [int]$script:Cfg.AutoReboot.DelaySeconds
        $script:AutoRebootPending[$server] = (Get-Date).AddSeconds($delay)
        $row.Status = "Reinicio automatico en ${delay}s..."
        Write-Log 'INFO' "Auto-reinicio programado: $server en ${delay}s"
        Start-AutoRebootTimer
      }

      # Limpieza de archivos temporales en el servidor (solo si exitoso)
      if ($script:Cfg.CleanupRemoteOnSuccess -and $finalStage -in @('done','reboot')) {
        try {
          Remove-Item "\\$server\C`$\$($script:RemoteRel)" -Recurse -Force -ErrorAction SilentlyContinue
          Write-Log 'INFO' "Limpieza remota completada: $server"
        } catch { Write-Log 'WARN' "No se pudo limpiar archivos remotos en $server" }
      }
    }
  }
  Update-ButtonStates
}

# Reconstruye la grilla segun los grupos marcados
function Rebuild-Grid {
  $checked = @($script:Groups | Where-Object { $_.IsChecked } | ForEach-Object { $_.Name })
  $script:Servers.Clear()
  if ($checked.Count -gt 0) {
    $seen = @{}
    $csvRows = $script:Csv | Where-Object { $checked -contains $_.Grupo }
    foreach ($r in $csvRows) {
      $name = "$($r.Servidor)".Trim()
      if (-not $name -or $seen.ContainsKey($name)) { continue }
      $seen[$name] = $true
      $sr = New-Object ServerRow
      $sr.Servidor = "$($r.Servidor)"
      $sr.IP       = "$($r.IP)"          # si viniera vacio, se resuelve en FASE 2 consultando al servidor
      $sr.Grupo    = "$($r.Grupo)"
      $sr.Dominio  = "$($r.Dominio)"
      $sr.OS       = "$($r.OS)"
      $sr.Ambiente = "$($r.Ambiente)"
      $sr.State    = 'Unselected'
      $sr.add_PropertyChanged({ param($s,$e) if ($e.PropertyName -eq 'Sel') { On-ServerSelChanged $s } })
      $script:Servers.Add($sr)
    }
  }
  Update-GroupButtonText
  Update-ButtonStates
  # Si quedan servidores cargados, registrar inicio de sesion (con debounce)
  if ($script:Servers.Count -gt 0) { Start-GroupSelDebounce }
  else { Stop-GroupSelDebounce }
}

# Carga el CSV desde .\Servidores y arma la lista de grupos
function Load-Csv {
  $folder = Join-Path $script:ScriptDir 'Servidores'
  if (-not (Test-Path $folder)) {
    [System.Windows.MessageBox]::Show(
      "No se encontro la carpeta:`n$folder`n`nCrea la carpeta 'Servidores' junto a WUU.ps1 y coloca ahi tu archivo .csv.",
      "WUU", 'OK', 'Warning') | Out-Null
    return
  }
  $files = Get-ChildItem -Path $folder -Filter *.csv -File -ErrorAction SilentlyContinue
  if (-not $files -or $files.Count -eq 0) {
    [System.Windows.MessageBox]::Show("La carpeta 'Servidores' no contiene archivos .csv.","WUU",'OK','Warning') | Out-Null
    return
  }

  $all = @()
  foreach ($f in $files) {
    $firstLine = Get-Content -Path $f.FullName -TotalCount 1
    $delim = if ($firstLine -match ';' -and $firstLine -notmatch ',') { ';' } else { ',' }
    $all += Import-Csv -Path $f.FullName -Delimiter $delim
  }

  # Validacion minima de columnas requeridas
  $cols = @($all | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name)
  foreach ($req in @('Grupo','Servidor')) {
    if ($cols -notcontains $req) {
      [System.Windows.MessageBox]::Show(
        "El CSV no tiene la columna requerida '$req'.`nColumnas esperadas: Grupo, Dominio, IP, OS, Servidor, Ambiente.",
        "WUU", 'OK', 'Error') | Out-Null
      return
    }
  }

  $script:Csv = $all
  Write-Log 'INFO' ("CSV cargado: {0} fila(s), {1} grupo(s)." -f @($all).Count, @($script:Csv | Select-Object -ExpandProperty Grupo -Unique).Count)

  $script:Suspend = $true
  $script:Groups.Clear()
  $grupos = $script:Csv | Select-Object -ExpandProperty Grupo -Unique | Sort-Object
  foreach ($g in $grupos) {
    $gi = New-Object GroupItem
    $gi.Name = "$g"
    $gi.IsChecked = $false
    $gi.add_PropertyChanged({ param($s,$e) if ($e.PropertyName -eq 'IsChecked' -and -not $script:Suspend) { Rebuild-Grid } })
    $script:Groups.Add($gi)
  }
  $script:Suspend = $false

  Update-GroupButtonText
  Update-ButtonStates
}

#------------------------------------------------------------------------------
#  REPORTE - recoleccion, ventana y sincronizacion
#------------------------------------------------------------------------------

# Envia el reporte al endpoint de Vercel y actualiza el label de estado
function Sync-ToVercel($rows, $lbl) {
  if (-not $script:WUUDashboardUploadEnabled) {
    $lbl.Text = 'Sincronizacion con Vercel suspendida (solo reporte local).'
    $lbl.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
    return
  }
  if (-not $script:WUUDashboardUploadUrl) { $lbl.Text = 'Sincronizacion deshabilitada (sin URL configurada).'; return }
  $lbl.Text = 'Sincronizando con Vercel...'
  $lbl.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $servers = @($rows | ForEach-Object {
      [ordered]@{
        Dominio                   = $_.Dominio
        Servidor                  = $_.Servidor
        IP                        = $_.IP
        Sistema_Operativo         = $_.Sistema_Operativo
        Version_Sistema_Operativo = $_.Version_Sistema_Operativo
        Fecha_Instalacion         = $_.Fecha_Instalacion
        KBs_Instaladas            = $_.KBs_Instaladas
        Fecha_Reinicio            = $_.Fecha_Reinicio
        Running_Time              = $_.Running_Time
        Descripcion_Error         = $_.Descripcion_Error
      }
    })
    # Un servidor solo puede aparecer una vez (duplicados en CSV/grilla rompen el upsert del API)
    $deduped = [ordered]@{}
    foreach ($s in $servers) {
      $name = "$($s.Servidor)".Trim()
      if ($name) { $deduped[$name] = $s }
    }
    $servers = @($deduped.Values)
    # El endpoint /api/upload espera un array de servidores, no un objeto envoltorio
    $payload = $servers | ConvertTo-Json -Depth 5
    if ($servers.Count -eq 1 -and $payload -notmatch '^\s*\[') { $payload = "[$payload]" }
    $resp = Invoke-WebRequest -Uri $script:WUUDashboardUploadUrl -Method Post -Body $payload `
              -ContentType 'application/json; charset=utf-8' -TimeoutSec 120 -UseBasicParsing
    $result = $resp.Content | ConvertFrom-Json
    $count = if ($null -ne $result.count) { [int]$result.count } else { $servers.Count }
    $lbl.Text = "Sincronizado con Vercel correctamente ($count servidores)."
    $lbl.Foreground = [System.Windows.Media.Brushes]::Green
  } catch {
    $detail = $_.Exception.Message
    if ($_.Exception.Response) {
      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $raw = $reader.ReadToEnd()
        if ($raw) {
          $parsed = $raw | ConvertFrom-Json -ErrorAction SilentlyContinue
          if ($parsed -and $parsed.error) { $detail = "$($parsed.error)" }
        }
      } catch {}
    }
    $lbl.Text = "No se pudo sincronizar: $detail"
    $lbl.Foreground = [System.Windows.Media.Brushes]::Red
  }
}

# Guarda una copia CSV del reporte en la carpeta .\Reportes (un archivo por corrida)
function Save-ReportCsv($rows) {
  try {
    $dir = Join-Path $script:ScriptDir 'Reportes'
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $file = Join-Path $dir ("Reporte_{0}.csv" -f (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'))
    # Proyectamos a objetos ordenados para fijar el orden y los nombres de columna
    $export = $rows | ForEach-Object {
      [pscustomobject][ordered]@{
        Dominio                   = $_.Dominio
        Servidor                  = $_.Servidor
        IP                        = $_.IP
        Sistema_Operativo         = $_.Sistema_Operativo
        Version_Sistema_Operativo = $_.Version_Sistema_Operativo
        Fecha_Instalacion         = $_.Fecha_Instalacion
        KBs_Instaladas            = $_.KBs_Instaladas
        Fecha_Reinicio            = $_.Fecha_Reinicio
        Running_Time              = $_.Running_Time
        Descripcion_Error         = $_.Descripcion_Error
      }
    }
    # Delimitador ';' para que Excel (locale es-AR) lo abra en columnas con doble clic
    $export | Export-Csv -Path $file -NoTypeInformation -Delimiter ';' -Encoding UTF8
    return $file
  } catch {
    return $null
  }
}

# Construye y muestra la ventana del reporte (grilla + sincronizacion)
function Show-ReportWindow($rows, $savedPath) {
  [xml]$rx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Reporte" Height="560" Width="1180"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="14">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Grid.Row="0" Text="Reporte de parcheo" FontSize="16" FontWeight="SemiBold" Margin="0,0,0,10"/>
    <DataGrid x:Name="dgReport" Grid.Row="1" AutoGenerateColumns="False" IsReadOnly="True"
              CanUserAddRows="False" HeadersVisibility="Column" GridLinesVisibility="Horizontal"
              RowHeaderWidth="0" Background="White" BorderBrush="#FFE2E8F0"
              VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto">
      <DataGrid.Columns>
        <DataGridTextColumn Header="Dominio"           Binding="{Binding Dominio}"                   Width="120"/>
        <DataGridTextColumn Header="Servidor"          Binding="{Binding Servidor}"                  Width="130"/>
        <DataGridTextColumn Header="IP"                Binding="{Binding IP}"                        Width="110"/>
        <DataGridTextColumn Header="Sistema Operativo" Binding="{Binding Sistema_Operativo}"         Width="170"/>
        <DataGridTextColumn Header="Version SO"        Binding="{Binding Version_Sistema_Operativo}" Width="120"/>
        <DataGridTextColumn Header="Fecha Instalacion" Binding="{Binding Fecha_Instalacion}"         Width="120"/>
        <DataGridTextColumn Header="KBs Instaladas"    Binding="{Binding KBs_Instaladas}"            Width="200"/>
        <DataGridTextColumn Header="Fecha Reinicio"    Binding="{Binding Fecha_Reinicio}"            Width="150"/>
        <DataGridTextColumn Header="Running Time"      Binding="{Binding Running_Time}"              Width="110"/>
        <DataGridTextColumn Header="Descripcion Error" Binding="{Binding Descripcion_Error}"         Width="220"/>
      </DataGrid.Columns>
    </DataGrid>
    <DockPanel Grid.Row="2" Margin="0,12,0,0" LastChildFill="False">
      <StackPanel DockPanel.Dock="Left" VerticalAlignment="Center">
        <TextBlock x:Name="lblFile" Text="" Foreground="#FF475569"/>
        <TextBlock x:Name="lblSync" Text="" Margin="0,2,0,0"/>
      </StackPanel>
      <Button x:Name="btnClose"  Content="Cerrar"                    DockPanel.Dock="Right" Padding="14,7" Margin="8,0,0,0"/>
      <Button x:Name="btnResync" Content="Reintentar sincronizacion" DockPanel.Dock="Right" Padding="14,7"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $rx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $dgR    = $win.FindName('dgReport')
  $lbl    = $win.FindName('lblSync')
  $lblF   = $win.FindName('lblFile')
  $bClose = $win.FindName('btnClose')
  $bResy  = $win.FindName('btnResync')

  $dgR.ItemsSource = $rows
  if ($savedPath) { $lblF.Text = "Copia local guardada en: $savedPath" }
  else            { $lblF.Text = "No se pudo guardar la copia local (revisa permisos en la carpeta Reportes)."; $lblF.Foreground = [System.Windows.Media.Brushes]::Red }
  $bClose.Add_Click({ $win.Close() })
  $bResy.Add_Click({ Sync-ToVercel $rows $lbl }.GetNewClosure())

  # Al abrir, sincroniza con Vercel sin congelar la ventana (se pinta primero)
  $win.Add_Loaded({
    $lbl.Text = 'Preparando sincronizacion...'
    $win.Dispatcher.BeginInvoke(
      [action]{ Sync-ToVercel $rows $lbl },
      [System.Windows.Threading.DispatcherPriority]::Background) | Out-Null
  }.GetNewClosure())

  $win.Owner = $Window
  $win.ShowDialog() | Out-Null
}

# Recolecta el reporte de TODOS los servidores de la grilla (en paralelo)
function Show-Report {
  if ($script:Servers.Count -eq 0) { return }
  if (-not $btnReport.IsEnabled) { return }   # ya hay un reporte en curso
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }
  # Cancelar reporte anterior si aun hubiera runspaces colgados
  foreach ($j in $script:RepPool) {
    try { $j.ps.Stop() } catch {}
    try { $j.ps.Dispose() } catch {}
    try { $j.rs.Close(); $j.rs.Dispose() } catch {}
  }
  $targets = @($script:Servers | ForEach-Object { $_.Servidor })

  $btnReport.IsEnabled   = $false
  $script:RepOrig        = $btnReport.Content
  $script:RepBag         = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $script:RepTotal       = $targets.Count
  $script:RepDeadline    = (Get-Date).AddMinutes(10)
  $script:RepPool        = @()

  # Trabajo por servidor: copia el script de consulta, lo ejecuta y lee su JSON
  $rjob = {
    param($server, $psexec, $worker, $rel, $bag)
    $obj = $null
    try {
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\report.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\report.ps1" -Force -ErrorAction Stop
      $null = & $psexec "\\$server" -accepteula -nobanner -s `
                powershell.exe -ExecutionPolicy Bypass -NonInteractive `
                -File "C:\$rel\report.ps1" 2>&1
      if (Test-Path "$remoteDir\report.json") {
        $raw = Get-Content "$remoteDir\report.json" -Raw
        if ($raw) { $obj = $raw | ConvertFrom-Json }
      }
    } catch {}
    if (-not $obj) {
      $obj = [pscustomobject]@{
        Dominio=''; Servidor=$server; IP=''; Sistema_Operativo='';
        Version_Sistema_Operativo=''; Fecha_Instalacion=''; KBs_Instaladas='';
        Fecha_Reinicio=''; Running_Time=''; Descripcion_Error='Sin conexion o sin datos'
      }
    }
    [void]$bag.Add($obj)
  }

  foreach ($server in $targets) {
    $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState='MTA'; $rs.Open()
    $ps = [powershell]::Create(); $ps.Runspace = $rs
    $ps.AddScript($rjob.ToString()).
        AddArgument($server).AddArgument($script:PsExecPath).
        AddArgument($script:LocalReportWorker).AddArgument($script:RemoteRel).
        AddArgument($script:RepBag) | Out-Null
    $script:RepPool += @{ ps=$ps; handle=$ps.BeginInvoke(); rs=$rs }
  }

  if (-not $script:RepTimer) {
    $script:RepTimer = New-Object System.Windows.Threading.DispatcherTimer
    $script:RepTimer.Interval = [TimeSpan]::FromMilliseconds(400)
    $script:RepTimer.add_Tick({ On-ReportTick })
  }
  $script:RepTimer.Start()
}

# Tick del reporte: espera a que terminen todos y abre la ventana
function On-ReportTick {
  $done = $script:RepBag.Count
  $btnReport.Content = "Generando $done/$($script:RepTotal)..."

  if ($done -ge $script:RepTotal -or (Get-Date) -gt $script:RepDeadline) {
    $script:RepTimer.Stop()
    foreach ($j in $script:RepPool) {
      try { if ($j.handle.IsCompleted) { $j.ps.EndInvoke($j.handle) } } catch {}
      try { $j.ps.Dispose() } catch {}
      try { $j.rs.Close(); $j.rs.Dispose() } catch {}
    }
    $script:RepPool = @()
    $btnReport.Content   = $script:RepOrig
    $btnReport.IsEnabled = $true

    # Construye las filas tipadas y ordenadas por servidor (sin duplicados)
    $rows = New-Object System.Collections.ObjectModel.ObservableCollection[object]
    $byServer = [ordered]@{}
    foreach ($o in @($script:RepBag)) {
      $name = "$($o.Servidor)".Trim()
      if ($name) { $byServer[$name] = $o }
    }
    foreach ($o in @($byServer.Values | Sort-Object { "$($_.Servidor)" })) {
      $rr = New-Object ReportRow
      $rr.Dominio                   = "$($o.Dominio)"
      $rr.Servidor                  = "$($o.Servidor)"
      $rr.IP                        = "$($o.IP)"
      $rr.Sistema_Operativo         = "$($o.Sistema_Operativo)"
      $rr.Version_Sistema_Operativo = "$($o.Version_Sistema_Operativo)"
      $rr.Fecha_Instalacion         = "$($o.Fecha_Instalacion)"
      $rr.KBs_Instaladas            = "$($o.KBs_Instaladas)"
      $rr.Fecha_Reinicio            = "$($o.Fecha_Reinicio)"
      $rr.Running_Time              = "$($o.Running_Time)"
      $rr.Descripcion_Error         = "$($o.Descripcion_Error)"
      $rows.Add($rr)
    }
    # Guarda la copia local (CSV) y abre la ventana; Vercel se sincroniza al abrir
    $savedPath = Save-ReportCsv $rows
    Write-Log 'INFO' "Reporte generado para $($rows.Count) servidor(es). CSV: $savedPath"

    Save-History -Rows @($rows | ForEach-Object {
      [pscustomobject]@{ Servidor=$_.Servidor; IP=$_.IP; State='Report'
        Status='Reporte manual'; Error=$_.Descripcion_Error; RunningTime=$_.Running_Time }
    }) -Type 'ReporteManual'

    Show-ReportWindow $rows $savedPath
  }
}

#==============================================================================
#  FIX (.msu / .cab)
#==============================================================================

function Get-FixPackages {
  $dir = Join-Path $script:ScriptDir 'Fix'
  if (-not (Test-Path $dir)) { return @() }
  return @(Get-ChildItem -Path $dir -File -ErrorAction SilentlyContinue |
           Where-Object { $_.Extension -in @('.msu','.cab') } | Sort-Object Name)
}

function Show-FixPackagePicker($packages) {
  if ($packages.Count -eq 1) { return $packages[0] }
  [xml]$px = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Elegir paquete Fix" Height="360" Width="520"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="16">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Text="Selecciona el paquete a instalar (.msu / .cab)" FontWeight="SemiBold" Margin="0,0,0,10"/>
    <ListBox x:Name="lbPkg" Grid.Row="1" DisplayMemberPath="Name"/>
    <DockPanel Grid.Row="2" Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnOk" Content="Continuar" Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" DockPanel.Dock="Right"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $px
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $win.Owner = $Window
  $lb = $win.FindName('lbPkg')
  $lb.ItemsSource = $packages
  if ($packages.Count -gt 0) { $lb.SelectedIndex = 0 }
  $picked = $null
  $win.FindName('btnOk').Add_Click({
    if ($lb.SelectedItem) { $script:__fixPkg = $lb.SelectedItem; $win.DialogResult = $true }
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({ $win.DialogResult = $false }.GetNewClosure())
  $script:__fixPkg = $null
  if ($win.ShowDialog()) { return $script:__fixPkg }
  return $null
}

function Show-FixServerPicker {
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Servidores Fix" Height="440" Width="420"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="16">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Text="Selecciona servidores destino" FontWeight="SemiBold" Margin="0,0,0,8"/>
    <CheckBox x:Name="chkAll" Content="Seleccionar todos" Grid.Row="1" Margin="0,0,0,8"/>
    <ScrollViewer Grid.Row="2" VerticalScrollBarVisibility="Auto">
      <ItemsControl x:Name="icFix">
        <ItemsControl.ItemTemplate>
          <DataTemplate>
            <CheckBox Content="{Binding Servidor}" Margin="4,2"
                      IsChecked="{Binding IsChecked, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>
          </DataTemplate>
        </ItemsControl.ItemTemplate>
      </ItemsControl>
    </ScrollViewer>
    <DockPanel Grid.Row="3" Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnOk" Content="Continuar" Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" DockPanel.Dock="Right"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $sx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $win.Owner = $Window
  $items = New-Object System.Collections.ObjectModel.ObservableCollection[object]
  foreach ($s in $script:Servers) {
    $it = New-Object FixPickItem
    $it.Servidor = $s.Servidor
    $items.Add($it)
  }
  $ic = $win.FindName('icFix')
  $ic.ItemsSource = $items
  $chkAll = $win.FindName('chkAll')
  $script:__fixSuspendAll = $false
  $chkAll.Add_Checked({
    if ($script:__fixSuspendAll) { return }
    $script:__fixSuspendAll = $true
    foreach ($it in $items) { $it.IsChecked = $true }
    $script:__fixSuspendAll = $false
  }.GetNewClosure())
  $chkAll.Add_Unchecked({
    if ($script:__fixSuspendAll) { return }
    $script:__fixSuspendAll = $true
    foreach ($it in $items) { $it.IsChecked = $false }
    $script:__fixSuspendAll = $false
  }.GetNewClosure())
  $win.FindName('btnOk').Add_Click({
    $script:__fixServers = @($items | Where-Object { $_.IsChecked } | ForEach-Object { $_.Servidor })
    if ($script:__fixServers.Count -eq 0) {
      [System.Windows.MessageBox]::Show('Selecciona al menos un servidor.','WUU','OK','Information') | Out-Null
      return
    }
    $win.DialogResult = $true
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({ $win.DialogResult = $false }.GetNewClosure())
  $script:__fixServers = @()
  if ($win.ShowDialog()) { return @($script:__fixServers) }
  return $null
}

function Start-FixTimer {
  if (-not $script:FixTimer) {
    $script:FixTimer = New-Object System.Windows.Threading.DispatcherTimer
    $script:FixTimer.Interval = [TimeSpan]::FromMilliseconds(700)
    $script:FixTimer.add_Tick({ On-FixTick })
  }
  if (-not $script:FixTimer.IsEnabled) { $script:FixTimer.Start() }
}

function Stop-FixJob($server) {
  $job = $script:FixJobs[$server]
  if (-not $job) { return }
  try { $job.ps.Stop() } catch {}
  try { $job.ps.Dispose() } catch {}
  try { $job.rs.Close(); $job.rs.Dispose() } catch {}
  try { $job.sw.Stop() } catch {}
  $script:FixJobs.Remove($server)
}

function Stop-AllFixJobs {
  foreach ($server in @($script:FixJobs.Keys)) { Stop-FixJob $server }
  if ($script:FixTimer) { $script:FixTimer.Stop() }
}

function Start-FixJob($row, [string]$packagePath, [string]$packageName) {
  $server = $row.Servidor
  if ($script:FixJobs.ContainsKey($server) -or $script:Jobs.ContainsKey($server)) { return }

  $row.State = 'DownloadInstall'
  $row.Status = 'Fix: preparando...'
  $row.Error = ''

  $sync = [hashtable]::Synchronized(@{ done=$false; transportError='' })
  $sw = [System.Diagnostics.Stopwatch]::StartNew()

  $fjob = {
    param($server, $psexec, $fixWorker, $rel, $pkgLocal, $pkgName, $sync)
    try {
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\fix.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $fixWorker -Destination "$remoteDir\fix.ps1" -Force -ErrorAction Stop
      Copy-Item -Path $pkgLocal -Destination "$remoteDir\$pkgName" -Force -ErrorAction Stop
      $out = & $psexec "\\$server" -accepteula -nobanner -s `
                powershell.exe -ExecutionPolicy Bypass -NonInteractive `
                -File "C:\$rel\fix.ps1" -PackageName $pkgName 2>&1
      if ($LASTEXITCODE -ne 0) {
        $sync.transportError = "PsExec codigo $LASTEXITCODE. " + (($out | Select-Object -Last 3) -join ' ')
      }
    } catch {
      $sync.transportError = $_.Exception.Message
    } finally {
      $sync.done = $true
    }
  }

  $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState='MTA'; $rs.Open()
  $ps = [powershell]::Create(); $ps.Runspace = $rs
  $ps.AddScript($fjob.ToString()).
      AddArgument($server).AddArgument($script:PsExecPath).
      AddArgument($script:LocalFixWorker).AddArgument($script:RemoteRel).
      AddArgument($packagePath).AddArgument($packageName).
      AddArgument($sync) | Out-Null
  $handle = $ps.BeginInvoke()

  $script:FixJobs[$server] = @{ ps=$ps; handle=$handle; rs=$rs; sw=$sw; sync=$sync; pkg=$packageName }
  Write-Log 'INFO' "Fix iniciado: $server ($packageName)"
}

function On-FixTick {
  if ($script:FixJobs.Count -eq 0) {
    if ($script:FixTimer) { $script:FixTimer.Stop() }
    Update-ButtonStates
    return
  }

  foreach ($server in @($script:FixJobs.Keys)) {
    $job = $script:FixJobs[$server]
    $row = Get-Row $server
    if (-not $row) { continue }

    $row.RunningTime = Format-Elapsed $job.sw.Elapsed
    if (-not $job.sync.done) {
      $row.Status = "Fix: instalando $($job.pkg)..."
      continue
    }

    $unc = "\\$server\C`$\$($script:RemoteRel)\fix.json"
    $fx = $null
    try {
      if (Test-Path $unc) {
        $raw = Get-Content -Path $unc -Raw -ErrorAction Stop
        if ($raw) { $fx = $raw | ConvertFrom-Json }
      }
    } catch {}

    if ($fx) {
      $row.Status = "$($fx.message)"
      $code = [int]$fx.exitCode
      if ($code -in @(0, 3010, 2359302)) {
        if ($fx.rebootRequired -or $code -eq 3010) {
          $row.State = 'RebootRequired'
          $row.Status = 'Fix instalado. Requiere reinicio'
        } else {
          $row.State = 'Updated'
        }
        if ($code -eq 2359302) { $row.Error = '' }
        elseif ($code -ne 0) { $row.Error = '' }
      } else {
        $row.State = 'Unselected'
        $row.Error = "$($fx.message)"
      }
    } elseif ($job.sync.transportError) {
      $row.State = 'Unselected'
      $row.Status = 'Error Fix'
      $row.Error = $job.sync.transportError
      Write-Log 'ERROR' "Fix $server : $($job.sync.transportError)"
    } else {
      $row.State = 'Unselected'
      $row.Status = 'Error Fix'
      $row.Error = 'Sin respuesta del servidor (fix.json)'
      Write-Log 'ERROR' "Fix $server : sin fix.json"
    }

    $job.sw.Stop()
    $row.RunningTime = Format-Elapsed $job.sw.Elapsed
    try { if ($job.handle.IsCompleted) { $job.ps.EndInvoke($job.handle) } } catch {}
    try { $job.ps.Dispose() } catch {}
    try { $job.rs.Close(); $job.rs.Dispose() } catch {}
    $script:FixJobs.Remove($server)
    Write-Log 'INFO' "Fix finalizado: $server - $($row.Status)"
  }
  Update-ButtonStates
}

function Start-FixFlow {
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show(
      "No se encuentra PsExec.exe en:`n$script:PsExecPath",
      'WUU', 'OK', 'Error') | Out-Null
    return
  }
  if ($script:Servers.Count -eq 0) {
    [System.Windows.MessageBox]::Show('Carga servidores en la grilla antes de usar Fix.','WUU','OK','Information') | Out-Null
    return
  }
  $packages = Get-FixPackages
  if ($packages.Count -eq 0) {
    [System.Windows.MessageBox]::Show(
      "No hay paquetes .msu o .cab en la carpeta Fix\ junto a WUU.ps1.",
      'WUU', 'OK', 'Information') | Out-Null
    return
  }
  $pkg = Show-FixPackagePicker $packages
  if (-not $pkg) { return }
  $targets = Show-FixServerPicker
  if (-not $targets) { return }
  $resp = [System.Windows.MessageBox]::Show(
    "Instalar '$($pkg.Name)' en $($targets.Count) servidor(es)?`n`n$($targets -join ', ')",
    'WUU - Confirmar Fix', 'YesNo', 'Warning')
  if ($resp -ne 'Yes') { return }

  Write-Log 'INFO' "Fix: $($pkg.Name) en $($targets.Count) servidor(es)"
  $started = 0
  foreach ($name in $targets) {
    $row = Get-Row $name
    if ($row) {
      Start-FixJob $row $pkg.FullName $pkg.Name
      if ($script:FixJobs.ContainsKey($name)) { $started++ }
    }
  }
  if ($started -eq 0) {
    [System.Windows.MessageBox]::Show('No se pudo iniciar Fix en ningun servidor (puede haber jobs activos).','WUU','OK','Warning') | Out-Null
    return
  }
  Start-FixTimer
  Update-ButtonStates
}

#------------------------------------------------------------------------------
#  VISORES DEL MENU CONTEXTUAL (consulta a un servidor y muestra una ventana)
#------------------------------------------------------------------------------

# Ejecuta un script de consulta en un servidor (en segundo plano) y al terminar
# invoca $onDone con (rawJson, error). No congela la interfaz.
function Start-RemoteQuery($server, $worker, $remoteName, $jsonName, $onDone) {
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }
  $sync = [hashtable]::Synchronized(@{ done=$false; data=$null; err='' })
  $job = {
    param($server,$psexec,$worker,$rel,$remoteName,$jsonName,$sync)
    try {
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\$jsonName" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\$remoteName" -Force -ErrorAction Stop
      $null = & $psexec "\\$server" -accepteula -nobanner -s `
                powershell.exe -ExecutionPolicy Bypass -NonInteractive `
                -File "C:\$rel\$remoteName" 2>&1
      if (Test-Path "$remoteDir\$jsonName") {
        $raw = Get-Content "$remoteDir\$jsonName" -Raw
        if ($raw) { $sync.data = $raw } else { $sync.err = "Respuesta vacia" }
      } else { $sync.err = "Sin respuesta del servidor" }
    } catch { $sync.err = $_.Exception.Message }
    finally { $sync.done = $true }
  }
  $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState='MTA'; $rs.Open()
  $ps = [powershell]::Create(); $ps.Runspace = $rs
  $ps.AddScript($job.ToString()).
      AddArgument($server).AddArgument($script:PsExecPath).AddArgument($worker).
      AddArgument($script:RemoteRel).AddArgument($remoteName).AddArgument($jsonName).
      AddArgument($sync) | Out-Null
  $handle   = $ps.BeginInvoke()
  $deadline = (Get-Date).AddMinutes(3)
  $t = New-Object System.Windows.Threading.DispatcherTimer
  $t.Interval = [TimeSpan]::FromMilliseconds(400)
  $t.add_Tick({
    if ($sync.done -or (Get-Date) -gt $deadline) {
      $t.Stop()
      try { if ($handle.IsCompleted) { $ps.EndInvoke($handle) } } catch {}
      try { $ps.Dispose() } catch {}
      try { $rs.Close(); $rs.Dispose() } catch {}
      & $onDone $sync.data $sync.err
    }
  }.GetNewClosure())
  $t.Start()
}

# Ventana generica con grilla (columnas automaticas segun el tipo de fila)
function Show-GridWindow($title, $rows) {
  [xml]$gx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU" Height="560" Width="980"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="14">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock x:Name="lblTitle" Grid.Row="0" Text="" FontSize="16" FontWeight="SemiBold" Margin="0,0,0,10"/>
    <DataGrid x:Name="dgData" Grid.Row="1" AutoGenerateColumns="True" IsReadOnly="True"
              CanUserAddRows="False" HeadersVisibility="Column" GridLinesVisibility="Horizontal"
              RowHeaderWidth="0" Background="White" BorderBrush="#FFE2E8F0"
              VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto"/>
    <DockPanel Grid.Row="2" Margin="0,12,0,0" LastChildFill="False">
      <TextBlock x:Name="lblInfo" Text="" VerticalAlignment="Center" DockPanel.Dock="Left" Foreground="#FF475569"/>
      <Button x:Name="btnClose" Content="Cerrar" DockPanel.Dock="Right" Padding="14,7"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $gx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $win.Title = $title
  $win.FindName('lblTitle').Text = $title
  $win.FindName('dgData').ItemsSource = $rows
  $win.FindName('lblInfo').Text = "$($rows.Count) registro(s)"
  $bC = $win.FindName('btnClose'); $bC.Add_Click({ $win.Close() }.GetNewClosure())
  $win.Owner = $Window
  $win.ShowDialog() | Out-Null
}

# Muestra el historial de updates del servidor
function Show-UpdateHistory($server) {
  Write-Log 'INFO' "Historial de updates solicitado: $server"
  Start-RemoteQuery $server $script:LocalHistoryWorker 'history.ps1' 'history.json' {
    param($raw, $err)
    if ($err) { Write-Log 'WARN' "Historial ${server}: $err" }
    $rows = New-Object System.Collections.ObjectModel.ObservableCollection[object]
    if ($raw) {
      foreach ($o in @($raw | ConvertFrom-Json)) {
        $hr = New-Object HistoryRow
        $hr.Fecha="$($o.Fecha)"; $hr.Titulo="$($o.Titulo)"; $hr.Operacion="$($o.Operacion)"; $hr.Resultado="$($o.Resultado)"
        $rows.Add($hr)
      }
    }
    if ($rows.Count -eq 0) {
      [System.Windows.MessageBox]::Show("Sin historial disponible para '$server'." + $(if($err){"`n$err"}else{""}),"WUU",'OK','Information') | Out-Null
      return
    }
    Show-GridWindow "Historial de updates - $server" $rows
  }.GetNewClosure()
}

# Muestra el log (eventos recientes) de Windows Update del servidor
function Show-WuLog($server) {
  Write-Log 'INFO' "Log WU solicitado: $server"
  Start-RemoteQuery $server $script:LocalWuLogWorker 'wulog.ps1' 'wulog.json' {
    param($raw, $err)
    if ($err) { Write-Log 'WARN' "Log WU ${server}: $err" }
    $rows = New-Object System.Collections.ObjectModel.ObservableCollection[object]
    if ($raw) {
      foreach ($o in @($raw | ConvertFrom-Json)) {
        $wr = New-Object WuLogRow
        $wr.Fecha="$($o.Fecha)"; $wr.Nivel="$($o.Nivel)"; $wr.Id="$($o.Id)"; $wr.Mensaje="$($o.Mensaje)"
        $rows.Add($wr)
      }
    }
    if ($rows.Count -eq 0) {
      [System.Windows.MessageBox]::Show("Sin eventos de Windows Update para '$server'." + $(if($err){"`n$err"}else{""}),"WUU",'OK','Information') | Out-Null
      return
    }
    Show-GridWindow "Log Windows Update - $server" $rows
  }.GetNewClosure()
}

#------------------------------------------------------------------------------
#  MONITOREO POST-REINICIO (espera caida + regreso y re-verifica)
#------------------------------------------------------------------------------

# Arranca el monitoreo de un servidor recien reiniciado (en segundo plano)
function Start-RebootMonitor($server) {
  if ($script:RebootJobs.ContainsKey($server)) { return }
  if (-not (Test-Path $script:PsExecPath)) { return }
  $sync = [hashtable]::Synchronized(@{ done=$false; phase='rebooting'; status='Reiniciando...'; result=''; available=0; reboot=$false })

  $job = {
    param($server, $psexec, $worker, $rel, $sync)
    # Prueba si el puerto SMB (445) responde; mas fiable que ICMP en entornos con firewall
    function Test-Smb($s) {
      try {
        $c = New-Object System.Net.Sockets.TcpClient
        $iar = $c.BeginConnect($s, 445, $null, $null)
        $ok = $iar.AsyncWaitHandle.WaitOne(2000)
        $res = ($ok -and $c.Connected)
        $c.Close()
        return $res
      } catch { return $false }
    }
    try {
      # Fase A: esperar a que el servidor caiga (hasta 4 min)
      $sync.phase='rebooting'; $sync.status='Reiniciando...'
      $wentDown=$false; $t0=Get-Date
      while ((((Get-Date)-$t0).TotalMinutes) -lt 4) {
        if (-not (Test-Smb $server)) { $wentDown=$true; break }
        Start-Sleep -Seconds 5
      }
      # Fase B: esperar a que vuelva (hasta 20 min)
      $sync.phase='waiting'; $sync.status='Esperando que vuelva...'
      if (-not $wentDown) { Start-Sleep -Seconds 90 }   # reinicio muy rapido: dar tiempo
      $backUp=$false; $t1=Get-Date
      while ((((Get-Date)-$t1).TotalMinutes) -lt 20) {
        if (Test-Smb $server) { $backUp=$true; break }
        Start-Sleep -Seconds 10
      }
      if (-not $backUp) { $sync.phase='timeout'; $sync.status='No volvio a responder (timeout)'; $sync.result='timeout'; return }

      Start-Sleep -Seconds 25   # margen para que terminen de iniciar los servicios

      # Fase C: verificar updates pendientes y reinicio requerido
      $sync.phase='verify'; $sync.status='Verificando...'
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\verify.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\verify.ps1" -Force -ErrorAction Stop
      $null = & $psexec "\\$server" -accepteula -nobanner -s `
                powershell.exe -ExecutionPolicy Bypass -NonInteractive `
                -File "C:\$rel\verify.ps1" 2>&1
      if (Test-Path "$remoteDir\verify.json") {
        $v = Get-Content "$remoteDir\verify.json" -Raw | ConvertFrom-Json
        $sync.available = [int]$v.available
        $sync.reboot    = [bool]$v.rebootRequired
        if ($v.rebootRequired)          { $sync.result='reboot';  $sync.status='Aun requiere reinicio' }
        elseif ([int]$v.available -gt 0) { $sync.result='pending'; $sync.status="Hay $([int]$v.available) update(s) nuevos" }
        else                            { $sync.result='updated'; $sync.status='Actualizado tras reinicio' }
      } else {
        $sync.result='verifyfail'; $sync.status='No se pudo verificar tras reinicio'
      }
    } catch {
      $sync.result='error'; $sync.status="Monitor: $($_.Exception.Message)"
    } finally {
      $sync.done=$true
    }
  }

  $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState='MTA'; $rs.Open()
  $ps = [powershell]::Create(); $ps.Runspace = $rs
  $ps.AddScript($job.ToString()).
      AddArgument($server).AddArgument($script:PsExecPath).
      AddArgument($script:LocalVerifyWorker).AddArgument($script:RemoteRel).
      AddArgument($sync) | Out-Null
  $handle = $ps.BeginInvoke()
  $script:RebootJobs[$server] = @{ ps=$ps; handle=$handle; rs=$rs; sync=$sync }
  Start-RebootTimer
  Write-Log 'INFO' "Monitoreo post-reinicio iniciado: $server"
}

# Crea/arranca el temporizador del monitoreo post-reinicio
function Start-RebootTimer {
  if (-not $script:RebootTimer) {
    $script:RebootTimer = New-Object System.Windows.Threading.DispatcherTimer
    $script:RebootTimer.Interval = [TimeSpan]::FromSeconds(3)
    $script:RebootTimer.add_Tick({ On-RebootTick })
  }
  if (-not $script:RebootTimer.IsEnabled) { $script:RebootTimer.Start() }
}

# Tick: refleja el avance del monitoreo en la grilla y finaliza al terminar
function On-RebootTick {
  if ($script:RebootJobs.Count -eq 0) { if ($script:RebootTimer) { $script:RebootTimer.Stop() }; return }
  foreach ($server in @($script:RebootJobs.Keys)) {
    $job  = $script:RebootJobs[$server]
    $sync = $job.sync
    $row  = Get-Row $server
    if ($row) {
      switch ("$($sync.phase)") {
        'rebooting' { $row.State='RebootRequired' }
        'waiting'   { $row.State='RebootRequired' }
        'verify'    { $row.State='CheckWSUS' }
        'timeout'   { $row.State='RebootRequired' }
      }
      $row.Status = "$($sync.status)"
    }
    if ($sync.done) {
      if ($row) {
        switch ("$($sync.result)") {
          'updated'    { $row.State='Updated';        $row.Error='' }
          'reboot'     { $row.State='RebootRequired' }
          'pending'    { $row.State='CheckWSUS';      $row.Available="$($sync.available)" }
          'timeout'    { $row.State='RebootRequired'; $row.Error='No respondio tras reinicio' }
          'verifyfail' { $row.State='RebootRequired'; $row.Error='No se pudo verificar tras reinicio' }
          'error'      { $row.State='RebootRequired'; $row.Error="$($sync.status)" }
        }
      }
      Write-Log 'INFO' "Monitoreo post-reinicio fin $server -> $($sync.result): $($sync.status)"
      try { if ($job.handle.IsCompleted) { $job.ps.EndInvoke($job.handle) } } catch {}
      try { $job.ps.Dispose() } catch {}
      try { $job.rs.Close(); $job.rs.Dispose() } catch {}
      $script:RebootJobs.Remove($server)
    }
  }
}

# Detiene todos los monitoreos post-reinicio
function Stop-AllRebootMonitors {
  foreach ($server in @($script:RebootJobs.Keys)) {
    $job = $script:RebootJobs[$server]
    try { $job.ps.Stop() }    catch {}
    try { $job.ps.Dispose() } catch {}
    try { $job.rs.Close(); $job.rs.Dispose() } catch {}
    $script:RebootJobs.Remove($server)
  }
  if ($script:RebootTimer) { try { $script:RebootTimer.Stop() } catch {} }
}

#==============================================================================
#  AUTO-REINICIO (countdown + ejecucion via PsExec)
#==============================================================================

function Start-AutoRebootTimer {
  if (-not $script:AutoRebootTimer) {
    $script:AutoRebootTimer = New-Object System.Windows.Threading.DispatcherTimer
    $script:AutoRebootTimer.Interval = [TimeSpan]::FromSeconds(1)
    $script:AutoRebootTimer.add_Tick({ On-AutoRebootTick })
  }
  if (-not $script:AutoRebootTimer.IsEnabled) { $script:AutoRebootTimer.Start() }
}

function On-AutoRebootTick {
  if ($script:AutoRebootPending.Count -eq 0) {
    if ($script:AutoRebootTimer) { $script:AutoRebootTimer.Stop() }
    return
  }
  foreach ($server in @($script:AutoRebootPending.Keys)) {
    $deadline = $script:AutoRebootPending[$server]
    $row      = Get-Row $server
    $secsLeft = [int]($deadline - (Get-Date)).TotalSeconds

    if ($secsLeft -gt 0) {
      # Actualizar cuenta regresiva en Status
      if ($row) { $row.Status = "Reinicio automatico en ${secsLeft}s..." }
    } else {
      # Tiempo cumplido: ejecutar el reinicio
      $script:AutoRebootPending.Remove($server)
      if (-not (Test-Path $script:PsExecPath)) {
        Write-Log 'ERROR' "Auto-reinicio ${server}: PsExec no encontrado"
        if ($row) { $row.Error = 'Auto-reinicio: PsExec no encontrado' }
        continue
      }
      try {
        $null = & $script:PsExecPath "\\$server" -accepteula -nobanner -d -s `
                  shutdown /r /t 10 /c "Reinicio automatico iniciado por WUU" 2>&1
        if ($row) { $row.Status = 'Reinicio automatico enviado' }
        Write-Log 'INFO' "Auto-reinicio enviado a $server"
        Start-RebootMonitor $server   # el monitor existente toma el control desde aqui
      } catch {
        if ($row) { $row.Error = "Auto-reinicio: $($_.Exception.Message)" }
        Write-Log 'ERROR' "Auto-reinicio ${server}: $($_.Exception.Message)"
      }
    }
  }
}

# Cancela el countdown de un servidor (si el usuario lo reinicia manualmente antes)
function Cancel-AutoReboot($server) {
  if ($script:AutoRebootPending.ContainsKey($server)) {
    $script:AutoRebootPending.Remove($server)
    Write-Log 'INFO' "Auto-reinicio cancelado para $server (reinicio manual)"
  }
}

function Stop-AllAutoReboots {
  $script:AutoRebootPending.Clear()
  if ($script:AutoRebootTimer) { try { $script:AutoRebootTimer.Stop() } catch {} }
}

#==============================================================================
#  LOG DE INICIO DE SESION (seleccion de grupos)
#==============================================================================

# Arranca/reinicia el timer de debounce (1.5s). Cada vez que el usuario
# marca/desmarca un grupo, el timer se reinicia; el log solo se escribe
# cuando pasan 1.5s sin cambios.
function Start-GroupSelDebounce {
  if (-not $script:GroupSelTimer) {
    $script:GroupSelTimer = New-Object System.Windows.Threading.DispatcherTimer
    $script:GroupSelTimer.Interval = [TimeSpan]::FromMilliseconds(1500)
    $script:GroupSelTimer.add_Tick({ On-GroupSelTick })
  }
  # Reiniciar: apagar y volver a encender para resetear el contador
  $script:GroupSelTimer.Stop()
  $script:GroupSelPending = $true
  $script:GroupSelTimer.Start()
}

function Stop-GroupSelDebounce {
  $script:GroupSelPending = $false
  if ($script:GroupSelTimer) { $script:GroupSelTimer.Stop() }
}

function On-GroupSelTick {
  $script:GroupSelTimer.Stop()
  if (-not $script:GroupSelPending -or $script:Servers.Count -eq 0) { return }
  $script:GroupSelPending = $false

  # Grupos seleccionados y total de servidores al momento de disparar
  $grupos   = @($script:Groups | Where-Object { $_.IsChecked } | ForEach-Object { $_.Name })
  $total    = $script:Servers.Count
  $horaInicio = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  $grupoStr   = $grupos -join ', '

  Write-Log 'INFO' "Sesion iniciada. Grupos: $grupoStr | Servidores: $total | Hora: $horaInicio"
}

#==============================================================================
#  HISTORIAL ACUMULADO (CSV + JSON)
#==============================================================================

function Save-History([array]$Rows, [string]$Type = 'Parcheo') {
  if (-not $script:Cfg.History.Enabled -or $Rows.Count -eq 0) { return }
  try {
    $histDir    = Join-Path $script:ScriptDir 'Historial'
    $detailDir  = Join-Path $histDir 'Detail'
    foreach ($d in @($histDir,$detailDir)) {
      if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
    }
    $now    = Get-Date
    $ts     = $now.ToString('yyyy-MM-dd_HH-mm-ss')
    $tsDisp = $now.ToString('yyyy-MM-dd HH:mm:ss')

    # JSON detallado por corrida
    $detail = [ordered]@{
      RunDate  = $tsDisp
      RunType  = $Type
      Computer = $env:COMPUTERNAME
      servers  = @($Rows | ForEach-Object {
        [ordered]@{
          Servidor=$_.Servidor; IP=$_.IP; Estado=$_.State
          Status=$_.Status; Error=$_.Error; RunningTime=$_.RunningTime
        }
      })
    }
    ($detail | ConvertTo-Json -Depth 5) | Set-Content -Path (Join-Path $detailDir "$ts.json") -Encoding UTF8

    # CSV acumulado (una fila por servidor por corrida)
    $csvPath = Join-Path $histDir 'historial.csv'
    $csvRows = @($Rows | ForEach-Object {
      [pscustomobject][ordered]@{
        FechaCorrida = $tsDisp
        TipoCorrida  = $Type
        Servidor     = $_.Servidor
        IP           = $_.IP
        Estado       = $_.State
        Status       = $_.Status
        Error        = $_.Error
        RunningTime  = $_.RunningTime
        Equipo       = $env:COMPUTERNAME
      }
    })
    $csvRows | Export-Csv -Path $csvPath -NoTypeInformation -Delimiter ';' -Encoding UTF8 -Append

    # Purgar entradas antiguas del CSV segun RetentionDays
    $retDays = [int]$script:Cfg.History.RetentionDays
    if ($retDays -gt 0 -and (Test-Path $csvPath)) {
      $cutoff = (Get-Date).AddDays(-$retDays).ToString('yyyy-MM-dd')
      $kept   = Import-Csv -Path $csvPath -Delimiter ';' |
                Where-Object { $_.FechaCorrida -ge $cutoff }
      $kept | Export-Csv -Path $csvPath -NoTypeInformation -Delimiter ';' -Encoding UTF8
      # Purgar JSONs antiguos
      Get-ChildItem $detailDir -Filter '*.json' |
        Where-Object { $_.BaseName -lt $cutoff.Replace('-','') } |
        Remove-Item -Force -ErrorAction SilentlyContinue
    }
    Write-Log 'INFO' "Historial guardado: $ts ($($Rows.Count) servidores, tipo=$Type)"
  } catch { Write-Log 'ERROR' "Historial: $($_.Exception.Message)" }
}

#==============================================================================
#  TAREA PROGRAMADA (Windows Task Scheduler)
#==============================================================================

function Get-TaskStatus {
  try {
    $t = Get-ScheduledTask -TaskName $script:Cfg.ScheduledReport.TaskName -ErrorAction Stop
    return $t.State
  } catch { return 'NoExiste' }
}

function Show-SchedulerWindow {
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Reporte programado" Height="370" Width="460"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <StackPanel Margin="20">
    <TextBlock Text="Configuracion del reporte automatico" FontSize="15" FontWeight="SemiBold" Margin="0,0,0,16"/>
    <Grid Margin="0,0,0,10">
      <Grid.ColumnDefinitions><ColumnDefinition Width="160"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="Auto"/>
      </Grid.RowDefinitions>
      <TextBlock Grid.Row="0" Grid.Column="0" Text="Estado actual:" VerticalAlignment="Center" Margin="0,6"/>
      <TextBlock x:Name="lblState" Grid.Row="0" Grid.Column="1" Text="-" VerticalAlignment="Center" FontWeight="SemiBold" Margin="0,6"/>
      <TextBlock Grid.Row="1" Grid.Column="0" Text="Nombre de tarea:" VerticalAlignment="Center" Margin="0,6"/>
      <TextBox  x:Name="txtName" Grid.Row="1" Grid.Column="1" Padding="4,3" Margin="0,4"/>
      <TextBlock Grid.Row="2" Grid.Column="0" Text="Hora de ejecucion:" VerticalAlignment="Center" Margin="0,6"/>
      <StackPanel Grid.Row="2" Grid.Column="1" Orientation="Horizontal">
        <TextBox x:Name="txtHour" Width="50" Padding="4,3" Margin="0,4,6,4" TextAlignment="Center"/>
        <TextBlock Text=":" VerticalAlignment="Center" Margin="0,0,6,0"/>
        <TextBox x:Name="txtMin"  Width="50" Padding="4,3" Margin="0,4" TextAlignment="Center"/>
      </StackPanel>
      <TextBlock Grid.Row="3" Grid.Column="0" Text="Script WUU.ps1:" VerticalAlignment="Center" Margin="0,6"/>
      <TextBlock x:Name="lblScript" Grid.Row="3" Grid.Column="1" Text="-" VerticalAlignment="Center" Margin="0,6"
                 TextTrimming="CharacterEllipsis" ToolTip="-"/>
      <TextBlock Grid.Row="4" Grid.Column="0" Text="Cobertura:" VerticalAlignment="Center" Margin="0,6"/>
      <TextBlock Grid.Row="4" Grid.Column="1" Text="Todos los grupos del CSV" VerticalAlignment="Center"
                 Margin="0,6" Foreground="#FF475569"/>
    </Grid>
    <Separator Margin="0,6"/>
    <DockPanel Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnCreate" Content="Crear / Actualizar tarea" Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnDelete" Content="Eliminar tarea"           Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnClose2" Content="Cerrar"                   Padding="14,7" DockPanel.Dock="Right"/>
    </DockPanel>
    <TextBlock x:Name="lblMsg" Text="" Margin="0,12,0,0" TextWrapping="Wrap"/>
  </StackPanel>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $sx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $txtName  = $win.FindName('txtName');  $txtName.Text  = "$($script:Cfg.ScheduledReport.TaskName)"
  $txtHour  = $win.FindName('txtHour'); $txtHour.Text  = "$($script:Cfg.ScheduledReport.Hour)"
  $txtMin   = $win.FindName('txtMin');  $txtMin.Text   = "{0:00}" -f [int]$script:Cfg.ScheduledReport.Minute
  $lblScript= $win.FindName('lblScript'); $lblScript.Text = $PSCommandPath; $lblScript.ToolTip = $PSCommandPath
  $lblState = $win.FindName('lblState')
  $lblMsg   = $win.FindName('lblMsg')

  function Refresh-State {
    $st = Get-TaskStatus
    $lblState.Text = $st
    $lblState.Foreground = if ($st -eq 'NoExiste') { [System.Windows.Media.Brushes]::Gray }
                           elseif ($st -eq 'Ready') { [System.Windows.Media.Brushes]::Green }
                           else { [System.Windows.Media.Brushes]::DarkOrange }
  }
  Refresh-State

  $win.FindName('btnCreate').Add_Click({
    $name = $txtName.Text.Trim()
    $h    = [int]($txtHour.Text.Trim()); $m = [int]($txtMin.Text.Trim())
    if (-not $name) { $lblMsg.Text='Ingresa un nombre para la tarea.'; return }
    if ($h -lt 0 -or $h -gt 23 -or $m -lt 0 -or $m -gt 59) { $lblMsg.Text='Hora invalida (HH 0-23, MM 0-59).'; return }
    try {
      $trigger = New-ScheduledTaskTrigger -Daily -At ("{0:00}:{1:00}" -f $h,$m)
      $action  = New-ScheduledTaskAction -Execute 'powershell.exe' `
                   -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$PSCommandPath`" -Scheduled"
      $set     = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 2) -StartWhenAvailable
      Register-ScheduledTask -TaskName $name -Trigger $trigger -Action $action `
        -Settings $set -RunLevel Highest -Force | Out-Null
      # Guardar en config.json
      $script:Cfg.ScheduledReport.TaskName = $name
      $script:Cfg.ScheduledReport.Hour     = $h
      $script:Cfg.ScheduledReport.Minute   = $m
      $script:Cfg.ScheduledReport.Enabled  = $true
      $script:Cfg | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $script:ScriptDir 'config.json') -Encoding UTF8
      $lblMsg.Foreground=[System.Windows.Media.Brushes]::Green
      $lblMsg.Text = "Tarea '$name' creada/actualizada. Se ejecuta diariamente a ${h}:$("{0:00}" -f $m)."
      Write-Log 'INFO' "Tarea programada creada: $name @ ${h}:$("{0:00}" -f $m)"
      Refresh-State
    } catch { $lblMsg.Foreground=[System.Windows.Media.Brushes]::Red; $lblMsg.Text="Error: $($_.Exception.Message)" }
  }.GetNewClosure())

  $win.FindName('btnDelete').Add_Click({
    $name = $txtName.Text.Trim()
    try {
      Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction Stop
      $script:Cfg.ScheduledReport.Enabled = $false
      $script:Cfg | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $script:ScriptDir 'config.json') -Encoding UTF8
      $lblMsg.Foreground=[System.Windows.Media.Brushes]::DarkOrange
      $lblMsg.Text = "Tarea '$name' eliminada."
      Write-Log 'INFO' "Tarea programada eliminada: $name"
      Refresh-State
    } catch { $lblMsg.Foreground=[System.Windows.Media.Brushes]::Red; $lblMsg.Text="Error: $($_.Exception.Message)" }
  }.GetNewClosure())

  $win.FindName('btnClose2').Add_Click({ $win.Close() }.GetNewClosure())
  $win.Owner = $Window
  $win.ShowDialog() | Out-Null
}

#==============================================================================
#  BUSCADOR DE SERVIDORES
#==============================================================================

function Close-SearchPopup {
  $script:popSearch.IsOpen = $false
  $script:lbSearch.ItemsSource = $null
}

# Agrega un servidor del CSV a la grilla (si no estaba ya)
function Add-ServerFromSearch($csvRow) {
  $name = "$($csvRow.Servidor)".Trim()
  $existing = $script:Servers | Where-Object { $_.Servidor -eq $name } | Select-Object -First 1
  if ($existing) {
    # Ya esta en la grilla: resaltar y scroll
    $script:dg.SelectedItem  = $existing
    $script:dg.ScrollIntoView($existing)
    # Quitar seleccion despues de 2s para no interferir con el flujo
    $ht = New-Object System.Windows.Threading.DispatcherTimer
    $ht.Interval = [TimeSpan]::FromSeconds(2)
    $ht.add_Tick({
      $ht.Stop()
      if ($script:dg.SelectedItem -eq $existing) { $script:dg.SelectedItem = $null }
    }.GetNewClosure())
    $ht.Start()
    Write-Log 'INFO' "Buscador: $name ya esta en la grilla (resaltado)"
  } else {
    # No esta: agregar
    $sr = New-Object ServerRow
    $sr.Servidor = "$($csvRow.Servidor)"
    $sr.IP       = "$($csvRow.IP)"
    $sr.Grupo    = "$($csvRow.Grupo)"
    $sr.Dominio  = "$($csvRow.Dominio)"
    $sr.OS       = "$($csvRow.OS)"
    $sr.Ambiente = "$($csvRow.Ambiente)"
    $sr.State    = 'Unselected'
    $sr.add_PropertyChanged({ param($s,$e) if ($e.PropertyName -eq 'Sel') { On-ServerSelChanged $s } })
    $script:Servers.Add($sr)
    $script:dg.ScrollIntoView($sr)
    Update-ButtonStates
    Write-Log 'INFO' "Buscador: $name agregado a la grilla desde CSV"
  }
}

# Realiza la busqueda en el CSV y actualiza el popup
function Do-Search($text) {
  $text = $text.Trim()
  if ($text.Length -lt 2) { Close-SearchPopup; return }

  $matches = @($script:Csv | Where-Object {
    $_.Servidor -like "*$text*" -or $_.IP -like "*$text*"
  } | Select-Object -First 10)

  if ($matches.Count -eq 0) { Close-SearchPopup; return }

  $items = New-Object System.Collections.ObjectModel.ObservableCollection[object]
  foreach ($r in $matches) {
    $inGrid = $null -ne ($script:Servers | Where-Object { $_.Servidor -eq "$($r.Servidor)".Trim() } | Select-Object -First 1)
    $item = New-Object SearchResultItem
    $item.Display = "$($r.Servidor)"
    $item.Sub     = ("$($r.IP)" + $(if ($r.Grupo) { " | $($r.Grupo)" } else { '' }) +
                     $(if ($r.Ambiente) { " | $($r.Ambiente)" } else { '' }) +
                     $(if ($inGrid) { '  [ya en grilla]' } else { '' }))
    $item.Tag     = $r
    $items.Add($item)
  }
  $script:lbSearch.ItemsSource = $items
  $script:popSearch.IsOpen = $true
}

#--- Menu contextual (clic derecho sobre la grilla) ---------------------------
$cm = New-Object System.Windows.Controls.ContextMenu

# 1. Reiniciar servidor
$miReboot = New-Object System.Windows.Controls.MenuItem
$miReboot.Header = "Reiniciar servidor"
$miReboot.Add_Click({
  $sel = $script:dg.SelectedItem
  if (-not $sel) {
    [System.Windows.MessageBox]::Show("Selecciona primero una fila (clic sobre el servidor).","WUU",'OK','Information') | Out-Null
    return
  }
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }
  $resp = [System.Windows.MessageBox]::Show(
    "Vas a reiniciar '$($sel.Servidor)' ahora.`nEl servidor se reiniciara en 10 segundos. Continuar?",
    "WUU - Reinicio", 'YesNo', 'Warning')
  if ($resp -ne 'Yes') { return }
  Write-Log 'INFO' "Reinicio confirmado para $($sel.Servidor)"
  try {
    $null = & $script:PsExecPath "\\$($sel.Servidor)" -accepteula -nobanner -d -s `
              shutdown /r /t 10 /c "Reinicio iniciado desde WUU" 2>&1
    $sel.Status = 'Reinicio enviado'
    Write-Log 'INFO' "Reinicio enviado a $($sel.Servidor)"
    Cancel-AutoReboot $sel.Servidor   # cancela el countdown si habia uno pendiente
    Start-RebootMonitor $sel.Servidor
  } catch {
    $sel.Error = "Reinicio: $($_.Exception.Message)"
    Write-Log 'ERROR' "Reinicio $($sel.Servidor): $($_.Exception.Message)"
  }
})

# 2. Ver historial de updates
$miHist = New-Object System.Windows.Controls.MenuItem
$miHist.Header = "Ver historial de updates"
$miHist.Add_Click({
  $sel = $script:dg.SelectedItem
  if (-not $sel) { [System.Windows.MessageBox]::Show("Selecciona primero una fila.","WUU",'OK','Information') | Out-Null; return }
  $sel.Status = 'Consultando historial...'
  Show-UpdateHistory $sel.Servidor
})

# 3. Log WU
$miWuLog = New-Object System.Windows.Controls.MenuItem
$miWuLog.Header = "Log WU"
$miWuLog.Add_Click({
  $sel = $script:dg.SelectedItem
  if (-not $sel) { [System.Windows.MessageBox]::Show("Selecciona primero una fila.","WUU",'OK','Information') | Out-Null; return }
  $sel.Status = 'Consultando log WU...'
  Show-WuLog $sel.Servidor
})

# 4. Check for Updates (chequeo, descarga, instalacion y reinicio)
$miCheck = New-Object System.Windows.Controls.MenuItem
$miCheck.Header = "Check for Updates"
$miCheck.Add_Click({
  $sel = $script:dg.SelectedItem
  if (-not $sel) { [System.Windows.MessageBox]::Show("Selecciona primero una fila.","WUU",'OK','Information') | Out-Null; return }
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }
  if ($script:Jobs.ContainsKey($sel.Servidor) -or $script:FixJobs.ContainsKey($sel.Servidor)) {
    [System.Windows.MessageBox]::Show("'$($sel.Servidor)' ya esta en proceso.","WUU",'OK','Information') | Out-Null
    return
  }
  $resp = [System.Windows.MessageBox]::Show(
    "Check for Updates ejecutara el ciclo completo en '$($sel.Servidor)':`n`nBuscar parches -> Descargar -> Instalar -> Reiniciar (si aplica).`n`nContinuar?",
    "WUU - Check for Updates", 'YesNo', 'Warning')
  if ($resp -ne 'Yes') { return }
  Write-Log 'INFO' "Check for Updates (ciclo completo + reinicio): $($sel.Servidor)"
  $script:ManualCheck[$sel.Servidor] = $true
  Start-ServerJob $sel 'Install' -RebootAfter
})

# 5. Limpiar cache de actualizacion
$miClearCache = New-Object System.Windows.Controls.MenuItem
$miClearCache.Header = "Limpiar cache de actualizacion"
$miClearCache.Add_Click({
  $sel = $script:dg.SelectedItem
  if (-not $sel) { [System.Windows.MessageBox]::Show("Selecciona primero una fila.","WUU",'OK','Information') | Out-Null; return }
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }
  if ($script:Jobs.ContainsKey($sel.Servidor) -or $script:FixJobs.ContainsKey($sel.Servidor)) {
    [System.Windows.MessageBox]::Show("'$($sel.Servidor)' ya esta en proceso.","WUU",'OK','Information') | Out-Null
    return
  }
  $resp = [System.Windows.MessageBox]::Show(
    "Se limpiara la cache de Windows Update en '$($sel.Servidor)':`n`n1. Detener WU y BITS`n2. Vaciar SoftwareDistribution`n3. Renombrar catroot2 -> catroot2.old`n4. Reiniciar servicios y buscar/instalar updates`n`nContinuar?",
    "WUU - Limpiar cache", 'YesNo', 'Warning')
  if ($resp -ne 'Yes') { return }
  Write-Log 'INFO' "Limpiar cache WU + actualizar: $($sel.Servidor)"
  Start-ServerJob $sel 'Install' -ClearCacheFirst
})

# 6. Instalar updates (descarga e instalacion)
$miInstall = New-Object System.Windows.Controls.MenuItem
$miInstall.Header = "Instalar updates"
$miInstall.Add_Click({
  $sel = $script:dg.SelectedItem
  if (-not $sel) { [System.Windows.MessageBox]::Show("Selecciona primero una fila.","WUU",'OK','Information') | Out-Null; return }
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }
  if ($script:Jobs.ContainsKey($sel.Servidor)) {
    [System.Windows.MessageBox]::Show("'$($sel.Servidor)' ya esta en proceso.","WUU",'OK','Information') | Out-Null
    return
  }
  $resp = [System.Windows.MessageBox]::Show(
    "Vas a descargar e instalar updates en '$($sel.Servidor)'.`nContinuar?",
    "WUU - Instalar updates", 'YesNo', 'Warning')
  if ($resp -ne 'Yes') { return }
  Write-Log 'INFO' "Instalar updates (manual): $($sel.Servidor)"
  $script:ManualCheck[$sel.Servidor] = $true
  if (-not $sel.Sel) { $sel.Sel = $true }
  Start-ServerJob $sel 'Install'
})

$cm.Items.Add($miReboot)     | Out-Null
$cm.Items.Add($miCheck)      | Out-Null
$cm.Items.Add($miClearCache) | Out-Null
$cm.Items.Add($miInstall)    | Out-Null
$cm.Items.Add((New-Object System.Windows.Controls.Separator)) | Out-Null
$cm.Items.Add($miHist) | Out-Null
$cm.Items.Add($miWuLog) | Out-Null
$script:dg.ContextMenu = $cm

#--- Eventos de botones --------------------------------------------------------

# Seleccionar todos: marca Sel en todas las filas visibles (inicia parcheo en cada una)
$btnSelectAll.Add_Click({
  if ($script:Servers.Count -eq 0) { return }
  $n = 0
  foreach ($s in $script:Servers) {
    if (-not $s.Sel) { $s.Sel = $true; $n++ }
    elseif (-not $script:Jobs.ContainsKey($s.Servidor)) { Start-ServerJob $s }
  }
  if ($n -gt 0) { Write-Log 'INFO' "Seleccionar todos: $n servidor(es) marcados ($($script:Servers.Count) en grilla)" }
  Update-ButtonStates
})

# Limpiar seleccion: desmarca todos los checkbox
$btnClear.Add_Click({
  foreach ($s in $script:Servers) { $s.Sel = $false; $s.State = 'Unselected'; $s.Status = '' }
  Update-ButtonStates
})

#--- Eventos del buscador -----------------------------------------------------

# Mostrar/ocultar el placeholder al escribir
$script:txtSearch.Add_TextChanged({
  $text = $script:txtSearch.Text
  $script:lblSearchHint.Visibility = if ($text.Length -eq 0) { 'Visible' } else { 'Collapsed' }
  Do-Search $text
})

# Al seleccionar un resultado: agregar o resaltar y cerrar el popup
$script:lbSearch.Add_SelectionChanged({
  $sel = $script:lbSearch.SelectedItem
  if ($sel) {
    Close-SearchPopup
    $script:txtSearch.Clear()
    $script:lblSearchHint.Visibility = 'Visible'
    Add-ServerFromSearch $sel.Tag
    $script:lbSearch.SelectedItem = $null
  }
})

# Cerrar popup al presionar Escape o Enter
$script:txtSearch.Add_KeyDown({
  param($s, $e)
  if ($e.Key -eq 'Escape') { Close-SearchPopup; $script:txtSearch.Clear(); $script:lblSearchHint.Visibility='Visible' }
  if ($e.Key -eq 'Return' -and $script:lbSearch.Items.Count -gt 0) {
    $script:lbSearch.SelectedIndex = 0
  }
})

# Cerrar popup si el txtSearch pierde el foco hacia algo que no sea el popup
$script:txtSearch.Add_LostFocus({
  $Window.Dispatcher.BeginInvoke(
    [action]{ if (-not $script:lbSearch.IsKeyboardFocusWithin) { Close-SearchPopup } },
    [System.Windows.Threading.DispatcherPriority]::Background) | Out-Null
})

# Reporte: recolecta todos los servidores, muestra la grilla y sincroniza con Vercel
$btnReport.Add_Click({ Show-Report })

# Fix: instala .msu / .cab de la carpeta Fix\ en servidores elegidos
$btnFix.Add_Click({ Start-FixFlow })

# Programar: abre la ventana de gestion de la tarea programada
$btnProgramar.Add_Click({ Show-SchedulerWindow })

# Recargar grupos: limpia la grilla y permite volver a elegir grupos
$btnReload.Add_Click({
  foreach ($server in @($script:Jobs.Keys)) { Stop-ServerJob $server }
  if ($script:Timer) { $script:Timer.Stop() }
  Stop-GroupSelDebounce   # cancelar log pendiente si habia uno
  $script:Suspend = $true
  foreach ($g in $script:Groups) { $g.IsChecked = $false }
  $script:Suspend = $false
  $script:Servers.Clear()
  Update-GroupButtonText
  Update-ButtonStates
})

# Detener y refrescar: detiene todos los procesos en ejecucion de forma segura
$btnStop.Add_Click({
  $activos = @($script:Jobs.Keys)
  $fixActivos = @($script:FixJobs.Keys)
  Write-Log 'INFO' ("Detener y refrescar: deteniendo {0} parcheo(s) y {1} Fix activo(s)." -f $activos.Count, $fixActivos.Count)
  foreach ($server in $activos) { Stop-ServerJob $server }
  Stop-AllFixJobs
  Stop-AllRebootMonitors
  Stop-AllAutoReboots
  foreach ($s in $script:Servers) {
    $s.Sel=$false; $s.State='Unselected'; $s.Status='Detenido'
    $s.Available=''; $s.Downloaded=''; $s.DownloadPct=''
  }
  if ($script:Timer) { $script:Timer.Stop() }
  Update-ButtonStates
  [System.Windows.MessageBox]::Show(
    "Se detuvieron todos los procesos en ejecucion.`n`nNota: una instalacion ya en curso en un servidor termina el update actual antes de detenerse, para no dejarlo a medias.",
    "WUU", 'OK', 'Information') | Out-Null
})

#--- Captura de errores no controlados (los registra en el log) ---------------
try {
  $Window.Dispatcher.add_UnhandledException({
    param($s, $e)
    Write-Log 'ERROR' ("No controlado: " + $e.Exception.Message)
    $e.Handled = $true   # registra y evita que WUU se cierre de golpe
  })
} catch { }

#--- Limpieza al cerrar la ventana --------------------------------------------
$Window.Add_Closing({
  Write-Log 'INFO' 'WUU cerrandose. Deteniendo procesos activos.'
  try { if ($script:Timer) { $script:Timer.Stop() } } catch {}
  foreach ($server in @($script:Jobs.Keys)) { try { Stop-ServerJob $server } catch {} }
  try { Stop-AllFixJobs } catch {}
  try { Stop-AllRebootMonitors } catch {}
  try { Stop-AllAutoReboots }    catch {}
})

#--- Arranque -----------------------------------------------------------------
if ($Scheduled) {
  #============================================================================
  #  MODO HEADLESS (-Scheduled): genera reporte, sincroniza y notifica
  #  Ejecutado por la tarea programada del Programador de Windows.
  #============================================================================
  Write-Log 'INFO' 'Modo headless (-Scheduled) iniciado.'
  Load-Csv
  if ($script:Csv.Count -eq 0) { Write-Log 'ERROR' 'Sin servidores en CSV. Saliendo.'; exit 1 }

  # Tomar todos los servidores de todos los grupos
  $allServers = @($script:Csv | Select-Object -ExpandProperty Servidor -Unique)
  Write-Log 'INFO' "Headless: consultando $($allServers.Count) servidor(es)."

  # Correr el worker de reporte en paralelo (mismo mecanismo que el boton Reporte)
  $bag  = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $pool = @()
  $rjob = {
    param($server,$psexec,$worker,$rel,$bag)
    $obj=$null
    try {
      $remoteDir="\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\report.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\report.ps1" -Force -ErrorAction Stop
      $null=& $psexec "\\$server" -accepteula -nobanner -s `
              powershell.exe -ExecutionPolicy Bypass -NonInteractive `
              -File "C:\$rel\report.ps1" 2>&1
      if (Test-Path "$remoteDir\report.json") {
        $raw=Get-Content "$remoteDir\report.json" -Raw
        if ($raw) { $obj=$raw|ConvertFrom-Json }
      }
    } catch {}
    if (-not $obj) {
      $obj=[pscustomobject]@{
        Dominio='';Servidor=$server;IP='';Sistema_Operativo='';Version_Sistema_Operativo='';
        Fecha_Instalacion='';KBs_Instaladas='';Fecha_Reinicio='';Running_Time='';
        Descripcion_Error='Sin conexion o sin datos'
      }
    }
    [void]$bag.Add($obj)
  }
  foreach ($sv in $allServers) {
    $rs=[runspacefactory]::CreateRunspace();$rs.ApartmentState='MTA';$rs.Open()
    $ps=[powershell]::Create();$ps.Runspace=$rs
    $ps.AddScript($rjob.ToString()).
        AddArgument($sv).AddArgument($script:PsExecPath).
        AddArgument($script:LocalReportWorker).AddArgument($script:RemoteRel).
        AddArgument($bag) | Out-Null
    $pool+=@{ps=$ps;handle=$ps.BeginInvoke();rs=$rs}
  }
  # Esperar con timeout de 10 minutos
  $deadline=(Get-Date).AddMinutes(10)
  while ($bag.Count -lt $allServers.Count -and (Get-Date) -lt $deadline) { Start-Sleep -Milliseconds 500 }
  foreach ($j in $pool) {
    try { if ($j.handle.IsCompleted){$j.ps.EndInvoke($j.handle)} } catch {}
    try { $j.ps.Dispose() } catch {}
    try { $j.rs.Close();$j.rs.Dispose() } catch {}
  }
  Write-Log 'INFO' "Headless: $($bag.Count)/$($allServers.Count) servidor(es) respondieron."

  # Guardar CSV + JSON del reporte
  $rows = @($bag | Sort-Object Servidor | ForEach-Object {
    [pscustomobject][ordered]@{
      Dominio=$_.Dominio;Servidor=$_.Servidor;IP=$_.IP
      Sistema_Operativo=$_.Sistema_Operativo;Version_Sistema_Operativo=$_.Version_Sistema_Operativo
      Fecha_Instalacion=$_.Fecha_Instalacion;KBs_Instaladas=$_.KBs_Instaladas
      Fecha_Reinicio=$_.Fecha_Reinicio;Running_Time=$_.Running_Time;Descripcion_Error=$_.Descripcion_Error
    }
  })
  $reportDir = Join-Path $script:ScriptDir 'Reportes'
  if (-not (Test-Path $reportDir)){ New-Item -ItemType Directory -Path $reportDir -Force | Out-Null }
  $rfile = Join-Path $reportDir ("Reporte_{0}.csv" -f (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'))
  $rows | Export-Csv -Path $rfile -NoTypeInformation -Delimiter ';' -Encoding UTF8
  Write-Log 'INFO' "Headless: reporte CSV guardado en $rfile"

  # Sincronizar con Vercel (mismo formato que el modo interactivo)
  if ($script:WUUDashboardUploadEnabled -and $script:WUUDashboardUploadUrl) {
    try {
      [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
      $vServers = @($bag | ForEach-Object {
        [ordered]@{
          Dominio=$_.Dominio; Servidor=$_.Servidor; IP=$_.IP
          Sistema_Operativo=$_.Sistema_Operativo; Version_Sistema_Operativo=$_.Version_Sistema_Operativo
          Fecha_Instalacion=$_.Fecha_Instalacion; KBs_Instaladas=$_.KBs_Instaladas
          Fecha_Reinicio=$_.Fecha_Reinicio; Running_Time=$_.Running_Time; Descripcion_Error=$_.Descripcion_Error
        }
      })
      # Deduplicar por nombre de servidor
      $deduped = [ordered]@{}
      foreach ($s in $vServers) { $n="$($s.Servidor)".Trim(); if ($n) { $deduped[$n]=$s } }
      $vServers = @($deduped.Values)
      $payload  = $vServers | ConvertTo-Json -Depth 5
      if ($vServers.Count -eq 1 -and $payload -notmatch '^\s*\[') { $payload = "[$payload]" }
      Invoke-WebRequest -Uri $script:WUUDashboardUploadUrl -Method Post -Body $payload `
        -ContentType 'application/json; charset=utf-8' -TimeoutSec 120 -UseBasicParsing | Out-Null
      Write-Log 'INFO' "Headless: sincronizacion Vercel correcta ($($vServers.Count) servidores)."
    } catch { Write-Log 'ERROR' "Headless Vercel: $($_.Exception.Message)" }
  }

  # Historial
  Save-History -Rows @($rows | ForEach-Object {
    [pscustomobject]@{Servidor=$_.Servidor;IP=$_.IP;State='Report';
      Status='Reporte programado';Error=$_.Descripcion_Error;RunningTime=$_.Running_Time}
  }) -Type 'ReporteProgramado'

  Write-Log 'INFO' 'Modo headless finalizado.'
  exit 0
} else {
  #============================================================================
  #  MODO NORMAL: interfaz grafica
  #============================================================================
  Load-Csv
  Update-ButtonStates
  $Window.ShowDialog() | Out-Null
}
