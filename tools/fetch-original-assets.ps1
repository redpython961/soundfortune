# Downloads the original Sound Fortune Productions images into this project.
# Run from the project root (PowerShell):  powershell -ExecutionPolicy Bypass -File tools\fetch-original-assets.ps1
$ErrorActionPreference = "Stop"
$Base = "https://www.soundfortuneproductions.com"
$Root = Split-Path -Parent $PSScriptRoot
Get-Content (Join-Path $PSScriptRoot "asset-manifest.txt") | Where-Object { $_ -and -not $_.StartsWith("#") } | ForEach-Object {
  $parts = $_ -split '\s+' | Where-Object { $_ }
  $src = $parts[0]; $dst = Join-Path $Root $parts[1]
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dst) | Out-Null
  Write-Host "Downloading $($parts[1])"
  Invoke-WebRequest -Uri "$Base/$src" -OutFile $dst -UseBasicParsing
}
Write-Host "Done. All original images are now in .\assets"
