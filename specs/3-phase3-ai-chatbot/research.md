# Research: Phase III AI-Powered Todo Chatbot

**Date**: 2026-02-09
**Feature**: 3-phase3-ai-chatbot
**Status**: Complete

## Executive Summary

Phase III adds an AI-powered conversational chatbot to the existing Phase II full-stack web application. The chatbot uses OpenAI ChatKit for the UI, OpenAI Agents SDK for AI orchestration, and the Official MCP SDK for structured tool definitions that map to Phase II REST APIs. All technology choices are defined in the constitution.

## Research Topics

### 1. Chat UI Framework: OpenAI ChatKit

**Decision**: `@openai/chatkit-react` for React-based chat interface

**Package**: `npm install @openai/chatkit-react`

**Key Components**:
- `<ChatKit />` — Main chat UI component (batteries-included widget)
- `useChatKit()` — React hook returning a `control` object for managing ChatKit state

**Self-Hosted Backend Configuration**:
```javascript
const { control } = useChatKit({
  api: {
    url: 'http://localhost:8000/chatkit',
  },
});
```

**Rationale**:
- Specified in constitution for Phase III
- Production-ready chat interface out of the box
- Supports custom self-hosted backends (not locked to OpenAI Agent Builder)
- Built-in streaming, typing indicators, thread management
- React-native integration fits existing Next.js frontend

**Alternatives Considered**:
- Custom chat UI: More control but significant development effort
- Vercel AI SDK: Not specified in constitution

### 2. AI Agent Framework: OpenAI Agents SDK

**Decision**: `openai-agents` Python SDK for agent orchestration

**Package**: `pip install openai-agents`

**Key Classes**:
- `Agent` — LLM equipped with instructions and tools
- `Runner` — Executes agents synchronously (`run_sync`) or asynchronously (`run`)
- `MCPServerStreamableHttp` — Connect agent to HTTP-based MCP servers

**Basic Pattern**:
```python
from agents import Agent, Runner

agent = Agent(
    name="Todo Assistant",
    instructions="You help manage tasks...",
    mcp_servers=[mcp_server],
)
result = await Runner.run(agent, "Show my tasks")
print(result.final_output)
```

**Features Used**:
- Function tools via `@function_tool` decorator
- Built-in MCP server integration via `mcp_servers` parameter
- Automatic tool schema generation
- Conversation context via message history
- Tracing for debugging

**Rationale**:
- Specified in constitution for Phase III
- Lightweight framework with minimal abstractions
- Native MCP integration (tools auto-discovered via `list_tools()`)
- Provider-agnostic design
- Built-in tracing for debugging

**Alternatives Considered**:
- LangChain: Heavier framework, not specified in constitution
- Raw OpenAI API: More boilerplate, no MCP integration

### 3. Tool Protocol: Official MCP SDK

**Decision**: `mcp` Python SDK with `FastMCP` server

**Package**: `pip install "mcp[cli]"`

**Key Classes**:
- `FastMCP` — Server builder using Python type hints and docstrings
- `@mcp.tool()` — Decorator to define MCP tools with automatic schema generation

**Basic Pattern**:
```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("todo-tools")

@mcp.tool()
async def create_task(title: str, priority: str = "medium") -> str:
    """Create a new task with the given title and priority."""
    # Call Phase II REST API
    response = await http_client.post("/api/tasks", json={...})
    return f"Created task: {title}"
```

**Transport**: Streamable HTTP (for integration with Agents SDK via `MCPServerStreamableHttp`)

**Rationale**:
- Specified in constitution for Phase III
- Standardized tool protocol for LLM applications
- Automatic schema generation from Python type hints
- Clean separation: MCP tools wrap REST API calls
- Agent discovers tools automatically via `list_tools()`

**Alternatives Considered**:
- Direct function tools: Less standardized, no MCP protocol benefits
- Custom tool definitions: More maintenance overhead

### 4. Integration Architecture

**Decision**: Three-layer architecture

```
Frontend (ChatKit React)
    ↓ HTTP (ChatKit protocol)
Backend (ChatKit Python SDK + Agents SDK)
    ↓ MCP (Streamable HTTP)
MCP Server (FastMCP wrapping REST API calls)
    ↓ HTTP
Phase II REST API (FastAPI)
    ↓ SQL
Neon PostgreSQL
```

**Data Flow**:
1. User types message in ChatKit UI
2. Frontend sends message to backend ChatKit endpoint
3. Backend creates/continues Agent session with message
4. Agent reasons about intent and selects MCP tools
5. MCP tools call Phase II REST API endpoints
6. API responses flow back through MCP → Agent → ChatKit → UI
7. Task list in main UI refreshes to reflect changes

**Rationale**:
- Clean separation of concerns (UI, AI reasoning, tool execution, data)
- MCP server is reusable for future phases
- Phase II REST APIs remain unchanged (FR-018)
- Agent handles NLU and orchestration
- ChatKit handles all UI concerns

### 5. Chat Endpoint Design

**Decision**: FastAPI endpoint for ChatKit backend

The ChatKit Python SDK requires a backend endpoint that handles:
- Receiving user messages with thread context
- Streaming agent responses back to ChatKit
- Managing thread/session state

**Endpoint**: `POST /chatkit` — ChatKit streaming endpoint

**Rationale**:
- Integrates with existing FastAPI backend
- ChatKit protocol handles streaming natively
- Session context maintained per browser session
- No persistent storage needed (FR-017)

### 6. Environment & Configuration

**Decision**: Environment variables for API keys and configuration

**New Variables**:
- `OPENAI_API_KEY` — Required for OpenAI Agents SDK
- `OPENAI_MODEL` — Model to use (default: `gpt-4o`)

**Rationale**:
- Consistent with existing `.env` pattern from Phase II
- Secrets never hardcoded (constitution requirement)
- Easy to configure per environment

## Unresolved Items

None — all technology choices are defined by constitution.

## Future Considerations (Phase IV+)

- MCP server containerization for Kubernetes deployment
- Multiple agent handoff patterns for complex workflows
- Persistent conversation storage for cross-session context
- Voice input via OpenAI Realtime Agents
