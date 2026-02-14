@echo off
title Aletheia - Instalar y ejecutar
cd /d "%~dp0"

set NPM_CMD=
if exist "C:\Program Files\nodejs\npm.cmd" set NPM_CMD=C:\Program Files\nodejs\npm.cmd
if exist "C:\Program Files (x86)\nodejs\npm.cmd" set NPM_CMD=C:\Program Files (x86)\nodejs\npm.cmd
if exist "%LOCALAPPDATA%\Programs\node\npm.cmd" set NPM_CMD=%LOCALAPPDATA%\Programs\node\npm.cmd
if exist "%APPDATA%\npm\npm.cmd" set NPM_CMD=%APPDATA%\npm\npm.cmd

if "%NPM_CMD%"=="" (
  echo.
  echo  npm no esta instalado o no esta en el PATH.
  echo.
  echo  Pasos:
  echo  1. Descarga Node.js (incluye npm) desde: https://nodejs.org/
  echo  2. Instala y marca "Add to PATH" si aparece la opcion.
  echo  3. Cierra esta ventana, abre una nueva y vuelve a ejecutar este script.
  echo.
  pause
  exit /b 1
)

echo Instalando dependencias...
call "%NPM_CMD%" install
if errorlevel 1 (
  echo Error al instalar. Revisa que Node este bien instalado.
  pause
  exit /b 1
)

echo.
echo Iniciando servidor de desarrollo...
echo Abre el navegador en: http://localhost:5173/
echo.
call "%NPM_CMD%" run dev
pause
