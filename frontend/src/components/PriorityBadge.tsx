'use client';

import { Priority } from '@/types/task';

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/25' },
  medium: { label: 'Medium', className: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25' },
  low: { label: 'Low', className: 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/25' },
};

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
