'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isError, resize = 'vertical', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          'flex min-h-[120px] w-full rounded-xl border bg-background px-4 py-3 text-sm shadow-sm transition-all duration-200 outline-none',
          'placeholder:text-muted-foreground/70',
          'border-input focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isError &&
            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
          resize === 'none' && 'resize-none',
          resize === 'vertical' && 'resize-y',
          resize === 'horizontal' && 'resize-x',
          resize === 'both' && 'resize',
          'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
