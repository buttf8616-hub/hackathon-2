# Implementation Plan: Phase II Full-Stack Todo Web Application

**Feature Branch**: `2-phase2-fullstack-web`
**Created**: 2026-02-08
**Status**: Ready for Implementation
**Spec**: [spec.md](./spec.md)

## Technical Context

### System Overview

Phase II transforms the Phase I in-memory console application into a full-stack web application with:
- **Backend**: FastAPI REST API with SQLModel ORM
- **Database**: Neon PostgreSQL (serverless)
- **Frontend**: Next.js 14+ with App Router

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   App Router  │  │   Components  │  │  React Query  │   │
│  │   (Next.js)   │  │   (Tailwind)  │  │   (State)     │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│                           │                                  │
│                    HTTP/REST API                             │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                        Backend                               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   FastAPI     │  │   SQLModel    │  │   Pydantic    │   │
│  │   (Routes)    │  │   (ORM)       │  │   (Schemas)   │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│                           │                                  │
│                    asyncpg Driver                            │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                   Neon PostgreSQL                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    tasks table                        │   │
│  │   id | title | description | completed | priority...  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend Framework | Next.js | 14+ |
| Frontend Language | TypeScript | 5+ |
| Styling | Tailwind CSS | 3+ |
| State Management | React Query | 5+ |
| Backend Framework | FastAPI | 0.109+ |
| Backend Language | Python | 3.11+ |
| ORM | SQLModel | 0.0.14+ |
| Database | Neon PostgreSQL | Latest |
| API Protocol | REST/OpenAPI | 3.1 |

## Constitution Check

### Verified Principles

- [x] **Spec-Driven Development**: Implementation follows spec.md
- [x] **Incremental Evolution**: Phase II builds on Phase I concepts
- [x] **Single Source of Truth**: Spec.md is authoritative
- [x] **Technology Stack**: Using FastAPI, SQLModel, Neon, Next.js as mandated
- [x] **Phase II Scope**: Full-stack web with persistent storage

### Non-Goals Confirmed

- [ ] No AI integration (Phase III)
- [ ] No Kubernetes (Phase IV)
- [ ] No multi-user authentication
- [ ] No real-time collaboration

## Implementation Strategy

### Phase Overview

| Phase | Description | Tasks |
|-------|-------------|-------|
| B0 | Backend Setup | Project structure, dependencies |
| B1 | Database Layer | SQLModel entities, migrations |
| B2 | API Layer | FastAPI routes, validation |
| B3 | API Features | Filter, sort, search |
| F0 | Frontend Setup | Next.js project, configuration |
| F1 | Core Components | Task list, forms |
| F2 | API Integration | React Query, API client |
| F3 | Features | Filter, sort, search UI |
| F4 | Polish | Responsive design, feedback |
| INT | Integration | End-to-end testing |

## Detailed Implementation Plan

### Backend Phase B0: Project Setup

**Goal**: Initialize backend project structure and dependencies

**Tasks**:
1. Create `backend/` directory structure
2. Create `requirements.txt` with dependencies
3. Create `.env.example` with required variables
4. Create `src/__init__.py` package files

**Dependencies**:
```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
asyncpg>=0.29.0
python-dotenv>=1.0.0
pydantic>=2.5.0
```

**Acceptance**:
- [ ] Directory structure matches spec
- [ ] All dependencies installable

---

### Backend Phase B1: Database Layer

**Goal**: Implement SQLModel entities and database connection

**Tasks**:
1. Create `src/models/task.py` with Task entity
2. Create Priority enum
3. Create `src/database.py` with async engine and session
4. Implement table creation on startup

**Acceptance**:
- [ ] Task model matches data-model.md
- [ ] Database connects to Neon
- [ ] Tables auto-create on startup

---

### Backend Phase B2: Core API

**Goal**: Implement CRUD endpoints

**Tasks**:
1. Create `src/api/tasks.py` with route handlers
2. Implement GET /api/tasks (list)
3. Implement GET /api/tasks/{id} (read)
4. Implement POST /api/tasks (create)
5. Implement PUT /api/tasks/{id} (update)
6. Implement DELETE /api/tasks/{id} (delete)
7. Implement PATCH /api/tasks/{id}/toggle
8. Create `src/main.py` with FastAPI app and CORS
9. Add validation error handling

**Acceptance**:
- [ ] All endpoints match api-spec.yaml
- [ ] Proper HTTP status codes
- [ ] Validation errors return 400

---

### Backend Phase B3: Enhanced Features

**Goal**: Implement filter, sort, and search

**Tasks**:
1. Add status filter parameter (all/active/completed)
2. Add priority filter parameter
3. Add tag filter parameter
4. Add search parameter (title + description)
5. Add sort_by parameter (created_at, due_date, priority, title)
6. Add sort_order parameter (asc, desc)

**Acceptance**:
- [ ] Filters work independently and combined
- [ ] Search is case-insensitive
- [ ] Sort handles null due_dates correctly

---

### Frontend Phase F0: Project Setup

**Goal**: Initialize Next.js project with TypeScript and Tailwind

**Tasks**:
1. Create `frontend/` with Next.js 14
2. Configure TypeScript
3. Configure Tailwind CSS
4. Create `.env.local.example`
5. Create `src/types/task.ts`

**Acceptance**:
- [ ] Project builds successfully
- [ ] TypeScript configured strictly
- [ ] Tailwind styles apply

---

### Frontend Phase F1: Core Components

**Goal**: Build reusable UI components

**Tasks**:
1. Create `TaskCard` component (display single task)
2. Create `TaskList` component (display all tasks)
3. Create `TaskForm` component (add/edit form)
4. Create `EmptyState` component
5. Create `PriorityBadge` component
6. Create `TagList` component
7. Create `ConfirmDialog` component

**Acceptance**:
- [ ] Components render correctly
- [ ] Priority colors: High=red, Medium=yellow, Low=green
- [ ] Responsive on mobile (320px)

---

### Frontend Phase F2: API Integration

**Goal**: Connect frontend to backend API

**Tasks**:
1. Install and configure React Query
2. Create `src/lib/api.ts` with fetch functions
3. Create `useTasksQuery` hook (list tasks)
4. Create `useCreateTask` mutation
5. Create `useUpdateTask` mutation
6. Create `useDeleteTask` mutation
7. Create `useToggleTask` mutation
8. Implement optimistic updates

**Acceptance**:
- [ ] Data fetches on page load
- [ ] Mutations update cache
- [ ] Loading states displayed
- [ ] Error states handled

---

### Frontend Phase F3: Features

**Goal**: Implement filter, sort, and search UI

**Tasks**:
1. Create `FilterBar` component
2. Implement status filter tabs (All/Active/Completed)
3. Implement priority filter dropdown
4. Implement tag filter chips
5. Implement search input with debounce
6. Implement sort dropdown
7. Connect filters to API query

**Acceptance**:
- [ ] Filters update URL query params
- [ ] Search debounces 300ms
- [ ] Combined filters work correctly

---

### Frontend Phase F4: Polish

**Goal**: Add responsive design and user feedback

**Tasks**:
1. Implement toast notifications (success/error)
2. Add loading spinners
3. Test responsive breakpoints
4. Add keyboard navigation
5. Implement form validation messages
6. Add confirmation for delete

**Acceptance**:
- [ ] Works on 320px to 1920px screens
- [ ] All operations show feedback
- [ ] Forms validate before submit

---

### Integration Phase INT

**Goal**: End-to-end validation

**Tasks**:
1. Test full CRUD workflow
2. Test filter/sort/search
3. Test persistence across browser refresh
4. Test error handling (network failures)
5. Validate against success criteria

**Acceptance**:
- [ ] SC-001: Add task < 30 seconds
- [ ] SC-002: Page load < 2 seconds (1000 tasks)
- [ ] SC-003: 100% data persistence
- [ ] SC-004: Find task via search < 5 seconds
- [ ] SC-005: Filter/sort < 1 second
- [ ] SC-006: Responsive 320px-1920px
- [ ] SC-007: Immediate form validation
- [ ] SC-008: Phase I feature parity

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Neon connection issues | High | Test connection early, document fallback to local PostgreSQL |
| CORS configuration | Medium | Configure explicitly, test cross-origin |
| Type sync (Python/TS) | Medium | Generate types from OpenAPI spec |
| React Query complexity | Low | Start simple, add features incrementally |

## Dependencies

### External Services
- Neon PostgreSQL account (free tier sufficient)

### Development Tools
- Python 3.11+
- Node.js 18+
- npm/pnpm

## Files to Create

### Backend
- `backend/requirements.txt`
- `backend/.env.example`
- `backend/src/__init__.py`
- `backend/src/main.py`
- `backend/src/database.py`
- `backend/src/models/__init__.py`
- `backend/src/models/task.py`
- `backend/src/schemas/__init__.py`
- `backend/src/schemas/task.py`
- `backend/src/api/__init__.py`
- `backend/src/api/tasks.py`

### Frontend
- `frontend/package.json`
- `frontend/.env.local.example`
- `frontend/src/app/layout.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/app/globals.css`
- `frontend/src/components/TaskCard.tsx`
- `frontend/src/components/TaskList.tsx`
- `frontend/src/components/TaskForm.tsx`
- `frontend/src/components/FilterBar.tsx`
- `frontend/src/components/EmptyState.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/hooks.ts`
- `frontend/src/types/task.ts`

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown
2. Implement backend (B0 → B3)
3. Implement frontend (F0 → F4)
4. Integration testing (INT)
5. Create PHR and commit
