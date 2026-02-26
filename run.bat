@echo off
echo ========================================================
echo GitHub Repo Analyzer - Unified Startup Script
echo ========================================================

echo.
echo [1/3] Building the React Frontend...
echo.
cd frontend
call npm install
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to build the frontend. Please check the logs above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Installing Backend Dependencies...
echo.
cd ..
call pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to install backend dependencies. Please check the logs above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Starting the Unified Backend/Frontend Server...
echo.
echo ========================================================
echo The application will be available at: http://127.0.0.1:8000
echo ========================================================
echo.

python -m uvicorn main:app --port 8000 --reload
