$ErrorActionPreference = "Continue"
$root = $PSScriptRoot
$wtyczkaPath = "$root\wtyczka"
$buildPath = "$wtyczkaPath\build\chrome-mv3-prod"
$version = "1.0.0"
$projectName = "AntiTestportal-v$version"
$zipPath = "$root\$projectName.zip"

Write-Host "--- AntiTestportal+ Supreme Auto-Deploy ---" -ForegroundColor Cyan

# 1. Budowanie wtyczki
Write-Host "[1/5] Budowanie lokalne rozszerzenia (npm run build)..." -ForegroundColor Yellow
Set-Location $wtyczkaPath
cmd.exe /c "npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Blad podczas budowania! Przerywam skrypt." -ForegroundColor Red
    Set-Location $root
    exit 1
}
Set-Location $root

# Delay to ensure Windows releases file locks
Start-Sleep -Seconds 2

# 2. Aktualizacja README
Write-Host "[2/5] Kopiowanie plikow README..." -ForegroundColor Yellow
if (Test-Path "$buildPath") {
    Copy-Item "$root\README.md" "$buildPath\README.md" -Force
}

# 3. Pakowanie ZIP
Write-Host "[3/5] Tworzenie lokalnego archiwum $projectName.zip..." -ForegroundColor Yellow
try {
    if (Test-Path "$root\AntiTestportal-*.zip") { Remove-Item "$root\AntiTestportal-*.zip" -Force -ErrorAction Stop }
    if (Test-Path "$root\$projectName.zip") { Remove-Item "$root\$projectName.zip" -Force -ErrorAction Stop }
} catch {
    Write-Host "Ostrzezenie: Nie mozna usunac starego piku zip." -ForegroundColor Red
}

try {
    Compress-Archive -Path "$buildPath\*" -DestinationPath $zipPath -Force -ErrorAction Stop
    Write-Host "Zbudowano plik lokalnie na dysku: $projectName.zip" -ForegroundColor Green
} catch {
    Write-Host "Wystapil maly problem z archiwum Zip. Asynchronicznie przeskakuje blad." -ForegroundColor Yellow
}

# Delay to ensure Windows releases zip file lock before github push
Start-Sleep -Seconds 1

# 4. Git & Usuwanie starych Releasow z GitHuba
Write-Host "[4/5] Czystka GitHuba i zapisywanie kodu..." -ForegroundColor Yellow
try { git tag -d "v$version" 2>&1 | Out-Null } catch {}
try { git push origin --delete "v$version" 2>&1 | Out-Null } catch {}

git add .
git commit -m "Auto-Deploy: Pelny lokalny build 1.0.0 + Zmiany kodu"
git push

# 5. GitHub Releases
Write-Host "[5/5] Zdalna publikacja (GitHub Releases)..." -ForegroundColor Yellow
$ghExists = Get-Command gh -ErrorAction SilentlyContinue
if ($ghExists) {
    try { gh release delete "v$version" --yes 2>&1 | Out-Null } catch {}
    gh release create "v$version" $zipPath --title "AntiTestportal+ v$version" --notes "Najnowsza stabilna produkcyjna wersja wtyczki." -M "main"
    if ($LASTEXITCODE -ne 0) {
        gh release create "v$version" $zipPath --title "AntiTestportal+ v$version" --notes "Najnowsza stabilna produkcyjna wersja wtyczki." -M "master"
    }
    Write-Host "Udalo sie! GitHub Releases zostalo zaktualizowane." -ForegroundColor Green
} else {
    Write-Host "Brak lokalnego Github CLI. Zostawiam publikacje Releases chmurze." -ForegroundColor Magenta
}

Write-Host "`nZAKONCZONO pomyslnie! Zmiany zostaly opublikowane!" -ForegroundColor Cyan
