@echo off
setlocal enabledelayedexpansion

echo ===================================
echo Vue.js Project - Build and Deploy
echo ===================================

:: Build project
echo Starting build...
call npm run build

:: Check build result
if not exist ".\dist" (
  echo Build failed - dist directory not found!
  pause
  exit /b 1
)

echo Build completed successfully!
echo.

:: Deploy to server
echo Starting deployment to server...
echo.
echo Note: This will connect to root@47.115.230.75
echo Please ensure your SSH key is properly configured.
echo.
echo Copying dist directory to server...

:: Use SCP for deployment (will prompt for password if no SSH key)
scp -r ./dist/* root@47.115.230.75:/var/www/eazycar/

:: Check deployment result
if %ERRORLEVEL% EQU 0 (
  echo.
  echo ===================================
  echo        Deployment Successful!
  echo ===================================
  echo.
  echo Visit: http://47.115.230.75/eazycar
  echo.
) else (
  echo.
  echo ===================================
  echo        Deployment Error!
  echo ===================================
  echo.
  echo This server requires SSH key authentication.
  echo Please set up SSH keys using these steps:
  echo.
  echo 1. Generate SSH key: ssh-keygen -t rsa -b 4096
  echo 2. Copy public key to server: ssh-copy-id root@47.115.230.75
  echo 3. Test connection: ssh root@47.115.230.75
  echo.
)

pause