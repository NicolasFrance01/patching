<#
================================================================================
  WUU.ps1  -  Windows Update Utility
  --------------------------------------------------------------------------
  Consola de parcheo para servidores Windows (PowerShell + WPF).
  --------------------------------------------------------------------------
  Modos de ejecucion:
    Normal   : abrir directamente (interfaz grafica)
    Headless : WUU.ps1 -Scheduled  (tarea programada, sin interfaz)
               WUU.ps1 -ScheduledConnectivity [-ConnectivityGroup <grupo>]
               WUU.ps1 -ScheduledPatch -JobFile <json>
               WUU.ps1 -ScheduledReboot -JobFile <json>
               WUU.ps1 -WatchOrders  (vigia: si hay pedido, valida y copia CSV a la bandeja)

  Configuracion externa: config.json junto a WUU.ps1
================================================================================
#>
param(
  [switch]$Scheduled,              # modo headless: genera reporte y sincroniza con Centro de Control de Parcheo
  [switch]$ScheduledPatch,         # modo headless: ejecuta una ventana unica de actualizacion
  [switch]$ScheduledConnectivity,  # modo headless: valida conexiones y guarda CSV
  [switch]$ScheduledReboot,        # modo headless: reinicia servidores de un JSON
  [switch]$WatchOrders,            # modo headless: vigia de pedidos (subdominio)
  [string]$ConnectivityGroup = '', # grupo a validar; vacio = todos
  [string]$JobFile = ''            # definicion JSON de ventana de actualizacion o reinicio
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
                elseif ($ScheduledReboot) { " -ScheduledReboot -JobFile `"$JobFile`"" }
                elseif ($WatchOrders) { ' -WatchOrders' }
                elseif ($ScheduledConnectivity) {
                  $gArg = if ($ConnectivityGroup) { " -ConnectivityGroup `"$ConnectivityGroup`"" } else { '' }
                  " -ScheduledConnectivity$gArg"
                }
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
    public string Analista {get;set;}
    public string Grupo {get;set;}
    public string Ambiente {get;set;}
    public string Dominio {get;set;}
    public string Servidor {get;set;}
    public string IP {get;set;}
    public string Sistema_Operativo {get;set;}
    public string Version_Sistema_Operativo {get;set;}
    public string SQL_Instancia {get;set;}
    public string SQL_Version {get;set;}
    public string SQL_Ultima_Actualizacion {get;set;}
    public string Fecha_Ventana {get;set;}
    public string Fecha_Instalacion {get;set;}
    public string KBs_Instaladas {get;set;}
    public string Fecha_Reinicio {get;set;}
    public string Running_Time {get;set;}
    public string Estado {get;set;}
    public string Descripcion_Error {get;set;}
    public string Comentarios {get;set;}
    public string Disk_Space {get;set;}
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
        <DataGridTextColumn Header="Servidor"      Binding="{Binding Servidor}"    Width="180"/>
        <DataGridTextColumn Header="IP"            Binding="{Binding IP}"          Width="130"/>
        <DataGridTextColumn Header="Servidor WSUS" Binding="{Binding Wsus}"        Width="180"/>
        <DataGridTextColumn Header="Available"     Binding="{Binding Available}"   Width="90"/>
        <DataGridTextColumn Header="Download %"    Binding="{Binding DownloadPct}" Width="100"/>
        <DataGridTextColumn Header="Error"         Binding="{Binding Error}"       Width="220"/>
        <DataGridTextColumn Header="Status"        Binding="{Binding Status}"      Width="*"/>
      </DataGrid.Columns>
    </DataGrid>

    <!-- ===== Fila 3: Botones ===== -->
    <DockPanel Grid.Row="3" Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnConsultar" Content="Consultar"          Style="{StaticResource Btn}" Background="#FF0D9488" Margin="0,0,8,0"/>
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
$btnConsultar     = $Window.FindName('btnConsultar')
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
    Enabled     = $true
    Url         = 'https://patching-dashboard-hae3f7fxc6fnhhbt.canadacentral-01.azurewebsites.net/api/upload'
    CalendarUrl = ''  # vacio = se deriva de Url (/api/calendar). Completar a mano si el modulo usa otra ruta.
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
  ScheduledConnectivity = [ordered]@{
    Enabled   = $false
    Hour      = 7
    Minute    = 0
    StartDate = ''
    TaskName  = 'WUU_ValidarConexiones'
    Group         = ''   # vacio = todos los grupos
    ExtraServers  = @()  # si hay nombres, validar solo ese lote (no sumar grupos)
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
  RemotePivots = @()        # sitios: Name, Enabled, OrderFile, InboxDir (sin credenciales)
  OrderWatch = [ordered]@{
    Enabled             = $false
    TaskName            = 'WUU_VigiaPedidos'
    IntervalMinutes     = 2
    OrderFile           = ''   # UNC o ruta local del pedido (ejecutar.ahora)
    InboxDir            = ''   # UNC o ruta local de la bandeja CSV
    WaitTimeoutMinutes  = 8
  }
}

function ConvertTo-RemotePivotEntries($Raw) {
  if ($null -eq $Raw) { return @() }
  $out = @()
  foreach ($p in @($Raw)) {
    if ($null -eq $p) { continue }
    $name = ''; $hostName = ''; $orderFile = ''; $inboxDir = ''
    $enabled = $true; $waitMin = 0
    try { $name = "$($p.Name)".Trim() } catch {}
    try { $hostName = "$($p.Host)".Trim() } catch {}
    try { $orderFile = "$($p.OrderFile)".Trim() } catch {}
    try { $inboxDir = "$($p.InboxDir)".Trim() } catch {}
    try { if ($null -ne $p.Enabled) { $enabled = [bool]$p.Enabled } } catch {}
    try { if ($null -ne $p.WaitTimeoutMinutes) { $waitMin = [int]$p.WaitTimeoutMinutes } } catch {}
    if (-not $name) { $name = $hostName }
    if (-not $name) { continue }
    $out += [pscustomobject]@{
      Name = $name
      Host = $hostName
      Enabled = $enabled
      OrderFile = $orderFile
      InboxDir = $inboxDir
      WaitTimeoutMinutes = $waitMin
    }
  }
  return @($out)
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
    foreach ($sec in @('Dashboard','ScheduledReport','ScheduledConnectivity','History','AutoReboot','Teams','OrderWatch')) {
      if ($raw.$sec) {
        foreach ($k in @($script:Cfg[$sec].Keys)) {
          if ($null -ne $raw.$sec.$k) { $script:Cfg[$sec][$k] = $raw.$sec.$k }
        }
      }
    }
    if ($null -ne $raw.RemotePivots) {
      $script:Cfg.RemotePivots = @(ConvertTo-RemotePivotEntries $raw.RemotePivots)
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

function Ensure-WuServicesRunning {
  foreach ($name in @('wuauserv','cryptSvc','bits','msiserver')) {
    try {
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ([string]$svc.StartType -eq 'Disabled') {
        $mode = if ($name -eq 'msiserver') { 'Manual' } else { 'Automatic' }
        Set-Service -Name $name -StartupType $mode -ErrorAction SilentlyContinue
      }
      $svc.Refresh()
      if ($svc.Status -eq 'Running') { continue }
      if ([string]$svc.Status -match 'Pending') {
        try { $svc.WaitForStatus('Stopped', [TimeSpan]::FromSeconds(20)) } catch {}
        $svc.Refresh()
        if ([string]$svc.Status -match 'Pending') {
          try { Stop-Service -Name $name -Force -ErrorAction SilentlyContinue } catch {}
          Start-Sleep -Seconds 2
          $svc.Refresh()
        }
        if ([string]$svc.Status -match 'Pending') {
          try {
            cmd.exe /c "sc stop $name" 2>$null | Out-Null
            Start-Sleep -Seconds 1
            cmd.exe /c "taskkill /F /FI `"SERVICES eq $name`"" 2>$null | Out-Null
          } catch {}
          Start-Sleep -Seconds 2
        }
      }
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ($svc.Status -ne 'Running') {
        try { Start-Service -Name $name -ErrorAction Stop } catch { net.exe start $name 2>$null | Out-Null }
        try { $svc.WaitForStatus('Running', [TimeSpan]::FromSeconds(30)) } catch {}
      }
    } catch {
      try { net.exe start $name 2>$null | Out-Null } catch {}
    }
  }
}

function Test-IsWsusManaged {
  try {
    $use = (Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' -ErrorAction SilentlyContinue).UseWUServer
    if ("$use" -eq '1') {
      $srv = (Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate' -ErrorAction SilentlyContinue).WUServer
      if ("$srv".Trim()) { return $true }
    }
  } catch {}
  return $false
}

function Invoke-WuOnlineSearch([string]$Query = 'IsInstalled=0 and IsHidden=0') {
  $session = New-Object -ComObject Microsoft.Update.Session
  try { $session.ClientApplicationID = 'WUU' } catch {}
  $sels = New-Object System.Collections.ArrayList
  if (Test-IsWsusManaged) {
    [void]$sels.Add(1)
  } else {
    [void]$sels.Add(2)
    try {
      $sm = New-Object -ComObject Microsoft.Update.ServiceManager
      foreach ($svc in @($sm.Services)) {
        if ($svc.ServiceID -eq '7971f918-a847-4430-9279-4a52d1efe18d' -and $svc.IsEnabled) {
          [void]$sels.Add(3)
          break
        }
      }
    } catch {}
  }
  $lastErr = $null
  $empty = $null
  foreach ($sel in @($sels)) {
    try {
      $searcher = $session.CreateUpdateSearcher()
      $searcher.Online = $true
      $searcher.ServerSelection = [int]$sel
      if ([int]$sel -eq 3) { $searcher.ServiceID = '7971f918-a847-4430-9279-4a52d1efe18d' }
      $result = $searcher.Search($Query)
      if ($result.Updates.Count -gt 0) {
        return @{ Session = $session; Searcher = $searcher; Result = $result }
      }
      $empty = @{ Session = $session; Searcher = $searcher; Result = $result }
    } catch {
      $lastErr = $_.Exception.Message
    }
  }
  if ($empty) { return $empty }
  if ($lastErr) { throw $lastErr }
  throw 'No se pudo consultar Windows Update'
}

function Get-WuWsusErrors([string]$SearchError) {
  $msgs = @()
  if ($SearchError) { $msgs += $SearchError.Trim() }
  $svcOk = @{}
  foreach ($svc in @('wuauserv','cryptSvc','bits','msiserver')) {
    try {
      $st = Get-Service $svc -ErrorAction Stop
      $svcOk[$svc] = ($st.Status -eq 'Running')
      if ($st.Status -ne 'Running') { $msgs += "Servicio $svc : $($st.Status)" }
    } catch { $msgs += "Servicio $svc : no disponible"; $svcOk[$svc] = $false }
  }
  try {
    $fh = @{ LogName='System'; ProviderName='Microsoft-Windows-WindowsUpdateClient'; Level=@(2,3) }
    foreach ($e in @(Get-WinEvent -FilterHashtable $fh -MaxEvents 25 -ErrorAction SilentlyContinue)) {
      $line = (($e.Message -split "`r?`n")[0]).Trim()
      if (-not $line) { continue }
      if ($svcOk['msiserver'] -and $line -match '(?i)Windows Installer service is not started|Instalador de Windows no se') { continue }
      if (-not $SearchError -and $line -match '(?i)no pudo buscar|failed to check for updates|could not search') { continue }
      $msgs += $line
    }
  } catch {}
  try {
    foreach ($e in @(Get-WinEvent -LogName 'Microsoft-Windows-WindowsUpdateClient/Operational' -MaxEvents 50 -ErrorAction SilentlyContinue | Where-Object { $_.Level -le 3 })) {
      $line = (($e.Message -split "`r?`n")[0]).Trim()
      if ($line -and ($line -match '(?i)error|fallo|failed|8024|80072|wsus|sincroniz|sync')) {
        if ($svcOk['msiserver'] -and $line -match '(?i)Windows Installer service is not started|Instalador de Windows no se') { continue }
        if (-not $SearchError -and $line -match '(?i)no pudo buscar|failed to check for updates|could not search') { continue }
        $msgs += $line
      }
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
  $state.wsus = if (Test-IsWsusManaged) { $wsus } elseif ($wsus) { "$wsus (no usado; WU directo)" } else { "No configurado (WU directo)" }
  $state.status = "Chequeando WSUS/WU..."
  Save-State
  Ensure-WuServicesRunning
  if (Is-Stopped) { $state.stage="stopped"; $state.status="Detenido"; Save-State; return }

  if ($ClearCacheFirst) {
    Clear-WuCache "Limpiando cache de actualizacion..." -RebootWhenDone
    return
  }

  # --- CHEQUEO WSUS/WU ------------------------------------------------------
  $needRemediate = $false
  $searchErr = ""
  $session = $null
  $searcher = $null
  $result = $null
  try {
    $wu = Invoke-WuOnlineSearch
    $session = $wu.Session
    $searcher = $wu.Searcher
    $result = $wu.Result
  } catch {
    $needRemediate = $true
    $searchErr = $_.Exception.Message
    $state.error = "Fallo chequeo WU: $searchErr"
    Save-State
  }

  # --- REMEDIACION (solo si fallo el chequeo) ------------------------------
  if ($needRemediate) {
    Clear-WuCache "Remediando agente WU..."
    Ensure-WuServicesRunning
    $state.stage="check"; $state.status="Re-chequeando tras remediacion..."; $state.error=""; Save-State
    $searchErr = ""
    $wu = Invoke-WuOnlineSearch
    $session = $wu.Session
    $searcher = $wu.Searcher
    $result = $wu.Result
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
$script:ReportRunning     = $false
$script:RepComment        = ''
$script:RepWindowDate     = ''

$script:LocalConsultWorker = Join-Path $env:TEMP 'WUU_consult.ps1'
$script:ConsultBag         = $null
$script:ConsultPool        = @()
$script:ConsultTimer       = $null
$script:ConsultRunning     = $false
$script:ConsultMeta        = @{}

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
  SQL_Instancia="No SQL"; SQL_Version="No SQL"; SQL_Ultima_Actualizacion="No SQL";
  Fecha_Instalacion=""; KBs_Instaladas=""; Fecha_Reinicio=""; Running_Time=""; Descripcion_Error=""; Disk_Space=""; Nota_Updates=""
}
function Ensure-WuServicesRunning {
  foreach ($name in @('wuauserv','cryptSvc','bits','msiserver')) {
    try {
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ([string]$svc.StartType -eq 'Disabled') {
        $mode = if ($name -eq 'msiserver') { 'Manual' } else { 'Automatic' }
        Set-Service -Name $name -StartupType $mode -ErrorAction SilentlyContinue
      }
      $svc.Refresh()
      if ($svc.Status -eq 'Running') { continue }
      if ([string]$svc.Status -match 'Pending') {
        try { $svc.WaitForStatus('Stopped', [TimeSpan]::FromSeconds(20)) } catch {}
        $svc.Refresh()
        if ([string]$svc.Status -match 'Pending') {
          try { Stop-Service -Name $name -Force -ErrorAction SilentlyContinue } catch {}
          Start-Sleep -Seconds 2
          $svc.Refresh()
        }
        if ([string]$svc.Status -match 'Pending') {
          try {
            cmd.exe /c "sc stop $name" 2>$null | Out-Null
            Start-Sleep -Seconds 1
            cmd.exe /c "taskkill /F /FI `"SERVICES eq $name`"" 2>$null | Out-Null
          } catch {}
          Start-Sleep -Seconds 2
        }
      }
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ($svc.Status -ne 'Running') {
        try { Start-Service -Name $name -ErrorAction Stop } catch { net.exe start $name 2>$null | Out-Null }
        try { $svc.WaitForStatus('Running', [TimeSpan]::FromSeconds(30)) } catch {}
      }
    } catch {
      try { net.exe start $name 2>$null | Out-Null } catch {}
    }
  }
}
function Test-IsWsusManaged {
  try {
    $use = (Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' -ErrorAction SilentlyContinue).UseWUServer
    if ("$use" -eq '1') {
      $srv = (Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate' -ErrorAction SilentlyContinue).WUServer
      if ("$srv".Trim()) { return $true }
    }
  } catch {}
  return $false
}

function Invoke-WuOnlineSearch([string]$Query = 'IsInstalled=0 and IsHidden=0') {
  $session = New-Object -ComObject Microsoft.Update.Session
  try { $session.ClientApplicationID = 'WUU' } catch {}
  $sels = New-Object System.Collections.ArrayList
  if (Test-IsWsusManaged) {
    [void]$sels.Add(1)
  } else {
    [void]$sels.Add(2)
    try {
      $sm = New-Object -ComObject Microsoft.Update.ServiceManager
      foreach ($svc in @($sm.Services)) {
        if ($svc.ServiceID -eq '7971f918-a847-4430-9279-4a52d1efe18d' -and $svc.IsEnabled) {
          [void]$sels.Add(3)
          break
        }
      }
    } catch {}
  }
  $lastErr = $null
  $empty = $null
  foreach ($sel in @($sels)) {
    try {
      $searcher = $session.CreateUpdateSearcher()
      $searcher.Online = $true
      $searcher.ServerSelection = [int]$sel
      if ([int]$sel -eq 3) { $searcher.ServiceID = '7971f918-a847-4430-9279-4a52d1efe18d' }
      $result = $searcher.Search($Query)
      if ($result.Updates.Count -gt 0) {
        return @{ Session = $session; Searcher = $searcher; Result = $result }
      }
      $empty = @{ Session = $session; Searcher = $searcher; Result = $result }
    } catch {
      $lastErr = $_.Exception.Message
    }
  }
  if ($empty) { return $empty }
  if ($lastErr) { throw $lastErr }
  throw 'No se pudo consultar Windows Update'
}

function Get-WuWsusErrors([string]$SearchError) {
  $msgs = @()
  if ($SearchError) { $msgs += $SearchError.Trim() }
  $svcOk = @{}
  foreach ($svc in @('wuauserv','cryptSvc','bits','msiserver')) {
    try {
      $st = Get-Service $svc -ErrorAction Stop
      $svcOk[$svc] = ($st.Status -eq 'Running')
      if ($st.Status -ne 'Running') { $msgs += "Servicio $svc : $($st.Status)" }
    } catch { $msgs += "Servicio $svc : no disponible"; $svcOk[$svc] = $false }
  }
  try {
    $fh = @{ LogName='System'; ProviderName='Microsoft-Windows-WindowsUpdateClient'; Level=@(2,3) }
    foreach ($e in @(Get-WinEvent -FilterHashtable $fh -MaxEvents 25 -ErrorAction SilentlyContinue)) {
      $line = (($e.Message -split "`r?`n")[0]).Trim()
      if (-not $line) { continue }
      if ($svcOk['msiserver'] -and $line -match '(?i)Windows Installer service is not started|Instalador de Windows no se') { continue }
      if (-not $SearchError -and $line -match '(?i)no pudo buscar|failed to check for updates|could not search') { continue }
      $msgs += $line
    }
  } catch {}
  try {
    foreach ($e in @(Get-WinEvent -LogName 'Microsoft-Windows-WindowsUpdateClient/Operational' -MaxEvents 50 -ErrorAction SilentlyContinue | Where-Object { $_.Level -le 3 })) {
      $line = (($e.Message -split "`r?`n")[0]).Trim()
      if ($line -and ($line -match '(?i)error|fallo|failed|8024|80072|wsus|sincroniz|sync')) {
        if ($svcOk['msiserver'] -and $line -match '(?i)Windows Installer service is not started|Instalador de Windows no se') { continue }
        if (-not $SearchError -and $line -match '(?i)no pudo buscar|failed to check for updates|could not search') { continue }
        $msgs += $line
      }
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
  } elseif ($all.Count -gt 0) {
    $latestAll = $all | Sort-Object InstalledOn -Descending | Select-Object -First 1
    if ($latestAll) { $o.Fecha_Instalacion = ([datetime]$latestAll.InstalledOn).ToString("yyyy-MM-dd") }
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
  function Get-SqlProductName([string]$build) {
    if ([string]::IsNullOrWhiteSpace($build)) { return 'SQL Server' }
    $parts = $build.Split('.')
    $maj = 0; $min = 0
    [void][int]::TryParse($parts[0], [ref]$maj)
    if ($parts.Count -gt 1) { [void][int]::TryParse($parts[1], [ref]$min) }
    switch ($maj) {
      16 { return 'SQL Server 2022' }
      15 { return 'SQL Server 2019' }
      14 { return 'SQL Server 2017' }
      13 { return 'SQL Server 2016' }
      12 { return 'SQL Server 2014' }
      11 { return 'SQL Server 2012' }
      10 { if ($min -ge 50) { return 'SQL Server 2008 R2' } else { return 'SQL Server 2008' } }
      9  { return 'SQL Server 2005' }
      default { return "SQL Server $maj" }
    }
  }
  function Get-SqlSetup([string]$instanceId) {
    foreach ($root in @(
      "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\$instanceId\Setup",
      "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Microsoft SQL Server\$instanceId\Setup"
    )) {
      if (Test-Path $root) { return Get-ItemProperty -Path $root -ErrorAction SilentlyContinue }
    }
    return $null
  }
  function Get-SqlServerProperties([string]$instanceName) {
    $dataSource = if ($instanceName -eq 'MSSQLSERVER') { 'localhost' } else { "localhost\$instanceName" }
    $cs = "Data Source=$dataSource;Integrated Security=True;Connect Timeout=2;Encrypt=False;TrustServerCertificate=True;Application Name=WUU-Report"
    $conn = $null
    try {
      $conn = New-Object System.Data.SqlClient.SqlConnection $cs
      $conn.Open()
      $cmd = $conn.CreateCommand()
      $cmd.CommandTimeout = 5
      $cmd.CommandText = 'SELECT CAST(SERVERPROPERTY(''ProductVersion'') AS nvarchar(128)), CAST(SERVERPROPERTY(''ProductLevel'') AS nvarchar(128)), CAST(SERVERPROPERTY(''ProductUpdateLevel'') AS nvarchar(128)), CAST(SERVERPROPERTY(''ProductUpdateReference'') AS nvarchar(128)), CAST(SERVERPROPERTY(''Edition'') AS nvarchar(128))'
      $r = $cmd.ExecuteReader()
      if ($r.Read()) {
        return @{
          ProductVersion         = [string]$r.GetValue(0)
          ProductLevel           = [string]$r.GetValue(1)
          ProductUpdateLevel     = [string]$r.GetValue(2)
          ProductUpdateReference = [string]$r.GetValue(3)
          Edition                = [string]$r.GetValue(4)
        }
      }
    } catch {
    } finally {
      if ($conn) { try { $conn.Close(); $conn.Dispose() } catch {} }
    }
    return $null
  }

  $instanceMap = [ordered]@{}
  foreach ($namesKey in @(
    'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL',
    'HKLM:\SOFTWARE\Wow6432Node\Microsoft\Microsoft SQL Server\Instance Names\SQL'
  )) {
    if (-not (Test-Path $namesKey)) { continue }
    $item = Get-ItemProperty -Path $namesKey -ErrorAction SilentlyContinue
    if (-not $item) { continue }
    foreach ($p in $item.PSObject.Properties) {
      if ($p.Name -match '^PS' -or [string]::IsNullOrWhiteSpace([string]$p.Value)) { continue }
      if ($instanceMap.Keys -notcontains $p.Name) { $instanceMap[$p.Name] = [string]$p.Value }
    }
  }

  if ($instanceMap.Count -eq 0) {
    $o.SQL_Instancia = 'No SQL'
    $o.SQL_Version = 'No SQL'
    $o.SQL_Ultima_Actualizacion = 'No SQL'
  } else {
    $instParts = @(); $verParts = @(); $updParts = @()
    $many = $instanceMap.Count -gt 1
    foreach ($instName in @($instanceMap.Keys)) {
      $setup = Get-SqlSetup $instanceMap[$instName]
      $build = ''
      $edition = ''
      $fileDate = ''
      if ($setup) {
        if ($setup.PatchLevel) { $build = [string]$setup.PatchLevel }
        elseif ($setup.Version) { $build = [string]$setup.Version }
        if ($setup.Edition) { $edition = ([string]$setup.Edition).Trim() }
        $sqlPath = [string]$setup.SQLPath
        if ($sqlPath) {
          $exe = Join-Path $sqlPath 'Binn\sqlservr.exe'
          if (Test-Path $exe) { $fileDate = (Get-Item $exe).LastWriteTime.ToString('yyyy-MM-dd') }
        }
      }
      $live = Get-SqlServerProperties $instName
      if ($live) {
        if ($live.ProductVersion) { $build = [string]$live.ProductVersion }
        if ($live.Edition) { $edition = ([string]$live.Edition).Trim() }
      }
      $product = Get-SqlProductName $build
      $verTxt = ($product, $build, $(if ($edition) { $edition } else { $null }) | Where-Object { $_ }) -join ' | '
      if (-not $verTxt) { $verTxt = 'sin datos de version' }
      $updBits = @()
      if ($live) {
        $lvl = @()
        if ($live.ProductLevel -and $live.ProductLevel -ne 'RTM') { $lvl += [string]$live.ProductLevel }
        if ($live.ProductUpdateLevel) { $lvl += [string]$live.ProductUpdateLevel }
        if ($lvl.Count) { $updBits += ($lvl -join ' ') }
        if ($live.ProductUpdateReference) { $updBits += [string]$live.ProductUpdateReference }
      }
      if ($build) { $updBits += $build }
      if ($fileDate) { $updBits += $fileDate }
      $updTxt = if ($updBits.Count) { ($updBits | Select-Object -Unique) -join ' | ' } else { 'sin datos' }
      if ($many) {
        $instParts += $instName
        $verParts += "${instName}: $verTxt"
        $updParts += "${instName}: $updTxt"
      } else {
        $instParts += $instName
        $verParts += $verTxt
        $updParts += $updTxt
      }
    }
    $o.SQL_Instancia = ($instParts -join ' | ')
    $o.SQL_Version = ($verParts -join ' | ')
    $o.SQL_Ultima_Actualizacion = ($updParts -join ' | ')
  }
} catch {
  $o.SQL_Instancia = 'No SQL'
  $o.SQL_Version = 'No SQL'
  $o.SQL_Ultima_Actualizacion = 'No SQL'
}
try {
  Ensure-WuServicesRunning
  $searchErr = ""
  $wuResult = $null
  try {
    $wuResult = (Invoke-WuOnlineSearch).Result
  } catch { $searchErr = $_.Exception.Message }
  Merge-ReportError (Get-WuWsusErrors $searchErr)
  if ($wuResult -and $wuResult.Updates.Count -eq 0) {
    $o.Nota_Updates = "Sin updates para instalar"
  }
} catch {}

($o | ConvertTo-Json -Compress) | Set-Content -Path "$base\report.json" -Encoding UTF8
'@
Set-Content -Path $script:LocalReportWorker -Value $script:ReportWorker -Encoding UTF8
$script:ReportWorker = $null

# Consulta de KBs pendientes (no instala). Escribe consult.json en el destino.
$script:ConsultWorker = @'
param([string]$CheckKBs = "")
$ErrorActionPreference = "SilentlyContinue"
$base = "C:\Windows\Temp\WUU"
New-Item -ItemType Directory -Path $base -Force | Out-Null
$o = [ordered]@{
  Servidor=""; Sistema_Operativo=""; IP="";
  SQL_Instancia=""; SQL_Version=""; SQL_Ultima_Actualizacion="";
  KBs_Disponibles=""; Cantidad_KBs="0";
  Fecha_Ultima_Actualizacion=""; Fecha_Ultimo_Reinicio="";
  KBs_Consultadas=""; KBs_Presentes=""; KBs_Ausentes=""; KBs_Estado=""; Error=""
}
function Ensure-WuServicesRunning {
  foreach ($name in @('wuauserv','cryptSvc','bits','msiserver')) {
    try {
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ([string]$svc.StartType -eq 'Disabled') {
        $mode = if ($name -eq 'msiserver') { 'Manual' } else { 'Automatic' }
        Set-Service -Name $name -StartupType $mode -ErrorAction SilentlyContinue
      }
      $svc.Refresh()
      if ($svc.Status -eq 'Running') { continue }
      if ([string]$svc.Status -match 'Pending') {
        try { $svc.WaitForStatus('Stopped', [TimeSpan]::FromSeconds(20)) } catch {}
        $svc.Refresh()
        if ([string]$svc.Status -match 'Pending') {
          try { Stop-Service -Name $name -Force -ErrorAction SilentlyContinue } catch {}
          Start-Sleep -Seconds 2
          $svc.Refresh()
        }
        if ([string]$svc.Status -match 'Pending') {
          try {
            cmd.exe /c "sc stop $name" 2>$null | Out-Null
            Start-Sleep -Seconds 1
            cmd.exe /c "taskkill /F /FI `"SERVICES eq $name`"" 2>$null | Out-Null
          } catch {}
          Start-Sleep -Seconds 2
        }
      }
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ($svc.Status -ne 'Running') {
        try { Start-Service -Name $name -ErrorAction Stop } catch { net.exe start $name 2>$null | Out-Null }
        try { $svc.WaitForStatus('Running', [TimeSpan]::FromSeconds(30)) } catch {}
      }
    } catch {
      try { net.exe start $name 2>$null | Out-Null } catch {}
    }
  }
}
try { $o.Servidor = [System.Net.Dns]::GetHostName() } catch {}
try { $o.Sistema_Operativo = (Get-CimInstance Win32_OperatingSystem).Caption } catch {}
try {
  $o.IP = (Get-NetIPAddress -AddressFamily IPv4 |
           Where-Object { $_.IPAddress -notmatch "^(127\.|169\.254\.)" } |
           Select-Object -First 1 -ExpandProperty IPAddress)
} catch {}
try {
  $latest = @(Get-HotFix | Where-Object { $_.InstalledOn } | Sort-Object InstalledOn -Descending | Select-Object -First 1)
  if ($latest) { $o.Fecha_Ultima_Actualizacion = ([datetime]$latest.InstalledOn).ToString("yyyy-MM-dd") }
} catch {}
try {
  $boot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
  $o.Fecha_Ultimo_Reinicio = $boot.ToString("yyyy-MM-dd HH:mm:ss")
} catch {}
try {
  function Get-SqlProductName([string]$build) {
    if ([string]::IsNullOrWhiteSpace($build)) { return 'SQL Server' }
    $parts = $build.Split('.')
    $maj = 0; $min = 0
    [void][int]::TryParse($parts[0], [ref]$maj)
    if ($parts.Count -gt 1) { [void][int]::TryParse($parts[1], [ref]$min) }
    switch ($maj) {
      16 { return 'SQL Server 2022' }
      15 { return 'SQL Server 2019' }
      14 { return 'SQL Server 2017' }
      13 { return 'SQL Server 2016' }
      12 { return 'SQL Server 2014' }
      11 { return 'SQL Server 2012' }
      10 { if ($min -ge 50) { return 'SQL Server 2008 R2' } else { return 'SQL Server 2008' } }
      9  { return 'SQL Server 2005' }
      default { return "SQL Server $maj" }
    }
  }
  function Get-SqlSetup([string]$instanceId) {
    foreach ($root in @(
      "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\$instanceId\Setup",
      "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Microsoft SQL Server\$instanceId\Setup"
    )) {
      if (Test-Path $root) { return Get-ItemProperty -Path $root -ErrorAction SilentlyContinue }
    }
    return $null
  }
  function Get-SqlServerProperties([string]$instanceName) {
    $dataSource = if ($instanceName -eq 'MSSQLSERVER') { 'localhost' } else { "localhost\$instanceName" }
    $cs = "Data Source=$dataSource;Integrated Security=True;Connect Timeout=2;Encrypt=False;TrustServerCertificate=True;Application Name=WUU-Consult"
    $conn = $null
    try {
      $conn = New-Object System.Data.SqlClient.SqlConnection $cs
      $conn.Open()
      $cmd = $conn.CreateCommand()
      $cmd.CommandTimeout = 5
      $cmd.CommandText = 'SELECT CAST(SERVERPROPERTY(''ProductVersion'') AS nvarchar(128)), CAST(SERVERPROPERTY(''ProductLevel'') AS nvarchar(128)), CAST(SERVERPROPERTY(''ProductUpdateLevel'') AS nvarchar(128)), CAST(SERVERPROPERTY(''ProductUpdateReference'') AS nvarchar(128)), CAST(SERVERPROPERTY(''Edition'') AS nvarchar(128))'
      $r = $cmd.ExecuteReader()
      if ($r.Read()) {
        return @{
          ProductVersion         = [string]$r.GetValue(0)
          ProductLevel           = [string]$r.GetValue(1)
          ProductUpdateLevel     = [string]$r.GetValue(2)
          ProductUpdateReference = [string]$r.GetValue(3)
          Edition                = [string]$r.GetValue(4)
        }
      }
    } catch {
    } finally {
      if ($conn) { try { $conn.Close(); $conn.Dispose() } catch {} }
    }
    return $null
  }
  $instanceMap = [ordered]@{}
  foreach ($namesKey in @(
    'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL',
    'HKLM:\SOFTWARE\Wow6432Node\Microsoft\Microsoft SQL Server\Instance Names\SQL'
  )) {
    if (-not (Test-Path $namesKey)) { continue }
    $item = Get-ItemProperty -Path $namesKey -ErrorAction SilentlyContinue
    if (-not $item) { continue }
    foreach ($p in $item.PSObject.Properties) {
      if ($p.Name -match '^PS' -or [string]::IsNullOrWhiteSpace([string]$p.Value)) { continue }
      if ($instanceMap.Keys -notcontains $p.Name) { $instanceMap[$p.Name] = [string]$p.Value }
    }
  }
  if ($instanceMap.Count -gt 0) {
    $instParts = @(); $verParts = @(); $updParts = @()
    $many = $instanceMap.Count -gt 1
    foreach ($instName in @($instanceMap.Keys)) {
      $setup = Get-SqlSetup $instanceMap[$instName]
      $build = ''; $edition = ''; $fileDate = ''
      if ($setup) {
        if ($setup.PatchLevel) { $build = [string]$setup.PatchLevel }
        elseif ($setup.Version) { $build = [string]$setup.Version }
        if ($setup.Edition) { $edition = ([string]$setup.Edition).Trim() }
        $sqlPath = [string]$setup.SQLPath
        if ($sqlPath) {
          $exe = Join-Path $sqlPath 'Binn\sqlservr.exe'
          if (Test-Path $exe) { $fileDate = (Get-Item $exe).LastWriteTime.ToString('yyyy-MM-dd') }
        }
      }
      $live = Get-SqlServerProperties $instName
      if ($live) {
        if ($live.ProductVersion) { $build = [string]$live.ProductVersion }
        if ($live.Edition) { $edition = ([string]$live.Edition).Trim() }
      }
      $product = Get-SqlProductName $build
      $verTxt = ($product, $build, $(if ($edition) { $edition } else { $null }) | Where-Object { $_ }) -join ' | '
      if (-not $verTxt) { $verTxt = 'sin datos de version' }
      $updBits = @()
      if ($live) {
        $lvl = @()
        if ($live.ProductLevel -and $live.ProductLevel -ne 'RTM') { $lvl += [string]$live.ProductLevel }
        if ($live.ProductUpdateLevel) { $lvl += [string]$live.ProductUpdateLevel }
        if ($lvl.Count) { $updBits += ($lvl -join ' ') }
        if ($live.ProductUpdateReference) { $updBits += [string]$live.ProductUpdateReference }
      }
      if ($build) { $updBits += $build }
      if ($fileDate) { $updBits += $fileDate }
      $updTxt = if ($updBits.Count) { ($updBits | Select-Object -Unique) -join ' | ' } else { 'sin datos' }
      if ($many) {
        $instParts += $instName
        $verParts += "${instName}: $verTxt"
        $updParts += "${instName}: $updTxt"
      } else {
        $instParts += $instName
        $verParts += $verTxt
        $updParts += $updTxt
      }
    }
    $o.SQL_Instancia = ($instParts -join ' | ')
    $o.SQL_Version = ($verParts -join ' | ')
    $o.SQL_Ultima_Actualizacion = ($updParts -join ' | ')
  }
} catch {}
try {
  $requested = @()
  foreach ($part in @("$CheckKBs" -split '[,;]+')) {
    $t = "$part".Trim().ToUpper()
    if (-not $t) { continue }
    $t = $t -replace '^KB',''
    if ($t -match '^\d+$') {
      $id = "KB$t"
      if ($requested -notcontains $id) { $requested += $id }
    }
  }
  if ($requested.Count -gt 0) {
    $installedIds = @()
    foreach ($hf in @(Get-HotFix)) {
      $hid = "$($hf.HotFixID)".Trim().ToUpper()
      if ($hid -and $installedIds -notcontains $hid) { $installedIds += $hid }
    }
    $presentes = @(); $ausentes = @(); $estado = @()
    foreach ($id in $requested) {
      if ($installedIds -contains $id) {
        $presentes += $id
        $estado += "${id}: SI"
      } else {
        $ausentes += $id
        $estado += "${id}: NO"
      }
    }
    $o.KBs_Consultadas = ($requested -join ", ")
    $o.KBs_Presentes = ($presentes -join ", ")
    $o.KBs_Ausentes = ($ausentes -join ", ")
    $o.KBs_Estado = ($estado -join " | ")
  }
} catch {}
function Test-IsWsusManaged {
  try {
    $use = (Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' -ErrorAction SilentlyContinue).UseWUServer
    if ("$use" -eq '1') {
      $srv = (Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate' -ErrorAction SilentlyContinue).WUServer
      if ("$srv".Trim()) { return $true }
    }
  } catch {}
  return $false
}
function Invoke-WuOnlineSearch([string]$Query = 'IsInstalled=0 and IsHidden=0') {
  $session = New-Object -ComObject Microsoft.Update.Session
  try { $session.ClientApplicationID = 'WUU' } catch {}
  $sels = New-Object System.Collections.ArrayList
  if (Test-IsWsusManaged) { [void]$sels.Add(1) } else {
    [void]$sels.Add(2)
    try {
      $sm = New-Object -ComObject Microsoft.Update.ServiceManager
      foreach ($svc in @($sm.Services)) {
        if ($svc.ServiceID -eq '7971f918-a847-4430-9279-4a52d1efe18d' -and $svc.IsEnabled) { [void]$sels.Add(3); break }
      }
    } catch {}
  }
  $lastErr = $null; $empty = $null
  foreach ($sel in @($sels)) {
    try {
      $searcher = $session.CreateUpdateSearcher()
      $searcher.Online = $true
      $searcher.ServerSelection = [int]$sel
      if ([int]$sel -eq 3) { $searcher.ServiceID = '7971f918-a847-4430-9279-4a52d1efe18d' }
      $result = $searcher.Search($Query)
      if ($result.Updates.Count -gt 0) { return @{ Session = $session; Searcher = $searcher; Result = $result } }
      $empty = @{ Session = $session; Searcher = $searcher; Result = $result }
    } catch { $lastErr = $_.Exception.Message }
  }
  if ($empty) { return $empty }
  if ($lastErr) { throw $lastErr }
  throw 'No se pudo consultar Windows Update'
}
try {
  Ensure-WuServicesRunning
  $wu = Invoke-WuOnlineSearch
  $session = $wu.Session
  $searcher = $wu.Searcher
  $result = $wu.Result
  $kbList = @()
  foreach ($u in @($result.Updates)) {
    $ids = @()
    try { $ids = @($u.KBArticleIDs | ForEach-Object { if ($_) { "KB$_" } }) } catch {}
    if ($ids.Count -gt 0) {
      foreach ($id in $ids) { if ($id -and $kbList -notcontains $id) { $kbList += $id } }
    } else {
      $t = "$($u.Title)".Trim()
      if ($t -and $kbList -notcontains $t) { $kbList += $t }
    }
  }
  $o.KBs_Disponibles = ($kbList -join ", ")
  $o.Cantidad_KBs = [string]$kbList.Count
} catch {
  $o.Error = $_.Exception.Message
  if (-not $o.Error) { $o.Error = "No se pudo consultar Windows Update" }
}
($o | ConvertTo-Json -Compress) | Set-Content -Path "$base\consult.json" -Encoding UTF8
'@
Set-Content -Path $script:LocalConsultWorker -Value $script:ConsultWorker -Encoding UTF8
$script:ConsultWorker = $null

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
function Ensure-WuServicesRunning {
  foreach ($name in @('wuauserv','cryptSvc','bits','msiserver')) {
    try {
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ([string]$svc.StartType -eq 'Disabled') {
        $mode = if ($name -eq 'msiserver') { 'Manual' } else { 'Automatic' }
        Set-Service -Name $name -StartupType $mode -ErrorAction SilentlyContinue
      }
      $svc.Refresh()
      if ($svc.Status -eq 'Running') { continue }
      if ([string]$svc.Status -match 'Pending') {
        try { $svc.WaitForStatus('Stopped', [TimeSpan]::FromSeconds(20)) } catch {}
        $svc.Refresh()
        if ([string]$svc.Status -match 'Pending') {
          try { Stop-Service -Name $name -Force -ErrorAction SilentlyContinue } catch {}
          Start-Sleep -Seconds 2
          $svc.Refresh()
        }
        if ([string]$svc.Status -match 'Pending') {
          try {
            cmd.exe /c "sc stop $name" 2>$null | Out-Null
            Start-Sleep -Seconds 1
            cmd.exe /c "taskkill /F /FI `"SERVICES eq $name`"" 2>$null | Out-Null
          } catch {}
          Start-Sleep -Seconds 2
        }
      }
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ($svc.Status -ne 'Running') {
        try { Start-Service -Name $name -ErrorAction Stop } catch { net.exe start $name 2>$null | Out-Null }
        try { $svc.WaitForStatus('Running', [TimeSpan]::FromSeconds(30)) } catch {}
      }
    } catch {
      try { net.exe start $name 2>$null | Out-Null } catch {}
    }
  }
}
try {
  Ensure-WuServicesRunning
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

# Verificacion ligera tras el reinicio: deja Running los servicios WU y, si
# existen, Atiyo / MSSQLSERVER / SQLSERVERAGENT. Cuenta updates pendientes.
# Escribe verify.json.
$script:VerifyWorker = @'
$ErrorActionPreference = "SilentlyContinue"
$base = "C:\Windows\Temp\WUU"; New-Item -ItemType Directory -Path $base -Force | Out-Null
$o = [ordered]@{ available=0; rebootRequired=$false; error=""; services="" }
$script:WuSvcNames = @('wuauserv','cryptSvc','bits','msiserver')
$script:OptionalSvcNames = @('Atiyo','MSSQLSERVER','SQLSERVERAGENT')
function Ensure-WuServicesRunning {
  foreach ($name in $script:WuSvcNames) {
    try {
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ([string]$svc.StartType -eq 'Disabled') {
        $mode = if ($name -eq 'msiserver') { 'Manual' } else { 'Automatic' }
        Set-Service -Name $name -StartupType $mode -ErrorAction SilentlyContinue
      }
      $svc.Refresh()
      if ($svc.Status -eq 'Running') { continue }
      if ([string]$svc.Status -match 'Pending') {
        try { $svc.WaitForStatus('Stopped', [TimeSpan]::FromSeconds(20)) } catch {}
        $svc.Refresh()
        if ([string]$svc.Status -match 'Pending') {
          try { Stop-Service -Name $name -Force -ErrorAction SilentlyContinue } catch {}
          Start-Sleep -Seconds 2
          $svc.Refresh()
        }
        if ([string]$svc.Status -match 'Pending') {
          try {
            cmd.exe /c "sc stop $name" 2>$null | Out-Null
            Start-Sleep -Seconds 1
            cmd.exe /c "taskkill /F /FI `"SERVICES eq $name`"" 2>$null | Out-Null
          } catch {}
          Start-Sleep -Seconds 2
        }
      }
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ($svc.Status -ne 'Running') {
        try { Start-Service -Name $name -ErrorAction Stop } catch { net.exe start $name 2>$null | Out-Null }
        try { $svc.WaitForStatus('Running', [TimeSpan]::FromSeconds(30)) } catch {}
      }
    } catch {
      try { net.exe start $name 2>$null | Out-Null } catch {}
    }
  }
}
function Ensure-OptionalServiceRunning([string]$name, [int]$waitSec = 90) {
  try { $svc = Get-Service -Name $name -ErrorAction Stop } catch { return }
  try {
    if ([string]$svc.StartType -eq 'Disabled') {
      Set-Service -Name $name -StartupType Automatic -ErrorAction SilentlyContinue
    }
    $svc.Refresh()
    if ($svc.Status -eq 'Running') { return }
    if ([string]$svc.Status -match 'StartPending') {
      try { $svc.WaitForStatus('Running', [TimeSpan]::FromSeconds($waitSec)) } catch {}
      $svc.Refresh()
      if ($svc.Status -eq 'Running') { return }
    }
    if ([string]$svc.Status -match 'StopPending') {
      try { $svc.WaitForStatus('Stopped', [TimeSpan]::FromSeconds(40)) } catch {}
      $svc.Refresh()
    }
    if ($svc.Status -ne 'Running') {
      try { Start-Service -Name $name -ErrorAction Stop } catch { net.exe start $name 2>$null | Out-Null }
      try { $svc.WaitForStatus('Running', [TimeSpan]::FromSeconds($waitSec)) } catch {}
    }
  } catch {}
}
function Get-RequiredServicesStatus {
  $ok = @(); $bad = @()
  foreach ($name in $script:WuSvcNames) {
    try {
      $st = Get-Service -Name $name -ErrorAction Stop
      if ($st.Status -eq 'Running') { $ok += $name } else { $bad += "$name=$($st.Status)" }
    } catch { $bad += "$name=no disponible" }
  }
  foreach ($name in $script:OptionalSvcNames) {
    try {
      $st = Get-Service -Name $name -ErrorAction Stop
      if ($st.Status -eq 'Running') { $ok += $name } else { $bad += "$name=$($st.Status)" }
    } catch {}
  }
  return @{ Ok = $ok; Bad = $bad }
}
Ensure-WuServicesRunning
foreach ($opt in $script:OptionalSvcNames) { Ensure-OptionalServiceRunning $opt }
$svcSt = Get-RequiredServicesStatus
$o.services = if ($svcSt.Bad.Count) { $svcSt.Bad -join ', ' } else { ($svcSt.Ok -join ', ') + ' Running' }
if ($svcSt.Bad.Count) { $o.error = "Servicios no Running: $($svcSt.Bad -join ', ')" }
function Test-IsWsusManaged {
  try {
    $use = (Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' -ErrorAction SilentlyContinue).UseWUServer
    if ("$use" -eq '1') {
      $srv = (Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate' -ErrorAction SilentlyContinue).WUServer
      if ("$srv".Trim()) { return $true }
    }
  } catch {}
  return $false
}
function Invoke-WuOnlineSearch([string]$Query = 'IsInstalled=0 and IsHidden=0') {
  $session = New-Object -ComObject Microsoft.Update.Session
  try { $session.ClientApplicationID = 'WUU' } catch {}
  $sels = New-Object System.Collections.ArrayList
  if (Test-IsWsusManaged) { [void]$sels.Add(1) } else {
    [void]$sels.Add(2)
    try {
      $sm = New-Object -ComObject Microsoft.Update.ServiceManager
      foreach ($svc in @($sm.Services)) {
        if ($svc.ServiceID -eq '7971f918-a847-4430-9279-4a52d1efe18d' -and $svc.IsEnabled) { [void]$sels.Add(3); break }
      }
    } catch {}
  }
  $lastErr = $null; $empty = $null
  foreach ($sel in @($sels)) {
    try {
      $searcher = $session.CreateUpdateSearcher()
      $searcher.Online = $true
      $searcher.ServerSelection = [int]$sel
      if ([int]$sel -eq 3) { $searcher.ServiceID = '7971f918-a847-4430-9279-4a52d1efe18d' }
      $result = $searcher.Search($Query)
      if ($result.Updates.Count -gt 0) { return @{ Session = $session; Searcher = $searcher; Result = $result } }
      $empty = @{ Session = $session; Searcher = $searcher; Result = $result }
    } catch { $lastErr = $_.Exception.Message }
  }
  if ($empty) { return $empty }
  if ($lastErr) { throw $lastErr }
  throw 'No se pudo consultar Windows Update'
}
try {
  $r = (Invoke-WuOnlineSearch).Result
  $o.available = $r.Updates.Count
} catch {
  if ($o.error) { $o.error = "$($o.error) | $($_.Exception.Message)" } else { $o.error = $_.Exception.Message }
}
try { $o.rebootRequired = [bool](New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired } catch {}
try {
  ($o | ConvertTo-Json -Compress) | Set-Content -Path "$base\verify.json" -Encoding UTF8 -ErrorAction Stop
} catch {
  try { ($o | ConvertTo-Json -Compress) | Out-File -FilePath "$base\verify.json" -Encoding UTF8 } catch {}
}
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
function Ensure-WuServicesRunning {
  foreach ($name in @('wuauserv','cryptSvc','bits','msiserver')) {
    try {
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ([string]$svc.StartType -eq 'Disabled') {
        $mode = if ($name -eq 'msiserver') { 'Manual' } else { 'Automatic' }
        Set-Service -Name $name -StartupType $mode -ErrorAction SilentlyContinue
      }
      $svc.Refresh()
      if ($svc.Status -eq 'Running') { continue }
      if ([string]$svc.Status -match 'Pending') {
        try { $svc.WaitForStatus('Stopped', [TimeSpan]::FromSeconds(20)) } catch {}
        $svc.Refresh()
        if ([string]$svc.Status -match 'Pending') {
          try { Stop-Service -Name $name -Force -ErrorAction SilentlyContinue } catch {}
          Start-Sleep -Seconds 2
          $svc.Refresh()
        }
        if ([string]$svc.Status -match 'Pending') {
          try {
            cmd.exe /c "sc stop $name" 2>$null | Out-Null
            Start-Sleep -Seconds 1
            cmd.exe /c "taskkill /F /FI `"SERVICES eq $name`"" 2>$null | Out-Null
          } catch {}
          Start-Sleep -Seconds 2
        }
      }
      $svc = Get-Service -Name $name -ErrorAction Stop
      if ($svc.Status -ne 'Running') {
        try { Start-Service -Name $name -ErrorAction Stop } catch { net.exe start $name 2>$null | Out-Null }
        try { $svc.WaitForStatus('Running', [TimeSpan]::FromSeconds(30)) } catch {}
      }
    } catch {
      try { net.exe start $name 2>$null | Out-Null } catch {}
    }
  }
}
try {
  Ensure-WuServicesRunning
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
  $btnConsultar.IsEnabled = -not [bool]$script:ConsultRunning
  $btnClear.IsEnabled     = $hasRows
  $btnReport.IsEnabled    = -not [bool]$script:ReportRunning
  $hasFix = $false
  try {
    $fixDir = Join-Path $script:ScriptDir 'Fix'
    if (Test-Path $fixDir) {
      $hasFix = @(Get-ChildItem -Path $fixDir -File -ErrorAction SilentlyContinue |
                 Where-Object { $_.Extension -in @('.msu','.cab') }).Count -gt 0
    }
  } catch {}
  $btnFix.IsEnabled = $hasFix
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
    foreach ($row in @(Import-Csv -Path $f.FullName -Delimiter $delim)) {
      if (-not $row) { continue }
      $row | Add-Member -NotePropertyName '_SourcePath' -NotePropertyValue $f.FullName -Force
      $row | Add-Member -NotePropertyName '_SourceDelim' -NotePropertyValue $delim -Force
      if (@($row.PSObject.Properties.Name) -notcontains 'Version') {
        $row | Add-Member -NotePropertyName 'Version' -NotePropertyValue '' -Force
      }
      $all += $row
    }
  }

  # Validacion minima de columnas requeridas
  $cols = @($all | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name)
  foreach ($req in @('Grupo','Servidor')) {
    if ($cols -notcontains $req) {
      [System.Windows.MessageBox]::Show(
        "El CSV no tiene la columna requerida '$req'.`nColumnas esperadas: Grupo, Dominio, IP, OS, Version, Servidor, Ambiente.",
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

function Get-ServerMatchKey([string]$Name) {
  $t = "$Name".Trim().Trim([char]0x00A0).TrimEnd('.')
  if ([string]::IsNullOrWhiteSpace($t)) { return '' }
  return ($t.Split('.')[0]).ToUpperInvariant()
}

function Test-MissingInventoryValue([string]$Value, [string]$Kind) {
  $t = "$Value".Trim().Trim([char]0x00A0)
  if ([string]::IsNullOrWhiteSpace($t)) { return $true }
  if ($Kind -ne 'IP') { return $false }
  if ($t -match '[Ee]') { return $true }
  if ($t -notmatch '^\d{1,3}(\.\d{1,3}){3}$') { return $true }
  foreach ($p in $t.Split('.')) {
    $n = 0
    if (-not [int]::TryParse($p, [ref]$n) -or $n -gt 255) { return $true }
  }
  return $false
}

function Get-InventoryRowsForServer([string]$Name) {
  $key = Get-ServerMatchKey $Name
  if (-not $key) { return @() }
  return @($script:Csv | Where-Object { (Get-ServerMatchKey $_.Servidor) -eq $key })
}

function Get-InventoryFieldForServer([string]$Name, [string]$Field, [string]$AltName = '') {
  $rows = Get-InventoryRowsForServer $Name
  if ($rows.Count -eq 0 -and $AltName) { $rows = Get-InventoryRowsForServer $AltName }
  $vals = @($rows | ForEach-Object { "$($_.$Field)".Trim() } | Where-Object { $_ } | Select-Object -Unique)
  return ($vals -join ' | ')
}

function Get-InventoryGroupForServer([string]$Name, [string]$AltName = '') {
  return (Get-InventoryFieldForServer $Name 'Grupo' $AltName)
}

function Save-InventoryCsv {
  if (-not $script:Csv -or @($script:Csv).Count -eq 0) { return }
  $skip = @('_SourcePath', '_SourceDelim')
  $canonical = @('Grupo', 'Dominio', 'IP', 'OS', 'Version', 'Servidor', 'Ambiente')
  $groups = @($script:Csv | Group-Object _SourcePath)
  foreach ($g in $groups) {
    $path = "$($g.Name)"
    if (-not $path) { continue }
    $delim = "$($g.Group[0]._SourceDelim)"
    if (-not $delim) { $delim = ';' }
    $export = @(
      foreach ($row in @($g.Group)) {
        $ordered = [ordered]@{}
        foreach ($c in $canonical) { $ordered[$c] = "$($row.$c)" }
        foreach ($p in @($row.PSObject.Properties.Name)) {
          if ($canonical -contains $p -or $skip -contains $p) { continue }
          $ordered[$p] = "$($row.$p)"
        }
        [pscustomobject]$ordered
      }
    )
    try {
      $export | Export-Csv -Path $path -NoTypeInformation -Delimiter $delim -Encoding UTF8
      Write-Log 'INFO' "Inventario actualizado: $path"
    } catch {
      Write-Log 'WARN' "No se pudo guardar el inventario '$path': $($_.Exception.Message)"
    }
  }
}

function Update-InventoryFromLiveData($liveObjects) {
  $updatedRows = 0
  foreach ($o in @($liveObjects)) {
    if (-not $o) { continue }
    $queryName = ''
    try { $queryName = "$($o.QueryName)".Trim() } catch {}
    if (-not $queryName) { $queryName = "$($o.Servidor)".Trim() }
    $rows = Get-InventoryRowsForServer $queryName
    if ($rows.Count -eq 0) { $rows = Get-InventoryRowsForServer "$($o.Servidor)" }

    $liveName = "$($o.Servidor)".Trim().Trim([char]0x00A0)
    $liveIp   = "$($o.IP)".Trim()
    $liveOs   = "$($o.Sistema_Operativo)".Trim()
    $liveVer  = "$($o.Version_Sistema_Operativo)".Trim()

    foreach ($row in $rows) {
      $changed = $false
      $csvName = "$($row.Servidor)"
      if ((Test-MissingInventoryValue $csvName 'Name') -and $liveName) {
        $row.Servidor = $liveName; $changed = $true
      } elseif ($csvName -ne $csvName.Trim().Trim([char]0x00A0) -and $csvName.Trim().Trim([char]0x00A0)) {
        $row.Servidor = $csvName.Trim().Trim([char]0x00A0); $changed = $true
      }
      if ((Test-MissingInventoryValue $row.IP 'IP') -and -not (Test-MissingInventoryValue $liveIp 'IP')) {
        $row.IP = $liveIp; $changed = $true
      }
      if ((Test-MissingInventoryValue $row.OS 'OS') -and $liveOs) {
        $row.OS = $liveOs; $changed = $true
      }
      if ((Test-MissingInventoryValue $row.Version 'Version') -and $liveVer) {
        $row.Version = $liveVer; $changed = $true
      }
      if ($changed) { $updatedRows++ }
    }

    $inv = $rows | Select-Object -First 1
    if ($inv) {
      if ((Test-MissingInventoryValue "$($o.Servidor)" 'Name') -and -not (Test-MissingInventoryValue $inv.Servidor 'Name')) {
        $o.Servidor = "$($inv.Servidor)".Trim()
      }
      if ((Test-MissingInventoryValue "$($o.IP)" 'IP') -and -not (Test-MissingInventoryValue $inv.IP 'IP')) {
        $o.IP = "$($inv.IP)".Trim()
      }
      if ([string]::IsNullOrWhiteSpace("$($o.Sistema_Operativo)") -and "$($inv.OS)".Trim()) {
        $o.Sistema_Operativo = "$($inv.OS)".Trim()
      }
      if ([string]::IsNullOrWhiteSpace("$($o.Version_Sistema_Operativo)") -and "$($inv.Version)".Trim()) {
        $o.Version_Sistema_Operativo = "$($inv.Version)".Trim()
      }
    } elseif ((Test-MissingInventoryValue "$($o.Servidor)" 'Name') -and $queryName) {
      $o.Servidor = $queryName
    }
  }

  if ($updatedRows -gt 0) {
    Save-InventoryCsv
    Write-Log 'INFO' "Inventario: $updatedRows fila(s) completadas (Nombre/IP/OS/Version)."
    if ($script:Servers) {
      foreach ($sr in @($script:Servers)) {
        $inv = Get-InventoryRowsForServer $sr.Servidor | Select-Object -First 1
        if ($inv -and -not (Test-MissingInventoryValue $inv.IP 'IP')) { $sr.IP = "$($inv.IP)".Trim() }
        if ($inv -and -not (Test-MissingInventoryValue $inv.Servidor 'Name')) { $sr.Servidor = "$($inv.Servidor)".Trim() }
      }
    }
  }
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

function Join-ReportComments([string]$Existing, [bool]$Snap, [bool]$Confirmado, [bool]$IncludeProcessFlags = $true) {
  $parts = New-Object System.Collections.Generic.List[string]
  if ("$Existing".Trim()) { [void]$parts.Add("$Existing".Trim()) }
  if ($IncludeProcessFlags) {
    [void]$parts.Add((Get-SnapReportText $Snap))
    [void]$parts.Add((Get-ConfirmadoReportText $Confirmado))
  }
  return ($parts -join ' | ')
}

function Test-ReportConnectionFailure([string]$ErrorText) {
  $err = "$ErrorText".Trim()
  if (-not $err) { return $false }
  return ($err -match '(?i)sin conexi[oó]n|falla de conexi[oó]n|sin datos|host desconocido|no se alcanza|psexec|error 53|network path')
}

function Test-ReportKbInstallError([string]$ErrorText) {
  $err = "$ErrorText".Trim()
  if (-not $err) { return $false }
  return ($err -match '(?i)\bKB\d+|instalaci[oó]n|install(ar|ation)?|wusa|dism|hotfix|windows ?update|0x8024|0x800f')
}

function Get-ReportEstado {
  param(
    [string]$Kbs = '',
    [string]$ErrorText = '',
    [string]$NotaUpdates = '',
    [bool]$Snap = $false,
    [bool]$Confirmado = $false,
    [bool]$UseProcessFlags = $false
  )
  $kbs = "$Kbs".Trim()
  $err = "$ErrorText".Trim()
  $nota = "$NotaUpdates".Trim()
  $hasKb = ($kbs -and $kbs -notmatch '^(N/?A|-)$')
  if (Test-ReportConnectionFailure $err) { return 'No actualizado' }
  if ($hasKb) { return 'Actualizado' }
  if ($nota -match '(?i)sin updates') { return 'Actualizado' }
  if ($err -and (Test-ReportKbInstallError $err) -and -not $hasKb) { return 'No actualizado' }
  if ($err -and -not (Test-ReportKbInstallError $err)) { return 'Actualizado' }
  if ($UseProcessFlags -and -not $Snap -and -not $Confirmado) { return 'No actualizado' }
  return 'Actualizado'
}

function Get-DashboardCalendarUrl {
  $url = "$($script:Cfg.Dashboard.CalendarUrl)".Trim()
  if ($url) { return $url }
  $upload = "$($script:Cfg.Dashboard.Url)".Trim()
  if ($upload -match '/api/upload/?$') { return ($upload -replace '/api/upload/?$','/api/calendar') }
  return ''
}

function Sync-ScheduleToDashboard {
  param(
    [ValidateSet('upsert','delete')][string]$Action,
    [string]$Kind,
    [string]$TaskName,
    [datetime]$ScheduledAt = [datetime]::MinValue,
    [string]$Recurrence = '',
    [hashtable]$Details = $null
  )
  if (-not [bool]$script:Cfg.Dashboard.Enabled) { return }
  $url = Get-DashboardCalendarUrl
  if (-not $url) { return }
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $payload = [ordered]@{
      Action          = $Action
      Kind            = $Kind
      TaskName        = $TaskName
      ScheduledAt     = $(if ($ScheduledAt -gt [datetime]::MinValue) { $ScheduledAt.ToString('o') } else { $null })
      Recurrence      = $Recurrence
      SourceComputer  = $env:COMPUTERNAME
      Analyst         = "$script:AnalistaAsignado".Trim()
      Details         = $(if ($Details) { $Details } else { @{} })
    }
    $body = $payload | ConvertTo-Json -Depth 6 -Compress
    Invoke-WebRequest -Uri $url -Method Post -Body $body `
      -ContentType 'application/json; charset=utf-8' -TimeoutSec 20 -UseBasicParsing | Out-Null
    Write-Log 'INFO' "Calendario Centro de Control: $Action $Kind '$TaskName'"
  } catch {
    Write-Log 'WARN' "No se pudo sincronizar el calendario ($Action $Kind '$TaskName'): $($_.Exception.Message)"
  }
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
        Analista                  = $_.Analista
        Grupo                     = $_.Grupo
        Ambiente                  = $_.Ambiente
        Dominio                   = $_.Dominio
        Servidor                  = $_.Servidor
        IP                        = $_.IP
        Sistema_Operativo         = $_.Sistema_Operativo
        Version_Sistema_Operativo = $_.Version_Sistema_Operativo
        SQL_Instancia             = $_.SQL_Instancia
        SQL_Version               = $_.SQL_Version
        SQL_Ultima_Actualizacion  = $_.SQL_Ultima_Actualizacion
        Fecha_Ventana             = $_.Fecha_Ventana
        Fecha_Instalacion         = $_.Fecha_Instalacion
        KBs_Instaladas            = $_.KBs_Instaladas
        Fecha_Reinicio            = $_.Fecha_Reinicio
        Running_Time              = $_.Running_Time
        Estado                    = $_.Estado
        Descripcion_Error         = $_.Descripcion_Error
        Comentarios               = $_.Comentarios
        Disk_Space                = $_.Disk_Space
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
        Analista                  = $_.Analista
        Grupo                     = $_.Grupo
        Ambiente                  = $_.Ambiente
        Dominio                   = $_.Dominio
        Servidor                  = $_.Servidor
        IP                        = $_.IP
        Sistema_Operativo         = $_.Sistema_Operativo
        Version_Sistema_Operativo = $_.Version_Sistema_Operativo
        SQL_Instancia             = $_.SQL_Instancia
        SQL_Version               = $_.SQL_Version
        SQL_Ultima_Actualizacion  = $_.SQL_Ultima_Actualizacion
        Fecha_Ventana             = $_.Fecha_Ventana
        Fecha_Instalacion         = $_.Fecha_Instalacion
        KBs_Instaladas            = $_.KBs_Instaladas
        Fecha_Reinicio            = $_.Fecha_Reinicio
        Running_Time              = $_.Running_Time
        Estado                    = $_.Estado
        Descripcion_Error         = $_.Descripcion_Error
        Comentarios               = $_.Comentarios
        Disk_Space                = $_.Disk_Space
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
        <DataGridTextColumn Header="Analista"          Binding="{Binding Analista}"                   Width="140"/>
        <DataGridTextColumn Header="Grupo"             Binding="{Binding Grupo}"                     Width="120"/>
        <DataGridTextColumn Header="Ambiente"          Binding="{Binding Ambiente}"                  Width="120"/>
        <DataGridTextColumn Header="Dominio"           Binding="{Binding Dominio}"                   Width="120"/>
        <DataGridTextColumn Header="Servidor"          Binding="{Binding Servidor}"                  Width="130"/>
        <DataGridTextColumn Header="IP"                Binding="{Binding IP}"                        Width="110"/>
        <DataGridTextColumn Header="Sistema Operativo" Binding="{Binding Sistema_Operativo}"         Width="170"/>
        <DataGridTextColumn Header="Version SO"        Binding="{Binding Version_Sistema_Operativo}" Width="120"/>
        <DataGridTextColumn Header="SQL Instancia"     Binding="{Binding SQL_Instancia}"             Width="130"/>
        <DataGridTextColumn Header="SQL Version"       Binding="{Binding SQL_Version}"               Width="220"/>
        <DataGridTextColumn Header="SQL Ult. Act."     Binding="{Binding SQL_Ultima_Actualizacion}"  Width="200"/>
        <DataGridTextColumn Header="Fecha Ventana"     Binding="{Binding Fecha_Ventana}"             Width="120"/>
        <DataGridTextColumn Header="Fecha Instalacion" Binding="{Binding Fecha_Instalacion}"         Width="130"/>
        <DataGridTextColumn Header="KBs Instaladas"    Binding="{Binding KBs_Instaladas}"            Width="200"/>
        <DataGridTextColumn Header="Fecha Reinicio"    Binding="{Binding Fecha_Reinicio}"            Width="150"/>
        <DataGridTextColumn Header="Running Time"      Binding="{Binding Running_Time}"              Width="110"/>
        <DataGridTextColumn Header="Estado"            Binding="{Binding Estado}"                    Width="120"/>
        <DataGridTextColumn Header="Disk Space"        Binding="{Binding Disk_Space}"                Width="180"/>
        <DataGridTextColumn Header="Descripcion Error" Binding="{Binding Descripcion_Error}"         Width="220"/>
        <DataGridTextColumn Header="Comentarios"       Binding="{Binding Comentarios}"               Width="360"/>
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

# Recolecta el reporte: grilla visible, o grupo + fecha + motivo si la grilla esta vacia
function Show-ReportScopeDialog {
  $groupNames = @($script:Csv | ForEach-Object { "$($_.Grupo)".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
  if ($groupNames.Count -eq 0) {
    [System.Windows.MessageBox]::Show('No hay grupos en el inventario CSV.','WUU','OK','Information') | Out-Null
    return $null
  }
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Reporte por grupo" Height="340" Width="480"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="20">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Grid.Row="0" Text="No hay servidores en la grilla. Elegi grupo, fecha de ventana y motivo."
               TextWrapping="Wrap" Margin="0,0,0,14"/>
    <Grid Grid.Row="1" Margin="0,0,0,8">
      <Grid.ColumnDefinitions><ColumnDefinition Width="110"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
      <TextBlock Grid.Column="0" Text="Grupo:" VerticalAlignment="Center"/>
      <ComboBox x:Name="cmbGroup" Grid.Column="1" Padding="4,3"/>
    </Grid>
    <Grid Grid.Row="2" Margin="0,0,0,8">
      <Grid.ColumnDefinitions><ColumnDefinition Width="110"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
      <TextBlock Grid.Column="0" Text="Fecha ventana:" VerticalAlignment="Center"/>
      <TextBox x:Name="txtDate" Grid.Column="1" Padding="4,3"
               ToolTip="dd/mm/aaaa. Se escribe en Fecha_Ventana y filtra las KB instaladas ese dia."/>
    </Grid>
    <Grid Grid.Row="3" Margin="0,0,0,8">
      <Grid.ColumnDefinitions><ColumnDefinition Width="110"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
      <TextBlock Grid.Column="0" Text="Motivo:" VerticalAlignment="Top" Margin="0,6,0,0"/>
      <TextBox x:Name="txtMotivo" Grid.Column="1" Padding="4,3" Height="70" TextWrapping="Wrap"
               AcceptsReturn="True" VerticalScrollBarVisibility="Auto"/>
    </Grid>
    <TextBlock x:Name="lblErr" Grid.Row="4" Foreground="#FFDC2626" TextWrapping="Wrap"/>
    <DockPanel Grid.Row="5" LastChildFill="False" HorizontalAlignment="Right" Margin="0,10,0,0">
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" Margin="0,0,8,0" IsCancel="True"/>
      <Button x:Name="btnOk" Content="Generar reporte" Padding="14,7" IsDefault="True"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $sx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $cmb = $win.FindName('cmbGroup')
  $txtDate = $win.FindName('txtDate')
  $txtMotivo = $win.FindName('txtMotivo')
  $lblErr = $win.FindName('lblErr')
  $cmb.ItemsSource = $groupNames
  $cmb.SelectedIndex = 0
  $txtDate.Text = (Get-Date).ToString('dd/MM/yyyy')
  $box = @{ Result = $null }
  $fnParseDate = ${function:Parse-ScheduledDateDMY}
  $csvRef = @($script:Csv)
  $win.FindName('btnOk').Add_Click({
    try {
      $group = "$($cmb.SelectedItem)".Trim()
      if (-not $group) { throw 'Selecciona un grupo.' }
      $motivo = "$($txtMotivo.Text)".Trim()
      if (-not $motivo) { throw 'Ingresa el motivo del reporte.' }
      $parsed = & $fnParseDate $txtDate.Text.Trim() 0 0
      $servers = @($csvRef | Where-Object { "$($_.Grupo)".Trim() -ieq $group } |
        ForEach-Object { "$($_.Servidor)".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
      if ($servers.Count -eq 0) { throw "El grupo '$group' no contiene servidores validos." }
      $box.Result = [pscustomobject]@{
        Group = $group
        Date = $parsed
        Motivo = $motivo
        Servers = $servers
      }
      $win.DialogResult = $true
      $win.Close()
    } catch {
      $lblErr.Text = $_.Exception.Message
    }
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({
    $box.Result = $null
    $win.DialogResult = $false
    $win.Close()
  }.GetNewClosure())
  try { $win.Owner = $Window } catch {}
  [void]$win.ShowDialog()
  return $box.Result
}

function Show-Report {
  if ([bool]$script:ReportRunning) { return }
  $targets = @()
  $periodMode = 'CurrentMonth'
  $specificDate = ''
  $script:RepComment = ''
  $script:RepWindowDate = (Get-Date).ToString('yyyy-MM-dd')

  if ($script:Servers.Count -gt 0) {
    $targets = @($script:Servers | ForEach-Object { $_.Servidor } | Where-Object { $_ } | Sort-Object -Unique)
  } else {
    $scope = Show-ReportScopeDialog
    if (-not $scope) { return }
    $targets = @($scope.Servers)
    $periodMode = 'SpecificDate'
    $specificDate = ([datetime]$scope.Date).ToString('yyyy-MM-dd')
    $script:RepWindowDate = $specificDate
    $script:RepComment = "$($scope.Motivo)".Trim()
    Write-Log 'INFO' "Reporte por grupo '$($scope.Group)' | fecha ventana=$specificDate | servidores=$($targets.Count) | motivo=$($script:RepComment)"
  }
  if ($targets.Count -eq 0) { return }

  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }
  foreach ($j in $script:RepPool) {
    try { $j.ps.Stop() } catch {}
    try { $j.ps.Dispose() } catch {}
    try { $j.rs.Close(); $j.rs.Dispose() } catch {}
  }

  $script:ReportRunning  = $true
  $btnReport.IsEnabled   = $false
  $script:RepOrig        = $btnReport.Content
  $script:RepBag         = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $script:RepTotal       = $targets.Count
  $script:RepDeadline    = (Get-Date).AddMinutes(10)
  $script:RepPool        = @()

  $rjob = {
    param($server, $psexec, $worker, $rel, $periodMode, $specificDate, $bag)
    $obj = $null
    try {
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\report.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\report.ps1" -Force -ErrorAction Stop
      $reportArgs = @('-ExecutionPolicy','Bypass','-NonInteractive','-File',"C:\$rel\report.ps1",'-PeriodMode',$periodMode)
      if ($periodMode -eq 'SpecificDate' -and $specificDate) { $reportArgs += @('-SpecificDate',$specificDate) }
      $null = & $psexec "\\$server" -accepteula -nobanner -s powershell.exe @reportArgs 2>&1
      if (Test-Path "$remoteDir\report.json") {
        $raw = Get-Content "$remoteDir\report.json" -Raw
        if ($raw) { $obj = $raw | ConvertFrom-Json }
      }
    } catch {}
    if (-not $obj) {
      $obj = [pscustomobject]@{
        Dominio=''; Servidor=$server; IP=''; Sistema_Operativo='';
        Version_Sistema_Operativo=''; Fecha_Instalacion=''; KBs_Instaladas='';
        Fecha_Reinicio=''; Running_Time=''; Descripcion_Error='Falla de conexion: sin conexion o sin datos'; Disk_Space=''
      }
    }
    try { $obj | Add-Member -NotePropertyName QueryName -NotePropertyValue $server -Force } catch {}
    [void]$bag.Add($obj)
  }

  foreach ($server in $targets) {
    $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState='MTA'; $rs.Open()
    $ps = [powershell]::Create(); $ps.Runspace = $rs
    $ps.AddScript($rjob.ToString()).
        AddArgument($server).AddArgument($script:PsExecPath).
        AddArgument($script:LocalReportWorker).AddArgument($script:RemoteRel).
        AddArgument($periodMode).AddArgument($specificDate).
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
    $script:ReportRunning = $false
    $btnReport.Content   = $script:RepOrig
    $btnReport.IsEnabled = $true
    Update-ButtonStates

    # Completa inventario y rellena Nombre/IP/SO/Version faltantes antes de armar el reporte
    Update-InventoryFromLiveData $script:RepBag

    # Construye las filas tipadas y ordenadas por servidor (sin duplicados)
    $rows = New-Object System.Collections.ObjectModel.ObservableCollection[object]
    $byServer = [ordered]@{}
    foreach ($o in @($script:RepBag)) {
      $name = "$($o.Servidor)".Trim()
      if (-not $name) { try { $name = "$($o.QueryName)".Trim() } catch {} }
      if ($name) { $byServer[$name] = $o }
    }
    foreach ($o in @($byServer.Values | Sort-Object { "$($_.Servidor)" })) {
      $rr = New-Object ReportRow
      $rr.Analista                  = "$($script:AnalistaAsignado)".Trim()
      $qnameForGroup = ''
      try { $qnameForGroup = "$($o.QueryName)".Trim() } catch {}
      $rr.Grupo                     = Get-InventoryGroupForServer "$($o.Servidor)" $qnameForGroup
      $rr.Ambiente                  = Get-InventoryFieldForServer "$($o.Servidor)" 'Ambiente' $qnameForGroup
      $rr.Dominio                   = "$($o.Dominio)"
      $rr.Servidor                  = "$($o.Servidor)"
      $rr.IP                        = "$($o.IP)"
      $rr.Sistema_Operativo         = "$($o.Sistema_Operativo)"
      $rr.Version_Sistema_Operativo = "$($o.Version_Sistema_Operativo)"
      $rr.SQL_Instancia             = "$($o.SQL_Instancia)"
      $rr.SQL_Version               = "$($o.SQL_Version)"
      $rr.SQL_Ultima_Actualizacion  = "$($o.SQL_Ultima_Actualizacion)"
      $rr.Fecha_Ventana             = "$($script:RepWindowDate)"
      $rr.Fecha_Instalacion         = "$($o.Fecha_Instalacion)"
      $rr.KBs_Instaladas            = "$($o.KBs_Instaladas)"
      $rr.Fecha_Reinicio            = "$($o.Fecha_Reinicio)"
      $rr.Running_Time              = "$($o.Running_Time)"
      $rr.Descripcion_Error         = "$($o.Descripcion_Error)"
      $qname = ''
      try { $qname = "$($o.QueryName)".Trim() } catch {}
      $gridRow = $script:Servers | Where-Object {
        $n = "$($_.Servidor)".Trim()
        $n -ieq "$($o.Servidor)".Trim() -or
        ($qname -and $n -ieq $qname) -or
        ((Get-ServerMatchKey $n) -and ((Get-ServerMatchKey $n) -eq (Get-ServerMatchKey $o.Servidor) -or ($qname -and (Get-ServerMatchKey $n) -eq (Get-ServerMatchKey $qname))))
      } | Select-Object -First 1
      $gridComment = if ($gridRow) { "$($gridRow.Comentarios)".Trim() } else { '' }
      $motivo = "$($script:RepComment)".Trim()
      if ($gridComment -and $motivo) {
        $rr.Comentarios = if ($gridComment -match [regex]::Escape($motivo)) { $gridComment } else { "$gridComment | $motivo" }
      } elseif ($motivo) { $rr.Comentarios = $motivo }
      elseif ($gridComment) { $rr.Comentarios = $gridComment }
      else { $rr.Comentarios = "$($o.Comentarios)" }
      $snapVal = [bool]$(if ($gridRow) { $gridRow.Snap } else { $false })
      $confVal = [bool]$(if ($gridRow) { $gridRow.Confirmado } else { $false })
      $rr.Comentarios = Join-ReportComments $rr.Comentarios $snapVal $confVal
      $nota = ''
      try { $nota = "$($o.Nota_Updates)" } catch {}
      $rr.Estado = Get-ReportEstado -Kbs $rr.KBs_Instaladas -ErrorText $rr.Descripcion_Error -NotaUpdates $nota -Snap $snapVal -Confirmado $confVal -UseProcessFlags $true
      $rr.Disk_Space                = "$($o.Disk_Space)"
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

function Show-ConsultServersDialog {
  $groupNames = @($script:Csv | ForEach-Object { "$($_.Grupo)".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Consultar servidores" Height="580" Width="520"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="20">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="150"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Grid.Row="0" Text="Consultar KBs pendientes" FontSize="15"
               FontWeight="SemiBold" Margin="0,0,0,8"/>
    <TextBlock Grid.Row="1" TextWrapping="Wrap" Foreground="#FF475569" Margin="0,0,0,8"
               Text="Marca uno o varios grupos y/o pega nombres de servidor. Opcionalmente indica KBs para ver si estan instaladas. No se instala nada."/>
    <DockPanel Grid.Row="2" Margin="0,0,0,4">
      <TextBlock Text="Grupos:" FontWeight="SemiBold" VerticalAlignment="Center"/>
      <Button x:Name="btnNoneGroups" Content="Ninguno" Padding="10,3" DockPanel.Dock="Right" Margin="6,0,0,0"/>
      <Button x:Name="btnAllGroups" Content="Todos" Padding="10,3" DockPanel.Dock="Right"/>
    </DockPanel>
    <Border Grid.Row="3" Background="White" BorderBrush="#FFCBD5E1" BorderThickness="1" CornerRadius="4" Padding="4">
      <ScrollViewer VerticalScrollBarVisibility="Auto">
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
    <Grid Grid.Row="4" Margin="0,10,0,8">
      <Grid.ColumnDefinitions><ColumnDefinition Width="70"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
      <TextBlock Grid.Column="0" Text="KBs:" VerticalAlignment="Center" FontWeight="SemiBold"/>
      <TextBox x:Name="txtKbs" Grid.Column="1" Padding="6,5"
               ToolTip="Uno o varios numeros: KB5005565, 5005566. Separadores: coma, punto y coma o espacio."/>
    </Grid>
    <TextBlock Grid.Row="5" Text="Servidores adicionales (opcional si hay grupos). Separadores: linea, coma o punto y coma."
               TextWrapping="Wrap" Foreground="#FF475569" Margin="0,0,0,6"/>
    <TextBox x:Name="txtServers" Grid.Row="6" AcceptsReturn="True" TextWrapping="NoWrap"
             VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto"
             Padding="8" FontFamily="Consolas"/>
    <TextBlock x:Name="lblErr" Grid.Row="7" Foreground="#FFDC2626" Margin="0,8,0,0"
               Text="" TextWrapping="Wrap"/>
    <DockPanel Grid.Row="8" LastChildFill="False" HorizontalAlignment="Right" Margin="0,12,0,0">
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" Margin="0,0,8,0" IsCancel="True"/>
      <Button x:Name="btnOk" Content="Consultar" Padding="14,7" IsDefault="True"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $sx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $ic = $win.FindName('icGroups')
  $txt = $win.FindName('txtServers')
  $txtKbs = $win.FindName('txtKbs')
  $lbl = $win.FindName('lblErr')
  $consultGroups = New-Object System.Collections.ObjectModel.ObservableCollection[object]
  foreach ($g in $groupNames) {
    $gi = New-Object GroupItem
    $gi.Name = $g
    $gi.IsChecked = $false
    $consultGroups.Add($gi)
  }
  $ic.ItemsSource = $consultGroups
  $box = @{ Result = $null }
  $csvRef = @($script:Csv)
  $win.FindName('btnAllGroups').Add_Click({
    foreach ($g in $consultGroups) { $g.IsChecked = $true }
  }.GetNewClosure())
  $win.FindName('btnNoneGroups').Add_Click({
    foreach ($g in $consultGroups) { $g.IsChecked = $false }
  }.GetNewClosure())
  $win.FindName('btnOk').Add_Click({
    $selected = @($consultGroups | Where-Object { $_.IsChecked } | ForEach-Object { "$($_.Name)".Trim() } | Where-Object { $_ })
    $fromGroup = @()
    if ($selected.Count -gt 0) {
      $fromGroup = @($csvRef | Where-Object {
          $gname = "$($_.Grupo)".Trim()
          @($selected | Where-Object { $_ -ieq $gname }).Count -gt 0
        } |
        ForEach-Object { "$($_.Servidor)".Trim() } | Where-Object { $_ } | Select-Object -Unique)
      if ($fromGroup.Count -eq 0) {
        $lbl.Text = 'Los grupos seleccionados no contienen servidores validos.'
        return
      }
    }
    $typed = @("$($txt.Text)" -split '[,;\r\n]+' |
      ForEach-Object { "$_".Trim() } |
      Where-Object { $_ })
    $names = @($fromGroup + $typed | Select-Object -Unique)
    if ($names.Count -eq 0) {
      $lbl.Text = 'Selecciona al menos un grupo o ingresa un nombre de servidor.'
      return
    }
    $kbList = @()
    foreach ($part in @("$($txtKbs.Text)" -split '[,;\s]+')) {
      $t = "$part".Trim()
      if (-not $t) { continue }
      $u = $t.ToUpper()
      $num = $null
      if ($u -match '^KB(\d+)$') { $num = $Matches[1] }
      elseif ($u -match '^(\d+)$') { $num = $Matches[1] }
      else {
        $lbl.Text = "KB invalida: $t. Usa 5005565 o KB5005565."
        return
      }
      $id = "KB$num"
      if ($kbList -notcontains $id) { $kbList += $id }
    }
    $box.Result = [pscustomobject]@{
      Names = $names
      KBs = ($kbList -join ',')
    }
    $win.DialogResult = $true
    $win.Close()
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({
    $box.Result = $null
    $win.DialogResult = $false
    $win.Close()
  }.GetNewClosure())
  try { $win.Owner = $Window } catch {}
  [void]$win.ShowDialog()
  return $box.Result
}

function Start-Consult {
  if ([bool]$script:ConsultRunning) { return }
  $scope = Show-ConsultServersDialog
  if (-not $scope) { return }
  $names = @($scope.Names)
  $checkKbs = "$($scope.KBs)".Trim()
  if ($names.Count -eq 0) { return }
  if (-not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show("No se encuentra PsExec.exe en:`n$script:PsExecPath","WUU",'OK','Error') | Out-Null
    return
  }

  $targets = @()
  $script:ConsultMeta = @{}
  foreach ($requested in $names) {
    $name = "$requested".Trim()
    if (-not $name) { continue }
    $inCsv = $null -ne ($script:Csv | Where-Object { "$($_.Servidor)".Trim() -ieq $name } | Select-Object -First 1)
    if (-not $script:ConsultMeta.ContainsKey($name)) {
      $script:ConsultMeta[$name] = $(if ($inCsv) { 'SI' } else { 'NO' })
      $targets += $name
    }
  }
  if ($targets.Count -eq 0) { return }

  foreach ($j in $script:ConsultPool) {
    try { $j.ps.Stop() } catch {}
    try { $j.ps.Dispose() } catch {}
    try { $j.rs.Close(); $j.rs.Dispose() } catch {}
  }

  $script:ConsultRunning = $true
  $btnConsultar.IsEnabled = $false
  $script:ConsultOrig = $btnConsultar.Content
  $script:ConsultBag = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $script:ConsultTotal = $targets.Count
  $script:ConsultDeadline = (Get-Date).AddMinutes(15)
  $script:ConsultPool = @()
  Write-Log 'INFO' "Consulta iniciada: $($targets.Count) servidor(es)$(if ($checkKbs) { " | KBs=$checkKbs" } else { '' })."

  $cjob = {
    param($server, $psexec, $worker, $rel, $checkKbs, $bag)
    $obj = $null
    try {
      $remoteDir = "\\$server\C`$\$rel"
      New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
      Remove-Item "$remoteDir\consult.json" -ErrorAction SilentlyContinue
      Copy-Item -Path $worker -Destination "$remoteDir\consult.ps1" -Force -ErrorAction Stop
      $consultArgs = @('-ExecutionPolicy','Bypass','-NonInteractive','-File',"C:\$rel\consult.ps1")
      if ("$checkKbs".Trim()) { $consultArgs += @('-CheckKBs', "$checkKbs") }
      $null = & $psexec "\\$server" -accepteula -nobanner -s powershell.exe @consultArgs 2>&1
      if (Test-Path "$remoteDir\consult.json") {
        $raw = Get-Content "$remoteDir\consult.json" -Raw
        if ($raw) { $obj = $raw | ConvertFrom-Json }
      }
    } catch {}
    if (-not $obj) {
      $obj = [pscustomobject]@{
        Servidor=$server; Sistema_Operativo=''; IP='';
        SQL_Instancia=''; SQL_Version=''; SQL_Ultima_Actualizacion='';
        KBs_Disponibles=''; Cantidad_KBs='';
        Fecha_Ultima_Actualizacion=''; Fecha_Ultimo_Reinicio='';
        KBs_Consultadas=''; KBs_Presentes=''; KBs_Ausentes=''; KBs_Estado='';
        Error='Sin conexion o sin datos'
      }
    } else {
      $obj.Servidor = $server
    }
    [void]$bag.Add($obj)
  }

  foreach ($server in $targets) {
    $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState='MTA'; $rs.Open()
    $ps = [powershell]::Create(); $ps.Runspace = $rs
    $ps.AddScript($cjob.ToString()).
        AddArgument($server).AddArgument($script:PsExecPath).
        AddArgument($script:LocalConsultWorker).AddArgument($script:RemoteRel).
        AddArgument($checkKbs).AddArgument($script:ConsultBag) | Out-Null
    $script:ConsultPool += @{ ps=$ps; handle=$ps.BeginInvoke(); rs=$rs }
  }

  if (-not $script:ConsultTimer) {
    $script:ConsultTimer = New-Object System.Windows.Threading.DispatcherTimer
    $script:ConsultTimer.Interval = [TimeSpan]::FromMilliseconds(400)
    $script:ConsultTimer.add_Tick({ On-ConsultTick })
  }
  $script:ConsultTimer.Start()
}

function On-ConsultTick {
  $done = $script:ConsultBag.Count
  $btnConsultar.Content = "Consultando $done/$($script:ConsultTotal)..."

  if ($done -ge $script:ConsultTotal -or (Get-Date) -gt $script:ConsultDeadline) {
    $script:ConsultTimer.Stop()
    foreach ($j in $script:ConsultPool) {
      try { if ($j.handle.IsCompleted) { $j.ps.EndInvoke($j.handle) } } catch {}
      try { $j.ps.Dispose() } catch {}
      try { $j.rs.Close(); $j.rs.Dispose() } catch {}
    }
    $script:ConsultPool = @()
    $script:ConsultRunning = $false
    $btnConsultar.Content = $script:ConsultOrig
    $btnConsultar.IsEnabled = $true
    Update-ButtonStates

    $byServer = [ordered]@{}
    foreach ($o in @($script:ConsultBag)) {
      $name = "$($o.Servidor)".Trim()
      if ($name) { $byServer[$name] = $o }
    }
    $anySql = @($byServer.Values | Where-Object { "$($_.SQL_Instancia)".Trim() }).Count -gt 0
    $export = @($byServer.Values | Sort-Object { "$($_.Servidor)" } | ForEach-Object {
      $name = "$($_.Servidor)".Trim()
      $inInv = 'NO'
      if ($script:ConsultMeta.ContainsKey($name)) { $inInv = $script:ConsultMeta[$name] }
      $os = "$($_.Sistema_Operativo)".Trim()
      if (-not $os) { $os = Get-InventoryFieldForServer $name 'OS' }
      $row = [ordered]@{
        Servidor           = $name
        En_Inventario      = $inInv
        Sistema_Operativo  = $os
        IP                 = $_.IP
      }
      if ($anySql) {
        $row['SQL_Instancia']            = "$($_.SQL_Instancia)"
        $row['SQL_Version']              = "$($_.SQL_Version)"
        $row['SQL_Ultima_Actualizacion'] = "$($_.SQL_Ultima_Actualizacion)"
      }
      $row['KBs_Disponibles']            = $_.KBs_Disponibles
      $row['Cantidad_KBs']               = $_.Cantidad_KBs
      $row['Fecha_Ultima_Actualizacion'] = $_.Fecha_Ultima_Actualizacion
      $row['Fecha_Ultimo_Reinicio']      = $_.Fecha_Ultimo_Reinicio
      $row['KBs_Consultadas']            = $_.KBs_Consultadas
      $row['KBs_Presentes']              = $_.KBs_Presentes
      $row['KBs_Ausentes']               = $_.KBs_Ausentes
      $row['KBs_Estado']                 = $_.KBs_Estado
      $row['Error']                      = $_.Error
      [pscustomobject]$row
    })

    $savedPath = $null
    try {
      $dir = Join-Path $script:ScriptDir 'Consultas'
      if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
      $savedPath = Join-Path $dir ("Consulta_{0}.csv" -f (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'))
      $export | Export-Csv -Path $savedPath -NoTypeInformation -Delimiter ';' -Encoding UTF8
    } catch {
      Write-Log 'ERROR' "No se pudo guardar la consulta: $($_.Exception.Message)"
    }

    $ok = @($export | Where-Object { -not "$($_.Error)".Trim() }).Count
    $fail = $export.Count - $ok
    $fuera = @($export | Where-Object { $_.En_Inventario -eq 'NO' }).Count
    Write-Log 'INFO' "Consulta finalizada: $($export.Count) servidor(es), $ok ok, $fail con error, $fuera fuera de inventario. CSV: $savedPath"
    $msg = "Servidores consultados: $($export.Count)`nSin error: $ok`nCon error: $fail`nFuera del inventario: $fuera"
    if ($savedPath) { $msg += "`n`nCSV guardado en:`n$savedPath" }
    else { $msg += "`n`nNo se pudo guardar el CSV." }
    [System.Windows.MessageBox]::Show($msg, 'WUU - Consultar', 'OK', 'Information') | Out-Null
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

function Show-FixTargetPicker {
  $groupNames = @($script:Csv | ForEach-Object { "$($_.Grupo)".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Destino Fix" Height="560" Width="520"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize"
        Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="18">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="160"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="Auto"/>
      <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <TextBlock Text="Paso 2 de 3 - Selecciona el destino" FontWeight="SemiBold" FontSize="15"/>
    <TextBlock Grid.Row="1" Margin="0,6,0,10" Foreground="#FF475569" TextWrapping="Wrap"
               Text="Marca uno o varios grupos del inventario y/o pega nombres. Los que no esten en el CSV se agregan a la grilla con observacion y no se escriben en Servidores\."/>
    <DockPanel Grid.Row="2" Margin="0,0,0,4">
      <TextBlock Text="Grupos:" FontWeight="SemiBold" VerticalAlignment="Center"/>
      <Button x:Name="btnNoneGroups" Content="Ninguno" Padding="10,3" DockPanel.Dock="Right" Margin="6,0,0,0"/>
      <Button x:Name="btnAllGroups" Content="Todos" Padding="10,3" DockPanel.Dock="Right"/>
    </DockPanel>
    <Border Grid.Row="3" Background="White" BorderBrush="#FFCBD5E1" BorderThickness="1" CornerRadius="4" Padding="4">
      <ScrollViewer VerticalScrollBarVisibility="Auto">
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
    <TextBlock Grid.Row="4" Margin="0,10,0,6" Foreground="#FF475569" TextWrapping="Wrap"
               Text="Servidores adicionales (fuera de inventario o sueltos). Separadores: linea, coma o punto y coma."/>
    <TextBox x:Name="txtServers" Grid.Row="5" AcceptsReturn="True" TextWrapping="NoWrap"
             VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto"
             Padding="8" FontFamily="Consolas"/>
    <TextBlock x:Name="lblErr" Grid.Row="6" Foreground="#FFDC2626" Margin="0,8,0,0" Text="" TextWrapping="Wrap"/>
    <DockPanel Grid.Row="7" Margin="0,12,0,0" LastChildFill="False">
      <Button x:Name="btnOk" Content="Continuar" Padding="14,7" Margin="0,0,8,0"/>
      <Button x:Name="btnCancel" Content="Cancelar" Padding="14,7" DockPanel.Dock="Right"/>
    </DockPanel>
  </Grid>
</Window>
'@
  $rdr = New-Object System.Xml.XmlNodeReader $sx
  $win = [Windows.Markup.XamlReader]::Load($rdr)
  $win.Owner = $Window
  $ic = $win.FindName('icGroups')
  $txt = $win.FindName('txtServers')
  $lbl = $win.FindName('lblErr')
  $fixGroups = New-Object System.Collections.ObjectModel.ObservableCollection[object]
  foreach ($g in $groupNames) {
    $gi = New-Object GroupItem
    $gi.Name = $g
    $gi.IsChecked = $false
    $fixGroups.Add($gi)
  }
  $ic.ItemsSource = $fixGroups
  $csvRef = @($script:Csv)
  $fnParse = ${function:Parse-ServerNameList}
  $result = @{ Value = @() }
  $win.FindName('btnAllGroups').Add_Click({
    foreach ($g in $fixGroups) { $g.IsChecked = $true }
  }.GetNewClosure())
  $win.FindName('btnNoneGroups').Add_Click({
    foreach ($g in $fixGroups) { $g.IsChecked = $false }
  }.GetNewClosure())
  $win.FindName('btnOk').Add_Click({
    $selected = @($fixGroups | Where-Object { $_.IsChecked } | ForEach-Object { "$($_.Name)".Trim() } | Where-Object { $_ })
    $fromGroup = @()
    if ($selected.Count -gt 0) {
      $fromGroup = @($csvRef | Where-Object {
          $gname = "$($_.Grupo)".Trim()
          @($selected | Where-Object { $_ -ieq $gname }).Count -gt 0
        } | ForEach-Object { "$($_.Servidor)".Trim() } | Where-Object { $_ } | Select-Object -Unique)
      if ($fromGroup.Count -eq 0) {
        $lbl.Text = 'Los grupos seleccionados no contienen servidores validos.'
        return
      }
    }
    $typed = @(& $fnParse "$($txt.Text)")
    $names = @($fromGroup + $typed | Select-Object -Unique)
    if ($names.Count -eq 0) {
      $lbl.Text = 'Selecciona al menos un grupo o ingresa un nombre de servidor.'
      return
    }
    $result.Value = $names
    $win.DialogResult = $true
  }.GetNewClosure())
  $win.FindName('btnCancel').Add_Click({ $win.DialogResult = $false }.GetNewClosure())
  if ($win.ShowDialog()) { return @($result.Value) }
  return @()
}

function Ensure-FixTargetsOnGrid([string[]]$Names) {
  $targets = @()
  $outside = @()
  foreach ($requested in @($Names)) {
    $name = "$requested".Trim()
    if (-not $name) { continue }
    $existing = Get-Row $name
    if ($existing) {
      $targets += $existing.Servidor
      continue
    }
    $csvRow = @($script:Csv | Where-Object { "$($_.Servidor)".Trim() -ieq $name } | Select-Object -First 1)[0]
    if ($csvRow) {
      Add-ServerFromSearch $csvRow '' 'Fix'
      $row = Get-Row "$($csvRow.Servidor)".Trim()
      if ($row) { $targets += $row.Servidor }
    } else {
      $outside += $name
      Add-ServerFromSearch ([pscustomobject]@{
        Grupo=''; Dominio=''; IP=''; OS=''; Servidor=$name; Ambiente=''
      }) 'Este equipo no se encuentra en el inventario' 'Fix'
      $row = Get-Row $name
      if ($row) { $targets += $row.Servidor }
    }
  }
  return @{ Names = @($targets | Select-Object -Unique); Outside = @($outside | Select-Object -Unique) }
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
               Text="Si el archivo ya existe en el servidor, no se vuelve a copiar y se instala directamente. Al terminar, si el paquete requiere reinicio, WUU lo programa automaticamente."/>
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

      if ($job.mode -eq 'install' -and $needsReboot -and -not $script:AutoRebootPending.ContainsKey($server)) {
        $delay = 60
        try { $delay = [int]$script:Cfg.AutoReboot.DelaySeconds } catch {}
        if ($delay -lt 0) { $delay = 0 }
        $script:AutoRebootPending[$server] = (Get-Date).AddSeconds($delay)
        $row.State = 'RebootRequired'
        $row.Status = if ($failed.Count -eq 0) {
          "Fix: $succeeded/$($results.Count) correctos. Reinicio automatico en ${delay}s..."
        } else {
          "Fix: $succeeded/$($results.Count) correctos, $($failed.Count) con error. Reinicio automatico en ${delay}s..."
        }
        Write-Log 'INFO' "Fix: auto-reinicio programado $server en ${delay}s"
        Start-AutoRebootTimer
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
  $packages = Get-FixPackages
  if ($packages.Count -eq 0) {
    [System.Windows.MessageBox]::Show(
      "No hay paquetes .msu o .cab en la carpeta Fix\ junto a WUU.ps1.",
      'WUU', 'OK', 'Information') | Out-Null
    return
  }
  $selectedPackages = @(Show-FixPackagePicker $packages)
  if ($selectedPackages.Count -eq 0) { return }
  $picked = @(Show-FixTargetPicker)
  if ($picked.Count -eq 0) { return }
  $ensured = Ensure-FixTargetsOnGrid $picked
  $targets = @($ensured.Names)
  if ($targets.Count -eq 0) {
    [System.Windows.MessageBox]::Show('No se pudo resolver ningun servidor destino.','WUU','OK','Warning') | Out-Null
    return
  }
  $mode = Show-FixModePicker
  if (-not $mode) { return }
  if ($mode -eq 'install' -and -not (Test-Path $script:PsExecPath)) {
    [System.Windows.MessageBox]::Show(
      "No se encuentra PsExec.exe en:`n$script:PsExecPath",
      'WUU', 'OK', 'Error') | Out-Null
    return
  }
  $packageNames = @($selectedPackages | ForEach-Object { $_.Name })
  $action = if ($mode -eq 'copy') { 'Solo copiar' } else { 'Copiar e instalar (reinicia si el paquete lo requiere)' }
  $visibleTargets = @($targets | Select-Object -First 20) -join "`n- "
  if ($targets.Count -gt 20) { $visibleTargets += "`n- ..." }
  $outsideNote = ''
  if (@($ensured.Outside).Count -gt 0) {
    $outsideNote = "`n`nFuera de inventario: $(@($ensured.Outside).Count). Se agregan a la grilla y no se escriben en Servidores\."
  }
  $resp = [System.Windows.MessageBox]::Show(
    "Accion: $action`nPaquetes: $($selectedPackages.Count)`nServidores: $($targets.Count)$outsideNote`n`n" +
    "Paquetes:`n- $($packageNames -join "`n- ")`n`nServidores:`n- $visibleTargets",
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
  $sync = [hashtable]::Synchronized(@{ done=$false; phase='rebooting'; status='Reiniciando...'; result=''; available=0; reboot=$false; svcError='' })

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

      Start-Sleep -Seconds 45
      $remoteDir = "\\$server\C`$\$rel"
      $shareReady = $false
      $tShare = Get-Date
      while ((((Get-Date) - $tShare).TotalMinutes) -lt 5) {
        try {
          New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
          if (Test-Path $remoteDir) { $shareReady = $true; break }
        } catch {}
        $sync.phase='waiting'; $sync.status='Esperando recurso C$...'
        Start-Sleep -Seconds 10
      }
      if (-not $shareReady) {
        $sync.result='verifyfail'
        $sync.status='No se pudo verificar tras reinicio'
        $sync.svcError='C$ no accesible tras el reinicio'
        return
      }

      $sync.phase='verify'; $sync.status='Verificando...'
      $lastDetail = ''
      $verified = $false
      for ($attempt = 1; $attempt -le 6; $attempt++) {
        $sync.status = "Verificando (intento $attempt/6)..."
        try {
          New-Item -ItemType Directory -Path $remoteDir -Force -ErrorAction Stop | Out-Null
          Remove-Item "$remoteDir\verify.json" -ErrorAction SilentlyContinue
          Copy-Item -Path $worker -Destination "$remoteDir\verify.ps1" -Force -ErrorAction Stop
          $pout = & $psexec "\\$server" -accepteula -nobanner -s `
                    powershell.exe -ExecutionPolicy Bypass -NonInteractive `
                    -File "C:\$rel\verify.ps1" 2>&1 | Out-String
          $pcode = $LASTEXITCODE
          $jsonReady = $false
          for ($w = 0; $w -lt 8; $w++) {
            if (Test-Path "$remoteDir\verify.json") { $jsonReady = $true; break }
            Start-Sleep -Seconds 2
          }
          if ($jsonReady) {
            $v = Get-Content "$remoteDir\verify.json" -Raw | ConvertFrom-Json
            $sync.available = [int]$v.available
            $sync.reboot    = [bool]$v.rebootRequired
            $sync.svcError  = "$($v.error)"
            if ($v.rebootRequired)          { $sync.result='reboot';  $sync.status='Aun requiere reinicio' }
            elseif ([int]$v.available -gt 0) { $sync.result='pending'; $sync.status="Hay $([int]$v.available) update(s) nuevos" }
            else                            { $sync.result='updated'; $sync.status='Actualizado tras reinicio' }
            if ("$($v.services)".Trim()) { $sync.status = "$($sync.status) | $($v.services)" }
            $verified = $true
            break
          }
          $lastDetail = "PsExec codigo=$pcode"
          if ("$pout".Trim()) { $lastDetail = "$lastDetail $($pout.Trim())" }
        } catch {
          $lastDetail = $_.Exception.Message
        }
        Start-Sleep -Seconds 20
      }
      if (-not $verified) {
        $sync.result='verifyfail'
        $sync.status='No se pudo verificar tras reinicio'
        if ("$lastDetail".Trim()) { $sync.svcError = "$lastDetail".Trim() }
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
          'updated'    { $row.State='Updated';        $row.Error=$(if ("$($sync.svcError)".Trim()) { "$($sync.svcError)" } else { '' }) }
          'reboot'     { $row.State='RebootRequired'; if ("$($sync.svcError)".Trim()) { $row.Error="$($sync.svcError)" } }
          'pending'    { $row.State='CheckWSUS';      $row.Available="$($sync.available)"; if ("$($sync.svcError)".Trim()) { $row.Error="$($sync.svcError)" } }
          'timeout'    { $row.State='RebootRequired'; $row.Error='No respondio tras reinicio' }
          'verifyfail' {
            $row.State='RebootRequired'
            $row.Error = if ("$($sync.svcError)".Trim()) { "No se pudo verificar tras reinicio: $($sync.svcError)" } else { 'No se pudo verificar tras reinicio' }
          }
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

function Test-OneServerConnection([string]$Server, [int]$TimeoutSec = 3) {
  $dns = 'Error'; $tcp = 'Error'; $share = 'No probado'
  $ipResolved = ''; $details = New-Object System.Collections.Generic.List[string]
  try {
    $addrs = @([System.Net.Dns]::GetHostAddresses($Server) | Where-Object { $_.AddressFamily -eq 'InterNetwork' })
    if ($addrs.Count -eq 0) { throw 'sin direccion IPv4' }
    $ipResolved = $addrs[0].IPAddressToString
    $dns = 'OK'
  } catch {
    $details.Add("DNS: no se resuelve el nombre ($($_.Exception.Message))")
    return [pscustomobject]@{
      DNS = $dns; IP_Resuelta = $ipResolved; Puerto_445 = $tcp; Recurso_CS = $share
      Estado = 'Error'; Detalle = ($details -join ' | ')
    }
  }
  $canReach = $false
  try {
    $tc = New-Object System.Net.Sockets.TcpClient
    try {
      $iar = $tc.BeginConnect($Server, 445, $null, $null)
      $canReach = $iar.AsyncWaitHandle.WaitOne([Math]::Max(1, $TimeoutSec) * 1000) -and $tc.Connected
    } finally { try { $tc.Close() } catch {} }
  } catch {
    $details.Add("Puerto 445: $($_.Exception.Message)")
  }
  if ($canReach) { $tcp = 'OK' } else {
    $details.Add("Sin conectividad (puerto 445, timeout ${TimeoutSec}s)")
    return [pscustomobject]@{
      DNS = $dns; IP_Resuelta = $ipResolved; Puerto_445 = $tcp; Recurso_CS = $share
      Estado = 'Error'; Detalle = ($details -join ' | ')
    }
  }
  try {
    $unc = "\\$Server\C$"
    if (Test-Path -LiteralPath $unc) { $share = 'OK' }
    else { throw 'el recurso C$ no responde' }
  } catch {
    $share = 'Error'
    $details.Add("C`$ no accesible: $($_.Exception.Message)")
  }
  $ok = ($dns -eq 'OK' -and $tcp -eq 'OK' -and $share -eq 'OK')
  return [pscustomobject]@{
    DNS = $dns; IP_Resuelta = $ipResolved; Puerto_445 = $tcp; Recurso_CS = $share
    Estado = $(if ($ok) { 'OK' } else { 'Error' })
    Detalle = $(if ($ok) { '' } else { ($details -join ' | ') })
  }
}

function Parse-ServerNameList([string]$Text) {
  return @("$Text" -split '[,;\r\n]+' |
    ForEach-Object { "$_".Trim() } |
    Where-Object { $_ } |
    Select-Object -Unique)
}

function Get-ConnectivityExtraServers($Raw) {
  if ($null -eq $Raw) { return @() }
  if ($Raw -is [System.Array] -or $Raw -is [System.Collections.IList]) {
    $names = @()
    foreach ($item in @($Raw)) { $names += Parse-ServerNameList "$item" }
    return @($names | Where-Object { $_ } | Select-Object -Unique)
  }
  return @(Parse-ServerNameList "$Raw")
}

function Invoke-ConnectivityAudit {
  param(
    [string]$Group = '',
    [string[]]$ExtraServers = @(),
    [scriptblock]$OnProgress = $null
  )
  $timeout = 3
  try { $timeout = [int]$script:Cfg.ConnectivityTimeoutSec } catch {}
  if ($timeout -lt 1) { $timeout = 3 }
  $groupFilter = "$Group".Trim()
  $extras = @(Get-ConnectivityExtraServers $ExtraServers)
  $extrasOnly = ($extras.Count -gt 0)
  if ($extrasOnly) { $groupFilter = '' }
  $targets = @()
  $seen = @{}
  if ($extrasOnly) {
    foreach ($name in $extras) {
      $key = $name.ToUpperInvariant()
      if ($seen.ContainsKey($key)) { continue }
      $seen[$key] = $true
      $inv = @($script:Csv | Where-Object { "$($_.Servidor)".Trim() -ieq $name } | Select-Object -First 1)
      if ($inv.Count -gt 0) {
        $targets += [pscustomobject]@{
          Servidor = $name
          Grupo    = "$($inv[0].Grupo)".Trim()
          Ambiente = "$($inv[0].Ambiente)".Trim()
          IP       = "$($inv[0].IP)".Trim()
          Dominio  = "$($inv[0].Dominio)".Trim()
          En_Inventario = 'SI'
        }
      } else {
        $targets += [pscustomobject]@{
          Servidor = $name
          Grupo    = '(fuera de inventario)'
          Ambiente = ''
          IP       = ''
          Dominio  = ''
          En_Inventario = 'NO'
        }
      }
    }
  } else {
    foreach ($r in @($script:Csv)) {
      $name = "$($r.Servidor)".Trim()
      if (-not $name) { continue }
      $rowGroup = "$($r.Grupo)".Trim()
      if ($groupFilter -and $rowGroup -ine $groupFilter) { continue }
      $key = $name.ToUpperInvariant()
      if ($seen.ContainsKey($key)) { continue }
      $seen[$key] = $true
      $targets += [pscustomobject]@{
        Servidor = $name
        Grupo    = $rowGroup
        Ambiente = "$($r.Ambiente)".Trim()
        IP       = "$($r.IP)".Trim()
        Dominio  = "$($r.Dominio)".Trim()
        En_Inventario = 'SI'
      }
    }
  }
  if ($targets.Count -eq 0) {
    if ($groupFilter) { throw "No hay servidores en el grupo '$groupFilter'." }
    throw 'No hay servidores para validar (inventario vacio).'
  }
  $bag = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $probe = {
    param($t, $timeoutSec, $bag)
    $dns = 'Error'; $tcp = 'Error'; $share = 'No probado'
    $ipResolved = ''; $details = @()
    try {
      $addrs = @([System.Net.Dns]::GetHostAddresses($t.Servidor) | Where-Object { $_.AddressFamily -eq 'InterNetwork' })
      if ($addrs.Count -eq 0) { throw 'sin direccion IPv4' }
      $ipResolved = $addrs[0].IPAddressToString
      $dns = 'OK'
    } catch {
      $details += "DNS: no se resuelve el nombre ($($_.Exception.Message))"
    }
    if ($dns -eq 'OK') {
      $canReach = $false
      try {
        $tc = New-Object System.Net.Sockets.TcpClient
        try {
          $iar = $tc.BeginConnect($t.Servidor, 445, $null, $null)
          $canReach = $iar.AsyncWaitHandle.WaitOne([Math]::Max(1, $timeoutSec) * 1000) -and $tc.Connected
        } finally { try { $tc.Close() } catch {} }
      } catch { $details += "Puerto 445: $($_.Exception.Message)" }
      if ($canReach) { $tcp = 'OK' } else { $details += "Sin conectividad (puerto 445, timeout ${timeoutSec}s)" }
    }
    if ($tcp -eq 'OK') {
      try {
        $unc = "\\$($t.Servidor)\C$"
        if (Test-Path -LiteralPath $unc) { $share = 'OK' } else { throw 'el recurso C$ no responde' }
      } catch {
        $share = 'Error'
        $details += "C`$ no accesible: $($_.Exception.Message)"
      }
    }
    $ok = ($dns -eq 'OK' -and $tcp -eq 'OK' -and $share -eq 'OK')
    [void]$bag.Add([pscustomobject][ordered]@{
      Grupo = $t.Grupo; Ambiente = $t.Ambiente; Servidor = $t.Servidor
      Dominio = $t.Dominio
      IP_Inventario = $t.IP; IP_Resuelta = $ipResolved
      En_Inventario = $t.En_Inventario
      DNS = $dns; Puerto_445 = $tcp; Recurso_CS = $share
      Estado = $(if ($ok) { 'OK' } else { 'Error' })
      Detalle = $(if ($ok) { '' } else { ($details -join ' | ') })
    })
  }
  $total = $targets.Count
  $reportProgress = {
    param($done, $totalCount, $callback)
    $safeTotal = [Math]::Max(1, [int]$totalCount)
    $safeDone = [Math]::Min([int]$done, $safeTotal)
    $pct = [int][Math]::Round(100.0 * $safeDone / $safeTotal)
    Write-Progress -Activity 'Validacion de conexiones' -Status "$safeDone de $totalCount servidor(es)" -PercentComplete $pct
    if ($callback) {
      try { & $callback $safeDone $totalCount } catch {}
    }
  }
  & $reportProgress 0 $total $OnProgress
  $batchSize = 20
  for ($i = 0; $i -lt $targets.Count; $i += $batchSize) {
    $end = [Math]::Min($i + $batchSize - 1, $targets.Count - 1)
    $pool = @()
    foreach ($t in @($targets[$i..$end])) {
      $rs = [runspacefactory]::CreateRunspace(); $rs.ApartmentState = 'MTA'; $rs.Open()
      $ps = [powershell]::Create(); $ps.Runspace = $rs
      $ps.AddScript($probe.ToString()).AddArgument($t).AddArgument($timeout).AddArgument($bag) | Out-Null
      $pool += @{ ps = $ps; handle = $ps.BeginInvoke(); rs = $rs }
    }
    foreach ($j in $pool) {
      try { $null = $j.ps.EndInvoke($j.handle) } catch {}
      try { $j.ps.Dispose() } catch {}
      try { $j.rs.Close(); $j.rs.Dispose() } catch {}
      & $reportProgress $bag.Count $total $OnProgress
    }
  }
  Write-Progress -Activity 'Validacion de conexiones' -Completed
  $rows = @($bag | Sort-Object Servidor | ForEach-Object {
    [pscustomobject][ordered]@{
      Grupo = $_.Grupo; Ambiente = $_.Ambiente; Servidor = $_.Servidor
      Dominio = $_.Dominio
      IP_Inventario = $_.IP_Inventario; IP_Resuelta = $_.IP_Resuelta
      En_Inventario = $_.En_Inventario
      DNS = $_.DNS; Puerto_445 = $_.Puerto_445
      'Recurso_C$' = $_.Recurso_CS
      Estado = $_.Estado; Detalle = $_.Detalle
    }
  })
  $dir = Join-Path $script:ScriptDir 'Reportes\Conexiones'
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $stamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
  $fileName = if ($extrasOnly) {
    "Conexiones_Extra_{0}.csv" -f $stamp
  } elseif ($groupFilter) {
    $slug = ($groupFilter -replace '[\\/:*?"<>|]', '_').Trim()
    if (-not $slug) { $slug = 'Grupo' }
    "Conexiones_{0}_{1}.csv" -f $slug, $stamp
  } else {
    "Conexiones_{0}.csv" -f $stamp
  }
  $file = Join-Path $dir $fileName
  $rows | Export-Csv -Path $file -NoTypeInformation -Delimiter ';' -Encoding UTF8
  $ok = @($rows | Where-Object { $_.Estado -eq 'OK' }).Count
  $fail = $rows.Count - $ok
  $extraCount = @($targets | Where-Object { $_.En_Inventario -eq 'NO' }).Count
  $scope = if ($extrasOnly) { "lote extra ($($targets.Count) servidor(es); sin grupos)" }
           elseif ($groupFilter) { "grupo '$groupFilter'" }
           else { 'todo el inventario' }
  Write-Log 'INFO' "Validacion de conexiones ($scope): $($rows.Count) servidor(es), $ok OK, $fail con error. CSV: $file"
  return @{ Rows = $rows; Path = $file; Ok = $ok; Fail = $fail; Group = $groupFilter; ExtraCount = $extraCount; ExtraOnly = $extrasOnly }
}

function Invoke-ScheduledConnectivityJob {
  param(
    [string]$Group = '',
    [string[]]$ExtraServers = @()
  )
  Write-Log 'INFO' 'Modo headless (-ScheduledConnectivity) iniciado.'
  Load-Csv
  if (-not "$Group".Trim()) { $Group = "$($script:Cfg.ScheduledConnectivity.Group)".Trim() }
  $extras = @(Get-ConnectivityExtraServers $ExtraServers)
  if ($extras.Count -eq 0) { $extras = @(Get-ConnectivityExtraServers $script:Cfg.ScheduledConnectivity.ExtraServers) }
  $hasInventory = ($script:Csv -and @($script:Csv).Count -gt 0)
  if (-not $hasInventory -and $extras.Count -eq 0) {
    Write-Log 'ERROR' 'Sin servidores en CSV ni listado extra. Saliendo.'
    Send-TeamsNotification -Title 'WUU - Validacion de conexiones (error)' -Level Error `
      -Text 'No hay servidores en el inventario CSV ni listado extra. La validacion no se ejecuto.' `
      -Facts @(@{Name='Equipo'; Value=$env:COMPUTERNAME})
    return 1
  }
  $scopeText = if ($extras.Count -gt 0) { "del listado extra ($($extras.Count) servidor(es); no se incluyen grupos)" }
               elseif ($Group) { "del grupo '$Group'" }
               else { 'de todos los servidores del inventario' }
  $groupFact = if ($extras.Count -gt 0) { 'N/A (lote extra)' } elseif ($Group) { $Group } else { 'Todos' }
  Send-TeamsNotification -Title 'WUU - Validacion de conexiones iniciada' -Level Info `
    -Text "Se inicio la validacion de conexion $scopeText." `
    -Facts @(
      @{Name='Tarea'; Value="$($script:Cfg.ScheduledConnectivity.TaskName)"}
      @{Name='Grupo'; Value=$groupFact}
      @{Name='Extra'; Value="$($extras.Count)"}
      @{Name='Equipo'; Value=$env:COMPUTERNAME}
      @{Name='Inicio'; Value=(Get-Date).ToString('dd/MM/yyyy HH:mm:ss')}
    )
  try {
    $result = Invoke-ConnectivityAudit -Group $Group -ExtraServers $extras
    $script:LastConnJob = $result
  } catch {
    $script:LastConnJob = $null
    Write-Log 'ERROR' $_.Exception.Message
    Send-TeamsNotification -Title 'WUU - Validacion de conexiones (error)' -Level Error `
      -Text $_.Exception.Message `
      -Facts @(
        @{Name='Tarea'; Value="$($script:Cfg.ScheduledConnectivity.TaskName)"}
        @{Name='Grupo'; Value=$groupFact}
      )
    return 1
  }
  $errorLines = @($result.Rows | Where-Object { $_.Estado -ne 'OK' } | ForEach-Object {
    $d = if ("$($_.Detalle)") { "$($_.Detalle)" } else { 'Error' }
    $mark = if ("$($_.En_Inventario)" -eq 'NO') { ' [fuera de inventario]' } else { '' }
    "$($_.Servidor)$mark`: $d"
  })
  $level = if ($result.Fail -eq 0) { 'Success' } else { 'Warning' }
  Send-TeamsNotification -Title 'WUU - Validacion de conexiones finalizada' -Level $level `
    -Text "CSV guardado en $($result.Path)" `
    -Facts @(
      @{Name='Tarea'; Value="$($script:Cfg.ScheduledConnectivity.TaskName)"}
      @{Name='Grupo'; Value=$(if ($result.ExtraOnly) { 'N/A (lote extra)' } elseif ($result.Group) { $result.Group } else { 'Todos' })}
      @{Name='Fuera de inventario'; Value="$($result.ExtraCount)"}
      @{Name='OK'; Value="$($result.Ok)"}
      @{Name='Con error'; Value="$($result.Fail)"}
      @{Name='Errores'; Value=(Format-TeamsErrorList $errorLines)}
      @{Name='CSV'; Value="$($result.Path)"}
      @{Name='Fin'; Value=(Get-Date).ToString('dd/MM/yyyy HH:mm:ss')}
    )
  return $(if ($result.Fail -eq 0) { 0 } else { 1 })
}

function Get-RemotePivotSafeName([string]$Name) {
  $s = ("$Name".Trim() -replace '[^A-Za-z0-9._-]', '_').Trim('_')
  if (-not $s) { $s = 'sitio' }
  return $s
}

function Get-RemotePivotPaths($Pivot) {
  $name = "$($Pivot.Name)".Trim()
  if (-not $name) { $name = "$($Pivot.Host)".Trim() }
  if (-not $name) { $name = 'sitio' }
  $base = Join-Path $script:ScriptDir ("Orquestacion\{0}" -f (Get-RemotePivotSafeName $name))
  $order = "$($Pivot.OrderFile)".Trim()
  $inbox = "$($Pivot.InboxDir)".Trim()
  if (-not $order) { $order = Join-Path $base 'pedido\ejecutar.ahora' }
  if (-not $inbox) { $inbox = Join-Path $base 'bandeja' }
  return [pscustomobject]@{ Name = $name; OrderFile = $order; InboxDir = $inbox }
}

function Get-OrderWatchPaths {
  $ow = $script:Cfg.OrderWatch
  $order = "$($ow.OrderFile)".Trim()
  $inbox = "$($ow.InboxDir)".Trim()
  $base = Join-Path $script:ScriptDir 'Orquestacion\_local'
  if (-not $order) { $order = Join-Path $base 'pedido\ejecutar.ahora' }
  if (-not $inbox) { $inbox = Join-Path $base 'bandeja' }
  return [pscustomobject]@{ OrderFile = $order; InboxDir = $inbox }
}

function Test-IsUncPath([string]$Path) {
  return ("$Path".Trim() -match '^\\\\[^\\/:*?"<>|]+\\')
}

function Add-ConnSitioColumn($Rows, [string]$Sitio) {
  $label = "$Sitio".Trim()
  if (-not $label) { $label = 'Este pivot' }
  return @($Rows | ForEach-Object {
    $h = [ordered]@{ Sitio = $label }
    foreach ($p in $_.PSObject.Properties) {
      if ($p.Name -ne 'Sitio') { $h[$p.Name] = $p.Value }
    }
    [pscustomobject]$h
  })
}

function Write-RemotePivotOrder($Pivot) {
  $paths = Get-RemotePivotPaths $Pivot
  $dir = Split-Path -Parent $paths.OrderFile
  if ($dir -and -not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir -Force -ErrorAction Stop | Out-Null
  }
  $payload = [ordered]@{
    Kind        = 'Connectivity'
    RequestedAt = (Get-Date).ToString('o')
    Source      = $env:COMPUTERNAME
    Analyst     = "$script:AnalistaAsignado".Trim()
    Site        = $paths.Name
  }
  ($payload | ConvertTo-Json -Compress) | Set-Content -Path $paths.OrderFile -Encoding UTF8 -ErrorAction Stop
  Write-Log 'INFO' "Pedido escrito para '$($paths.Name)': $($paths.OrderFile)"
  return $paths
}

function Wait-RemotePivotInbox($Pivot, [datetime]$Since, [int]$TimeoutMinutes = 8, [scriptblock]$OnProgress = $null) {
  $paths = Get-RemotePivotPaths $Pivot
  $inbox = $paths.InboxDir
  $deadline = $Since.AddMinutes([Math]::Max(1, $TimeoutMinutes))
  $cutoff = $Since.AddSeconds(-15)
  while ((Get-Date) -lt $deadline) {
    if ($OnProgress) {
      $left = [int][Math]::Max(0, ($deadline - (Get-Date)).TotalSeconds)
      try { & $OnProgress "Esperando CSV de '$($paths.Name)' (${left}s)..." } catch {}
    }
    if (Test-Path -LiteralPath $inbox) {
      $found = @(Get-ChildItem -LiteralPath $inbox -Filter '*.csv' -File -ErrorAction SilentlyContinue |
        Where-Object { $_.LastWriteTime -ge $cutoff } | Sort-Object LastWriteTime -Descending)
      if ($found.Count -gt 0) { return $found[0].FullName }
    }
    Start-Sleep -Seconds 5
  }
  return $null
}

function Copy-RemotePivotCsvToLocal([string]$SourcePath, [string]$SiteName) {
  $dir = Join-Path $script:ScriptDir 'Reportes\Conexiones'
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $safe = Get-RemotePivotSafeName $SiteName
  $dest = Join-Path $dir ("Conexiones_Remote_{0}_{1}.csv" -f $safe, (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'))
  Copy-Item -LiteralPath $SourcePath -Destination $dest -Force -ErrorAction Stop
  return $dest
}

function Import-ConnectivityCsv([string]$Path, [string]$Sitio) {
  if (-not $Path -or -not (Test-Path -LiteralPath $Path)) { return @() }
  $rows = @(Import-Csv -LiteralPath $Path -Delimiter ';' -Encoding UTF8)
  return @(Add-ConnSitioColumn $rows $Sitio)
}

function Invoke-RemotePivotOrderAndWait($Pivot, [scriptblock]$OnProgress = $null) {
  $name = "$($Pivot.Name)".Trim()
  if (-not $name) { $name = "$($Pivot.Host)".Trim() }
  $since = Get-Date
  if ($OnProgress) { try { & $OnProgress "Pivot '${name}': escribiendo pedido (el principal no entra al subdominio)..." } catch {} }
  $paths = Get-RemotePivotPaths $Pivot
  if (-not (Test-IsUncPath $paths.OrderFile) -or -not (Test-IsUncPath $paths.InboxDir)) {
    throw "Pivot '${name}': OrderFile e InboxDir deben ser UNC (\\servidor\recurso\...) accesibles para la cuenta del principal y la del subdominio. No se guarda ni se usa la clave del subdominio."
  }
  $paths = Write-RemotePivotOrder $Pivot
  $waitMin = 8
  try { $waitMin = [int]$script:Cfg.OrderWatch.WaitTimeoutMinutes } catch {}
  if ($waitMin -lt 1) { $waitMin = 8 }
  try { if ([int]$Pivot.WaitTimeoutMinutes -gt 0) { $waitMin = [int]$Pivot.WaitTimeoutMinutes } } catch {}
  $csv = Wait-RemotePivotInbox $Pivot $since $waitMin $OnProgress
  if (-not $csv) {
    throw "Timeout: no llego el CSV a la bandeja '$($paths.InboxDir)'. En el pivot de '$name' debe existir el vigia (WUU.ps1 -WatchOrders) y OrderFile/InboxDir deben ser UNC accesibles para ambas cuentas (sin admin del subdominio en el principal)."
  }
  $local = Copy-RemotePivotCsvToLocal $csv $name
  Write-Log 'INFO' "Pivot '${name}': CSV recibido ($csv) copiado a $local"
  $rows = @(Import-ConnectivityCsv $local $name)
  $ok = @($rows | Where-Object { "$($_.Estado)" -eq 'OK' }).Count
  return [pscustomobject]@{
    Name = $name; Path = $local; Rows = $rows
    Ok = $ok; Fail = ($rows.Count - $ok)
  }
}

function Invoke-OrderWatchJob {
  $paths = Get-OrderWatchPaths
  $orderFile = $paths.OrderFile
  $inboxDir = $paths.InboxDir
  if (-not $orderFile) {
    Write-Log 'WARN' 'OrderWatch.OrderFile vacio. El vigia no puede buscar pedidos.'
    return 0
  }
  if (-not (Test-Path -LiteralPath $orderFile)) {
    Write-Log 'INFO' "Vigia: sin pedido ($orderFile). Nada que validar."
    return 0
  }
  Write-Log 'INFO' "Vigia: pedido encontrado en $orderFile"
  try { Remove-Item -LiteralPath $orderFile -Force -ErrorAction Stop }
  catch {
    Write-Log 'ERROR' "Vigia: no se pudo quitar el pedido: $($_.Exception.Message)"
    return 1
  }
  $code = Invoke-ScheduledConnectivityJob
  $src = $null
  if ($script:LastConnJob -and "$($script:LastConnJob.Path)".Trim()) { $src = "$($script:LastConnJob.Path)".Trim() }
  if ($src -and (Test-Path -LiteralPath $src) -and $inboxDir) {
    try {
      if (-not (Test-Path -LiteralPath $inboxDir)) {
        New-Item -ItemType Directory -Path $inboxDir -Force | Out-Null
      }
      $dest = Join-Path $inboxDir (Split-Path -Leaf $src)
      Copy-Item -LiteralPath $src -Destination $dest -Force -ErrorAction Stop
      Write-Log 'INFO' "Vigia: CSV copiado a bandeja $dest"
    } catch {
      Write-Log 'ERROR' "Vigia: no se pudo copiar el CSV a la bandeja '$inboxDir': $($_.Exception.Message)"
      if ($code -eq 0) { $code = 1 }
    }
  } elseif (-not $inboxDir) {
    Write-Log 'WARN' 'Vigia: InboxDir vacio; el CSV queda solo en Reportes\Conexiones local.'
  }
  return [int]$code
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

function Get-ScheduledRebootRows([string]$BaseDir = '') {
  $rows = @()
  if (-not $BaseDir) { $BaseDir = $script:ScriptDir }
  $dir = Join-Path $BaseDir 'Programaciones'
  if (-not (Test-Path $dir)) { return @() }
  foreach ($file in @(Get-ChildItem -Path $dir -Filter '*.json' -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending)) {
    try {
      $job = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json
      if (-not $job.TaskName -or "$($job.Kind)" -ne 'ScheduledReboot') { continue }
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
      $serverCount = @($job.Servers | ForEach-Object { "$_".Trim() } | Where-Object { $_ }).Count
      $rows += [pscustomobject][ordered]@{
        Tarea   = "$($job.TaskName)"
        Destino = "$serverCount servidor(es)"
        Fecha   = $scheduledDisplay
        Estado  = if ($job.Status) { "$($job.Status) / $taskState" } else { $taskState }
        Detalle = $(if ($job.LastMessage) { "$($job.LastMessage)" } else { $lastResult })
        JobFile = $file.FullName
      }
    } catch {
      try { Write-Log 'WARN' "Reinicio programado invalido '$($file.FullName)': $($_.Exception.Message)" } catch {}
    }
  }
  return @($rows)
}

function Invoke-RemoteRebootBatch {
  param(
    [Parameter(Mandatory)][string[]]$Servers,
    [string]$Comment = 'Reinicio iniciado desde WUU',
    [scriptblock]$OnProgress = $null
  )
  $targets = @($Servers | ForEach-Object { "$_".Trim() } | Where-Object { $_ } | Select-Object -Unique)
  $result = [ordered]@{
    Rows = @(); Ok = 0; Fail = 0; Total = $targets.Count
  }
  if ($targets.Count -eq 0) { return [pscustomobject]$result }
  if (-not (Test-Path $script:PsExecPath)) {
    throw "No se encuentra PsExec.exe en: $($script:PsExecPath)"
  }
  $timeout = 3
  try { $timeout = [int]$script:Cfg.ConnectivityTimeoutSec } catch {}
  if ($timeout -lt 1) { $timeout = 3 }
  $bag = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
  $ipMap = [hashtable]::Synchronized(@{})
  foreach ($sv in $targets) {
    $inv = @($script:Csv | Where-Object { "$($_.Servidor)".Trim() -ieq $sv } | Select-Object -First 1)
    if ($inv.Count -gt 0) { $ipMap[$sv] = "$($inv[0].IP)".Trim() }
  }
  $worker = {
    param($server, $psexec, $timeoutSec, $comment, $ipMap, $bag)
    $started = Get-Date
    $row = [ordered]@{
      Servidor=$server; IP=''; State='Error'; Status='Error'; Error=''; RunningTime=''; Detalle=''
    }
    try {
      if ($ipMap -and $ipMap.ContainsKey($server)) { $row.IP = "$($ipMap[$server])" }
      $reachable = $false
      $tcp = New-Object System.Net.Sockets.TcpClient
      try {
        $iar = $tcp.BeginConnect($server, 445, $null, $null)
        $reachable = $iar.AsyncWaitHandle.WaitOne($timeoutSec * 1000) -and $tcp.Connected
      } finally { try { $tcp.Close() } catch {} }
      if (-not $reachable) { throw "Sin conectividad (puerto 445, timeout ${timeoutSec}s)" }
      $output = & $psexec "\\$server" -accepteula -nobanner -d -s `
        shutdown /r /t 10 /c $comment 2>&1
      $code = $LASTEXITCODE
      if ($code -eq 0) {
        $row.State = 'OK'
        $row.Status = 'Reinicio enviado'
        $row.Detalle = 'Reinicio enviado (10 s)'
      } else {
        $tail = (($output | Select-Object -Last 2) -join ' ').Trim()
        $row.Error = "PsExec codigo $code$(if ($tail) { ": $tail" })"
        $row.Status = 'Error'
        $row.Detalle = $row.Error
      }
    } catch {
      $row.Error = $_.Exception.Message
      $row.Status = 'Error'
      $row.Detalle = $row.Error
    } finally {
      $elapsed = (Get-Date) - $started
      $row.RunningTime = '{0:00}:{1:00}:{2:00}' -f [int]$elapsed.TotalHours, $elapsed.Minutes, $elapsed.Seconds
      [void]$bag.Add([pscustomobject]$row)
    }
  }
  $pool = @()
  $runspacePool = $null
  try {
    $max = [Math]::Min(8, [Math]::Max(1, $targets.Count))
    $runspacePool = [runspacefactory]::CreateRunspacePool(1, $max)
    $runspacePool.ApartmentState = 'MTA'
    $runspacePool.Open()
    foreach ($server in $targets) {
      $ps = [powershell]::Create()
      $ps.RunspacePool = $runspacePool
      $ps.AddScript($worker.ToString()).
        AddArgument($server).AddArgument($script:PsExecPath).
        AddArgument($timeout).AddArgument($Comment).AddArgument($ipMap).AddArgument($bag) | Out-Null
      $pool += @{ ps = $ps; handle = $ps.BeginInvoke() }
    }
    $deadline = (Get-Date).AddMinutes(10)
    while ($bag.Count -lt $targets.Count -and (Get-Date) -lt $deadline) {
      if ($OnProgress) { try { & $OnProgress $bag.Count $targets.Count } catch {} }
      Start-Sleep -Milliseconds 400
    }
    foreach ($entry in $pool) {
      if (-not $entry.handle.IsCompleted) { try { $entry.ps.Stop() } catch {} }
      else { try { $entry.ps.EndInvoke($entry.handle) } catch {} }
      try { $entry.ps.Dispose() } catch {}
    }
  } finally {
    if ($runspacePool) { try { $runspacePool.Close(); $runspacePool.Dispose() } catch {} }
  }
  if ($OnProgress) { try { & $OnProgress $bag.Count $targets.Count } catch {} }
  $rows = @($bag | Sort-Object Servidor)
  $result.Rows = $rows
  $result.Ok = @($rows | Where-Object { $_.State -eq 'OK' }).Count
  $result.Fail = $rows.Count - $result.Ok
  return [pscustomobject]$result
}

function Show-SchedulerWindow {
  [xml]$sx = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WUU - Programar" Height="540" Width="620" MinHeight="460" MinWidth="540"
        WindowStartupLocation="CenterScreen" Background="#FFF3F4F6" FontFamily="Segoe UI" FontSize="13">
  <Grid Margin="10">
    <Grid.RowDefinitions><RowDefinition Height="*"/><RowDefinition Height="Auto"/></Grid.RowDefinitions>
    <TabControl Grid.Row="0">
      <TabItem Header="Reporte automatico">
        <ScrollViewer VerticalScrollBarVisibility="Auto">
        <StackPanel Margin="12">
          <TextBlock Text="Configuracion del reporte automatico diario" FontSize="14" FontWeight="SemiBold" Margin="0,0,0,10"/>
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
          <StackPanel Orientation="Horizontal" Margin="0,8,0,0">
            <Button x:Name="btnCreate" Content="Crear / Actualizar tarea" Padding="12,6" Margin="0,0,8,0"/>
            <Button x:Name="btnDelete" Content="Eliminar tarea" Padding="12,6"/>
          </StackPanel>
          <TextBlock x:Name="lblMsg" Text="" Margin="0,8,0,0" TextWrapping="Wrap"/>
        </StackPanel>
        </ScrollViewer>
      </TabItem>
      <TabItem Header="Ventana de actualizacion">
        <Grid Margin="12">
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
          </Grid.RowDefinitions>
          <TextBlock Grid.Row="0" Text="Programar parcheo normal (una unica ejecucion)" FontSize="14" FontWeight="SemiBold" Margin="0,0,0,8"/>
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
            <ListBox x:Name="lstUpdateMatches" Grid.Row="2" Grid.Column="1" Height="56" Margin="0,4" IsEnabled="False" DisplayMemberPath="Display"/>
            <TextBlock Grid.Row="3" Grid.Column="0" Text="Fecha y hora:" VerticalAlignment="Center" Margin="0,6"/>
            <StackPanel Grid.Row="3" Grid.Column="1" Orientation="Horizontal">
              <TextBox x:Name="txtUpdateDate" Width="120" Padding="4,3" Margin="0,4,8,4" ToolTip="dd/mm/aaaa"/>
              <TextBox x:Name="txtUpdateHour" Width="45" Padding="4,3" Margin="0,4,5,4" TextAlignment="Center"/>
              <TextBlock Text=":" VerticalAlignment="Center" Margin="0,0,5,0"/>
              <TextBox x:Name="txtUpdateMin" Width="45" Padding="4,3" Margin="0,4" TextAlignment="Center"/>
            </StackPanel>
          </Grid>
          <TextBlock x:Name="lblUpdateTarget" Grid.Row="3" Text="" Margin="0,8,0,0" TextWrapping="Wrap"/>
          <StackPanel Grid.Row="4" Orientation="Horizontal" Margin="0,8,0,8">
            <Button x:Name="btnScheduleUpdate" Content="Programar actualizacion unica" Padding="12,6" Margin="0,0,8,0"/>
            <Button x:Name="btnRefreshUpdates" Content="Refrescar lista" Padding="12,6" Margin="0,0,8,0"/>
            <Button x:Name="btnDeleteUpdate" Content="Eliminar seleccionada" Padding="12,6"/>
          </StackPanel>
          <DataGrid x:Name="dgScheduledUpdates" Grid.Row="5" AutoGenerateColumns="False" IsReadOnly="True" SelectionMode="Single" CanUserAddRows="False">
            <DataGrid.Columns>
              <DataGridTextColumn Header="Destino" Binding="{Binding Destino}" Width="*"/>
              <DataGridTextColumn Header="Fecha" Binding="{Binding Fecha}" Width="110"/>
              <DataGridTextColumn Header="Estado" Binding="{Binding Estado}" Width="120"/>
              <DataGridTextColumn Header="Detalle" Binding="{Binding Detalle}" Width="*"/>
            </DataGrid.Columns>
          </DataGrid>
          <TextBlock x:Name="lblUpdateMsg" Grid.Row="6" Text="" Margin="0,8,0,0" TextWrapping="Wrap"/>
        </Grid>
      </TabItem>
      <TabItem Header="Validar conexiones">
        <ScrollViewer VerticalScrollBarVisibility="Auto">
        <StackPanel Margin="12">
          <TextBlock Text="Programar validacion de conexion (DNS, puerto 445 y C$)" FontSize="14" FontWeight="SemiBold" Margin="0,0,0,10"/>
          <Grid Margin="0,0,0,10">
            <Grid.ColumnDefinitions><ColumnDefinition Width="160"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
            <Grid.RowDefinitions>
              <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
              <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
              <RowDefinition Height="Auto"/>
            </Grid.RowDefinitions>
            <TextBlock Grid.Row="0" Grid.Column="0" Text="Estado actual:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBlock x:Name="lblConnState" Grid.Row="0" Grid.Column="1" Text="-" VerticalAlignment="Center" FontWeight="SemiBold" Margin="0,6"/>
            <TextBlock Grid.Row="1" Grid.Column="0" Text="Nombre de tarea:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtConnName" Grid.Row="1" Grid.Column="1" Padding="4,3" Margin="0,4"/>
            <TextBlock Grid.Row="2" Grid.Column="0" Text="Hora de ejecucion:" VerticalAlignment="Center" Margin="0,6"/>
            <StackPanel Grid.Row="2" Grid.Column="1" Orientation="Horizontal">
              <TextBox x:Name="txtConnHour" Width="50" Padding="4,3" Margin="0,4,6,4" TextAlignment="Center"/>
              <TextBlock Text=":" VerticalAlignment="Center" Margin="0,0,6,0"/>
              <TextBox x:Name="txtConnMin" Width="50" Padding="4,3" Margin="0,4" TextAlignment="Center"/>
            </StackPanel>
            <TextBlock Grid.Row="3" Grid.Column="0" Text="Fecha de inicio:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtConnDate" Grid.Row="3" Grid.Column="1" Padding="4,3" Margin="0,4" ToolTip="Formato: dd/mm/aaaa"/>
            <TextBlock Grid.Row="4" Grid.Column="0" Text="Grupo:" VerticalAlignment="Top" Margin="0,10"/>
            <StackPanel Grid.Row="4" Grid.Column="1" Margin="0,4">
              <ComboBox x:Name="cmbConnGroup" Padding="4,3"/>
              <TextBlock x:Name="lblConnScope" Text="" Margin="0,4,0,0" Foreground="#FF475569" TextWrapping="Wrap"/>
            </StackPanel>
            <TextBlock Grid.Row="5" Grid.Column="0" Text="Fuera de inventario:" VerticalAlignment="Top" Margin="0,10"/>
            <StackPanel Grid.Row="5" Grid.Column="1" Margin="0,4">
              <TextBox x:Name="txtConnExtra" Height="52" AcceptsReturn="True" TextWrapping="NoWrap"
                       VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto"
                       Padding="6,4" FontFamily="Consolas"
                       ToolTip="Si hay nombres, se valida solo ese lote (no se suma el grupo). Una linea, coma o punto y coma."/>
              <TextBlock Text="Si pegas nombres, se valida solo ese lote (el grupo no se suma). No se escriben en Servidores\." Margin="0,4,0,0" Foreground="#FF64748B" TextWrapping="Wrap"/>
            </StackPanel>
            <TextBlock Grid.Row="6" Grid.Column="0" Text="CSV:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBlock Grid.Row="6" Grid.Column="1" Text="Reportes\Conexiones\Conexiones_YYYY-MM-DD_HH-mm-ss.csv" VerticalAlignment="Center" Margin="0,6" Foreground="#FF475569"/>
          </Grid>
          <TextBlock Text="Donde ejecutar (Ejecutar ahora)" FontSize="14" FontWeight="SemiBold" Margin="0,4,0,6"/>
          <CheckBox x:Name="chkConnLocal" Content="Este pivot (inventario local)" IsChecked="True" Margin="0,0,0,6"/>
          <TextBlock Text="Pivots remotos: el principal NO entra al subdominio. Escribe un pedido (OrderFile) y espera el CSV en la bandeja (InboxDir). Completa esas rutas UNC en config.json (accesibles para ambas cuentas, sin guardar claves)." Foreground="#FF64748B" TextWrapping="Wrap" Margin="0,0,0,6"/>
          <ItemsControl x:Name="icConnPivots"/>
          <TextBlock x:Name="lblConnPivotsEmpty" Text="" Foreground="#FF94A3B8" TextWrapping="Wrap" Margin="0,0,0,8"/>
          <StackPanel Orientation="Horizontal" Margin="0,4,0,0">
            <Button x:Name="btnConnCreate" Content="Crear / Actualizar tarea" Padding="12,6" Margin="0,0,8,0"/>
            <Button x:Name="btnConnDelete" Content="Eliminar tarea" Padding="12,6" Margin="0,0,8,0"/>
            <Button x:Name="btnConnRunNow" Content="Ejecutar ahora" Padding="12,6"/>
          </StackPanel>
          <TextBlock Text="Vigia de pedidos (este equipo / subdominio)" FontSize="14" FontWeight="SemiBold" Margin="0,14,0,6"/>
          <TextBlock Text="Crear en el pivot del SUBDOMINIO con cuenta admin de ese dominio. Tarea frecuente: si no hay pedido, no valida. El principal solo deja el archivo de pedido." Foreground="#FF64748B" TextWrapping="Wrap" Margin="0,0,0,6"/>
          <Grid Margin="0,0,0,6">
            <Grid.ColumnDefinitions><ColumnDefinition Width="160"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
            <Grid.RowDefinitions>
              <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
              <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
            </Grid.RowDefinitions>
            <TextBlock Grid.Row="0" Grid.Column="0" Text="Estado vigia:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBlock x:Name="lblWatchState" Grid.Row="0" Grid.Column="1" Text="-" VerticalAlignment="Center" FontWeight="SemiBold" Margin="0,6"/>
            <TextBlock Grid.Row="1" Grid.Column="0" Text="Nombre de tarea:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtWatchName" Grid.Row="1" Grid.Column="1" Padding="4,3" Margin="0,4"/>
            <TextBlock Grid.Row="2" Grid.Column="0" Text="Cada (minutos):" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtWatchMins" Grid.Row="2" Grid.Column="1" Width="60" HorizontalAlignment="Left" Padding="4,3" Margin="0,4" TextAlignment="Center"/>
            <TextBlock Grid.Row="3" Grid.Column="0" Text="Archivo pedido:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtWatchOrder" Grid.Row="3" Grid.Column="1" Padding="4,3" Margin="0,4" ToolTip="UNC o ruta local de ejecutar.ahora"/>
            <TextBlock Grid.Row="4" Grid.Column="0" Text="Bandeja CSV:" VerticalAlignment="Center" Margin="0,6"/>
            <TextBox x:Name="txtWatchInbox" Grid.Row="4" Grid.Column="1" Padding="4,3" Margin="0,4" ToolTip="UNC o carpeta donde el vigia deja el CSV"/>
          </Grid>
          <StackPanel Orientation="Horizontal" Margin="0,0,0,8">
            <Button x:Name="btnWatchCreate" Content="Crear / Actualizar vigia" Padding="12,6" Margin="0,0,8,0"/>
            <Button x:Name="btnWatchDelete" Content="Eliminar vigia" Padding="12,6"/>
          </StackPanel>
          <ProgressBar x:Name="pbConn" Height="10" Margin="0,8,0,0" Minimum="0" Maximum="1" Value="0" Visibility="Collapsed"/>
          <TextBlock x:Name="lblConnMsg" Text="" Margin="0,8,0,0" TextWrapping="Wrap"/>
        </StackPanel>
        </ScrollViewer>
      </TabItem>
      <TabItem Header="Reinicio programado">
        <Grid Margin="12">
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
          </Grid.RowDefinitions>
          <TextBlock Grid.Row="0" Text="Reiniciar servidores especificos (sin parcheo)" FontSize="14" FontWeight="SemiBold" Margin="0,0,0,8"/>
          <TextBlock Grid.Row="1" TextWrapping="Wrap" Foreground="#FF475569" Margin="0,0,0,6"
                     Text="Pega nombres (linea, coma o ;). Pueden estar fuera del inventario; no se escriben en Servidores\."/>
          <Grid Grid.Row="2">
            <Grid.ColumnDefinitions><ColumnDefinition Width="150"/><ColumnDefinition Width="*"/></Grid.ColumnDefinitions>
            <Grid.RowDefinitions>
              <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
            </Grid.RowDefinitions>
            <TextBlock Grid.Row="0" Grid.Column="0" Text="Servidores:" VerticalAlignment="Top" Margin="0,8"/>
            <StackPanel Grid.Row="0" Grid.Column="1" Margin="0,4">
              <TextBox x:Name="txtRebootServers" Height="70" AcceptsReturn="True" TextWrapping="NoWrap"
                       VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto"
                       Padding="6,4" FontFamily="Consolas"
                       ToolTip="Un nombre por linea, o separados por coma o punto y coma."/>
              <TextBlock x:Name="lblRebootScope" Text="" Margin="0,4,0,0" Foreground="#FF475569" TextWrapping="Wrap"/>
            </StackPanel>
            <TextBlock Grid.Row="1" Grid.Column="0" Text="Fecha y hora:" VerticalAlignment="Center" Margin="0,6"/>
            <StackPanel Grid.Row="1" Grid.Column="1" Orientation="Horizontal">
              <TextBox x:Name="txtRebootDate" Width="120" Padding="4,3" Margin="0,4,8,4" ToolTip="dd/mm/aaaa"/>
              <TextBox x:Name="txtRebootHour" Width="45" Padding="4,3" Margin="0,4,5,4" TextAlignment="Center"/>
              <TextBlock Text=":" VerticalAlignment="Center" Margin="0,0,5,0"/>
              <TextBox x:Name="txtRebootMin" Width="45" Padding="4,3" Margin="0,4" TextAlignment="Center"/>
            </StackPanel>
          </Grid>
          <WrapPanel Grid.Row="3" Margin="0,8,0,8">
            <Button x:Name="btnRebootSchedule" Content="Programar reinicio" Padding="12,6" Margin="0,0,8,6"/>
            <Button x:Name="btnRebootRunNow" Content="Ejecutar ahora" Padding="12,6" Margin="0,0,8,6"/>
            <Button x:Name="btnRebootRefresh" Content="Refrescar lista" Padding="12,6" Margin="0,0,8,6"/>
            <Button x:Name="btnRebootDelete" Content="Eliminar seleccionada" Padding="12,6" Margin="0,0,0,6"/>
          </WrapPanel>
          <ProgressBar x:Name="pbReboot" Grid.Row="4" Height="10" Margin="0,0,0,8" Minimum="0" Maximum="1" Value="0" Visibility="Collapsed"/>
          <DataGrid x:Name="dgScheduledReboots" Grid.Row="5" AutoGenerateColumns="False" IsReadOnly="True" SelectionMode="Single" CanUserAddRows="False">
            <DataGrid.Columns>
              <DataGridTextColumn Header="Destino" Binding="{Binding Destino}" Width="*"/>
              <DataGridTextColumn Header="Fecha" Binding="{Binding Fecha}" Width="110"/>
              <DataGridTextColumn Header="Estado" Binding="{Binding Estado}" Width="120"/>
              <DataGridTextColumn Header="Detalle" Binding="{Binding Detalle}" Width="*"/>
            </DataGrid.Columns>
          </DataGrid>
          <TextBlock x:Name="lblRebootMsg" Grid.Row="6" Text="" Margin="0,8,0,0" TextWrapping="Wrap"/>
        </Grid>
      </TabItem>
    </TabControl>
    <Button x:Name="btnClose2" Grid.Row="1" Content="Cerrar" Padding="12,6" HorizontalAlignment="Right" Margin="0,8,0,0"/>
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
  $txtRebootServers = $win.FindName('txtRebootServers')
  $lblRebootScope = $win.FindName('lblRebootScope')
  $txtRebootDate = $win.FindName('txtRebootDate')
  $txtRebootHour = $win.FindName('txtRebootHour')
  $txtRebootMin = $win.FindName('txtRebootMin')
  $lblRebootMsg = $win.FindName('lblRebootMsg')
  $dgScheduledReboots = $win.FindName('dgScheduledReboots')
  $pbReboot = $win.FindName('pbReboot')
  $btnRebootSchedule = $win.FindName('btnRebootSchedule')
  $btnRebootRunNow = $win.FindName('btnRebootRunNow')
  $btnRebootRefresh = $win.FindName('btnRebootRefresh')
  $btnRebootDelete = $win.FindName('btnRebootDelete')
  $txtConnName = $win.FindName('txtConnName'); $txtConnName.Text = "$($script:Cfg.ScheduledConnectivity.TaskName)"
  $txtConnHour = $win.FindName('txtConnHour'); $txtConnHour.Text = "$($script:Cfg.ScheduledConnectivity.Hour)"
  $txtConnMin  = $win.FindName('txtConnMin');  $txtConnMin.Text  = "{0:00}" -f [int]$script:Cfg.ScheduledConnectivity.Minute
  $txtConnDate = $win.FindName('txtConnDate')
  $savedConnDate = "$($script:Cfg.ScheduledConnectivity.StartDate)".Trim()
  $txtConnDate.Text = if ($savedConnDate) { $savedConnDate } else { (Get-Date).ToString('dd/MM/yyyy') }
  $lblConnState = $win.FindName('lblConnState')
  $lblConnMsg   = $win.FindName('lblConnMsg')
  $pbConn       = $win.FindName('pbConn')
  $btnConnCreate = $win.FindName('btnConnCreate')
  $btnConnDelete = $win.FindName('btnConnDelete')
  $btnConnRunNow = $win.FindName('btnConnRunNow')
  $cmbConnGroup = $win.FindName('cmbConnGroup')
  $lblConnScope = $win.FindName('lblConnScope')
  $txtConnExtra = $win.FindName('txtConnExtra')
  $chkConnLocal = $win.FindName('chkConnLocal')
  $icConnPivots = $win.FindName('icConnPivots')
  $lblConnPivotsEmpty = $win.FindName('lblConnPivotsEmpty')
  $lblWatchState = $win.FindName('lblWatchState')
  $txtWatchName = $win.FindName('txtWatchName')
  $txtWatchMins = $win.FindName('txtWatchMins')
  $txtWatchOrder = $win.FindName('txtWatchOrder')
  $txtWatchInbox = $win.FindName('txtWatchInbox')
  $btnWatchCreate = $win.FindName('btnWatchCreate')
  $btnWatchDelete = $win.FindName('btnWatchDelete')
  $savedConnExtra = @(Get-ConnectivityExtraServers $script:Cfg.ScheduledConnectivity.ExtraServers)
  $txtConnExtra.Text = if ($savedConnExtra.Count -gt 0) { $savedConnExtra -join "`r`n" } else { '' }
  $owPaths = Get-OrderWatchPaths
  $txtWatchName.Text = if ("$($script:Cfg.OrderWatch.TaskName)".Trim()) { "$($script:Cfg.OrderWatch.TaskName)".Trim() } else { 'WUU_VigiaPedidos' }
  $txtWatchMins.Text = "$(if ([int]$script:Cfg.OrderWatch.IntervalMinutes -gt 0) { [int]$script:Cfg.OrderWatch.IntervalMinutes } else { 2 })"
  $txtWatchOrder.Text = "$($script:Cfg.OrderWatch.OrderFile)".Trim()
  if (-not $txtWatchOrder.Text) { $txtWatchOrder.Text = $owPaths.OrderFile }
  $txtWatchInbox.Text = "$($script:Cfg.OrderWatch.InboxDir)".Trim()
  if (-not $txtWatchInbox.Text) { $txtWatchInbox.Text = $owPaths.InboxDir }
  $remotePivotEntries = @(ConvertTo-RemotePivotEntries $script:Cfg.RemotePivots)
  foreach ($rp in $remotePivotEntries) {
    $cbp = New-Object System.Windows.Controls.CheckBox
    $hostLabel = if ("$($rp.Host)".Trim()) { " ($($rp.Host))" } else { '' }
    $cbp.Content = "$($rp.Name)$hostLabel"
    $cbp.Tag = $rp
    $cbp.IsChecked = [bool]$rp.Enabled
    $cbp.Margin = '0,0,0,4'
    [void]$icConnPivots.Items.Add($cbp)
  }
  if ($remotePivotEntries.Count -eq 0) {
    $lblConnPivotsEmpty.Text = 'No hay pivots remotos en config.json (RemotePivots). Completa Name, OrderFile e InboxDir (UNC).'
  } else {
    $lblConnPivotsEmpty.Text = ''
  }
  $cfgRef = $script:Cfg
  $csvRef = @($script:Csv)
  $configPath = Join-Path $script:ScriptDir 'config.json'
  $mainScriptPath = $PSCommandPath
  $fnGetTaskStatus = ${function:Get-TaskStatus}
  $fnParseDate     = ${function:Parse-ScheduledDateDMY}
  $fnFormatDate    = ${function:Format-ScheduledDateDMY}
  $fnSaveDef       = ${function:Save-ScheduledUpdateDefinition}
  $fnGetRows       = ${function:Get-ScheduledUpdateRows}
  $fnGetRebootRows = ${function:Get-ScheduledRebootRows}
  $fnRebootBatch   = ${function:Invoke-RemoteRebootBatch}
  $fnGetDir        = ${function:Get-ScheduledUpdateDir}
  $fnWriteLog      = ${function:Write-Log}
  $fnSyncCal       = ${function:Sync-ScheduleToDashboard}
  $fnConnAudit     = ${function:Invoke-ConnectivityAudit}
  $fnShowGrid      = ${function:Show-GridWindow}
  $fnParseNames    = ${function:Parse-ServerNameList}
  $fnSaveHistory   = ${function:Save-History}
  $fnAddSitio      = ${function:Add-ConnSitioColumn}
  $fnPivotOrder    = ${function:Invoke-RemotePivotOrderAndWait}
  $fnIsUnc         = ${function:Test-IsUncPath}
  $scriptDirRef    = $script:ScriptDir

  $groupNames = @($csvRef | ForEach-Object { "$($_.Grupo)".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
  $cmbUpdateGroup.ItemsSource = $groupNames
  if ($groupNames.Count -gt 0) { $cmbUpdateGroup.SelectedIndex = 0 }
  $allConnItem = New-Object System.Windows.Controls.ComboBoxItem
  $allConnItem.Content = 'Todos los grupos'
  $allConnItem.Tag = ''
  [void]$cmbConnGroup.Items.Add($allConnItem)
  foreach ($gName in $groupNames) {
    $gi = New-Object System.Windows.Controls.ComboBoxItem
    $gi.Content = $gName
    $gi.Tag = $gName
    [void]$cmbConnGroup.Items.Add($gi)
  }
  $savedConnGroup = "$($script:Cfg.ScheduledConnectivity.Group)".Trim()
  $cmbConnGroup.SelectedIndex = 0
  if ($savedConnGroup) {
    foreach ($it in $cmbConnGroup.Items) {
      if ("$($it.Tag)" -ieq $savedConnGroup) { $cmbConnGroup.SelectedItem = $it; break }
    }
  }
  $txtUpdateDate.Text = (Get-Date).ToString('dd/MM/yyyy')
  $txtUpdateHour.Text = (Get-Date).AddHours(1).ToString('HH')
  $txtUpdateMin.Text = '00'
  $txtRebootDate.Text = (Get-Date).ToString('dd/MM/yyyy')
  $txtRebootHour.Text = (Get-Date).AddHours(1).ToString('HH')
  $txtRebootMin.Text = '00'

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
      & $fnSyncCal -Action upsert -Kind 'Report' -TaskName $name -ScheduledAt $startAt -Recurrence 'Daily' -Details @{ PeriodMode = $periodMode; SpecificDate = $specificDate }
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
      & $fnSyncCal -Action delete -Kind 'Report' -TaskName $name
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
      & $fnSyncCal -Action upsert -Kind 'PatchWindow' -TaskName $taskName -ScheduledAt $startAt -Recurrence 'Once' -Details @{ TargetType = $targetType; TargetValue = $targetValue; Servers = $servers.Count }
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
      & $fnSyncCal -Action delete -Kind 'PatchWindow' -TaskName "$($selected.Tarea)"
      & $refreshUpdateListAction
    } catch {
      $lblUpdateMsg.Foreground = [System.Windows.Media.Brushes]::Red
      $lblUpdateMsg.Text = "Error: $($_.Exception.Message)"
    }
  }.GetNewClosure())

  & $refreshUpdateTargetAction
  $refreshConnStateAction = {
    $st = & $fnGetTaskStatus "$($cfgRef.ScheduledConnectivity.TaskName)"
    $lblConnState.Text = $st
    $lblConnState.Foreground = if ($st -eq 'NoExiste') { [System.Windows.Media.Brushes]::Gray }
                               elseif ($st -eq 'Ready') { [System.Windows.Media.Brushes]::Green }
                               else { [System.Windows.Media.Brushes]::DarkOrange }
  }.GetNewClosure()
  & $refreshConnStateAction

  $refreshWatchStateAction = {
    $st = & $fnGetTaskStatus "$($txtWatchName.Text.Trim())"
    $lblWatchState.Text = $st
    $lblWatchState.Foreground = if ($st -eq 'NoExiste') { [System.Windows.Media.Brushes]::Gray }
                                elseif ($st -eq 'Ready') { [System.Windows.Media.Brushes]::Green }
                                else { [System.Windows.Media.Brushes]::DarkOrange }
  }.GetNewClosure()
  & $refreshWatchStateAction

  $getConnGroupAction = {
    $sel = $cmbConnGroup.SelectedItem
    if (-not $sel) { return '' }
    return "$($sel.Tag)".Trim()
  }.GetNewClosure()

  $getConnExtraAction = {
    return @(& $fnParseNames "$($txtConnExtra.Text)")
  }.GetNewClosure()

  $refreshConnScopeAction = {
    $g = & $getConnGroupAction
    $extras = @(& $getConnExtraAction)
    if ($extras.Count -gt 0) {
      $lblConnScope.Text = "Se validaran solo $($extras.Count) servidor(es) del listado extra. El grupo no se suma."
    } elseif ($g) {
      $n = @($csvRef | Where-Object { "$($_.Grupo)".Trim() -ieq $g } |
             ForEach-Object { "$($_.Servidor)".Trim() } | Where-Object { $_ } | Sort-Object -Unique).Count
      $lblConnScope.Text = "Se validaran $n servidor(es) del grupo '$g'."
    } else {
      $n = @($csvRef | ForEach-Object { "$($_.Servidor)".Trim() } | Where-Object { $_ } | Sort-Object -Unique).Count
      $lblConnScope.Text = "Se validaran $n servidor(es) de todos los grupos."
    }
  }.GetNewClosure()
  $cmbConnGroup.Add_SelectionChanged({ & $refreshConnScopeAction }.GetNewClosure())
  $txtConnExtra.Add_TextChanged({ & $refreshConnScopeAction }.GetNewClosure())
  & $refreshConnScopeAction

  $win.FindName('btnConnCreate').Add_Click({
    try {
      $name = $txtConnName.Text.Trim()
      $h = 0; $m = 0
      if (-not $name) { throw 'Ingresa un nombre para la tarea.' }
      if (-not [int]::TryParse($txtConnHour.Text.Trim(), [ref]$h) -or
          -not [int]::TryParse($txtConnMin.Text.Trim(), [ref]$m) -or
          $h -lt 0 -or $h -gt 23 -or $m -lt 0 -or $m -gt 59) {
        throw 'Hora invalida (HH 0-23, MM 0-59).'
      }
      $startAt = & $fnParseDate $txtConnDate.Text.Trim() $h $m
      if ($startAt -lt (Get-Date).Date) { throw 'La fecha de inicio no puede ser anterior a hoy.' }
      $group = & $getConnGroupAction
      $extras = @(& $getConnExtraAction)
      $groupArg = if ($extras.Count -eq 0 -and $group) { " -ConnectivityGroup `"$group`"" } else { '' }
      $trigger = New-ScheduledTaskTrigger -Daily -At $startAt
      $action  = New-ScheduledTaskAction -Execute 'powershell.exe' `
                   -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$mainScriptPath`" -ScheduledConnectivity$groupArg"
      $set     = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 2) -StartWhenAvailable
      Register-ScheduledTask -TaskName $name -Trigger $trigger -Action $action `
        -Settings $set -RunLevel Highest -Force | Out-Null
      $cfgRef.ScheduledConnectivity.TaskName  = $name
      $cfgRef.ScheduledConnectivity.Hour      = $h
      $cfgRef.ScheduledConnectivity.Minute    = $m
      $cfgRef.ScheduledConnectivity.StartDate = & $fnFormatDate $startAt
      $cfgRef.ScheduledConnectivity.Enabled   = $true
      $cfgRef.ScheduledConnectivity.Group     = $group
      $cfgRef.ScheduledConnectivity.ExtraServers = @($extras)
      & $fnSaveDef $cfgRef $configPath
      $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::Green
      $dateLabel = & $fnFormatDate $startAt
      $scope = if ($extras.Count -gt 0) { "lote extra ($($extras.Count) servidor(es); sin grupos)" }
               elseif ($group) { "grupo '$group'" }
               else { 'todos los grupos' }
      $lblConnMsg.Text = "Tarea '$name' creada/actualizada ($scope). Primera ejecucion: $dateLabel a ${h}:$("{0:00}" -f $m). Luego diariamente. CSV en Reportes\Conexiones."
      & $fnWriteLog 'INFO' "Tarea de conexiones creada: $name ($scope) @ $dateLabel ${h}:$("{0:00}" -f $m)"
      & $fnSyncCal -Action upsert -Kind 'Connectivity' -TaskName $name -ScheduledAt $startAt -Recurrence 'Daily' -Details @{ Group = $group; Extra = $extras.Count }
      & $refreshConnStateAction
    } catch { $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::Red; $lblConnMsg.Text = "Error: $($_.Exception.Message)" }
  }.GetNewClosure())

  $win.FindName('btnConnDelete').Add_Click({
    $name = $txtConnName.Text.Trim()
    try {
      Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction Stop
      $cfgRef.ScheduledConnectivity.Enabled = $false
      & $fnSaveDef $cfgRef $configPath
      $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::DarkOrange
      $lblConnMsg.Text = "Tarea '$name' eliminada."
      & $fnWriteLog 'INFO' "Tarea de conexiones eliminada: $name"
      & $fnSyncCal -Action delete -Kind 'Connectivity' -TaskName $name
      & $refreshConnStateAction
    } catch { $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::Red; $lblConnMsg.Text = "Error: $($_.Exception.Message)" }
  }.GetNewClosure())

  $btnConnRunNow.Add_Click({
    $connBusy = @($btnConnCreate, $btnConnDelete, $btnConnRunNow, $cmbConnGroup, $txtConnExtra, $btnWatchCreate, $btnWatchDelete, $chkConnLocal)
    foreach ($c in $connBusy) { try { $c.IsEnabled = $false } catch {} }
    foreach ($item in @($icConnPivots.Items)) { try { $item.IsEnabled = $false } catch {} }
    $pbConn.Minimum = 0
    $pbConn.Maximum = 1
    $pbConn.Value = 0
    $pbConn.Visibility = 'Visible'
    try {
      $runLocal = [bool]$chkConnLocal.IsChecked
      $selectedPivots = @()
      foreach ($item in @($icConnPivots.Items)) {
        if ($item -is [System.Windows.Controls.CheckBox] -and [bool]$item.IsChecked -and $null -ne $item.Tag) {
          $selectedPivots += $item.Tag
        }
      }
      if (-not $runLocal -and $selectedPivots.Count -eq 0) {
        throw 'Marca "Este pivot" y/o al menos un pivot remoto.'
      }
      $allRows = @()
      $okTotal = 0
      $failTotal = 0
      $csvLines = New-Object System.Collections.Generic.List[string]
      $errLines = New-Object System.Collections.Generic.List[string]
      if ($runLocal) {
        $group = & $getConnGroupAction
        $extras = @(& $getConnExtraAction)
        $scope = if ($extras.Count -gt 0) { "del listado extra ($($extras.Count) servidor(es); sin grupos)" }
                 elseif ($group) { "del grupo '$group'" }
                 else { 'de todos los grupos' }
        $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
        $lblConnMsg.Text = "Validando 0/... $scope"
        $onProgress = {
          param($done, $total)
          $n = [Math]::Max(1, [int]$total)
          $pbConn.Maximum = $n
          $pbConn.Value = [Math]::Min([int]$done, $n)
          $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
          $lblConnMsg.Text = "Este pivot: validando $done/$total..."
          $win.Dispatcher.Invoke([Action]{}, [System.Windows.Threading.DispatcherPriority]::Background)
        }.GetNewClosure()
        $result = & $fnConnAudit -Group $group -ExtraServers $extras -OnProgress $onProgress
        $localRows = @(& $fnAddSitio $result.Rows 'Este pivot')
        $allRows += $localRows
        $okTotal += [int]$result.Ok
        $failTotal += [int]$result.Fail
        if ("$($result.Path)".Trim()) { $csvLines.Add("Este pivot: $($result.Path)") }
      }
      $pivotIdx = 0
      foreach ($pv in $selectedPivots) {
        $pivotIdx++
        $pName = "$($pv.Name)".Trim(); if (-not $pName) { $pName = "$($pv.Host)".Trim() }
        $onPivotProgress = {
          param($msg)
          $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
          $lblConnMsg.Text = "$msg"
          $win.Dispatcher.Invoke([Action]{}, [System.Windows.Threading.DispatcherPriority]::Background)
        }.GetNewClosure()
        try { & $onPivotProgress "Pivot ${pivotIdx}/$($selectedPivots.Count) '$pName': escribiendo pedido..." } catch {}
        try {
          $remote = & $fnPivotOrder $pv $onPivotProgress
          $allRows += @($remote.Rows)
          $okTotal += [int]$remote.Ok
          $failTotal += [int]$remote.Fail
          if ("$($remote.Path)".Trim()) { $csvLines.Add("$($remote.Name): $($remote.Path)") }
        } catch {
          $hadRemoteErr = $_.Exception.Message
          $errLines.Add("${pName}: $hadRemoteErr")
          & $fnWriteLog 'ERROR' "Pivot '${pName}': $hadRemoteErr"
        }
      }
      $combinedPath = ''
      if ($allRows.Count -gt 0 -and ($selectedPivots.Count -gt 0)) {
        $combDir = Join-Path $scriptDirRef 'Reportes\Conexiones'
        if (-not (Test-Path $combDir)) { New-Item -ItemType Directory -Path $combDir -Force | Out-Null }
        $combinedPath = Join-Path $combDir ("Conexiones_Orquestado_{0}.csv" -f (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'))
        $allRows | Export-Csv -Path $combinedPath -NoTypeInformation -Delimiter ';' -Encoding UTF8
        $csvLines.Insert(0, "Combinado: $combinedPath")
      }
      $summary = "Listo: $okTotal OK, $failTotal con error."
      if ($errLines.Count -gt 0) { $summary += "`nNo recibidos: $($errLines -join ' | ')" }
      if ($csvLines.Count -gt 0) { $summary += "`n" + ($csvLines -join "`n") }
      $lblConnMsg.Foreground = if ($failTotal -eq 0 -and $errLines.Count -eq 0) { [System.Windows.Media.Brushes]::Green } else { [System.Windows.Media.Brushes]::DarkOrange }
      $lblConnMsg.Text = $summary
      if ($allRows.Count -gt 0) {
        $gridTitle = if ($selectedPivots.Count -gt 0) { 'WUU - Validacion de conexiones (orquestada)' } else { 'WUU - Validacion de conexiones' }
        & $fnShowGrid $gridTitle $allRows
      } elseif ($errLines.Count -gt 0) {
        throw ($errLines -join "`n")
      }
    } catch {
      $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::Red
      $lblConnMsg.Text = "Error: $($_.Exception.Message)"
    } finally {
      $pbConn.Visibility = 'Collapsed'
      foreach ($c in $connBusy) { try { $c.IsEnabled = $true } catch {} }
      foreach ($item in @($icConnPivots.Items)) { try { $item.IsEnabled = $true } catch {} }
    }
  }.GetNewClosure())

  $btnWatchCreate.Add_Click({
    try {
      $name = $txtWatchName.Text.Trim()
      if (-not $name) { throw 'Ingresa un nombre para la tarea vigia.' }
      $mins = 0
      if (-not [int]::TryParse($txtWatchMins.Text.Trim(), [ref]$mins) -or $mins -lt 1 -or $mins -gt 60) {
        throw 'Intervalo invalido (1-60 minutos).'
      }
      $orderFile = $txtWatchOrder.Text.Trim()
      $inboxDir = $txtWatchInbox.Text.Trim()
      if (-not $orderFile -or -not $inboxDir) { throw 'Completa archivo de pedido y bandeja CSV (UNC recomendado).' }
      $startAt = (Get-Date).AddMinutes(1)
      $trigger = New-ScheduledTaskTrigger -Once -At $startAt `
                   -RepetitionInterval (New-TimeSpan -Minutes $mins) `
                   -RepetitionDuration (New-TimeSpan -Days 3650)
      $action  = New-ScheduledTaskAction -Execute 'powershell.exe' `
                   -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$mainScriptPath`" -WatchOrders"
      $set     = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 2) `
                   -StartWhenAvailable -MultipleInstances IgnoreNew
      Register-ScheduledTask -TaskName $name -Trigger $trigger -Action $action `
        -Settings $set -RunLevel Highest -Force | Out-Null
      $cfgRef.OrderWatch.TaskName = $name
      $cfgRef.OrderWatch.IntervalMinutes = $mins
      $cfgRef.OrderWatch.OrderFile = $orderFile
      $cfgRef.OrderWatch.InboxDir = $inboxDir
      $cfgRef.OrderWatch.Enabled = $true
      & $fnSaveDef $cfgRef $configPath
      $uncNote = if ((& $fnIsUnc $orderFile) -and (& $fnIsUnc $inboxDir)) { '' }
                 else { ' Aviso: las rutas no son UNC; el principal y el subdominio deben ver el mismo archivo/carpeta.' }
      $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::Green
      $lblConnMsg.Text = "Vigia '$name' creado/actualizado (cada $mins min). Si no hay pedido, no valida.$uncNote"
      & $fnWriteLog 'INFO' "Vigia de pedidos creado: $name cada ${mins}m | pedido=$orderFile | bandeja=$inboxDir"
      & $refreshWatchStateAction
    } catch { $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::Red; $lblConnMsg.Text = "Error: $($_.Exception.Message)" }
  }.GetNewClosure())

  $btnWatchDelete.Add_Click({
    $name = $txtWatchName.Text.Trim()
    try {
      Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction Stop
      $cfgRef.OrderWatch.Enabled = $false
      & $fnSaveDef $cfgRef $configPath
      $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::DarkOrange
      $lblConnMsg.Text = "Vigia '$name' eliminado."
      & $fnWriteLog 'INFO' "Vigia de pedidos eliminado: $name"
      & $refreshWatchStateAction
    } catch { $lblConnMsg.Foreground = [System.Windows.Media.Brushes]::Red; $lblConnMsg.Text = "Error: $($_.Exception.Message)" }
  }.GetNewClosure())

  $refreshRebootListAction = {
    $dgScheduledReboots.ItemsSource = @(& $fnGetRebootRows $scriptDirRef)
  }.GetNewClosure()

  $refreshRebootScopeAction = {
    $names = @(& $fnParseNames "$($txtRebootServers.Text)")
    if ($names.Count -eq 0) {
      $lblRebootScope.Text = 'Ingresa al menos un servidor para programar o ejecutar ahora.'
    } else {
      $outside = @($names | Where-Object {
        $n = $_
        -not (@($csvRef | Where-Object { "$($_.Servidor)".Trim() -ieq $n }).Count)
      }).Count
      $lblRebootScope.Text = if ($outside -gt 0) {
        "Se reiniciaran $($names.Count) servidor(es); $outside fuera del inventario."
      } else {
        "Se reiniciaran $($names.Count) servidor(es) del inventario."
      }
    }
  }.GetNewClosure()
  $txtRebootServers.Add_TextChanged({ & $refreshRebootScopeAction }.GetNewClosure())
  & $refreshRebootScopeAction
  & $refreshRebootListAction

  $btnRebootSchedule.Add_Click({
    $lblRebootMsg.Text = ''
    try {
      $servers = @(& $fnParseNames "$($txtRebootServers.Text)")
      if ($servers.Count -eq 0) { throw 'Ingresa al menos un servidor.' }
      $h = 0; $m = 0
      if (-not [int]::TryParse($txtRebootHour.Text.Trim(), [ref]$h) -or
          -not [int]::TryParse($txtRebootMin.Text.Trim(), [ref]$m) -or
          $h -lt 0 -or $h -gt 23 -or $m -lt 0 -or $m -gt 59) {
        throw 'Hora invalida (HH 0-23, MM 0-59).'
      }
      $startAt = & $fnParseDate $txtRebootDate.Text.Trim() $h $m
      if ($startAt -le (Get-Date)) { throw 'La fecha y hora de ejecucion deben ser futuras.' }

      $jobId = "{0}_{1}" -f (Get-Date -Format 'yyyyMMddHHmmss'), ([guid]::NewGuid().ToString('N').Substring(0,6))
      $taskName = "WUU_Reinicio_$jobId"
      $jobPath = Join-Path (& $fnGetDir $scriptDirRef) "$jobId.json"
      $job = [ordered]@{
        Kind='ScheduledReboot'; Version=1; JobId=$jobId; TaskName=$taskName
        Servers=@($servers); ScheduledAt=$startAt.ToString('o'); CreatedAt=(Get-Date).ToString('o')
        Status='Pendiente'; LastMessage=''; StartedAt=$null; CompletedAt=$null; Results=@()
      }
      & $fnSaveDef $job $jobPath
      try {
        $trigger = New-ScheduledTaskTrigger -Once -At $startAt
        $actionArgs = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$mainScriptPath`" -ScheduledReboot -JobFile `"$jobPath`""
        $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $actionArgs
        $settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 2) `
          -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
        Register-ScheduledTask -TaskName $taskName -Trigger $trigger -Action $action `
          -Settings $settings -RunLevel Highest -Force | Out-Null
      } catch {
        Remove-Item -Path $jobPath -Force -ErrorAction SilentlyContinue
        throw
      }
      $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::Green
      $lblRebootMsg.Text = "Tarea unica '$taskName' creada para $($startAt.ToString('dd/MM/yyyy HH:mm')). $($servers.Count) servidor(es)."
      & $fnWriteLog 'INFO' "Reinicio programado: $taskName | servidores=$($servers.Count) | $($startAt.ToString('s'))"
      & $fnSyncCal -Action upsert -Kind 'Reboot' -TaskName $taskName -ScheduledAt $startAt -Recurrence 'Once' -Details @{ Servers = $servers.Count }
      & $refreshRebootListAction
    } catch {
      $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::Red
      $lblRebootMsg.Text = "Error: $($_.Exception.Message)"
    }
  }.GetNewClosure())

  $btnRebootRefresh.Add_Click({ & $refreshRebootListAction }.GetNewClosure())
  $btnRebootDelete.Add_Click({
    $selected = $dgScheduledReboots.SelectedItem
    if (-not $selected) {
      $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::DarkOrange
      $lblRebootMsg.Text = 'Selecciona un reinicio programado para eliminar.'
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
      $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::DarkOrange
      $lblRebootMsg.Text = "Programacion '$($selected.Tarea)' eliminada."
      & $fnWriteLog 'INFO' "Reinicio programado eliminado: $($selected.Tarea)"
      & $fnSyncCal -Action delete -Kind 'Reboot' -TaskName "$($selected.Tarea)"
      & $refreshRebootListAction
    } catch {
      $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::Red
      $lblRebootMsg.Text = "Error: $($_.Exception.Message)"
    }
  }.GetNewClosure())

  $btnRebootRunNow.Add_Click({
    $lblRebootMsg.Text = ''
    $servers = @(& $fnParseNames "$($txtRebootServers.Text)")
    if ($servers.Count -eq 0) {
      $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::Red
      $lblRebootMsg.Text = 'Ingresa al menos un servidor.'
      return
    }
    $preview = ($servers | Select-Object -First 12) -join ', '
    if ($servers.Count -gt 12) { $preview = "$preview ..." }
    $resp = [System.Windows.MessageBox]::Show(
      "Vas a reiniciar ahora $($servers.Count) servidor(es) (sin parcheo).`nCada equipo recibira shutdown /r /t 10.`n`n$preview`n`nContinuar?",
      'WUU - Reinicio ahora', 'YesNo', 'Warning')
    if ($resp -ne 'Yes') { return }
    $busy = @($btnRebootSchedule, $btnRebootRunNow, $btnRebootRefresh, $btnRebootDelete, $txtRebootServers)
    foreach ($c in $busy) { try { $c.IsEnabled = $false } catch {} }
    $pbReboot.Minimum = 0
    $pbReboot.Maximum = [Math]::Max(1, $servers.Count)
    $pbReboot.Value = 0
    $pbReboot.Visibility = 'Visible'
    try {
      $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
      $lblRebootMsg.Text = "Reiniciando 0/$($servers.Count)..."
      $onProgress = {
        param($done, $total)
        $n = [Math]::Max(1, [int]$total)
        $pbReboot.Maximum = $n
        $pbReboot.Value = [Math]::Min([int]$done, $n)
        $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::DarkSlateGray
        $lblRebootMsg.Text = "Reiniciando $done/$total..."
        $win.Dispatcher.Invoke([Action]{}, [System.Windows.Threading.DispatcherPriority]::Background)
      }.GetNewClosure()
      $batch = & $fnRebootBatch -Servers $servers -Comment 'Reinicio iniciado desde WUU' -OnProgress $onProgress
      & $fnSaveHistory -Rows @($batch.Rows) -Type 'ReinicioManual'
      $lblRebootMsg.Foreground = if ($batch.Fail -eq 0) { [System.Windows.Media.Brushes]::Green } else { [System.Windows.Media.Brushes]::DarkOrange }
      $lblRebootMsg.Text = "Listo: $($batch.Ok) reinicio(s) enviado(s), $($batch.Fail) con error."
      & $fnWriteLog 'INFO' "Reinicio ahora: $($batch.Ok) OK, $($batch.Fail) error, total=$($batch.Total)"
      $gridRows = @($batch.Rows | ForEach-Object {
        [pscustomobject][ordered]@{ Servidor=$_.Servidor; IP=$_.IP; Estado=$_.State; Detalle=$_.Detalle }
      })
      & $fnShowGrid 'WUU - Reinicio ahora' $gridRows
    } catch {
      $lblRebootMsg.Foreground = [System.Windows.Media.Brushes]::Red
      $lblRebootMsg.Text = "Error: $($_.Exception.Message)"
    } finally {
      $pbReboot.Visibility = 'Collapsed'
      foreach ($c in $busy) { try { $c.IsEnabled = $true } catch {} }
    }
  }.GetNewClosure())

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

# Consultar: pide servidores (con o sin inventario), consulta KBs pendientes y guarda CSV
$btnConsultar.Add_Click({
  if (-not (Ensure-AnalystAssigned 'Consultar servidores')) { return }
  Start-Consult
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

function Invoke-ScheduledRebootJob([string]$DefinitionPath) {
  if (-not $DefinitionPath -or -not (Test-Path $DefinitionPath)) {
    Write-Log 'ERROR' "Reinicio programado: archivo de definicion inexistente: $DefinitionPath"
    Send-TeamsNotification -Title 'WUU - Reinicio programado (error)' -Level Error `
      -Text 'No se encontro el archivo de definicion del reinicio programado.' `
      -Facts @(@{Name='Archivo'; Value="$DefinitionPath"}; @{Name='Equipo'; Value=$env:COMPUTERNAME})
    return 2
  }
  try {
    $definition = Get-Content -Path $DefinitionPath -Raw | ConvertFrom-Json
  } catch {
    Write-Log 'ERROR' "Reinicio programado: JSON invalido: $($_.Exception.Message)"
    Send-TeamsNotification -Title 'WUU - Reinicio programado (error)' -Level Error `
      -Text 'La definicion JSON del reinicio programado es invalida.' `
      -Facts @(@{Name='Archivo'; Value="$DefinitionPath"}; @{Name='Detalle'; Value="$($_.Exception.Message)"})
    return 2
  }
  if ("$($definition.Kind)" -ne 'ScheduledReboot') {
    Write-Log 'ERROR' 'Reinicio programado: tipo de definicion no soportado.'
    Send-TeamsNotification -Title 'WUU - Reinicio programado (error)' -Level Error `
      -Text 'El archivo JSON no corresponde a un reinicio programado.' `
      -Facts @(@{Name='Archivo'; Value="$DefinitionPath"})
    return 2
  }

  $servers = @($definition.Servers | ForEach-Object { "$_".Trim() } | Where-Object { $_ } | Sort-Object -Unique)
  if ($servers.Count -eq 0) {
    $definition.Status = 'Error'
    $definition.LastMessage = 'La programacion no contiene servidores.'
    Save-ScheduledUpdateDefinition $definition $DefinitionPath
    Write-Log 'ERROR' 'Reinicio programado sin servidores.'
    Send-TeamsNotification -Title 'WUU - Reinicio programado (error)' -Level Error `
      -Text 'La programacion no contiene servidores.' `
      -Facts @(@{Name='Tarea'; Value="$($definition.TaskName)"})
    return 2
  }

  $definition.Status = 'En ejecucion'
  $definition.StartedAt = (Get-Date).ToString('o')
  $definition.LastMessage = "Reiniciando $($servers.Count) servidor(es)."
  Save-ScheduledUpdateDefinition $definition $DefinitionPath
  Write-Log 'INFO' "Reinicio programado iniciado: $($definition.TaskName) | servidores=$($servers.Count)"
  Send-TeamsNotification -Title 'WUU - Reinicio programado iniciado' -Level Info `
    -Text 'Se inicio un reinicio programado (sin parcheo).' `
    -Facts @(
      @{Name='Tarea'; Value="$($definition.TaskName)"}
      @{Name='Servidores'; Value="$($servers.Count)"}
      @{Name='Equipo'; Value=$env:COMPUTERNAME}
      @{Name='Inicio'; Value=(Get-Date).ToString('dd/MM/yyyy HH:mm:ss')}
    )

  try {
    $batch = Invoke-RemoteRebootBatch -Servers $servers -Comment 'Reinicio programado por WUU'
  } catch {
    $definition.Status = 'Error'
    $definition.LastMessage = $_.Exception.Message
    Save-ScheduledUpdateDefinition $definition $DefinitionPath
    Write-Log 'ERROR' "Reinicio programado: $($_.Exception.Message)"
    Send-TeamsNotification -Title 'WUU - Reinicio programado (error)' -Level Error `
      -Text $definition.LastMessage `
      -Facts @(@{Name='Tarea'; Value="$($definition.TaskName)"})
    return 2
  }

  $results = @($batch.Rows)
  Save-History -Rows $results -Type 'ReinicioProgramado'
  $errors = @($results | Where-Object { $_.State -ne 'OK' })
  $definition.Status = if ($errors.Count -eq 0) { 'Completada' } else { 'Completada con errores' }
  $definition.CompletedAt = (Get-Date).ToString('o')
  $definition.LastMessage = "$($results.Count) procesado(s), $($errors.Count) con error."
  $definition.Results = @($results)
  Save-ScheduledUpdateDefinition $definition $DefinitionPath
  Write-Log 'INFO' "Reinicio programado finalizado: $($definition.TaskName) | $($definition.LastMessage)"
  $errorLines = @($errors | ForEach-Object {
    $detail = if ("$($_.Error)") { "$($_.Error)" } else { "$($_.Status)" }
    "$($_.Servidor): $detail"
  })
  $finishLevel = if ($errors.Count -eq 0) { 'Success' } else { 'Warning' }
  Send-TeamsNotification -Title "WUU - Reinicio programado $($definition.Status.ToLower())" -Level $finishLevel `
    -Text $definition.LastMessage `
    -Facts @(
      @{Name='Tarea'; Value="$($definition.TaskName)"}
      @{Name='Enviados'; Value="$($batch.Ok)"}
      @{Name='Con error'; Value="$($batch.Fail)"}
      @{Name='Errores'; Value=(Format-TeamsErrorList $errorLines)}
      @{Name='Fin'; Value=(Get-Date).ToString('dd/MM/yyyy HH:mm:ss')}
    )
  return $(if ($errors.Count -eq 0) { 0 } else { 1 })
}

#--- Arranque -----------------------------------------------------------------
if ($WatchOrders) {
  Write-Log 'INFO' 'Modo headless (-WatchOrders) iniciado.'
  $watchExit = Invoke-OrderWatchJob
  exit [int]$watchExit
} elseif ($ScheduledConnectivity) {
  Write-Log 'INFO' "Modo headless (-ScheduledConnectivity) iniciado."
  $connExit = Invoke-ScheduledConnectivityJob -Group $ConnectivityGroup
  exit [int]$connExit
} elseif ($ScheduledReboot) {
  Write-Log 'INFO' "Modo headless (-ScheduledReboot) iniciado. JobFile=$JobFile"
  Load-Csv
  $rebootExitCode = Invoke-ScheduledRebootJob $JobFile
  exit [int]$rebootExitCode
} elseif ($ScheduledPatch) {
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
        Descripcion_Error='Falla de conexion: sin conexion o sin datos';Disk_Space=''
      }
    }
    try { $obj | Add-Member -NotePropertyName QueryName -NotePropertyValue $server -Force } catch {}
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

  Update-InventoryFromLiveData $bag

  # Guardar CSV + JSON del reporte
  $rows = @($bag | Sort-Object Servidor | ForEach-Object {
    [pscustomobject][ordered]@{
      Analista="$($script:AnalistaAsignado)".Trim()
      Grupo=(Get-InventoryGroupForServer $_.Servidor $(if ($_.PSObject.Properties['QueryName']) { $_.QueryName } else { '' }))
      Ambiente=(Get-InventoryFieldForServer $_.Servidor 'Ambiente' $(if ($_.PSObject.Properties['QueryName']) { $_.QueryName } else { '' }))
      Dominio=$_.Dominio;Servidor=$_.Servidor;IP=$_.IP
      Sistema_Operativo=$_.Sistema_Operativo;Version_Sistema_Operativo=$_.Version_Sistema_Operativo
      SQL_Instancia=$_.SQL_Instancia;SQL_Version=$_.SQL_Version;SQL_Ultima_Actualizacion=$_.SQL_Ultima_Actualizacion
      Fecha_Ventana=(Get-Date).ToString('yyyy-MM-dd')
      Fecha_Instalacion=$_.Fecha_Instalacion;KBs_Instaladas=$_.KBs_Instaladas
      Fecha_Reinicio=$_.Fecha_Reinicio;Running_Time=$_.Running_Time
      Estado=(Get-ReportEstado -Kbs $_.KBs_Instaladas -ErrorText $_.Descripcion_Error -NotaUpdates $(try { "$($_.Nota_Updates)" } catch { '' }) -UseProcessFlags $false)
      Descripcion_Error=$_.Descripcion_Error
      Comentarios=(Join-ReportComments '' $false $false $false);Disk_Space=$_.Disk_Space
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
          Analista="$($script:AnalistaAsignado)".Trim()
          Grupo=(Get-InventoryGroupForServer $_.Servidor $(if ($_.PSObject.Properties['QueryName']) { $_.QueryName } else { '' }))
          Ambiente=(Get-InventoryFieldForServer $_.Servidor 'Ambiente' $(if ($_.PSObject.Properties['QueryName']) { $_.QueryName } else { '' }))
          Dominio=$_.Dominio; Servidor=$_.Servidor; IP=$_.IP
          Sistema_Operativo=$_.Sistema_Operativo; Version_Sistema_Operativo=$_.Version_Sistema_Operativo
          SQL_Instancia=$_.SQL_Instancia; SQL_Version=$_.SQL_Version; SQL_Ultima_Actualizacion=$_.SQL_Ultima_Actualizacion
          Fecha_Ventana=(Get-Date).ToString('yyyy-MM-dd')
          Fecha_Instalacion=$_.Fecha_Instalacion; KBs_Instaladas=$_.KBs_Instaladas
          Fecha_Reinicio=$_.Fecha_Reinicio; Running_Time=$_.Running_Time
          Estado=(Get-ReportEstado -Kbs $_.KBs_Instaladas -ErrorText $_.Descripcion_Error -NotaUpdates $(try { "$($_.Nota_Updates)" } catch { '' }) -UseProcessFlags $false)
          Descripcion_Error=$_.Descripcion_Error
          Comentarios=(Join-ReportComments '' $false $false $false); Disk_Space=$_.Disk_Space
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
# Crea/arranca el temporizador para leer ordenes del dashboard (cada 30s)
function Start-DashboardOrdersTimer {
  if (-not $script:DashboardOrdersTimer) {
    $script:DashboardOrdersTimer = New-Object System.Windows.Threading.DispatcherTimer
    $script:DashboardOrdersTimer.Interval = [TimeSpan]::FromSeconds(30)
    $script:DashboardOrdersTimer.add_Tick({ On-DashboardOrdersTick })
    $script:DashboardOrdersTimer.Start()
  }
}

function On-DashboardOrdersTick {
  if (-not [bool]$script:Cfg.Dashboard.Enabled) { return }
  $url = Get-DashboardCalendarUrl
  if (-not $url) { return }
  $pendingUrl = ($url -replace '/api/calendar', '/api/orders/pending')
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $res = Invoke-WebRequest -Uri $pendingUrl -Method Get -TimeoutSec 10 -UseBasicParsing
    $orders = $res.Content | ConvertFrom-Json
    if (-not $orders) { return }
    foreach ($order in $orders) {
      Write-Log 'INFO' "Procesando orden del dashboard: $($order.title)"
      # Actualizar estado a IN_PROGRESS
      $statusUrl = ($url -replace '/api/calendar', '/api/orders/status')
      $payload = @{ orderId = $order.id; status = 'IN_PROGRESS'; executionLog = 'Iniciando ejecución en WUU...' } | ConvertTo-Json
      Invoke-WebRequest -Uri $statusUrl -Method Post -Body $payload -ContentType 'application/json' -UseBasicParsing | Out-Null
      
      # Generar el archivo JSON para el headless
      $jobFile = Join-Path (Get-ScheduledUpdateDir) "Order_$($order.id).json"
      $targetType = if ($order.targetServers) { 'Server' } else { 'Group' }
      $targetValue = if ($order.targetServers) { $order.targetServers } else { $order.targetGroups }
      
      # Obtener lista de servidores
      $servers = @()
      if ($targetType -eq 'Group') {
        $groups = $targetValue -split ',' | ForEach-Object { "$_".Trim() } | Where-Object { $_ }
        foreach ($row in $script:Servers) {
          if ($groups -contains $row.Grupo) { $servers += $row.Servidor }
        }
      } else {
        $servers = $targetValue -split ',' | ForEach-Object { "$_".Trim() } | Where-Object { $_ }
      }

      $jobDef = [ordered]@{
        Kind = 'ScheduledPatch'
        TaskName = "DashboardOrder_$($order.id)"
        TargetType = $targetType
        TargetValue = $targetValue
        Servers = $servers
        ActionType = $order.actionType
        ScheduledAt = $order.scheduledAt
        Status = 'En progreso'
      }
      Save-ScheduledUpdateDefinition $jobDef $jobFile
      
      # Correr de forma asíncrona lanzando otra instancia de WUU en modo ScheduledPatch
      $wuuPath = $script:ScriptDir + '\WUU.ps1'
      Start-Process powershell.exe -ArgumentList "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$wuuPath`" -ScheduledPatch -JobFile `"$jobFile`"" -NoNewWindow
    }
  } catch {}
}

  #============================================================================
  #  MODO NORMAL: interfaz grafica
  #============================================================================
  Load-Csv
  Update-ButtonStates
  Start-DashboardOrdersTimer
  $Window.ShowDialog() | Out-Null
}
