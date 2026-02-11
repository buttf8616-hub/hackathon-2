# Quickstart: Phase III AI-Powered Todo Chatbot

**Date**: 2026-02-09
**Feature**: 3-phase3-ai-chatbot

## Prerequisites

- Phase II backend and frontend running (see Phase II quickstart)
- Python 3.11+ with virtual environment
- Node.js 18+
- Google Gemini API key (free tier available at https://ai.google.dev/)

## 1. Environment Setup

### Backend Dependencies

```bash
cd backend
source venv/bin/activate  # Activate existing Phase II venv
pip install openai-agents httpx
```

### Environment Variables

Add to `backend/.env`:

```env
# Existing Phase II variables
DATABASE_URL=postgresql+asyncpg://...
CORS_ORIGINS=http://localhost:3000

# New Phase III variables
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash
```

## 2. Running the Application

### Start Backend (includes Agent + Chat endpoints)

```bash
cd backend
source venv/bin/activate
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Access

- **Todo Web App**: http://localhost:3000
- **Chat Panel**: Visible in the Todo Web App (toggle "AI Chat" button)
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 3. Using the Chatbot

### Example Interactions

| User Says | What Happens |
|-----------|-------------|
| "Add a task to buy groceries" | Creates task with title "Buy groceries" |
| "Show me all my tasks" | Lists all tasks with details |
| "Mark the groceries task as done" | Toggles task completion |
| "Show only high priority tasks" | Filters and displays high priority tasks |
| "Change groceries to low priority" | Updates task priority |
| "Delete the groceries task" | Asks for confirmation, then deletes |
| "Sort my tasks by due date" | Displays tasks sorted by due date |

### Tips

- The chatbot understands natural language — no exact commands needed
- If the chatbot is unsure, it will ask clarifying questions
- Destructive actions (delete) always ask for confirmation
- Changes made via chatbot are visible in the task list UI (polls every 3s while chat is open)
- Chat history is session-based — refreshing the page clears it

## 4. Architecture Overview

```
Browser
├── Next.js App (port 3000)
│   ├── Task List UI (Phase II — unchanged)
│   └── Chat Panel (Phase III — custom React component)
│       └── fetch → /api/chat/sync
│
└── FastAPI Backend (port 8000)
    ├── REST API /api/tasks/* (Phase II — unchanged)
    ├── POST /api/chat (SSE streaming)
    ├── POST /api/chat/sync (JSON response)
    │   └── OpenAI Agents SDK (Agent + Runner)
    │       └── Google Gemini (via OpenAI-compatible endpoint)
    │           └── function_tools → REST API calls
    └── Database (Neon PostgreSQL)
```

## 5. Troubleshooting

| Problem | Solution |
|---------|----------|
| "GEMINI_API_KEY not set" | Add `GEMINI_API_KEY=...` to `backend/.env` |
| Chat not connecting | Verify backend is running on port 8000 |
| Agent not responding | Check Gemini API key is valid and has quota |
| Rate limit error (429) | Free tier quota exceeded — wait or upgrade |
| Tasks not updating in UI | Verify CORS_ORIGINS includes frontend URL |
| First chat request slow | Normal — agent loads lazily on first request (~5-10s) |
