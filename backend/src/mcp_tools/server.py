"""MCP tool definitions wrapping Phase II REST API endpoints.

Each tool maps 1:1 to a REST API endpoint, using the api_client
module for HTTP communication. Tools return user-friendly strings
that the agent converts into conversational responses.
"""

from __future__ import annotations

import httpx

from agents import function_tool

from src.mcp_tools import api_client


@function_tool
async def create_task(
    title: str,
    description: str = "",
    priority: str = "medium",
    tags: list[str] = [],
    due_date: str | None = None,
) -> str:
    """Create a new task in the todo list.

    Args:
        title: The task title (required).
        description: Optional task description.
        priority: Priority level - "high", "medium", or "low". Defaults to "medium".
        tags: Optional list of tag strings.
        due_date: Optional due date in YYYY-MM-DD format.
    """
    data: dict = {
        "title": title,
        "description": description,
        "priority": priority,
        "tags": tags,
    }
    if due_date:
        data["due_date"] = due_date

    try:
        result = await api_client.create_task(data)
        parts = [f"Created task: \"{result['title']}\" (ID: {result['id']})"]
        if result.get("priority"):
            parts.append(f"Priority: {result['priority']}")
        if result.get("due_date"):
            parts.append(f"Due: {result['due_date']}")
        if result.get("tags"):
            parts.append(f"Tags: {', '.join(result['tags'])}")
        return ". ".join(parts)
    except httpx.HTTPStatusError as e:
        return f"Failed to create task: {e.response.status_code}"
    except Exception:
        return "Failed to create task due to a connection error."


@function_tool
async def get_tasks(
    status: str | None = None,
    priority: str | None = None,
    tag: str | None = None,
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str | None = None,
) -> str:
    """List tasks with optional filtering, searching, and sorting.

    Args:
        status: Filter by status - "all", "active", or "completed".
        priority: Filter by priority - "high", "medium", or "low".
        tag: Filter by a specific tag.
        search: Search text in task title and description.
        sort_by: Sort field - "created_at", "due_date", "priority", or "title".
        sort_order: Sort direction - "asc" or "desc".
    """
    try:
        tasks = await api_client.get_tasks(
            status=status,
            priority=priority,
            tag=tag,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
        )
        if not tasks:
            return "No tasks found."

        lines = [f"Found {len(tasks)} task(s):\n"]
        for i, task in enumerate(tasks, 1):
            status_icon = "done" if task["completed"] else "pending"
            line = f"{i}. [{status_icon}] \"{task['title']}\" (ID: {task['id']}, Priority: {task['priority']})"
            if task.get("due_date"):
                line += f" — Due: {task['due_date']}"
            if task.get("tags"):
                line += f" — Tags: {', '.join(task['tags'])}"
            lines.append(line)
        return "\n".join(lines)
    except Exception:
        return "Failed to retrieve tasks due to a connection error."


@function_tool
async def get_task_by_id(task_id: int) -> str:
    """Get a single task by its ID.

    Args:
        task_id: The ID of the task to retrieve.
    """
    try:
        task = await api_client.get_task_by_id(task_id)
        status_text = "Completed" if task["completed"] else "Pending"
        parts = [
            f"Task #{task['id']}: \"{task['title']}\"",
            f"Status: {status_text}",
            f"Priority: {task['priority']}",
        ]
        if task.get("description"):
            parts.append(f"Description: {task['description']}")
        if task.get("due_date"):
            parts.append(f"Due: {task['due_date']}")
        if task.get("tags"):
            parts.append(f"Tags: {', '.join(task['tags'])}")
        parts.append(f"Created: {task['created_at']}")
        return "\n".join(parts)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return f"Task with ID {task_id} not found."
        return f"Failed to get task: {e.response.status_code}"
    except Exception:
        return "Failed to retrieve task due to a connection error."


@function_tool
async def update_task(
    task_id: int,
    title: str | None = None,
    description: str | None = None,
    priority: str | None = None,
    tags: list[str] | None = None,
    due_date: str | None = None,
    completed: bool | None = None,
) -> str:
    """Update an existing task's fields. Only provided fields will be changed.

    Args:
        task_id: The ID of the task to update (required).
        title: New title for the task.
        description: New description for the task.
        priority: New priority - "high", "medium", or "low".
        tags: New list of tags (replaces existing tags).
        due_date: New due date in YYYY-MM-DD format.
        completed: Set completion status directly.
    """
    data: dict = {}
    if title is not None:
        data["title"] = title
    if description is not None:
        data["description"] = description
    if priority is not None:
        data["priority"] = priority
    if tags is not None:
        data["tags"] = tags
    if due_date is not None:
        data["due_date"] = due_date
    if completed is not None:
        data["completed"] = completed

    if not data:
        return "No fields to update. Please specify what to change."

    try:
        result = await api_client.update_task(task_id, data)
        updated_fields = ", ".join(data.keys())
        return f"Updated task #{result['id']} \"{result['title']}\". Changed: {updated_fields}."
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return f"Task with ID {task_id} not found."
        return f"Failed to update task: {e.response.status_code}"
    except Exception:
        return "Failed to update task due to a connection error."


@function_tool
async def delete_task(task_id: int) -> str:
    """Permanently delete a task. This action cannot be undone.

    Args:
        task_id: The ID of the task to delete (required).
    """
    try:
        await api_client.delete_task(task_id)
        return f"Task #{task_id} has been permanently deleted."
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return f"Task with ID {task_id} not found."
        return f"Failed to delete task: {e.response.status_code}"
    except Exception:
        return "Failed to delete task due to a connection error."


@function_tool
async def toggle_task(task_id: int) -> str:
    """Toggle a task's completion status between complete and incomplete.

    Args:
        task_id: The ID of the task to toggle (required).
    """
    try:
        result = await api_client.toggle_task(task_id)
        new_status = "completed" if result["completed"] else "incomplete"
        return f"Task #{result['id']} \"{result['title']}\" is now {new_status}."
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return f"Task with ID {task_id} not found."
        return f"Failed to toggle task: {e.response.status_code}"
    except Exception:
        return "Failed to toggle task due to a connection error."


# All tools as a list for agent registration
ALL_TOOLS = [
    create_task,
    get_tasks,
    get_task_by_id,
    update_task,
    delete_task,
    toggle_task,
]
