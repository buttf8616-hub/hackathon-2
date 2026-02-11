# Research: Phase I In-Memory Todo Console Application

**Date**: 2026-02-08
**Feature**: 1-phase1-inmemory-console
**Status**: Complete

## Executive Summary

Phase I requires a simple Python console application with in-memory task storage. All technology choices are straightforward with no significant ambiguity. This document records the research decisions made.

## Research Topics

### 1. Python Version Selection

**Decision**: Python 3.11+

**Rationale**:
- Python 3.11 offers significant performance improvements (10-60% faster)
- Improved error messages aid development
- `datetime` module fully supports timezone-aware timestamps
- Dataclasses available for clean Task entity modeling
- Wide availability and support

**Alternatives Considered**:
- Python 3.10: Viable but lacks performance improvements
- Python 3.12: Newer but less tested in production environments

### 2. Data Model Implementation

**Decision**: Python dataclass with auto-generated ID management

**Rationale**:
- `@dataclass` provides clean, readable entity definitions
- Built-in `__init__`, `__repr__`, `__eq__` methods
- Type hints for IDE support and documentation
- Immutable `id` and `created_at` via `field(init=False)`
- No external dependencies required

**Alternatives Considered**:
- Pydantic models: Overkill for Phase I; better suited for Phase II with validation needs
- Named tuples: Less flexible for updates
- Plain classes: More boilerplate code

### 3. In-Memory Storage Pattern

**Decision**: Dictionary with integer keys for O(1) lookup

**Rationale**:
- Dictionary provides O(1) task retrieval by ID
- Simple iteration for viewing all tasks
- Easy deletion by key
- Counter variable for auto-incrementing IDs
- Matches spec requirement for ascending ID display (sorted dict iteration)

**Alternatives Considered**:
- List with index: ID management more complex, deletion shifts indices
- OrderedDict: Not needed in Python 3.7+ (dicts maintain insertion order)

### 4. Console Input/Output Pattern

**Decision**: Menu-driven loop with input validation

**Rationale**:
- Simple `while True` loop with menu display
- `input()` for user interaction
- Try/except blocks for error handling
- Clear function separation: one function per menu option
- Matches spec requirement for numbered menu (1-6)

**Alternatives Considered**:
- argparse CLI: Not suited for interactive menu-based apps
- Rich library: Adds dependencies; save for Phase II enhancements
- Click: More suited for command-line tools than interactive menus

### 5. Testing Framework

**Decision**: pytest

**Rationale**:
- Standard Python testing framework
- Simple test discovery
- Clear assertion syntax
- Fixture support for test setup
- Good integration with IDEs and CI/CD

**Alternatives Considered**:
- unittest: More verbose, less Pythonic
- nose2: Less actively maintained

### 6. Project Structure

**Decision**: Single project structure with src/ and tests/

**Rationale**:
- Simple structure for Phase I scope
- Clear separation of source and tests
- Easy to extend for Phase II
- Follows Python packaging best practices

**Structure**:
```
src/
├── models/
│   └── task.py           # Task dataclass
├── services/
│   └── task_service.py   # Business logic
├── cli/
│   └── menu.py           # Console interface
└── main.py               # Entry point

tests/
├── unit/
│   ├── test_task.py
│   └── test_task_service.py
└── integration/
    └── test_cli.py
```

## Unresolved Items

None - all technical decisions are clear for Phase I scope.

## Future Considerations (Phase II+)

- Persistence layer (SQLModel/SQLAlchemy for database)
- Pydantic for API validation
- Rich library for enhanced console output
- Async support for API endpoints
