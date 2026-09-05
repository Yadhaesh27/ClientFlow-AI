@echo off
title ClientFlow AI Full-Stack Launcher
color 0B
cls

echo ========================================================
echo         CLIENTFLOW AI FULL-STACK LAUNCHER
echo ========================================================
echo.

echo [1/3] Starting Python FastAPI Backend on http://localhost:8000 ...
start "ClientFlow Backend" cmd /k "cd /d "%~dp0backend" && python app/seed.py && uvicorn app.main:app --reload --port 8000"

echo.
echo [2/3] Preparing Frontend Application...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    call npm install
)

echo.
echo [3/3] Launching ClientFlow AI App at http://localhost:5173 ...
timeout /t 3 /nobreak >nul
start "" http://localhost:5173

call npm run dev
pause
