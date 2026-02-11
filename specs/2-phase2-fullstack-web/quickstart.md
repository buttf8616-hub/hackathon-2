# Quickstart: Phase II Full-Stack Todo Web Application

**Feature**: 2-phase2-fullstack-web
**Created**: 2026-02-08

## Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- Neon PostgreSQL account (or local PostgreSQL)
- Git

## Project Structure

```
hackathon-2/
├── backend/
│   ├── src/
│   │   ├── main.py           # FastAPI application
│   │   ├── database.py       # Database connection
│   │   ├── models/
│   │   │   └── task.py       # SQLModel entities
│   │   ├── schemas/
│   │   │   └── task.py       # Pydantic schemas
│   │   └── api/
│   │       └── tasks.py      # API routes
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React components
│   │   ├── lib/              # API client, utilities
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── .env.local.example
└── specs/
```

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql+asyncpg://user:password@host/database?sslmode=require
CORS_ORIGINS=http://localhost:3000
```

### 4. Run Database Migrations

```bash
python3 -m src.database --migrate
```

### 5. Start Backend Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend available at: http://localhost:8000
API docs at: http://localhost:8000/docs

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend available at: http://localhost:3000

## Quick Test

### Backend Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

### Create a Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "priority": "high"}'
```

### List Tasks

```bash
curl http://localhost:8000/api/tasks
```

## Development Workflow

1. Start backend: `cd backend && uvicorn src.main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. API documentation: http://localhost:8000/docs

## Environment Variables

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `CORS_ORIGINS` | Yes | Comma-separated frontend origins |

### Frontend (.env.local)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |

## Common Issues

### Database Connection Failed

- Verify DATABASE_URL is correct
- Ensure SSL mode is enabled for Neon
- Check network connectivity

### CORS Errors

- Add frontend URL to CORS_ORIGINS in backend .env
- Restart backend after changing environment

### Frontend API Errors

- Verify backend is running on correct port
- Check NEXT_PUBLIC_API_URL matches backend URL
