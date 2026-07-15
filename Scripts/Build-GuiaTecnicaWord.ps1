# Genera la Guia Tecnica PatchControl en formato Word (plantilla Algeiba v3).
# Lee GUIA_TECNICA.md y aplica estilos corporativos. Requiere Microsoft Word.
param(
  [string]$MarkdownPath = (Join-Path (Split-Path $PSScriptRoot -Parent) 'GUIA_TECNICA.md'),
  [string]$OutputPath   = (Join-Path (Split-Path $PSScriptRoot -Parent) 'Guia Tecnica PatchControl WUU - v4.docx')
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$template = Get-ChildItem -Path $root -Filter 'Guia T*cnica de Script de Automatizaci*n de Patching - v3.docx' | Select-Object -First 1
if (-not $template) { throw 'No se encontro la plantilla Word v3 en la carpeta PatchControl.' }
if (-not (Test-Path $MarkdownPath)) { throw "No se encontro: $MarkdownPath" }

$wdCollapseEnd          = 0
$wdSectionBreakNextPage = 2

function Get-WordApp {
  try { return New-Object -ComObject Word.Application }
  catch { throw 'Microsoft Word no esta instalado o no esta disponible via COM.' }
}

function Set-WordStyle($range, [string]$style) {
  foreach ($name in @($style, 'Normal (Web)', 'Normal')) {
    try { $range.Style = $name; return }
    catch {}
  }
}

function Add-Para($doc, [string]$text, [string]$style = 'Normal (Web)') {
  if ([string]::IsNullOrWhiteSpace($text)) { return }
  $r = $doc.Content
  $r.Collapse($wdCollapseEnd)
  $start = $r.Start
  $r.InsertAfter($text.Trim())
  $r.InsertParagraphAfter()
  $paraRange = $doc.Range($start, $r.Start)
  Set-WordStyle $paraRange $style
}

function Add-Bullet($doc, [string[]]$items) {
  foreach ($item in $items) {
    if ([string]::IsNullOrWhiteSpace($item)) { continue }
    $r = $doc.Content
    $r.Collapse($wdCollapseEnd)
    $start = $r.Start
    $r.InsertAfter((Strip-MdInline $item.Trim()))
    $r.InsertParagraphAfter()
    $paraRange = $doc.Range($start, $r.Start)
    Set-WordStyle $paraRange 'Párrafo de lista'
    try { $paraRange.ListFormat.ApplyBulletDefault() | Out-Null } catch {}
  }
}

function Add-Numbered($doc, [string[]]$items) {
  foreach ($item in $items) {
    if ([string]::IsNullOrWhiteSpace($item)) { continue }
    $r = $doc.Content
    $r.Collapse($wdCollapseEnd)
    $start = $r.Start
    $r.InsertAfter((Strip-MdInline $item.Trim()))
    $r.InsertParagraphAfter()
    $paraRange = $doc.Range($start, $r.Start)
    Set-WordStyle $paraRange 'Párrafo de lista'
    try { $paraRange.ListFormat.ApplyNumberDefault() | Out-Null } catch {}
  }
}

function Add-CodeBlock($doc, [string[]]$lines, [string]$lang) {
  if ($lang -eq 'mermaid') {
    Add-Para $doc 'Diagrama de flujo (representacion textual):' 'Normal (Web)'
  }
  foreach ($line in $lines) {
    Add-Para $doc $line 'Código HTML'
  }
  Add-Para $doc '' 'Normal (Web)'
}

function Strip-MdInline([string]$text) {
  if (-not $text) { return '' }
  $t = $text
  $t = [regex]::Replace($t, '\*\*(.+?)\*\*', '$1')
  $t = [regex]::Replace($t, '\*(.+?)\*', '$1')
  $t = [regex]::Replace($t, '`([^`]+)`', '$1')
  $t = [regex]::Replace($t, '\[([^\]]+)\]\([^)]+\)', '$1')
  $t = $t -replace '\\([\\`*_{}\[\]()#+\-.!|])', '$1'
  return $t.Trim()
}

function Split-MdTableRow([string]$line) {
  $cells = ($line.Trim().Trim('|') -split '\|') | ForEach-Object { Strip-MdInline $_.Trim() }
  return [string[]]$cells
}

function Add-MdTable($doc, [string[]]$tableLines) {
  if ($tableLines.Count -lt 2) { return }
  $headers = Split-MdTableRow $tableLines[0]
  $rows = New-Object System.Collections.Generic.List[string[]]
  for ($i = 2; $i -lt $tableLines.Count; $i++) {
    if ($tableLines[$i] -match '\|') { [void]$rows.Add((Split-MdTableRow $tableLines[$i])) }
  }
  if ($headers.Count -eq 0) { return }

  $r = $doc.Content
  $r.Collapse($wdCollapseEnd)
  $numRows = 1 + $rows.Count
  $numCols = $headers.Count
  $table = $doc.Tables.Add($r, $numRows, $numCols)
  $table.Borders.Enable = $true
  try { $table.Style = 'Tabla con cuadrícula' } catch {}

  for ($c = 0; $c -lt $numCols; $c++) {
    $cell = $table.Cell(1, $c + 1)
    $cell.Range.Text = $(if ($c -lt $headers.Count) { [string]$headers[$c] } else { '' })
    $cell.Range.Bold = $true
  }
  for ($ri = 0; $ri -lt $rows.Count; $ri++) {
    $row = $rows[$ri]
    for ($c = 0; $c -lt $numCols; $c++) {
      $val = if ($c -lt $row.Count) { [string]$row[$c] } else { '' }
      $table.Cell($ri + 2, $c + 1).Range.Text = $val
    }
  }
  try { $table.Rows.Item(1).HeadingFormat = $true } catch {}

  $r = $doc.Content
  $r.Collapse($wdCollapseEnd)
  $r.InsertParagraphAfter()
}

function Import-MarkdownGuia($doc, [string[]]$lines) {
  $inCode = $false
  $codeLang = ''
  $codeLines = [System.Collections.Generic.List[string]]::new()
  $tableLines = [System.Collections.Generic.List[string]]::new()
  $numbered = [System.Collections.Generic.List[string]]::new()
  $bullets = [System.Collections.Generic.List[string]]::new()
  $skipToc = $true
  $started = $false

  function Flush-Lists {
    param($docRef, $numList, $bulList)
    if ($numList.Count -gt 0) {
      Add-Numbered $docRef @($numList.ToArray())
      $numList.Clear()
    }
    if ($bulList.Count -gt 0) {
      Add-Bullet $docRef @($bulList.ToArray())
      $bulList.Clear()
    }
  }

  foreach ($raw in $lines) {
    $line = $raw -replace "`r", ''

    if (-not $started) {
      if ($line -match '^##\s+1\.') { $started = $true }
      else { continue }
    }

    if ($inCode) {
      if ($line -match '^```\s*$') {
        Add-CodeBlock $doc @($codeLines.ToArray()) $codeLang
        $codeLines.Clear()
        $inCode = $false
        $codeLang = ''
      }
      else { $codeLines.Add($line) }
      continue
    }

    if ($tableLines.Count -gt 0 -and $line -notmatch '^\|') {
      Add-MdTable $doc @($tableLines.ToArray())
      $tableLines.Clear()
    }

    if ($line -match '^\|') {
      Flush-Lists $doc $numbered $bullets
      $tableLines.Add($line)
      continue
    }

    if ($line -match '^```(\w*)') {
      Flush-Lists $doc $numbered $bullets
      $inCode = $true
      $codeLang = $Matches[1]
      continue
    }

    if ($line -match '^---+\s*$') {
      Flush-Lists $doc $numbered $bullets
      continue
    }

    if ($skipToc -and $line -match '^##\s+Tabla de contenidos') { continue }
    if ($skipToc -and $line -match '^\d+\.\s+\[') { continue }

    if ($line -match '^####\s+(.+)$') {
      Flush-Lists $doc $numbered $bullets
      Add-Para $doc (Strip-MdInline $Matches[1]) 'Título 3'
      continue
    }
    if ($line -match '^###\s+(.+)$') {
      Flush-Lists $doc $numbered $bullets
      Add-Para $doc (Strip-MdInline $Matches[1]) 'Título 2'
      continue
    }
    if ($line -match '^##\s+(.+)$') {
      Flush-Lists $doc $numbered $bullets
      Add-Para $doc (Strip-MdInline $Matches[1]) 'Título 1'
      $skipToc = $false
      continue
    }

    if ($line -match '^>\s*(.+)$') {
      Flush-Lists $doc $numbered $bullets
      Add-Para $doc (Strip-MdInline $Matches[1]) 'cita destacada'
      continue
    }

    if ($line -match '^-\s+\[([ xX])\]\s+(.+)$') {
      $mark = if ($Matches[1] -match 'x') { '[x]' } else { '[ ]' }
      $bullets.Add("$mark $($Matches[2])")
      continue
    }
    if ($line -match '^-\s+(.+)$') {
      $bullets.Add($Matches[1])
      continue
    }
    if ($line -match '^\d+\.\s+(.+)$') {
      $numbered.Add($Matches[1])
      continue
    }

    if ([string]::IsNullOrWhiteSpace($line)) {
      Flush-Lists $doc $numbered $bullets
      continue
    }

    Flush-Lists $doc $numbered $bullets
    Add-Para $doc (Strip-MdInline $line) 'Normal (Web)'
  }

  if ($tableLines.Count -gt 0) { Add-MdTable $doc @($tableLines.ToArray()) }
  Flush-Lists $doc $numbered $bullets
  if ($inCode -and $codeLines.Count -gt 0) { Add-CodeBlock $doc @($codeLines.ToArray()) $codeLang }
}

# --- Main ---
if (Test-Path $OutputPath) { Remove-Item $OutputPath -Force }
Copy-Item $template.FullName $OutputPath

$mdLines = [System.IO.File]::ReadAllLines($MarkdownPath, [System.Text.Encoding]::UTF8)

$word = Get-WordApp
$word.Visible = $false
$doc = $null
try {
  $doc = $word.Documents.Open($OutputPath)
  $bodyEnd = $doc.Content.End - 1
  if ($bodyEnd -gt 1) { $doc.Range(0, $bodyEnd).Delete() }

  Add-Para $doc 'Guía Técnica — PatchControl / WUU' 'Título Portada'
  Add-Para $doc 'Versión del documento: 4.0 | Basado en GUIA_TECNICA.md y WUU.ps1 | Algeiba' 'Normal (Web)'
  Add-Para $doc 'El material contenido en este documento tiene informacion confidencial que pertenece a Algeiba, no podra ser utilizada, fotocopiada, duplicada o revelada para cualquier proposito diferente a los indicados por Algeiba; esta restriccion no limita a otros el derecho a utilizar informacion contenida en este documento que ha sido obtenida de otras fuentes sin restriccion.' 'cita destacada'

  $r = $doc.Content
  $r.Collapse($wdCollapseEnd)
  $r.InsertBreak($wdSectionBreakNextPage)

  Add-Para $doc 'Índice' 'Título 1'
  $tocRange = $doc.Content
  $tocRange.Collapse($wdCollapseEnd)
  $doc.TablesOfContents.Add($tocRange) | Out-Null
  $r = $doc.Content
  $r.Collapse($wdCollapseEnd)
  $r.InsertBreak($wdSectionBreakNextPage)

  Import-MarkdownGuia $doc $mdLines

  Add-Para $doc 'Versión del documento: 4.0 | Producto: PatchControl — WUU | Algeiba' 'Normal (Web)'

  foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
  $doc.Save()
  $doc.Close()
  Write-Host "Documento generado: $OutputPath"
}
finally {
  if ($doc) { try { $doc.Close($false) } catch {} }
  if ($word) { $word.Quit(); [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null }
  [GC]::Collect(); [GC]::WaitForPendingFinalizers()
}
