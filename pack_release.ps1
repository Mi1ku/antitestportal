$ErrorActionPreference = "Stop"
Write-Host "Starting release process..."

$root = Get-Location
$buildPath = "$root\wtyczka\build\chrome-mv3-prod"
$zipPath = "$root\AntiTestportal-Ultra-v1.0.5-Supreme.zip"

if (-not (Test-Path $buildPath)) {
    Write-Host "ERROR: Build folder not found!"
    exit 1
}

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Removed old zip file."
}

# Copy README to build folder
Copy-Item "$root\README.md" "$buildPath\README.md" -Force
Write-Host "Copied README.md into build folder."

# Zip it
Write-Host "Compressing..."
Compress-Archive -Path "$buildPath\*" -DestinationPath $zipPath -Force

if (Test-Path $zipPath) {
    Write-Host "SUCCESS! Zip created at: $zipPath"
}
else {
    Write-Host "ERROR: Zip file was not created."
    exit 1
}
