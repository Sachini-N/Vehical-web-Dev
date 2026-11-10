@echo off
title Start OBD-II Vehicle System (Conflict-free Ports)
color 0e
echo ================================================================
echo   🚗 STARTING OBD-II VEHICLE FAULT DETECTION SYSTEM
echo   - Backend:  http://localhost:7000
echo   - Frontend: http://localhost:5173
echo   (Ports 5000, 5001, 3000 are freed up for Event Hub)
echo ================================================================
echo.

start "OBD-II Backend (7000)" cmd /k "%~dp0run-backend.bat"
timeout /t 2 /nobreak >nul
start "OBD-II Frontend (5173)" cmd /k "%~dp0run-frontend.bat"

echo.
echo Both servers launched in separate windows!
echo Open your browser at: http://localhost:5173
echo.
pause
