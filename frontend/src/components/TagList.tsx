'use client';

interface TagListProps {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-block bg-gray-800 text-cyan-300 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-gray-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
