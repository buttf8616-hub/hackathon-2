# Implementation Plan: Phase III AI-Powered Todo Chatbot

**Branch**: `3-phase3-ai-chatbot` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/3-phase3-ai-chatbot/spec.md`

## Summary

Phase III adds an AI-powered conversational chatbot to the existing Phase II Todo web application. Users can manage tasks via natural language using a chat panel integrated into the existing UI. The implementation uses OpenAI ChatKit (`@openai/chatkit-react`) for the chat interface, OpenAI Agents SDK (`openai-agents`) for AI orchestration, and the Official MCP SDK (`mcp`) for structured tool definitions that wrap Phase II REST API calls.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5+ (frontend)
**Primary Dependencies**: OpenAI Agents SDK, MCP SDK (FastMCP), OpenAI ChatKit React
**Storage**: Neon PostgreSQL (unchanged), in-memory chat sessions
**Testing**: Manual acceptance testing against user stories
**Target Platform**: Web (localhost development)
**Project Type**: Web (monorepo: backend/ + frontend/)
**Performance Goals**: Chat response < 5 seconds (SC-003)
**Constraints**: OpenAI API key required, English only, session-scoped context
**Scale/Scope**: Single user, session-based chat

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Verified Principles

- [x] **Spec-Driven Development**: Implementation follows spec.md (8 user stories, 20 FRs, 9 SCs)
- [x] **Incremental Evolution**: Phase III builds on Phase II without breaking existing functionality
- [x] **Single Source of Truth**: spec.md is authoritative for requirements
- [x] **Technology Stack**: Using OpenAI ChatKit, OpenAI Agents SDK, Official MCP SDK as mandated
- [x] **Phase III Scope**: Conversational interface for task management via AI agent
- [x] **AI Interaction Rules**: Chatbot translates NL to structured operations, never directly manipulates storage
- [x] **Backward Compatibility**: Phase II REST APIs and web UI remain unchanged (FR-018, FR-019)

### Non-Goals Confirmed

- [ ] No voice input/output
- [ ] No multi-user authentication
- [ ] No Kubernetes deployment (Phase IV)
- [ ] No persistent conversation memory beyond session
- [ ] No replacing existing web UI

## Project Structure

### Documentation (this feature)

```text
specs/3-phase3-ai-chatbot/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # ChatMessage, MCP Tool schemas
├── quickstart.md        # Setup instructions
├── contracts/
│   └── chat-api.yaml    # Chat endpoint contract
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Task breakdown (created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py              # FastAPI app (add ChatKit endpoint)
│   ├── database.py          # DB connection (unchanged)
│   ├── models/
│   │   └── task.py          # Task entity (unchanged)
│   ├── schemas/
│   │   └── task.py          # Pydantic schemas (unchanged)
│   ├── api/
│   │   └── tasks.py         # REST API routes (unchanged)
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── agent.py         # OpenAI Agent configuration
│   │   └── instructions.py  # Agent system prompt
│   └── mcp_tools/
│       ├── __init__.py
│       ├── server.py        # FastMCP server with tool definitions
│       └── api_client.py    # HTTP client for Phase II REST API
└── requirements.txt         # Add openai-agents, mcp[cli], httpx

frontend/
├── src/
│   ├── app/
│   │   └── page.tsx         # Add ChatPanel toggle (modify)
│   └── components/
│       └── ChatPanel.tsx    # ChatKit integration (new)
└── package.json             # Add @openai/chatkit-react
```

**Structure Decision**: Extends existing monorepo. Backend adds `agent/` and `mcp_tools/` modules. Frontend adds `ChatPanel` component. All Phase II code remains unchanged.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   Task UI     │  │  ChatKit      │  │  React Query  │   │
│  │   (Phase II)  │  │  (Phase III)  │  │  (State)      │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│         │                   │                   │            │
│    REST API            ChatKit API         REST API          │
└─────────┼───────────────────┼───────────────────┼───────────┘
          │                   │                   │
┌─────────┼───────────────────┼───────────────────┼───────────┐
│         │              Backend                  │            │
│  ┌──────┴────────┐  ┌───────┴───────┐  ┌───────┴────────┐  │
│  │  REST API     │  │  ChatKit      │  │   Agent        │  │
│  │  /api/tasks/* │  │  /chatkit     │  │  (Agents SDK)  │  │
│  │  (Phase II)   │  │  (Phase III)  │  │                │  │
│  └──────┬────────┘  └───────────────┘  └───────┬────────┘  │
│         │                                       │            │
│         │              ┌────────────────────────┘            │
│         │              │                                     │
│  ┌──────┴──────────────┴─────────┐                          │
│  │      MCP Server (FastMCP)     │                          │
│  │  create_task | get_tasks |... │                          │
│  │      ↓ HTTP calls to REST API │                          │
│  └───────────────────────────────┘                          │
│         │                                                    │
│    asyncpg Driver                                            │
└─────────┼────────────────────────────────────────────────────┘
          │
┌─────────┴────────────────────────────────────────────────────┐
│                   Neon PostgreSQL (unchanged)                 │
└──────────────────────────────────────────────────────────────┘
```

## Implementation Strategy

### Phase Overview

| Phase | Description | Components |
|-------|-------------|------------|
| M0 | MCP Server Setup | FastMCP server, API client, tool definitions |
| M1 | MCP Tools | 6 tools mapping to REST API endpoints |
| A0 | Agent Setup | Agent configuration, instructions, MCP connection |
| A1 | ChatKit Backend | ChatKit streaming endpoint on FastAPI |
| C0 | Frontend ChatKit | Install ChatKit React, create ChatPanel |
| C1 | Integration | Wire ChatPanel to backend, task list refresh |
| T0 | Testing | Acceptance testing against user stories |

## Detailed Implementation Plan

### Phase M0: MCP Server & API Client

**Goal**: Create MCP server infrastructure and HTTP client for calling Phase II REST API

**Tasks**:
1. Add `openai-agents`, `mcp[cli]`, `httpx` to `requirements.txt`
2. Create `backend/src/mcp_tools/__init__.py`
3. Create `backend/src/mcp_tools/api_client.py` — async HTTP client for Phase II REST API
4. Create `backend/src/mcp_tools/server.py` — FastMCP server instance

**Acceptance**:
- [ ] Dependencies install without errors
- [ ] API client can call all 6 REST API endpoints
- [ ] FastMCP server initializes

---

### Phase M1: MCP Tool Definitions

**Goal**: Define all 6 MCP tools that wrap Phase II REST API calls

**Tasks**:
1. Implement `create_task` tool — calls `POST /api/tasks`
2. Implement `get_tasks` tool — calls `GET /api/tasks` with filter/sort/search params
3. Implement `get_task_by_id` tool — calls `GET /api/tasks/{id}`
4. Implement `update_task` tool — calls `PUT /api/tasks/{id}`
5. Implement `delete_task` tool — calls `DELETE /api/tasks/{id}`
6. Implement `toggle_task` tool — calls `PATCH /api/tasks/{id}/toggle`

**Tool Implementation Pattern**:
```python
@mcp.tool()
async def create_task(
    title: str,
    description: str = "",
    priority: str = "medium",
    tags: list[str] = [],
    due_date: str | None = None,
) -> str:
    """Create a new task in the todo list."""
    response = await api_client.post("/api/tasks", json={...})
    return f"Created task: {response['title']} (ID: {response['id']})"
```

**Acceptance**:
- [ ] All 6 tools defined with proper type hints and docstrings
- [ ] Tools correctly call REST API endpoints
- [ ] Tools return user-friendly string responses
- [ ] Tools handle API errors gracefully (FR-012)

---

### Phase A0: Agent Configuration

**Goal**: Configure OpenAI Agent with instructions and MCP tools

**Tasks**:
1. Create `backend/src/agent/__init__.py`
2. Create `backend/src/agent/instructions.py` — system prompt for the agent
3. Create `backend/src/agent/agent.py` — Agent setup with MCP server connection

**Agent Instructions** (key behaviors):
- Identify user intent (create, read, update, delete, toggle, search, filter, sort)
- Extract structured parameters from natural language
- Ask clarifying questions when input is ambiguous (FR-007)
- Request confirmation before destructive actions like delete (FR-013)
- Never expose internal details like API URLs or error traces (FR-015)
- Translate API responses into conversational messages (FR-011)
- Handle multi-intent by processing primary intent first (FR-008)

**Acceptance**:
- [ ] Agent initializes with MCP tools
- [ ] Agent has comprehensive system instructions
- [ ] Agent can process messages and return responses

---

### Phase A1: ChatKit Backend Endpoint

**Goal**: Create FastAPI endpoint for ChatKit protocol

**Tasks**:
1. Create ChatKit streaming endpoint at `POST /chatkit`
2. Handle message receiving with thread context
3. Run Agent with conversation history
4. Stream response back to ChatKit frontend
5. Handle errors gracefully (return user-friendly messages)

**Acceptance**:
- [ ] Endpoint receives ChatKit messages
- [ ] Agent processes messages and calls MCP tools
- [ ] Responses stream back to frontend
- [ ] Errors return "I'm having trouble connecting right now" (edge case)

---

### Phase C0: Frontend ChatKit Integration

**Goal**: Add ChatKit panel to the existing Todo web application

**Tasks**:
1. Install `@openai/chatkit-react` in frontend
2. Create `frontend/src/components/ChatPanel.tsx`
3. Configure ChatKit to connect to backend `/chatkit` endpoint
4. Add chat toggle button to main page header

**ChatPanel Implementation**:
```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export default function ChatPanel() {
  const { control } = useChatKit({
    api: { url: 'http://localhost:8000/chatkit' },
  });
  return <ChatKit control={control} className="h-full w-full" />;
}
```

**Acceptance**:
- [ ] ChatKit widget renders in the page
- [ ] Toggle button shows/hides chat panel
- [ ] Messages sent and responses received
- [ ] Typing indicator shown while processing (FR-004)

---

### Phase C1: Integration & Polish

**Goal**: Wire chatbot actions to task list refresh and ensure responsive design

**Tasks**:
1. Trigger React Query invalidation when chatbot performs actions (FR-020)
2. Ensure chat panel works on 320px to 1920px screens (SC-009)
3. Add responsive layout: side panel on desktop, full-screen overlay on mobile
4. Verify Phase II UI continues to function independently (FR-019)
5. Test both ChatKit panel and task list interoperability

**Acceptance**:
- [ ] Chatbot actions immediately update task list (SC-008)
- [ ] Chat panel responsive on all screen sizes (SC-009)
- [ ] Phase II features all working unchanged (FR-018, FR-019)
- [ ] Chat panel can be toggled without breaking task UI

---

### Phase T0: Acceptance Testing

**Goal**: Validate all user stories and success criteria

**Tasks**:
1. Test User Story 1: Create task via NL ("Add a task to buy groceries tomorrow")
2. Test User Story 2: List tasks ("Show me all my tasks")
3. Test User Story 3: Complete task ("Mark the groceries task as done")
4. Test User Story 4: Update task ("Change the groceries task to high priority")
5. Test User Story 5: Delete task with confirmation ("Delete the groceries task")
6. Test User Story 6: Search/Filter ("Show only high priority tasks")
7. Test User Story 7: Conversational context ("Show tasks", then "Delete the first one")
8. Test User Story 8: Chat UI integration (panel visible, messages work)
9. Test all edge cases (ambiguous input, missing task, service unavailable, empty message)

**Success Criteria Validation**:
- [ ] SC-001: Task creation via NL < 10 seconds
- [ ] SC-002: Intent identification accuracy >= 90%
- [ ] SC-003: Response time < 5 seconds
- [ ] SC-004: All CRUD operations available via chatbot
- [ ] SC-005: Delete always prompts for confirmation
- [ ] SC-006: Ambiguous input triggers clarification
- [ ] SC-007: Phase II UI functions identically
- [ ] SC-008: Chatbot actions visible in task list immediately
- [ ] SC-009: Chat works on 320px to 1920px

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI API rate limits | Medium | Add retry logic, show graceful error message |
| ChatKit protocol changes | Medium | Pin `@openai/chatkit-react` version |
| Agent intent misidentification | Medium | Comprehensive system instructions, fallback to clarification |
| MCP tool failures | Low | Error handling in each tool, user-friendly error messages |
| Latency > 5s for complex queries | Medium | Use GPT-4o-mini for faster responses if needed |

## Dependencies

### External Services
- OpenAI API (requires API key with GPT-4o access)
- Neon PostgreSQL (existing from Phase II)

### Python Packages (new)
- `openai-agents` — Agent SDK
- `mcp[cli]` — MCP server SDK
- `httpx` — Async HTTP client for API calls

### npm Packages (new)
- `@openai/chatkit-react` — Chat UI components

### Development Tools
- Python 3.11+ with venv (existing)
- Node.js 18+ (existing)

## Files to Create/Modify

### New Files
- `backend/src/mcp_tools/__init__.py`
- `backend/src/mcp_tools/server.py`
- `backend/src/mcp_tools/api_client.py`
- `backend/src/agent/__init__.py`
- `backend/src/agent/agent.py`
- `backend/src/agent/instructions.py`
- `frontend/src/components/ChatPanel.tsx`

### Modified Files
- `backend/requirements.txt` — Add new dependencies
- `backend/src/main.py` — Add ChatKit endpoint, initialize MCP server
- `frontend/package.json` — Add `@openai/chatkit-react`
- `frontend/src/app/page.tsx` — Add ChatPanel toggle

### Unchanged Files (Phase II — FR-018, FR-019)
- `backend/src/api/tasks.py`
- `backend/src/models/task.py`
- `backend/src/schemas/task.py`
- `backend/src/database.py`
- All Phase II frontend components

## Complexity Tracking

No constitution violations. Implementation stays within Phase III scope with 3 new backend modules and 1 new frontend component.

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown
2. Implement MCP tools (M0 → M1)
3. Implement Agent (A0 → A1)
4. Implement ChatKit frontend (C0 → C1)
5. Acceptance testing (T0)
6. Create PHR and commit
