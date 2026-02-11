#!/usr/bin/env python3
"""Main entry point for the Todo application."""

from src.cli.menu import run_menu
from src.services.task_service import TaskService


def main() -> None:
    """Initialize and run the Todo application."""
    service = TaskService()
    run_menu(service)


if __name__ == "__main__":
    main()
