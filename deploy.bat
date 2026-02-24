@echo off
setlocal
echo ===================================================
echo   AntiTestportal+ SUPREME DEPLOY v2.0
echo ===================================================
echo.
set "NODE_OPTIONS=--no-deprecation"
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0pack_release.ps1"
pause
