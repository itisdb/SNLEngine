#!/bin/bash

# Function to clean up background processes
cleanup() {
    echo "Stopping processes..."
    kill $(jobs -p)
    exit 0
}

trap cleanup SIGINT SIGTERM
# --- Backend Setup ---
echo "Starting backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI server..."
uvicorn main:app --host 0.0.0.0 --reload &

cd ..

# --- Frontend Setup ---
echo "Starting frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo "Starting Next.js development server..."
npm run dev

# Wait for all background processes to finish
wait
