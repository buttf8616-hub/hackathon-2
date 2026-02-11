from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.database import get_session
from src.models.task import Priority, Task
from src.schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


# --- GET /api/tasks ---
@router.get("", response_model=list[TaskRead])
async def list_tasks(
    status: Optional[str] = Query(default=None),
    priority: Optional[str] = Query(default=None),
    tag: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc"),
    session: AsyncSession = Depends(get_session),
) -> list[Task]:
    statement = select(Task)

    # Status filter
    if status == "active":
        statement = statement.where(Task.completed == False)  # noqa: E712
    elif status == "completed":
        statement = statement.where(Task.completed == True)  # noqa: E712

    # Priority filter
    if priority:
        try:
            p = Priority(priority.lower())
            statement = statement.where(Task.priority == p)
        except ValueError:
            pass

    # Tag filter
    if tag:
        statement = statement.where(Task.tags.any(tag))

    # Search filter
    if search:
        search_pattern = f"%{search}%"
        statement = statement.where(
            Task.title.ilike(search_pattern) | Task.description.ilike(search_pattern)
        )

    # Sorting
    sort_column = {
        "created_at": Task.created_at,
        "due_date": Task.due_date,
        "priority": Task.priority,
        "title": Task.title,
    }.get(sort_by, Task.created_at)

    if sort_order == "asc":
        if sort_by == "due_date":
            statement = statement.order_by(sort_column.asc().nulls_last())
        else:
            statement = statement.order_by(sort_column.asc())
    else:
        if sort_by == "due_date":
            statement = statement.order_by(sort_column.desc().nulls_first())
        else:
            statement = statement.order_by(sort_column.desc())

    result = await session.exec(statement)
    return list(result.all())


# --- GET /api/tasks/{id} ---
@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    session: AsyncSession = Depends(get_session),
) -> Task:
    task = await session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# --- POST /api/tasks ---
@router.post("", response_model=TaskRead, status_code=201)
async def create_task(
    data: TaskCreate,
    session: AsyncSession = Depends(get_session),
) -> Task:
    task = Task(
        title=data.title.strip(),
        description=data.description,
        completed=data.completed,
        priority=data.priority,
        tags=data.tags,
        due_date=data.due_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


# --- PUT /api/tasks/{id} ---
@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    data: TaskUpdate,
    session: AsyncSession = Depends(get_session),
) -> Task:
    task = await session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "title" and isinstance(value, str):
            value = value.strip()
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


# --- DELETE /api/tasks/{id} ---
@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    session: AsyncSession = Depends(get_session),
) -> None:
    task = await session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await session.delete(task)
    await session.commit()


# --- PATCH /api/tasks/{id}/toggle ---
@router.patch("/{task_id}/toggle", response_model=TaskRead)
async def toggle_task(
    task_id: int,
    session: AsyncSession = Depends(get_session),
) -> Task:
    task = await session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task
