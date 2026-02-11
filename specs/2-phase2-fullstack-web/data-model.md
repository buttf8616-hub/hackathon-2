# Data Model: Phase II Full-Stack Todo Web Application

**Feature**: 2-phase2-fullstack-web
**Created**: 2026-02-08
**Status**: Complete

## Entity Definitions

### Task Entity

The Task entity extends Phase I with additional organizational fields.

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | integer | Primary Key, Auto-increment | - | Unique identifier |
| `title` | string | Required, Max 500 chars | - | Task title |
| `description` | string | Optional, Max 2000 chars | `""` | Detailed notes |
| `completed` | boolean | Required | `false` | Completion status |
| `priority` | enum | Required, One of: HIGH, MEDIUM, LOW | `MEDIUM` | Task priority level |
| `tags` | string[] | Optional | `[]` | Categorization labels |
| `due_date` | date | Optional, Nullable | `null` | Target completion date |
| `created_at` | datetime | Required, Auto-set | UTC now | Creation timestamp |
| `updated_at` | datetime | Required, Auto-update | UTC now | Last modification timestamp |

### Priority Enum

```
HIGH = "high"
MEDIUM = "medium"
LOW = "low"
```

## Database Schema

### PostgreSQL Table Definition

```sql
CREATE TYPE priority_enum AS ENUM ('high', 'medium', 'low');

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT DEFAULT '',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority priority_enum NOT NULL DEFAULT 'medium',
    tags TEXT[] DEFAULT '{}',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Full-text search index
CREATE INDEX idx_tasks_search ON tasks USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

## SQLModel Definition (Python)

```python
from datetime import date, datetime
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, ARRAY, String

class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class TaskBase(SQLModel):
    title: str = Field(max_length=500)
    description: str = Field(default="", max_length=2000)
    completed: bool = Field(default=False)
    priority: Priority = Field(default=Priority.MEDIUM)
    tags: list[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    due_date: Optional[date] = Field(default=None)

class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: Optional[bool] = None
    priority: Optional[Priority] = None
    tags: Optional[list[str]] = None
    due_date: Optional[date] = None

class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime
```

## TypeScript Types (Frontend)

```typescript
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  tags: string[];
  due_date: string | null;  // ISO date string
  created_at: string;       // ISO datetime string
  updated_at: string;       // ISO datetime string
}

export interface TaskCreate {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  due_date?: string | null;
}
```

## Entity Relationships

Phase II is single-entity (Task only). Future phases may add:
- User → Task (one-to-many, Phase III+)
- Category → Task (many-to-many, future consideration)

## Migration from Phase I

Phase I Task fields map directly:
- `id` → `id` (unchanged)
- `title` → `title` (unchanged)
- `description` → `description` (unchanged)
- `completed` → `completed` (unchanged)
- `created_at` → `created_at` (unchanged)

New Phase II fields:
- `priority` → defaults to `MEDIUM`
- `tags` → defaults to `[]`
- `due_date` → defaults to `null`
- `updated_at` → set to `created_at` for migration

## Validation Rules

| Field | Validation |
|-------|------------|
| `title` | Required, 1-500 characters, trimmed |
| `description` | Optional, 0-2000 characters |
| `priority` | Must be valid enum value |
| `tags` | Each tag max 50 characters, max 10 tags |
| `due_date` | Must be valid date if provided |
