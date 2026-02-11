'use client';

import { useState } from 'react';
import { Task, TaskUpdate } from '@/types/task';
import PriorityBadge from './PriorityBadge';
import TagList from './TagList';
import ConfirmDialog from './ConfirmDialog';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onUpdate: (id: number, data: TaskUpdate) => void;
  onDelete: (id: number) => void;
  isToggling?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function TaskCard({
  task,
  onToggle,
  onUpdate,
  onDelete,
  isToggling = false,
  isUpdating = false,
  isDeleting = false,
}: TaskCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (showEdit) {
    return (
      <TaskForm
        task={task}
        onSubmit={(data) => {
          onUpdate(task.id, data as TaskUpdate);
          setShowEdit(false);
        }}
        onCancel={() => setShowEdit(false)}
        isLoading={isUpdating}
      />
    );
  }

  const formattedDueDate = task.due_date
    ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isOverdue = task.due_date && !task.completed && new Date(task.due_date + 'T23:59:59') < new Date();

  const priorityBorder = task.completed
    ? 'border-l-gray-700'
    : task.priority === 'high'
    ? 'border-l-red-500'
    : task.priority === 'medium'
    ? 'border-l-amber-500'
    : 'border-l-cyan-500';

  return (
    <>
      <div
        className={`bg-gray-900/70 border border-gray-800 border-l-4 ${priorityBorder} rounded-xl p-4 transition-all hover:bg-gray-900 hover:border-gray-700 hover:shadow-lg hover:shadow-cyan-500/5 group ${
          task.completed ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id)}
            disabled={isToggling}
            className="mt-0.5 flex-shrink-0 disabled:opacity-50"
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-cyan-500 border-cyan-500 text-[#0a0a0f]'
                  : 'border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/10'
              }`}
            >
              {task.completed && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`font-semibold ${
                  task.completed ? 'line-through text-gray-600' : 'text-gray-100'
                }`}
              >
                {task.title}
              </h3>
              <PriorityBadge priority={task.priority} />
            </div>

            {task.description && (
              <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>
            )}

            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <TagList tags={task.tags} />
              {formattedDueDate && (
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                  isOverdue ? 'text-red-400' : 'text-gray-600'
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {isOverdue ? 'Overdue: ' : ''}{formattedDueDate}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowEdit(true)}
              className="p-2 text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
              aria-label="Edit task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              aria-label="Delete task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showConfirmDelete && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
          onConfirm={() => {
            onDelete(task.id);
            setShowConfirmDelete(false);
          }}
          onCancel={() => setShowConfirmDelete(false)}
          isLoading={isDeleting}
        />
      )}
    </>
  );
}
