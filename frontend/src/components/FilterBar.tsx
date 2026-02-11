'use client';

import { useEffect, useState } from 'react';

export interface FilterState {
  status?: string;
  priority?: string;
  tag?: string;
  search?: string;
  sort_by: string;
  sort_order: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const sortOptions = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ ...filters, search: searchInput || undefined });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4 space-y-3 backdrop-blur-sm">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search tasks..."
          className="w-full border border-gray-800 rounded-lg pl-10 pr-3 py-2.5 text-sm bg-[#0a0a0f] text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        {/* Status tabs */}
        <div className="flex rounded-lg border border-gray-800 overflow-hidden">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ ...filters, status: opt.value || undefined })}
              className={`px-3.5 py-2 text-xs font-semibold transition-all ${
                (filters.status ?? '') === opt.value
                  ? 'bg-cyan-500 text-[#0a0a0f]'
                  : 'bg-gray-900 text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <select
          value={filters.priority ?? ''}
          onChange={(e) =>
            onFilterChange({ ...filters, priority: e.target.value || undefined })
          }
          className="border border-gray-800 rounded-lg px-3 py-2 text-xs font-semibold bg-gray-900 text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort_by}
          onChange={(e) => onFilterChange({ ...filters, sort_by: e.target.value })}
          className="border border-gray-800 rounded-lg px-3 py-2 text-xs font-semibold bg-gray-900 text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        {/* Sort order toggle */}
        <button
          onClick={() =>
            onFilterChange({
              ...filters,
              sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
            })
          }
          className="border border-gray-800 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-900 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
          aria-label={filters.sort_order === 'asc' ? 'Sort descending' : 'Sort ascending'}
        >
          {filters.sort_order === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>
    </div>
  );
}
