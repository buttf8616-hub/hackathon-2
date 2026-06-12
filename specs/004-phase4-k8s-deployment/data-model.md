# Phase 1 Data Model: Phase IV – Local Kubernetes Deployment

**Feature**: `004-phase4-k8s-deployment` | **Date**: 2026-02-12

## Infrastructure Model

Phase IV does not introduce new data models. The existing Todo/Task data model from Phase II remains unchanged. The Neon PostgreSQL database is external and untouched.

This document describes the **infrastructure model** — the Kubernetes resources and their relationships.

## Kubernetes Resource Model

```
┌─────────────────────────────────────────────────┐
│                 Helm Chart: todo-app             │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Deployment:       │  │ Service:              │  │
│  │ todo-backend      │  │ todo-backend          │  │
│  │ - image: todo-    │  │ - type: ClusterIP     │  │
│  │   backend:latest  │  │ - port: 8000          │  │
│  │ - port: 8000      │  │ - targetPort: 8000    │  │
│  │ - replicas: 1     │  │                       │  │
│  │ - env:            │  │                       │  │
│  │   DATABASE_URL    │  │                       │  │
│  │   GEMINI_API_KEY  │  │                       │  │
│  │   GEMINI_MODEL    │  │                       │  │
│  │   CORS_ORIGINS    │  │                       │  │
│  └──────────────────┘  └──────────────────────┘  │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Deployment:       │  │ Service:              │  │
│  │ todo-frontend     │  │ todo-frontend         │  │
│  │ - image: todo-    │  │ - type: NodePort      │  │
│  │   frontend:latest │  │ - port: 3000          │  │
│  │ - port: 3000      │  │ - targetPort: 3000    │  │
│  │ - replicas: 1     │  │ - nodePort: 30000     │  │
│  │ - env:            │  │                       │  │
│  │   NEXT_PUBLIC_    │  │                       │  │
│  │   API_URL         │  │                       │  │
│  └──────────────────┘  └──────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
         │                          │
         │ DATABASE_URL             │ Browser access
         ▼                          ▼
  ┌──────────────┐           ┌──────────────┐
  │ Neon         │           │ Developer's  │
  │ PostgreSQL   │           │ Browser      │
  │ (External)   │           │ (Windows)    │
  └──────────────┘           └──────────────┘
```

## Resource Specifications

### Deployments

| Field | todo-backend | todo-frontend |
|-------|-------------|---------------|
| Replicas | 1 (configurable) | 1 (configurable) |
| Image | `todo-backend:latest` | `todo-frontend:latest` |
| Port | 8000 | 3000 |
| Pull Policy | `Never` (local Minikube) | `Never` (local Minikube) |
| Restart Policy | Always | Always |

### Services

| Field | todo-backend | todo-frontend |
|-------|-------------|---------------|
| Type | ClusterIP | NodePort |
| Port | 8000 | 3000 |
| Target Port | 8000 | 3000 |
| Node Port | N/A | 30000 |

### Environment Variables

| Deployment | Variable | Default | Required |
|-----------|----------|---------|----------|
| todo-backend | DATABASE_URL | (none) | Yes |
| todo-backend | GEMINI_API_KEY | (none) | Yes |
| todo-backend | GEMINI_MODEL | `gemini-2.5-flash` | No |
| todo-backend | CORS_ORIGINS | `http://localhost:3000` | No |
| todo-frontend | NEXT_PUBLIC_API_URL | `http://todo-backend:8000` | No |

## Network Flow

1. **Browser → Frontend**: Via Minikube NodePort (30000) or `minikube service todo-frontend`
2. **Frontend → Backend**: Via K8s service name `http://todo-backend:8000` (client-side calls go through the browser, so the frontend needs to proxy or the backend must be externally accessible too)
3. **Backend → Neon DB**: Via external `DATABASE_URL` (internet access from Minikube)
4. **Backend → Gemini API**: Via external HTTPS (internet access from Minikube)

### Important: Client-Side API Calls

Since Next.js makes API calls from the **browser** (client-side), not from the server, the browser needs direct access to the backend. Two approaches:

**Option A (Recommended)**: Make backend also accessible via NodePort and set `NEXT_PUBLIC_API_URL` to the Minikube backend URL (e.g., `http://<minikube-ip>:30001`)

**Option B**: Use Next.js API routes as a proxy to forward requests from the Next.js server to the backend service internally

Option A is simpler and is the recommended approach.
