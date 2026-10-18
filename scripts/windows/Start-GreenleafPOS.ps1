# Greenleaf POS — yerel Node sunucusu (server.mjs)
$ErrorActionPreference = 'Stop'
$Root = if ($env:GREENLEAF_INSTALL_DIR) { $env:GREENLEAF_INSTALL_DIR } else {
  Resolve-Path (Join-Path $PSScriptRoot '..\..')
}
Set-Location $Root

if (-not (Test-Path (Join-Path $Root '.env'))) {
  $data = Join-Path $env:ProgramData 'GreenleafPOS\data'
  @"
PORT=5190
HOST=127.0.0.1
MARKET_POS_DATA_DIR=$data
GREENLEAF_DESKTOP=1
"@ | Set-Content (Join-Path $Root '.env') -Encoding UTF8
}

# Fiş köprüsü (Zywell) — arka planda
$bridge = Join-Path $Root 'scripts\lima-raw-print-bridge.mjs'
if (Test-Path $bridge) {
  Start-Process -FilePath 'node' -ArgumentList $bridge -WindowStyle Hidden -ErrorAction SilentlyContinue
}

Write-Host "Greenleaf POS başlıyor — http://127.0.0.1:5190/app"
node server.mjs
