"""Async HTTP client for Phase II REST API.

Wraps all 6 REST API endpoints so MCP tools can call them
without direct database access (FR-014).
"""

import os

import httpx

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")


async def get_tasks(
    status: str | None = None,
    priority: str | None = None,
    tag: str | None = None,
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str | None = None,
) -> list[dict]:
    """GET /api/tasks with optional query parameters."""
    params: dict[str, str] = {}
    if status:
        params["status"] = status
    if priority:
        params["priority"] = priority
    if tag:
        params["tag"] = tag
    if search:
        params["search"] = search
    if sort_by:
        params["sort_by"] = sort_by
    if sort_order:
        params["sort_order"] = sort_order

    async with httpx.AsyncClient(base_url=API_BASE_URL, timeout=10.0) as client:
        response = await client.get("/api/tasks", params=params)
        response.raise_for_status()
        return response.json()


async def get_task_by_id(task_id: int) -> dict:
    """GET /api/tasks/{task_id}."""
    async with httpx.AsyncClient(base_url=API_BASE_URL, timeout=10.0) as client:
        response = await client.get(f"/api/tasks/{task_id}")
        response.raise_for_status()
        return response.json()


async def create_task(data: dict) -> dict:
    """POST /api/tasks."""
    async with httpx.AsyncClient(base_url=API_BASE_URL, timeout=10.0) as client:
        response = await client.post("/api/tasks", json=data)
        response.raise_for_status()
        return response.json()


async def update_task(task_id: int, data: dict) -> dict:
    """PUT /api/tasks/{task_id}."""
    async with httpx.AsyncClient(base_url=API_BASE_URL, timeout=10.0) as client:
        response = await client.put(f"/api/tasks/{task_id}", json=data)
        response.raise_for_status()
        return response.json()


async def delete_task(task_id: int) -> bool:
    """DELETE /api/tasks/{task_id}. Returns True on success."""
    async with httpx.AsyncClient(base_url=API_BASE_URL, timeout=10.0) as client:
        response = await client.delete(f"/api/tasks/{task_id}")
        response.raise_for_status()
        return True


async def toggle_task(task_id: int) -> dict:
    """PATCH /api/tasks/{task_id}/toggle."""
    async with httpx.AsyncClient(base_url=API_BASE_URL, timeout=10.0) as client:
        response = await client.patch(f"/api/tasks/{task_id}/toggle")
        response.raise_for_status()
        return response.json()
