#!/bin/bash

# Start FastAPI backend on port 8000 in the background
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Serve built React frontend from /frontend/build using serve (on port 3000)
npx serve -s frontend/build -l 3000

# Kill the backend process after frontend server stops
kill $BACKEND_PID