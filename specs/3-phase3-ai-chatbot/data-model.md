# Data Model: Phase III AI-Powered Todo Chatbot

**Date**: 2026-02-09
**Feature**: 3-phase3-ai-chatbot
**Status**: Complete

## Overview

Phase III introduces two new conceptual entities for the chatbot layer. The existing Task entity from Phase II remains unchanged.

## Entities

### ChatMessage (In-Memory Only)

Represents a single message in the conversation. Stored in browser session only — not persisted to database (FR-017).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| role | enum("user", "assistant") | Yes | Who sent the message |
| content | string | Yes | Message text |
| timestamp | datetime | Yes | When the message was sent |

**Notes**:
- Managed by ChatKit on the frontend
- Agent SDK manages conversation history internally
- No database table — session-scoped only
- Cleared on browser refresh/close

### MCP Tool Definition

Represents a structured tool callable by the AI agent via MCP protocol. Defined in code, not stored in database.

| Tool Name | Maps To | Description |
|-----------|---------|-------------|
| `create_task` | `POST /api/tasks` | Create a new task with title, description, priority, tags, due_date |
| `get_tasks` | `GET /api/tasks` | List tasks with optional filters (status, priority, tag, search, sort) |
| `get_task_by_id` | `GET /api/tasks/{id}` | Get a single task by ID |
| `update_task` | `PUT /api/tasks/{id}` | Update task fields (title, description, priority, tags, due_date, completed) |
| `delete_task` | `DELETE /api/tasks/{id}` | Delete a task permanently |
| `toggle_task` | `PATCH /api/tasks/{id}/toggle` | Toggle task completion status |

### Task (Unchanged from Phase II)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | integer (PK) | Auto | Auto-incrementing primary key |
| title | string (max 500) | Yes | Task title |
| description | string (max 2000) | No | Task description |
| completed | boolean | No | Completion status (default: false) |
| priority | enum (high/medium/low) | No | Priority level (default: medium) |
| tags | string[] | No | Array of tag strings |
| due_date | date | No | Due date (nullable) |
| created_at | datetime | Auto | Creation timestamp |
| updated_at | datetime | Auto | Last update timestamp |

## MCP Tool Schemas

### create_task

```json
{
  "name": "create_task",
  "description": "Create a new task in the todo list",
  "parameters": {
    "title": { "type": "string", "required": true, "description": "Task title" },
    "description": { "type": "string", "required": false, "description": "Task description" },
    "priority": { "type": "string", "enum": ["high", "medium", "low"], "required": false, "description": "Task priority" },
    "tags": { "type": "array", "items": { "type": "string" }, "required": false, "description": "Task tags" },
    "due_date": { "type": "string", "format": "date", "required": false, "description": "Due date (YYYY-MM-DD)" }
  }
}
```

### get_tasks

```json
{
  "name": "get_tasks",
  "description": "List tasks with optional filtering, searching, and sorting",
  "parameters": {
    "status": { "type": "string", "enum": ["all", "active", "completed"], "required": false, "description": "Filter by completion status" },
    "priority": { "type": "string", "enum": ["high", "medium", "low"], "required": false, "description": "Filter by priority" },
    "tag": { "type": "string", "required": false, "description": "Filter by tag" },
    "search": { "type": "string", "required": false, "description": "Search in title and description" },
    "sort_by": { "type": "string", "enum": ["created_at", "due_date", "priority", "title"], "required": false, "description": "Sort field" },
    "sort_order": { "type": "string", "enum": ["asc", "desc"], "required": false, "description": "Sort direction" }
  }
}
```

### get_task_by_id

```json
{
  "name": "get_task_by_id",
  "description": "Get a single task by its ID",
  "parameters": {
    "task_id": { "type": "integer", "required": true, "description": "Task ID" }
  }
}
```

### update_task

```json
{
  "name": "update_task",
  "description": "Update an existing task's fields",
  "parameters": {
    "task_id": { "type": "integer", "required": true, "description": "Task ID to update" },
    "title": { "type": "string", "required": false, "description": "New title" },
    "description": { "type": "string", "required": false, "description": "New description" },
    "priority": { "type": "string", "enum": ["high", "medium", "low"], "required": false, "description": "New priority" },
    "tags": { "type": "array", "items": { "type": "string" }, "required": false, "description": "New tags" },
    "due_date": { "type": "string", "format": "date", "required": false, "description": "New due date (YYYY-MM-DD)" },
    "completed": { "type": "boolean", "required": false, "description": "Completion status" }
  }
}
```

### delete_task

```json
{
  "name": "delete_task",
  "description": "Permanently delete a task. Use with caution.",
  "parameters": {
    "task_id": { "type": "integer", "required": true, "description": "Task ID to delete" }
  }
}
```

### toggle_task

```json
{
  "name": "toggle_task",
  "description": "Toggle a task's completion status (complete/incomplete)",
  "parameters": {
    "task_id": { "type": "integer", "required": true, "description": "Task ID to toggle" }
  }
}
```

## Relationships

```
ChatKit UI ──sends messages──▶ Agent (Agents SDK)
Agent ──calls tools──▶ MCP Server (FastMCP)
MCP Server ──HTTP requests──▶ REST API (FastAPI)
REST API ──SQL queries──▶ Task (PostgreSQL)
```
