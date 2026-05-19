# Instala un paquete de actualizacion desde C:\Temp (invocado por PsExec como SYSTEM).
# El paquete ya debe estar copiado en C:\Temp por WUU.ps1.
# Progreso: C:\Temp\WU-SpecialProgress.txt  (formato: porcentaje|mensaje)
# Resultado: C:\Temp\WU-SpecialResult.txt    (JSON)

param(
    [string]$PackageFileName = ''
)

if ([string]::IsNullOrWhiteSpace($PackageFileName)) {
    $nameFile = 'C:\Temp\WU-SpecialPackageName.txt'
    if (Test-Path -LiteralPath $nameFile) {
        $PackageFileName = (Get-Content -LiteralPath $nameFile -Raw -ErrorAction Stop).Trim()
    }
}
if ([string]::IsNullOrWhiteSpace($PackageFileName)) {
    throw 'No se especifico el nombre del paquete (parametro o C:\Temp\WU-SpecialPackageName.txt).'
}

$ErrorActionPreference = 'Stop'
$tempDir = 'C:\Temp'
$packagePath = Join-Path $tempDir $PackageFileName
$progressFile = Join-Path $tempDir 'WU-SpecialProgress.txt'
$resultFile = Join-Path $tempDir 'WU-SpecialResult.txt'

function Write-SpecialProgress {
    param(
        [int]$Percent,
        [string]$Message
    )
    $pct = [Math]::Max(0, [Math]::Min(100, $Percent))
    Set-Content -LiteralPath $progressFile -Value "$pct|$Message" -Encoding ASCII -Force
}

try {
    if (-not (Test-Path -LiteralPath $tempDir)) {
        New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
    }
    Remove-Item -LiteralPath $resultFile -Force -ErrorAction SilentlyContinue

    if (-not (Test-Path -LiteralPath $packagePath)) {
        throw "No se encontro el paquete en $packagePath"
    }

    Write-SpecialProgress 52 'Verificando paquete en C:\Temp...'
    $ext = [System.IO.Path]::GetExtension($packagePath).ToLowerInvariant()
    $rebootRequired = $false
    $exitCode = 0

    switch ($ext) {
        '.msu' {
            Write-SpecialProgress 58 'Instalando actualizacion MSU (wusa)...'
            $wusaArgs = "`"$packagePath`" /quiet /norestart"
            $proc = Start-Process -FilePath 'wusa.exe' -ArgumentList $wusaArgs -Wait -PassThru -WindowStyle Hidden
            $exitCode = $proc.ExitCode
            if ($exitCode -notin 0, 3010, 1641, 2359302) {
                throw "wusa.exe finalizo con codigo $exitCode"
            }
            $rebootRequired = ($exitCode -in 3010, 1641)
        }
        '.cab' {
            Write-SpecialProgress 62 'Instalando paquete CAB (DISM)...'
            $dismLog = Join-Path $tempDir 'WU-Special-Dism.log'
            & dism.exe /Online /Add-Package /PackagePath:$packagePath /Quiet /NoRestart /LogPath:$dismLog 2>&1 | Out-Null
            $exitCode = $LASTEXITCODE
            if ($exitCode -notin 0, 3010) {
                throw "DISM finalizo con codigo $exitCode (ver $dismLog)"
            }
            $rebootRequired = ($exitCode -eq 3010)
        }
        '.exe' {
            Write-SpecialProgress 58 'Ejecutando instalador EXE...'
            $proc = Start-Process -FilePath $packagePath -ArgumentList '/quiet /norestart' -Wait -PassThru -WindowStyle Hidden
            $exitCode = $proc.ExitCode
            if ($exitCode -notin 0, 3010, 1641) {
                throw "Instalador EXE finalizo con codigo $exitCode"
            }
            $rebootRequired = ($exitCode -in 3010, 1641)
        }
        default {
            throw "Extension no soportada: $ext (use .msu, .cab o .exe)"
        }
    }

    Write-SpecialProgress 95 'Finalizando instalacion...'
    $resultObj = [PSCustomObject]@{
        Success        = $true
        RebootRequired = $rebootRequired
        ExitCode       = $exitCode
        Package        = $PackageFileName
    }
    Set-Content -LiteralPath $resultFile -Value ($resultObj | ConvertTo-Json -Compress) -Encoding UTF8
    Write-SpecialProgress 100 'Instalacion completada'
    Write-Output 'WUU_SPECIAL_OK'
    exit 0
}
catch {
    $errText = $_.Exception.Message
    Write-SpecialProgress 100 "ERROR: $errText"
    $failObj = [PSCustomObject]@{
        Success = $false
        Error   = $errText
    }
    Set-Content -LiteralPath $resultFile -Value ($failObj | ConvertTo-Json -Compress) -Encoding UTF8 -ErrorAction SilentlyContinue
    Write-Error $errText
    exit 1
}
