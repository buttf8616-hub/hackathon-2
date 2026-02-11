# Tasks: Phase III AI-Powered Todo Chatbot

**Input**: Design documents from `/specs/3-phase3-ai-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/chat-api.yaml
**Tests**: Manual acceptance testing only (no automated tests requested)
**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create module structure for Phase III

- [X] T001 Add `openai-agents`, `mcp[cli]`, and `httpx` to `backend/requirements.txt` and install in venv
- [X] T002 [P] Create `backend/src/mcp_tools/__init__.py` package file
- [X] T003 [P] Create `backend/src/agent/__init__.py` package file
- [X] T004 Install `@openai/chatkit-react` in `frontend/` via npm
- [X] T005 Add `OPENAI_API_KEY` and `OPENAI_MODEL` to `backend/.env` with placeholder values and update `backend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story — MCP server, API client, Agent, and ChatKit backend endpoint

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create async HTTP client for Phase II REST API in `backend/src/mcp_tools/api_client.py` — wrapper with methods: `get_tasks()`, `get_task_by_id(id)`, `create_task(data)`, `update_task(id, data)`, `delete_task(id)`, `toggle_task(id)` calling `http://localhost:8000/api/tasks/*`
- [X] T007 Create FastMCP server skeleton in `backend/src/mcp_tools/server.py` — initialize `FastMCP("todo-tools")` instance, import api_client
- [X] T008 Create agent system instructions in `backend/src/agent/instructions.py` — comprehensive prompt covering: intent identification (create/read/update/delete/toggle/search/filter/sort), parameter extraction, clarification for ambiguity (FR-007), confirmation before delete (FR-013), no internal detail exposure (FR-015), conversational response formatting (FR-011), multi-intent handling (FR-008), error translation (FR-012)
- [X] T009 Create agent configuration in `backend/src/agent/agent.py` — `Agent` with name "Todo Assistant", instructions from `instructions.py`, connected to MCP server; include `create_agent()` and `run_agent(messages)` functions
- [X] T010 Create ChatKit streaming endpoint `POST /chatkit` in `backend/src/main.py` — receive messages array, run agent with conversation history, stream response back; add error handling returning user-friendly message on failure

**Checkpoint**: Foundation ready — MCP server, Agent, and ChatKit endpoint all initialized. User story implementation can begin.

---

## Phase 3: User Story 8 — Chat Interface Integration (Priority: P1) MVP

**Goal**: Users can see and interact with a chat panel in the existing Todo web app

**Independent Test**: Open web app at localhost:3000, verify chat panel toggle button visible, click to open panel, type a message and press Enter, verify message appears and loading indicator shows

### Implementation for User Story 8

- [X] T011 [US8] Create `frontend/src/components/ChatPanel.tsx` — ChatKit component using `useChatKit()` hook connected to `http://localhost:8000/chatkit`, full-height panel with ChatKit widget
- [X] T012 [US8] Modify `frontend/src/app/page.tsx` — add chat toggle button in header, import ChatPanel, add slide-out side panel on desktop (right side, 400px width) and full-screen overlay on mobile (<768px), toggle state management
- [X] T013 [US8] Add responsive CSS for chat panel — side panel on desktop (>= 768px), full-screen overlay on mobile (< 768px), smooth open/close transition, z-index above task list

**Checkpoint**: Chat panel visible and toggleable. Messages can be typed but agent responses depend on Phase 2 + MCP tools.

---

## Phase 4: User Story 1 — Create Task via Natural Language (Priority: P1)

**Goal**: Users can create tasks by typing natural language like "Add a task to buy groceries tomorrow with high priority"

**Independent Test**: Type "Add a task to buy groceries tomorrow" in chat, verify task appears in task list with title "Buy groceries" and tomorrow's due date

### Implementation for User Story 1

- [X] T014 [US1] Implement `create_task` MCP tool in `backend/src/mcp_tools/server.py` — params: title (required), description, priority, tags, due_date; calls `api_client.create_task()`; returns confirmation string with task title and ID
- [X] T015 [US1] Verify agent identifies create intent and extracts parameters — ensure instructions.py covers: title extraction from NL, priority mapping ("urgent"→"high"), date parsing ("tomorrow"→ISO date), clarification when title is missing (FR-007)

**Checkpoint**: "Add a task to buy groceries" creates a task via chatbot.

---

## Phase 5: User Story 2 — List and View Tasks (Priority: P1)

**Goal**: Users can view their tasks by asking "Show me all my tasks"

**Independent Test**: Type "Show me all my tasks" in chat, verify chatbot responds with formatted task list showing titles, priorities, and statuses

### Implementation for User Story 2

- [X] T016 [US2] Implement `get_tasks` MCP tool in `backend/src/mcp_tools/server.py` — params: status, priority, tag, search, sort_by, sort_order (all optional); calls `api_client.get_tasks()`; returns formatted list of tasks or "no tasks found" message
- [X] T017 [US2] Implement `get_task_by_id` MCP tool in `backend/src/mcp_tools/server.py` — params: task_id (required); calls `api_client.get_task_by_id()`; returns task details or "task not found" message
- [X] T018 [US2] Verify agent lists tasks conversationally — ensure agent formats task list with numbers, titles, priorities, and completion status in readable format

**Checkpoint**: "Show me all my tasks" returns formatted task list via chatbot.

---

## Phase 6: User Story 3 — Complete Task via Natural Language (Priority: P1)

**Goal**: Users can mark tasks as done by typing "Mark the groceries task as done"

**Independent Test**: Type "Mark the groceries task as done" in chat, verify task status toggles to completed and chatbot confirms

### Implementation for User Story 3

- [X] T019 [US3] Implement `toggle_task` MCP tool in `backend/src/mcp_tools/server.py` — params: task_id (required); calls `api_client.toggle_task()`; returns confirmation with new status
- [X] T020 [US3] Verify agent handles toggle intent — ensure agent can: search for task by name (calls get_tasks first), then toggle the matching task; handle ambiguous matches by listing options

**Checkpoint**: "Mark the groceries task as done" toggles task completion via chatbot.

---

## Phase 7: User Story 4 — Update Task via Natural Language (Priority: P2)

**Goal**: Users can modify task details by typing "Change the groceries task to high priority"

**Independent Test**: Type "Change the groceries task to high priority" in chat, verify priority updates and chatbot confirms

### Implementation for User Story 4

- [X] T021 [US4] Implement `update_task` MCP tool in `backend/src/mcp_tools/server.py` — params: task_id (required), title, description, priority, tags, due_date, completed (all optional); calls `api_client.update_task()`; returns confirmation with updated fields
- [X] T022 [US4] Verify agent handles update intent — ensure agent can: identify which fields to update from NL ("rename to X"→title, "set priority to high"→priority, "set due date to Friday"→due_date), search for task by name, apply updates

**Checkpoint**: "Change the groceries task to high priority" updates task via chatbot.

---

## Phase 8: User Story 5 — Delete Task via Natural Language (Priority: P2)

**Goal**: Users can delete tasks with confirmation — "Delete the groceries task" triggers confirmation before deletion

**Independent Test**: Type "Delete the groceries task", verify chatbot asks "Are you sure?", type "Yes", verify task is removed

### Implementation for User Story 5

- [X] T023 [US5] Implement `delete_task` MCP tool in `backend/src/mcp_tools/server.py` — params: task_id (required); calls `api_client.delete_task()`; returns confirmation of deletion
- [X] T024 [US5] Verify agent confirmation flow for delete — ensure instructions.py mandates: always ask "Are you sure you want to delete '[task title]'?" before calling delete_task tool; only proceed on affirmative response; cancel on "no"/"cancel" (FR-013)

**Checkpoint**: Delete requires confirmation before executing.

---

## Phase 9: User Story 6 — Search and Filter Tasks (Priority: P2)

**Goal**: Users can find specific tasks by asking "Show only high priority tasks" or "Find tasks about work"

**Independent Test**: Type "Show only high priority tasks" in chat, verify only high priority tasks are returned

### Implementation for User Story 6

- [X] T025 [US6] Verify `get_tasks` tool supports all filter/search/sort params — ensure agent maps NL to correct params: "high priority"→priority=high, "about work"→search=work, "sort by due date"→sort_by=due_date, "pending tasks"→status=active, "completed tasks"→status=completed
- [X] T026 [US6] Verify agent handles combined filter requests — "Show high priority tasks sorted by due date" maps to priority=high + sort_by=due_date + sort_order=asc

**Checkpoint**: Filter, search, and sort all work via natural language.

---

## Phase 10: User Story 7 — Conversational Context Within Session (Priority: P3)

**Goal**: Chatbot understands follow-up messages like "Delete the first one" after "Show my tasks"

**Independent Test**: Type "Show my tasks", then "Delete the first one", verify chatbot asks to confirm deletion of the correct task

### Implementation for User Story 7

- [X] T027 [US7] Verify conversation history is passed to agent — ensure `run_agent(messages)` in `backend/src/agent/agent.py` passes full message history so the agent can resolve references like "the first one", "that task", "it"
- [X] T028 [US7] Verify agent instructions cover context resolution — ensure instructions.py tells agent to: use conversation history to resolve pronouns and ordinal references, ask for clarification if context is insufficient in a new session (FR-016)

**Checkpoint**: Follow-up messages work within session context.

---

## Phase 11: Integration & UI Refresh

**Purpose**: Wire chatbot actions to task list refresh so changes appear immediately

- [X] T029 Add React Query cache invalidation after chatbot actions in `frontend/src/app/page.tsx` — when chat panel detects a completed agent action (task created/updated/deleted/toggled), call `queryClient.invalidateQueries({ queryKey: ['tasks'] })` to refresh task list (FR-020, SC-008)
- [X] T030 Verify Phase II UI unchanged — confirm all existing components (TaskCard, TaskList, TaskForm, FilterBar, etc.) function identically with chatbot enabled (FR-018, FR-019)

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, error handling, and responsive design

- [X] T031 [P] Handle edge case: empty message — agent responds with "How can I help you manage your tasks?" per spec edge cases
- [X] T032 [P] Handle edge case: task not found — agent responds with "I couldn't find a task matching that description. Would you like to see your current tasks?" per spec edge cases
- [X] T033 [P] Handle edge case: AI service unavailable — ChatKit endpoint returns graceful error "I'm having trouble connecting right now. Please try again in a moment." per spec edge cases
- [X] T034 [P] Handle edge case: ambiguous task reference — agent lists matching tasks and asks user to specify which one per spec edge cases
- [X] T035 Verify responsive design — chat panel works on 320px to 1920px screens (SC-009): side panel on desktop >= 768px, full-screen overlay on mobile < 768px
- [X] T036 Run quickstart.md validation — follow `specs/3-phase3-ai-chatbot/quickstart.md` steps end-to-end, verify all setup, startup, and example interactions work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US8 Chat Interface (Phase 3)**: Depends on Phase 1 (frontend deps) + Phase 2 (backend endpoint)
- **US1–US7 (Phases 4–10)**: Depend on Phase 2 (MCP server + Agent ready)
- **Integration (Phase 11)**: Depends on Phase 3 (ChatPanel exists) + at least Phase 4 (one story works)
- **Polish (Phase 12)**: Depends on all user story phases

### User Story Dependencies

| Story | Phase | Priority | Depends On | Can Parallel With |
|-------|-------|----------|------------|-------------------|
| US8 - Chat Interface | 3 | P1 | Phase 2 | — (must be first) |
| US1 - Create Task | 4 | P1 | Phase 2 | US2, US3 |
| US2 - List Tasks | 5 | P1 | Phase 2 | US1, US3 |
| US3 - Complete Task | 6 | P1 | Phase 2, US2 (needs get_tasks to find by name) | US1 |
| US4 - Update Task | 7 | P2 | Phase 2, US2 (needs get_tasks to find by name) | US5, US6 |
| US5 - Delete Task | 8 | P2 | Phase 2, US2 (needs get_tasks to find by name) | US4, US6 |
| US6 - Search/Filter | 9 | P2 | Phase 2, US2 (reuses get_tasks tool) | US4, US5 |
| US7 - Context | 10 | P3 | Phase 2, all tools defined | — (last story) |

### Within Each User Story

1. MCP tool implementation → Agent behavior verification
2. Tool must work before agent behavior can be tested

### Parallel Opportunities

```bash
# Phase 1: All setup tasks in parallel
T002 (mcp_tools __init__) || T003 (agent __init__) || T004 (npm install) || T005 (.env)

# Phase 2: API client first, then rest in parallel
T006 (api_client) → T007 (server.py) + T008 (instructions.py) in parallel
T009 (agent.py) depends on T007 + T008
T010 (chatkit endpoint) depends on T009

# User stories 1+2 in parallel (different tools):
T014-T015 (US1: create_task) || T016-T018 (US2: get_tasks)

# User stories 4+5+6 in parallel:
T021-T022 (US4: update_task) || T023-T024 (US5: delete_task) || T025-T026 (US6: search/filter)

# Phase 12: All edge case handlers in parallel:
T031 || T032 || T033 || T034
```

---

## Implementation Strategy

### MVP First (User Story 8 + User Story 1 + User Story 2)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T010)
3. Complete Phase 3: US8 — Chat Interface (T011–T013)
4. Complete Phase 4: US1 — Create Task (T014–T015)
5. Complete Phase 5: US2 — List Tasks (T016–T018)
6. **STOP and VALIDATE**: Can create and view tasks via chat
7. Complete Phase 11: Integration (T029–T030)

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US8 → Chat panel visible (MVP scaffold)
3. US1 + US2 → Create + List tasks via chat (MVP!)
4. US3 → Toggle completion via chat
5. US4 + US5 + US6 → Update, Delete, Search/Filter
6. US7 → Conversational context
7. Polish → Edge cases, responsive, validation

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 36 |
| **Phase 1 (Setup)** | 5 tasks |
| **Phase 2 (Foundational)** | 5 tasks |
| **US8 (Chat Interface)** | 3 tasks |
| **US1 (Create Task)** | 2 tasks |
| **US2 (List Tasks)** | 3 tasks |
| **US3 (Complete Task)** | 2 tasks |
| **US4 (Update Task)** | 2 tasks |
| **US5 (Delete Task)** | 2 tasks |
| **US6 (Search/Filter)** | 2 tasks |
| **US7 (Context)** | 2 tasks |
| **Integration** | 2 tasks |
| **Polish** | 6 tasks |
| **Parallel Opportunities** | 4 parallel groups identified |
| **MVP Scope** | US8 + US1 + US2 (16 tasks) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All MCP tools are defined in single file `backend/src/mcp_tools/server.py` — tools are added incrementally per user story
- Agent behavior is primarily controlled by `instructions.py` — verified per user story
- Phase II code is NEVER modified (FR-018, FR-019) except: `backend/src/main.py` (add endpoint), `backend/requirements.txt` (add deps), `frontend/src/app/page.tsx` (add ChatPanel toggle), `frontend/package.json` (add dep)
- All 36 tasks executable by Claude Code without manual intervention
