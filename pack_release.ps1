$ErrorActionPreference = "Stop"
$projectName = "AntiTestportal-Plus-v1.5.0"
$root = $PSScriptRoot
$wtyczkaPath = "$root\wtyczka"
$buildPath = "$wtyczkaPath\build\chrome-mv3-prod"
$zipPath = "$root\$projectName.zip"

Write-Host "--- 💎 mi1ku RELEASE PACKAGER v2.0 💎 ---" -ForegroundColor Cyan

# 1. Cleaning old artifacts
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "[1/4] Removed old release zip." -ForegroundColor Yellow
}
else {
    Write-Host "[1/4] No old release zip found. Skipping cleanup."
}

# 2. Checking for build
if (-not (Test-Path $buildPath)) {
    Write-Host "[2/4] Build folder NOT found. Attempting to build project..." -ForegroundColor Magenta
    Set-Location $wtyczkaPath
    if (Test-Path "node_modules") {
        npm run build
    }
    else {
        Write-Host "ERROR: node_modules missing. Please run 'npm install' in 'wtyczka' folder." -ForegroundColor Red
        exit 1
    }
    Set-Location $root
}
else {
    Write-Host "[2/4] Found existing build folder. Ready to pack." -ForegroundColor Green
}

# 3. Synchronizing assets
Copy-Item "$root\README.md" "$buildPath\README.md" -Force
Write-Host "[3/4] Synced README.md to build folder."

# 4. Packaging
Write-Host "[4/4] Packing into $projectName.zip..." -ForegroundColor Cyan
if (Test-Path $zipPath) { Remove-Item $zipPath }
Compress-Archive -Path "$buildPath\*" -DestinationPath $zipPath -Force

if (Test-Path $zipPath) {
    Write-Host "`n✅ SUCCESS! Release ready at: $zipPath" -ForegroundColor Green
    $size = (Get-Item $zipPath).Length / 1KB
    Write-Host "Final Size: $([math]::Round($size, 2)) KB"
}
else {
    Write-Host "`n❌ FAILED to create zip file." -ForegroundColor Red
    exit 1
}

Write-Host "`nRelease completed. Upload this file to GitHub Releases." -ForegroundColor Gray
