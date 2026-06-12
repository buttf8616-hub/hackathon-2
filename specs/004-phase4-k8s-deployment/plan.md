# Implementation Plan: Phase IV – Local Kubernetes Deployment

**Branch**: `004-phase4-k8s-deployment` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-phase4-k8s-deployment/spec.md`

## Summary

Containerize all three application services (Frontend, Backend, Chatbot) using Docker, deploy them to a local Minikube Kubernetes cluster via Helm charts, and validate using AI-assisted Kubernetes tools (kubectl-ai, kagent). The external Neon PostgreSQL database remains unchanged. All infrastructure is defined declaratively.

## Technical Context

**Language/Version**: Python 3.11 (Backend/Chatbot), Node.js 20+ (Frontend)
**Primary Dependencies**: Docker, Minikube, Helm 3, kubectl, kubectl-ai, kagent
**Storage**: External Neon PostgreSQL (unchanged from Phase III)
**Testing**: Manual validation via kubectl, helm, curl
**Target Platform**: Local Minikube Kubernetes cluster (Linux/WSL2)
**Project Type**: Web application (multi-service containerized deployment)
**Performance Goals**: All pods Running within 2 minutes of helm install
**Constraints**: Single-node Minikube cluster, minimum 2 CPU / 4GB RAM
**Scale/Scope**: 3 services, 1 replica each (default), single Helm chart

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Spec-Driven Development | PASS | Spec approved, plan follows spec |
| Incremental Evolution | PASS | Phase IV builds on Phase III without breaking existing functionality |
| Single Source of Truth | PASS | Spec and constitution are authoritative |
| Phase Order | PASS | Phase III complete, Phase IV is next |
| Backward Compatibility | PASS | No application logic changes, only containerization |
| No Manual Config in Containers | PASS | All config via environment variables and Helm values |
| Declarative Infrastructure | PASS | Dockerfiles + Helm charts define everything |
| Secrets via Env Vars | PASS | DATABASE_URL, GEMINI_API_KEY passed as env vars |
| Environment Parity | PASS | Helm values enable local/cloud parity for Phase V |

## Project Structure

### Documentation (this feature)

```text
specs/004-phase4-k8s-deployment/
├── plan.md              # This file
├── research.md          # Phase 0: technology research
├── data-model.md        # Phase 1: infrastructure model
├── quickstart.md        # Phase 1: deployment guide
├── contracts/           # Phase 1: Helm chart contract
│   └── helm-values.yaml # values.yaml contract definition
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (via /sp.tasks)
```

### Source Code (repository root)

```text
# Existing application code (unchanged)
backend/
├── Dockerfile           # NEW: Backend container definition
├── src/
│   ├── main.py
│   ├── agent/
│   ├── mcp_tools/
│   ├── api/
│   ├── models/
│   └── schemas/
├── requirements.txt
└── .env.example

frontend/
├── Dockerfile           # NEW: Frontend container definition
├── src/
│   ├── app/
│   └── components/
├── package.json
└── next.config.ts

# NEW: Helm chart for Kubernetes deployment
helm/
└── todo-app/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── backend-deployment.yaml
        ├── backend-service.yaml
        ├── frontend-deployment.yaml
        ├── frontend-service.yaml
        ├── chatbot-deployment.yaml
        └── chatbot-service.yaml
```

**Structure Decision**: Dockerfiles are placed in each service directory (backend/, frontend/). The Helm chart is at `helm/todo-app/` at the repository root. No chatbot-specific directory is needed since the chatbot runs as part of the backend (same FastAPI server serves both REST API and chat endpoints).

### Architecture Decision: Backend and Chatbot as Single Service

The Phase III implementation has the chatbot endpoint (`POST /chat`) integrated into the same FastAPI backend server (`backend/src/main.py`). Therefore:

- **`todo-backend`** Docker image serves BOTH the REST API and the chatbot endpoint
- No separate `todo-chatbot` Dockerfile or Deployment is needed
- This simplifies the architecture to **2 Docker images** and **2 Kubernetes Deployments** instead of 3
- The spec mentions 3 services, but the actual implementation has 2 (Backend+Chatbot combined, Frontend)

If a separate chatbot service is desired in the future, it can be extracted in Phase V.

## Execution Phases

### Phase A – Containerization (D1–D5)

| Task | Description | Output |
|------|-------------|--------|
| D1 | Create `backend/Dockerfile` — multi-stage build, Python 3.11, install requirements, copy src, expose port 8000, run uvicorn | `todo-backend` image |
| D2 | Create `frontend/Dockerfile` — multi-stage build, Node 20, install deps, build Next.js, expose port 3000, run next start | `todo-frontend` image |
| D3 | Configure environment variables via Docker ENV/ARG | Configurable containers |
| D4 | Test containers locally with `docker run` | Verified standalone services |

### Phase B – Helm Chart (H1–H4)

| Task | Description | Output |
|------|-------------|--------|
| H1 | Create `helm/todo-app/Chart.yaml` with chart metadata | Chart structure |
| H2 | Create `helm/todo-app/values.yaml` with all configurable values | Parameterized config |
| H3 | Create Helm templates for Deployments and Services | Reusable templates |
| H4 | Test `helm install` on Minikube | Running release |

### Phase C – Minikube Deployment & Validation (K1–K3)

| Task | Description | Output |
|------|-------------|--------|
| K1 | Start Minikube, configure Docker env | Running cluster |
| K2 | Build images inside Minikube's Docker | Images available in cluster |
| K3 | Deploy via Helm, validate all pods running | Full system in K8s |

### Phase D – AI-Assisted Validation (A1–A3)

| Task | Description | Output |
|------|-------------|--------|
| A1 | Install and use kubectl-ai for cluster queries | AI-assisted operations |
| A2 | Install and use kagent for pod analysis | AI-driven diagnostics |
| A3 | End-to-end validation of full system | Verified deployment |

## Risk Management

| Risk | Mitigation |
|------|------------|
| Service communication failure | Use Kubernetes service names for discovery |
| DB connection failure from cluster | Verify Neon DB is accessible from Minikube network |
| Image not found in cluster | Build images inside Minikube Docker env (`eval $(minikube docker-env)`) |
| CrashLoopBackOff | Check logs with `kubectl logs`, use kagent for diagnosis |
| Frontend can't reach backend | Configure NEXT_PUBLIC_API_URL to use K8s service name |
| WSL2/Minikube networking issues | Use `minikube tunnel` or NodePort for external access |

## Completion Criteria

Phase IV is complete when:

1. Both Docker images build successfully
2. `helm install todo-app ./helm/todo-app` deploys all services
3. All pods reach Running state within 2 minutes
4. Todo app is fully functional via browser (including AI chatbot)
5. `helm uninstall` cleanly removes all resources
6. `helm upgrade` applies configuration changes
7. kubectl-ai and kagent are demonstrated for cluster operations
8. No manual configuration inside running pods
