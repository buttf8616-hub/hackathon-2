# Tasks: Phase IV – Local Kubernetes Deployment

**Input**: Design documents from `/specs/004-phase4-k8s-deployment/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/helm-values.yaml, quickstart.md

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story from spec.md to enable independent implementation and testing.

**Architecture Note**: Backend and Chatbot are a single FastAPI service (see plan.md). Only 2 Docker images needed: `todo-backend` and `todo-frontend`. The spec references 3 services but the actual codebase has 2. Tasks D3 and R3 from user input are merged into D1/R1.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare project structure and configuration for containerization

- [x] T001 Update Next.js config to enable standalone output in `frontend/next.config.ts`
- [x] T002 Create `.dockerignore` for backend in `backend/.dockerignore`
- [x] T003 [P] Create `.dockerignore` for frontend in `frontend/.dockerignore`
- [x] T004 [P] Create Helm chart directory structure at `helm/todo-app/`

**Checkpoint**: Project structure ready for containerization and Helm chart creation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Dockerfiles that MUST be complete before ANY Kubernetes deployment can proceed

**CRITICAL**: No Helm or K8s work can begin until Docker images build successfully

- [x] T005 [US1] Create backend Dockerfile with multi-stage build in `backend/Dockerfile` — Python 3.11-slim base, install requirements.txt, copy src/, expose 8000, run uvicorn
- [x] T006 [P] [US1] Create frontend Dockerfile with multi-stage build in `frontend/Dockerfile` — Node 20-alpine, install deps, build Next.js standalone, expose 3000, run next start
- [ ] T007 [US1] Verify backend image builds successfully with `docker build -t todo-backend:latest ./backend` *(manual — requires Docker)*
- [ ] T008 [P] [US1] Verify frontend image builds successfully with `docker build -t todo-frontend:latest ./frontend` *(manual — requires Docker)*

**Checkpoint**: Both Docker images build without errors — containerization foundation complete

---

## Phase 3: User Story 1 — Containerize All Services (Priority: P1) MVP

**Goal**: Package Frontend and Backend into Docker containers that run correctly with environment variables

**Independent Test**: Build each image with `docker build`, run with `docker run` passing required env vars, verify each service responds on its port

### Implementation for User Story 1

- [ ] T009 [US1] Test backend container locally: `docker run -e DATABASE_URL=... -e GEMINI_API_KEY=... -p 8000:8000 todo-backend:latest` — verify `GET /health` returns 200
- [ ] T010 [US1] Test frontend container locally: `docker run -e NEXT_PUBLIC_API_URL=http://localhost:8000 -p 3000:3000 todo-frontend:latest` — verify page loads
- [ ] T011 [US1] Test both containers together with Docker network: create network, run backend on network, run frontend with backend URL pointing to container name, verify full app works
- [ ] T012 [US1] Verify no hardcoded localhost dependencies in container environment — all URLs configurable via env vars

**Checkpoint**: User Story 1 complete — both containers run standalone and communicate correctly via Docker networking

---

## Phase 4: User Story 2 — Deploy to Local Kubernetes via Helm (Priority: P1)

**Goal**: Deploy all services to Minikube using a single `helm install` command with proper service discovery

**Independent Test**: Start Minikube, build images, run `helm install todo-app ./helm/todo-app`, verify all pods Running and services accessible

### Helm Chart Creation

- [x] T013 [US2] Create Helm chart metadata in `helm/todo-app/Chart.yaml` — name: todo-app, version: 0.1.0, appVersion: 1.0.0
- [x] T014 [US2] Create Helm values file in `helm/todo-app/values.yaml` — define image names, tags, ports, replicas, env vars for backend and frontend per `contracts/helm-values.yaml`
- [x] T015 [P] [US2] Create backend Deployment template in `helm/todo-app/templates/backend-deployment.yaml` — replicas, image, port 8000, env vars (DATABASE_URL, GEMINI_API_KEY, GEMINI_MODEL, CORS_ORIGINS), imagePullPolicy: Never
- [x] T016 [P] [US2] Create backend Service template in `helm/todo-app/templates/backend-service.yaml` — type: NodePort, port 8000, nodePort 30001
- [x] T017 [P] [US2] Create frontend Deployment template in `helm/todo-app/templates/frontend-deployment.yaml` — replicas, image, port 3000, env vars (NEXT_PUBLIC_API_URL), imagePullPolicy: Never
- [x] T018 [P] [US2] Create frontend Service template in `helm/todo-app/templates/frontend-service.yaml` — type: NodePort, port 3000, nodePort 30000

### Minikube Deployment

- [ ] T019 [US2] Start Minikube cluster: `minikube start --driver=docker --cpus=2 --memory=4096`
- [ ] T020 [US2] Configure Docker to use Minikube daemon: `eval $(minikube docker-env)` and rebuild both images inside Minikube
- [ ] T021 [US2] Deploy with Helm: `helm install todo-app ./helm/todo-app --set backend.env.DATABASE_URL=<url> --set backend.env.GEMINI_API_KEY=<key> --set frontend.env.NEXT_PUBLIC_API_URL=http://<minikube-ip>:30001`
- [ ] T022 [US2] Verify all pods Running: `kubectl get pods` — both pods show 1/1 Running
- [ ] T023 [US2] Verify services created: `kubectl get services` — todo-backend (NodePort:30001), todo-frontend (NodePort:30000)
- [ ] T024 [US2] Verify frontend accessible via browser: `minikube service todo-frontend` or `http://<minikube-ip>:30000`
- [ ] T025 [US2] Verify inter-service communication: frontend can reach backend, backend connects to Neon DB, chat endpoint works

**Checkpoint**: User Story 2 complete — full system running in Kubernetes via Helm, accessible from browser

---

## Phase 5: User Story 3 — Manage Deployment Configuration via Helm Values (Priority: P2)

**Goal**: Customize deployment parameters by editing `values.yaml` without modifying K8s manifests directly

**Independent Test**: Modify values in `values.yaml`, run `helm upgrade`, verify changes take effect

### Implementation for User Story 3

- [ ] T026 [US3] Test `helm upgrade` with modified backend replica count: change replicas to 2, run `helm upgrade todo-app ./helm/todo-app`, verify 2 backend pods running
- [ ] T027 [US3] Test `helm upgrade` with modified environment variable: change GEMINI_MODEL, verify pod restarts with new value
- [ ] T028 [US3] Test `helm uninstall todo-app` — verify all K8s resources removed cleanly with `kubectl get all`
- [ ] T029 [US3] Test re-deploy: `helm install todo-app ./helm/todo-app` after uninstall — verify system comes back fully functional

**Checkpoint**: User Story 3 complete — Helm values drive all configuration, upgrade/uninstall work correctly

---

## Phase 6: User Story 4 — AI-Assisted Kubernetes Operations (Priority: P3)

**Goal**: Use kubectl-ai and kagent to query cluster state, debug issues, and manage resources with natural language

**Independent Test**: Install kubectl-ai, run a natural language query, verify correct results

### Implementation for User Story 4

- [ ] T030 [US4] Install kubectl-ai CLI tool and verify it works with `kubectl-ai "show all running pods"`
- [ ] T031 [US4] Use kubectl-ai to query cluster state: list services, describe deployments, check pod logs
- [ ] T032 [US4] Install kagent and verify it can connect to the Minikube cluster
- [ ] T033 [US4] Use kagent to analyze pod health and provide diagnostic information
- [ ] T034 [US4] Simulate a failure (e.g., set invalid image tag), use kubectl-ai/kagent to diagnose, then fix
- [ ] T035 [US4] Document AI tool usage: capture kubectl-ai commands, kagent analysis, and recommendations

**Checkpoint**: User Story 4 complete — AI tools demonstrated for cluster operations and debugging

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and cleanup

- [ ] T036 Run full end-to-end validation per `quickstart.md` — fresh Minikube start to fully running system
- [ ] T037 Verify all completion criteria from plan.md: images build, helm install works, pods Running in 2 min, app functional, helm uninstall clean, helm upgrade works
- [x] T038 [P] Update `backend/.env.example` with Kubernetes-relevant notes
- [x] T039 Verify no secrets are hardcoded in any Dockerfile, Helm template, or values.yaml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 — Docker validation
- **User Story 2 (Phase 4)**: Depends on Phase 3 — needs working images for K8s deployment
- **User Story 3 (Phase 5)**: Depends on Phase 4 — needs running Helm release for upgrade/uninstall
- **User Story 4 (Phase 6)**: Depends on Phase 4 — needs running cluster for AI tool operations
- **Polish (Phase 7)**: Depends on Phase 4 minimum (Phase 5, 6 optional)

### User Story Dependencies

- **US1 (Containerize)**: Foundation — all other stories depend on this
- **US2 (Deploy via Helm)**: Depends on US1 — needs Docker images
- **US3 (Helm Values Config)**: Depends on US2 — needs running Helm release
- **US4 (AI K8s Ops)**: Depends on US2 — needs running cluster (can parallel with US3)

### Within Each User Story

- Helm templates (T015–T018) marked [P] can run in parallel (different files)
- Minikube deployment tasks are sequential (T019 → T020 → T021 → T022...)
- US3 and US4 can proceed in parallel after US2 completes

### Parallel Opportunities

```text
Phase 1:  T002 ─┬─ T003 (parallel .dockerignore files)
                └─ T004 (parallel Helm dir)

Phase 2:  T005 ─┬─ T006 (parallel Dockerfiles)
          T007 ─┴─ T008 (parallel build verification)

Phase 4:  T015 ─┬─ T016 ─┬─ T017 ─┬─ T018 (all Helm templates parallel)
                └────────┴────────┘

Phase 5+6: US3 ─┬─ US4 (parallel after US2 completes)
                └──────
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T008)
3. Complete Phase 3: User Story 1 — Docker validation (T009–T012)
4. Complete Phase 4: User Story 2 — Helm + Minikube deployment (T013–T025)
5. **STOP and VALIDATE**: Full system running in K8s, accessible from browser
6. This is the MVP — all P1 stories complete

### Incremental Delivery

1. Setup + Foundational → Docker images ready
2. US1 → Containers verified locally → First increment
3. US2 → Full K8s deployment via Helm → MVP complete
4. US3 → Configuration management validated → Enhanced
5. US4 → AI tooling demonstrated → Full Phase IV complete
6. Polish → Documentation and final validation → Ship

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Backend+Chatbot are ONE service — no separate chatbot Dockerfile/Deployment needed
- Backend needs NodePort (not just ClusterIP) because frontend API calls are client-side (browser)
- All env vars must be passed via Helm `--set` or `values.yaml`, never hardcoded
- `imagePullPolicy: Never` is required for local Minikube images (no registry)
- Commit after each phase completion
