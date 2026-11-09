@echo off
title OBD-II Backend API Server
color 0a
echo ================================================================
echo   🚗 STARTING OBD-II VEHICLE FAULT DETECTION BACKEND API
echo ================================================================
echo.

set NODE_PATH="C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VisualStudio\NodeJs\node.exe"

cd /d "%~dp0backend"
if exist %NODE_PATH% (
    %NODE_PATH% server.js
) else (
    node server.js
)

pause

