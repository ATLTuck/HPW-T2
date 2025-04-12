#!/bin/bash

# Function to check if a port is in use
port_in_use() {
  lsof -i :$1 >/dev/null 2>&1
}

# Check if required ports are available
if port_in_use 3000; then
  echo "Error: Port 3000 is already in use"
  exit 1
fi

if port_in_use 8080; then
  echo "Error: Port 8080 is already in use"
  exit 1
fi

# Start backend server
echo "Starting backend server..."
cd backend
go run main.go &
BACKEND_PID=$!

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to handle cleanup
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 