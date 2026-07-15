'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const labelVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'leading-none tracking-wide font-medium select-none',
    'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    'transition-colors duration-150',
  ],
  {
    variants: {
      variant: {
        default: 'text-foreground/80',
        strong: 'text-foreground font-semibold',
        muted: 'text-muted-foreground',
        error: 'text-destructive',
        success: 'text-emerald-600 dark:text-emerald-400',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root>, VariantProps<typeof labelVariants> {
  variant?: 'default' | 'strong' | 'muted' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  optional?: boolean;
  loading?: boolean;
  hint?: string;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
}

function Label({
  className,
  variant,
  size,
  required,
  optional,
  loading,
  hint,
  suffix,
  fullWidth = false,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        labelVariants({ variant, size }),
        fullWidth && suffix && 'w-full justify-between',
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1.5 min-w-0">
        {loading ? (
          <span className="inline-flex items-center gap-0.5" aria-label="Loading" role="status">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full bg-current opacity-60 motion-safe:animate-bounce"
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
              />
            ))}
          </span>
        ) : (
          <>
            {children}
            {required && (
              <>
                <span aria-hidden="true" className="text-destructive leading-none">*</span>
                <span className="sr-only">required</span>
              </>
            )}
            {!required && optional && (
              <span className="text-[11px] font-normal text-muted-foreground/70 tracking-normal">
                (optional)
              </span>
            )}
            {hint && (
              <span
                tabIndex={0}
                role="img"
                aria-label={hint}
                title={hint}
                className={cn(
                  'h-3.5 w-3.5 cursor-help inline-flex items-center justify-center rounded-full',
                  'border border-muted-foreground/30 text-muted-foreground/60',
                  'hover:border-muted-foreground/60 hover:text-muted-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                  'transition-colors',
                )}
              >
                <svg viewBox="0 0 12 12" fill="none" className="h-2 w-2" aria-hidden="true">
                  <path d="M6 5v3M6 3.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            )}
          </>
        )}
      </span>

      {suffix && !loading && (
        <span className="text-xs font-normal text-muted-foreground">{suffix}</span>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
