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
  [switch]$Scheduled,       # modo headless: genera reporte y sincroniza con Centro de Control de Parcheo
  [switch]$ScheduledPatch,  # modo headless: ejecuta una ventana unica de actualizacion
  [string]$JobFile = ''     # definicion JSON de la ventana de actualizacion
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
    $modeArgs = if ($Scheduled) { ' -Scheduled' }
                elseif ($ScheduledPatch) { " -ScheduledPatch -JobFile `"$JobFile`"" }
                else { '' }
    $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"$modeArgs"
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
    private bool _snap; public bool Snap {
        get{return _snap;}
        set{ if(_snap!=value){_snap=value; N("Snap"); N("SnapDisplay");}}
    }
    public string SnapDisplay { get{return _snap ? "SI" : "NO";} }
    private bool _confirmado; public bool Confirmado {
        get{return _confirmado;}
        set{ if(_confirmado!=value){_confirmado=value; N("Confirmado"); N("ConfirmadoDisplay");}}
    }
    public string ConfirmadoDisplay { get{return _confirmado ? "SI" : "NO";} }
    private string _servidor=""; public string Servidor { get{return _servidor;} set{_servidor=value; N("Servidor");}}
    private string _ip=""; public string IP { get{return _ip;} set{_ip=value; N("IP");}}
    private string _wsus=""; public string Wsus { get{return _wsus;} set{_wsus=value; N("Wsus");}}
    private string _available=""; public string Available { get{return _available;} set{_available=value; N("Available");}}
    private string _downloaded=""; public string Downloaded { get{return _downloaded;} set{_downloaded=value; N("Downloaded");}}
    private string _downloadPct=""; public string DownloadPct { get{return _downloadPct;} set{_downloadPct=value; N("DownloadPct");}}
    private string _error=""; public string Error { get{return _error;} set{_error=value; N("Error");}}
    private string _comentarios=""; public string Comentarios { get{return _comentarios;} set{_comentarios=value; N("Comentarios");}}
    private string _status=""; public string Status { get{return _status;} set{_status=value; N("Status");}}
    private string _runningTime=""; public string RunningTime { get{return _runningTime;} set{_runningTime=value; N("RunningTime");}}

    // Estado que controla el color de la fila:
    // Unselected | CheckWSUS | Remediation | DownloadInstall | RebootRequired | Updated
    private string _state="Unselected"; public string State { get{return _state;} set{_state=value; N("State");}}
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
    public string Comentarios {get;set;}
    public string Disk_Space {get;set;}
    public string Snap {get;set;}
    public string Confirmado {get;set;}
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

// Fila de espacio en disco (menu contextual)
public class DiskSpaceRow
{
    public string Unidad {get;set;}
    public string Etiqueta {get;set;}
    public string TotalGB {get;set;}
    public string LibreGB {get;set;}
    public string UsadoGB {get;set;}
    public string PorcLibre {get;set;}
    public string Estado {get;set;}
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

public class FixPackagePickItem : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;
    private void N(string p){ if(PropertyChanged!=null) PropertyChanged(this, new PropertyChangedEventArgs(p)); }
    private bool _isChecked;
    public bool IsChecked { get{return _isChecked;} set{ if(_isChecked!=value){_isChecked=value; N("IsChecked");}}}
    public string Name {get;set;}
    public string FullName {get;set;}
    public string Display {get;set;}
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
      <Rectangle Width="1" Height="20" Fill="#FFE2E8F0" Margin="16,0,12,0" VerticalAlignment="Center"/>
      <TextBlock Text="Analista asignado:" VerticalAlignment="Center" FontWeight="SemiBold" Margin="0,0,8,0"/>
      <TextBlock x:Name="lblAnalyst" Text="-" VerticalAlignment="Center" FontWeight="SemiBold"
                 Foreground="#FF1D4ED8"/>
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
        <DataGridTemplateColumn Header="Snap" Width="78" CanUserSort="False">
          <DataGridTemplateColumn.CellTemplate>
            <DataTemplate>
              <StackPanel Orientation="Horizontal" HorizontalAlignment="Center" VerticalAlignment="Center">
                <CheckBox IsChecked="{Binding Snap, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                          VerticalAlignment="Center"/>
                <TextBlock Text="{Binding SnapDisplay}" Margin="6,0,0,0" VerticalAlignment="Center"/>
              </StackPanel>
            </DataTemplate>
          </DataGridTemplateColumn.CellTemplate>
        </DataGridTemplateColumn>
        <DataGridTemplateColumn Header="Confirmado" Width="110" CanUserSort="False">
          <DataGridTemplateColumn.CellTemplate>
            <DataTemplate>
              <StackPanel Orientation="Horizontal" HorizontalAlignment="Center" VerticalAlignment="Center">
                <CheckBox IsChecked="{Binding Confirmado, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                          VerticalAlignment="Center"/>
                <TextBlock Text="{Binding ConfirmadoDisplay}" Margin="6,0,0,0" VerticalAlignment="Center"/>
              </StackPanel>
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
        <DataGridTextColumn Header="Comentarios"   Binding="{Binding Comentarios}" Width="220"/>
        <DataGridTextColumn Header="Status"        Binding="{Binding Status}"      Width="*"/>
        <DataGridTextColumn Header="Running Time"  Binding="{Binding RunningTime}" Width="110"/>
      </DataGrid.Columns>
    </DataGrid>

    <!-- ===== Fila 3: Botones ===== -->
    <DockPanel Grid.Row="3" Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnSelectAll" Content="Seleccionar todos" Style="{StaticResource Btn}" Background="#FF22C55E" Margin="0,0,8,0"/>
      <Button x:Name="btnClear"     Content="Limpiar seleccion"   Style="{StaticResource Btn}" Background="#FF64748B" Margin="0,0,8,0"/>
      <Button x:Name="btnAdd"       Content="Agregar"             Style="{StaticResource Btn}" Background="#FF0284C7" Margin="0,0,8,0"/>
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
$script:lblAnalyst     = $Window.FindName('lblAnalyst')
$btnSelectAll     = $Window.FindName('btnSelectAll')
$btnClear         = $Window.FindName('btnClear')
$btnAdd           = $Window.FindName('btnAdd')
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
$script:AnalistaAsignado = ''

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
    Url     = 'https://patching-dashboard-hae3f7fxc6fnhhbt.canadacentral-01.azurewebsites.net/api/upload'
  }
  ScheduledReport = [ordered]@{
    Enabled      = $false
    Hour         = 8
    Minute       = 0
    StartDate    = ''   # dd/mm/aaaa; vacio = hoy
    TaskName     = 'WUU_ReporteAutomatico'
    PeriodMode   = 'CurrentMonth' # CurrentMonth | PreviousMonth | SpecificDate
    SpecificDate = ''             # dd/mm/aaaa
  }
  History = [ordered]@{
    Enabled       = $true
    RetentionDays = 90
  }
  AutoReboot = [ordered]@{
    Enabled      = $true    # reinicia automaticamente si el parcheo lo requiere
    DelaySeconds = 60       # margen antes de ejecutar el reinicio
  }
  Teams = [ordered]@{
    Enabled    = $false
    WebhookUrl = ''         # Incoming Webhook o Workflows de Teams
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
    foreach ($sec in @('Dashboard','ScheduledReport','History','AutoReboot','Teams')) {
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

function Send-TeamsNotification {
  param(
    [Parameter(Mandatory)][string]$Title,
    [string]$Text = '',
    [ValidateSet('Info','Success','Warning','Error')]
    [string]$Level = 'Info',
    [object[]]$Facts = @()
  )
  if (-not [bool]$script:Cfg.Teams.Enabled) { return }
  $url = "$($script:Cfg.Teams.WebhookUrl)".Trim()
  if (-not $url) {
    Write-Log 'WARN' 'Teams habilitado pero Teams.WebhookUrl esta vacio.'
    return
  }
  $color = switch ($Level) {
    'Success' { '16A34A' }
    'Warning' { 'D97706' }
    'Error'   { 'DC2626' }
    default   { '0078D4' }
  }
  $lines = New-Object System.Collections.Generic.List[string]
  if ($Text) { [void]$lines.Add($Text) }
  foreach ($fact in @($Facts)) {
    $name = ''; $value = ''
    if ($fact -is [hashtable] -or $fact -is [System.Collections.Specialized.OrderedDictionary]) {
      $name = "$($fact.Name)"; $value = "$($fact.Value)"
    } else {
      try { $name = "$($fact.Name)"; $value = "$($fact.Value)" } catch {}
    }
    if ($name) { [void]$lines.Add("**${name}:** $value") }
  }
  $bodyText = ($lines -join "`n").Trim()
  $htmlText = (($bodyText -replace '&','&amp;') -replace '<','&lt;') -replace "`n",'<br>'
  $card = [ordered]@{
    '@type'      = 'MessageCard'
    '@context'   = 'https://schema.org/extensions'
    themeColor   = $color
    summary      = $Title
    title        = $Title
    text         = $htmlText
  }
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $json = $card | ConvertTo-Json -Depth 6 -Compress
    Invoke-WebRequest -Uri $url -Method Post -Body $json `
      -ContentType 'application/json; charset=utf-8' -TimeoutSec 20 -UseBasicParsing | Out-Null
    Write-Log 'INFO' "Teams: notificacion enviada ($Title)"
  } catch {
    try {
      $plain = @{ text = ("$Title`n`n$bodyText").Trim() } | ConvertTo-Json -Compress
      Invoke-WebRequest -Uri $url -Method Post -Body $plain `
        -ContentType 'application/json; charset=utf-8' -TimeoutSec 20 -UseBasicParsing | Out-Null
      Write-Log 'INFO' "Teams: notificacion enviada con payload simple ($Title)"
    } catch {
      Write-Log 'WARN' "Teams: no se pudo notificar. $($_.Exception.Message)"
    }
  }
}

function Format-TeamsErrorList([object[]]$Items, [int]$Max = 12) {
  $all = @($Items | Where-Object { "$_".Trim() })
  if ($all.Count -eq 0) { return 'Ninguno' }
  $list = @($all | Select-Object -First $Max)
  $text = ($list -join "`n")
  $extra = $all.Count - $list.Count
  if ($extra -gt 0) { $text += "`n... y $extra mas." }
  return $text
}

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
  [ValidateSet('Install')]
  [string]$Mode = 'Install',
  [switch]$ClearCacheFirst,
  [switch]$RebootAfter
)
$ErrorActionPreference = "Stop"
$base       = Split-Path -Parent $MyInvocation.MyCommand.Path
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

function Clear-WuCache([string]$label, [switch]$RebootWhenDone) {
  $state.stage = "remediate"
  $state.status = $label
  Save-State

  if (Test-Path "C:\Windows\SoftwareDistribution.old") {
    Remove-Item "C:\Windows\SoftwareDistribution.old" -Recurse -Force -ErrorAction SilentlyContinue
  }
  if (Test-Path "C:\Windows\System32\Catroot2.old") {
    Remove-Item "C:\Windows\System32\Catroot2.old" -Recurse -Force -ErrorAction SilentlyContinue
  }

  net.exe stop wuauserv 2>$null | Out-Null
  net.exe stop cryptSvc 2>$null | Out-Null
  net.exe stop bits 2>$null | Out-Null
  net.exe stop msiserver 2>$null | Out-Null

  if (Test-Path "C:\Windows\SoftwareDistribution") {
    cmd.exe /c "ren C:\Windows\SoftwareDistribution SoftwareDistribution.old" 2>$null | Out-Null
  }
  if (Test-Path "C:\Windows\System32\catroot2") {
    cmd.exe /c "ren C:\Windows\System32\catroot2 Catroot2.old" 2>$null | Out-Null
  }

  net.exe start wuauserv 2>$null | Out-Null
  net.exe start cryptSvc 2>$null | Out-Null
  net.exe start bits 2>$null | Out-Null
  net.exe start msiserver 2>$null | Out-Null

  try { & gpupdate.exe /force 2>$null | Out-Null } catch {}

  if ($RebootWhenDone) {
    $state.stage = "reboot"
    $state.rebootRequired = $true
    $state.status = "Cache limpiada. Reiniciando en 10 segundos..."
    Save-State
    Start-Process shutdown.exe -ArgumentList "/r","/t","10","/c","Reinicio tras limpieza cache WUU" -NoNewWindow
  }
}

function Invoke-RebootIfRequested([bool]$shouldReboot) {
  if (-not $RebootAfter -or -not $shouldReboot) { return }
  $state.status = "Reiniciando en 10 segundos..."
  Save-State
  Start-Process shutdown.exe -ArgumentList "/r","/t","10","/c","Reinicio post-actualizacion WUU" -NoNewWindow -Wait
}

function Get-WuWsusErrors([string]$SearchError) {
  $msgs = @()
  if ($SearchError) { $msgs += $SearchError.Trim() }
  foreach ($svc in @('wuauserv','bits')) {
    try {
      $st = Get-Service $svc -ErrorAction Stop
      if ($st.Status -ne 'Running') { $msgs += "Servicio $svc : $($st.Status)" }
    } catch { $msgs += "Servicio $svc : no disponible" }
  }
  try {
    $fh = @{ LogName='System'; ProviderName='Microsoft-Windows-WindowsUpdateClient'; Level=@(2,3) }
    foreach ($e in @(Get-WinEvent -FilterHashtable $fh -MaxEvents 25 -ErrorAction SilentlyContinue)) {
      $line = (($e.Message -split "`r?`n")[0]).Trim()
      if ($line) { $msgs += $line }
    }
  } catch {}
  try {
    foreach ($e in @(Get-WinEvent -LogName 'Microsoft-Windows-WindowsUpdateClient/Operational' -MaxEvents 50 -ErrorAction SilentlyContinue | Where-Object { $_.Level -le 3 })) {
      $line = (($e.Message -split "`r?`n")[0]).Trim()
      if ($line -and ($line -match '(?i)error|fallo|failed|8024|80072|wsus|sincroniz|sync')) { $msgs += $line }
    }
  } catch {}
  $uniq = @($msgs | Where-Object { $_ } | ForEach-Object { $_.Trim() } | Select-Object -Unique)
  if ($uniq.Count -gt 3) { return ($uniq | Select-Object -First 3) -join ' | ' }
  return ($uniq -join ' | ')
}

function Merge-WuError([string]$Msg) {
  if (-not $Msg) { return }
  if ($state.error) {
    if ($state.error -notmatch [regex]::Escape($Msg)) { $state.error = "$($state.error) | $Msg" }
  } else { $state.error = $Msg }
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
    Clear-WuCache "Limpiando cache de actualizacion..." -RebootWhenDone
    return
  }

  # --- CHEQUEO WSUS/WU ------------------------------------------------------
  $session  = New-Object -ComObject Microsoft.Update.Session
  $searcher = $session.CreateUpdateSearcher()
  $needRemediate = $false
  $searchErr = ""
  try {
    $result = $searcher.Search("IsInstalled=0 and IsHidden=0")
  } catch {
    $needRemediate = $true
    $searchErr = $_.Exception.Message
    $state.error = "Fallo chequeo WU: $searchErr"
    Save-State
  }

  # --- REMEDIACION (solo si fallo el chequeo) ------------------------------
  if ($needRemediate) {
    Clear-WuCache "Remediando agente WU..."
    $state.stage="check"; $state.status="Re-chequeando tras remediacion..."; $state.error=""; Save-State
    $session  = New-Object -ComObject Microsoft.Update.Session
    $searcher = $session.CreateUpdateSearcher()
    $searchErr = ""
    try {
      $result = $searcher.Search("IsInstalled=0 and IsHidden=0")
    } catch {
      $searchErr = $_.Exception.Message
      throw
    }
  }

  $available = $result.Updates.Count
  $state.available = $available
  Merge-WuError (Get-WuWsusErrors $searchErr)
  $state.status = "$available update(s) disponibles"
  Save-State

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
  $hadDownloadError = $false
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
      $hadDownloadError = $true
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

  if ($hadDownloadError -or $instResult.ResultCode -ne 2 -or $errs.Count -gt 0) {
    $state.stage = "error"
    $state.status = "Instalacion finalizada con errores (codigo $($instResult.ResultCode))"
    if (-not $state.error) { $state.error = "Windows Update no informo una instalacion exitosa." }
    Save-State
    return
  }

  # --- Reinicio requerido? -------------------------------------------------
  $reboot = $instResult.RebootRequired
  if (-not $reboot) { try { $reboot = (New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired } catch {} }
  if ($reboot) { $state.stage="reboot"; $state.rebootRequired=$true; $state.status="Instalado. Requiere reinicio" }
  else         { $state.stage="done";   $state.status="Actualizado" }
  Save-State
  Invoke-RebootIfRequested ($reboot -or $available -gt 0)
}
catch {
  $state.stage="error"; $state.status="Error"
  Merge-WuError $_.Exception.Message
  try { Merge-WuError (Get-WuWsusErrors $_.Exception.Message) } catch {}
  try { Save-State } catch {}
}
'@

# Escribe el trabajador a disco (local) una sola vez al arrancar
Set-Content -Path $script:LocalWorker -Value $script:WorkerScript -Encoding UTF8
$script:WorkerScript = $null   # liberar ~6KB de memoria

#------------------------------------------------------------------------------
#  REPORTE - configuracion
#------------------------------------------------------------------------------

# Centro de Control: valores leidos desde config.json (seccion Dashboard)
$script:WUUDashboardUploadUrl     = $script:Cfg.Dashboard.Url
$script:WUUDashboardUploadEnabled = [bool]$script:Cfg.Dashboard.Enabled
$script:LocalReportWorker = Join-Path $env:TEMP 'WUU_report.ps1'
$script:RepBag            = $null
$script:RepPool           = @()
$script:RepTimer          = $null

# Script de consulta que corre en cada servidor (escribe report.json). Usa los
# comandos pedidos. Es texto literal; corre tal cual en el servidor.
$script:ReportWorker = @'
param(
  [ValidateSet("CurrentMonth","PreviousMonth","SpecificDate")]
  [string]$PeriodMode = "CurrentMonth",
  [string]$SpecificDate = ""
)
$ErrorActionPreference = "SilentlyContinue"
$base = "C:\Windows\Temp\WUU"
New-Item -ItemType Directory -Path $base -Force | Out-Null

$o = [ordered]@{
  Dominio=""; Servidor=""; IP=""; Sistema_Operativo=""; Version_Sistema_Operativo="";
  Fecha_Instalacion=""; KBs_Instaladas=""; Fecha_Reinicio=""; Running_Time=""; Descripcion_Error=""; Disk_Space=""
}
function Get-WuWsusErrors([string]$SearchError) {
  $msgs = @()
  if ($SearchError) { $msgs += $SearchError.Trim() }
  foreach ($svc in @('wuauserv','bits')) {
    try {
      $st = Get-Service $svc -ErrorAction Stop
      if ($st.Status -ne 'Running') { $msgs += "Servicio $svc : $($st.Status)" }
    } catch { $msgs += "Servicio $svc : no disponible" }
  }
  try {
    $fh = @{ LogName='System'; ProviderName='Microsoft-Windows-WindowsUpdateClient'; Level=@(2,3) }
    foreach ($e in @(Get-WinEvent -FilterHashtable $fh -MaxEvents 25 -ErrorAction SilentlyContinue)) {
      $line = (($e.Message -split "`r?`n")[0]).Trim()
      if ($line) { $msgs += $line }
    }
  } catch {}
  try {
    foreach ($e in @(Get-WinEvent -LogName 'Microsoft-Windows-WindowsUpdateClient/Operational' -MaxEvents 50 -ErrorAction SilentlyContinue | Where-Object { $_.Level -le 3 })) {
      $line = (($e.Message -split "`r?`n")[0]).Trim()
      if ($line -and ($line -match '(?i)error|fallo|failed|8024|80072|wsus|sincroniz|sync')) { $msgs += $line }
    }
  } catch {}
  $uniq = @($msgs | Where-Object { $_ } | ForEach-Object { $_.Trim() } | Select-Object -Unique)
  if ($uniq.Count -gt 3) { return ($uniq | Select-Object -First 3) -join ' | ' }
  return ($uniq -join ' | ')
}
function Merge-ReportError([string]$Msg) {
  if (-not $Msg) { return }
  if ($o.Descripcion_Error) {
    if ($o.Descripcion_Error -notmatch [regex]::Escape($Msg)) { $o.Descripcion_Error = "$($o.Descripcion_Error) | $Msg" }
  } else { $o.Descripcion_Error = $Msg }
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
  $currentMonthStart = (Get-Date -Year $now.Year -Month $now.Month -Day 1).Date
  switch ($PeriodMode) {
    "PreviousMonth" {
      $periodStart = $currentMonthStart.AddMonths(-1)
      $periodEnd = $currentMonthStart
    }
    "SpecificDate" {
      $parsedDate = [datetime]::ParseExact($SpecificDate,"yyyy-MM-dd",[Globalization.CultureInfo]::InvariantCulture)
      $periodStart = $parsedDate.Date
      $periodEnd = $periodStart.AddDays(1)
    }
    default {
      $periodStart = $currentMonthStart
      $periodEnd = $currentMonthStart.AddMonths(1)
    }
  }
  $periodHotfixes = @($all | Where-Object {
    ([datetime]$_.InstalledOn) -ge $periodStart -and ([datetime]$_.InstalledOn) -lt $periodEnd
  } | Sort-Object InstalledOn -Descending)
  if ($periodHotfixes.Count -gt 0) {
    $o.KBs_Instaladas = (@($periodHotfixes | Select-Object -ExpandProperty HotFixID -Unique) -join ", ")
    $latestInPeriod = $periodHotfixes | Select-Object -First 1
    if ($latestInPeriod) { $o.Fecha_Instalacion = ([datetime]$latestInPeriod.InstalledOn).ToString("yyyy-MM-dd") }
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
try {
  $parts = @()
  Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Sort-Object DeviceID | ForEach-Object {
    $freeGB = [math]::Round($_.FreeSpace / 1GB, 1)
    $parts += ("{0} {1} GB libres" -f $_.DeviceID, $freeGB)
  }
  $o.Disk_Space = ($parts -join ' | ')
} catch {}
try {
  $searchErr = ""
  try {
    $s = New-Object -ComObject Microsoft.Update.Session
    $null = $s.CreateUpdateSearcher().Search("IsInstalled=0 and IsHidden=0")
  } catch { $searchErr = $_.Exception.Message }
  Merge-ReportError (Get-WuWsusErrors $searchErr)
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
function Write-JsonArray($path, $list) {
  if (-not $list -or $list.Count -eq 0) { "[]" | Set-Content $path -Encoding UTF8; return }
  $json = '[' + (($list | ForEach-Object { ConvertTo-Json $_ -Compress -Depth 5 }) -join ',') + ']'
  $json | Set-Content $path -Encoding UTF8
}
Write-JsonArray "$base\history.json" $list
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
function Write-JsonArray($path, $list) {
  if (-not $list -or $list.Count -eq 0) { "[]" | Set-Content $path -Encoding UTF8; return }
  $json = '[' + (($list | ForEach-Object { ConvertTo-Json $_ -Compress -Depth 5 }) -join ',') + ']'
  $json | Set-Content $path -Encoding UTF8
}
Write-JsonArray "$base\wulog.json" $list
'@
Set-Content -Path $script:LocalWuLogWorker -Value $script:WuLogWorker -Encoding UTF8
$script:WuLogWorker = $null

# Espacio en disco (volumenes locales); escribe disk.json
$script:LocalDiskWorker = Join-Path $env:TEMP 'WUU_disk.ps1'
$script:DiskWorker = @'
$ErrorActionPreference = "SilentlyContinue"
$base = "C:\Windows\Temp\WUU"; New-Item -ItemType Directory -Path $base -Force | Out-Null
$list = @()
try {
  Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Sort-Object DeviceID | ForEach-Object {
    $totalGB = [math]::Round($_.Size / 1GB, 1)
    $freeGB  = [math]::Round($_.FreeSpace / 1GB, 1)
    $usedGB  = [math]::Round($totalGB - $freeGB, 1)
    $pctFree = if ($_.Size -gt 0) { [math]::Round(($_.FreeSpace / $_.Size) * 100, 1) } else { 0 }
    $list += [ordered]@{
      Unidad    = "$($_.DeviceID)"
      Etiqueta  = if ($_.VolumeName) { "$($_.VolumeName)" } else { "-" }
      TotalGB   = $totalGB
      LibreGB   = $freeGB
      UsadoGB   = $usedGB
      PorcLibre = $pctFree
    }
  }
} catch {}
if ($list.Count -eq 0) { "[]" | Set-Content "$base\disk.json" -Encoding UTF8 }
else {
  $json = '[' + (($list | ForEach-Object { ConvertTo-Json $_ -Compress -Depth 5 }) -join ',') + ']'
  $json | Set-Content "$base\disk.json" -Encoding UTF8
}
'@
Set-Content -Path $script:LocalDiskWorker -Value $script:DiskWorker -Encoding UTF8
$script:DiskWorker = $null

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
  $script:Jobs[$server] = @{ ps=$ps; handle=$handle; rs=$rs; sw=$sw; deadline=$deadline; clearCache=[bool]$ClearCacheFirst }
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

      if ($job.clearCache -and $finalStage -eq 'reboot') {
        Start-RebootMonitor $server
      } elseif ($script:JobRebootAfter.ContainsKey($server)) {
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

# Solicita el operador cuando se marca el primer grupo de la sesion.
function Show-AnalystDialog {
  [xml]$ax = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Analista asignado" Height="220" Width="440"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="20">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Grid.Row="0" Text="Identificacion del operador" FontSize="15"
               FontWeight="SemiBold" Margin="0,0,0,8"/>
    <TextBlock Grid.Row="1" TextWrapping="Wrap" Foreground="#FF475569" Margin="0,0,0,12"
               Text="Ingresa el nombre de la persona que ejecuta WUU. Se incluira en la sesion como Analista asignado."/>
    <TextBox x:Name="txtAnalyst" Grid.Row="2" Padding="6,5" Margin="0,0,0,8"/>
    <TextBlock x:Name="lblErr" Grid.Row="3" Foreground="#FFDC2626" Text="" TextWrapping="Wrap"/>
    <DockPanel Grid.Row="4" LastChildFill="False" HorizontalAlignment="Right">
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" Margin="0,0,8,0" IsCancel="True"/>
      <Button x:Name="btnOk" Content="Continuar" Padding="14,7" IsDefault="True"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $ax
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $txt = $win.FindName('txtAnalyst')
  $lbl = $win.FindName('lblErr')
  $ok = $win.FindName('btnOk')
  $cancel = $win.FindName('btnCancel')
  $box = @{ Result = $null }
  $ok.Add_Click({
    $name = "$($txt.Text)".Trim()
    if (-not $name) {
      $lbl.Text = 'El nombre del operador es obligatorio.'
      return
    }
    $box.Result = $name
    $win.DialogResult = $true
    $win.Close()
  }.GetNewClosure())
  $cancel.Add_Click({
    $box.Result = $null
    $win.DialogResult = $false
    $win.Close()
  }.GetNewClosure())
  try { $win.Owner = $Window } catch {}
  $null = $txt.Focus()
  [void]$win.ShowDialog()
  return $box.Result
}

function Ensure-AnalystAssigned([string]$CancelContext = 'Seleccion de grupo') {
  if ("$script:AnalistaAsignado".Trim()) { return $true }
  $analyst = Show-AnalystDialog
  if (-not "$analyst".Trim()) {
    Write-Log 'WARN' "$CancelContext cancelada: no se indico Analista asignado."
    return $false
  }
  $script:AnalistaAsignado = "$analyst".Trim()
  if ($script:lblAnalyst) { $script:lblAnalyst.Text = $script:AnalistaAsignado }
  Write-Log 'INFO' "Analista asignado: $script:AnalistaAsignado"
  return $true
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
    $gi.add_PropertyChanged({
      param($s,$e)
      if ($e.PropertyName -ne 'IsChecked' -or $script:Suspend) { return }
      if ($s.IsChecked -and -not "$script:AnalistaAsignado".Trim()) {
        if (-not (Ensure-AnalystAssigned 'Seleccion de grupo')) {
          $script:Suspend = $true
          try { $s.IsChecked = $false } finally { $script:Suspend = $false }
          Rebuild-Grid
          return
        }
      }
      Rebuild-Grid
    })
    $script:Groups.Add($gi)
  }
  $script:Suspend = $false

  Update-GroupButtonText
  Update-ButtonStates
}

#------------------------------------------------------------------------------
#  REPORTE - recoleccion, ventana y sincronizacion
#------------------------------------------------------------------------------

function Get-SnapReportText([bool]$Value) {
  if ($Value) { return 'Se confirmo la ejecucion del snapshot de este servidor' }
  return 'No se recibio la confirmacion de la ejecucion del snapshot de este servidor'
}

function Get-ConfirmadoReportText([bool]$Value) {
  if ($Value) { return 'Se recibio la confirmacion de la ventana' }
  return 'El cliente no confirmo la ejecucion de las actualizaciones de este servidor'
}

# Envia el reporte al endpoint del Centro de Control de Parcheo y actualiza el label de estado
function Sync-ToDashboard($rows, $lbl) {
  if (-not $script:WUUDashboardUploadEnabled) {
    $lbl.Text = 'Sincronizacion con Centro de Control de Parcheo suspendida (solo reporte local).'
    $lbl.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
    return
  }
  if (-not $script:WUUDashboardUploadUrl) { $lbl.Text = 'Sincronizacion deshabilitada (sin URL configurada).'; return }
  $lbl.Text = 'Sincronizando con Centro de Control de Parcheo...'
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
        Comentarios               = $_.Comentarios
        Disk_Space                = $_.Disk_Space
        Snap                      = $_.Snap
        Confirmado                = $_.Confirmado
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
    $lbl.Text = "Sincronizado con Centro de Control de Parcheo correctamente ($count servidores)."
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
        Comentarios               = $_.Comentarios
        Disk_Space                = $_.Disk_Space
        Snap                      = $_.Snap
        Confirmado                = $_.Confirmado
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
        <DataGridTextColumn Header="Disk Space"        Binding="{Binding Disk_Space}"                Width="180"/>
        <DataGridTextColumn Header="Descripcion Error" Binding="{Binding Descripcion_Error}"         Width="220"/>
        <DataGridTextColumn Header="Comentarios"       Binding="{Binding Comentarios}"               Width="240"/>
        <DataGridTextColumn Header="Snap"              Binding="{Binding Snap}"                      Width="300"/>
        <DataGridTextColumn Header="Confirmado"        Binding="{Binding Confirmado}"                Width="300"/>
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
  $bResy.Add_Click({ Sync-ToDashboard $rows $lbl }.GetNewClosure())

  # Al abrir, sincroniza con Centro de Control de Parcheo sin congelar la ventana (se pinta primero)
  $win.Add_Loaded({
    $lbl.Text = 'Preparando sincronizacion...'
    $win.Dispatcher.BeginInvoke(
      [action]{ Sync-ToDashboard $rows $lbl },
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
        Fecha_Reinicio=''; Running_Time=''; Descripcion_Error='Sin conexion o sin datos'; Disk_Space=''
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
      $gridRow = $script:Servers | Where-Object { "$($_.Servidor)".Trim() -ieq "$($o.Servidor)".Trim() } | Select-Object -First 1
      $rr.Comentarios               = if ($gridRow) { "$($gridRow.Comentarios)" } else { "$($o.Comentarios)" }
      $rr.Disk_Space                = "$($o.Disk_Space)"
      $rr.Snap                      = Get-SnapReportText $(if ($gridRow) { [bool]$gridRow.Snap } else { $false })
      $rr.Confirmado                = Get-ConfirmadoReportText $(if ($gridRow) { [bool]$gridRow.Confirmado } else { $false })
      $rows.Add($rr)
    }
    # Guarda la copia local (CSV) y abre la ventana; el Centro de Control de Parcheo se sincroniza al abrir
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
  [xml]$px = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Elegir paquetes Fix" Height="460" Width="680"
        WindowStartupLocation="CenterOwner" ShowInTaskbar="False"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="16">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Text="Paso 1 de 3 - Selecciona uno o varios paquetes" FontWeight="SemiBold" FontSize="15"/>
    <TextBlock Grid.Row="1" Margin="0,5,0,10" Foreground="#FF475569" TextWrapping="Wrap"
               Text="Los paquetes se procesaran de forma secuencial en cada servidor."/>
    <CheckBox x:Name="chkAll" Grid.Row="2" Content="Seleccionar todos" Margin="4,0,0,8"/>
    <Border Grid.Row="3" Background="White" BorderBrush="#FFCBD5E1" BorderThickness="1" CornerRadius="4">
      <ScrollViewer VerticalScrollBarVisibility="Auto">
        <ItemsControl x:Name="icPkg">
          <ItemsControl.ItemTemplate>
            <DataTemplate>
              <CheckBox IsChecked="{Binding IsChecked, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                        Content="{Binding Display}" Margin="8,5"/>
            </DataTemplate>
          </ItemsControl.ItemTemplate>
        </ItemsControl>
      </ScrollViewer>
    </Border>
    <TextBlock x:Name="lblErr" Grid.Row="4" Foreground="#FFDC2626" Margin="0,8,0,0" Text=""/>
    <DockPanel Grid.Row="5" Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnOk" Content="Continuar" Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" DockPanel.Dock="Right"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $px
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $win.Owner = $Window
  $items = New-Object System.Collections.ObjectModel.ObservableCollection[object]
  foreach ($pkg in $packages) {
    $it = New-Object FixPackagePickItem
    $it.Name = "$($pkg.Name)"
    $it.FullName = "$($pkg.FullName)"
    $size = if ($pkg.Length -ge 1GB) { '{0:N2} GB' -f ($pkg.Length / 1GB) } else { '{0:N1} MB' -f ($pkg.Length / 1MB) }
    $it.Display = "$($pkg.Name)  ($size)"
    if ($packages.Count -eq 1) { $it.IsChecked = $true }
    $items.Add($it)
  }
  $win.FindName('icPkg').ItemsSource = $items
  $chkAll = $win.FindName('chkAll')
  $chkAll.Add_Checked({
    foreach ($it in $items) { $it.IsChecked = $true }
  }.GetNewClosure())
  $chkAll.Add_Unchecked({
    foreach ($it in $items) { $it.IsChecked = $false }
  }.GetNewClosure())
  $result = @{ Value = @() }
  $lblErr = $win.FindName('lblErr')
  $win.FindName('btnOk').Add_Click({
    $selected = @($items | Where-Object { $_.IsChecked })
    if ($selected.Count -eq 0) {
      $lblErr.Text = 'Selecciona al menos un paquete.'
      return
    }
    $result.Value = $selected
    $win.DialogResult = $true
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({ $win.DialogResult = $false }.GetNewClosure())
  if ($win.ShowDialog()) { return @($result.Value) }
  return @()
}

function Show-FixServerPicker {
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Servidores Fix" Height="440" Width="420"
        WindowStartupLocation="CenterOwner" ShowInTaskbar="False"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="16">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Text="Paso 2 de 3 - Selecciona servidores destino" FontWeight="SemiBold" Margin="0,0,0,8"/>
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
  $result = @{ Value = @() }
  $win.FindName('btnOk').Add_Click({
    $selected = @($items | Where-Object { $_.IsChecked } | ForEach-Object { $_.Servidor })
    if ($selected.Count -eq 0) {
      [System.Windows.MessageBox]::Show('Selecciona al menos un servidor.','WUU','OK','Information') | Out-Null
      return
    }
    $result.Value = $selected
    $win.DialogResult = $true
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({ $win.DialogResult = $false }.GetNewClosure())
  if ($win.ShowDialog()) { return @($result.Value) }
  return @()
}

function Show-FixModePicker {
  [xml]$mx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Modo Fix" Height="285" Width="520"
        WindowStartupLocation="CenterOwner" ShowInTaskbar="False" ResizeMode="NoResize"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="18">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Text="Paso 3 de 3 - Selecciona la accion" FontWeight="SemiBold" FontSize="15"/>
    <RadioButton x:Name="rbInstall" Grid.Row="1" GroupName="FixMode" IsChecked="True"
                 Content="Copiar e instalar" FontWeight="SemiBold" Margin="4,16,0,2"/>
    <TextBlock Grid.Row="2" Margin="24,0,0,8" Foreground="#FF475569" TextWrapping="Wrap"
               Text="Si el archivo ya existe en el servidor, no se vuelve a copiar y se instala directamente."/>
    <RadioButton x:Name="rbCopy" Grid.Row="3" GroupName="FixMode"
                 Content="Solo copiar" FontWeight="SemiBold" Margin="4,8,0,2"/>
    <TextBlock Grid.Row="4" Margin="24,0,0,0" Foreground="#FF475569" TextWrapping="Wrap"
               Text="Copia los paquetes que falten y no ejecuta la instalacion."/>
    <DockPanel Grid.Row="5" Margin="0,16,0,0" LastChildFill="False">
      <Button x:Name="btnOk" Content="Continuar" Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" DockPanel.Dock="Right"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $mx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $win.Owner = $Window
  $result = @{ Value = '' }
  $rbInstall = $win.FindName('rbInstall')
  $win.FindName('btnOk').Add_Click({
    $result.Value = if ($rbInstall.IsChecked) { 'install' } else { 'copy' }
    $win.DialogResult = $true
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({ $win.DialogResult = $false }.GetNewClosure())
  if ($win.ShowDialog()) { return "$($result.Value)" }
  return ''
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

function Start-FixJob($row, [array]$packages, [ValidateSet('copy','install')][string]$mode = 'install') {
  $server = $row.Servidor
  if ($script:FixJobs.ContainsKey($server) -or $script:Jobs.ContainsKey($server)) { return }
  $packageData = @($packages | ForEach-Object {
    [pscustomobject]@{ Name="$($_.Name)"; FullName="$($_.FullName)" }
  })
  if ($packageData.Count -eq 0) { return }

  $row.State = 'DownloadInstall'
  $actionLabel = if ($mode -eq 'copy') { 'copiar' } else { 'copiar e instalar' }
  $row.Status = "Fix: preparando para $actionLabel $($packageData.Count) paquete(s)..."
  $row.Error = ''

  $sync = [hashtable]::Synchronized(@{
    done=$false
    transportError=''
    current=''
    currentIndex=0
    total=$packageData.Count
    mode=$mode
    resultJson=''
  })
  $sw = [System.Diagnostics.Stopwatch]::StartNew()

  $fjob = {
    param($server, $psexec, $fixWorker, $rel, $packageData, $mode, $sync)
    $results = @()
    try {
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      if ($mode -eq 'install') {
        Copy-Item -Path $fixWorker -Destination "$remoteDir\fix.ps1" -Force -ErrorAction Stop
      }

      for ($i = 0; $i -lt $packageData.Count; $i++) {
        $pkg = $packageData[$i]
        $pkgName = "$($pkg.Name)"
        $pkgRemote = Join-Path $remoteDir $pkgName
        $sync.current = $pkgName
        $sync.currentIndex = $i + 1
        $entry = [ordered]@{
          package=$pkgName
          exitCode=-1
          message=''
          rebootRequired=$false
          alreadyExists=$false
          copied=$false
          mode=$mode
        }
        try {
          $entry.alreadyExists = Test-Path -LiteralPath $pkgRemote -PathType Leaf
          if (-not $entry.alreadyExists) {
            if (-not (Test-Path -LiteralPath "$($pkg.FullName)" -PathType Leaf)) {
              throw "Paquete local no encontrado: $($pkg.FullName)"
            }
            Copy-Item -LiteralPath "$($pkg.FullName)" -Destination $pkgRemote -ErrorAction Stop
            $entry.copied = $true
          }

          if ($mode -eq 'copy') {
            $entry.exitCode = 0
            $entry.message = if ($entry.alreadyExists) {
              'El archivo ya existe en el servidor; no se volvio a copiar'
            } else {
              'Archivo copiado al servidor'
            }
          } else {
            Remove-Item "$remoteDir\fix.json" -ErrorAction SilentlyContinue
            $out = & $psexec "\\$server" -accepteula -nobanner -s `
                      powershell.exe -ExecutionPolicy Bypass -NonInteractive `
                      -File "C:\$rel\fix.ps1" -PackageName $pkgName 2>&1
            $psexecExit = $LASTEXITCODE
            if (Test-Path "$remoteDir\fix.json") {
              $raw = Get-Content "$remoteDir\fix.json" -Raw -ErrorAction Stop
              $fx = $raw | ConvertFrom-Json
              $entry.exitCode = [long]$fx.exitCode
              $entry.message = "$($fx.message)"
              if ($entry.alreadyExists) {
                $entry.message += ' (archivo existente; no se volvio a copiar)'
              }
              $entry.rebootRequired = [bool]$fx.rebootRequired
            } else {
              $tail = (($out | Select-Object -Last 3) -join ' ')
              if ($psexecExit -ne 0) { throw "PsExec codigo $psexecExit. $tail" }
              throw 'Sin respuesta del servidor (fix.json)'
            }
          }
        } catch {
          $entry.message = $_.Exception.Message
        } finally {
          if ($mode -eq 'install' -and [long]$entry.exitCode -in @(0,3010,2359302)) {
            Remove-Item -LiteralPath $pkgRemote -Force -ErrorAction SilentlyContinue
          }
        }
        $results += [pscustomobject]$entry
      }
    } catch {
      $sync.transportError = $_.Exception.Message
    } finally {
      $sync.resultJson = @($results) | ConvertTo-Json -Depth 4 -Compress
      $sync.done = $true
    }
  }

  $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState='MTA'; $rs.Open()
  $ps = [powershell]::Create(); $ps.Runspace = $rs
  $ps.AddScript($fjob.ToString()).
      AddArgument($server).AddArgument($script:PsExecPath).
      AddArgument($script:LocalFixWorker).AddArgument($script:RemoteRel).
      AddArgument($packageData).
      AddArgument($mode).
      AddArgument($sync) | Out-Null
  $handle = $ps.BeginInvoke()

  $names = @($packageData | ForEach-Object { $_.Name })
  $script:FixJobs[$server] = @{
    ps=$ps
    handle=$handle
    rs=$rs
    sw=$sw
    sync=$sync
    packages=$names
    total=$packageData.Count
    mode=$mode
  }
  Write-Log 'INFO' "Fix iniciado: $server (modo: $mode; paquetes: $($names -join ', '))"
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
      $current = "$($job.sync.current)"
      $index = [int]$job.sync.currentIndex
      $total = [int]$job.sync.total
      $verb = if ($job.mode -eq 'copy') { 'copiando' } else { 'procesando' }
      if ($current) { $row.Status = "Fix: $index/$total - $verb $current..." }
      else          { $row.Status = "Fix: preparando $total paquete(s)..." }
      continue
    }

    $results = @()
    try {
      if ($job.sync.resultJson) { $results = @(ConvertFrom-JsonRows "$($job.sync.resultJson)") }
    } catch {
      $job.sync.transportError = "Respuesta Fix invalida: $($_.Exception.Message)"
    }

    if ($results.Count -gt 0) {
      $successCodes = @(0, 3010, 2359302)
      $failed = @($results | Where-Object { [long]$_.exitCode -notin $successCodes })
      $succeeded = $results.Count - $failed.Count
      $needsReboot = $null -ne ($results | Where-Object {
        [bool]$_.rebootRequired -or [long]$_.exitCode -eq 3010
      } | Select-Object -First 1)

      foreach ($result in $results) {
        $level = if ([long]$result.exitCode -in $successCodes) { 'INFO' } else { 'ERROR' }
        Write-Log $level "Fix $server [$($result.package)]: $($result.message) (codigo $($result.exitCode))"
      }

      if ($failed.Count -eq 0) {
        $row.Error = ''
        if ($job.mode -eq 'copy') {
          $row.State = 'Updated'
          $row.Status = "Fix: $succeeded/$($results.Count) archivos disponibles (solo copia)"
        } elseif ($needsReboot) {
          $row.State = 'RebootRequired'
          $row.Status = "Fix: $succeeded/$($results.Count) correctos. Requiere reinicio"
        } else {
          $row.State = 'Updated'
          $row.Status = "Fix: $succeeded/$($results.Count) paquetes procesados correctamente"
        }
      } else {
        $row.State = if ($needsReboot) { 'RebootRequired' } else { 'Unselected' }
        $operation = if ($job.mode -eq 'copy') { 'copiados' } else { 'correctos' }
        $row.Status = "Fix: $succeeded/$($results.Count) $operation, $($failed.Count) con error"
        $row.Error = @($failed | ForEach-Object {
          "$($_.package): $($_.message)"
        }) -join ' | '
      }
    } elseif ($job.sync.transportError) {
      $row.State = 'Unselected'
      $row.Status = 'Error Fix'
      $row.Error = $job.sync.transportError
      Write-Log 'ERROR' "Fix $server : $($job.sync.transportError)"
    } else {
      $row.State = 'Unselected'
      $row.Status = 'Error Fix'
      $row.Error = 'El proceso Fix no devolvio resultados'
      Write-Log 'ERROR' "Fix $server : sin resultados"
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
  $selectedPackages = @(Show-FixPackagePicker $packages)
  if ($selectedPackages.Count -eq 0) { return }
  $targets = @(Show-FixServerPicker)
  if ($targets.Count -eq 0) { return }
  $mode = Show-FixModePicker
  if (-not $mode) { return }
  if ($mode -eq 'install' -and -not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show(
      "No se encuentra PsExec.exe en:`n$script:PsExecPath",
      'WUU', 'OK', 'Error') | Out-Null
    return
  }
  $packageNames = @($selectedPackages | ForEach-Object { $_.Name })
  $action = if ($mode -eq 'copy') { 'Solo copiar' } else { 'Copiar e instalar' }
  $resp = [System.Windows.MessageBox]::Show(
    "Accion: $action`nPaquetes: $($selectedPackages.Count)`nServidores: $($targets.Count)`n`n" +
    "Paquetes:`n- $($packageNames -join "`n- ")`n`nServidores:`n- $($targets -join "`n- ")",
    'WUU - Confirmar Fix', 'YesNo', 'Warning')
  if ($resp -ne 'Yes') { return }

  Write-Log 'INFO' "Fix ($mode): $($packageNames -join ', ') en $($targets.Count) servidor(es)"
  $started = 0
  foreach ($name in $targets) {
    $row = Get-Row $name
    if ($row) {
      Start-FixJob $row $selectedPackages $mode
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
function ConvertFrom-JsonRows($raw) {
  if (-not $raw) { return @() }
  $trim = "$raw".Trim()
  if (-not $trim -or $trim -eq '[]') { return @() }
  try { $parsed = $raw | ConvertFrom-Json } catch { return @() }
  if ($null -eq $parsed) { return @() }
  if ($parsed -is [System.Array]) { return @($parsed) }
  $arrayProp = $parsed.PSObject.Properties | Where-Object {
    $_.Value -is [System.Array] -or ($_.Value -is [System.Collections.IEnumerable] -and -not ($_.Value -is [string]))
  } | Select-Object -First 1
  if ($arrayProp) {
    $n = @($arrayProp.Value).Count
    if ($n -gt 1) {
      $rows = @()
      for ($i = 0; $i -lt $n; $i++) {
        $row = [ordered]@{}
        foreach ($p in $parsed.PSObject.Properties) {
          if ($p.Value -is [System.Array] -or ($p.Value -is [System.Collections.IEnumerable] -and -not ($p.Value -is [string]))) {
            $arr = @($p.Value)
            $row[$p.Name] = if ($i -lt $arr.Count) { $arr[$i] } else { '' }
          } else { $row[$p.Name] = $p.Value }
        }
        $rows += [pscustomobject]$row
      }
      return $rows
    }
  }
  return @($parsed)
}

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
      foreach ($o in (ConvertFrom-JsonRows $raw)) {
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
      foreach ($o in (ConvertFrom-JsonRows $raw)) {
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

function Get-DiskSpaceStatus([double]$freeGB) {
  if ($freeGB -lt 2)  { return 'Critico' }
  if ($freeGB -lt 10) { return 'Bajo' }
  return 'OK'
}

# Muestra el espacio en disco del servidor
function Show-DiskSpace($server) {
  Write-Log 'INFO' "Espacio en disco solicitado: $server"
  Start-RemoteQuery $server $script:LocalDiskWorker 'disk.ps1' 'disk.json' {
    param($raw, $err)
    if ($err) { Write-Log 'WARN' "Espacio en disco ${server}: $err" }
    $rows = New-Object System.Collections.ObjectModel.ObservableCollection[object]
    if ($raw) {
      foreach ($o in (ConvertFrom-JsonRows $raw)) {
        $free = [double]$o.LibreGB
        $dr = New-Object DiskSpaceRow
        $dr.Unidad    = "$($o.Unidad)"
        $dr.Etiqueta  = "$($o.Etiqueta)"
        $dr.TotalGB   = "{0:N1}" -f [double]$o.TotalGB
        $dr.LibreGB   = "{0:N1}" -f $free
        $dr.UsadoGB   = "{0:N1}" -f [double]$o.UsadoGB
        $dr.PorcLibre = "{0:N1}%" -f [double]$o.PorcLibre
        $dr.Estado    = Get-DiskSpaceStatus $free
        $rows.Add($dr)
      }
    }
    if ($rows.Count -eq 0) {
      [System.Windows.MessageBox]::Show("No se pudo obtener espacio en disco para '$server'." + $(if($err){"`n$err"}else{""}),"WUU",'OK','Information') | Out-Null
      return
    }
    $cDrive = $rows | Where-Object { $_.Unidad -eq 'C:' } | Select-Object -First 1
    if ($cDrive) {
      $row = $script:Servers | Where-Object { $_.Servidor -eq $server } | Select-Object -First 1
      if ($row) { $row.Status = "Disco C: $($cDrive.LibreGB) GB libres ($($cDrive.Estado))" }
    }
    Show-GridWindow "Espacio en disco - $server" $rows
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

  Write-Log 'INFO' "Sesion iniciada. Analista: $script:AnalistaAsignado | Grupos: $grupoStr | Servidores: $total | Hora: $horaInicio"
}

#==============================================================================
#  HISTORIAL ACUMULADO (CSV + JSON)
#==============================================================================

function Save-History([array]$Rows, [string]$Type = 'Parcheo') {
  if (-not $script:Cfg.History.Enabled -or $Rows.Count -eq 0) { return }
  $historyLock = $null
  $historyLockTaken = $false
  try {
    $historyLock = [System.Threading.Mutex]::new($false, 'Global\WUU_SaveHistory')
    try { $historyLockTaken = $historyLock.WaitOne(30000) }
    catch [System.Threading.AbandonedMutexException] { $historyLockTaken = $true }
    if (-not $historyLockTaken) { throw 'No se pudo obtener el bloqueo del historial en 30 segundos.' }
    $histDir    = Join-Path $script:ScriptDir 'Historial'
    $detailDir  = Join-Path $histDir 'Detail'
    foreach ($d in @($histDir,$detailDir)) {
      if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
    }
    $now    = Get-Date
    $ts     = $now.ToString('yyyy-MM-dd_HH-mm-ss-fff')
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
        Where-Object { $_.BaseName.Length -ge 10 -and $_.BaseName.Substring(0,10) -lt $cutoff } |
        Remove-Item -Force -ErrorAction SilentlyContinue
    }
    Write-Log 'INFO' "Historial guardado: $ts ($($Rows.Count) servidores, tipo=$Type)"
  } catch {
    Write-Log 'ERROR' "Historial: $($_.Exception.Message)"
  } finally {
    if ($historyLockTaken -and $historyLock) { try { $historyLock.ReleaseMutex() } catch {} }
    if ($historyLock) { try { $historyLock.Dispose() } catch {} }
  }
}

#==============================================================================
#  TAREA PROGRAMADA (Windows Task Scheduler)
#==============================================================================

function Get-TaskStatus([string]$TaskName = '') {
  if (-not $TaskName) { $TaskName = "$($script:Cfg.ScheduledReport.TaskName)" }
  try {
    $t = Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop
    return $t.State
  } catch { return 'NoExiste' }
}

function Parse-ScheduledDateDMY([string]$Text, [int]$Hour, [int]$Minute) {
  $text = "$Text".Trim()
  if (-not $text) {
    $today = Get-Date
    return Get-Date -Year $today.Year -Month $today.Month -Day $today.Day -Hour $Hour -Minute $Minute -Second 0
  }
  if ($text -notmatch '^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$') {
    throw 'Fecha invalida. Usa formato dd/mm/aaaa.'
  }
  $day = [int]$matches[1]; $month = [int]$matches[2]; $year = [int]$matches[3]
  try {
    return Get-Date -Year $year -Month $month -Day $day -Hour $Hour -Minute $Minute -Second 0
  } catch {
    throw 'Fecha invalida. Verifica dia, mes y anio.'
  }
}

function Format-ScheduledDateDMY([datetime]$Date) {
  return $Date.ToString('dd/MM/yyyy')
}

function Get-ScheduledUpdateDir([string]$BaseDir = '') {
  if (-not $BaseDir) { $BaseDir = $script:ScriptDir }
  $dir = Join-Path $BaseDir 'Programaciones'
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  return $dir
}

function Save-ScheduledUpdateDefinition($Definition, [string]$Path) {
  $tmp = "$Path.tmp"
  try {
    $Definition | ConvertTo-Json -Depth 8 -ErrorAction Stop |
      Set-Content -Path $tmp -Encoding UTF8 -ErrorAction Stop
    Move-Item -Path $tmp -Destination $Path -Force -ErrorAction Stop
  } catch {
    Remove-Item -Path $tmp -Force -ErrorAction SilentlyContinue
    throw
  }
}

function Get-ScheduledUpdateRows([string]$BaseDir = '') {
  $rows = @()
  if (-not $BaseDir) { $BaseDir = $script:ScriptDir }
  $dir = Join-Path $BaseDir 'Programaciones'
  if (-not (Test-Path $dir)) { return @() }
  foreach ($file in @(Get-ChildItem -Path $dir -Filter '*.json' -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending)) {
    try {
      $job = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json
      if (-not $job.TaskName -or "$($job.Kind)" -ne 'ScheduledPatch') { continue }
      $taskState = 'NoExiste'
      $lastResult = ''
      try {
        $task = Get-ScheduledTask -TaskName "$($job.TaskName)" -ErrorAction Stop
        $taskState = "$($task.State)"
        try {
          $info = Get-ScheduledTaskInfo -TaskName "$($job.TaskName)" -ErrorAction Stop
          if ($info.LastRunTime -and $info.LastRunTime.Year -gt 1900) {
            $lastResult = "Ultima: $($info.LastRunTime.ToString('dd/MM/yyyy HH:mm')) / codigo $($info.LastTaskResult)"
          }
        } catch {}
      } catch {}
      $scheduledDisplay = "$($job.ScheduledAt)"
      try { $scheduledDisplay = ([datetime]$job.ScheduledAt).ToString('dd/MM/yyyy HH:mm') } catch {}
      $rows += [pscustomobject][ordered]@{
        Tarea   = "$($job.TaskName)"
        Destino = if ("$($job.TargetType)" -eq 'Group') { "Grupo: $($job.TargetValue)" } else { "Servidor: $($job.TargetValue)" }
        Fecha   = $scheduledDisplay
        Estado  = if ($job.Status) { "$($job.Status) / $taskState" } else { $taskState }
        Detalle = $lastResult
        JobFile = $file.FullName
      }
    } catch {
      try { Write-Log 'WARN' "Programacion invalida '$($file.FullName)': $($_.Exception.Message)" } catch {}
    }
  }
  return @($rows)
}

function Show-SchedulerWindow {
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Programar" Height="700" Width="780" MinHeight="620" MinWidth="700"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="16">
    <Grid.RowDefinitions><RowDefinition Height="*"/><RowDefinition Height="Auto"/></Grid.RowDefinitions>
    <TabControl Grid.Row="0">
      <TabItem Header="Reporte automatico">
        <StackPanel Margin="18">
          <TextBlock Text="Configuracion del reporte automatico diario" FontSize="15" FontWeight="SemiBold" Margin="0,0,0,16"/>
          <Grid Margin="0,0,0,10">
            <Grid.ColumnDefinitions><ColumnDefinition Width="160"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
            <Grid.RowDefinitions>
              <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
              <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
              <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
            </Grid.RowDefinitions>
            <TextBlock Grid.Row="0" Grid.Column="0" Text="Estado actual:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBlock x:Name="lblState" Grid.Row="0" Grid.Column="1" Text="-" VerticalAlignment="Center" FontWeight="SemiBold" Margin="0,6"/>
            <TextBlock Grid.Row="1" Grid.Column="0" Text="Nombre de tarea:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtName" Grid.Row="1" Grid.Column="1" Padding="4,3" Margin="0,4"/>
            <TextBlock Grid.Row="2" Grid.Column="0" Text="Hora de ejecucion:" VerticalAlignment="Center" Margin="0,6"/>
            <StackPanel Grid.Row="2" Grid.Column="1" Orientation="Horizontal">
              <TextBox x:Name="txtHour" Width="50" Padding="4,3" Margin="0,4,6,4" TextAlignment="Center"/>
              <TextBlock Text=":" VerticalAlignment="Center" Margin="0,0,6,0"/>
              <TextBox x:Name="txtMin" Width="50" Padding="4,3" Margin="0,4" TextAlignment="Center"/>
            </StackPanel>
            <TextBlock Grid.Row="3" Grid.Column="0" Text="Fecha de inicio:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtDate" Grid.Row="3" Grid.Column="1" Padding="4,3" Margin="0,4" ToolTip="Formato: dd/mm/aaaa"/>
            <TextBlock Grid.Row="4" Grid.Column="0" Text="Periodo del reporte:" VerticalAlignment="Center" Margin="0,6"/>
            <ComboBox x:Name="cmbReportPeriod" Grid.Row="4" Grid.Column="1" Padding="4,3" Margin="0,4">
              <ComboBoxItem Content="Mes en curso" Tag="CurrentMonth"/>
              <ComboBoxItem Content="Mes anterior" Tag="PreviousMonth"/>
              <ComboBoxItem Content="Fecha especifica" Tag="SpecificDate"/>
            </ComboBox>
            <TextBlock Grid.Row="5" Grid.Column="0" Text="Fecha a consultar:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtReportSpecificDate" Grid.Row="5" Grid.Column="1" Padding="4,3" Margin="0,4" ToolTip="Formato: dd/mm/aaaa"/>
            <TextBlock Grid.Row="6" Grid.Column="0" Text="Script WUU.ps1:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBlock x:Name="lblScript" Grid.Row="6" Grid.Column="1" Text="-" VerticalAlignment="Center" Margin="0,6" TextTrimming="CharacterEllipsis"/>
            <TextBlock Grid.Row="7" Grid.Column="0" Text="Cobertura:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBlock Grid.Row="7" Grid.Column="1" Text="Todos los grupos del CSV" VerticalAlignment="Center" Margin="0,6" Foreground="#FF475569"/>
          </Grid>
          <StackPanel Orientation="Horizontal" Margin="0,12,0,0">
            <Button x:Name="btnCreate" Content="Crear / Actualizar tarea" Padding="14,7" Margin="0,0,8,0"/>
            <Button x:Name="btnDelete" Content="Eliminar tarea" Padding="14,7"/>
          </StackPanel>
          <TextBlock x:Name="lblMsg" Text="" Margin="0,12,0,0" TextWrapping="Wrap"/>
        </StackPanel>
      </TabItem>
      <TabItem Header="Ventana de actualizacion">
        <Grid Margin="18">
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
          </Grid.RowDefinitions>
          <TextBlock Grid.Row="0" Text="Programar parcheo normal (una unica ejecucion)" FontSize="15" FontWeight="SemiBold" Margin="0,0,0,12"/>
          <StackPanel Grid.Row="1" Orientation="Horizontal" Margin="0,0,0,8">
            <RadioButton x:Name="rbUpdateGroup" Content="Grupo completo" IsChecked="True" GroupName="TargetMode" Margin="0,0,22,0"/>
            <RadioButton x:Name="rbUpdateServer" Content="Servidor individual" GroupName="TargetMode"/>
          </StackPanel>
          <Grid Grid.Row="2">
            <Grid.ColumnDefinitions><ColumnDefinition Width="150"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
            <Grid.RowDefinitions><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/></Grid.RowDefinitions>
            <TextBlock Grid.Row="0" Grid.Column="0" Text="Grupo:" VerticalAlignment="Center" Margin="0,6"/>
            <ComboBox x:Name="cmbUpdateGroup" Grid.Row="0" Grid.Column="1" Padding="4,3" Margin="0,4"/>
            <TextBlock Grid.Row="1" Grid.Column="0" Text="Buscar servidor:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtUpdateServer" Grid.Row="1" Grid.Column="1" Padding="4,3" Margin="0,4" IsEnabled="False"/>
            <TextBlock Grid.Row="2" Grid.Column="0" Text="Coincidencias:" VerticalAlignment="Top" Margin="0,8"/>
            <ListBox x:Name="lstUpdateMatches" Grid.Row="2" Grid.Column="1" Height="82" Margin="0,4" IsEnabled="False" DisplayMemberPath="Display"/>
            <TextBlock Grid.Row="3" Grid.Column="0" Text="Fecha y hora:" VerticalAlignment="Center" Margin="0,6"/>
            <StackPanel Grid.Row="3" Grid.Column="1" Orientation="Horizontal">
              <TextBox x:Name="txtUpdateDate" Width="120" Padding="4,3" Margin="0,4,8,4" ToolTip="dd/mm/aaaa"/>
              <TextBox x:Name="txtUpdateHour" Width="45" Padding="4,3" Margin="0,4,5,4" TextAlignment="Center"/>
              <TextBlock Text=":" VerticalAlignment="Center" Margin="0,0,5,0"/>
              <TextBox x:Name="txtUpdateMin" Width="45" Padding="4,3" Margin="0,4" TextAlignment="Center"/>
            </StackPanel>
          </Grid>
          <TextBlock x:Name="lblUpdateTarget" Grid.Row="3" Text="" Margin="0,8,0,0" TextWrapping="Wrap"/>
          <StackPanel Grid.Row="4" Orientation="Horizontal" Margin="0,10,0,10">
            <Button x:Name="btnScheduleUpdate" Content="Programar actualizacion unica" Padding="14,7" Margin="0,0,8,0"/>
            <Button x:Name="btnRefreshUpdates" Content="Refrescar lista" Padding="14,7" Margin="0,0,8,0"/>
            <Button x:Name="btnDeleteUpdate" Content="Eliminar seleccionada" Padding="14,7"/>
          </StackPanel>
          <DataGrid x:Name="dgScheduledUpdates" Grid.Row="5" AutoGenerateColumns="False" IsReadOnly="True" SelectionMode="Single" CanUserAddRows="False">
            <DataGrid.Columns>
              <DataGridTextColumn Header="Destino" Binding="{Binding Destino}" Width="*"/>
              <DataGridTextColumn Header="Fecha" Binding="{Binding Fecha}" Width="130"/>
              <DataGridTextColumn Header="Estado" Binding="{Binding Estado}" Width="150"/>
              <DataGridTextColumn Header="Detalle" Binding="{Binding Detalle}" Width="210"/>
            </DataGrid.Columns>
          </DataGrid>
          <TextBlock x:Name="lblUpdateMsg" Grid.Row="6" Text="" Margin="0,10,0,0" TextWrapping="Wrap"/>
        </Grid>
      </TabItem>
    </TabControl>
    <Button x:Name="btnClose2" Grid.Row="1" Content="Cerrar" Padding="16,7" HorizontalAlignment="Right" Margin="0,12,0,0"/>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $sx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $txtName  = $win.FindName('txtName');  $txtName.Text  = "$($script:Cfg.ScheduledReport.TaskName)"
  $txtHour  = $win.FindName('txtHour'); $txtHour.Text  = "$($script:Cfg.ScheduledReport.Hour)"
  $txtMin   = $win.FindName('txtMin');  $txtMin.Text   = "{0:00}" -f [int]$script:Cfg.ScheduledReport.Minute
  $txtDate  = $win.FindName('txtDate')
  $savedDate = "$($script:Cfg.ScheduledReport.StartDate)".Trim()
  $txtDate.Text = if ($savedDate) { $savedDate } else { (Get-Date).ToString('dd/MM/yyyy') }
  $cmbReportPeriod = $win.FindName('cmbReportPeriod')
  $txtReportSpecificDate = $win.FindName('txtReportSpecificDate')
  $savedPeriodMode = "$($script:Cfg.ScheduledReport.PeriodMode)"
  foreach ($item in $cmbReportPeriod.Items) {
    if ("$($item.Tag)" -eq $savedPeriodMode) { $cmbReportPeriod.SelectedItem = $item; break }
  }
  if (-not $cmbReportPeriod.SelectedItem) { $cmbReportPeriod.SelectedIndex = 0 }
  $savedSpecificDate = "$($script:Cfg.ScheduledReport.SpecificDate)".Trim()
  $txtReportSpecificDate.Text = if ($savedSpecificDate) { $savedSpecificDate } else { (Get-Date).ToString('dd/MM/yyyy') }
  $lblScript= $win.FindName('lblScript'); $lblScript.Text = $PSCommandPath; $lblScript.ToolTip = $PSCommandPath
  $lblState = $win.FindName('lblState')
  $lblMsg   = $win.FindName('lblMsg')
  $rbUpdateGroup = $win.FindName('rbUpdateGroup')
  $rbUpdateServer = $win.FindName('rbUpdateServer')
  $cmbUpdateGroup = $win.FindName('cmbUpdateGroup')
  $txtUpdateServer = $win.FindName('txtUpdateServer')
  $lstUpdateMatches = $win.FindName('lstUpdateMatches')
  $txtUpdateDate = $win.FindName('txtUpdateDate')
  $txtUpdateHour = $win.FindName('txtUpdateHour')
  $txtUpdateMin = $win.FindName('txtUpdateMin')
  $lblUpdateTarget = $win.FindName('lblUpdateTarget')
  $lblUpdateMsg = $win.FindName('lblUpdateMsg')
  $dgScheduledUpdates = $win.FindName('dgScheduledUpdates')
  $cfgRef = $script:Cfg
  $csvRef = @($script:Csv)
  $configPath = Join-Path $script:ScriptDir 'config.json'
  $mainScriptPath = $PSCommandPath
  $fnGetTaskStatus = ${function:Get-TaskStatus}
  $fnParseDate     = ${function:Parse-ScheduledDateDMY}
  $fnFormatDate    = ${function:Format-ScheduledDateDMY}
  $fnSaveDef       = ${function:Save-ScheduledUpdateDefinition}
  $fnGetRows       = ${function:Get-ScheduledUpdateRows}
  $fnGetDir        = ${function:Get-ScheduledUpdateDir}
  $fnWriteLog      = ${function:Write-Log}
  $scriptDirRef    = $script:ScriptDir

  $groupNames = @($csvRef | ForEach-Object { "$($_.Grupo)".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
  $cmbUpdateGroup.ItemsSource = $groupNames
  if ($groupNames.Count -gt 0) { $cmbUpdateGroup.SelectedIndex = 0 }
  $txtUpdateDate.Text = (Get-Date).ToString('dd/MM/yyyy')
  $txtUpdateHour.Text = (Get-Date).AddHours(1).ToString('HH')
  $txtUpdateMin.Text = '00'

  $refreshStateAction = {
    $st = & $fnGetTaskStatus "$($cfgRef.ScheduledReport.TaskName)"
    $lblState.Text = $st
    $lblState.Foreground = if ($st -eq 'NoExiste') { [System.Windows.Media.Brushes]::Gray }
                           elseif ($st -eq 'Ready') { [System.Windows.Media.Brushes]::Green }
                           else { [System.Windows.Media.Brushes]::DarkOrange }
  }.GetNewClosure()
  & $refreshStateAction

  $refreshReportPeriodAction = {
    $mode = if ($cmbReportPeriod.SelectedItem) { "$($cmbReportPeriod.SelectedItem.Tag)" } else { 'CurrentMonth' }
    $txtReportSpecificDate.IsEnabled = ($mode -eq 'SpecificDate')
  }.GetNewClosure()
  $cmbReportPeriod.Add_SelectionChanged({ & $refreshReportPeriodAction }.GetNewClosure())
  & $refreshReportPeriodAction

  $refreshUpdateListAction = {
    $dgScheduledUpdates.ItemsSource = @(& $fnGetRows $scriptDirRef)
  }.GetNewClosure()
  & $refreshUpdateListAction

  $refreshUpdateTargetAction = {
    if ($rbUpdateGroup.IsChecked) {
      $cmbUpdateGroup.IsEnabled = $true
      $txtUpdateServer.IsEnabled = $false
      $lstUpdateMatches.IsEnabled = $false
      $group = "$($cmbUpdateGroup.SelectedItem)".Trim()
      $count = @($csvRef | Where-Object { "$($_.Grupo)".Trim() -ieq $group } |
                 ForEach-Object { "$($_.Servidor)".Trim() } | Where-Object { $_ } | Sort-Object -Unique).Count
      $lblUpdateTarget.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
      $lblUpdateTarget.Text = if ($group) { "Destino: grupo '$group' ($count servidor(es))." } else { 'Selecciona un grupo.' }
    } else {
      $cmbUpdateGroup.IsEnabled = $false
      $txtUpdateServer.IsEnabled = $true
      $lstUpdateMatches.IsEnabled = $true
      $server = $txtUpdateServer.Text.Trim()
      $exact = @($csvRef | Where-Object { "$($_.Servidor)".Trim() -ieq $server } | Select-Object -First 1)
      if ($exact.Count -gt 0) {
        $lblUpdateTarget.Foreground = [System.Windows.Media.Brushes]::Green
        $lblUpdateTarget.Text = "Servidor '$server' encontrado en el inventario. Grupo: $($exact[0].Grupo)."
      } elseif ($server) {
        $lblUpdateTarget.Foreground = [System.Windows.Media.Brushes]::DarkOrange
        $lblUpdateTarget.Text = "Servidor '$server' no existe en el inventario. Se podra programar con confirmacion."
      } else {
        $lblUpdateTarget.Foreground = [System.Windows.Media.Brushes]::Gray
        $lblUpdateTarget.Text = 'Escribe un nombre para buscarlo en el inventario.'
      }
    }
  }.GetNewClosure()

  $rbUpdateGroup.Add_Checked({ & $refreshUpdateTargetAction }.GetNewClosure())
  $rbUpdateServer.Add_Checked({ & $refreshUpdateTargetAction }.GetNewClosure())
  $cmbUpdateGroup.Add_SelectionChanged({ & $refreshUpdateTargetAction }.GetNewClosure())
  $txtUpdateServer.Add_TextChanged({
    $term = $txtUpdateServer.Text.Trim()
    if ($term) {
      $matches = @($csvRef | Where-Object { "$($_.Servidor)" -like "*$term*" } |
        Sort-Object Servidor -Unique | Select-Object -First 25 | ForEach-Object {
          [SearchResultItem]@{
            Display = "$($_.Servidor)".Trim()
            Sub = "IP: $($_.IP) | Grupo: $($_.Grupo) | Ambiente: $($_.Ambiente)"
            Tag = $_
          }
        })
      $lstUpdateMatches.ItemsSource = $matches
    } else { $lstUpdateMatches.ItemsSource = @() }
    & $refreshUpdateTargetAction
  }.GetNewClosure())
  $lstUpdateMatches.Add_SelectionChanged({
    if ($lstUpdateMatches.SelectedItem) {
      $txtUpdateServer.Text = "$($lstUpdateMatches.SelectedItem.Display)"
      $txtUpdateServer.CaretIndex = $txtUpdateServer.Text.Length
    }
  }.GetNewClosure())

  $win.FindName('btnCreate').Add_Click({
    try {
      $name = $txtName.Text.Trim()
      $h = 0; $m = 0
      if (-not $name) { throw 'Ingresa un nombre para la tarea.' }
      if (-not [int]::TryParse($txtHour.Text.Trim(), [ref]$h) -or
          -not [int]::TryParse($txtMin.Text.Trim(), [ref]$m) -or
          $h -lt 0 -or $h -gt 23 -or $m -lt 0 -or $m -gt 59) {
        throw 'Hora invalida (HH 0-23, MM 0-59).'
      }
      $dateText = $txtDate.Text.Trim()
      $startAt = & $fnParseDate $dateText $h $m
      if ($startAt -lt (Get-Date).Date) { throw 'La fecha de inicio no puede ser anterior a hoy.' }
      $periodMode = if ($cmbReportPeriod.SelectedItem) { "$($cmbReportPeriod.SelectedItem.Tag)" } else { 'CurrentMonth' }
      $specificDate = ''
      if ($periodMode -eq 'SpecificDate') {
        $specificDateText = $txtReportSpecificDate.Text.Trim()
        if (-not $specificDateText) { throw 'Ingresa la fecha especifica del reporte.' }
        $parsedSpecificDate = & $fnParseDate $specificDateText 0 0
        $specificDate = & $fnFormatDate $parsedSpecificDate
      }
      $trigger = New-ScheduledTaskTrigger -Daily -At $startAt
      $action  = New-ScheduledTaskAction -Execute 'powershell.exe' `
                   -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$mainScriptPath`" -Scheduled"
      $set     = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 2) -StartWhenAvailable
      Register-ScheduledTask -TaskName $name -Trigger $trigger -Action $action `
        -Settings $set -RunLevel Highest -Force | Out-Null
      # Guardar en config.json
      $cfgRef.ScheduledReport.TaskName  = $name
      $cfgRef.ScheduledReport.Hour       = $h
      $cfgRef.ScheduledReport.Minute     = $m
      $cfgRef.ScheduledReport.StartDate  = & $fnFormatDate $startAt
      $cfgRef.ScheduledReport.PeriodMode = $periodMode
      $cfgRef.ScheduledReport.SpecificDate = $specificDate
      $cfgRef.ScheduledReport.Enabled    = $true
      & $fnSaveDef $cfgRef $configPath
      $lblMsg.Foreground=[System.Windows.Media.Brushes]::Green
      $dateLabel = & $fnFormatDate $startAt
      $periodLabel = switch ($periodMode) {
        'PreviousMonth' { 'mes anterior' }
        'SpecificDate'  { "fecha $specificDate" }
        default         { 'mes en curso' }
      }
      $lblMsg.Text = "Tarea '$name' creada/actualizada. Primera ejecucion: $dateLabel a ${h}:$("{0:00}" -f $m). Luego diariamente. Periodo: $periodLabel."
      & $fnWriteLog 'INFO' "Tarea programada creada: $name @ $dateLabel ${h}:$("{0:00}" -f $m) | periodo=$periodMode $specificDate"
      & $refreshStateAction
    } catch { $lblMsg.Foreground=[System.Windows.Media.Brushes]::Red; $lblMsg.Text="Error: $($_.Exception.Message)" }
  }.GetNewClosure())

  $win.FindName('btnDelete').Add_Click({
    $name = $txtName.Text.Trim()
    try {
      Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction Stop
      $cfgRef.ScheduledReport.Enabled = $false
      & $fnSaveDef $cfgRef $configPath
      $lblMsg.Foreground=[System.Windows.Media.Brushes]::DarkOrange
      $lblMsg.Text = "Tarea '$name' eliminada."
      & $fnWriteLog 'INFO' "Tarea programada eliminada: $name"
      & $refreshStateAction
    } catch { $lblMsg.Foreground=[System.Windows.Media.Brushes]::Red; $lblMsg.Text="Error: $($_.Exception.Message)" }
  }.GetNewClosure())

  $win.FindName('btnScheduleUpdate').Add_Click({
    $lblUpdateMsg.Text = ''
    try {
      $h = 0; $m = 0
      if (-not [int]::TryParse($txtUpdateHour.Text.Trim(), [ref]$h) -or
          -not [int]::TryParse($txtUpdateMin.Text.Trim(), [ref]$m) -or
          $h -lt 0 -or $h -gt 23 -or $m -lt 0 -or $m -gt 59) {
        throw 'Hora invalida (HH 0-23, MM 0-59).'
      }
      $startAt = & $fnParseDate $txtUpdateDate.Text.Trim() $h $m
      if ($startAt -le (Get-Date)) { throw 'La fecha y hora de ejecucion deben ser futuras.' }

      $targetType = if ($rbUpdateGroup.IsChecked) { 'Group' } else { 'Server' }
      $targetValue = if ($targetType -eq 'Group') { "$($cmbUpdateGroup.SelectedItem)".Trim() } else { $txtUpdateServer.Text.Trim() }
      if (-not $targetValue) { throw 'Selecciona un grupo o ingresa un servidor.' }

      $inInventory = $true
      if ($targetType -eq 'Group') {
        $servers = @($csvRef | Where-Object { "$($_.Grupo)".Trim() -ieq $targetValue } |
          ForEach-Object { "$($_.Servidor)".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
        if ($servers.Count -eq 0) { throw "El grupo '$targetValue' no contiene servidores validos." }
      } else {
        $found = @($csvRef | Where-Object { "$($_.Servidor)".Trim() -ieq $targetValue } | Select-Object -First 1)
        $inInventory = ($found.Count -gt 0)
        $servers = @($targetValue)
        if (-not $inInventory) {
          $confirm = [System.Windows.MessageBox]::Show(
            "El servidor '$targetValue' no existe en el inventario.`n`n¿Deseas programar igualmente la actualizacion unica usando ese nombre?",
            'WUU - Servidor fuera del inventario', 'YesNo', 'Warning')
          if ($confirm -ne 'Yes') { return }
        }
      }

      $safeTarget = ($targetValue -replace '[^A-Za-z0-9_-]', '_').Trim('_')
      if (-not $safeTarget) { $safeTarget = 'Destino' }
      if ($safeTarget.Length -gt 28) { $safeTarget = $safeTarget.Substring(0,28) }
      $jobId = "{0}_{1}" -f (Get-Date -Format 'yyyyMMddHHmmss'), ([guid]::NewGuid().ToString('N').Substring(0,6))
      $taskName = "WUU_Actualizacion_${safeTarget}_$jobId"
      $jobPath = Join-Path (& $fnGetDir $scriptDirRef) "$jobId.json"
      $job = [ordered]@{
        Kind='ScheduledPatch'; Version=1; JobId=$jobId; TaskName=$taskName
        TargetType=$targetType; TargetValue=$targetValue; InInventory=[bool]$inInventory
        Servers=@($servers); ScheduledAt=$startAt.ToString('o'); CreatedAt=(Get-Date).ToString('o')
        Status='Pendiente'; LastMessage=''; StartedAt=$null; CompletedAt=$null; Results=@()
      }
      & $fnSaveDef $job $jobPath

      try {
        $trigger = New-ScheduledTaskTrigger -Once -At $startAt
        $actionArgs = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$mainScriptPath`" -ScheduledPatch -JobFile `"$jobPath`""
        $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $actionArgs
        $settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 8) `
          -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
        Register-ScheduledTask -TaskName $taskName -Trigger $trigger -Action $action `
          -Settings $settings -RunLevel Highest -Force | Out-Null
      } catch {
        Remove-Item -Path $jobPath -Force -ErrorAction SilentlyContinue
        throw
      }

      $lblUpdateMsg.Foreground = [System.Windows.Media.Brushes]::Green
      $origin = if ($inInventory) { 'inventario validado' } else { 'fuera del inventario, confirmado' }
      $lblUpdateMsg.Text = "Tarea unica '$taskName' creada para $($startAt.ToString('dd/MM/yyyy HH:mm')). Destino: $targetValue ($origin)."
      & $fnWriteLog 'INFO' "Actualizacion programada: $taskName | $targetType=$targetValue | servidores=$($servers.Count) | $($startAt.ToString('s'))"
      & $refreshUpdateListAction
    } catch {
      $lblUpdateMsg.Foreground = [System.Windows.Media.Brushes]::Red
      $lblUpdateMsg.Text = "Error: $($_.Exception.Message)"
    }
  }.GetNewClosure())

  $win.FindName('btnRefreshUpdates').Add_Click({ & $refreshUpdateListAction }.GetNewClosure())
  $win.FindName('btnDeleteUpdate').Add_Click({
    $selected = $dgScheduledUpdates.SelectedItem
    if (-not $selected) {
      $lblUpdateMsg.Foreground = [System.Windows.Media.Brushes]::DarkOrange
      $lblUpdateMsg.Text = 'Selecciona una programacion para eliminar.'
      return
    }
    try {
      $existingTask = Get-ScheduledTask -TaskName "$($selected.Tarea)" -ErrorAction SilentlyContinue
      if ($existingTask -and "$($existingTask.State)" -eq 'Running') {
        throw 'No se puede eliminar una programacion mientras esta ejecutando.'
      }
      if ($existingTask) {
        Unregister-ScheduledTask -TaskName "$($selected.Tarea)" -Confirm:$false -ErrorAction Stop
      }
      if ($selected.JobFile -and (Test-Path "$($selected.JobFile)")) {
        Remove-Item -Path "$($selected.JobFile)" -Force -ErrorAction Stop
      }
      $lblUpdateMsg.Foreground = [System.Windows.Media.Brushes]::DarkOrange
      $lblUpdateMsg.Text = "Programacion '$($selected.Tarea)' eliminada."
      & $fnWriteLog 'INFO' "Actualizacion programada eliminada: $($selected.Tarea)"
      & $refreshUpdateListAction
    } catch {
      $lblUpdateMsg.Foreground = [System.Windows.Media.Brushes]::Red
      $lblUpdateMsg.Text = "Error: $($_.Exception.Message)"
    }
  }.GetNewClosure())

  & $refreshUpdateTargetAction
  $win.FindName('btnClose2').Add_Click({ $win.Close() }.GetNewClosure())
  $win.Owner = $Window
  $win.ShowDialog() | Out-Null
}

#==============================================================================
#  BUSCADOR DE SERVIDORES
#==============================================================================

function Show-AddServersDialog {
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Agregar servidores" Height="390" Width="500"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="20">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Grid.Row="0" Text="Listado de servidores" FontSize="15"
               FontWeight="SemiBold" Margin="0,0,0,8"/>
    <TextBlock Grid.Row="1" TextWrapping="Wrap" Foreground="#FF475569" Margin="0,0,0,12"
               Text="Pega los nombres de los servidores. Los que no esten registrados se agregaran con una observacion en Comentarios. Puedes usar una linea, coma o punto y coma como separador."/>
    <TextBox x:Name="txtServers" Grid.Row="2" AcceptsReturn="True" TextWrapping="NoWrap"
             VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto"
             Padding="8" FontFamily="Consolas"/>
    <TextBlock x:Name="lblErr" Grid.Row="3" Foreground="#FFDC2626" Margin="0,8,0,0"
               Text="" TextWrapping="Wrap"/>
    <DockPanel Grid.Row="4" LastChildFill="False" HorizontalAlignment="Right" Margin="0,12,0,0">
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" Margin="0,0,8,0" IsCancel="True"/>
      <Button x:Name="btnOk" Content="Agregar" Padding="14,7" IsDefault="True"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $sx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $txt = $win.FindName('txtServers')
  $lbl = $win.FindName('lblErr')
  $box = @{ Result = $null }
  $win.FindName('btnOk').Add_Click({
    $names = @("$($txt.Text)" -split '[,;\r\n]+' |
      ForEach-Object { "$_".Trim() } |
      Where-Object { $_ } |
      Select-Object -Unique)
    if ($names.Count -eq 0) {
      $lbl.Text = 'Ingresa al menos un nombre de servidor.'
      return
    }
    $box.Result = $names
    $win.DialogResult = $true
    $win.Close()
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({
    $box.Result = $null
    $win.DialogResult = $false
    $win.Close()
  }.GetNewClosure())
  try { $win.Owner = $Window } catch {}
  $null = $txt.Focus()
  [void]$win.ShowDialog()
  return $box.Result
}

function Close-SearchPopup {
  $script:popSearch.IsOpen = $false
  $script:lbSearch.ItemsSource = $null
}

# Agrega un servidor del CSV a la grilla (si no estaba ya)
function Add-ServerFromSearch($csvRow, [string]$Comentarios = '', [string]$Source = 'Buscador') {
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
    Write-Log 'INFO' "$Source`: $name ya esta en la grilla (resaltado)"
  } else {
    # No esta: agregar
    $sr = New-Object ServerRow
    $sr.Servidor = "$($csvRow.Servidor)"
    $sr.IP       = "$($csvRow.IP)"
    $sr.Comentarios = $Comentarios
    $sr.State    = 'Unselected'
    $sr.add_PropertyChanged({ param($s,$e) if ($e.PropertyName -eq 'Sel') { On-ServerSelChanged $s } })
    $script:Servers.Add($sr)
    $script:dg.ScrollIntoView($sr)
    Update-ButtonStates
    Write-Log 'INFO' "$Source`: $name agregado a la grilla"
  }
}

function Add-ServersFromList {
  $names = @(Show-AddServersDialog)
  if ($names.Count -eq 0) { return }

  $toAdd = @()
  $already = @()
  $outsideInventory = @()
  foreach ($requestedName in $names) {
    $csvRow = @($script:Csv | Where-Object {
      "$($_.Servidor)".Trim() -ieq "$requestedName".Trim()
    } | Select-Object -First 1)[0]
    $name = if ($csvRow) { "$($csvRow.Servidor)".Trim() } else { "$requestedName".Trim() }
    $existing = $script:Servers | Where-Object { "$($_.Servidor)".Trim() -ieq $name } | Select-Object -First 1
    if ($existing) {
      $already += $name
    } else {
      if ($csvRow) {
        $toAdd += [pscustomobject]@{ Row=$csvRow; Comentarios='' }
      } else {
        $outsideInventory += $name
        $toAdd += [pscustomobject]@{
          Row = [pscustomobject]@{ Grupo=''; Dominio=''; IP=''; OS=''; Servidor=$name; Ambiente='' }
          Comentarios = 'Este equipo no se encuentra en el inventario'
        }
      }
    }
  }

  if ($toAdd.Count -gt 0 -and -not (Ensure-AnalystAssigned 'Carga de servidores')) { return }
  foreach ($item in $toAdd) { Add-ServerFromSearch $item.Row $item.Comentarios 'Agregar' }

  $message = "Agregados: $($toAdd.Count)`nYa estaban en la grilla: $($already.Count)`nAgregados fuera del inventario: $($outsideInventory.Count)"
  if ($outsideInventory.Count -gt 0) {
    $visible = @($outsideInventory | Select-Object -First 20) -join ', '
    if ($outsideInventory.Count -gt 20) { $visible += ' ...' }
    $message += "`n`nFuera del inventario: $visible`nComentario asignado: `"Este equipo no se encuentra en el inventario`""
  }
  [System.Windows.MessageBox]::Show($message, 'WUU - Agregar servidores', 'OK', 'Information') | Out-Null
  Write-Log 'INFO' "Agregar servidores: $($toAdd.Count) agregado(s), $($already.Count) existente(s), $($outsideInventory.Count) fuera del inventario."
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

# 3b. Espacio en disco
$miDisk = New-Object System.Windows.Controls.MenuItem
$miDisk.Header = "Chequear espacio en disco"
$miDisk.Add_Click({
  $sel = $script:dg.SelectedItem
  if (-not $sel) { [System.Windows.MessageBox]::Show("Selecciona primero una fila.","WUU",'OK','Information') | Out-Null; return }
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }
  $sel.Status = 'Consultando espacio en disco...'
  Show-DiskSpace $sel.Servidor
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
    "Se limpiara la cache de Windows Update en '$($sel.Servidor)':`n`n1. Detener wuauserv, cryptSvc, bits y msiserver`n2. Renombrar SoftwareDistribution y catroot2`n3. Reiniciar servicios`n4. gpupdate /force`n5. Reinicio del servidor (10 s)`n`nContinuar?",
    "WUU - Limpiar cache", 'YesNo', 'Warning')
  if ($resp -ne 'Yes') { return }
  Write-Log 'INFO' "Limpiar cache WU: $($sel.Servidor)"
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
$cm.Items.Add($miDisk) | Out-Null
$script:dg.ContextMenu = $cm

#--- Eventos de botones --------------------------------------------------------

# Selector de grupos: solicita el analista antes de abrir el listado.
$script:btnGroups.Add_Checked({
  if (-not (Ensure-AnalystAssigned 'Selector de grupos')) {
    $script:btnGroups.IsChecked = $false
  }
})

# Seleccionar todos: marca Sel en todas las filas visibles (inicia parcheo en cada una)
$btnSelectAll.Add_Click({
  if (-not (Ensure-AnalystAssigned 'Seleccionar todos')) { return }
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
  if (-not (Ensure-AnalystAssigned 'Limpiar seleccion')) { return }
  foreach ($s in $script:Servers) { $s.Sel = $false; $s.State = 'Unselected'; $s.Status = '' }
  Update-ButtonStates
})

# Agregar: carga una lista de nombres exactos desde el inventario
$btnAdd.Add_Click({
  if (-not (Ensure-AnalystAssigned 'Agregar servidores')) { return }
  Add-ServersFromList
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

# Reporte: recolecta todos los servidores, muestra la grilla y sincroniza con Centro de Control de Parcheo
$btnReport.Add_Click({
  if (-not (Ensure-AnalystAssigned 'Generar reporte')) { return }
  Show-Report
})

# Fix: copia o instala .msu / .cab de la carpeta Fix\ en servidores elegidos
$btnFix.Add_Click({
  if (-not (Ensure-AnalystAssigned 'Ejecucion de Fix')) { return }
  Start-FixFlow
})

# Programar: abre la ventana de gestion de la tarea programada
$btnProgramar.Add_Click({
  if (-not (Ensure-AnalystAssigned 'Programacion de tareas')) { return }
  Show-SchedulerWindow
})

# Recargar grupos: limpia la grilla y permite volver a elegir grupos
$btnReload.Add_Click({
  if (-not (Ensure-AnalystAssigned 'Recargar grupos')) { return }
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
  if (-not (Ensure-AnalystAssigned 'Detener y refrescar')) { return }
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

function Invoke-ScheduledPatchJob([string]$DefinitionPath) {
  if (-not $DefinitionPath -or -not (Test-Path $DefinitionPath)) {
    Write-Log 'ERROR' "Ventana programada: archivo de definicion inexistente: $DefinitionPath"
    Send-TeamsNotification -Title 'WUU - Actualizacion programada (error)' -Level Error `
      -Text 'No se encontro el archivo de definicion de la ventana de actualizacion.' `
      -Facts @(@{Name='Archivo'; Value="$DefinitionPath"}; @{Name='Equipo'; Value=$env:COMPUTERNAME})
    return 2
  }
  try {
    $definition = Get-Content -Path $DefinitionPath -Raw | ConvertFrom-Json
  } catch {
    Write-Log 'ERROR' "Ventana programada: JSON invalido: $($_.Exception.Message)"
    Send-TeamsNotification -Title 'WUU - Actualizacion programada (error)' -Level Error `
      -Text 'La definicion JSON de la ventana de actualizacion es invalida.' `
      -Facts @(@{Name='Archivo'; Value="$DefinitionPath"}; @{Name='Detalle'; Value="$($_.Exception.Message)"})
    return 2
  }
  if ("$($definition.Kind)" -ne 'ScheduledPatch') {
    Write-Log 'ERROR' 'Ventana programada: tipo de definicion no soportado.'
    Send-TeamsNotification -Title 'WUU - Actualizacion programada (error)' -Level Error `
      -Text 'El archivo JSON no corresponde a una ventana de actualizacion.' `
      -Facts @(@{Name='Archivo'; Value="$DefinitionPath"})
    return 2
  }

  $servers = @($definition.Servers | ForEach-Object { "$_".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
  if ($servers.Count -eq 0) {
    $definition.Status = 'Error'
    $definition.LastMessage = 'La programacion no contiene servidores.'
    Save-ScheduledUpdateDefinition $definition $DefinitionPath
    Write-Log 'ERROR' 'Ventana programada sin servidores.'
    Send-TeamsNotification -Title 'WUU - Actualizacion programada (error)' -Level Error `
      -Text 'La programacion no contiene servidores.' `
      -Facts @(@{Name='Tarea'; Value="$($definition.TaskName)"}; @{Name='Destino'; Value="$($definition.TargetValue)"})
    return 2
  }
  if (-not (Test-Path $script:PsExecPath)) {
    $definition.Status = 'Error'
    $definition.LastMessage = "No se encuentra PsExec.exe: $($script:PsExecPath)"
    Save-ScheduledUpdateDefinition $definition $DefinitionPath
    Write-Log 'ERROR' $definition.LastMessage
    Send-TeamsNotification -Title 'WUU - Actualizacion programada (error)' -Level Error `
      -Text $definition.LastMessage `
      -Facts @(@{Name='Tarea'; Value="$($definition.TaskName)"})
    return 2
  }

  $definition.Status = 'En ejecucion'
  $definition.StartedAt = (Get-Date).ToString('o')
  $definition.LastMessage = "Iniciando parcheo de $($servers.Count) servidor(es)."
  Save-ScheduledUpdateDefinition $definition $DefinitionPath
  Write-Log 'INFO' "Ventana programada iniciada: $($definition.TaskName) | destino=$($definition.TargetValue) | servidores=$($servers.Count)"
  $targetLabel = if ("$($definition.TargetType)" -eq 'Group') { "Grupo $($definition.TargetValue)" } else { "Servidor $($definition.TargetValue)" }
  Send-TeamsNotification -Title 'WUU - Actualizacion programada iniciada' -Level Info `
    -Text 'Se inicio una ventana unica de parcheo.' `
    -Facts @(
      @{Name='Tarea'; Value="$($definition.TaskName)"}
      @{Name='Destino'; Value=$targetLabel}
      @{Name='Servidores'; Value="$($servers.Count)"}
      @{Name='Equipo'; Value=$env:COMPUTERNAME}
      @{Name='Inicio'; Value=(Get-Date).ToString('dd/MM/yyyy HH:mm:ss')}
    )

  $scheduledRemoteRel = "$($script:RemoteRel.TrimEnd('\'))\Scheduled\$($definition.JobId)"
  $scheduledResults = [hashtable]::Synchronized(@{})
  $pool = @()
  $scheduledWorker = {
    param($server,$psexec,$worker,$rel,$timeoutSec,$autoReboot,$rebootDelay,$cleanup,$scheduledResults)
    $started = Get-Date
    $serverMutex = $null
    $serverMutexTaken = $false
    $result = [ordered]@{
      Servidor=$server; IP=''; State='Error'; Status=''; Error=''; RunningTime=''
    }
    try {
      $mutexSuffix = ($server -replace '[^A-Za-z0-9_-]', '_')
      $serverMutex = [System.Threading.Mutex]::new($false, "Global\WUU_ScheduledPatch_$mutexSuffix")
      try { $serverMutexTaken = $serverMutex.WaitOne(0) }
      catch [System.Threading.AbandonedMutexException] { $serverMutexTaken = $true }
      if (-not $serverMutexTaken) { throw 'Otra ventana programada ya esta procesando este servidor.' }

      $reachable = $false
      $tcp = New-Object System.Net.Sockets.TcpClient
      try {
        $iar = $tcp.BeginConnect($server,445,$null,$null)
        $reachable = $iar.AsyncWaitHandle.WaitOne($timeoutSec * 1000) -and $tcp.Connected
      } finally { try { $tcp.Close() } catch {} }
      if (-not $reachable) { throw "Sin conectividad (puerto 445, timeout ${timeoutSec}s)" }

      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\status.json" -Force -ErrorAction SilentlyContinue
      Remove-Item "$remoteDir\stop.flag" -Force -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\worker.ps1" -Force -ErrorAction Stop
      $output = & $psexec "\\$server" -accepteula -nobanner -s powershell.exe `
        -ExecutionPolicy Bypass -NonInteractive -File "C:\$rel\worker.ps1" -Mode Install 2>&1
      $exitCode = $LASTEXITCODE

      $statusObj = $null
      if (Test-Path "$remoteDir\status.json") {
        try { $statusObj = Get-Content "$remoteDir\status.json" -Raw | ConvertFrom-Json } catch {}
      }
      if (-not $statusObj) {
        throw "Sin estado remoto. PsExec codigo $exitCode. $(($output | Select-Object -Last 2) -join ' ')"
      }

      $result.IP = "$($statusObj.ip)"
      $result.Status = "$($statusObj.status)"
      $result.Error = "$($statusObj.error)"
      switch ("$($statusObj.stage)") {
        'done'    { $result.State = 'Updated' }
        'reboot'  { $result.State = 'RebootRequired' }
        'stopped' { $result.State = 'Stopped' }
        default   { $result.State = 'Error' }
      }
      if ($exitCode -ne 0 -and -not $result.Error) {
        $result.Error = "PsExec codigo $exitCode"
        $result.State = 'Error'
      }

      if ("$($statusObj.stage)" -eq 'reboot' -and $autoReboot) {
        if ($rebootDelay -gt 0) { Start-Sleep -Seconds $rebootDelay }
        $rebootOutput = & $psexec "\\$server" -accepteula -nobanner -d -s `
          shutdown /r /t 10 /c "Reinicio automatico por ventana programada WUU" 2>&1
        $rebootExit = $LASTEXITCODE
        if ($rebootExit -eq 0) {
          $result.Status = "$($result.Status). Reinicio automatico enviado."
        } else {
          $result.State = 'Error'
          $rebootError = "Reinicio no enviado: PsExec codigo $rebootExit. $(($rebootOutput | Select-Object -Last 2) -join ' ')"
          $result.Error = if ($result.Error) { "$($result.Error) | $rebootError" } else { $rebootError }
        }
      }
      if ($cleanup -and $result.State -ne 'Error' -and "$($statusObj.stage)" -in @('done','reboot')) {
        Remove-Item $remoteDir -Recurse -Force -ErrorAction SilentlyContinue
      }
    } catch {
      $result.State = 'Error'
      $result.Status = 'Error de ejecucion programada'
      $result.Error = $_.Exception.Message
    } finally {
      $elapsed = (Get-Date) - $started
      $result.RunningTime = '{0:00}:{1:00}:{2:00}' -f [int]$elapsed.TotalHours,$elapsed.Minutes,$elapsed.Seconds
      if (-not $scheduledResults.ContainsKey($server)) {
        $scheduledResults[$server] = [pscustomobject]$result
      }
      if ($serverMutexTaken -and $serverMutex) { try { $serverMutex.ReleaseMutex() } catch {} }
      if ($serverMutex) { try { $serverMutex.Dispose() } catch {} }
    }
  }

  $runspacePool = $null
  try {
    $runspacePool = [runspacefactory]::CreateRunspacePool(1,10)
    $runspacePool.ApartmentState = 'MTA'
    $runspacePool.Open()
  } catch {
    $definition.Status = 'Error'
    $definition.LastMessage = "No se pudo iniciar el pool de ejecucion: $($_.Exception.Message)"
    Save-ScheduledUpdateDefinition $definition $DefinitionPath
    Write-Log 'ERROR' $definition.LastMessage
    return 2
  }

  foreach ($server in $servers) {
    $ps = $null
    try {
      $ps = [powershell]::Create()
      $ps.RunspacePool = $runspacePool
      $ps.AddScript($scheduledWorker.ToString()).
        AddArgument($server).AddArgument($script:PsExecPath).
        AddArgument($script:LocalWorker).AddArgument($scheduledRemoteRel).
        AddArgument([int]$script:Cfg.ConnectivityTimeoutSec).
        AddArgument([bool]$script:Cfg.AutoReboot.Enabled).
        AddArgument([int]$script:Cfg.AutoReboot.DelaySeconds).
        AddArgument([bool]$script:Cfg.CleanupRemoteOnSuccess).
        AddArgument($scheduledResults) | Out-Null
      $pool += @{ Server=$server; ps=$ps; handle=$ps.BeginInvoke() }
    } catch {
      if ($ps) { try { $ps.Dispose() } catch {} }
      $scheduledResults[$server] = [pscustomobject]@{
        Servidor=$server;IP='';State='Error';Status='No se pudo iniciar'
        Error=$_.Exception.Message;RunningTime=''
      }
    }
  }

  $deadline = (Get-Date).AddMinutes([int]$script:Cfg.PatchTimeoutMinutes)
  while ($scheduledResults.Count -lt $servers.Count -and (Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 2
  }
  foreach ($entry in $pool) {
    if (-not $entry.handle.IsCompleted) {
      $scheduledResults[$entry.Server] = [pscustomobject]@{
        Servidor=$entry.Server;IP='';State='Error';Status='Timeout'
        Error="Tiempo maximo excedido ($($script:Cfg.PatchTimeoutMinutes) min)";RunningTime=''
      }
      try {
        Set-Content -Path "\\$($entry.Server)\C`$\$scheduledRemoteRel\stop.flag" `
          -Value '1' -Encoding ASCII -ErrorAction SilentlyContinue
      } catch {}
      try { $entry.ps.Stop() } catch {}
    } else {
      try { $entry.ps.EndInvoke($entry.handle) } catch {}
    }
    try { $entry.ps.Dispose() } catch {}
  }
  try { $runspacePool.Close(); $runspacePool.Dispose() } catch {}

  $results = @($scheduledResults.Values | Sort-Object Servidor)
  $errors = @($results | Where-Object { $_.State -in @('Error','Stopped') })
  Save-History -Rows $results -Type 'ParcheoProgramado'
  $definition.Status = if ($errors.Count -eq 0) { 'Completada' } else { 'Completada con errores' }
  $definition.CompletedAt = (Get-Date).ToString('o')
  $definition.LastMessage = "$($results.Count) procesado(s), $($errors.Count) con error."
  $definition.Results = @($results)
  Save-ScheduledUpdateDefinition $definition $DefinitionPath
  Write-Log 'INFO' "Ventana programada finalizada: $($definition.TaskName) | $($definition.LastMessage)"
  $errorLines = @($errors | ForEach-Object {
    $detail = if ("$($_.Error)") { "$($_.Error)" } else { "$($_.Status)" }
    "$($_.Servidor): $detail"
  })
  $finishLevel = if ($errors.Count -eq 0) { 'Success' } else { 'Warning' }
  Send-TeamsNotification -Title "WUU - Actualizacion programada $($definition.Status.ToLower())" -Level $finishLevel `
    -Text $definition.LastMessage `
    -Facts @(
      @{Name='Tarea'; Value="$($definition.TaskName)"}
      @{Name='Destino'; Value=$targetLabel}
      @{Name='Procesados'; Value="$($results.Count)"}
      @{Name='Con error'; Value="$($errors.Count)"}
      @{Name='Errores'; Value=(Format-TeamsErrorList $errorLines)}
      @{Name='Fin'; Value=(Get-Date).ToString('dd/MM/yyyy HH:mm:ss')}
    )
  return $(if ($errors.Count -eq 0) { 0 } else { 1 })
}

#--- Arranque -----------------------------------------------------------------
if ($ScheduledPatch) {
  #============================================================================
  #  MODO HEADLESS (-ScheduledPatch): parcheo normal de una sola ejecucion
  #============================================================================
  Write-Log 'INFO' "Modo headless (-ScheduledPatch) iniciado. JobFile=$JobFile"
  $patchExitCode = Invoke-ScheduledPatchJob $JobFile
  exit [int]$patchExitCode
} elseif ($Scheduled) {
  #============================================================================
  #  MODO HEADLESS (-Scheduled): genera reporte, sincroniza y notifica
  #  Ejecutado por la tarea programada del Programador de Windows.
  #============================================================================
  Write-Log 'INFO' 'Modo headless (-Scheduled) iniciado.'
  Load-Csv
  if ($script:Csv.Count -eq 0) {
    Write-Log 'ERROR' 'Sin servidores en CSV. Saliendo.'
    Send-TeamsNotification -Title 'WUU - Reporte programado (error)' -Level Error `
      -Text 'No hay servidores en el inventario CSV. El reporte no se ejecuto.' `
      -Facts @(@{Name='Equipo'; Value=$env:COMPUTERNAME})
    exit 1
  }

  $reportPeriodMode = "$($script:Cfg.ScheduledReport.PeriodMode)"
  if ($reportPeriodMode -notin @('CurrentMonth','PreviousMonth','SpecificDate')) {
    Write-Log 'WARN' "Periodo de reporte invalido '$reportPeriodMode'; se usara CurrentMonth."
    $reportPeriodMode = 'CurrentMonth'
  }
  $reportSpecificDate = ''
  if ($reportPeriodMode -eq 'SpecificDate') {
    try {
      $configuredSpecificDate = "$($script:Cfg.ScheduledReport.SpecificDate)".Trim()
      if (-not $configuredSpecificDate) { throw 'No se configuro ScheduledReport.SpecificDate.' }
      $specificDateValue = Parse-ScheduledDateDMY $configuredSpecificDate 0 0
      $reportSpecificDate = $specificDateValue.ToString('yyyy-MM-dd')
    } catch {
      Write-Log 'ERROR' "Fecha especifica del reporte invalida: $($_.Exception.Message)"
      Send-TeamsNotification -Title 'WUU - Reporte programado (error)' -Level Error `
        -Text "Fecha especifica del reporte invalida: $($_.Exception.Message)" `
        -Facts @(@{Name='Equipo'; Value=$env:COMPUTERNAME})
      exit 1
    }
  }
  Write-Log 'INFO' "Headless: periodo del reporte=$reportPeriodMode $reportSpecificDate"

  # Tomar todos los servidores de todos los grupos
  $allServers = @($script:Csv | Select-Object -ExpandProperty Servidor -Unique)
  Write-Log 'INFO' "Headless: consultando $($allServers.Count) servidor(es)."
  $periodLabel = switch ($reportPeriodMode) {
    'PreviousMonth' { 'Mes anterior' }
    'SpecificDate'  { "Fecha $reportSpecificDate" }
    default         { 'Mes en curso' }
  }
  Send-TeamsNotification -Title 'WUU - Reporte programado iniciado' -Level Info `
    -Text 'Se inicio el reporte automatico de todos los servidores del inventario.' `
    -Facts @(
      @{Name='Tarea'; Value="$($script:Cfg.ScheduledReport.TaskName)"}
      @{Name='Periodo'; Value=$periodLabel}
      @{Name='Servidores'; Value="$($allServers.Count)"}
      @{Name='Equipo'; Value=$env:COMPUTERNAME}
      @{Name='Inicio'; Value=(Get-Date).ToString('dd/MM/yyyy HH:mm:ss')}
    )

  # Correr el worker de reporte en paralelo (mismo mecanismo que el boton Reporte)
  $bag  = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $pool = @()
  $rjob = {
    param($server,$psexec,$worker,$rel,$periodMode,$specificDate,$bag)
    $obj=$null
    try {
      $remoteDir="\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\report.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\report.ps1" -Force -ErrorAction Stop
      $reportArgs = @('-ExecutionPolicy','Bypass','-NonInteractive','-File',"C:\$rel\report.ps1",'-PeriodMode',$periodMode)
      if ($periodMode -eq 'SpecificDate') { $reportArgs += @('-SpecificDate',$specificDate) }
      $null=& $psexec "\\$server" -accepteula -nobanner -s powershell.exe @reportArgs 2>&1
      if (Test-Path "$remoteDir\report.json") {
        $raw=Get-Content "$remoteDir\report.json" -Raw
        if ($raw) { $obj=$raw|ConvertFrom-Json }
      }
    } catch {}
    if (-not $obj) {
      $obj=[pscustomobject]@{
        Dominio='';Servidor=$server;IP='';Sistema_Operativo='';Version_Sistema_Operativo='';
        Fecha_Instalacion='';KBs_Instaladas='';Fecha_Reinicio='';Running_Time='';
        Descripcion_Error='Sin conexion o sin datos';Disk_Space=''
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
        AddArgument($reportPeriodMode).AddArgument($reportSpecificDate).
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
      Comentarios='';Disk_Space=$_.Disk_Space
      Snap=(Get-SnapReportText $false);Confirmado=(Get-ConfirmadoReportText $false)
    }
  })
  $reportDir = Join-Path $script:ScriptDir 'Reportes'
  if (-not (Test-Path $reportDir)){ New-Item -ItemType Directory -Path $reportDir -Force | Out-Null }
  $rfile = Join-Path $reportDir ("Reporte_{0}.csv" -f (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'))
  $rows | Export-Csv -Path $rfile -NoTypeInformation -Delimiter ';' -Encoding UTF8
  Write-Log 'INFO' "Headless: reporte CSV guardado en $rfile"

  # Sincronizar con Centro de Control de Parcheo (mismo formato que el modo interactivo)
  if ($script:WUUDashboardUploadEnabled -and $script:WUUDashboardUploadUrl) {
    try {
      [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
      $vServers = @($bag | ForEach-Object {
        [ordered]@{
          Dominio=$_.Dominio; Servidor=$_.Servidor; IP=$_.IP
          Sistema_Operativo=$_.Sistema_Operativo; Version_Sistema_Operativo=$_.Version_Sistema_Operativo
          Fecha_Instalacion=$_.Fecha_Instalacion; KBs_Instaladas=$_.KBs_Instaladas
          Fecha_Reinicio=$_.Fecha_Reinicio; Running_Time=$_.Running_Time; Descripcion_Error=$_.Descripcion_Error
          Comentarios=''; Disk_Space=$_.Disk_Space
          Snap=(Get-SnapReportText $false); Confirmado=(Get-ConfirmadoReportText $false)
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
      Write-Log 'INFO' "Headless: sincronizacion Centro de Control de Parcheo correcta ($($vServers.Count) servidores)."
    } catch { Write-Log 'ERROR' "Headless Centro de Control de Parcheo: $($_.Exception.Message)" }
  }

  # Historial
  Save-History -Rows @($rows | ForEach-Object {
    [pscustomobject]@{Servidor=$_.Servidor;IP=$_.IP;State='Report';
      Status='Reporte programado';Error=$_.Descripcion_Error;RunningTime=$_.Running_Time}
  }) -Type 'ReporteProgramado'

  $failed = @($rows | Where-Object { "$($_.Descripcion_Error)".Trim() })
  $errorLines = @($failed | ForEach-Object { "$($_.Servidor): $($_.Descripcion_Error)" })
  $finishLevel = if ($failed.Count -eq 0) { 'Success' } else { 'Warning' }
  Send-TeamsNotification -Title 'WUU - Reporte programado finalizado' -Level $finishLevel `
    -Text "Consulta completada: $($rows.Count) servidor(es), $($failed.Count) con error o sin datos." `
    -Facts @(
      @{Name='Tarea'; Value="$($script:Cfg.ScheduledReport.TaskName)"}
      @{Name='Periodo'; Value=$periodLabel}
      @{Name='Respondieron'; Value="$($bag.Count)/$($allServers.Count)"}
      @{Name='Con error'; Value="$($failed.Count)"}
      @{Name='CSV'; Value=$rfile}
      @{Name='Errores'; Value=(Format-TeamsErrorList $errorLines)}
      @{Name='Fin'; Value=(Get-Date).ToString('dd/MM/yyyy HH:mm:ss')}
    )

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
