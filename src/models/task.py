"""Task entity model for the Todo application."""

from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Task:
    """Represents a unit of work to be tracked.

    Attributes:
        id: Unique identifier (auto-generated, immutable)
        title: Short description of the task (required, max 500 chars)
        description: Detailed notes (optional, max 500 chars)
        completed: Whether the task is finished (default: False)
        created_at: When the task was created (auto-assigned, immutable)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)
