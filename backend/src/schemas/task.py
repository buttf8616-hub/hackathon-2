from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field

from src.models.task import Priority


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: str = Field(default="", max_length=2000)
    completed: bool = Field(default=False)
    priority: Priority = Field(default=Priority.MEDIUM)
    tags: list[str] = Field(default=[])
    due_date: Optional[date] = Field(default=None)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: Optional[bool] = None
    priority: Optional[Priority] = None
    tags: Optional[list[str]] = None
    due_date: Optional[date] = None


class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    completed: bool
    priority: Priority
    tags: list[str]
    due_date: Optional[date]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
