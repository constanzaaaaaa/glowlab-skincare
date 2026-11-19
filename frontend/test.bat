@echo off
chcp 65001 >nul
title GlowLab - Pruebas Jasmine Karma
cd /d "%~dp0"
call npm test
if errorlevel 1 (
  echo PRUEBAS CON ERROR. Revisa los mensajes anteriores.
) else (
  echo PRUEBAS FINALIZADAS SIN ERRORES.
)
pause
