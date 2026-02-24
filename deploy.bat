@echo off
echo ===================================================
echo   AntiTestportal+ 💎 Auto-Deploy 
echo ===================================================
echo.
echo Dodawanie zmian do Git...
git add .
echo.
echo Tworzenie commita...
git commit -m "Mega Update: Side Dock v1.0.0, poprawka auto-releasow, czyste README, tag mi1ku"
echo.
echo Wysylanie na serwery GitHub...
git push
echo.
echo ===================================================
echo GOTOWE! 
echo Za chwilę GitHub Actions automatycznie zbuduje
echo i wyda nową paczkę w zakładce Releases.
echo ===================================================
pause
