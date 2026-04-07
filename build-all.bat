@echo off
setlocal enabledelayedexpansion

:: ==========================================
:: ANTITESTPORTAL+ MASTER BUILDER (V1.1)
:: AUTHOR: mi1ku (76mikus)
:: ==========================================

set VERSION=1.0.0
set ZIP_NAME=AntiTestportal-Plus-v%VERSION%.zip
set BUILD_PATH=wtyczka\build\chrome-mv3-prod

:: OPTIMIZATIONS
set CI=true
set "NODE_OPTIONS=--max-old-space-size=4096 --no-deprecation"

cls
echo ==============================================
echo      ANTITESTPORTAL+ MASTER BUILDER V1.1
echo      OFFICIAL MASTER RELEASE v%VERSION%
echo ==============================================
echo.

echo [CHECK] Weryfikacja folderu wtyczki...
if not exist wtyczka (
    echo [ERROR] Nie znaleziono folderu 'wtyczka'!
    pause
    exit /b 1
)

:: 1. BUILD & OBFUSCATE
echo [STEP 1] Budowanie i Obfuskacja (SUPREME FORTIFIED)...
pushd wtyczka
if exist build rd /s /q build
call npm run build
set BUILD_ERR=%errorlevel%
popd

if %BUILD_ERR% neq 0 (
    echo.
    echo [CRITICAL ERROR] Budowanie padlo!
    pause
    exit /b 1
)

:: 2. ZIP
echo [STEP 2] Pakowanie do archiwum ZIP...
if exist %ZIP_NAME% del /f /q %ZIP_NAME%
powershell -Command "Compress-Archive -Path '%BUILD_PATH%\*' -DestinationPath '%ZIP_NAME%' -Force"

:: 3. GIT SYNC
echo [STEP 3] Synchronizacja kodu z GitHub...
git add .
git commit -m "Auto-Deploy: AntiTestportal+ Master Build v%VERSION%" >nul 2>&1
git push origin main || git push origin master

:: 4. GITHUB RELEASE
echo [STEP 4] Tworzenie profesjonalnego Release na GitHub...

:: Create temporary release notes file (PL/EN)
echo # ANTITESTPORTAL+ [V1.0.0 OFFICIAL MASTER] > release_notes.md
echo. >> release_notes.md
echo ## 🇵🇱 POLSKI >> release_notes.md
echo Najbardziej zaawansowane narzedzie do automatyzacji i edukacji na platformie Testportal. Wersja Master v1.0.0 wprowadza pelna dyskrecje i wsparcie dla najnowszych zabezpieczen. >> release_notes.md
echo. >> release_notes.md
echo #### Glowne funkcje: >> release_notes.md
echo * **Ghost Shield (v2.0)**: Pelna ochrona przed wykrywaniem utraty fokusu (focus loss detection). >> release_notes.md
echo * **AI Response Interception**: Przechwytywanie i analiza odpowiedzi w czasie rzeczywistym. >> release_notes.md
echo * **Side Dock AI**: Podreczny panel asystencki zintegrowany z interfejsem testu. >> release_notes.md
echo * **Time Freeze**: Stabilizacja czasu i omijanie skryptow anty-kopiujacych. >> release_notes.md
echo. >> release_notes.md
echo --- >> release_notes.md
echo. >> release_notes.md
echo ## 🇺🇸 ENGLISH >> release_notes.md
echo The ultimate automation and educational tool for the Testportal platform. Master Version v1.0.0 features complete stealth and anti-tamper capabilities. >> release_notes.md
echo. >> release_notes.md
echo #### Key Features: >> release_notes.md
echo * **Ghost Shield**: Advanced protection against focus loss and tab-out detection. >> release_notes.md
echo * **AI Interception**: Real-time signal routing and answer analysis. >> release_notes.md
echo * **Stealth Mode**: Undetectable presence in the browser environment. >> release_notes.md
echo. >> release_notes.md
echo *Developed ^& Maintained by **mi1ku*** >> release_notes.md

where gh >nul 2>&1
if %errorlevel% equ 0 (
    gh release delete v%VERSION% --yes --cleanup-tag >nul 2>&1
    gh release create v%VERSION% %ZIP_NAME% --title "AntiTestportal+ v%VERSION% Official Master Release" --notes-file release_notes.md
    echo [SUCCESS] GitHub Release AT+ zostal w pelni zaktualizowany!
) else (
    echo.
    echo [INFO] Brak GitHub CLI. ZIP gotowy lokalnie jako: %ZIP_NAME%
)

:: Cleanup
if exist release_notes.md del /f /q release_notes.md

echo.
echo ==============================================
echo    BUDOWANIE ZAKONCZONE POMYSLNIE! (v%VERSION%)
echo ==============================================
echo.
pause
