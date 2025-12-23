param (
  [string]$ConfigJson
)

$config = $ConfigJson | ConvertFrom-Json

Write-Output "Verificando aplicativos..."

if ($config.apps.chrome.enabled) {
  Write-Output "Instalando Chrome..."
  winget install --id Google.Chrome -e --silent
}

if ($config.apps.vlc.enabled) {
  Write-Output "Instalando VLC..."
  winget install --id VideoLAN.VLC -e --silent
}

Write-Output "Apps finalizados"
