---
id: "0005"
title: Local Dev Server Setup for Review
stage: general
date: 2026-06-07
surface: agent
model: claude-sonnet-4-6
feature: 004-phase4-k8s-deployment
branch: 004-phase4-k8s-deployment
user: fbutt042600@gmail.com
command: resume + read project + start localhost
labels: ["local-dev","devserver","cors","windows","troubleshooting"]
links:
  spec: specs/004-phase4-k8s-deployment/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/.env
tests:
  - manual: curl http://localhost:8000/health → 200
  - manual: curl http://localhost:3001/login → 200
  - manual: browser login flow → success
---

## Prompt

User requested: read the whole project first, then start localhost for review. Followed up with port conflict (another project on 3000), then "Cannot connect to server" on login, then confirmed it worked.

## Response snapshot

1. Read all project files: backend (FastAPI + Gemini agent), frontend (Next.js 16), Helm chart, specs, tasks.
2. Installed missing Python packages (`sqlmodel`, `asyncpg`, `openai-agents`, `bcrypt`, `python-jose`) globally.
3. Started backend on port 8000 (`python -m uvicorn src.main:app`).
4. Attempted frontend on port 3000 — conflicted with another project. Switched to port 3001.
5. Fixed Windows dev server startup: `npm install` to get `@next/swc-win32-x64-msvc` binary (node_modules were built on Linux/WSL).
6. Started Next.js on port 3001 using `node node_modules/next/dist/bin/next dev -p 3001`.
7. Fixed CORS: updated `backend/.env` to add `http://localhost:3001` to `CORS_ORIGINS`, restarted backend as detached Windows process via `Start-Process`.
8. Verified CORS preflight returns `access-control-allow-origin: http://localhost:3001`.
9. User confirmed login works.

## Outcome

- ✅ Impact: Both services running locally — frontend on http://localhost:3001, backend on http://localhost:8000
- 🧪 Tests: Manual curl + browser login flow confirmed working
- 📁 Files: backend/.env (CORS updated)
- 🔁 Next prompts: Proceed with Docker build and Minikube deployment (T007–T025)
- 🧠 Reflection: node_modules built on Linux need `npm install` re-run on Windows to get platform-specific SWC binaries; backend must be started as a detached Windows process (Start-Process) to survive PowerShell session end

## Evaluation notes (flywheel)

- Failure modes observed: WSL/Windows PID mismatch made killing processes difficult; Turbopack WASM fallback fails on Windows without native SWC binary; PowerShell `&` operator blocked in run_in_background mode
- Graders run and results (PASS/FAIL): health endpoint PASS, CORS preflight PASS, login flow PASS
- Prompt variant (if applicable): null
- Next experiment: Add `JWT_SECRET_KEY` to .env for production-grade auth
