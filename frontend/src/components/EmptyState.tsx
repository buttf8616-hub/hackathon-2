'use client';

interface EmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  message = 'No tasks yet. Add your first task to get started!',
  actionLabel = 'Add Task',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-900/40 rounded-2xl border border-gray-800 backdrop-blur-sm">
      <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-cyan-500/20">
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <p className="text-gray-300 text-sm font-medium mb-1">{message}</p>
      <p className="text-gray-600 text-xs mb-5">Your tasks will appear here</p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-cyan-500 text-[#0a0a0f] px-6 py-2.5 rounded-xl hover:bg-cyan-400 transition-all text-sm font-semibold shadow-lg shadow-cyan-500/25"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
