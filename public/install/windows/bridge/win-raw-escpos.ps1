# Tek seferlik yedek yol (worker kapalıysa)
param(
  [Parameter(Mandatory = $true)][string]$PrinterName,
  [Parameter(Mandatory = $true)][string]$FilePath
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'win-raw-escpos-lib.ps1')
Send-PosRawEscPosFile -PrinterName $PrinterName -FilePath $FilePath
Write-Output 'OK'
