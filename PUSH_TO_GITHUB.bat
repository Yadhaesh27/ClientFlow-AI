@echo off
title Push ClientFlow AI to GitHub
color 0B
cls

echo ========================================================
echo           PUSH CLIENTFLOW AI TO GITHUB
echo ========================================================
echo.
echo Target Repository: https://github.com/Yadhaesh27/ClientFlow-AI.git
echo.

cd /d "%~dp0"

echo Running git push...
git push -u origin main

echo.
echo ========================================================
echo Process finished! View your GitHub repository at:
echo https://github.com/Yadhaesh27/ClientFlow-AI
echo ========================================================
echo.
pause
