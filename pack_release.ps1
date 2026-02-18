# mi1ku Systems - Release Packager
# Ten skrypt pakuje gotową wtyczkę do pliku .zip gotowego do wrzucenia na GitHub Releases.

$ProjectRoot = Get-Location
$BuildDir = "$ProjectRoot\wtyczka\build\chrome-mv3-prod"
$ZipName = "AntiTestportal-Ultra-v1.0.4-Supreme.zip"
$OutputPath = "$ProjectRoot\$ZipName"

Write-Host "🦍 Przygotowywanie paczki Release dla Mi1ku..." -ForegroundColor Magenta

if (Test-Path $BuildDir) {
    if (Test-Path $OutputPath) { Remove-Item $OutputPath }
    
    # Kopiujemy README i inne ważne pliki do katalogu build przed spakowaniem (opcjonalnie)
    Copy-Item "$ProjectRoot\README.md" "$BuildDir\README.md" -Force
    
    Write-Host "📦 Pakowanie folderu: $BuildDir" -ForegroundColor Cyan
    Compress-Archive -Path "$BuildDir\*" -DestinationPath $OutputPath
    
    Write-Host "✅ Gotowe! Twoja wtyczka czeka tutaj: $OutputPath" -ForegroundColor Green
    Write-Host "🚀 Teraz możesz wrzucić ten plik na GitHub w sekcji 'Releases'." -ForegroundColor Yellow
} else {
    Write-Host "❌ BŁĄD: Nie znaleziono folderu build! Uruchom najpier 'npm run build' w folderze wtyczka." -ForegroundColor Red
}
