# Research: Phase II Full-Stack Todo Web Application

**Date**: 2026-02-08
**Feature**: 2-phase2-fullstack-web
**Status**: Complete

## Executive Summary

Phase II transforms the Phase I console application into a full-stack web application with FastAPI backend, Next.js frontend, and Neon PostgreSQL database. All technology choices are defined in the constitution.

## Research Topics

### 1. Backend Framework: FastAPI

**Decision**: FastAPI with Python 3.11+

**Rationale**:
- Specified in constitution for Phase II
- High performance async support
- Automatic OpenAPI documentation
- Pydantic integration for validation
- SQLModel compatibility (same author)

**Alternatives Considered**:
- Flask: Less modern, no async
- Django REST: Heavier, more opinionated

### 2. ORM: SQLModel

**Decision**: SQLModel for database interactions

**Rationale**:
- Specified in constitution
- Combines SQLAlchemy and Pydantic
- Type hints and validation built-in
- Clean async session management
- Direct compatibility with FastAPI

**Alternatives Considered**:
- SQLAlchemy alone: More boilerplate
- Tortoise ORM: Less mature ecosystem

### 3. Database: Neon PostgreSQL

**Decision**: Neon serverless PostgreSQL

**Rationale**:
- Specified in constitution
- Serverless scaling
- PostgreSQL compatibility
- Free tier available for development
- Connection pooling included

**Configuration**:
- Connection via DATABASE_URL environment variable
- SSL required for production
- Async driver: asyncpg

### 4. Frontend Framework: Next.js

**Decision**: Next.js 14+ with App Router

**Rationale**:
- Specified in constitution
- Server components for performance
- Built-in API routes (optional)
- TypeScript support
- Tailwind CSS integration

**Alternatives Considered**:
- React SPA: No SSR benefits
- Remix: Less ecosystem maturity

### 5. API Design Pattern

**Decision**: RESTful API with OpenAPI specification

**Rationale**:
- Standard pattern for CRUD operations
- Auto-generated docs via FastAPI
- Easy frontend integration
- Clear resource-based endpoints

**Endpoints**:
- `GET /api/tasks` - List tasks (with query params)
- `GET /api/tasks/{id}` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/toggle` - Toggle completion

### 6. Project Structure

**Decision**: Monorepo with backend/ and frontend/ directories

**Rationale**:
- Clear separation of concerns
- Independent deployment possible
- Shared types via OpenAPI
- Single repository for simplicity

**Structure**:
```
backend/
├── src/
│   ├── main.py           # FastAPI app
│   ├── models/           # SQLModel entities
│   ├── api/              # Route handlers
│   ├── schemas/          # Pydantic schemas
│   └── database.py       # DB connection
└── requirements.txt

frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # API client, utilities
│   └── types/            # TypeScript types
└── package.json
```

### 7. State Management

**Decision**: React Query (TanStack Query) for server state

**Rationale**:
- Automatic caching and refetching
- Optimistic updates
- Loading/error states
- No Redux complexity needed

### 8. Styling Approach

**Decision**: Tailwind CSS

**Rationale**:
- Utility-first approach
- Responsive design built-in
- No CSS files to manage
- Fast development

### 9. Environment Configuration

**Decision**: Environment variables with .env files

**Backend**:
- `DATABASE_URL` - Neon connection string
- `CORS_ORIGINS` - Allowed frontend origins

**Frontend**:
- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Unresolved Items

None - all technology choices are defined by constitution.

## Future Considerations (Phase III+)

- Authentication (JWT or session-based)
- WebSocket for real-time updates
- AI agent integration via API
