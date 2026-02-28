@echo off
echo ========================================
echo   Hand Tracking Spatial UI
echo   Demarrage du serveur...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Verification Python...
python --version > nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installe ou pas dans PATH
    echo Telechargez Python sur: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo OK - Python detecte
echo.

echo [2/2] Demarrage serveur HTTP sur port 8000...
echo.
echo ========================================
echo   Serveur demarre !
echo ========================================
echo.
echo   Mode unique - AR Camera + Ecran Virtuel:
echo   http://localhost:8000/index.html
echo.
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

python -m http.server 8000
