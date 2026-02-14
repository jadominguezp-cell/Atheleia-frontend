@echo off
cd /d "%~dp0"
echo Iniciando servidor de desarrollo...
call npm run dev
pause
