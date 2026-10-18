@echo off
chcp 65001 >nul
title GlowLab - Frontend React
cd /d "%~dp0"
call npm run dev
pause
