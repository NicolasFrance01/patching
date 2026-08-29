<#
================================================================================
  WUU.ps1  -  Windows Update Utility
  --------------------------------------------------------------------------
  Consola de parcheo para servidores Windows (PowerShell + WPF).
  --------------------------------------------------------------------------
  Modos de ejecucion:
    Normal   : abrir directamente (interfaz grafica)
    Headless : WUU.ps1 -Scheduled       (reporte programado)
               WUU.ps1 -ScheduledPatch  (ventana de actualizacion one-shot)

  Configuracion externa: config.json junto a WUU.ps1
================================================================================
#>
param(
  [switch]$Scheduled,      # modo headless: genera reporte y sincroniza con Dashboard Web
  [switch]$ScheduledPatch  # modo headless: ventana de parcheo programada (one-shot)
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
    $extra = ''
    if ($ScheduledPatch) { $extra = ' -ScheduledPatch' }
    elseif ($Scheduled)  { $extra = ' -Scheduled' }
    $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"$extra"
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

    // Confirmaciones de ventana (manuales; no disparan parcheo)
    private bool _snap;
    public bool Snap {
        get { return _snap; }
        set {
            if (_snap == value) return;
            _snap = value;
            N("Snap");
            SnapMsg = _snap ? "SI" : "NO";
        }
    }
    private string _snapMsg = "NO";
    public string SnapMsg { get { return _snapMsg; } set { _snapMsg = value ?? ""; N("SnapMsg"); } }

    private bool _confirmado;
    public bool Confirmado {
        get { return _confirmado; }
        set {
            if (_confirmado == value) return;
            _confirmado = value;
            N("Confirmado");
            ConfirmadoMsg = _confirmado ? "SI" : "NO";
        }
    }
    private string _confirmadoMsg = "NO";
    public string ConfirmadoMsg { get { return _confirmadoMsg; } set { _confirmadoMsg = value ?? ""; N("ConfirmadoMsg"); } }

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
    public string Grupo {get;set;}
    public string Ambiente {get;set;}
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
    public string Disk_Space {get;set;}
    public string Snap {get;set;}
    public string Confirmado {get;set;}
    public string Analista_Asignado {get;set;}
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
                 Foreground="#FF1D4ED8" Margin="0,0,0,0"/>
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
        <DataGridTemplateColumn Header="Snap" Width="72" CanUserSort="False">
          <DataGridTemplateColumn.CellTemplate>
            <DataTemplate>
              <DockPanel Margin="2,0">
                <CheckBox DockPanel.Dock="Left" VerticalAlignment="Center" Margin="0,0,6,0"
                          IsChecked="{Binding Snap, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>
                <TextBlock Text="{Binding SnapMsg}" VerticalAlignment="Center" Foreground="#FF334155"/>
              </DockPanel>
            </DataTemplate>
          </DataGridTemplateColumn.CellTemplate>
        </DataGridTemplateColumn>
        <DataGridTemplateColumn Header="Confirmado" Width="90" CanUserSort="False">
          <DataGridTemplateColumn.CellTemplate>
            <DataTemplate>
              <DockPanel Margin="2,0">
                <CheckBox DockPanel.Dock="Left" VerticalAlignment="Center" Margin="0,0,6,0"
                          IsChecked="{Binding Confirmado, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>
                <TextBlock Text="{Binding ConfirmadoMsg}" VerticalAlignment="Center" Foreground="#FF334155"/>
              </DockPanel>
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
$script:lblAnalyst     = $Window.FindName('lblAnalyst')
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
$script:PatchAfterCacheClear = @{}   # tras limpieza+reinicio, iniciar Install al volver

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
  Teams = [ordered]@{
    Enabled        = $false   # notificaciones a Microsoft Teams (Workflows / Power Automate)
    WebhookUrl     = ''       # URL del flujo "When a Teams webhook request is received"
    NotifyOnStart  = $true    # avisar cuando inicia una tarea de parcheo
    NotifyOnFinish = $true    # avisar cuando finaliza una tarea de parcheo
  }
  ScheduledReport = [ordered]@{
    Enabled    = $false
    Hour       = 8
    Minute     = 0
    StartDate  = ''   # dd/mm/aaaa; vacio = hoy
    TaskName   = 'WUU_ReporteAutomatico'
    PeriodMode = 'current'  # current | previous | specific
    Year       = 0
    Month      = 0
  }
  ScheduledPatch = [ordered]@{
    Enabled   = $false
    Hour      = 2
    Minute    = 0
    StartDate = ''
    TaskName  = 'WUU_VentanaActualizacion'
    Groups    = @()   # nombres de grupo del CSV
    Servers   = @()   # servidores especificos (ademas o en lugar de grupos)
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

function Ensure-ConfigSection([string]$Section) {
  # Garantiza que $script:Cfg[$Section] sea un diccionario con todas las claves default.
  # Evita el error "The property 'X' cannot be found" al asignar sobre PSCustomObject u OrderedDictionary incompleto.
  if (-not $script:Cfg.Contains($Section)) {
    $script:Cfg[$Section] = [ordered]@{}
  }
  $defaults = $null
  # Reconstruir defaults desde una copia conocida
  $template = switch ($Section) {
    'Dashboard' {
      [ordered]@{ Enabled = $true; Url = 'https://patching-dashboard-hae3f7fxc6fnhhbt.canadacentral-01.azurewebsites.net/api/upload' }
    }
    'Teams' {
      [ordered]@{ Enabled = $false; WebhookUrl = ''; NotifyOnStart = $true; NotifyOnFinish = $true }
    }
    'ScheduledReport' {
      [ordered]@{
        Enabled = $false; Hour = 8; Minute = 0; StartDate = ''
        TaskName = 'WUU_ReporteAutomatico'; PeriodMode = 'current'; Year = 0; Month = 0
      }
    }
    'ScheduledPatch' {
      [ordered]@{
        Enabled = $false; Hour = 2; Minute = 0; StartDate = ''
        TaskName = 'WUU_VentanaActualizacion'; Groups = @(); Servers = @()
      }
    }
    'History' { [ordered]@{ Enabled = $true; RetentionDays = 90 } }
    'AutoReboot' { [ordered]@{ Enabled = $true; DelaySeconds = 60 } }
    default { $null }
  }
  if (-not $template) { return }

  $cur = $script:Cfg[$Section]
  $merged = [ordered]@{}
  foreach ($k in @($template.Keys)) { $merged[$k] = $template[$k] }

  if ($cur -is [System.Collections.IDictionary]) {
    foreach ($k in @($cur.Keys)) { $merged[$k] = $cur[$k] }
  } elseif ($null -ne $cur) {
    foreach ($p in $cur.PSObject.Properties) {
      if ($null -ne $p.Value) { $merged[$p.Name] = $p.Value }
    }
  }
  $script:Cfg[$Section] = $merged
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
    foreach ($sec in @('Dashboard','Teams','ScheduledReport','ScheduledPatch','History','AutoReboot')) {
      if ($raw.$sec) {
        foreach ($k in @($script:Cfg[$sec].Keys)) {
          if ($null -eq $raw.$sec.$k) { continue }
          if ($k -eq 'Groups') {
            $script:Cfg[$sec][$k] = @($raw.$sec.$k | ForEach-Object { "$_".Trim() } | Where-Object { $_ })
          } else {
            $script:Cfg[$sec][$k] = $raw.$sec.$k
          }
        }
      }
      Ensure-ConfigSection $sec
    }
    Write-Log 'INFO' "config.json cargado desde $cfgPath"
  } catch { Write-Log 'WARN' "No se pudo leer config.json: $($_.Exception.Message)" }
}

#--- Control de corrida (historial al finalizar parcheo) ----------------------
$script:Run = @{ Started=$null; TotalServers=0; Notified=$false; ServerNames=@{} }
$script:AnalistaAsignado = ''   # nombre del operador (dialogo al abrir la consola)

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
  foreach ($svc in @('wuauserv','bits','cryptSvc','msiserver')) {
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
  # Une partes "a | b | c" sin repetir: Get-WuWsusErrors a menudo reincluye el mensaje ya mergeado.
  $parts = @($Msg -split '\s*\|\s*' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  $existing = @()
  if ("$($state.error)".Trim()) {
    $existing = @("$($state.error)" -split '\s*\|\s*' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  }
  foreach ($p in $parts) {
    $dup = $false
    foreach ($e in $existing) { if ($e -eq $p) { $dup = $true; break } }
    if (-not $dup) { $existing += $p }
  }
  $state.error = ($existing -join ' | ')
}

function Ensure-WuServices {
  # Primera validacion: si wuauserv/bits/cryptSvc/msiserver estan detenidos, forzar Running.
  $names = @('wuauserv','bits','cryptSvc','msiserver')
  $started = @()
  $failed  = @()
  $state.status = "Validando servicios WU..."
  Save-State
  foreach ($name in $names) {
    try {
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ($svc.Status -eq 'Running') { continue }
      $prev = "$($svc.Status)"
      $state.status = "Iniciando servicio $name (estaba $prev)..."
      Save-State
      if ($svc.StartType -eq 'Disabled') {
        try { Set-Service -Name $name -StartupType Manual -ErrorAction SilentlyContinue } catch {}
      }
      try {
        Start-Service -Name $name -ErrorAction Stop
      } catch {
        net.exe start $name 2>$null | Out-Null
      }
      $deadline = (Get-Date).AddSeconds(45)
      do {
        Start-Sleep -Milliseconds 500
        $svc.Refresh()
        if ($svc.Status -eq 'Running') { break }
      } while ((Get-Date) -lt $deadline)
      $svc.Refresh()
      if ($svc.Status -eq 'Running') { $started += $name }
      else { $failed += "$name($($svc.Status))" }
    } catch {
      try {
        net.exe start $name 2>$null | Out-Null
        $svc2 = Get-Service -Name $name -ErrorAction Stop
        if ($svc2.Status -eq 'Running') { $started += $name }
        else { $failed += $name }
      } catch { $failed += $name }
    }
  }
  if ($failed.Count -gt 0) {
    Merge-WuError ("Servicios no Running: $($failed -join ', ')")
  }
  if ($started.Count -gt 0) {
    $state.status = "Servicios forzados a Running: $($started -join ', ')"
  } else {
    $state.status = "Servicios WU OK (Running)"
  }
  Save-State
}

try {
  # --- Datos basicos: IP y WSUS configurado --------------------------------
  $state.ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
               Where-Object { $_.IPAddress -notmatch "^(127\.|169\.254\.)" } |
               Select-Object -First 1 -ExpandProperty IPAddress)
  $wuKey = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate"
  $wsus  = (Get-ItemProperty -Path $wuKey -Name WUServer -ErrorAction SilentlyContinue).WUServer
  $state.wsus = if ($wsus) { $wsus } else { "No configurado (WU directo)" }
  Save-State
  if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }

  # --- Primera validacion: servicios WU en Running -------------------------
  Ensure-WuServices
  if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }

  $state.status = "Chequeando WSUS/WU..."
  Save-State

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

  # --- Reintento: error de instalacion -> limpieza cache + revalidar (1 vez) -
  if ($errs.Count -gt 0) {
    $state.status = "Error de instalacion. Limpiando cache y revalidando..."
    Save-State
    Clear-WuCache "Remediando tras error de instalacion..."
    if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }

    $state.stage="check"; $state.status="Re-chequeando tras error de instalacion..."; $state.error=""; Save-State
    $session  = New-Object -ComObject Microsoft.Update.Session
    $searcher = $session.CreateUpdateSearcher()
    try {
      $result = $searcher.Search("IsInstalled=0 and IsHidden=0")
    } catch {
      $state.stage="error"; $state.status="Error"
      $state.error = "Error de instalacion persistente tras limpieza de cache (re-chequeo): $($_.Exception.Message)"
      Save-State; return
    }
    $available = $result.Updates.Count
    $state.available = $available
    if ($available -eq 0) {
      $reboot = $false
      try { $reboot = (New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired } catch {}
      if ($reboot) { $state.stage="reboot"; $state.rebootRequired=$true; $state.status="Actualizado tras remediacion. Requiere reinicio" }
      else         { $state.stage="done";   $state.status="Actualizado tras remediacion (sin updates pendientes)" }
      Save-State
      Invoke-RebootIfRequested $reboot
      return
    }

    $freeGB = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
    if ($freeGB -lt 2) {
      $state.stage="error"; $state.status="Error"
      $state.error = "Error de instalacion persistente tras limpieza de cache. Espacio insuficiente en C: ($freeGB GB)"
      Save-State; return
    }

    $state.stage="download"; $state.status="Re-descargando tras remediacion..."; Save-State
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
        $state.error = "Descarga (reintento): " + $_.Exception.Message
      }
      $i++
      $state.downloaded  = $i
      $state.downloadPct = [int][math]::Round(($i / $available) * 100)
      $state.status      = "Re-descargando $i de $available..."
      Save-State
    }

    $state.stage="install"; $state.status="Re-instalando tras remediacion..."; Save-State
    $installer = $session.CreateUpdateInstaller()
    $installer.Updates = $toInstall
    $instResult = $installer.Install()
    $errs = @()
    for ($k = 0; $k -lt $toInstall.Count; $k++) {
      $r = $instResult.GetUpdateResult($k)
      if ($r.ResultCode -ne 2) { $errs += ("0x{0:X8}" -f $r.HResult) }
    }
    if ($errs.Count -gt 0) {
      $state.stage="error"; $state.status="Error"
      $state.error = "Error de instalacion persistente tras limpieza de cache: " + ($errs -join ", ")
      Save-State; return
    }
    $state.error = ""
    $state.status = "Instalacion OK tras remediacion (codigo $($instResult.ResultCode))"
    Save-State
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

# Dashboard: valores leidos desde config.json (ya cargado en $script:Cfg)
$script:WUUDashboardUploadUrl     = $script:Cfg.Dashboard.Url
$script:WUUDashboardUploadEnabled = [bool]$script:Cfg.Dashboard.Enabled

# Teams: notificaciones de inicio/fin de tarea (Workflows / Power Automate)
$script:WUUTeamsEnabled        = [bool]$script:Cfg.Teams.Enabled
$script:WUUTeamsUrl            = "$($script:Cfg.Teams.WebhookUrl)".Trim()
$script:WUUTeamsNotifyOnStart  = [bool]$script:Cfg.Teams.NotifyOnStart
$script:WUUTeamsNotifyOnFinish = [bool]$script:Cfg.Teams.NotifyOnFinish

# Envia una Adaptive Card a Microsoft Teams (flujo Workflows / Power Automate).
# Cualquier fallo se registra en el log y NUNCA interrumpe el parcheo.
function Send-TeamsNotification($title, $facts, [string]$color = 'Default') {
  if (-not $script:WUUTeamsEnabled) { return }
  if (-not $script:WUUTeamsUrl) {
    Write-Log 'ERROR' 'Teams: notificaciones habilitadas pero sin WebhookUrl en config.json'
    return
  }
  try {
    $factItems = @($facts | ForEach-Object { @{ title = "$($_.title)"; value = "$($_.value)" } })
    $card = @{
      type        = 'message'
      attachments = @(
        @{
          contentType = 'application/vnd.microsoft.card.adaptive'
          content     = @{
            '$schema' = 'http://adaptivecards.io/schemas/adaptive-card.json'
            type      = 'AdaptiveCard'
            version   = '1.4'
            body      = @(
              @{ type = 'TextBlock'; text = "$title"; weight = 'Bolder'; size = 'Large'; color = $color; wrap = $true },
              @{ type = 'FactSet'; facts = $factItems }
            )
          }
        }
      )
    }
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $payload = $card | ConvertTo-Json -Depth 12
    Invoke-WebRequest -Uri $script:WUUTeamsUrl -Method Post -Body $payload `
      -ContentType 'application/json; charset=utf-8' -TimeoutSec 30 -UseBasicParsing | Out-Null
  } catch {
    Write-Log 'ERROR' "Teams: $($_.Exception.Message)"
  }
}

function Get-TeamsContextFacts {
  $facts = @(
    @{ title = 'Equipo';  value = "$env:COMPUTERNAME" },
    @{ title = 'Usuario'; value = "$env:USERNAME" }
  )
  if ("$script:AnalistaAsignado".Trim()) {
    $facts += @{ title = 'Analista asignado'; value = "$script:AnalistaAsignado".Trim() }
  }
  return $facts
}

function Send-TeamsPatchStarted($servers, [string]$groups = '', [string]$Title = 'Parcheo iniciado') {
  if (-not $script:WUUTeamsNotifyOnStart) { return }
  $facts = @(Get-TeamsContextFacts)
  $facts += @{ title = 'Servidores'; value = "$servers" }
  if ($groups) { $facts += @{ title = 'Grupos'; value = "$groups" } }
  $facts += @{ title = 'Inicio'; value = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') }
  Send-TeamsNotification $Title $facts 'Accent'
}

function Send-TeamsPatchFinished($rows, [string]$elapsed = '', [string]$Title = 'Parcheo finalizado') {
  if (-not $script:WUUTeamsNotifyOnFinish) { return }
  $rows    = @($rows)
  $total   = $rows.Count
  $updated = @($rows | Where-Object { $_.State -eq 'Updated' }).Count
  $reboot  = @($rows | Where-Object { $_.State -eq 'RebootRequired' }).Count
  $errors  = @($rows | Where-Object { $_.Error }).Count
  $facts = @(Get-TeamsContextFacts)
  $facts += @{ title = 'Servidores';        value = "$total" }
  $facts += @{ title = 'Actualizados';       value = "$updated" }
  $facts += @{ title = 'Requieren reinicio'; value = "$reboot" }
  $facts += @{ title = 'Con error';          value = "$errors" }
  if ($elapsed) { $facts += @{ title = 'Duracion'; value = "$elapsed" } }
  $facts += @{ title = 'Fin'; value = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') }
  $color = if ($errors -gt 0) { 'Attention' } elseif ($reboot -gt 0) { 'Warning' } else { 'Good' }
  Send-TeamsNotification $Title $facts $color
}

function Send-TeamsReportStarted($servers, [string]$period = '') {
  if (-not $script:WUUTeamsNotifyOnStart) { return }
  $facts = @(Get-TeamsContextFacts)
  $facts += @{ title = 'Tipo'; value = 'Reporte programado' }
  $facts += @{ title = 'Servidores'; value = "$servers" }
  $facts += @{ title = 'Periodo'; value = $(if ($period) { $period } else { 'Mes en curso' }) }
  $facts += @{ title = 'Inicio'; value = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') }
  Send-TeamsNotification 'Reporte programado iniciado' $facts 'Accent'
}

function Send-TeamsReportFinished($rows, [string]$elapsed = '', [string]$period = '', [string]$csvPath = '') {
  if (-not $script:WUUTeamsNotifyOnFinish) { return }
  $rows = @($rows)
  $total = $rows.Count
  $withErr = @($rows | Where-Object {
    $e = if ($null -ne $_.Descripcion_Error) { "$($_.Descripcion_Error)" } else { "$($_.Error)" }
    "$e".Trim()
  }).Count
  $ok = [Math]::Max(0, $total - $withErr)
  $facts = @(Get-TeamsContextFacts)
  $facts += @{ title = 'Tipo'; value = 'Reporte programado' }
  $facts += @{ title = 'Servidores'; value = "$total" }
  $facts += @{ title = 'Con datos'; value = "$ok" }
  $facts += @{ title = 'Con error / sin datos'; value = "$withErr" }
  $facts += @{ title = 'Periodo'; value = $(if ($period) { $period } else { 'Mes en curso' }) }
  if ($elapsed) { $facts += @{ title = 'Duracion'; value = "$elapsed" } }
  if ($csvPath) { $facts += @{ title = 'CSV'; value = "$csvPath" } }
  $facts += @{ title = 'Fin'; value = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') }
  $color = if ($withErr -gt 0) { 'Warning' } else { 'Good' }
  Send-TeamsNotification 'Reporte programado finalizado' $facts $color
}

$script:LocalReportWorker = Join-Path $env:TEMP 'WUU_report.ps1'
$script:RepBag            = $null
$script:RepPool           = @()
$script:RepTimer          = $null

# Script de consulta que corre en cada servidor (escribe report.json). Usa los
# comandos pedidos. Es texto literal; corre tal cual en el servidor.
$script:ReportWorker = @'
param([int]$Year = 0, [int]$Month = 0)
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
  $parts = @($Msg -split '\s*\|\s*' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  $existing = @()
  if ("$($o.Descripcion_Error)".Trim()) {
    $existing = @("$($o.Descripcion_Error)" -split '\s*\|\s*' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  }
  foreach ($p in $parts) {
    $dup = $false
    foreach ($e in $existing) { if ($e -eq $p) { $dup = $true; break } }
    if (-not $dup) { $existing += $p }
  }
  $o.Descripcion_Error = ($existing -join ' | ')
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
  $explicit = ($Year -gt 0 -and $Month -gt 0)
  if ($explicit) { $ty = $Year; $tm = $Month } else { $n = Get-Date; $ty = $n.Year; $tm = $n.Month }
  $last = $all | Sort-Object InstalledOn -Descending | Select-Object -First 1
  $inMonth = @($all | Where-Object {
    $_.InstalledOn.Year -eq $ty -and $_.InstalledOn.Month -eq $tm
  } | Sort-Object InstalledOn -Descending)
  $monthKbs = @($inMonth | Select-Object -ExpandProperty HotFixID -Unique)
  if ($monthKbs.Count -gt 0) {
    $o.KBs_Instaladas = ($monthKbs -join ", ")
    $o.Fecha_Instalacion = $inMonth[0].InstalledOn.ToString("yyyy-MM-dd")
  } elseif (-not $explicit -and $last) {
    $o.KBs_Instaladas = ""
    $o.Fecha_Instalacion = $last.InstalledOn.ToString("yyyy-MM-dd")
  } else {
    $o.KBs_Instaladas = ""
    $o.Fecha_Instalacion = ""
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
# Paquete en C:\Temp; resultado JSON en carpeta WUU
$pkg = Join-Path "C:\Temp" $PackageName
$base = "C:\Windows\Temp\WUU"
New-Item -ItemType Directory -Path $base -Force | Out-Null
$outPath = Join-Path $base "fix.json"
$o = [ordered]@{ exitCode=-1; message=""; rebootRequired=$false }
try {
  if (-not (Test-Path $pkg)) { throw "Paquete no encontrado: C:\Temp\$PackageName" }
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
    if (-not $script:Run.Started) {
      $script:Run.Started = Get-Date; $script:Run.Notified = $false; $script:Run.ServerNames = @{}
      $selCount = @($script:Servers | Where-Object { $_.Sel }).Count
      $grupos   = @($script:Groups | Where-Object { $_.IsChecked } | ForEach-Object { $_.Name }) -join ', '
      Send-TeamsPatchStarted ($(if ($selCount -gt 0) { $selCount } else { 1 })) $grupos
    }
    $script:Run.TotalServers++
    $script:Run.ServerNames[$server] = $true
  }
  if ($RebootAfter) { $script:JobRebootAfter[$server] = $true }
  if ($ClearCacheFirst) { $script:PatchAfterCacheClear[$server] = $true }

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
  $script:Jobs[$server] = @{ ps=$ps; handle=$handle; rs=$rs; sw=$sw; deadline=$deadline; mode=$WorkerMode; clearCache=[bool]$ClearCacheFirst }
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
  if ($script:PatchAfterCacheClear.ContainsKey($server)) {
    $script:PatchAfterCacheClear.Remove($server)
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
      $runElapsed = ''
      try { $runElapsed = Format-Elapsed ((Get-Date) - $script:Run.Started) } catch {}
      $runNames = @($script:Run.ServerNames.Keys)
      $script:Run.Started  = $null
      $script:Run.TotalServers = 0
      Save-History -Rows @($script:Servers) -Type 'Parcheo'
      $patched = if ($runNames.Count) { @($script:Servers | Where-Object { $runNames -contains $_.Servidor }) } else { @($script:Servers) }
      Send-TeamsPatchFinished $patched $runElapsed
      $script:Run.ServerNames = @{}
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
      } else {
        if ($script:PatchAfterCacheClear.ContainsKey($server)) {
          $script:PatchAfterCacheClear.Remove($server)
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

# Envia el reporte al endpoint del Dashboard Web y actualiza el label de estado
function Sync-ToDashboard($rows, $lbl) {
  if (-not $script:WUUDashboardUploadEnabled) {
    $lbl.Text = 'Sincronizacion con Dashboard Web suspendida (solo reporte local).'
    $lbl.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
    return
  }
  if (-not $script:WUUDashboardUploadUrl) { $lbl.Text = 'Sincronizacion deshabilitada (sin URL configurada).'; return }
  $lbl.Text = 'Sincronizando con Dashboard Web...'
  $lbl.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Apply-ReportInventoryFields $rows
    $servers = @($rows | ForEach-Object {
      [ordered]@{
        Grupo                     = $_.Grupo
        Ambiente                  = $_.Ambiente
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
        Disk_Space                = $_.Disk_Space
        Snap                      = $_.Snap
        Confirmado                = $_.Confirmado
        'Analista asignado'       = $_.Analista_Asignado
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
    $lbl.Text = "Sincronizado con Dashboard Web correctamente ($count servidores)."
    $lbl.Foreground = [System.Windows.Media.Brushes]::Green
    Write-Log 'INFO' "Dashboard Web: sincronizacion correcta ($count servidores)."
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
    Write-Log 'ERROR' "Dashboard Web: $detail"
  }
}

# Guarda una copia CSV del reporte en la carpeta .\Reportes (un archivo por corrida)
function Get-SnapReportText([bool]$Ok) {
  if ($Ok) { return 'Se confirmo la ejecucion del snapshot de este servidor' }
  return 'No se recibio la confirmacion de la ejecucion del snapshot de este servidor'
}
function Get-ConfirmadoReportText([bool]$Ok) {
  if ($Ok) { return 'Se recibio la confirmacion de la ventana' }
  return 'El cliente no confirmo la ejecucion de las actualizaciones de este servidor'
}
function Apply-ReportInventoryFields($rows) {
  # Completa Grupo/Ambiente desde el inventario CSV (o grilla) por nombre de servidor.
  $byCsv = @{}
  if ($script:Csv) {
    foreach ($r in @($script:Csv)) {
      $n = "$($r.Servidor)".Trim()
      if ($n -and -not $byCsv.ContainsKey($n)) { $byCsv[$n] = $r }
    }
  }
  foreach ($rr in @($rows)) {
    $name = "$($rr.Servidor)".Trim()
    if (-not $name) { continue }
    $csvRow = $byCsv[$name]
    $sr = $null
    if ($script:Servers) {
      $sr = @($script:Servers | Where-Object { "$($_.Servidor)".Trim() -eq $name } | Select-Object -First 1)[0]
    }
    $grupo = ''
    $ambiente = ''
    if ($csvRow) {
      $grupo = "$($csvRow.Grupo)".Trim()
      $ambiente = "$($csvRow.Ambiente)".Trim()
    }
    if (-not $grupo -and $sr) { $grupo = "$($sr.Grupo)".Trim() }
    if (-not $ambiente -and $sr) { $ambiente = "$($sr.Ambiente)".Trim() }
    $rr.Grupo = $grupo
    $rr.Ambiente = $ambiente
    if (-not "$($rr.Analista_Asignado)".Trim()) {
      $rr.Analista_Asignado = "$script:AnalistaAsignado".Trim()
    }
  }
  return $rows
}

function Apply-ReportConfirmations($rows) {
  # Completa Snap/Confirmado del reporte segun checkboxes de la grilla (si el servidor esta cargado).
  Apply-ReportInventoryFields $rows
  foreach ($rr in @($rows)) {
    $name = "$($rr.Servidor)".Trim()
    $sr = $null
    if ($name -and $script:Servers) {
      $sr = @($script:Servers | Where-Object { "$($_.Servidor)".Trim() -eq $name } | Select-Object -First 1)[0]
    }
    if ($sr) {
      $rr.Snap       = Get-SnapReportText ([bool]$sr.Snap)
      $rr.Confirmado = Get-ConfirmadoReportText ([bool]$sr.Confirmado)
    } else {
      $rr.Snap       = Get-SnapReportText $false
      $rr.Confirmado = Get-ConfirmadoReportText $false
    }
  }
  return $rows
}

function Save-ReportCsv($rows, [string]$periodLabel = '') {
  try {
    Apply-ReportInventoryFields $rows
    $dir = Join-Path $script:ScriptDir 'Reportes'
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $suffix = if ($periodLabel) { "_$periodLabel" } else { '' }
    $file = Join-Path $dir ("Reporte{0}_{1}.csv" -f $suffix, (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'))
    # Proyectamos a objetos ordenados para fijar el orden y los nombres de columna
    $export = $rows | ForEach-Object {
      [pscustomobject][ordered]@{
        Grupo                     = $_.Grupo
        Ambiente                  = $_.Ambiente
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
        Disk_Space                = $_.Disk_Space
        Snap                      = $_.Snap
        Confirmado                = $_.Confirmado
        'Analista asignado'       = $_.Analista_Asignado
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
function Show-ReportWindow($rows, $savedPath, $autoSync = $true, [string]$periodLabel = '') {
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
    <TextBlock x:Name="lblTitle" Grid.Row="0" Text="Reporte de parcheo" FontSize="16" FontWeight="SemiBold" Margin="0,0,0,10"/>
    <DataGrid x:Name="dgReport" Grid.Row="1" AutoGenerateColumns="False" IsReadOnly="True"
              CanUserAddRows="False" HeadersVisibility="Column" GridLinesVisibility="Horizontal"
              RowHeaderWidth="0" Background="White" BorderBrush="#FFE2E8F0"
              VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto">
      <DataGrid.Columns>
        <DataGridTextColumn Header="Grupo"             Binding="{Binding Grupo}"                     Width="100"/>
        <DataGridTextColumn Header="Ambiente"          Binding="{Binding Ambiente}"                  Width="100"/>
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
        <DataGridTextColumn Header="Disk Space"        Binding="{Binding Disk_Space}"                Width="180"/>
        <DataGridTextColumn Header="Snap"              Binding="{Binding Snap}"                      Width="260"/>
        <DataGridTextColumn Header="Confirmado"        Binding="{Binding Confirmado}"                Width="280"/>
        <DataGridTextColumn Header="Analista asignado" Binding="{Binding Analista_Asignado}"          Width="160"/>
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
  $lblT   = $win.FindName('lblTitle')
  $bClose = $win.FindName('btnClose')
  $bResy  = $win.FindName('btnResync')

  if ($periodLabel) { $lblT.Text = "Reporte de parcheo - mes consultado: $periodLabel" }

  $dgR.ItemsSource = $rows
  if ($savedPath) { $lblF.Text = "Copia local guardada en: $savedPath" }
  else            { $lblF.Text = "No se pudo guardar la copia local (revisa permisos en la carpeta Reportes)."; $lblF.Foreground = [System.Windows.Media.Brushes]::Red }
  $bClose.Add_Click({ $win.Close() })

  if ($autoSync) {
    $bResy.Add_Click({ Sync-ToDashboard $rows $lbl }.GetNewClosure())
    # Al abrir, sincroniza con Dashboard Web sin congelar la ventana (se pinta primero)
    $win.Add_Loaded({
      $lbl.Text = 'Preparando sincronizacion...'
      $win.Dispatcher.BeginInvoke(
        [action]{ Sync-ToDashboard $rows $lbl },
        [System.Windows.Threading.DispatcherPriority]::Background) | Out-Null
    }.GetNewClosure())
  } else {
    # Consulta historica: no se sincroniza (el Dashboard refleja el estado actual)
    $bResy.IsEnabled = $false
    $lbl.Text = 'Consulta historica: no se sincroniza con el Dashboard Web (refleja el estado actual).'
    $lbl.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
  }

  $win.Owner = $Window
  $win.ShowDialog() | Out-Null
}

# Dialogo: elegir ventana actual (mes en curso) o un mes anterior a consultar.
# Devuelve @{ Year=<int>; Month=<int> } (0/0 = ventana actual) o $null si se cancela.
function Show-ReportPeriodPicker {
  [xml]$px = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Periodo del reporte" Height="240" Width="430"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13"
        ResizeMode="NoResize">
  <Grid Margin="16">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Grid.Row="0" Text="Selecciona el periodo de actualizaciones a consultar:" Margin="0,0,0,12" TextWrapping="Wrap"/>
    <RadioButton x:Name="rbCurrent" Grid.Row="1" Content="Ventana actual (mes en curso)" IsChecked="True" Margin="0,0,0,8"/>
    <StackPanel Grid.Row="2" Orientation="Horizontal">
      <RadioButton x:Name="rbMonth" Content="Mes a consultar:" VerticalAlignment="Center" Margin="0,0,10,0"/>
      <ComboBox x:Name="cbMonth" Width="130" IsEnabled="False"/>
      <ComboBox x:Name="cbYear"  Width="90" Margin="8,0,0,0" IsEnabled="False"/>
    </StackPanel>
    <DockPanel Grid.Row="4" LastChildFill="False">
      <Button x:Name="btnCancel" Content="Cancelar" DockPanel.Dock="Right" Padding="14,7" Margin="8,0,0,0"/>
      <Button x:Name="btnOk"     Content="Generar"  DockPanel.Dock="Right" Padding="14,7"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $px
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $rbCurrent = $win.FindName('rbCurrent')
  $rbMonth   = $win.FindName('rbMonth')
  $cbMonth   = $win.FindName('cbMonth')
  $cbYear    = $win.FindName('cbYear')
  $btnOk     = $win.FindName('btnOk')
  $btnCancel = $win.FindName('btnCancel')

  $meses = @('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre')
  foreach ($m in $meses) { [void]$cbMonth.Items.Add($m) }
  $now = Get-Date
  for ($y = $now.Year; $y -ge $now.Year - 7; $y--) { [void]$cbYear.Items.Add("$y") }
  $cbMonth.SelectedIndex = $now.Month - 1
  $cbYear.SelectedIndex  = 0

  $rbMonth.Add_Checked({ $cbMonth.IsEnabled = $true; $cbYear.IsEnabled = $true })
  $rbMonth.Add_Unchecked({ $cbMonth.IsEnabled = $false; $cbYear.IsEnabled = $false })

  # Caja mutable: GetNewClosure NO escribe bien en $script: del .ps1 (queda siempre $null).
  $periodBox = @{ Result = $null }
  $btnOk.Add_Click({
    if ($rbMonth.IsChecked) {
      $periodBox.Result = @{ Year = [int]$cbYear.SelectedItem; Month = ($cbMonth.SelectedIndex + 1) }
    } else {
      $periodBox.Result = @{ Year = 0; Month = 0 }
    }
    $win.DialogResult = $true; $win.Close()
  }.GetNewClosure())
  $btnCancel.Add_Click({ $win.DialogResult = $false; $win.Close() }.GetNewClosure())

  $win.Owner = $Window
  $ok = $win.ShowDialog()
  if (-not $ok) { return $null }
  return $periodBox.Result
}

# Recolecta el reporte de TODOS los servidores de la grilla (en paralelo)
function Show-Report([int]$Year = 0, [int]$Month = 0) {
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
  $script:RepYear        = $Year
  $script:RepMonth       = $Month
  $script:RepExplicit    = ($Year -gt 0 -and $Month -gt 0)

  # Trabajo por servidor: copia el script de consulta, lo ejecuta y lee su JSON
  $rjob = {
    param($server, $psexec, $worker, $rel, $bag, $year, $month)
    $obj = $null
    try {
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\report.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\report.ps1" -Force -ErrorAction Stop
      $null = & $psexec "\\$server" -accepteula -nobanner -s `
                powershell.exe -ExecutionPolicy Bypass -NonInteractive `
                -File "C:\$rel\report.ps1" -Year $year -Month $month 2>&1
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
        AddArgument($script:RepBag).AddArgument($script:RepYear).AddArgument($script:RepMonth) | Out-Null
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

    try {
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
        $rr.Disk_Space                = "$($o.Disk_Space)"
        $rows.Add($rr)
      }
      Apply-ReportConfirmations $rows
      $periodLabel = if ($script:RepExplicit) { '{0:D4}-{1:D2}' -f $script:RepYear, $script:RepMonth } else { '' }

      $savedPath = Save-ReportCsv $rows $periodLabel
      Write-Log 'INFO' "Reporte generado para $($rows.Count) servidor(es) (periodo: $(if($periodLabel){$periodLabel}else{'actual'})). CSV: $savedPath"

      try {
        Save-History -Rows @($rows | ForEach-Object {
          [pscustomobject]@{ Servidor=$_.Servidor; IP=$_.IP; State='Report'
            Status='Reporte manual'; Error=$_.Descripcion_Error; RunningTime=$_.Running_Time }
        }) -Type 'ReporteManual'
      } catch { Write-Log 'WARN' "Historial (reporte): $($_.Exception.Message)" }

      Show-ReportWindow $rows $savedPath $true $periodLabel
    } catch {
      Write-Log 'ERROR' "Reporte: $($_.Exception.Message)"
      try {
        [System.Windows.MessageBox]::Show("Error al generar el reporte:`n$($_.Exception.Message)", 'WUU', 'OK', 'Error') | Out-Null
      } catch {}
    }
  }
}

#==============================================================================
#  FIX (.msu / .cab)
#==============================================================================

function Get-FixPackages {
  $dir = Join-Path $script:ScriptDir 'Fix'
  if (-not (Test-Path $dir)) { return @() }
  return @(Get-ChildItem -Path $dir -File -ErrorAction SilentlyContinue |
           Where-Object { $_.Extension -match '^\.(msu|cab)$' } | Sort-Object Name)
}

function Show-FixPackagePicker($packages) {
  # Resultado en $script:__fixPkg (FileInfo). Devuelve $true/$false (no el objeto).
  Add-Type -AssemblyName System.Windows.Forms | Out-Null
  Add-Type -AssemblyName System.Drawing | Out-Null

  $pkgArr = @($packages)
  $script:__fixPkg = $null

  $form = New-Object System.Windows.Forms.Form
  $form.Text = 'WUU - Elegir paquete Fix'
  $form.Size = New-Object System.Drawing.Size(560, 380)
  $form.StartPosition = 'CenterScreen'
  $form.MinimizeBox = $false
  $form.MaximizeBox = $false
  $form.FormBorderStyle = 'FixedDialog'
  $form.TopMost = $true
  $form.ShowInTaskbar = $false
  # Guardar rutas en Tag (no depende de variables del closure).
  $form.Tag = [string[]]@($pkgArr | ForEach-Object { $_.FullName })

  $lbl = New-Object System.Windows.Forms.Label
  $lbl.Text = 'Selecciona el paquete a instalar (.msu / .cab)'
  $lbl.Location = New-Object System.Drawing.Point(16, 14)
  $lbl.AutoSize = $true
  $form.Controls.Add($lbl)

  $lb = New-Object System.Windows.Forms.ListBox
  $lb.Name = 'lbPkg'
  $lb.Location = New-Object System.Drawing.Point(16, 40)
  $lb.Size = New-Object System.Drawing.Size(512, 250)
  foreach ($p in $pkgArr) { [void]$lb.Items.Add([string]$p.Name) }
  if ($lb.Items.Count -gt 0) { $lb.SelectedIndex = 0 }
  $form.Controls.Add($lb)

  $btnOk = New-Object System.Windows.Forms.Button
  $btnOk.Text = 'Continuar'
  $btnOk.Location = New-Object System.Drawing.Point(320, 300)
  $btnOk.Size = New-Object System.Drawing.Size(100, 30)
  $btnCancel = New-Object System.Windows.Forms.Button
  $btnCancel.Text = 'Cancelar'
  $btnCancel.Location = New-Object System.Drawing.Point(428, 300)
  $btnCancel.Size = New-Object System.Drawing.Size(100, 30)
  $form.Controls.Add($btnOk)
  $form.Controls.Add($btnCancel)

  $script:__fixPkgForm = $form
  $script:__fixPkgListBox = $lb
  $script:__fixPkgPaths = [string[]]$form.Tag

  $btnOk.Add_Click({
    try {
      $paths = [string[]]$script:__fixPkgPaths
      if (-not $paths -or $paths.Length -eq 0) {
        [System.Windows.Forms.MessageBox]::Show('No hay paquetes en Fix\.','WUU') | Out-Null
        return
      }
      $idx = 0
      if ($script:__fixPkgListBox -and $script:__fixPkgListBox.SelectedIndex -ge 0) {
        $idx = [int]$script:__fixPkgListBox.SelectedIndex
      }
      if ($idx -ge $paths.Length) { $idx = 0 }
      $path = $paths[$idx]
      if (-not (Test-Path -LiteralPath $path)) {
        [System.Windows.Forms.MessageBox]::Show("No se encuentra el paquete:`n$path",'WUU') | Out-Null
        return
      }
      $script:__fixPkg = Get-Item -LiteralPath $path
      Write-Log 'INFO' ("Fix: paquete elegido = {0}" -f $script:__fixPkg.Name)
      $script:__fixPkgForm.DialogResult = [System.Windows.Forms.DialogResult]::OK
    } catch {
      Write-Log 'ERROR' "Fix: error eligiendo paquete: $($_.Exception.Message)"
      [System.Windows.Forms.MessageBox]::Show("Error al elegir paquete:`n$($_.Exception.Message)",'WUU') | Out-Null
    }
  })
  $btnCancel.Add_Click({
    $script:__fixPkg = $null
    if ($script:__fixPkgForm) {
      $script:__fixPkgForm.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    }
  })

  $result = $form.ShowDialog()
  try { $form.Dispose() } catch { }
  $script:__fixPkgForm = $null
  $script:__fixPkgListBox = $null
  return ($result -eq [System.Windows.Forms.DialogResult]::OK -and $null -ne $script:__fixPkg)
}

function Show-FixServerPicker {
  # Resultado en $script:__fixServers ([string[]]). Devuelve $true/$false.
  # Asi evitamos el bug de PowerShell donde @(array) deja Count=1.
  Add-Type -AssemblyName System.Windows.Forms | Out-Null
  Add-Type -AssemblyName System.Drawing | Out-Null

  $script:__fixServers = [string[]]@()

  $form = New-Object System.Windows.Forms.Form
  $form.Text = 'WUU - Servidores Fix'
  $form.Size = New-Object System.Drawing.Size(440, 520)
  $form.StartPosition = 'CenterScreen'
  $form.MinimizeBox = $false
  $form.MaximizeBox = $false
  $form.FormBorderStyle = 'FixedDialog'
  $form.TopMost = $true
  $form.ShowInTaskbar = $false

  $lbl = New-Object System.Windows.Forms.Label
  $lbl.Text = 'Selecciona servidores destino'
  $lbl.Location = New-Object System.Drawing.Point(16, 14)
  $lbl.AutoSize = $true
  $form.Controls.Add($lbl)

  $chkAll = New-Object System.Windows.Forms.CheckBox
  $chkAll.Name = 'chkAll'
  $chkAll.Text = 'Seleccionar todos'
  $chkAll.Location = New-Object System.Drawing.Point(16, 40)
  $chkAll.AutoSize = $true
  $form.Controls.Add($chkAll)

  $clb = New-Object System.Windows.Forms.CheckedListBox
  $clb.Name = 'clbServers'
  $clb.Location = New-Object System.Drawing.Point(16, 68)
  $clb.Size = New-Object System.Drawing.Size(392, 360)
  $clb.CheckOnClick = $true
  $form.Controls.Add($clb)

  $selNames = @($script:Servers | Where-Object { $_.Sel } | ForEach-Object { $_.Servidor })
  $precheckAll = ($selNames.Count -eq 0)
  foreach ($s in @($script:Servers)) {
    $name = [string]$s.Servidor
    $mark = $precheckAll -or ($selNames -contains $name)
    [void]$clb.Items.Add($name, $mark)
  }
  $chkAll.Checked = ($clb.Items.Count -gt 0) -and (@($clb.CheckedItems).Count -eq $clb.Items.Count)

  $script:__fixSrvForm = $form
  $script:__fixSrvList = $clb
  $script:__fixSrvChkAll = $chkAll

  $chkAll.Add_CheckedChanged({
    $box = $script:__fixSrvList
    $all = $script:__fixSrvChkAll
    if (-not $box -or -not $all) { return }
    for ($i = 0; $i -lt $box.Items.Count; $i++) { $box.SetItemChecked($i, [bool]$all.Checked) }
  })

  $btnOk = New-Object System.Windows.Forms.Button
  $btnOk.Text = 'Continuar'
  $btnOk.Location = New-Object System.Drawing.Point(200, 440)
  $btnOk.Size = New-Object System.Drawing.Size(100, 30)
  $btnCancel = New-Object System.Windows.Forms.Button
  $btnCancel.Text = 'Cancelar'
  $btnCancel.Location = New-Object System.Drawing.Point(308, 440)
  $btnCancel.Size = New-Object System.Drawing.Size(100, 30)
  $form.Controls.Add($btnOk)
  $form.Controls.Add($btnCancel)

  $btnOk.Add_Click({
    try {
      $box = $script:__fixSrvList
      $picked = New-Object System.Collections.Generic.List[string]
      for ($i = 0; $i -lt $box.Items.Count; $i++) {
        if ($box.GetItemChecked($i)) { [void]$picked.Add([string]$box.Items[$i]) }
      }
      if ($picked.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show('Selecciona al menos un servidor.','WUU') | Out-Null
        return
      }
      $script:__fixServers = [string[]]$picked.ToArray()
      Write-Log 'INFO' ("Fix: servidores elegidos = {0}" -f $script:__fixServers.Length)
      $script:__fixSrvForm.DialogResult = [System.Windows.Forms.DialogResult]::OK
    } catch {
      [System.Windows.Forms.MessageBox]::Show("Error al continuar:`n$($_.Exception.Message)",'WUU') | Out-Null
    }
  })
  $btnCancel.Add_Click({
    $script:__fixServers = [string[]]@()
    if ($script:__fixSrvForm) {
      $script:__fixSrvForm.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    }
  })

  $result = $form.ShowDialog()
  try { $form.Dispose() } catch { }
  $script:__fixSrvForm = $null
  $script:__fixSrvList = $null
  $script:__fixSrvChkAll = $null
  return ($result -eq [System.Windows.Forms.DialogResult]::OK -and $script:__fixServers.Length -gt 0)
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

function Show-FixModePicker {
  # Devuelve 'copy' | 'install' | $null (cancelado).
  Add-Type -AssemblyName System.Windows.Forms | Out-Null
  Add-Type -AssemblyName System.Drawing | Out-Null

  $script:__fixMode = $null
  $form = New-Object System.Windows.Forms.Form
  $form.Text = 'WUU - Modo Fix'
  $form.Size = New-Object System.Drawing.Size(460, 220)
  $form.StartPosition = 'CenterScreen'
  $form.MinimizeBox = $false
  $form.MaximizeBox = $false
  $form.FormBorderStyle = 'FixedDialog'
  $form.TopMost = $true
  $form.ShowInTaskbar = $false

  $lbl = New-Object System.Windows.Forms.Label
  $lbl.Text = "Que desea hacer con el paquete seleccionado?`r`n`r`n" +
              "Solo copiar: deja el .msu/.cab en C:\Temp\ (si ya existe, lo indica y no vuelve a copiar).`r`n" +
              "Copiar e instalar: copia a C:\Temp\ (o usa el existente) e instala; reinicia si hace falta."
  $lbl.Location = New-Object System.Drawing.Point(16, 14)
  $lbl.Size = New-Object System.Drawing.Size(410, 90)
  $form.Controls.Add($lbl)

  $btnCopy = New-Object System.Windows.Forms.Button
  $btnCopy.Text = 'Solo copiar'
  $btnCopy.Location = New-Object System.Drawing.Point(16, 120)
  $btnCopy.Size = New-Object System.Drawing.Size(130, 36)
  $btnInstall = New-Object System.Windows.Forms.Button
  $btnInstall.Text = 'Copiar e instalar'
  $btnInstall.Location = New-Object System.Drawing.Point(156, 120)
  $btnInstall.Size = New-Object System.Drawing.Size(140, 36)
  $btnCancel = New-Object System.Windows.Forms.Button
  $btnCancel.Text = 'Cancelar'
  $btnCancel.Location = New-Object System.Drawing.Point(310, 120)
  $btnCancel.Size = New-Object System.Drawing.Size(110, 36)
  $form.Controls.Add($btnCopy)
  $form.Controls.Add($btnInstall)
  $form.Controls.Add($btnCancel)

  $script:__fixModeForm = $form
  $btnCopy.Add_Click({
    $script:__fixMode = 'copy'
    $script:__fixModeForm.DialogResult = [System.Windows.Forms.DialogResult]::OK
  })
  $btnInstall.Add_Click({
    $script:__fixMode = 'install'
    $script:__fixModeForm.DialogResult = [System.Windows.Forms.DialogResult]::OK
  })
  $btnCancel.Add_Click({
    $script:__fixMode = $null
    $script:__fixModeForm.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
  })

  $result = $form.ShowDialog()
  try { $form.Dispose() } catch { }
  $script:__fixModeForm = $null
  if ($result -eq [System.Windows.Forms.DialogResult]::OK -and $script:__fixMode) {
    return $script:__fixMode
  }
  return $null
}

function Start-FixJob($row, [string]$packagePath, [string]$packageName, [string]$Mode = 'install') {
  $server = $row.Servidor
  if ($script:FixJobs.ContainsKey($server) -or $script:Jobs.ContainsKey($server)) { return }

  $copyOnly = ($Mode -eq 'copy')
  $row.State = 'DownloadInstall'
  $row.Status = if ($copyOnly) { 'Fix: preparando copia...' } else { 'Fix: preparando...' }
  $row.Error = ''

  $sync = [hashtable]::Synchronized(@{
    done = $false
    transportError = ''
    copyOk = $false
    alreadyExists = $false
    phase = 'init'
  })
  $sw = [System.Diagnostics.Stopwatch]::StartNew()

  $fjob = {
    param($server, $psexec, $fixWorker, $rel, $pkgLocal, $pkgName, $sync, $copyOnly)
    try {
      # Ambos modos usan C:\Temp para el paquete
      $tempDir = "\\$server\C`$\Temp"
      $sync.phase = 'mkdir'
      New-Item -ItemType Directory -Path $tempDir -Force -ErrorAction Stop | Out-Null
      $dest = Join-Path $tempDir $pkgName

      if (Test-Path -LiteralPath $dest) {
        $sync.alreadyExists = $true
        $sync.copyOk = $true
        $sync.phase = 'exists'
      } else {
        $sync.phase = 'copy'
        Copy-Item -Path $pkgLocal -Destination $dest -Force -ErrorAction Stop
        if (-not (Test-Path -LiteralPath $dest)) { throw "Copia incompleta: no se ve $pkgName en C:\Temp" }
        $sync.alreadyExists = $false
        $sync.copyOk = $true
      }

      if ($copyOnly) { return }

      # Instalar desde C:\Temp via fix.ps1 (worker en carpeta WUU)
      $sync.phase = 'install'
      $wuuDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $wuuDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$wuuDir\fix.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $fixWorker -Destination "$wuuDir\fix.ps1" -Force -ErrorAction Stop
      $out = & $psexec "\\$server" -accepteula -nobanner -s `
                powershell.exe -ExecutionPolicy Bypass -NonInteractive `
                -File "C:\$rel\fix.ps1" -PackageName $pkgName 2>&1
      if ($LASTEXITCODE -ne 0) {
        $sync.transportError = "PsExec codigo $LASTEXITCODE. " + (($out | Select-Object -Last 3) -join ' ')
      }
    } catch {
      $sync.transportError = $_.Exception.Message
      $sync.copyOk = $false
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
      AddArgument($sync).AddArgument($copyOnly) | Out-Null
  $handle = $ps.BeginInvoke()

  $script:FixJobs[$server] = @{
    ps=$ps; handle=$handle; rs=$rs; sw=$sw; sync=$sync
    pkg=$packageName; mode=$Mode
  }
  $accion = if ($copyOnly) { 'copia' } else { 'copia+instalacion' }
  Write-Log 'INFO' "Fix iniciado ($accion): $server ($packageName)"
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
    $copyOnly = ($job.mode -eq 'copy')

    if (-not $job.sync.done) {
      $phase = [string]$job.sync.phase
      if ($phase -eq 'exists') {
        if ($copyOnly) {
          $row.Status = "Fix: el archivo ya existe en C:\Temp"
        } else {
          $row.Status = 'Fix: el archivo ya existe en el servidor. Instalando...'
        }
      } elseif ($copyOnly -or $phase -in @('copy','mkdir')) {
        $row.Status = "Fix: copiando $($job.pkg) a C:\Temp..."
      } else {
        if ($job.sync.alreadyExists) {
          $row.Status = 'Fix: el archivo ya existe en el servidor. Instalando...'
        } else {
          $row.Status = "Fix: instalando $($job.pkg)..."
        }
      }
      continue
    }

    if ($copyOnly) {
      if ($job.sync.copyOk -and -not $job.sync.transportError) {
        $row.State = 'Updated'
        $row.Error = ''
        if ($job.sync.alreadyExists) {
          $row.Status = "Fix: el archivo ya existe en C:\Temp\$($job.pkg)"
        } else {
          $row.Status = "Fix: copiado a C:\Temp\$($job.pkg)"
        }
      } else {
        $row.State = 'Unselected'
        $row.Status = 'Error al copiar a C:\Temp'
        $row.Error = if ($job.sync.transportError) { $job.sync.transportError } else { 'Copia fallida' }
        Write-Log 'ERROR' "Fix copia $server : $($row.Error)"
      }
    } else {
      $unc = "\\$server\C`$\$($script:RemoteRel)\fix.json"
      $fx = $null
      try {
        if (Test-Path $unc) {
          $raw = Get-Content -Path $unc -Raw -ErrorAction Stop
          if ($raw) { $fx = $raw | ConvertFrom-Json }
        }
      } catch {}

      if ($fx) {
        $code = [int]$fx.exitCode
        $prefix = if ($job.sync.alreadyExists) { 'El archivo ya existe en el servidor. ' } else { '' }
        if ($code -in @(0, 3010, 2359302)) {
          if ($fx.rebootRequired -or $code -eq 3010) {
            $row.State = 'RebootRequired'
            $row.Status = "${prefix}Fix instalado. Requiere reinicio"
            $row.Error = ''
            # Reinicio automatico tras Fix si lo requiere
            if (-not $script:AutoRebootPending.ContainsKey($server)) {
              $delay = 60
              try { $delay = [int]$script:Cfg.AutoReboot.DelaySeconds } catch { $delay = 60 }
              if ($delay -lt 5) { $delay = 5 }
              $script:AutoRebootPending[$server] = (Get-Date).AddSeconds($delay)
              $row.Status = "${prefix}Fix instalado. Reinicio automatico en ${delay}s..."
              Write-Log 'INFO' "Fix auto-reinicio programado: $server en ${delay}s"
              Start-AutoRebootTimer
            }
          } else {
            $row.State = 'Updated'
            $row.Status = "$prefix$($fx.message)"
            $row.Error = ''
          }
        } else {
          $row.State = 'Unselected'
          $row.Status = "$prefix$($fx.message)"
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
      "No hay paquetes .msu o .cab en la carpeta Fix\ junto a WUU.ps1.`n`nNota: Fix no instala .msi; solo .msu y .cab.",
      'WUU', 'OK', 'Information') | Out-Null
    return
  }

  # 1) Servidores → 2) Paquete → 3) Confirmacion
  # Los dialogos guardan el resultado en $script:__fixServers / $script:__fixPkg
  # (evita el bug de PowerShell donde @(arrayDe49) queda con Count=1).
  Write-Log 'INFO' ("Fix: {0} paquete(s) disponible(s) en Fix\" -f @($packages).Count)
  if (-not (Show-FixServerPicker)) {
    Write-Log 'INFO' 'Fix: seleccion de servidores cancelada.'
    return
  }
  $targets = [string[]]$script:__fixServers
  Write-Log 'INFO' ("Fix: targets listos = {0}" -f $targets.Length)
  if ($targets.Length -eq 0) { return }

  if (-not (Show-FixPackagePicker $packages)) {
    Write-Log 'INFO' 'Fix: seleccion de paquete cancelada.'
    [System.Windows.Forms.MessageBox]::Show(
      "No se selecciono ningun paquete Fix.`n`nSi pulsaste Continuar y ves este mensaje, copia el WUU.ps1 actualizado a Desktop\PatchControl y reinicia WUU.",
      'WUU Fix') | Out-Null
    return
  }
  $pkg = $script:__fixPkg
  $pkgName = [string]$pkg.Name
  $pkgPath = [string]$pkg.FullName
  if (-not $pkgPath -or -not (Test-Path -LiteralPath $pkgPath)) {
    [System.Windows.Forms.MessageBox]::Show(
      "No se pudo resolver la ruta del paquete seleccionado.`n$pkgName",
      'WUU Fix') | Out-Null
    Write-Log 'ERROR' "Fix: ruta invalida para $pkgName"
    return
  }

  # 3) Modo: Solo copiar | Copiar e instalar
  $mode = Show-FixModePicker
  if (-not $mode) {
    Write-Log 'INFO' 'Fix: modo cancelado.'
    return
  }

  # 4) Confirmacion WinForms (Sí/No).
  $preview = ($targets | Select-Object -First 15) -join ', '
  if ($targets.Length -gt 15) { $preview += ", ... (+$($targets.Length - 15))" }
  $accionTxt = if ($mode -eq 'copy') { 'SOLO COPIAR' } else { 'COPIAR E INSTALAR' }
  $msg = "$accionTxt`r`n`r`nPaquete: $pkgName`r`nServidores: $($targets.Length)`r`n`r`n$preview"
  $resp = [System.Windows.Forms.MessageBox]::Show(
    $msg,
    'WUU - Confirmar Fix',
    [System.Windows.Forms.MessageBoxButtons]::YesNo,
    [System.Windows.Forms.MessageBoxIcon]::Warning
  )
  if ($resp -ne [System.Windows.Forms.DialogResult]::Yes) {
    Write-Log 'INFO' 'Fix: confirmacion cancelada.'
    return
  }

  Write-Log 'INFO' "Fix ($mode): $pkgName en $($targets.Length) servidor(es)"
  $started = 0
  foreach ($name in $targets) {
    $row = Get-Row $name
    if ($row) {
      Start-FixJob $row $pkgPath $pkgName $mode
      if ($script:FixJobs.ContainsKey($name)) { $started++ }
    }
  }
  if ($started -eq 0) {
    [System.Windows.Forms.MessageBox]::Show(
      'No se pudo iniciar Fix en ningun servidor (puede haber jobs activos).',
      'WUU Fix') | Out-Null
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

      if ($script:PatchAfterCacheClear.ContainsKey($server)) {
        $script:PatchAfterCacheClear.Remove($server)
        $monResult = "$($sync.result)"
        if ($row -and $monResult -notin @('timeout', 'error')) {
          Write-Log 'INFO' "Post-limpieza cache: iniciando parcheo en $server"
          $row.Status = 'Iniciando parcheo tras limpieza de cache...'
          $row.Error = ''
          Start-ServerJob $row 'Install'
        } elseif ($row) {
          Write-Log 'WARN' "Post-limpieza cache: no se inicia parcheo en $server (monitor: $monResult)"
        }
      }
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
    if ($script:PatchAfterCacheClear.ContainsKey($server)) {
      $script:PatchAfterCacheClear.Remove($server)
    }
  }
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
          Grupo=$_.Grupo; Dominio=$_.Dominio; OS=$_.OS; Ambiente=$_.Ambiente
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
        Grupo        = $_.Grupo
        Dominio      = $_.Dominio
        OS           = $_.OS
        Ambiente     = $_.Ambiente
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

function Get-TaskStatus([string]$TaskName = '') {
  try {
    if (-not $TaskName) {
      $ui = $script:SchedUi
      if ($ui -and $ui.txtName) { $TaskName = "$($ui.txtName.Text)".Trim() }
    }
    if (-not $TaskName) {
      Ensure-ConfigSection 'ScheduledReport'
      $TaskName = "$($script:Cfg.ScheduledReport.TaskName)"
    }
    if (-not $TaskName) { return 'NoExiste' }
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

function Assert-ScheduledTaskName([string]$Name) {
  $n = "$Name".Trim()
  if (-not $n) { throw 'Ingresa un nombre para la tarea.' }
  if ($n -match '[\\/:*?"<>|]') {
    throw 'El nombre de la tarea no puede contener: \ / : * ? " < > |'
  }
  return $n
}

function New-WuuScheduledTaskAction {
  param(
    [Parameter(Mandatory)][string]$ScriptPath,
    [Parameter(Mandatory)][ValidateSet('-Scheduled','-ScheduledPatch')][string]$ModeSwitch
  )
  $path = "$ScriptPath".Trim()
  if (-not $path) { throw 'No se pudo resolver la ruta de WUU.ps1.' }
  if (-not (Test-Path -LiteralPath $path)) { throw "No existe el script: $path" }
  if ($path.Contains("'")) {
    throw "La ruta del script no puede contener comillas simples: $path"
  }
  $psExe = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
  $workDir = [System.IO.Path]::GetDirectoryName($path)
  # Comillas simples alrededor de -File: evita HRESULT 0x8007007b de Task Scheduler
  # con rutas entrecomilladas con " (path con espacios / Desktop, etc.).
  $arg = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File '$path' $ModeSwitch"
  return New-ScheduledTaskAction -Execute $psExe -Argument $arg -WorkingDirectory $workDir
}

function Save-WuuConfig {
  $cfgPath = Join-Path $script:ScriptDir 'config.json'
  $script:Cfg | ConvertTo-Json -Depth 5 | Set-Content -Path $cfgPath -Encoding UTF8
}

function Set-ScheduledReportConfig {
  param(
    [string]$TaskName,
    [int]$Hour,
    [int]$Minute,
    [string]$StartDate,
    [bool]$Enabled,
    [ValidateSet('current','previous','specific')]$PeriodMode = 'current',
    [int]$Year = 0,
    [int]$Month = 0
  )
  # Corre en scope del script (no en GetNewClosure): evita "Cannot index into a null array".
  Ensure-ConfigSection 'ScheduledReport'
  $sr = $script:Cfg['ScheduledReport']
  $sr['TaskName']   = $TaskName
  $sr['Hour']       = $Hour
  $sr['Minute']     = $Minute
  $sr['StartDate']  = $StartDate
  $sr['Enabled']    = $Enabled
  $sr['PeriodMode'] = $PeriodMode
  $sr['Year']       = $Year
  $sr['Month']      = $Month
  $script:Cfg['ScheduledReport'] = $sr
  Save-WuuConfig
}

function Set-ScheduledReportEnabled([bool]$Enabled) {
  Ensure-ConfigSection 'ScheduledReport'
  $script:Cfg['ScheduledReport']['Enabled'] = $Enabled
  Save-WuuConfig
}

function Set-ScheduledPatchConfig {
  param(
    [string]$TaskName,
    [int]$Hour,
    [int]$Minute,
    [string]$StartDate,
    [bool]$Enabled,
    [string[]]$Groups = @(),
    [string[]]$Servers = @()
  )
  Ensure-ConfigSection 'ScheduledPatch'
  $sp = $script:Cfg['ScheduledPatch']
  $sp['TaskName']  = $TaskName
  $sp['Hour']      = $Hour
  $sp['Minute']    = $Minute
  $sp['StartDate'] = $StartDate
  $sp['Enabled']   = $Enabled
  $sp['Groups']    = @($Groups | ForEach-Object { "$_".Trim() } | Where-Object { $_ })
  $sp['Servers']   = @($Servers | ForEach-Object { "$_".Trim() } | Where-Object { $_ } | Select-Object -Unique)
  $script:Cfg['ScheduledPatch'] = $sp
  Save-WuuConfig
}

function Set-ScheduledPatchEnabled([bool]$Enabled) {
  Ensure-ConfigSection 'ScheduledPatch'
  $script:Cfg['ScheduledPatch']['Enabled'] = $Enabled
  Save-WuuConfig
}

# Resuelve @{ Year; Month } para el reporte programado segun PeriodMode.
#   current  -> 0/0 (el worker usa el mes en curso)
#   previous -> mes anterior relativo a hoy
#   specific -> Year/Month configurados
function Resolve-ScheduledPeriod {
  Ensure-ConfigSection 'ScheduledReport'
  $sr = $script:Cfg.ScheduledReport
  $mode = "$($sr.PeriodMode)".Trim().ToLower()
  if ($mode -eq 'previous') {
    $d = (Get-Date).AddMonths(-1)
    return @{ Year = $d.Year; Month = $d.Month }
  }
  if ($mode -eq 'specific') {
    $y = [int]$sr.Year; $m = [int]$sr.Month
    if ($y -gt 0 -and $m -ge 1 -and $m -le 12) { return @{ Year = $y; Month = $m } }
  }
  return @{ Year = 0; Month = 0 }
}

function Update-SchedulerStateLabel {
  $ui = $script:SchedUi
  if (-not $ui -or -not $ui.lblState) { return }
  $name = if ($ui.txtName) { "$($ui.txtName.Text)".Trim() } else { '' }
  $st = Get-TaskStatus $name
  $ui.lblState.Text = $st
  $ui.lblState.Foreground = if ($st -eq 'NoExiste') { [System.Windows.Media.Brushes]::Gray }
                            elseif ($st -eq 'Ready') { [System.Windows.Media.Brushes]::Green }
                            else { [System.Windows.Media.Brushes]::DarkOrange }
}

function Update-SchedulerModeUi {
  $ui = $script:SchedUi
  if (-not $ui) { return }
  $isPatch = [bool]$ui.rbPatch.IsChecked
  $ui.pnlReport.Visibility = if ($isPatch) { [System.Windows.Visibility]::Collapsed } else { [System.Windows.Visibility]::Visible }
  $ui.pnlPatch.Visibility  = if ($isPatch) { [System.Windows.Visibility]::Visible } else { [System.Windows.Visibility]::Collapsed }
  $ui.lblTitle.Text = if ($isPatch) { 'Configuracion de ventana de actualizaciones' } else { 'Configuracion del reporte automatico' }
  $ui.lblCoverage.Text = if ($isPatch) { 'Grupos y/o servidores especificos abajo' } else { 'Todos los grupos del CSV' }

  Ensure-ConfigSection 'ScheduledReport'
  Ensure-ConfigSection 'ScheduledPatch'
  $src = if ($isPatch) { $script:Cfg['ScheduledPatch'] } else { $script:Cfg['ScheduledReport'] }
  $ui.txtName.Text = "$($src['TaskName'])"
  $ui.txtHour.Text = "$($src['Hour'])"
  $ui.txtMin.Text  = "{0:00}" -f [int]$src['Minute']
  $savedDate = "$($src['StartDate'])".Trim()
  $ui.txtDate.Text = if ($savedDate) { $savedDate } else { (Get-Date).ToString('dd/MM/yyyy') }
  Update-SchedulerStateLabel
}

function Get-SchedulerSelectedGroups {
  $ui = $script:SchedUi
  $out = @()
  if (-not $ui -or -not $ui.spGroups) { return $out }
  foreach ($child in @($ui.spGroups.Children)) {
    if ($child -is [System.Windows.Controls.CheckBox] -and $child.IsChecked) {
      $n = "$($child.Tag)".Trim()
      if ($n) { $out += $n }
    }
  }
  return $out
}

function Get-SchedulerSelectedServers {
  $ui = $script:SchedUi
  if (-not $ui -or -not $ui.SelectedServers) { return @() }
  return @($ui.SelectedServers | ForEach-Object { "$_".Trim() } | Where-Object { $_ } | Select-Object -Unique)
}

function Refresh-SchedulerSelectedServersUi {
  $ui = $script:SchedUi
  if (-not $ui -or -not $ui.spSchedServers) { return }
  $ui.spSchedServers.Children.Clear()
  $list = @(Get-SchedulerSelectedServers)
  if ($list.Count -eq 0) {
    $tb = New-Object System.Windows.Controls.TextBlock
    $tb.Text = '(Ningun servidor especifico. Usa la busqueda o marca grupos.)'
    $tb.Foreground = [System.Windows.Media.Brushes]::Gray
    $tb.Margin = '0,2,0,2'
    $tb.TextWrapping = 'Wrap'
    [void]$ui.spSchedServers.Children.Add($tb)
    return
  }
  foreach ($name in $list) {
    $row = New-Object System.Windows.Controls.DockPanel
    $row.LastChildFill = $true
    $row.Margin = '0,2,0,2'
    $btn = New-Object System.Windows.Controls.Button
    $btn.Content = 'Quitar'
    $btn.Padding = '8,2'
    $btn.Margin = '8,0,0,0'
    $btn.Tag = $name
    [System.Windows.Controls.DockPanel]::SetDock($btn, 'Right')
    $btn.Add_Click({
      param($sender, $e)
      $n = "$($sender.Tag)".Trim()
      if ($script:SchedUi -and $script:SchedUi.SelectedServers) {
        $script:SchedUi.SelectedServers = [System.Collections.ArrayList]@(
          $script:SchedUi.SelectedServers | Where-Object { "$_".Trim() -ne $n }
        )
      }
      if ($script:CmdSchedulerRefreshServers) { & $script:CmdSchedulerRefreshServers }
      else { Refresh-SchedulerSelectedServersUi }
    })
    $tb = New-Object System.Windows.Controls.TextBlock
    $csvRow = $null
    if ($script:Csv) {
      $csvRow = @($script:Csv | Where-Object { "$($_.Servidor)".Trim() -eq $name } | Select-Object -First 1)[0]
    }
    $sub = if ($csvRow) {
      (@("$($csvRow.IP)", "$($csvRow.Grupo)", "$($csvRow.Ambiente)") | Where-Object { "$_".Trim() }) -join ' | '
    } else { '' }
    $tb.Text = if ($sub) { "$name  ($sub)" } else { $name }
    $tb.VerticalAlignment = 'Center'
    $tb.TextWrapping = 'Wrap'
    [void]$row.Children.Add($btn)
    [void]$row.Children.Add($tb)
    [void]$ui.spSchedServers.Children.Add($row)
  }
}

function Add-SchedulerServer([string]$ServerName) {
  $name = "$ServerName".Trim()
  if (-not $name) { return }
  $ui = $script:SchedUi
  if (-not $ui) { return }
  if (-not $ui.SelectedServers) { $ui.SelectedServers = [System.Collections.ArrayList]@() }
  $exists = @($ui.SelectedServers | Where-Object { "$_".Trim() -eq $name }).Count -gt 0
  if (-not $exists) { [void]$ui.SelectedServers.Add($name) }
  Refresh-SchedulerSelectedServersUi
  if ($ui.txtSchedSearch) { $ui.txtSchedSearch.Text = '' }
  if ($ui.lbSchedResults) {
    $ui.lbSchedResults.ItemsSource = $null
    $ui.lbSchedResults.Visibility = [System.Windows.Visibility]::Collapsed
  }
}

function Do-SchedulerSearch {
  $ui = $script:SchedUi
  if (-not $ui -or -not $ui.txtSchedSearch -or -not $ui.lbSchedResults) { return }
  $text = "$($ui.txtSchedSearch.Text)".Trim()
  if ($text.Length -lt 2) {
    $ui.lbSchedResults.ItemsSource = $null
    $ui.lbSchedResults.Visibility = [System.Windows.Visibility]::Collapsed
    return
  }
  if ($script:Csv.Count -eq 0) { try { Load-Csv } catch {} }
  $matches = @($script:Csv | Where-Object {
    $_.Servidor -like "*$text*" -or $_.IP -like "*$text*"
  } | Select-Object -First 12)
  if ($matches.Count -eq 0) {
    $ui.lbSchedResults.ItemsSource = $null
    $ui.lbSchedResults.Visibility = [System.Windows.Visibility]::Collapsed
    if ($ui.lblMsg) {
      $ui.lblMsg.Foreground = [System.Windows.Media.Brushes]::DarkOrange
      $ui.lblMsg.Text = "Sin coincidencias para '$text' en el inventario CSV."
    }
    return
  }
  $items = New-Object System.Collections.ObjectModel.ObservableCollection[object]
  $selected = @(Get-SchedulerSelectedServers)
  foreach ($r in $matches) {
    $name = "$($r.Servidor)".Trim()
    $item = New-Object SearchResultItem
    $item.Display = $name
    $already = $selected -contains $name
    $item.Sub = ("$($r.IP)" + $(if ($r.Grupo) { " | $($r.Grupo)" } else { '' }) +
                 $(if ($r.Ambiente) { " | $($r.Ambiente)" } else { '' }) +
                 $(if ($already) { '  [ya agregado]' } else { '' }))
    $item.Tag = $r
    $items.Add($item)
  }
  $ui.lbSchedResults.ItemsSource = $items
  $ui.lbSchedResults.Visibility = [System.Windows.Visibility]::Visible
}

function Invoke-SchedulerCreate {
  $ui = $script:SchedUi
  if (-not $ui) { return }
  $lblMsg = $ui.lblMsg
  $h = 0; $m = 0
  [void][int]::TryParse("$($ui.txtHour.Text)".Trim(), [ref]$h)
  [void][int]::TryParse("$($ui.txtMin.Text)".Trim(), [ref]$m)
  $dateText = "$($ui.txtDate.Text)".Trim()
  $isPatch = [bool]$ui.rbPatch.IsChecked
  if ($h -lt 0 -or $h -gt 23 -or $m -lt 0 -or $m -gt 59) {
    $lblMsg.Foreground=[System.Windows.Media.Brushes]::Red; $lblMsg.Text='Hora invalida (HH 0-23, MM 0-59).'; return
  }
  try {
    $name = Assert-ScheduledTaskName "$($ui.txtName.Text)"
    $startAt = Parse-ScheduledDateDMY $dateText $h $m
    if ($startAt -lt (Get-Date).Date) { throw 'La fecha de inicio no puede ser anterior a hoy.' }
    $scriptPath = "$($ui.ScriptPath)".Trim()
    if (-not $scriptPath) { $scriptPath = "$PSCommandPath".Trim() }

    if ($isPatch) {
      $groups  = @(Get-SchedulerSelectedGroups)
      $servers = @(Get-SchedulerSelectedServers)
      if ($groups.Count -eq 0 -and $servers.Count -eq 0) {
        throw 'Selecciona al menos un grupo o agrega un servidor especifico con la busqueda.'
      }
      $trigger = New-ScheduledTaskTrigger -Once -At $startAt
      $action  = New-WuuScheduledTaskAction -ScriptPath $scriptPath -ModeSwitch '-ScheduledPatch'
      $limitH = [Math]::Max(2, [int]([Math]::Ceiling([double]$script:Cfg.PatchTimeoutMinutes / 60.0)) + 2)
      $set = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours $limitH) -StartWhenAvailable
      Register-ScheduledTask -TaskName $name -Trigger $trigger -Action $action `
        -Settings $set -RunLevel Highest -Force -ErrorAction Stop | Out-Null
      Set-ScheduledPatchConfig -TaskName $name -Hour $h -Minute $m `
        -StartDate (Format-ScheduledDateDMY $startAt) -Enabled $true -Groups $groups -Servers $servers
      $lblMsg.Foreground=[System.Windows.Media.Brushes]::Green
      $dateLabel = Format-ScheduledDateDMY $startAt
      $covParts = @()
      if ($groups.Count)  { $covParts += "Grupos: $($groups -join ', ')" }
      if ($servers.Count) { $covParts += "Servidores: $($servers -join ', ')" }
      $lblMsg.Text = "Ventana '$name' programada (unica vez): $dateLabel a ${h}:$("{0:00}" -f $m). $($covParts -join ' | '). Actualiza la fecha mensualmente."
      Write-Log 'INFO' "Tarea ventana (Once) creada: $name @ $dateLabel ${h}:$("{0:00}" -f $m) groups=$($groups -join ',') servers=$($servers -join ',')"
    } else {
      $trigger = New-ScheduledTaskTrigger -Daily -At $startAt
      $action  = New-WuuScheduledTaskAction -ScriptPath $scriptPath -ModeSwitch '-Scheduled'
      $set     = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 2) -StartWhenAvailable
      Register-ScheduledTask -TaskName $name -Trigger $trigger -Action $action `
        -Settings $set -RunLevel Highest -Force -ErrorAction Stop | Out-Null
      $periodModes = @('current','previous','specific')
      $pIdx = [int]$ui.cbPeriod.SelectedIndex
      if ($pIdx -lt 0 -or $pIdx -gt 2) { $pIdx = 0 }
      $periodMode = $periodModes[$pIdx]
      $yearOut = 0; $monthOut = 0
      if ($pIdx -eq 2) {
        $yearOut = if ($null -ne $ui.cbYear.SelectedItem) { [int]$ui.cbYear.SelectedItem } else { (Get-Date).Year }
        $monthOut = if ($ui.cbMonth.SelectedIndex -ge 0) { $ui.cbMonth.SelectedIndex + 1 } else { (Get-Date).Month }
      }
      Set-ScheduledReportConfig -TaskName $name -Hour $h -Minute $m `
        -StartDate (Format-ScheduledDateDMY $startAt) -Enabled $true `
        -PeriodMode $periodMode -Year $yearOut -Month $monthOut
      $lblMsg.Foreground=[System.Windows.Media.Brushes]::Green
      $dateLabel = Format-ScheduledDateDMY $startAt
      $lblMsg.Text = "Tarea '$name' creada/actualizada. Primera ejecucion: $dateLabel a ${h}:$("{0:00}" -f $m). Luego diariamente."
      Write-Log 'INFO' "Tarea reporte creada: $name @ $dateLabel ${h}:$("{0:00}" -f $m)"
    }
    Update-SchedulerStateLabel
  } catch {
    $lblMsg.Foreground=[System.Windows.Media.Brushes]::Red
    $lblMsg.Text="Error: $($_.Exception.Message)"
    Write-Log 'ERROR' "Programar tarea: $($_.Exception.Message)"
  }
}

function Invoke-SchedulerDelete {
  $ui = $script:SchedUi
  if (-not $ui) { return }
  $lblMsg = $ui.lblMsg
  $name = "$($ui.txtName.Text)".Trim()
  $isPatch = [bool]$ui.rbPatch.IsChecked
  try {
    Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction Stop
    if ($isPatch) { Set-ScheduledPatchEnabled $false } else { Set-ScheduledReportEnabled $false }
    $lblMsg.Foreground=[System.Windows.Media.Brushes]::DarkOrange
    $lblMsg.Text = "Tarea '$name' eliminada."
    Write-Log 'INFO' "Tarea programada eliminada: $name"
    Update-SchedulerStateLabel
  } catch {
    $lblMsg.Foreground=[System.Windows.Media.Brushes]::Red
    $lblMsg.Text="Error: $($_.Exception.Message)"
  }
}

function Show-SchedulerWindow {
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Programar" Height="720" Width="540"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <ScrollViewer VerticalScrollBarVisibility="Auto">
  <StackPanel Margin="20">
    <TextBlock x:Name="lblTitle" Text="Configuracion del reporte automatico" FontSize="15" FontWeight="SemiBold" Margin="0,0,0,12"/>
    <StackPanel Orientation="Horizontal" Margin="0,0,0,12">
      <RadioButton x:Name="rbReport" Content="Reporte automatico" IsChecked="True" Margin="0,0,16,0"/>
      <RadioButton x:Name="rbPatch"  Content="Ventana de actualizaciones"/>
    </StackPanel>
    <Grid Margin="0,0,0,10">
      <Grid.ColumnDefinitions><ColumnDefinition Width="160"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/>
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
      <TextBlock Grid.Row="3" Grid.Column="0" Text="Fecha de inicio:" VerticalAlignment="Center" Margin="0,6"/>
      <TextBox  x:Name="txtDate" Grid.Row="3" Grid.Column="1" Padding="4,3" Margin="0,4" ToolTip="Formato: dd/mm/aaaa (vacio = hoy)"/>
      <TextBlock Grid.Row="4" Grid.Column="0" Text="Script WUU.ps1:" VerticalAlignment="Center" Margin="0,6"/>
      <TextBlock x:Name="lblScript" Grid.Row="4" Grid.Column="1" Text="-" VerticalAlignment="Center" Margin="0,6"
                 TextTrimming="CharacterEllipsis" ToolTip="-"/>
      <TextBlock Grid.Row="5" Grid.Column="0" Text="Cobertura:" VerticalAlignment="Center" Margin="0,6"/>
      <TextBlock x:Name="lblCoverage" Grid.Row="5" Grid.Column="1" Text="Todos los grupos del CSV" VerticalAlignment="Center"
                 Margin="0,6" Foreground="#FF475569"/>
    </Grid>
    <StackPanel x:Name="pnlReport" Margin="0,4,0,0">
      <StackPanel Orientation="Horizontal">
        <TextBlock Text="Periodo del reporte:" Width="160" VerticalAlignment="Center"/>
        <ComboBox x:Name="cbPeriod" Width="140"/>
        <ComboBox x:Name="cbMonth"  Width="110" Margin="8,0,0,0" IsEnabled="False"/>
        <ComboBox x:Name="cbYear"   Width="75"  Margin="8,0,0,0" IsEnabled="False"/>
      </StackPanel>
    </StackPanel>
    <StackPanel x:Name="pnlPatch" Visibility="Collapsed" Margin="0,4,0,0">
      <TextBlock Text="Ejecucion unica (no recurrente). Actualiza la fecha mensualmente." Foreground="#FF7C3AED" Margin="0,0,0,8" TextWrapping="Wrap"/>
      <TextBlock Text="Grupos a parchear:" FontWeight="SemiBold" Margin="0,0,0,4"/>
      <Border BorderBrush="#FFE2E8F0" BorderThickness="1" Background="White" MaxHeight="120" CornerRadius="4">
        <ScrollViewer VerticalScrollBarVisibility="Auto">
          <StackPanel x:Name="spGroups" Margin="8"/>
        </ScrollViewer>
      </Border>
      <TextBlock Text="Servidores especificos (opcional):" FontWeight="SemiBold" Margin="0,12,0,4"/>
      <TextBlock Text="Busca por nombre o IP (min. 2 caracteres) y haz doble clic o Enter para agregar." Foreground="#FF64748B" Margin="0,0,0,4" TextWrapping="Wrap"/>
      <TextBox x:Name="txtSchedSearch" Padding="4,3" Margin="0,0,0,4"/>
      <ListBox x:Name="lbSchedResults" Visibility="Collapsed" MaxHeight="120" Margin="0,0,0,6"
               BorderBrush="#FFE2E8F0" Background="White">
        <ListBox.ItemTemplate>
          <DataTemplate>
            <StackPanel Margin="2">
              <TextBlock Text="{Binding Display}" FontWeight="SemiBold"/>
              <TextBlock Text="{Binding Sub}" Foreground="#FF64748B" FontSize="11"/>
            </StackPanel>
          </DataTemplate>
        </ListBox.ItemTemplate>
      </ListBox>
      <Border BorderBrush="#FFE2E8F0" BorderThickness="1" Background="White" MaxHeight="120" CornerRadius="4">
        <ScrollViewer VerticalScrollBarVisibility="Auto">
          <StackPanel x:Name="spSchedServers" Margin="8"/>
        </ScrollViewer>
      </Border>
    </StackPanel>
    <Separator Margin="0,10,0,6"/>
    <DockPanel Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnCreate" Content="Crear / Actualizar tarea" Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnDelete" Content="Eliminar tarea"           Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnClose2" Content="Cerrar"                   Padding="14,7" DockPanel.Dock="Right"/>
    </DockPanel>
    <TextBlock x:Name="lblMsg" Text="" Margin="0,12,0,0" TextWrapping="Wrap"/>
  </StackPanel>
  </ScrollViewer>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $sx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  Ensure-ConfigSection 'ScheduledReport'
  Ensure-ConfigSection 'ScheduledPatch'
  if ($script:Csv.Count -eq 0) { try { Load-Csv } catch {} }

  $txtName  = $win.FindName('txtName')
  $txtHour  = $win.FindName('txtHour')
  $txtMin   = $win.FindName('txtMin')
  $txtDate  = $win.FindName('txtDate')
  $lblScript= $win.FindName('lblScript'); $lblScript.Text = $PSCommandPath; $lblScript.ToolTip = $PSCommandPath
  $lblState = $win.FindName('lblState')
  $lblMsg   = $win.FindName('lblMsg')
  $lblTitle = $win.FindName('lblTitle')
  $lblCoverage = $win.FindName('lblCoverage')
  $rbReport = $win.FindName('rbReport')
  $rbPatch  = $win.FindName('rbPatch')
  $pnlReport = $win.FindName('pnlReport')
  $pnlPatch  = $win.FindName('pnlPatch')
  $spGroups  = $win.FindName('spGroups')
  $txtSchedSearch = $win.FindName('txtSchedSearch')
  $lbSchedResults = $win.FindName('lbSchedResults')
  $spSchedServers = $win.FindName('spSchedServers')

  $cbPeriod = $win.FindName('cbPeriod')
  $cbMonth  = $win.FindName('cbMonth')
  $cbYear   = $win.FindName('cbYear')
  foreach ($p in @('Mes en curso','Mes anterior','Mes especifico')) { [void]$cbPeriod.Items.Add($p) }
  $mesesSched = @('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre')
  foreach ($mm in $mesesSched) { [void]$cbMonth.Items.Add($mm) }
  $nowSched = Get-Date
  for ($yy = $nowSched.Year; $yy -ge $nowSched.Year - 7; $yy--) { [void]$cbYear.Items.Add("$yy") }
  $sr0 = $script:Cfg['ScheduledReport']
  $savedMode = "$($sr0['PeriodMode'])".Trim().ToLower()
  $cbPeriod.SelectedIndex = switch ($savedMode) { 'previous' { 1 } 'specific' { 2 } default { 0 } }
  $cfgMonth = [int]$sr0['Month']
  $cfgYear  = [int]$sr0['Year']
  $cbMonth.SelectedIndex = if ($cfgMonth -ge 1 -and $cfgMonth -le 12) { $cfgMonth - 1 } else { $nowSched.Month - 1 }
  $cbYear.SelectedIndex  = if ($cfgYear -gt 0 -and $cbYear.Items.Contains("$cfgYear")) { $cbYear.Items.IndexOf("$cfgYear") } else { 0 }

  $savedGroups = @($script:Cfg['ScheduledPatch']['Groups'] | ForEach-Object { "$_".Trim() } | Where-Object { $_ })
  $savedServers = @($script:Cfg['ScheduledPatch']['Servers'] | ForEach-Object { "$_".Trim() } | Where-Object { $_ } | Select-Object -Unique)
  $groupNames = @($script:Groups | ForEach-Object { $_.Name })
  if ($groupNames.Count -eq 0 -and $script:Csv.Count -gt 0) {
    $groupNames = @($script:Csv | Select-Object -ExpandProperty Grupo -Unique | Where-Object { "$_".Trim() } | Sort-Object)
  }
  foreach ($gn in $groupNames) {
    $cb = New-Object System.Windows.Controls.CheckBox
    $cb.Content = $gn
    $cb.Tag = $gn
    $cb.Margin = '0,2,0,2'
    if ($savedGroups -contains $gn) { $cb.IsChecked = $true }
    [void]$spGroups.Children.Add($cb)
  }

  $script:SchedUi = @{
    txtName     = $txtName
    txtHour     = $txtHour
    txtMin      = $txtMin
    txtDate     = $txtDate
    cbPeriod    = $cbPeriod
    cbMonth     = $cbMonth
    cbYear      = $cbYear
    lblState    = $lblState
    lblMsg      = $lblMsg
    lblTitle    = $lblTitle
    lblCoverage = $lblCoverage
    rbReport    = $rbReport
    rbPatch     = $rbPatch
    pnlReport   = $pnlReport
    pnlPatch    = $pnlPatch
    spGroups    = $spGroups
    txtSchedSearch = $txtSchedSearch
    lbSchedResults = $lbSchedResults
    spSchedServers = $spSchedServers
    SelectedServers = [System.Collections.ArrayList]@($savedServers)
    ScriptPath  = $PSCommandPath
  }
  Refresh-SchedulerSelectedServersUi

  $script:CmdSchedulerSearch = Get-Command Do-SchedulerSearch -CommandType Function
  $script:CmdSchedulerAddServer = Get-Command Add-SchedulerServer -CommandType Function
  $script:CmdSchedulerRefreshServers = Get-Command Refresh-SchedulerSelectedServersUi -CommandType Function
  $txtSchedSearch.Add_TextChanged({ & $script:CmdSchedulerSearch })
  $txtSchedSearch.Add_KeyDown({
    param($sender, $e)
    if ($e.Key -eq 'Return' -or $e.Key -eq 'Enter') {
      $ui = $script:SchedUi
      if ($ui -and $ui.lbSchedResults -and $ui.lbSchedResults.SelectedItem) {
        $tag = $ui.lbSchedResults.SelectedItem.Tag
        if ($tag) { & $script:CmdSchedulerAddServer "$($tag.Servidor)" }
      } elseif ($ui -and $ui.lbSchedResults -and $ui.lbSchedResults.Items.Count -gt 0) {
        $first = $ui.lbSchedResults.Items[0]
        if ($first -and $first.Tag) { & $script:CmdSchedulerAddServer "$($first.Tag.Servidor)" }
      }
      $e.Handled = $true
    }
  })
  $lbSchedResults.Add_MouseDoubleClick({
    $ui = $script:SchedUi
    if (-not $ui -or -not $ui.lbSchedResults -or -not $ui.lbSchedResults.SelectedItem) { return }
    $tag = $ui.lbSchedResults.SelectedItem.Tag
    if ($tag) { & $script:CmdSchedulerAddServer "$($tag.Servidor)" }
  })

  $cbPeriod.Add_SelectionChanged({
    $ui = $script:SchedUi
    if (-not $ui) { return }
    $spec = ($ui.cbPeriod.SelectedIndex -eq 2)
    $ui.cbMonth.IsEnabled = $spec
    $ui.cbYear.IsEnabled  = $spec
  })
  $spec0 = ($cbPeriod.SelectedIndex -eq 2)
  $cbMonth.IsEnabled = $spec0; $cbYear.IsEnabled = $spec0

  $script:CmdSchedulerMode = Get-Command Update-SchedulerModeUi -CommandType Function
  $rbReport.Add_Checked({ & $script:CmdSchedulerMode })
  $rbPatch.Add_Checked({ & $script:CmdSchedulerMode })
  Update-SchedulerModeUi

  $script:CmdSchedulerCreate = Get-Command Invoke-SchedulerCreate -CommandType Function
  $script:CmdSchedulerDelete = Get-Command Invoke-SchedulerDelete -CommandType Function
  $script:SchedUi.Window = $win
  $win.FindName('btnCreate').Add_Click({ & $script:CmdSchedulerCreate })
  $win.FindName('btnDelete').Add_Click({ & $script:CmdSchedulerDelete })
  $win.FindName('btnClose2').Add_Click({ if ($script:SchedUi -and $script:SchedUi.Window) { $script:SchedUi.Window.Close() } })
  $win.Owner = $Window
  try {
    $win.ShowDialog() | Out-Null
  } finally {
    $script:SchedUi = $null
    $script:CmdSchedulerCreate = $null
    $script:CmdSchedulerDelete = $null
    $script:CmdSchedulerMode = $null
    $script:CmdSchedulerSearch = $null
    $script:CmdSchedulerAddServer = $null
    $script:CmdSchedulerRefreshServers = $null
  }
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

function Start-ServerRdp($row) {
  # Abre mstsc hacia el servidor con el usuario de la sesion actual (mismas credenciales
  # de dominio que usa WUU para SMB/PsExec). Prefiere IP si esta en el inventario.
  if (-not $row) {
    [System.Windows.MessageBox]::Show("Selecciona primero una fila (clic sobre el servidor).","WUU",'OK','Information') | Out-Null
    return
  }
  $server = "$($row.Servidor)".Trim()
  if (-not $server) {
    [System.Windows.MessageBox]::Show("La fila no tiene nombre de servidor.","WUU",'OK','Warning') | Out-Null
    return
  }
  $ip = "$($row.IP)".Trim()
  $target = if ($ip) { $ip } else { $server }
  $user = if ($env:USERDOMAIN) { "$env:USERDOMAIN\$env:USERNAME" } else { "$env:USERNAME" }
  $mstsc = Join-Path $env:SystemRoot 'System32\mstsc.exe'
  if (-not (Test-Path -LiteralPath $mstsc)) {
    [System.Windows.MessageBox]::Show("No se encuentra mstsc.exe en:`n$mstsc","WUU",'OK','Error') | Out-Null
    return
  }
  try {
    $safe = ($server -replace '[^\w\-]', '_')
    $rdpPath = Join-Path $env:TEMP ("WUU_{0}.rdp" -f $safe)
    $rdp = @(
      "full address:s:$target"
      "username:s:$user"
      "domain:s:$env:USERDOMAIN"
      "prompt for credentials:i:0"
      "authentication level:i:2"
      "negotiate security layer:i:1"
      "enablecredsspsupport:i:1"
      "autoreconnection enabled:i:1"
      "screen mode id:i:2"
    ) -join "`r`n"
    Set-Content -LiteralPath $rdpPath -Value $rdp -Encoding ASCII -Force
    Start-Process -FilePath $mstsc -ArgumentList "`"$rdpPath`""
    $row.Status = "RDP abierto ($user -> $target)"
    Write-Log 'INFO' "RDP: $server ($target) como $user"
  } catch {
    [System.Windows.MessageBox]::Show("No se pudo abrir RDP:`n$($_.Exception.Message)","WUU",'OK','Error') | Out-Null
    Write-Log 'ERROR' "RDP ${server}: $($_.Exception.Message)"
  }
}

$cm = New-Object System.Windows.Controls.ContextMenu

# 0. Abrir en RDP
$miRdp = New-Object System.Windows.Controls.MenuItem
$miRdp.Header = "Abrir en RDP"
$miRdp.Add_Click({
  Start-ServerRdp $script:dg.SelectedItem
})

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
    "Se limpiara la cache de Windows Update en '$($sel.Servidor)':`n`n1. Detener wuauserv, cryptSvc, bits y msiserver`n2. Renombrar SoftwareDistribution y catroot2`n3. Reiniciar servicios`n4. gpupdate /force`n5. Reinicio del servidor (10 s)`n6. Al volver, se inicia el parcheo automaticamente`n`nContinuar?",
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

$cm.Items.Add($miRdp)        | Out-Null
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

# Reporte: elige periodo (ventana actual o mes anterior), recolecta y muestra la grilla
$btnReport.Add_Click({
  $period = Show-ReportPeriodPicker
  if ($null -eq $period) { return }
  Show-Report -Year $period.Year -Month $period.Month
})

# Fix: instala .msu / .cab de la carpeta Fix\ en servidores elegidos
$btnFix.Add_Click({
  try {
    Start-FixFlow
  } catch {
    Write-Log 'ERROR' "Fix: $($_.Exception.Message)"
    try {
      [System.Windows.Forms.MessageBox]::Show("Error en Fix:`n$($_.Exception.Message)", 'WUU') | Out-Null
    } catch {
      [System.Windows.MessageBox]::Show("Error en Fix:`n$($_.Exception.Message)", 'WUU') | Out-Null
    }
  }
})

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
function Show-AnalystDialog {
  # Solicita el nombre del analista al abrir la consola (obligatorio).
  [xml]$ax = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Analista asignado" Height="220" Width="440"
        WindowStartupLocation="CenterScreen" ResizeMode="NoResize"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="20">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Grid.Row="0" Text="Identificacion del operador" FontSize="15" FontWeight="SemiBold" Margin="0,0,0,8"/>
    <TextBlock Grid.Row="1" TextWrapping="Wrap" Foreground="#FF475569" Margin="0,0,0,12"
               Text="Ingresa el nombre de la persona que ejecuta WUU. Se incluira en el reporte como columna Analista asignado."/>
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
  $ok  = $win.FindName('btnOk')
  $cancel = $win.FindName('btnCancel')
  $box = @{ Result = $null }
  $ok.Add_Click({
    $name = "$($txt.Text)".Trim()
    if (-not $name) {
      $lbl.Text = 'El nombre del analista es obligatorio.'
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

function Get-ScheduledPatchServers {
  Ensure-ConfigSection 'ScheduledPatch'
  $groups = @($script:Cfg.ScheduledPatch.Groups | ForEach-Object { "$_".Trim() } | Where-Object { $_ })
  $explicit = @($script:Cfg.ScheduledPatch.Servers | ForEach-Object { "$_".Trim() } | Where-Object { $_ })
  $seen = @{}; $list = @()
  if ($groups.Count -gt 0) {
    foreach ($r in @($script:Csv)) {
      $g = "$($r.Grupo)".Trim(); $n = "$($r.Servidor)".Trim()
      if (-not $n -or $seen.ContainsKey($n)) { continue }
      if ($groups -contains $g) { $seen[$n] = $true; $list += $n }
    }
  }
  foreach ($n in $explicit) {
    if (-not $n -or $seen.ContainsKey($n)) { continue }
    $seen[$n] = $true
    $list += $n
  }
  return $list
}

function Invoke-HeadlessRemoteWorker {
  param(
    [string]$Server,
    [ValidateSet('Install','Check')]$Mode = 'Install',
    [switch]$RebootAfter,
    [int]$TimeoutMinutes = 90
  )
  $result = [ordered]@{ Servidor=$Server; stage='error'; status=''; error=''; available=0; rebootRequired=$false }
  $rel = $script:RemoteRel
  $remoteDir = "\\$Server\C`$\$rel"
  try {
    New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
    Remove-Item "$remoteDir\status.json","$remoteDir\stop.flag" -ErrorAction SilentlyContinue
    Copy-Item -Path $script:LocalWorker -Destination "$remoteDir\worker.ps1" -Force -ErrorAction Stop
  } catch {
    $result.error = "Sin conexion o sin acceso SMB: $($_.Exception.Message)"
    $result.status = 'Error de conexion'
    return [pscustomobject]$result
  }
  $argList = @("\\$Server",'-accepteula','-nobanner','-s','powershell.exe',
    '-ExecutionPolicy','Bypass','-NonInteractive','-File',"C:\$rel\worker.ps1",'-Mode',$Mode)
  if ($RebootAfter -and $Mode -eq 'Install') { $argList += '-RebootAfter' }
  try {
    $p = Start-Process -FilePath $script:PsExecPath -ArgumentList $argList -WindowStyle Hidden -PassThru
  } catch {
    $result.error = "PsExec: $($_.Exception.Message)"; $result.status='Error'
    return [pscustomobject]$result
  }
  $deadline = (Get-Date).AddMinutes($TimeoutMinutes)
  $terminal = @('done','reboot','error','stopped','checked')
  do {
    Start-Sleep -Seconds 4
    try {
      if (Test-Path "$remoteDir\status.json") {
        $st = (Get-Content "$remoteDir\status.json" -Raw -ErrorAction Stop) | ConvertFrom-Json
        $result.stage = "$($st.stage)"; $result.status = "$($st.status)"; $result.error = "$($st.error)"
        $result.available = [int]($st.available); $result.rebootRequired = [bool]$st.rebootRequired
      }
    } catch {}
    if ($p.HasExited -and $result.stage -in $terminal) { break }
    if ($p.HasExited -and $result.stage -eq 'error') { break }
  } while ((Get-Date) -lt $deadline)
  if ((Get-Date) -ge $deadline -and $result.stage -notin $terminal) {
    try { Set-Content "$remoteDir\stop.flag" '1' -ErrorAction SilentlyContinue } catch {}
    try { if (-not $p.HasExited) { $p.Kill() } } catch {}
    $result.stage = 'error'; $result.status = 'Timeout'; $result.error = "Timeout ($TimeoutMinutes min)"
  }
  return [pscustomobject]$result
}

function Invoke-HeadlessRebootMonitor {
  param([string]$Server)
  $rel = $script:RemoteRel
  $remoteDir = "\\$Server\C`$\$rel"
  $out = [ordered]@{ result='error'; status=''; available=0; error='' }
  try {
    $null = & $script:PsExecPath "\\$Server" -accepteula -nobanner -s `
      shutdown.exe /r /t 10 /c "Reinicio WUU ventana programada" 2>&1
    $out.status = 'Reinicio remoto enviado'
  } catch { $out.status = "No se pudo enviar reinicio: $($_.Exception.Message)" }
  $downDeadline = (Get-Date).AddMinutes(4)
  while ((Get-Date) -lt $downDeadline) {
    if (-not (Test-Path "\\$Server\C`$")) { break }
    Start-Sleep -Seconds 5
  }
  $upDeadline = (Get-Date).AddMinutes(20)
  $up = $false
  while ((Get-Date) -lt $upDeadline) {
    if (Test-Path "\\$Server\C`$") { $up = $true; break }
    Start-Sleep -Seconds 10
  }
  if (-not $up) {
    $out.result = 'timeout'; $out.status = 'Sin respuesta tras reinicio (SMB)'; $out.error = $out.status
    return [pscustomobject]$out
  }
  Start-Sleep -Seconds 30
  try {
    New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
    Remove-Item "$remoteDir\verify.json" -ErrorAction SilentlyContinue
    Copy-Item -Path $script:LocalVerifyWorker -Destination "$remoteDir\verify.ps1" -Force -ErrorAction Stop
    $null = & $script:PsExecPath "\\$Server" -accepteula -nobanner -s `
      powershell.exe -ExecutionPolicy Bypass -NonInteractive -File "C:\$rel\verify.ps1" 2>&1
    if (Test-Path "$remoteDir\verify.json") {
      $v = Get-Content "$remoteDir\verify.json" -Raw | ConvertFrom-Json
      $out.available = [int]$v.available
      if ($v.rebootRequired) { $out.result = 'reboot'; $out.status = 'Aun requiere reinicio' }
      elseif ([int]$v.available -gt 0) { $out.result = 'pending'; $out.status = "$($v.available) update(s) pendientes" }
      else { $out.result = 'updated'; $out.status = 'Actualizado tras reinicio' }
      if ($v.error) { $out.error = "$($v.error)" }
    } else {
      $out.result = 'verifyfail'; $out.status = 'No se pudo verificar tras reinicio'; $out.error = $out.status
    }
  } catch {
    $out.result = 'verifyfail'; $out.status = "Verify fallo: $($_.Exception.Message)"; $out.error = $out.status
  }
  return [pscustomobject]$out
}

if ($ScheduledPatch) {
  Write-Log 'INFO' 'Modo headless (-ScheduledPatch) iniciado.'
  if (-not (Test-Path $script:PsExecPath)) { Write-Log 'ERROR' "PsExec no encontrado: $script:PsExecPath"; exit 1 }
  Load-Csv
  if ($script:Csv.Count -eq 0) { Write-Log 'ERROR' 'Sin servidores en CSV. Saliendo.'; exit 1 }
  $targets = @(Get-ScheduledPatchServers)
  if ($targets.Count -eq 0) { Write-Log 'ERROR' 'ScheduledPatch sin grupos/servidores o sin coincidencias en CSV. Saliendo.'; exit 1 }
  Write-Log 'INFO' "Ventana programada: $($targets.Count) servidor(es): $($targets -join ', ')"
  $timeoutMin = [int]$script:Cfg.PatchTimeoutMinutes
  if ($timeoutMin -lt 10) { $timeoutMin = 90 }

  $patchStartedAt = Get-Date
  $groupStr = ''
  try {
    Ensure-ConfigSection 'ScheduledPatch'
    $gParts = @($script:Cfg.ScheduledPatch.Groups | ForEach-Object { "$_".Trim() } | Where-Object { $_ })
    $sParts = @($script:Cfg.ScheduledPatch.Servers | ForEach-Object { "$_".Trim() } | Where-Object { $_ })
    $bits = @()
    if ($gParts.Count) { $bits += ($gParts -join ', ') }
    if ($sParts.Count) { $bits += ('servidores: ' + ($sParts -join ', ')) }
    $groupStr = $bits -join ' | '
  } catch {}
  try {
    Send-TeamsPatchStarted $targets.Count $groupStr 'Ventana de actualizacion iniciada'
    Write-Log 'INFO' 'Ventana: notificacion Teams de inicio enviada (si Enabled).'
  } catch { Write-Log 'ERROR' "Ventana Teams inicio: $($_.Exception.Message)" }

  $bag = @{}
  foreach ($sv in $targets) {
    Write-Log 'INFO' "Install: $sv"
    $bag[$sv] = Invoke-HeadlessRemoteWorker -Server $sv -Mode Install -RebootAfter -TimeoutMinutes $timeoutMin
    Write-Log 'INFO' "Install fin $sv -> $($bag[$sv].stage): $($bag[$sv].status)"
  }

  $final = @{}
  foreach ($sv in $targets) {
    $r = $bag[$sv]
    $entry = [ordered]@{ Servidor=$sv; Estado="$($r.stage)"; Status="$($r.status)"; Error="$($r.error)"; Available="$($r.available)" }
    if ("$($r.stage)" -eq 'reboot' -or [bool]$r.rebootRequired) {
      Write-Log 'INFO' "Post-reinicio: $sv"
      $mon = Invoke-HeadlessRebootMonitor -Server $sv
      $entry.Status = "$($mon.status)"; $entry.Estado = "$($mon.result)"
      if ($mon.error) { $entry.Error = "$($mon.error)" }
      $entry.Available = "$($mon.available)"
      if ("$($mon.result)" -eq 'timeout') {
        Write-Log 'WARN' "Sin respuesta post-reinicio $sv -> Mode Check"
        $chk = Invoke-HeadlessRemoteWorker -Server $sv -Mode Check -TimeoutMinutes ([Math]::Min(30, $timeoutMin))
        $entry.Estado = 'check'; $entry.Status = "$($chk.status)"; $entry.Available = "$($chk.available)"
        if ($chk.error) { $entry.Error = "$($chk.error)" }
      }
    } elseif ("$($r.stage)" -eq 'error') {
      $entry.Estado = 'error'
      if (-not $entry.Error) { $entry.Error = "$($r.status)" }
    } elseif ("$($r.stage)" -eq 'done') { $entry.Estado = 'updated' }
    $final[$sv] = [pscustomobject]$entry
    Write-Log 'INFO' "Resultado $sv -> $($entry.Estado): $($entry.Status)"
  }

  Write-Log 'INFO' 'Ventana: todos los servidores sin procesos pendientes. Generando reporte...'
  $repBag = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $rpool = @()
  $rjob = {
    param($server,$psexec,$worker,$rel,$bag)
    $obj=$null
    try {
      $remoteDir="\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\report.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\report.ps1" -Force -ErrorAction Stop
      $null=& $psexec "\\$server" -accepteula -nobanner -s powershell.exe -ExecutionPolicy Bypass -NonInteractive -File "C:\$rel\report.ps1" -Year 0 -Month 0 2>&1
      if (Test-Path "$remoteDir\report.json") {
        $raw=Get-Content "$remoteDir\report.json" -Raw
        if ($raw) { $obj=$raw|ConvertFrom-Json }
      }
    } catch {}
    if (-not $obj) {
      $obj=[pscustomobject]@{ Dominio='';Servidor=$server;IP='';Sistema_Operativo='';Version_Sistema_Operativo='';
        Fecha_Instalacion='';KBs_Instaladas='';Fecha_Reinicio='';Running_Time='';Descripcion_Error='Sin conexion o sin datos';Disk_Space='' }
    }
    [void]$bag.Add($obj)
  }
  foreach ($sv in $targets) {
    $rs=[runspacefactory]::CreateRunspace();$rs.ApartmentState='MTA';$rs.Open()
    $ps=[powershell]::Create();$ps.Runspace=$rs
    $ps.AddScript($rjob.ToString()).AddArgument($sv).AddArgument($script:PsExecPath).
      AddArgument($script:LocalReportWorker).AddArgument($script:RemoteRel).AddArgument($repBag) | Out-Null
    $rpool+=@{ps=$ps;handle=$ps.BeginInvoke();rs=$rs}
  }
  $rdl=(Get-Date).AddMinutes(10)
  while ($repBag.Count -lt $targets.Count -and (Get-Date) -lt $rdl) { Start-Sleep -Milliseconds 500 }
  foreach ($j in $rpool) {
    try { if ($j.handle.IsCompleted){$j.ps.EndInvoke($j.handle)} } catch {}
    try { $j.ps.Dispose() } catch {}
    try { $j.rs.Close();$j.rs.Dispose() } catch {}
  }

  $rows = New-Object System.Collections.ObjectModel.ObservableCollection[object]
  foreach ($o in @($repBag | Sort-Object Servidor)) {
    $name = "$($o.Servidor)".Trim(); $fr = $final[$name]
    $rr = New-Object ReportRow
    $rr.Dominio="$($o.Dominio)"; $rr.Servidor=$name; $rr.IP="$($o.IP)"
    $rr.Sistema_Operativo="$($o.Sistema_Operativo)"; $rr.Version_Sistema_Operativo="$($o.Version_Sistema_Operativo)"
    $rr.Fecha_Instalacion="$($o.Fecha_Instalacion)"; $rr.KBs_Instaladas="$($o.KBs_Instaladas)"
    $rr.Fecha_Reinicio="$($o.Fecha_Reinicio)"; $rr.Running_Time="$($o.Running_Time)"; $rr.Disk_Space="$($o.Disk_Space)"
    $errParts = @()
    if ($fr -and $fr.Error) { $errParts += "$($fr.Error)" }
    if ($fr -and $fr.Estado -eq 'error') { $errParts += "Estado ventana: error ($($fr.Status))" }
    if ("$($o.Descripcion_Error)") { $errParts += "$($o.Descripcion_Error)" }
    if ($fr -and $fr.Status -and $fr.Estado -notin @('updated','done')) { $errParts += "Ventana: $($fr.Status)" }
    $rr.Descripcion_Error = (@($errParts | Where-Object { $_ } | Select-Object -Unique) -join ' | ')
    $rr.Snap = Get-SnapReportText $false
    $rr.Confirmado = Get-ConfirmadoReportText $false
    $rows.Add($rr)
  }

  $rfile = Save-ReportCsv $rows ''
  Write-Log 'INFO' "Ventana: reporte CSV $rfile"
  if ($script:WUUDashboardUploadEnabled -and $script:WUUDashboardUploadUrl) {
    try {
      $lblFake = New-Object System.Windows.Controls.TextBlock
      Sync-ToDashboard $rows $lblFake
      Write-Log 'INFO' "Ventana: $($lblFake.Text)"
    } catch { Write-Log 'ERROR' "Ventana Dashboard: $($_.Exception.Message)" }
  }
  Save-History -Rows @($targets | ForEach-Object {
    $fr = $final[$_]
    [pscustomobject]@{
      Servidor=$_; IP=''; State=$(if($fr){$fr.Estado}else{'?'})
      Status=$(if($fr){$fr.Status}else{'Parcheo programado'})
      Error=$(if($fr){$fr.Error}else{''}); RunningTime=''
    }
  }) -Type 'ParcheoProgramado'

  # Notificacion Teams de fin (mismas reglas Enabled / NotifyOnFinish que el parcheo interactivo)
  try {
    $runElapsed = ''
    try { $runElapsed = Format-Elapsed ((Get-Date) - $patchStartedAt) } catch {}
    $teamsRows = @($targets | ForEach-Object {
      $fr = $final[$_]
      $st = if ($fr) { "$($fr.Estado)".ToLower() } else { '' }
      $uiState = switch -Regex ($st) {
        '^(updated|done)$' { 'Updated' }
        '^(reboot|rebootrequired)$' { 'RebootRequired' }
        default { 'Unselected' }
      }
      $err = ''
      if ($fr -and "$($fr.Error)".Trim()) { $err = "$($fr.Error)" }
      elseif ($st -eq 'error') { $err = "$(if($fr){$fr.Status}else{'error'})" }
      [pscustomobject]@{ Servidor = $_; State = $uiState; Error = $err }
    })
    Send-TeamsPatchFinished $teamsRows $runElapsed 'Ventana de actualizacion finalizada'
    Write-Log 'INFO' 'Ventana: notificacion Teams de fin enviada (si Enabled).'
  } catch { Write-Log 'ERROR' "Ventana Teams fin: $($_.Exception.Message)" }

  try { Set-ScheduledPatchEnabled $false } catch {}
  Write-Log 'INFO' 'Modo headless (-ScheduledPatch) finalizado.'
  exit 0
}

if ($Scheduled) {
  #============================================================================
  #  MODO HEADLESS (-Scheduled): genera reporte, sincroniza y notifica
  #  Ejecutado por la tarea programada del Programador de Windows.
  #============================================================================
  Write-Log 'INFO' 'Modo headless (-Scheduled) iniciado.'
  Load-Csv
  if ($script:Csv.Count -eq 0) { Write-Log 'ERROR' 'Sin servidores en CSV. Saliendo.'; exit 1 }

  # Periodo del reporte programado (mes en curso / anterior / especifico)
  $schedPeriod = Resolve-ScheduledPeriod
  $repYear  = [int]$schedPeriod.Year
  $repMonth = [int]$schedPeriod.Month
  $periodLabel = if ($repYear -gt 0 -and $repMonth -ge 1) { '{0:D4}-{1:D2}' -f $repYear, $repMonth } else { '' }
  Write-Log 'INFO' "Headless: periodo del reporte: $(if($periodLabel){$periodLabel}else{'actual (mes en curso)'})."

  # Tomar todos los servidores de todos los grupos
  $allServers = @($script:Csv | Select-Object -ExpandProperty Servidor -Unique)
  Write-Log 'INFO' "Headless: consultando $($allServers.Count) servidor(es)."

  $reportStartedAt = Get-Date
  try {
    Send-TeamsReportStarted $allServers.Count $periodLabel
    Write-Log 'INFO' 'Reporte programado: notificacion Teams de inicio enviada (si Enabled).'
  } catch { Write-Log 'ERROR' "Reporte Teams inicio: $($_.Exception.Message)" }

  # Correr el worker de reporte en paralelo (mismo mecanismo que el boton Reporte)
  $bag  = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $pool = @()
  $rjob = {
    param($server,$psexec,$worker,$rel,$bag,$year,$month)
    $obj=$null
    try {
      $remoteDir="\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\report.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\report.ps1" -Force -ErrorAction Stop
      $null=& $psexec "\\$server" -accepteula -nobanner -s `
              powershell.exe -ExecutionPolicy Bypass -NonInteractive `
              -File "C:\$rel\report.ps1" -Year $year -Month $month 2>&1
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
        AddArgument($bag).AddArgument($repYear).AddArgument($repMonth) | Out-Null
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
    $rr = New-Object ReportRow
    $rr.Dominio                   = "$($_.Dominio)"
    $rr.Servidor                  = "$($_.Servidor)"
    $rr.IP                        = "$($_.IP)"
    $rr.Sistema_Operativo         = "$($_.Sistema_Operativo)"
    $rr.Version_Sistema_Operativo = "$($_.Version_Sistema_Operativo)"
    $rr.Fecha_Instalacion         = "$($_.Fecha_Instalacion)"
    $rr.KBs_Instaladas            = "$($_.KBs_Instaladas)"
    $rr.Fecha_Reinicio            = "$($_.Fecha_Reinicio)"
    $rr.Running_Time              = "$($_.Running_Time)"
    $rr.Descripcion_Error         = "$($_.Descripcion_Error)"
    $rr.Disk_Space                = "$($_.Disk_Space)"
    $rr
  })
  Apply-ReportConfirmations $rows
  $rfile = Save-ReportCsv $rows $periodLabel
  Write-Log 'INFO' "Headless: reporte CSV guardado en $rfile"

  # Sincronizar con Dashboard Web (mismo formato que el modo interactivo)
  if ($script:WUUDashboardUploadEnabled -and $script:WUUDashboardUploadUrl) {
    try {
      [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
      $vServers = @($rows | ForEach-Object {
        [ordered]@{
          Grupo=$_.Grupo; Ambiente=$_.Ambiente; Dominio=$_.Dominio; Servidor=$_.Servidor; IP=$_.IP
          Sistema_Operativo=$_.Sistema_Operativo; Version_Sistema_Operativo=$_.Version_Sistema_Operativo
          Fecha_Instalacion=$_.Fecha_Instalacion; KBs_Instaladas=$_.KBs_Instaladas
          Fecha_Reinicio=$_.Fecha_Reinicio; Running_Time=$_.Running_Time; Descripcion_Error=$_.Descripcion_Error
          Disk_Space=$_.Disk_Space; Snap=$_.Snap; Confirmado=$_.Confirmado
          'Analista asignado'=$_.Analista_Asignado
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
      Write-Log 'INFO' "Headless: sincronizacion Dashboard Web correcta ($($vServers.Count) servidores)."
    } catch { Write-Log 'ERROR' "Headless Dashboard Web: $($_.Exception.Message)" }
  }

  # Historial
  Save-History -Rows @($rows | ForEach-Object {
    [pscustomobject]@{Servidor=$_.Servidor;IP=$_.IP;State='Report';
      Status='Reporte programado';Error=$_.Descripcion_Error;RunningTime=$_.Running_Time}
  }) -Type 'ReporteProgramado'

  try {
    $runElapsed = ''
    try { $runElapsed = Format-Elapsed ((Get-Date) - $reportStartedAt) } catch {}
    Send-TeamsReportFinished $rows $runElapsed $periodLabel "$rfile"
    Write-Log 'INFO' 'Reporte programado: notificacion Teams de fin enviada (si Enabled).'
  } catch { Write-Log 'ERROR' "Reporte Teams fin: $($_.Exception.Message)" }

  Write-Log 'INFO' 'Modo headless finalizado.'
  exit 0
} else {
  #============================================================================
  #  MODO NORMAL: interfaz grafica
  #============================================================================
  $analyst = Show-AnalystDialog
  if (-not "$analyst".Trim()) {
    Write-Log 'WARN' 'Inicio cancelado: no se indico Analista asignado.'
    exit 0
  }
  $script:AnalistaAsignado = "$analyst".Trim()
  Write-Log 'INFO' "Analista asignado: $script:AnalistaAsignado"
  try {
    if ($script:lblAnalyst) { $script:lblAnalyst.Text = $script:AnalistaAsignado }
  } catch {}
  Load-Csv
  Update-ButtonStates
  $Window.ShowDialog() | Out-Null
}
