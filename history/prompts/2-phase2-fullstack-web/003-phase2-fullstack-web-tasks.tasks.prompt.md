---
id: 003
title: Phase II Full-Stack Web Tasks
stage: tasks
date: 2026-02-09
surface: agent
model: claude-opus-4-6
feature: 2-phase2-fullstack-web
branch: 2-phase2-fullstack-web
user: system
command: sp.tasks
labels: ["tasks", "phase2", "fullstack", "web", "fastapi", "nextjs", "backend", "frontend"]
links:
  spec: specs/2-phase2-fullstack-web/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/2-phase2-fullstack-web/tasks.md
tests:
  - N/A
---

## Prompt

/sp.tasks — Generate an actionable, dependency-ordered tasks.md for Phase II Full-Stack Todo Web Application based on spec.md, plan.md, data-model.md, contracts/api-spec.yaml, and research.md. User provided a detailed task breakdown with B1-B9 backend tasks, F1-F10 frontend tasks, and I1-I3 integration tasks as input context.

## Response snapshot

Generated comprehensive tasks.md with 73 tasks across 13 phases, organized by user story:

- **Phase 1 (Setup)**: 7 tasks — monorepo structure, backend dependencies, frontend Next.js init
- **Phase 2 (Foundational)**: 9 tasks — SQLModel entity, database connection, FastAPI shell, React Query provider, layout
- **Phase 3 (US9 Persistence)**: 4 tasks — DB CRUD functions, persistence verification
- **Phase 4 (US1 View)**: 9 tasks — GET endpoints, TaskCard, TaskList, EmptyState, PriorityBadge, hooks, page wiring
- **Phase 5 (US2 Add)**: 5 tasks — POST endpoint, TaskForm, useCreateTask, page integration
- **Phase 6 (US5 Toggle)**: 3 tasks — PATCH toggle endpoint, useToggleTask, checkbox wiring
- **Phase 7 (US3 Edit)**: 5 tasks — PUT endpoint, useUpdateTask, edit mode, wiring
- **Phase 8 (US4 Delete)**: 5 tasks — DELETE endpoint, ConfirmDialog, useDeleteTask, wiring
- **Phase 9 (US6 Filter)**: 6 tasks — status/priority/tag query params, FilterBar, hook update
- **Phase 10 (US8 Search)**: 4 tasks — search query param, debounced input, empty results
- **Phase 11 (US7 Sort)**: 4 tasks — sort_by/sort_order params, sort dropdown, null handling
- **Phase 12 (Polish)**: 7 tasks — error handling, loading states, toasts, responsive design
- **Phase 13 (Integration)**: 5 tasks — E2E validation against 8 success criteria

Key design decisions:
- US9 (Persistence) placed before US1 (View) since DB functions underpin all endpoints
- Phases 5-11 can execute in parallel after Phase 4 completes
- MVP scope: Phases 1-5 (Setup + Foundation + Persistence + View + Add)
- All tasks follow strict checklist format with IDs, [P] markers, [Story] labels, and file paths

## Outcome

- Impact: Complete task breakdown enabling systematic Phase II implementation
- Tests: N/A (task generation, not implementation)
- Files: 1 file created (specs/2-phase2-fullstack-web/tasks.md)
- Next prompts: /sp.implement to execute all 73 tasks
- Reflection: Organizing by user story with persistence as the first story ensures each subsequent phase builds on a working foundation

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS — All 73 tasks follow checklist format, story labels present, file paths included, dependency graph is acyclic
- Prompt variant (if applicable): User provided pre-structured B1-B9/F1-F10/I1-I3 breakdown as input context
- Next experiment (smallest change to try): N/A
