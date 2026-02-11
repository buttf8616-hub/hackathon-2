'use client';

import { Task, TaskUpdate } from '@/types/task';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onUpdate: (id: number, data: TaskUpdate) => void;
  onDelete: (id: number) => void;
  onAddClick: () => void;
  isSearching?: boolean;
}

export default function TaskList({
  tasks,
  onToggle,
  onUpdate,
  onDelete,
  onAddClick,
  isSearching = false,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        message={
          isSearching
            ? 'No matching tasks found. Try a different search or filter.'
            : 'No tasks yet. Add your first task to get started!'
        }
        actionLabel={isSearching ? undefined : 'Add Task'}
        onAction={isSearching ? undefined : onAddClick}
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
