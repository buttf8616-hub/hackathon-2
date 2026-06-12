# Phase 0 Research: Phase IV – Local Kubernetes Deployment

**Feature**: `004-phase4-k8s-deployment` | **Date**: 2026-02-12

## Technology Decisions

### Docker

**Choice**: Multi-stage Docker builds for both services.

- **Backend**: Python 3.11-slim base → install requirements → copy src → run uvicorn
- **Frontend**: Node 20-alpine → install deps → build Next.js → production stage with standalone output

**Rationale**: Multi-stage builds minimize image size by separating build dependencies from runtime. Python slim and Node alpine are the smallest official base images suitable for production.

### Kubernetes (Minikube)

**Choice**: Minikube with Docker driver on WSL2.

- Single-node cluster sufficient for local development
- `minikube docker-env` allows building images directly inside the cluster (no registry needed)
- NodePort for frontend external access, ClusterIP for backend internal access

**Rationale**: Minikube is the simplest local K8s solution. Docker driver is most compatible with WSL2.

### Helm 3

**Choice**: Single Helm chart (`helm/todo-app/`) packaging all services.

- One `values.yaml` for all configuration
- Templates for Deployments and Services
- No subcharts needed for this scale

**Rationale**: A single chart keeps the deployment simple. Subcharts add complexity with no benefit for 2 services.

### Service Architecture

**Decision**: 2 services, not 3.

The spec mentions 3 services (Frontend, Backend, Chatbot), but the Phase III implementation has the chatbot endpoint (`POST /api/chat`) integrated into the same FastAPI backend (`backend/src/main.py`). There is no separate chatbot service.

Therefore:
- `todo-backend` image: FastAPI server (REST API + Chat endpoint) on port 8000
- `todo-frontend` image: Next.js app on port 3000
- No `todo-chatbot` image needed

### AI Kubernetes Tools

- **kubectl-ai**: CLI plugin that translates natural language to kubectl commands. Install via `brew install kubectl-ai` or from GitHub releases.
- **kagent**: AI agent for Kubernetes debugging and diagnostics. Install via its official instructions.

Both are P3 priority — nice to have, not blocking deployment.

## Key Technical Findings

### Backend Container

- Uses `asyncpg` for database connections — requires `libpq` in the Docker image (available in python:3.11-slim)
- Loads `.env` via `python-dotenv` — in containers, we pass env vars directly (no `.env` file needed)
- `CORS_ORIGINS` must include the frontend's K8s service URL
- Health check available at `GET /health`

### Frontend Container

- Next.js 16.1.6 with Turbopack (dev only — production uses standard `next build` + `next start`)
- Needs `NEXT_PUBLIC_API_URL` at build time for API endpoint
- `next build` with `output: "standalone"` produces a minimal server suitable for containers
- Requires `next.config.ts` update to add `output: "standalone"`

### Inter-Service Communication in K8s

- Frontend calls backend at `http://todo-backend:8000` (K8s service name)
- Backend connects to external Neon PostgreSQL via `DATABASE_URL` (no change)
- CORS on backend must allow the frontend's origin

### Environment Variables Required

| Service | Variable | Source |
|---------|----------|--------|
| Backend | `DATABASE_URL` | Neon PostgreSQL connection string |
| Backend | `GEMINI_API_KEY` | Google Gemini API key |
| Backend | `GEMINI_MODEL` | Model name (default: `gemini-2.5-flash`) |
| Backend | `CORS_ORIGINS` | Frontend URL(s) |
| Frontend | `NEXT_PUBLIC_API_URL` | Backend K8s service URL |

## Risks Identified

1. **Next.js standalone output**: Must add `output: "standalone"` to `next.config.ts` — this is a minor code change
2. **WSL2 networking**: Minikube tunnel or NodePort needed for browser access from Windows host
3. **Image size**: Without multi-stage builds, Node images can be 1GB+. Standalone output + alpine keeps it under 200MB
