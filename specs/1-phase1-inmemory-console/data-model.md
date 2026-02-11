# Data Model: Phase I In-Memory Todo Console Application

**Date**: 2026-02-08
**Feature**: 1-phase1-inmemory-console
**Source**: spec.md (Key Entities section)

## Entity: Task

### Description

Represents a unit of work to be tracked by the user. Tasks are stored in memory and lost when the application exits.

### Fields

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| id | integer | Yes | Auto-generated | Unique, sequential starting from 1 | Immutable unique identifier |
| title | string | Yes | None | 1-500 characters, non-empty | Short description of the task |
| description | string | No | Empty string | 0-500 characters | Optional detailed notes |
| completed | boolean | Yes | False | True/False | Whether the task is finished |
| created_at | datetime | Yes | Auto-assigned | UTC timestamp | When the task was created |

### Field Rules

1. **id**:
   - Auto-incremented by the system
   - Never reused within a session
   - Immutable after creation
   - Starts at 1 for first task

2. **title**:
   - Required on task creation
   - Can be updated after creation
   - Must be non-empty (at least 1 character)
   - Maximum 500 characters

3. **description**:
   - Optional on task creation
   - Defaults to empty string if not provided
   - Can be updated after creation
   - Maximum 500 characters

4. **completed**:
   - Defaults to False on creation
   - Toggled via "Mark Complete" operation
   - Cannot be set directly (only toggled)

5. **created_at**:
   - Auto-assigned on task creation
   - Immutable after creation
   - Stored as UTC datetime
   - Used for display purposes only in Phase I

### State Transitions

```
[NEW] --add--> [INCOMPLETE] --toggle--> [COMPLETE] --toggle--> [INCOMPLETE]
                    |                        |
                    +--------delete----------+---> [DELETED]
```

### Validation Rules

| Operation | Validations |
|-----------|-------------|
| Create | title is non-empty, title.length <= 500, description.length <= 500 |
| Update | task exists, new title is non-empty if provided, field lengths <= 500 |
| Delete | task exists |
| Toggle | task exists |
| View | None |

### Error Messages (per spec)

| Condition | Message |
|-----------|---------|
| Task ID not found | "Task not found." |
| Empty title on create | "Title cannot be empty." |
| Invalid input (non-numeric ID) | "Invalid input. Please try again." |

### Display Format (View Tasks)

```
ID: 1 | Title: Buy groceries | Status: [ ] Incomplete
ID: 2 | Title: Call mom       | Status: [x] Complete
```

When no tasks exist:
```
No tasks available.
```

## Storage Model

### In-Memory Structure

```python
# Task storage
tasks: Dict[int, Task] = {}

# ID counter
next_id: int = 1
```

### Operations Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Add Task | O(1) | O(1) |
| Get Task by ID | O(1) | O(1) |
| View All Tasks | O(n) | O(1) |
| Update Task | O(1) | O(1) |
| Delete Task | O(1) | O(1) |
| Toggle Complete | O(1) | O(1) |

Where n = number of tasks in storage.

## Future Extensibility (Phase II+)

The data model is designed to accommodate future fields:

| Future Field | Type | Phase |
|--------------|------|-------|
| priority | enum (High/Medium/Low) | II |
| tags | list[string] | II |
| due_date | datetime | III |
| recurring | boolean | III |
| reminder | datetime | III |

These fields are NOT implemented in Phase I but the Task entity structure allows easy addition.
