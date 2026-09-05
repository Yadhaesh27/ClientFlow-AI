@echo off
title ClientFlow AI Workspace Launcher
color 0A
cls

echo ========================================================
echo             CLIENTFLOW AI WORKSPACE LAUNCHER
echo ========================================================
echo.

:: Navigate to frontend folder
cd /d "%~dp0frontend"

:: Check if node_modules exists, install if missing
if not exist "node_modules" (
    echo [1/2] Installing required dependencies...
    call npm install
    echo.
) else (
    echo [1/2] Dependencies verified!
)

echo [2/2] Launching ClientFlow AI application...
echo.
echo ========================================================
echo Opening ClientFlow AI at: http://localhost:5173
echo Keep this terminal window open while using the app!
echo ========================================================
echo.

:: Delay 2 seconds then open browser automatically
timeout /t 2 /nobreak >nul
start "" http://localhost:5173

:: Run Vite Dev Server
call npm run dev

pause
