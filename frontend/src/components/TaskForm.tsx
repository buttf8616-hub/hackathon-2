'use client';

import { useState } from 'react';
import { Priority, Task, TaskCreate, TaskUpdate } from '@/types/task';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskCreate | TaskUpdate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [tagsInput, setTagsInput] = useState(task?.tags?.join(', ') ?? '');
  const [dueDate, setDueDate] = useState(task?.due_date ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmed = title.trim();
    if (!trimmed) {
      newErrors.title = 'Title is required';
    } else if (trimmed.length > 500) {
      newErrors.title = 'Title must be 500 characters or less';
    }
    if (description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }
    if (tags.some((t) => t.length > 50)) {
      newErrors.tags = 'Each tag must be 50 characters or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const data: TaskCreate | TaskUpdate = {
      title: title.trim(),
      description,
      priority,
      tags,
      due_date: dueDate || null,
    };
    onSubmit(data);
  };

  const inputClass = "w-full border border-gray-800 rounded-lg px-3.5 py-2.5 text-sm bg-[#0a0a0f] text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all";
  const errorInputClass = "w-full border border-red-500/40 rounded-lg px-3.5 py-2.5 text-sm bg-red-900/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-white">{task ? 'Edit Task' : 'Add New Task'}</h2>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1.5">
          Title <span className="text-cyan-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className={errors.title ? errorInputClass : inputClass}
        />
        {errors.title && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
          rows={3}
          className={errors.description ? errorInputClass : inputClass}
        />
        {errors.description && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={inputClass + " cursor-pointer"}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1.5">
          Tags <span className="text-gray-600 text-xs font-normal">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. work, personal, urgent"
          className={errors.tags ? errorInputClass : inputClass}
        />
        {errors.tags && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.tags}</p>}
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-400 font-semibold hover:bg-gray-800 hover:text-gray-300 transition-all text-sm disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-[#0a0a0f] font-semibold hover:bg-cyan-400 transition-all text-sm disabled:opacity-50 shadow-lg shadow-cyan-500/25"
        >
          {isLoading ? 'Saving...' : task ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
