# Feature Specification: Phase I In-Memory Todo Console Application

**Feature Branch**: `1-phase1-inmemory-console`
**Created**: 2026-02-08
**Status**: Draft
**Input**: Phase I of the Evolution of Todo Project - Python-based, in-memory, console-driven Todo application

## Overview

This specification defines Phase I of the Evolution of Todo Project: a Python-based, in-memory, console-driven Todo application implementing foundational task management features. This phase serves as the foundation for future phases (web app, AI chatbot, Kubernetes deployment, cloud deployment).

### Goals

- Provide a minimal but complete Todo application
- Support core task lifecycle operations
- Ensure deterministic, spec-compliant behavior
- Serve as the foundation for future phases

### Non-Goals

- No persistent storage (data lost on exit)
- No web or graphical UI
- No AI or chatbot integration
- No concurrency or multi-user support

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add New Task (Priority: P1)

A user wants to create a new task with a title and optional description to track work they need to complete.

**Why this priority**: Task creation is the fundamental operation; without it, no other features are usable. This is the entry point for all task management.

**Independent Test**: Can be fully tested by launching the application, selecting "Add Task", entering a title, and verifying the task appears in the list with a unique ID and creation timestamp.

**Acceptance Scenarios**:

1. **Given** the main menu is displayed, **When** user selects "Add Task" and enters title "Buy groceries", **Then** a new task is created with unique ID, title "Buy groceries", completed=false, and current timestamp
2. **Given** user is adding a task, **When** user enters title "Meeting" and description "Team sync at 3pm", **Then** task is created with both title and description stored
3. **Given** user is adding a task, **When** user enters only a title without description, **Then** task is created successfully with empty description

---

### User Story 2 - View All Tasks (Priority: P1)

A user wants to see all their tasks to understand what work is pending and what has been completed.

**Why this priority**: Viewing tasks is essential for task management - users need visibility into their work items.

**Independent Test**: Can be fully tested by adding several tasks, selecting "View Tasks", and verifying all tasks display with ID, title, and completion status.

**Acceptance Scenarios**:

1. **Given** 3 tasks exist in the system, **When** user selects "View Tasks", **Then** all 3 tasks are displayed showing ID, title, and completion status
2. **Given** no tasks exist, **When** user selects "View Tasks", **Then** message "No tasks available." is displayed
3. **Given** multiple tasks exist, **When** user views tasks, **Then** tasks are displayed in ascending order by ID

---

### User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

A user wants to toggle the completion status of a task to track their progress.

**Why this priority**: Marking tasks complete is core to task management workflow but requires tasks to exist first.

**Independent Test**: Can be fully tested by adding a task, toggling its completion status, and verifying the status changes appropriately.

**Acceptance Scenarios**:

1. **Given** an incomplete task with ID 1 exists, **When** user selects "Toggle Completion" and enters ID 1, **Then** task is marked as complete
2. **Given** a complete task with ID 2 exists, **When** user selects "Toggle Completion" and enters ID 2, **Then** task is marked as incomplete
3. **Given** no task with ID 99 exists, **When** user enters ID 99, **Then** error message "Task not found." is displayed

---

### User Story 4 - Update Task (Priority: P3)

A user wants to modify the title or description of an existing task when requirements change.

**Why this priority**: Updates are less frequent than creation and viewing; users often complete tasks rather than modify them.

**Independent Test**: Can be fully tested by adding a task, updating its title/description, and verifying the changes are reflected while ID and creation time remain unchanged.

**Acceptance Scenarios**:

1. **Given** task with ID 1 and title "Old Title" exists, **When** user updates title to "New Title", **Then** task title changes to "New Title" and ID/timestamp remain unchanged
2. **Given** task with ID 1 exists, **When** user updates only description, **Then** title remains unchanged and description is updated
3. **Given** no task with ID 99 exists, **When** user attempts to update ID 99, **Then** error message "Task not found." is displayed

---

### User Story 5 - Delete Task (Priority: P3)

A user wants to remove a task that is no longer relevant.

**Why this priority**: Deletion is a cleanup operation; less critical than core task management.

**Independent Test**: Can be fully tested by adding a task, deleting it by ID, and verifying it no longer appears in the task list.

**Acceptance Scenarios**:

1. **Given** task with ID 1 exists, **When** user selects "Delete Task" and enters ID 1, **Then** task is permanently removed from the system
2. **Given** no task with ID 99 exists, **When** user enters ID 99, **Then** error message "Task not found." is displayed
3. **Given** task with ID 1 is deleted, **When** user views tasks, **Then** deleted task does not appear

---

### User Story 6 - Navigate Application (Priority: P1)

A user wants to navigate the application using a clear menu system and exit gracefully.

**Why this priority**: Navigation is fundamental to using any of the features.

**Independent Test**: Can be fully tested by launching the application, verifying menu displays, selecting each option, and exiting cleanly.

**Acceptance Scenarios**:

1. **Given** application starts, **When** main menu displays, **Then** all 6 options are visible (Add, View, Update, Delete, Toggle, Exit)
2. **Given** main menu is displayed, **When** user enters invalid option (e.g., "7" or "abc"), **Then** error message is shown and menu redisplays
3. **Given** main menu is displayed, **When** user selects "Exit", **Then** application terminates gracefully

---

### Edge Cases

- What happens when user enters non-numeric input for task ID? System displays error and returns to menu.
- What happens when user enters empty title for new task? System requires non-empty title.
- How does system handle very long titles/descriptions? System accepts reasonable text lengths (up to 500 characters).
- What happens when user cancels mid-operation? System returns to main menu without changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add tasks with a required title and optional description
- **FR-002**: System MUST auto-generate unique integer IDs for each task (sequential, starting from 1)
- **FR-003**: System MUST automatically set new tasks as incomplete (completed = false)
- **FR-004**: System MUST assign a creation timestamp when a task is created
- **FR-005**: System MUST display all tasks in ascending order by ID
- **FR-006**: System MUST display "No tasks available." when task list is empty
- **FR-007**: System MUST allow updating task title and/or description without changing ID or creation time
- **FR-008**: System MUST allow deleting tasks by ID, permanently removing them
- **FR-009**: System MUST toggle task completion status (incomplete to complete, complete to incomplete)
- **FR-010**: System MUST display "Task not found." when an invalid task ID is provided
- **FR-011**: System MUST provide a numbered menu with all operations (Add, View, Update, Delete, Toggle, Exit)
- **FR-012**: System MUST validate all user input and display friendly error messages for invalid input
- **FR-013**: System MUST return to main menu after any operation completes or errors
- **FR-014**: System MUST store all tasks in memory only (no persistence between sessions)
- **FR-015**: System MUST never crash on invalid input

### Key Entities

- **Task**: Represents a unit of work to be tracked
  - `id` (integer, unique, auto-generated): Unique identifier for the task
  - `title` (string, required): Short description of the task (max 500 characters)
  - `description` (string, optional): Detailed notes about the task (max 500 characters)
  - `completed` (boolean, required): Whether the task is finished (default: false)
  - `created_at` (datetime, required): When the task was created (auto-assigned)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a task in under 30 seconds from menu selection to confirmation
- **SC-002**: Users can view their entire task list in a single screen interaction
- **SC-003**: All menu operations complete and return to menu within 1 second (excluding user input time)
- **SC-004**: 100% of invalid inputs result in a helpful error message rather than a crash
- **SC-005**: Users can complete a full task lifecycle (add, view, toggle complete, delete) in under 2 minutes
- **SC-006**: Application handles 100 tasks without performance degradation

## Assumptions

- Console/terminal environment with standard input/output
- Single user operating the application at a time
- Task IDs never reset during a session (only start fresh on new session)
- Users understand basic menu-driven console interfaces
- English language for all user-facing messages

## Future Compatibility Notes

- Data model designed to be extensible for persistence (Phase II)
- Task entity structure supports additional fields for priorities, tags, due dates (Phase II+)
- Service layer pattern enables future API integration (Phase III)
- No hard dependencies on console I/O in core logic

## Compliance Statement

This specification is authoritative per the Todo Evolution Project Constitution. Any deviation requires updating this document and regenerating the code via Claude Code.
