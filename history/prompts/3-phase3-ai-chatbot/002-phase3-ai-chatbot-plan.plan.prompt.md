---
id: 002
title: Phase III AI Chatbot Plan
stage: plan
date: 2026-02-09
surface: agent
model: claude-opus-4-6
feature: 3-phase3-ai-chatbot
branch: 3-phase3-ai-chatbot
user: system
command: sp.plan
labels: ["plan", "phase3", "ai", "chatbot", "mcp", "openai", "agents", "chatkit"]
links:
  spec: specs/3-phase3-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/3-phase3-ai-chatbot/research.md
  - specs/3-phase3-ai-chatbot/data-model.md
  - specs/3-phase3-ai-chatbot/contracts/chat-api.yaml
  - specs/3-phase3-ai-chatbot/quickstart.md
  - specs/3-phase3-ai-chatbot/plan.md
tests:
  - N/A
---

## Prompt

/sp.plan — Generate the implementation plan for Phase III AI-Powered Todo Chatbot. The plan covers OpenAI ChatKit (frontend), OpenAI Agents SDK (backend orchestration), and Official MCP SDK (tool definitions wrapping Phase II REST APIs).

## Response snapshot

Generated comprehensive Phase III implementation plan with:

- **research.md**: Technology decisions for OpenAI ChatKit (`@openai/chatkit-react`), Agents SDK (`openai-agents`), MCP SDK (`mcp[cli]` with FastMCP), integration architecture (3-layer: ChatKit → Agent → MCP → REST API)
- **data-model.md**: ChatMessage entity (in-memory), 6 MCP tool schemas mapping to Phase II REST API endpoints (create_task, get_tasks, get_task_by_id, update_task, delete_task, toggle_task)
- **contracts/chat-api.yaml**: OpenAPI 3.1 spec for ChatKit streaming endpoint (`POST /chatkit`)
- **quickstart.md**: Setup instructions including new dependencies, env variables, usage examples
- **plan.md**: 7-phase implementation strategy (M0-M1: MCP, A0-A1: Agent, C0-C1: ChatKit, T0: Testing), architecture diagram, file listing, risk analysis

Constitution check passed all 7 gates. No violations detected.

## Outcome

- Impact: Complete Phase III implementation plan ready for task generation
- Tests: N/A (planning document)
- Files: 5 files created (research.md, data-model.md, chat-api.yaml, quickstart.md, plan.md)
- Next prompts: /sp.tasks to generate detailed task breakdown
- Reflection: Research confirmed all three SDKs are well-documented with clear integration patterns. ChatKit self-hosted backend mode enables custom agent logic.

## Evaluation notes (flywheel)

- Failure modes observed: Background research agent failed (web tools auto-denied in subagent); resolved by direct web search/fetch in main context
- Graders run and results (PASS/FAIL): PASS — Constitution check verified, all 5 artifacts generated
- Prompt variant (if applicable): Continuation from context-compacted session
- Next experiment (smallest change to try): N/A
