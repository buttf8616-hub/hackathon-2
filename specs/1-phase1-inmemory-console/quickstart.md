# Quickstart: Phase I In-Memory Todo Console Application

**Date**: 2026-02-08
**Feature**: 1-phase1-inmemory-console

## Prerequisites

- Python 3.11 or higher
- Terminal/Console access

## Installation

```bash
# Clone repository (if not already done)
git clone <repository-url>
cd hackathon-2

# Checkout feature branch
git checkout 1-phase1-inmemory-console

# (Optional) Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (none required for Phase I)
# pip install -r requirements.txt  # (empty for Phase I)
```

## Running the Application

```bash
# From repository root
python src/main.py
```

## Basic Usage

1. **Start the application** - You'll see the main menu:
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

2. **Add a task** - Select option 1 and enter task details:
   ```
   Enter task title: Buy groceries
   Enter task description (optional, press Enter to skip): Milk, eggs, bread
   Task added successfully! (ID: 1)
   ```

3. **View tasks** - Select option 2:
   ```
   === Your Tasks ===

   ID: 1 | Title: Buy groceries | Status: [ ] Incomplete

   Total: 1 task(s)
   ```

4. **Mark task complete** - Select option 5 and enter task ID:
   ```
   Enter task ID to toggle: 1
   Task marked as complete!
   ```

5. **Exit** - Select option 6:
   ```
   Goodbye!
   ```

## Running Tests

```bash
# From repository root
pytest tests/ -v
```

## Project Structure

```
src/
├── main.py              # Application entry point
├── models/
│   └── task.py          # Task dataclass
├── services/
│   └── task_service.py  # Task CRUD operations
└── cli/
    └── menu.py          # Console menu interface

tests/
├── unit/
│   ├── test_task.py
│   └── test_task_service.py
└── integration/
    └── test_cli.py
```

## Validation Checklist

After implementation, verify:

- [ ] Add task with title only works
- [ ] Add task with title and description works
- [ ] View tasks shows all tasks in ID order
- [ ] View tasks shows "No tasks available." when empty
- [ ] Update task changes title/description
- [ ] Update task preserves ID and created_at
- [ ] Delete task removes task
- [ ] Toggle changes incomplete to complete
- [ ] Toggle changes complete to incomplete
- [ ] Invalid task ID shows "Task not found."
- [ ] Invalid menu choice shows error and redisplays menu
- [ ] Exit terminates gracefully

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `python: command not found` | Use `python3` or verify Python installation |
| Permission denied | Ensure execute permissions on main.py |
| Module not found | Run from repository root directory |

## Next Steps

After Phase I is complete:
- Phase II: Full-Stack Web Application with persistence
- Run `/sp.specify` for Phase II specification
