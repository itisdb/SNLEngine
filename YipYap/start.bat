@echo off

REM --- Backend Setup ---
echo Starting backend...
cd backend

IF NOT EXIST venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo Starting FastAPI server...
start "Backend" uvicorn main:app --reload

cd ..

REM --- Frontend Setup ---
echo Starting frontend...
cd frontend

IF NOT EXIST node_modules (
    echo Installing npm dependencies...
    npm install
)

echo Starting Next.js development server...
npm run dev

pause