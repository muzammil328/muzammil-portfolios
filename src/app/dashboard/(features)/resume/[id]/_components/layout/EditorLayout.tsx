'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface EditorLayoutProps {
  isPreviewMode: boolean;
  left: React.ReactNode;
  right: React.ReactNode;
}

export function EditorLayout({ isPreviewMode, left, right }: EditorLayoutProps) {
  return (
    <div
      className={cn(
        'container px-4 py-6 grid gap-8 h-[calc(100vh-4rem)] transition-all duration-300',
        isPreviewMode ? 'grid-cols-1 justify-center' : 'grid-cols-1 lg:grid-cols-2'
      )}
    >
      <div
        className={cn(
          'space-y-6 overflow-y-auto pr-2 pb-20 custom-scrollbar transition-all duration-300',
          isPreviewMode ? 'hidden' : 'block'
        )}
      >
        {left}
      </div>
      {right}
    </div>
  );
}
