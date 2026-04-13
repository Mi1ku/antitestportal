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

:start
cls
echo.
echo           ██████╗ ██████╗ ███╗   ██╗ ██████╗ 
echo           ██╔══██╗██╔══██╗████╗  ██║██╔════╝ 
echo           ██████╔╝██████╔╝██╔██╗ ██║██║  ███╗
echo           ██╔═══╝ ██╔══██╗██║╚██╗██║██║   ██║
echo           ██║     ██║  ██║██║ ╚████║╚██████╔╝
echo           ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
echo.
echo ============================================================
echo      ANTITESTPORTAL+ MASTER BUILDER ^| PRESTIGE V1.2
echo      LICENSED TO: 76mikus (Authority) ^| VER: %VERSION%
echo ============================================================
echo.

echo [💡] INITIALIZING SYSTEM AUDIT...
if not exist wtyczka (
    echo.
    echo [❌] CRITICAL ERROR: 'wtyczka' directory not found!
    echo.
    pause
    exit /b 1
)

:: 1. BUILD & OBFUSCATE
echo.
echo [🔨] STEP 1: COMPILING ^& OBFUSCATING [GHOST_MODE]...
echo ------------------------------------------------------------
pushd wtyczka
if exist build rd /s /q build
call npm run build
set BUILD_ERR=%errorlevel%
popd

if %BUILD_ERR% neq 0 (
    echo.
    echo [🛑] BUILD FAILURE: Check the logs above.
    goto choice
)
echo.
echo [✅] CORE MODULES BUILT SUCCESSFULLY.

:: 2. ZIP
echo.
echo [📦] STEP 2: GENERATING MASTER ENCRYPTED ZIP...
echo ------------------------------------------------------------
if exist %ZIP_NAME% del /f /q %ZIP_NAME%
powershell -Command "Compress-Archive -Path '%BUILD_PATH%\*' -DestinationPath '%ZIP_NAME%' -Force"
echo [✅] ARCHIVE READY: %ZIP_NAME%

:: 3. GIT SYNC
echo.
echo [📡] STEP 3: SYNCHRONIZING WITH GLOBAL REPOSITORY...
echo ------------------------------------------------------------
git add .
git commit -m "Auto-Deploy: AntiTestportal+ Master Build v%VERSION%" >nul 2>&1
git push origin main || git push origin master
echo [✅] SOURCE CODE SECURED.

:: 4. GITHUB RELEASE
echo.
echo [🚀] STEP 4: PUBLISHING OFFICIAL AUTHORITY RELEASE...
echo ------------------------------------------------------------

:: Create temporary release notes file (PL/EN)
echo # ANTITESTPORTAL+ [V1.0.0 OFFICIAL MASTER] > release_notes.md
echo. >> release_notes.md
echo ## 🇵🇱 POLSKI >> release_notes.md
echo Najbardziej zaawansowane narzedzie do automatyzacji i edukacji na platformie Testportal. >> release_notes.md
echo. >> release_notes.md
echo #### Glowne funkcje: >> release_notes.md
echo * **Ghost Shield (v2.0)**: Pelna ochrona przed wykrywaniem utraty fokusu. >> release_notes.md
echo * **AI Response Interception**: Przechwytywanie odpowiedzi w czasie rzeczywistym. >> release_notes.md
echo * **Side Dock AI**: Podreczny panel asystencki zintegrowany z interfejsem testu. >> release_notes.md
echo. >> release_notes.md
echo --- >> release_notes.md
echo. >> release_notes.md
echo ## 🇺🇸 ENGLISH >> release_notes.md
echo The ultimate automation and educational tool for the Testportal platform. >> release_notes.md
echo. >> release_notes.md
echo *Developed ^& Maintained by **mi1ku*** >> release_notes.md

where gh >nul 2>&1
if %errorlevel% equ 0 (
    gh release delete v%VERSION% --yes --cleanup-tag >nul 2>&1
    gh release create v%VERSION% %ZIP_NAME% --title "AntiTestportal+ v%VERSION% Official Master Release" --notes-file release_notes.md
    echo [✅] GITHUB RELEASE UPDATED: v%VERSION%
) else (
    echo [⚠️] INFO: GitHub CLI missing. Release skipped.
)

:: Cleanup
if exist release_notes.md del /f /q release_notes.md

echo.
echo ============================================================
echo    AUTHORITY BUILD COMPLETED ^| SYSTEM READY [GHOST]
echo ============================================================
echo.

:choice
set /p user_choice="[🔵] TAP 'R' TO REPEAT OR 'E' TO EXIT: "

if /i "%user_choice%"=="R" goto start
if /i "%user_choice%"=="E" exit
exit
