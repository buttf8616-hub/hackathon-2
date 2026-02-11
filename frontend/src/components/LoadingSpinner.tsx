'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-cyan-500" />
      <p className="text-sm text-gray-600 mt-4">Loading tasks...</p>
    </div>
  );
}
