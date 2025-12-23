param (
  [string]$ConfigJson
)

$config = $ConfigJson | ConvertFrom-Json

Write-Output "Aplicando configurações do sistema..."

if ($config.sistema.energia.enabled) {
  Write-Output "Configurando plano de energia..."
  powercfg -setactive SCHEME_MIN
}

if ($config.sistema.windowsUpdate.enabled -eq $false) {
  Write-Output "Desativando Windows Update..."
  sc stop wuauserv
}

Write-Output "Sistema configurado"
