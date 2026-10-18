# Geliştirici: uzaktan güncelleme için zip paketi (veri hariç)
$ErrorActionPreference = 'Stop'
$Root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$Out = Join-Path $Root 'release'
$ver = (Get-Content (Join-Path $Root 'package.json') -Raw | ConvertFrom-Json).version
$zip = Join-Path $Out "greenleaf-pos-$ver-win64.zip"

New-Item -ItemType Directory -Force -Path $Out | Out-Null
if (Test-Path $zip) { Remove-Item $zip -Force }

Push-Location $Root
npm run build
Pop-Location

$staging = Join-Path $env:TEMP "greenleaf-staging-$ver"
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging | Out-Null

robocopy $Root $staging /E /XD node_modules .git data release .qa-tmp-data /XF .env | Out-Null
Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $zip -Force
Remove-Item $staging -Recurse -Force

Write-Host "Paket: $zip"
Write-Host "Mağazaya: zip + Install-GreenleafPOS.ps1 veya sizin updater ile Program Files güncellemesi"
