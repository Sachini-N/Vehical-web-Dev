@echo off
title OBD-II Frontend (Port 5173)
color 0b
echo ================================================================
echo   🚗 STARTING OBD-II VEHICLE FAULT DETECTION FRONTEND
echo   URL:  http://localhost:5173
echo   Port: 5173 (Conflict-free from Event Hub)
echo ================================================================
echo.

cd /d "%~dp0frontend"
npx vite --port 5173

pause
