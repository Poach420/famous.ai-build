#!/bin/bash

# Digital Ninja App Builder - Start Script

echo "Starting Digital Ninja App Builder..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Function to start backend
start_backend() {
    echo "Starting Backend..."
    cd backend
    source venv/bin/activate 2>/dev/null || {
        echo "Virtual environment not found. Please run ./setup.sh first"
        exit 1
    }
    python main.py &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started (PID: $BACKEND_PID)"
}

# Function to start frontend
start_frontend() {
    echo "Starting Frontend..."
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
}

# Trap Ctrl+C to stop both services
trap cleanup INT

cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Services stopped."
    exit 0
}

# Start services
start_backend
sleep 2
start_frontend

echo ""
echo "======================================="
echo "Services Running!"
echo "======================================="
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo "======================================="

# Wait for processes
wait
