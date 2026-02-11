import json
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from src.api.tasks import router as tasks_router
from src.database import init_db

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
        session_history.append({"role": msg.role, "content": msg.content})

    # Build input for the agent (full conversation)
    input_messages = [
        {"role": m["role"], "content": m["content"]}
        for m in session_history
    ]

    async def event_stream():
        try:
            from agents import Runner
            agent = get_agent()
            result = Runner.run_streamed(agent, input_messages)
            full_response = ""

            async for event in result.stream_events():
                # Extract text deltas from raw responses
                if event.type == "raw_response_event" and hasattr(event.data, "choices"):
                    for choice in event.data.choices:
                        if hasattr(choice, "delta") and hasattr(choice.delta, "content"):
                            content = choice.delta.content
                            if content:
                                full_response += content
                                yield f"data: {json.dumps({'type': 'delta', 'content': content})}\n\n"

            # If we got a final output but no streaming deltas, use the final output
            if not full_response:
                final = await result.final_output_as(str)
                if final:
                    full_response = final
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
        session_history.append({"role": msg.role, "content": msg.content})

    input_messages = [
        {"role": m["role"], "content": m["content"]}
        for m in session_history
    ]

    try:
        from agents import Runner
        agent = get_agent()
        result = await Runner.run(agent, input_messages)
        response_text = result.final_output

        session_history.append({"role": "assistant", "content": response_text})
        sessions[request.session_id] = session_history

        return JSONResponse(content={"response": response_text})
    except Exception:
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
