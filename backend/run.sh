#!/bin/bash
# Copy .env.example to .env and fill in real values before running
export CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:3000}"
export DATABASE_URL="${DATABASE_URL:?DATABASE_URL is required}"
export GEMINI_API_KEY="${GEMINI_API_KEY:?GEMINI_API_KEY is required}"
export GEMINI_MODEL="${GEMINI_MODEL:-gemini-2.5-flash}"
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000
