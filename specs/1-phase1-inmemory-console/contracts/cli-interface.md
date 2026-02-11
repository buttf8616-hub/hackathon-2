# CLI Interface Contract: Phase I In-Memory Todo Console Application

**Date**: 2026-02-08
**Feature**: 1-phase1-inmemory-console
**Type**: Console Menu Interface

## Overview

This contract defines the console interface behavior for the Phase I Todo application. Since Phase I is a console-only application (no REST API), this contract specifies the menu structure, input/output formats, and interaction patterns.

## Main Menu Contract

### Display Format

```
=== Todo Application ===

1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Task Completion
6. Exit

Enter your choice (1-6):
```

### Input Validation

| Input | Result |
|-------|--------|
| 1-6 | Execute corresponding operation |
| Any other number | Display "Invalid choice. Please enter 1-6." |
| Non-numeric | Display "Invalid input. Please enter a number." |
| Empty | Display "Invalid input. Please enter a number." |

### Post-Operation Behavior

All operations return to the main menu after completion (except Exit).

---

## Operation Contracts

### 1. Add Task

**Prompt Flow**:
```
Enter task title: <user input>
Enter task description (optional, press Enter to skip): <user input>
```

**Success Output**:
```
Task added successfully! (ID: <id>)
```

**Error Handling**:

| Condition | Output |
|-----------|--------|
| Empty title | "Error: Title cannot be empty." |
| Title > 500 chars | "Error: Title too long (max 500 characters)." |
| Description > 500 chars | "Error: Description too long (max 500 characters)." |

---

### 2. View Tasks

**Output Format (with tasks)**:
```
=== Your Tasks ===

ID: 1 | Title: Buy groceries | Status: [ ] Incomplete
ID: 2 | Title: Call mom | Status: [x] Complete
ID: 3 | Title: Finish report | Status: [ ] Incomplete

Total: 3 task(s)
```

**Output Format (no tasks)**:
```
No tasks available.
```

**Ordering**: Tasks displayed in ascending order by ID.

---

### 3. Update Task

**Prompt Flow**:
```
Enter task ID to update: <user input>
Current title: <current title>
Enter new title (press Enter to keep current): <user input>
Current description: <current description>
Enter new description (press Enter to keep current): <user input>
```

**Success Output**:
```
Task updated successfully!
```

**Error Handling**:

| Condition | Output |
|-----------|--------|
| Task ID not found | "Error: Task not found." |
| Non-numeric ID | "Error: Invalid input. Please enter a number." |
| New title empty (when provided) | "Error: Title cannot be empty." |
| Field > 500 chars | "Error: <field> too long (max 500 characters)." |

---

### 4. Delete Task

**Prompt Flow**:
```
Enter task ID to delete: <user input>
```

**Success Output**:
```
Task deleted successfully!
```

**Error Handling**:

| Condition | Output |
|-----------|--------|
| Task ID not found | "Error: Task not found." |
| Non-numeric ID | "Error: Invalid input. Please enter a number." |

---

### 5. Toggle Task Completion

**Prompt Flow**:
```
Enter task ID to toggle: <user input>
```

**Success Output (incomplete → complete)**:
```
Task marked as complete!
```

**Success Output (complete → incomplete)**:
```
Task marked as incomplete!
```

**Error Handling**:

| Condition | Output |
|-----------|--------|
| Task ID not found | "Error: Task not found." |
| Non-numeric ID | "Error: Invalid input. Please enter a number." |

---

### 6. Exit

**Output**:
```
Goodbye!
```

**Behavior**: Application terminates with exit code 0.

---

## Input/Output Standards

### Input Handling

1. All input read via `input()` function
2. Input stripped of leading/trailing whitespace
3. Numeric inputs parsed with error handling
4. Empty input for optional fields treated as "keep current" or "skip"

### Output Formatting

1. Error messages prefixed with "Error: "
2. Success messages end with "!" for clarity
3. Menu uses "===" separators for sections
4. Task status: `[ ]` for incomplete, `[x]` for complete

### Character Encoding

- UTF-8 for all input/output
- Standard ASCII for menu structure

---

## Session Behavior

1. Application starts with empty task list
2. All data lost on exit (in-memory only)
3. IDs never reset during session
4. Application never crashes on invalid input
5. Ctrl+C gracefully exits with "Goodbye!" message
