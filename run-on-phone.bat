@echo off
title OBD-II Mobile Server (Run on Phone)
color 0b
echo ================================================================
echo   🚗 STARTING OBD-II VEHICLE FAULT DETECTION MOBILE SERVER
echo ================================================================
echo.

set NODE_PATH="C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VisualStudio\NodeJs\node.exe"

if exist %NODE_PATH% (
    %NODE_PATH% server-phone.js
) else (
    node server-phone.js
)

pause

