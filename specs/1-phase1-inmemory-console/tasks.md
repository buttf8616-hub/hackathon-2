# Tasks: Phase I In-Memory Todo Console Application

**Input**: Design documents from `/specs/1-phase1-inmemory-console/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/cli-interface.md

**Tests**: Tests are OPTIONAL for this feature - include only if explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below use single project structure per plan.md

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Project structure and basic configuration

- [x] T001 Create project directory structure: `src/`, `src/models/`, `src/services/`, `src/cli/`
- [x] T002 [P] Create `src/__init__.py` for package initialization
- [x] T003 [P] Create `src/models/__init__.py` for models package
- [x] T004 [P] Create `src/services/__init__.py` for services package
- [x] T005 [P] Create `src/cli/__init__.py` for cli package

**Checkpoint**: Project structure ready for implementation.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Define Task dataclass in `src/models/task.py` with fields: id (int), title (str), description (str), completed (bool), created_at (datetime)
- [x] T007 Implement TaskService class in `src/services/task_service.py` with in-memory storage (dict) and ID counter
- [x] T008 [P] Add `add_task(title, description)` method to TaskService in `src/services/task_service.py`
- [x] T009 [P] Add `get_all_tasks()` method to TaskService in `src/services/task_service.py`
- [x] T010 [P] Add `get_task_by_id(task_id)` method to TaskService in `src/services/task_service.py`
- [x] T011 [P] Add `update_task(task_id, title, description)` method to TaskService in `src/services/task_service.py`
- [x] T012 [P] Add `delete_task(task_id)` method to TaskService in `src/services/task_service.py`
- [x] T013 [P] Add `toggle_task_completion(task_id)` method to TaskService in `src/services/task_service.py`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 6 - Navigate Application (Priority: P1)

**Goal**: User can navigate the application using a clear menu system and exit gracefully.

**Independent Test**: Launch application, verify menu displays all 6 options, select each option, exit cleanly.

### Implementation for User Story 6

- [x] T014 [US6] Create main menu display function in `src/cli/menu.py` showing 6 options per CLI contract
- [x] T015 [US6] Implement menu input validation in `src/cli/menu.py` (valid: 1-6, invalid: error message)
- [x] T016 [US6] Implement main menu loop in `src/cli/menu.py` returning to menu after each operation
- [x] T017 [US6] Implement exit handler in `src/cli/menu.py` displaying "Goodbye!" and terminating gracefully
- [x] T018 [US6] Create application entry point in `src/main.py` that initializes TaskService and runs menu loop

**Checkpoint**: Application launches, displays menu, handles invalid input, exits cleanly.

---

## Phase 4: User Story 1 - Add New Task (Priority: P1)

**Goal**: User can create a new task with a title and optional description.

**Independent Test**: Select "Add Task", enter title "Buy groceries", verify task appears in list with unique ID.

### Implementation for User Story 1

- [x] T019 [US1] Implement add_task_handler function in `src/cli/menu.py` prompting for title and description
- [x] T020 [US1] Add title validation in add_task_handler: reject empty title, max 500 chars
- [x] T021 [US1] Add description validation in add_task_handler: max 500 chars, optional (empty allowed)
- [x] T022 [US1] Display success message with task ID after successful add in `src/cli/menu.py`
- [x] T023 [US1] Connect menu option 1 to add_task_handler in `src/cli/menu.py`

**Checkpoint**: User Story 1 fully functional - tasks can be added via menu.

---

## Phase 5: User Story 2 - View All Tasks (Priority: P1)

**Goal**: User can see all their tasks to understand what work is pending and completed.

**Independent Test**: Add several tasks, select "View Tasks", verify all display with ID, title, status.

### Implementation for User Story 2

- [x] T024 [US2] Implement view_tasks_handler function in `src/cli/menu.py`
- [x] T025 [US2] Format task display per CLI contract: "ID: X | Title: Y | Status: [ ]/[x]" in `src/cli/menu.py`
- [x] T026 [US2] Handle empty state: display "No tasks available." in `src/cli/menu.py`
- [x] T027 [US2] Display tasks in ascending order by ID and show total count in `src/cli/menu.py`
- [x] T028 [US2] Connect menu option 2 to view_tasks_handler in `src/cli/menu.py`

**Checkpoint**: User Stories 1 AND 2 functional - can add and view tasks.

---

## Phase 6: User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: User can toggle the completion status of a task to track progress.

**Independent Test**: Add task, toggle completion, verify status changes from incomplete to complete.

### Implementation for User Story 3

- [x] T029 [US3] Implement toggle_task_handler function in `src/cli/menu.py` prompting for task ID
- [x] T030 [US3] Add ID input validation: handle non-numeric input with error message in `src/cli/menu.py`
- [x] T031 [US3] Handle task not found: display "Error: Task not found." in `src/cli/menu.py`
- [x] T032 [US3] Display appropriate success message based on new state in `src/cli/menu.py`
- [x] T033 [US3] Connect menu option 5 to toggle_task_handler in `src/cli/menu.py`

**Checkpoint**: User Story 3 functional - can toggle task completion status.

---

## Phase 7: User Story 4 - Update Task (Priority: P3)

**Goal**: User can modify the title or description of an existing task.

**Independent Test**: Add task, update title/description, verify changes reflected while ID unchanged.

### Implementation for User Story 4

- [x] T034 [US4] Implement update_task_handler function in `src/cli/menu.py` prompting for task ID
- [x] T035 [US4] Display current title/description and prompt for new values (Enter to keep) in `src/cli/menu.py`
- [x] T036 [US4] Validate updated fields: title non-empty if provided, max 500 chars in `src/cli/menu.py`
- [x] T037 [US4] Handle task not found and non-numeric ID errors in `src/cli/menu.py`
- [x] T038 [US4] Display success message after update in `src/cli/menu.py`
- [x] T039 [US4] Connect menu option 3 to update_task_handler in `src/cli/menu.py`

**Checkpoint**: User Story 4 functional - can update existing tasks.

---

## Phase 8: User Story 5 - Delete Task (Priority: P3)

**Goal**: User can remove a task that is no longer relevant.

**Independent Test**: Add task, delete by ID, verify no longer appears in task list.

### Implementation for User Story 5

- [x] T040 [US5] Implement delete_task_handler function in `src/cli/menu.py` prompting for task ID
- [x] T041 [US5] Handle task not found and non-numeric ID errors in `src/cli/menu.py`
- [x] T042 [US5] Display success message after deletion in `src/cli/menu.py`
- [x] T043 [US5] Connect menu option 4 to delete_task_handler in `src/cli/menu.py`

**Checkpoint**: All user stories functional - complete CRUD operations available.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, and final validation

- [x] T044 Add graceful Ctrl+C handling to display "Goodbye!" and exit in `src/cli/menu.py`
- [x] T045 Ensure all error messages follow CLI contract format ("Error: ...") in `src/cli/menu.py`
- [x] T046 Strip whitespace from all user inputs in `src/cli/menu.py`
- [x] T047 Run quickstart.md validation checklist to verify all features
- [x] T048 Test with 100 tasks to verify performance per SC-006

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 6 (Phase 3)**: Depends on Foundational - menu framework needed first
- **User Story 1 (Phase 4)**: Depends on Phase 3 - needs menu to add task handler
- **User Story 2 (Phase 5)**: Depends on Phase 4 - should have tasks to view
- **User Story 3 (Phase 6)**: Depends on Phase 5 - needs tasks to toggle
- **User Story 4 (Phase 7)**: Depends on Phase 3 - can parallel with US3
- **User Story 5 (Phase 8)**: Depends on Phase 3 - can parallel with US3/US4
- **Polish (Phase 9)**: Depends on all user stories complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US6 (Menu) | Foundational | None (first) |
| US1 (Add) | US6 | None |
| US2 (View) | US1 | None |
| US3 (Toggle) | US2 | US4, US5 |
| US4 (Update) | US6 | US3, US5 |
| US5 (Delete) | US6 | US3, US4 |

### Within Each Phase

- Models before services (already in Foundational)
- Service methods can be parallel [P]
- CLI handlers before menu connections
- Core flow before error handling

### Parallel Opportunities

**Setup Phase**:
```bash
T002, T003, T004, T005 can run in parallel (all [P] marked)
```

**Foundational Phase**:
```bash
T008, T009, T010, T011, T012, T013 can run in parallel (all [P] marked)
```

**Note**: User story phases are sequential for logical flow, but US3/US4/US5 could technically run in parallel after US6 is complete if team capacity allows.

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 6 (Menu)
4. Complete Phase 4: User Story 1 (Add)
5. Complete Phase 5: User Story 2 (View)
6. **STOP and VALIDATE**: Test add/view flow independently
7. Deploy/demo if ready - this is a working MVP!

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. Add US6 → Menu works, can navigate
3. Add US1 → Can add tasks (MVP!)
4. Add US2 → Can view tasks (MVP complete!)
5. Add US3 → Can track progress
6. Add US4/US5 → Full CRUD complete
7. Polish → Production ready

### Suggested MVP Scope

**Minimum Viable Product = Phases 1-5 (T001-T028)**
- Setup + Foundational + Menu + Add + View
- User can add and view tasks
- Delivers immediate value

---

## Task Summary

| Phase | Task Count | Stories Covered |
|-------|------------|-----------------|
| Setup | 5 | - |
| Foundational | 8 | - |
| US6 (Menu) | 5 | Navigate Application |
| US1 (Add) | 5 | Add New Task |
| US2 (View) | 5 | View All Tasks |
| US3 (Toggle) | 5 | Mark Complete/Incomplete |
| US4 (Update) | 6 | Update Task |
| US5 (Delete) | 4 | Delete Task |
| Polish | 5 | Cross-cutting |
| **Total** | **48** | **6 User Stories** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests not generated - spec did not explicitly request TDD
