# Greenleaf POS — Zywell POS-80 + fiş köprüsü (Windows, bir kez)
$ErrorActionPreference = 'Stop'
$BaseUrl = if ($env:GREENLEAF_APP_ORIGIN) { $env:GREENLEAF_APP_ORIGIN.TrimEnd('/') } else { 'http://127.0.0.1:5190' }
$StandardPrinter = 'Greenleaf POS-80 (Zywell)'
$DestDir = Join-Path $env:USERPROFILE '.greenleaf-pos'
$TaskName = 'GreenleafReceiptBridge'
$Node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $Node) {
  Write-Host 'Node.js LTS gerekli: https://nodejs.org — kurun ve bu betigi tekrar calistirin.'
  exit 1
}

New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
$files = @(
  'receipt-raw-print-bridge.mjs',
  'escposTurkish.mjs',
  'win-raw-escpos.ps1',
  'win-raw-escpos-lib.ps1',
  'win-raw-escpos-worker.ps1',
  'install-windows-zywell-printer.ps1'
)
foreach ($f in $files) {
  $url = "$BaseUrl/install/windows/bridge/$f"
  $out = Join-Path $DestDir $f
  Write-Host "Indiriliyor: $f"
  Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
}

function Resolve-PosPrinterName {
  $list = @(Get-Printer -ErrorAction SilentlyContinue | ForEach-Object { $_.Name })
  if (-not $list.Count) {
    try {
      $list = @(Get-CimInstance Win32_Printer -ErrorAction Stop | ForEach-Object { $_.Name })
    } catch {
      $list = @()
    }
  }
  foreach ($prefer in @('POS-80C', 'POS-80', $StandardPrinter)) {
    if ($list -contains $prefer) { return $prefer }
  }
  $hit = $list | Where-Object { $_ -match 'POS-80C' } | Select-Object -First 1
  if ($hit) { return $hit }
  $hit = $list | Where-Object { $_ -match 'POS-80|Zywell|80mm|Greenleaf' } | Select-Object -First 1
  if ($hit) { return $hit }
  $zyScript = Join-Path $DestDir 'install-windows-zywell-printer.ps1'
  $created = & $zyScript -PrinterName $StandardPrinter
  if ($created) { return $created }
  return $StandardPrinter
}

$printer = Resolve-PosPrinterName
[System.Environment]::SetEnvironmentVariable('POS80_QUEUE_NAME', $printer, 'User')

$bridgeJs = Join-Path $DestDir 'receipt-raw-print-bridge.mjs'
$vbsPath = Join-Path $DestDir 'start-receipt-bridge-hidden.vbs'
$vbs = @"
Set sh = CreateObject("WScript.Shell")
Set env = sh.Environment("PROCESS")
env("POS80_QUEUE_NAME") = "$printer"
env("ESCPOS_CHARSET") = "ascii"
env("ESCPOS_FEED_LINES") = "6"
env("RECEIPT_RAW_PRINT_PORT") = "18765"
sh.CurrentDirectory = "$($DestDir.Replace('\', '\\'))"
sh.Run Chr(34) & "$($Node.Replace('\', '\\'))" & Chr(34) & " " & Chr(34) & "$($bridgeJs.Replace('\', '\\'))" & Chr(34), 0, False
"@
Set-Content -LiteralPath $vbsPath -Value $vbs -Encoding ASCII

function Stop-ReceiptBridgeOnPort {
  try {
    $conns = Get-NetTCPConnection -LocalPort 18765 -State Listen -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
      Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
    }
  } catch {}
}

Stop-ReceiptBridgeOnPort

$action = New-ScheduledTaskAction -Execute 'wscript.exe' -Argument "//B `"$vbsPath`"" -WorkingDirectory $DestDir
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew `
  -RestartCount 5 `
  -RestartInterval (New-TimeSpan -Minutes 2)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal `
  -Description 'Greenleaf POS fiş servisi — arka plan' -Force | Out-Null

Start-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
if (-not (Get-NetTCPConnection -LocalPort 18765 -State Listen -ErrorAction SilentlyContinue)) {
  wscript.exe //B "$vbsPath"
  Start-Sleep -Seconds 2
}

Write-Host "Tamam. Yazici: $printer"
Write-Host "Kontrol: http://127.0.0.1:18765/health"
