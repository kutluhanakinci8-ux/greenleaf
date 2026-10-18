#Requires -RunAsAdministrator
<#
.SYNOPSIS
  Greenleaf POS — yerel kurulum (Node + veri ProgramData, port 5190).
.DESCRIPTION
  Repo kökünden çalıştırın: powershell -ExecutionPolicy Bypass -File scripts\windows\Install-GreenleafPOS.ps1
#>
$ErrorActionPreference = 'Stop'

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$InstallDir = if ($env:GREENLEAF_INSTALL_DIR) { $env:GREENLEAF_INSTALL_DIR } else { 'C:\Program Files\GreenleafPOS' }
$DataDir = Join-Path $env:ProgramData 'GreenleafPOS\data'
$Port = if ($env:GREENLEAF_PORT) { $env:GREENLEAF_PORT } else { '5190' }
$LogDir = Join-Path $env:ProgramData 'GreenleafPOS\logs'

function Test-NodeVersion {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) {
    throw "Node.js bulunamadı. LTS kurun: https://nodejs.org/ sonra bu scripti tekrar çalıştırın."
  }
  $ver = (node -p "process.versions.node")
  Write-Host "Node $ver"
}

Write-Host "==> Greenleaf POS kurulum"
Write-Host "    Kaynak : $RepoRoot"
Write-Host "    Kurulum: $InstallDir"
Write-Host "    Veri   : $DataDir"

Test-NodeVersion

New-Item -ItemType Directory -Force -Path $InstallDir, $DataDir, $LogDir | Out-Null

# Uygulama dosyaları (geliştirme: robocopy repo; güncelleme aynı klasörü ezer, data dokunulmaz)
$exclude = @('node_modules', '.git', 'data', '.env')
robocopy $RepoRoot $InstallDir /MIR /XD node_modules .git data /XF .env /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy hata kodu $LASTEXITCODE" }

Set-Location $InstallDir

Write-Host "==> npm install (production)..."
npm install --omit=dev 2>&1 | Tee-Object -FilePath (Join-Path $LogDir 'npm-install.log')

Write-Host "==> Build..."
npm run build 2>&1 | Tee-Object -FilePath (Join-Path $LogDir 'npm-build.log')

$envContent = @"
PORT=$Port
HOST=127.0.0.1
NODE_ENV=production
MARKET_POS_DATA_DIR=$DataDir
EKOLOJIK_PUBLIC_ORIGIN=http://127.0.0.1:$Port
GREENLEAF_DESKTOP=1
LERTA_PLATFORM_BRIDGE=0
"@
$envPath = Join-Path $InstallDir '.env'
Set-Content -Path $envPath -Value $envContent -Encoding UTF8

$startScript = Join-Path $InstallDir 'scripts\windows\Start-GreenleafPOS.ps1'
$taskName = 'GreenleafPOS'
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$startScript`""
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null

$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'Greenleaf POS.url'
@"
[InternetShortcut]
URL=http://127.0.0.1:$Port/app
IconIndex=0
"@ | Set-Content -Path $shortcutPath -Encoding ASCII

Write-Host ""
Write-Host "Kurulum tamam."
Write-Host "  Uygulama: http://127.0.0.1:$Port/app"
Write-Host "  Veri     : $DataDir"
Write-Host "  Oturum açılışında servis: görev '$taskName'"
Write-Host ""
Write-Host "Zywell fiş (bir kez): $InstallDir\public\install\windows\ekolojik-zywell-setup.ps1"
Write-Host "Şimdi başlatmak için: powershell -File `"$startScript`""
