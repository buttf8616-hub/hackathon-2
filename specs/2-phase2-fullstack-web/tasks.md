# Tasks: Phase II Full-Stack Todo Web Application

**Input**: Design documents from `/specs/2-phase2-fullstack-web/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-spec.yaml
**Feature Branch**: `2-phase2-fullstack-web`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize monorepo structure, backend and frontend projects

- [x] T001 Create monorepo directory structure: `backend/`, `backend/src/`, `backend/src/models/`, `backend/src/schemas/`, `backend/src/api/`, `frontend/`
- [x] T002 Create backend `backend/requirements.txt` with FastAPI, uvicorn, sqlmodel, asyncpg, python-dotenv, pydantic dependencies
- [x] T003 [P] Create backend `backend/.env.example` with DATABASE_URL and CORS_ORIGINS variables
- [x] T004 [P] Create backend Python package init files: `backend/src/__init__.py`, `backend/src/models/__init__.py`, `backend/src/schemas/__init__.py`, `backend/src/api/__init__.py`
- [x] T005 Initialize Next.js 14 project in `frontend/` with TypeScript and Tailwind CSS (App Router)
- [x] T006 [P] Create frontend `frontend/.env.local.example` with NEXT_PUBLIC_API_URL variable
- [x] T007 [P] Create TypeScript types in `frontend/src/types/task.ts` matching data-model.md (Task, TaskCreate, TaskUpdate, Priority)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database connection, SQLModel entity, FastAPI app shell, and API client — MUST complete before any user story

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Implement Priority enum and Task SQLModel entity in `backend/src/models/task.py` per data-model.md (9 fields: id, title, description, completed, priority, tags, due_date, created_at, updated_at)
- [x] T009 Implement TaskCreate, TaskUpdate, and TaskRead Pydantic schemas in `backend/src/schemas/task.py` per data-model.md
- [x] T010 Implement async database engine and session management in `backend/src/database.py` (Neon PostgreSQL via asyncpg, table auto-creation on startup)
- [x] T011 Create FastAPI application shell in `backend/src/main.py` with CORS middleware, lifespan event for DB init, health endpoint, and API router mount
- [x] T012 Create API router skeleton in `backend/src/api/tasks.py` with `/api/tasks` prefix
- [x] T013 [P] Create React Query provider and API client base in `frontend/src/lib/api.ts` (fetch wrapper with NEXT_PUBLIC_API_URL base)
- [x] T014 [P] Create React Query provider wrapper component in `frontend/src/app/providers.tsx`
- [x] T015 Create base application layout in `frontend/src/app/layout.tsx` with providers, Tailwind globals, and responsive meta tags
- [x] T016 [P] Create `frontend/src/app/globals.css` with Tailwind directives

**Checkpoint**: Backend connects to Neon PostgreSQL, tables auto-create, FastAPI serves /health, frontend builds and renders shell

---

## Phase 3: User Story 9 - Data Persistence (Priority: P1)

**Goal**: All task data persists in Neon PostgreSQL; data survives backend restarts and browser refreshes

**Independent Test**: Add a task via API, restart backend, query tasks — data is still present

**Why first**: Persistence underpins every other story. The database layer must work before CRUD endpoints are meaningful.

### Implementation for US9

- [x] T017 [US9] Implement `create_task` DB function in `backend/src/api/tasks.py` — insert row via async session, return TaskRead
- [x] T018 [US9] Implement `get_all_tasks` DB function in `backend/src/api/tasks.py` — select all rows, return list of TaskRead
- [x] T019 [US9] Implement `get_task_by_id` DB function in `backend/src/api/tasks.py` — select by id, raise 404 if missing
- [x] T020 [US9] Verify persistence: manually test POST then GET via FastAPI /docs — confirm data survives server restart

**Checkpoint**: Tasks created via POST /api/tasks persist in Neon PostgreSQL and survive backend restarts

---

## Phase 4: User Story 1 - View Tasks in Web Interface (Priority: P1) MVP

**Goal**: Users see all tasks in the browser with title, priority, status, and due date

**Independent Test**: Open http://localhost:3000, verify task list displays with correct columns and empty state

### Implementation for US1

- [x] T021 [US1] Implement GET `/api/tasks` endpoint in `backend/src/api/tasks.py` — returns list of all tasks as JSON (uses T018 function)
- [x] T022 [US1] Implement GET `/api/tasks/{id}` endpoint in `backend/src/api/tasks.py` — returns single task or 404 (uses T019 function)
- [x] T023 [P] [US1] Create `EmptyState` component in `frontend/src/components/EmptyState.tsx` — "No tasks yet" message with prompt to add first task
- [x] T024 [P] [US1] Create `PriorityBadge` component in `frontend/src/components/PriorityBadge.tsx` — High=red, Medium=yellow, Low=green color indicators
- [x] T025 [P] [US1] Create `TagList` component in `frontend/src/components/TagList.tsx` — renders list of tag chips
- [x] T026 [US1] Create `TaskCard` component in `frontend/src/components/TaskCard.tsx` — displays single task with title, priority badge, completion status checkbox, tags, due date
- [x] T027 [US1] Create `TaskList` component in `frontend/src/components/TaskList.tsx` — renders list of TaskCard components, shows EmptyState when no tasks
- [x] T028 [US1] Create `useTasksQuery` hook in `frontend/src/lib/hooks.ts` — React Query hook fetching GET /api/tasks
- [x] T029 [US1] Wire main page `frontend/src/app/page.tsx` — uses useTasksQuery, renders TaskList, handles loading state

**Checkpoint**: Opening http://localhost:3000 shows all tasks from database with proper formatting, or empty state if no tasks

---

## Phase 5: User Story 2 - Add Task via Web Interface (Priority: P1)

**Goal**: Users create new tasks through a web form with title, description, priority, tags, and due date

**Independent Test**: Click "Add Task", fill form, submit — new task appears in list

### Implementation for US2

- [x] T030 [US2] Implement POST `/api/tasks` endpoint in `backend/src/api/tasks.py` — validates input per TaskCreate schema, persists, returns 201 with TaskRead (uses T017 function)
- [x] T031 [US2] Create `TaskForm` component in `frontend/src/components/TaskForm.tsx` — form with title (required), description, priority dropdown, tags input, due date picker; client-side validation (title required, max 500 chars)
- [x] T032 [US2] Create `useCreateTask` mutation hook in `frontend/src/lib/hooks.ts` — POST to /api/tasks, invalidates tasks query on success
- [x] T033 [US2] Add "Add Task" button and form integration to `frontend/src/app/page.tsx` — toggles TaskForm visibility, passes onSubmit to useCreateTask
- [x] T034 [US2] Add success toast notification on task creation in `frontend/src/app/page.tsx`

**Checkpoint**: Users can add tasks via web form; new tasks appear in list immediately; data persists on refresh

---

## Phase 6: User Story 5 - Toggle Task Completion (Priority: P1)

**Goal**: Users toggle task completion via checkbox; status persists

**Independent Test**: Click checkbox on a task — visual indicator changes, refreshing page preserves state

### Implementation for US5

- [x] T035 [US5] Implement PATCH `/api/tasks/{id}/toggle` endpoint in `backend/src/api/tasks.py` — flips completed boolean, updates updated_at, returns TaskRead
- [x] T036 [US5] Create `useToggleTask` mutation hook in `frontend/src/lib/hooks.ts` — PATCH to /api/tasks/{id}/toggle, invalidates tasks query on success
- [x] T037 [US5] Wire completion checkbox in `TaskCard` component `frontend/src/components/TaskCard.tsx` — onClick triggers useToggleTask, visual strikethrough for completed tasks

**Checkpoint**: Clicking checkbox toggles completion, visual feedback immediate, state persists on refresh

---

## Phase 7: User Story 3 - Edit Task via Web Interface (Priority: P2)

**Goal**: Users modify existing task fields (title, description, priority, tags, due date)

**Independent Test**: Click edit on a task, change title and priority, save — changes persist

### Implementation for US3

- [x] T038 [US3] Implement PUT `/api/tasks/{id}` endpoint in `backend/src/api/tasks.py` — validates input per TaskUpdate schema, updates only provided fields, refreshes updated_at, returns TaskRead or 404
- [x] T039 [US3] Create `useUpdateTask` mutation hook in `frontend/src/lib/hooks.ts` — PUT to /api/tasks/{id}, invalidates tasks query on success
- [x] T040 [US3] Add edit mode to `TaskCard` or create `EditTaskModal` component in `frontend/src/components/TaskForm.tsx` — reuse TaskForm with pre-filled values for editing
- [x] T041 [US3] Wire edit button in `TaskCard` component `frontend/src/components/TaskCard.tsx` — opens edit form, passes current task data
- [x] T042 [US3] Add success toast notification on task update

**Checkpoint**: Users can edit any task field; changes persist; validation prevents empty title

---

## Phase 8: User Story 4 - Delete Task via Web Interface (Priority: P2)

**Goal**: Users remove tasks with confirmation dialog

**Independent Test**: Click delete on a task, confirm — task disappears; refresh confirms deletion

### Implementation for US4

- [x] T043 [US4] Implement DELETE `/api/tasks/{id}` endpoint in `backend/src/api/tasks.py` — deletes task, returns 204 or 404
- [x] T044 [US4] Create `ConfirmDialog` component in `frontend/src/components/ConfirmDialog.tsx` — modal with "Are you sure?" message, confirm/cancel buttons
- [x] T045 [US4] Create `useDeleteTask` mutation hook in `frontend/src/lib/hooks.ts` — DELETE to /api/tasks/{id}, invalidates tasks query on success
- [x] T046 [US4] Wire delete button in `TaskCard` component `frontend/src/components/TaskCard.tsx` — shows ConfirmDialog, on confirm calls useDeleteTask
- [x] T047 [US4] Add success toast notification on task deletion

**Checkpoint**: Delete with confirmation works; task removed from list and database; refresh confirms

---

## Phase 9: User Story 6 - Filter Tasks (Priority: P2)

**Goal**: Users filter tasks by status (All/Active/Completed), priority, and tags

**Independent Test**: Select "Completed" filter — only completed tasks shown; select "High" priority — only high priority tasks shown

### Implementation for US6

- [x] T048 [US6] Implement status filter query parameter on GET `/api/tasks` in `backend/src/api/tasks.py` — filter by all/active/completed
- [x] T049 [US6] Implement priority filter query parameter on GET `/api/tasks` in `backend/src/api/tasks.py` — filter by high/medium/low
- [x] T050 [US6] Implement tag filter query parameter on GET `/api/tasks` in `backend/src/api/tasks.py` — filter by tag name
- [x] T051 [US6] Create `FilterBar` component in `frontend/src/components/FilterBar.tsx` — status tabs (All/Active/Completed), priority dropdown, tag chips
- [x] T052 [US6] Update `useTasksQuery` hook in `frontend/src/lib/hooks.ts` to accept filter parameters and pass as query params
- [x] T053 [US6] Wire FilterBar to page in `frontend/src/app/page.tsx` — filter state updates query, URL query params reflect filters

**Checkpoint**: All three filter types work independently and combined; clearing filters shows all tasks

---

## Phase 10: User Story 8 - Search Tasks (Priority: P3)

**Goal**: Users search tasks by keyword across title and description

**Independent Test**: Type "groceries" in search — only matching tasks shown; clear search — all tasks shown

### Implementation for US8

- [x] T054 [US8] Implement search query parameter on GET `/api/tasks` in `backend/src/api/tasks.py` — case-insensitive search in title and description
- [x] T055 [US8] Add search input with 300ms debounce to `FilterBar` component in `frontend/src/components/FilterBar.tsx`
- [x] T056 [US8] Update `useTasksQuery` hook in `frontend/src/lib/hooks.ts` to accept search parameter
- [x] T057 [US8] Display "No matching tasks" empty state when search returns no results in `frontend/src/components/TaskList.tsx`

**Checkpoint**: Search finds tasks by keyword; debounce prevents excessive API calls; empty results show message

---

## Phase 11: User Story 7 - Sort Tasks (Priority: P3)

**Goal**: Users sort tasks by due date, priority, title, or creation date

**Independent Test**: Select "Sort by priority" — High tasks appear first; select "Sort by due date" — earliest dates first

### Implementation for US7

- [x] T058 [US7] Implement sort_by and sort_order query parameters on GET `/api/tasks` in `backend/src/api/tasks.py` — sort by created_at (default), due_date, priority, title; order asc/desc
- [x] T059 [US7] Add sort dropdown to `FilterBar` component in `frontend/src/components/FilterBar.tsx` — sort by options with asc/desc toggle
- [x] T060 [US7] Update `useTasksQuery` hook in `frontend/src/lib/hooks.ts` to accept sort parameters
- [x] T061 [US7] Handle null due_dates in sort: null dates sort last in ascending, first in descending

**Checkpoint**: All sort options work correctly; null due dates handled gracefully; sort combined with filters

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, loading states, responsive design, and overall UX improvements

- [x] T062 Implement standardized JSON error responses and exception handlers in `backend/src/main.py` — catch unhandled exceptions, return structured error JSON
- [x] T063 [P] Add loading spinner component in `frontend/src/components/LoadingSpinner.tsx` — used during async operations
- [x] T064 [P] Add toast notification system in `frontend/src/components/Toast.tsx` — success (green) and error (red) notifications for all operations
- [x] T065 Implement error handling UI in `frontend/src/app/page.tsx` — display API error messages, graceful failure states with retry
- [x] T066 Add form validation error display to `TaskForm` component in `frontend/src/components/TaskForm.tsx` — inline validation messages (FR-020)
- [x] T067 Verify responsive design across breakpoints (320px to 1920px) in all components — adjust layouts for mobile/tablet/desktop
- [x] T068 Add loading states to all mutation buttons to prevent duplicate submissions in `frontend/src/components/TaskCard.tsx` and `frontend/src/components/TaskForm.tsx`

---

## Phase 13: Integration & Validation

**Purpose**: End-to-end verification against success criteria

- [x] T069 Integration test: Full CRUD workflow — add task, view in list, edit task, toggle completion, delete task
- [x] T070 Integration test: Filter + Sort + Search combined — apply filters, search, sort simultaneously
- [x] T071 Persistence verification — add tasks, restart backend, confirm tasks persist in database
- [x] T072 Validate success criteria:
  - SC-001: Add task via web form < 30 seconds
  - SC-002: Page load < 2 seconds with task list
  - SC-003: 100% data persistence across browser sessions
  - SC-004: Find task via search < 5 seconds
  - SC-005: Filter/sort operations < 1 second
  - SC-006: Responsive 320px to 1920px
  - SC-007: Immediate form validation feedback
  - SC-008: Phase I feature parity (CRUD + toggle)
- [x] T073 Regression check: Verify all Phase I functionality preserved in web interface

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US9 Persistence)**: Depends on Phase 2 — BLOCKS US1-US8 (persistence needed for all)
- **Phase 4 (US1 View)**: Depends on Phase 3 — MVP entry point
- **Phase 5 (US2 Add)**: Depends on Phase 4 — needs view to verify creation
- **Phase 6 (US5 Toggle)**: Depends on Phase 4 — needs view to verify toggle
- **Phase 7 (US3 Edit)**: Depends on Phase 4 — needs view to verify edits
- **Phase 8 (US4 Delete)**: Depends on Phase 4 — needs view to verify deletion
- **Phase 9 (US6 Filter)**: Depends on Phase 4 — needs task list to filter
- **Phase 10 (US8 Search)**: Depends on Phase 4 — needs task list to search
- **Phase 11 (US7 Sort)**: Depends on Phase 4 — needs task list to sort
- **Phase 12 (Polish)**: Depends on Phases 4-11
- **Phase 13 (Integration)**: Depends on all previous phases

### Parallel Opportunities After Phase 4

Once US1 (View) is complete, the following can proceed in parallel:
- US2 (Add) + US5 (Toggle) + US3 (Edit) + US4 (Delete) — different endpoints and components
- US6 (Filter) + US7 (Sort) + US8 (Search) — different query parameters and UI controls

### Within Each User Story

- Backend endpoint before frontend integration
- Models/schemas before API routes
- API client hooks before component wiring

---

## Parallel Example: After Phase 4 (US1 View) Completes

```text
# These can run in parallel (different backend endpoints + different frontend components):
Phase 5 (US2 Add):    T030-T034 — POST endpoint + TaskForm component
Phase 6 (US5 Toggle): T035-T037 — PATCH endpoint + checkbox wiring
Phase 7 (US3 Edit):   T038-T042 — PUT endpoint + edit modal
Phase 8 (US4 Delete): T043-T047 — DELETE endpoint + confirm dialog
```

---

## Implementation Strategy

### MVP First (Phases 1-5)

1. Complete Phase 1: Setup (monorepo structure)
2. Complete Phase 2: Foundational (DB, FastAPI shell, frontend shell)
3. Complete Phase 3: US9 Persistence (verify data persists)
4. Complete Phase 4: US1 View (see tasks in browser)
5. Complete Phase 5: US2 Add (create tasks via form)
6. **STOP and VALIDATE**: Users can add and view tasks — this is the MVP

### Incremental Delivery

7. Phase 6: US5 Toggle → can mark tasks complete
8. Phase 7: US3 Edit → can modify tasks
9. Phase 8: US4 Delete → can remove tasks
10. **VALIDATE**: Full CRUD parity with Phase I
11. Phase 9-11: Filters, Search, Sort → enhanced features
12. Phase 12-13: Polish and integration validation

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 73 |
| Phase 1 (Setup) | 7 tasks |
| Phase 2 (Foundational) | 9 tasks |
| Phase 3 (US9 Persistence) | 4 tasks |
| Phase 4 (US1 View) | 9 tasks |
| Phase 5 (US2 Add) | 5 tasks |
| Phase 6 (US5 Toggle) | 3 tasks |
| Phase 7 (US3 Edit) | 5 tasks |
| Phase 8 (US4 Delete) | 5 tasks |
| Phase 9 (US6 Filter) | 6 tasks |
| Phase 10 (US8 Search) | 4 tasks |
| Phase 11 (US7 Sort) | 4 tasks |
| Phase 12 (Polish) | 7 tasks |
| Phase 13 (Integration) | 5 tasks |
| Parallel Opportunities | Phases 5-11 after US1 completes |
| MVP Scope | Phases 1-5 (US9 + US1 + US2) |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable after its phase completes
- All code generated by Claude Code only — no manual editing
- Commit after each phase or logical task group
