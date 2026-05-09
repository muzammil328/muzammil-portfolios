'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableWrapperProps {
  id: string;
  children: React.ReactNode;
}

export function SortableWrapper({ id, children }: SortableWrapperProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className="absolute top-6 right-14 cursor-move p-2 hover:bg-muted/50 rounded-md transition-colors z-10"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground/50" />
      </div>
      {children}
    </div>
  );
}
