@echo off
pause
setlocal enabledelayedexpansion

echo [START] ANTITESTPORTAL+ MASTER BUILDER
echo [INFO] Srodowisko: Node ^& Git ^& GH CLI

set VERSION=1.0.0
set ZIP_NAME=AntiTestportal-Plus-v%VERSION%.zip
set BUILD_PATH=wtyczka\build\chrome-mv3-prod

:start
cls
echo ===================================
echo   ANTITESTPORTAL+ MASTER BUILDER
echo ===================================
echo.

if not exist wtyczka (
    echo [ERROR] folder wtyczka nie istnieje!
    pause
    goto choice
)

echo [*] Budowanie wtyczki...
pushd wtyczka
if exist build rd /s /q build
call npm run build
set BUILD_ERR=%errorlevel%
popd

if %BUILD_ERR% neq 0 (
    echo [ERROR] Budowanie przerwane.
    goto choice
)

echo [*] Pakowanie...
if exist %ZIP_NAME% del /f /q %ZIP_NAME%
powershell -Command "Compress-Archive -Path '%BUILD_PATH%\*' -DestinationPath '%ZIP_NAME%' -Force"
echo [OK] ZIP gotowy: %ZIP_NAME%

echo [*] Synchronizacja Git...
git add .
git commit -m "Auto-Deploy: v%VERSION%" >nul 2>&1
git push origin main || git push origin master
echo [OK] Git synced.

echo [*] Tworzenie Release na GitHub (Nuclear Overwrite)...
where gh >nul 2>&1
if %errorlevel% equ 0 (
    echo [!] Usuwanie starego release v%VERSION%...
    call gh release delete v%VERSION% --yes --cleanup-tag >nul 2>&1
    :: Pauza na odswiezenie API GitHuba
    timeout /t 3 /nobreak >nul
    
    echo [!] Tworzenie nowej wersji...
    call gh release create v%VERSION% %ZIP_NAME% --title "AntiTestportal+ v%VERSION% Official" --notes "Master Release by 76mikus Authority"
    if %errorlevel% neq 0 (
        echo [!] Release juz istnieje, aktualizacja pliku ZIP...
        call gh release upload v%VERSION% %ZIP_NAME% --clobber
    )
    echo [OK] GitHub Release zaktualizowany.
) else (
    echo [SKIPPED] Brak GitHub CLI.
)

echo.
echo Budowanie zakonczone pomyślnie.
echo.

:choice
set /p user_choice="TAP 'R' TO REPEAT OR 'E' TO EXIT: "
if /i "%user_choice%"=="R" goto start
if /i "%user_choice%"=="E" exit
exit
