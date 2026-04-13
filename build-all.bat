@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ============================================================
:: ANTITESTPORTAL+ MASTER BUILDER | PRESTIGE V1.2.1
:: ============================================================

set VERSION=1.0.0
set ZIP_NAME=AntiTestportal-Plus-v%VERSION%.zip
set BUILD_PATH=wtyczka\build\chrome-mv3-prod

:start
cls
echo.
echo    [--- ANTITESTPORTAL+ MASTER BUILDER ---]
echo    [--- AUTHORITY RELEASE: %VERSION% ---]
echo.
echo ============================================================
echo      LICENSED TO: 76mikus (Authority)
echo ============================================================
echo.

echo [!] INITIALIZING SYSTEM AUDIT...
if not exist wtyczka (
    echo [X] ERROR: 'wtyczka' directory not found!
    pause
    goto choice
)

:: 1. BUILD
echo.
echo [*] STEP 1: COMPILING [GHOST_MODE]...
pushd wtyczka
if exist build rd /s /q build
call npm run build
set BUILD_ERR=%errorlevel%
popd

if %BUILD_ERR% neq 0 (
    echo [!] BUILD FAILURE.
    goto choice
)

:: 2. ZIP
echo.
echo [*] STEP 2: GENERATING ZIP ARCHIVE...
if exist %ZIP_NAME% del /f /q %ZIP_NAME%
powershell -Command "Compress-Archive -Path '%BUILD_PATH%\*' -DestinationPath '%ZIP_NAME%' -Force"
echo [OK] ZIP Created: %ZIP_NAME%

:: 3. GIT
echo.
echo [*] STEP 3: SYNCING REPOSITORY...
git add .
git commit -m "Auto-Deploy: v%VERSION%" >nul 2>&1
git push origin main || git push origin master
echo [OK] Git synced.

:: 4. GH
echo.
echo [*] STEP 4: PUBLISHING RELEASE...
where gh >nul 2>&1
if %errorlevel% equ 0 (
    gh release delete v%VERSION% --yes --cleanup-tag >nul 2>&1
    gh release create v%VERSION% %ZIP_NAME% --title "AntiTestportal+ v%VERSION%" --notes "Official Master Release by 76mikus"
    echo [OK] Release live.
)

echo.
echo ============================================================
echo    BUILD COMPLETED | SYSTEM SECURED
echo ============================================================
echo.

:choice
set /p user_choice="TAP 'R' TO REPEAT OR 'E' TO EXIT: "
if /i "%user_choice%"=="R" goto start
if /i "%user_choice%"=="E" exit
exit
