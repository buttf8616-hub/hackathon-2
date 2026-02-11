"""Task service for in-memory task management."""

from datetime import datetime
from typing import Optional

from src.models.task import Task


class TaskService:
    """Manages tasks in memory with CRUD operations.

    Attributes:
        _tasks: Dictionary storing tasks by ID
        _next_id: Counter for generating unique task IDs
    """

    def __init__(self) -> None:
        """Initialize the task service with empty storage."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """Add a new task to the storage.

        Args:
            title: Required task title
            description: Optional task description

        Returns:
            The newly created Task object
        """
        task = Task(
            id=self._next_id,
            title=title,
            description=description,
            completed=False,
            created_at=datetime.utcnow()
        )
        self._tasks[self._next_id] = task
        self._next_id += 1
        return task

    def get_all_tasks(self) -> list[Task]:
        """Get all tasks sorted by ID in ascending order.

        Returns:
            List of all tasks sorted by ID
        """
        return sorted(self._tasks.values(), key=lambda t: t.id)

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """Get a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task if found, None otherwise
        """
        return self._tasks.get(task_id)

    def update_task(
        self,
        task_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None
    ) -> Optional[Task]:
        """Update a task's title and/or description.

        Args:
            task_id: The ID of the task to update
            title: New title (None to keep current)
            description: New description (None to keep current)

        Returns:
            The updated Task if found, None otherwise
        """
        task = self._tasks.get(task_id)
        if task is None:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description

        return task

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by its ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if task was deleted, False if not found
        """
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def toggle_task_completion(self, task_id: int) -> Optional[Task]:
        """Toggle a task's completion status.

        Args:
            task_id: The ID of the task to toggle

        Returns:
            The updated Task if found, None otherwise
        """
        task = self._tasks.get(task_id)
        if task is None:
            return None

        task.completed = not task.completed
        return task
