"""Console menu interface for the Todo application."""

import signal
import sys
from typing import NoReturn

from src.services.task_service import TaskService

# Constants
MAX_TITLE_LENGTH = 500
MAX_DESCRIPTION_LENGTH = 500


def display_menu() -> None:
    """Display the main menu with all options."""
    print("\n=== Todo Application ===\n")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Toggle Task Completion")
    print("6. Exit")
    print()


def get_menu_choice() -> str:
    """Get and validate menu choice from user.

    Returns:
        Valid menu choice (1-6) or empty string for invalid input
    """
    try:
        choice = input("Enter your choice (1-6): ").strip()
        if choice in ("1", "2", "3", "4", "5", "6"):
            return choice
        if choice.isdigit():
            print("Invalid choice. Please enter 1-6.")
        else:
            print("Invalid input. Please enter a number.")
        return ""
    except EOFError:
        return "6"


def add_task_handler(service: TaskService) -> None:
    """Handle adding a new task.

    Args:
        service: The TaskService instance
    """
    try:
        title = input("Enter task title: ").strip()

        # Validate title
        if not title:
            print("Error: Title cannot be empty.")
            return
        if len(title) > MAX_TITLE_LENGTH:
            print(f"Error: Title too long (max {MAX_TITLE_LENGTH} characters).")
            return

        description = input(
            "Enter task description (optional, press Enter to skip): "
        ).strip()

        # Validate description
        if len(description) > MAX_DESCRIPTION_LENGTH:
            print(
                f"Error: Description too long (max {MAX_DESCRIPTION_LENGTH} characters)."
            )
            return

        task = service.add_task(title, description)
        print(f"Task added successfully! (ID: {task.id})")

    except EOFError:
        print("\nOperation cancelled.")


def view_tasks_handler(service: TaskService) -> None:
    """Handle viewing all tasks.

    Args:
        service: The TaskService instance
    """
    tasks = service.get_all_tasks()

    if not tasks:
        print("No tasks available.")
        return

    print("\n=== Your Tasks ===\n")
    for task in tasks:
        status = "[x]" if task.completed else "[ ]"
        status_text = "Complete" if task.completed else "Incomplete"
        print(f"ID: {task.id} | Title: {task.title} | Status: {status} {status_text}")

    print(f"\nTotal: {len(tasks)} task(s)")


def update_task_handler(service: TaskService) -> None:
    """Handle updating an existing task.

    Args:
        service: The TaskService instance
    """
    try:
        task_id_str = input("Enter task ID to update: ").strip()

        # Validate ID input
        try:
            task_id = int(task_id_str)
        except ValueError:
            print("Error: Invalid input. Please enter a number.")
            return

        # Check if task exists
        task = service.get_task_by_id(task_id)
        if task is None:
            print("Error: Task not found.")
            return

        # Show current values and prompt for new ones
        print(f"Current title: {task.title}")
        new_title = input("Enter new title (press Enter to keep current): ").strip()

        print(f"Current description: {task.description}")
        new_description = input(
            "Enter new description (press Enter to keep current): "
        ).strip()

        # Validate new title if provided
        if new_title:
            if len(new_title) > MAX_TITLE_LENGTH:
                print(f"Error: Title too long (max {MAX_TITLE_LENGTH} characters).")
                return
        else:
            new_title = None  # Keep current

        # Validate new description if provided
        if new_description:
            if len(new_description) > MAX_DESCRIPTION_LENGTH:
                print(
                    f"Error: Description too long (max {MAX_DESCRIPTION_LENGTH} characters)."
                )
                return
        else:
            new_description = None  # Keep current

        service.update_task(task_id, new_title, new_description)
        print("Task updated successfully!")

    except EOFError:
        print("\nOperation cancelled.")


def delete_task_handler(service: TaskService) -> None:
    """Handle deleting a task.

    Args:
        service: The TaskService instance
    """
    try:
        task_id_str = input("Enter task ID to delete: ").strip()

        # Validate ID input
        try:
            task_id = int(task_id_str)
        except ValueError:
            print("Error: Invalid input. Please enter a number.")
            return

        # Attempt to delete
        if service.delete_task(task_id):
            print("Task deleted successfully!")
        else:
            print("Error: Task not found.")

    except EOFError:
        print("\nOperation cancelled.")


def toggle_task_handler(service: TaskService) -> None:
    """Handle toggling task completion status.

    Args:
        service: The TaskService instance
    """
    try:
        task_id_str = input("Enter task ID to toggle: ").strip()

        # Validate ID input
        try:
            task_id = int(task_id_str)
        except ValueError:
            print("Error: Invalid input. Please enter a number.")
            return

        # Attempt to toggle
        task = service.toggle_task_completion(task_id)
        if task is None:
            print("Error: Task not found.")
        elif task.completed:
            print("Task marked as complete!")
        else:
            print("Task marked as incomplete!")

    except EOFError:
        print("\nOperation cancelled.")


def exit_handler() -> NoReturn:
    """Handle graceful exit from the application."""
    print("Goodbye!")
    sys.exit(0)


def handle_sigint(signum: int, frame) -> NoReturn:
    """Handle Ctrl+C gracefully.

    Args:
        signum: Signal number
        frame: Current stack frame
    """
    print("\nGoodbye!")
    sys.exit(0)


def run_menu(service: TaskService) -> NoReturn:
    """Run the main menu loop.

    Args:
        service: The TaskService instance to use for operations
    """
    # Set up Ctrl+C handler
    signal.signal(signal.SIGINT, handle_sigint)

    while True:
        display_menu()
        choice = get_menu_choice()

        if choice == "1":
            add_task_handler(service)
        elif choice == "2":
            view_tasks_handler(service)
        elif choice == "3":
            update_task_handler(service)
        elif choice == "4":
            delete_task_handler(service)
        elif choice == "5":
            toggle_task_handler(service)
        elif choice == "6":
            exit_handler()
        # Invalid choices already handled in get_menu_choice()
