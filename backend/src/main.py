import json
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from src.api.auth import router as auth_router
from src.api.tasks import router as tasks_router
from src.database import init_db
from src.models.user import User  # noqa: F401 — ensure table is created

load_dotenv()


# --- Phase III: In-memory session store (FR-016, FR-017) ---

sessions: dict[str, list[dict]] = {}


# --- Lazy agent initialization (avoids slow import at startup) ---

_agent = None


def get_agent():
    global _agent
    if _agent is None:
        from src.agent.agent import create_agent
        _agent = create_agent()
    return _agent


# --- Request/Response models ---

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    session_id: str = "default"


# --- FastAPI App ---

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    await init_db()
    yield


app = FastAPI(
    title="Todo API - Phase II & III",
    version="2.0.0",
    lifespan=lifespan,
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tasks_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}


# --- Phase III: Chat Endpoint (T010) ---

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest) -> StreamingResponse:
    """Chat endpoint for AI chatbot. Streams SSE responses."""

    # Build conversation history from session + new messages
    session_history = sessions.get(request.session_id, [])

    # Add new messages to history
    for msg in request.messages:
        if msg.role in ("user", "assistant") and msg.content.strip():
            session_history.append({"role": msg.role, "content": msg.content})

    # Build input for the agent — only clean user/assistant messages
    input_messages = [
        {"role": m["role"], "content": m["content"]}
        for m in session_history
        if m.get("role") in ("user", "assistant") and m.get("content", "").strip()
    ]

    async def event_stream():
        try:
            from agents import Runner
            agent = get_agent()
            result = Runner.run_streamed(agent, input_messages)
            full_response = ""

            async for event in result.stream_events():
                if event.type == "raw_response_event":
                    data = event.data
                    if type(data).__name__ == "ResponseTextDeltaEvent" and hasattr(data, "delta"):
                        content = data.delta
                        if content:
                            full_response += content
                            yield f"data: {json.dumps({'type': 'delta', 'content': content})}\n\n"

            # If we got no streaming deltas, use the final output
            if not full_response and result.final_output:
                full_response = result.final_output
                yield f"data: {json.dumps({'type': 'delta', 'content': full_response})}\n\n"

            # Store assistant response in session
            if full_response:
                session_history.append({"role": "assistant", "content": full_response})
                sessions[request.session_id] = session_history

            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            error_msg = "I'm having trouble connecting right now. Please try again in a moment."
            yield f"data: {json.dumps({'type': 'error', 'content': error_msg})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/api/chat/sync")
async def chat_sync_endpoint(request: ChatRequest) -> JSONResponse:
    """Non-streaming chat endpoint as fallback."""
    session_history = sessions.get(request.session_id, [])

    for msg in request.messages:
        if msg.role in ("user", "assistant") and msg.content.strip():
            session_history.append({"role": msg.role, "content": msg.content})

    input_messages = [
        {"role": m["role"], "content": m["content"]}
        for m in session_history
        if m.get("role") in ("user", "assistant") and m.get("content", "").strip()
    ]

    try:
        from agents import Runner
        agent = get_agent()
        result = await Runner.run(agent, input_messages)
        response_text = result.final_output or "Done! Is there anything else you'd like me to help with?"

        session_history.append({"role": "assistant", "content": response_text})
        sessions[request.session_id] = session_history

        return JSONResponse(content={"response": response_text})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"response": "I'm having trouble connecting right now. Please try again in a moment."},
        )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
