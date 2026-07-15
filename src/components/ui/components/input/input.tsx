'use client';

import * as React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CircleIcon } from '../../icons';

function InputSpinner() {
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2">
      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" aria-hidden="true" />
    </span>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  revealToggle?: boolean;
  loading?: boolean;
  validationState?: 'valid' | 'invalid' | 'none';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      rightIcon,
      revealToggle = false,
      loading = false,
      validationState = 'none',
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isRevealed, setIsRevealed] = React.useState(false);

    const canReveal = revealToggle && type === 'password';
    const isDisabled = disabled || loading;
    const inputType = canReveal && isRevealed ? 'text' : type;

    const hasValidationIcon = !loading && validationState !== 'none';
    const hasRightIcon = !loading && !!rightIcon;
    const hasReveal = !loading && canReveal;

    const rightOccupants =
      (loading ? 1 : 0) +
      (hasValidationIcon ? 1 : 0) +
      (hasRightIcon ? 1 : 0) +
      (hasReveal ? 1 : 0);

    const prClass =
      rightOccupants === 0
        ? undefined
        : rightOccupants === 1
          ? 'pr-9'
          : rightOccupants === 2
            ? 'pr-14'
            : 'pr-20';

    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-muted-foreground">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          type={inputType}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          className={cn(
            'flex h-9 w-full min-w-0 rounded-md border border-border bg-input px-3 py-1 text-sm shadow-xs outline-none',
            leftIcon && 'pl-9',
            'transition-[color,box-shadow,border-color,opacity] duration-150',
            'placeholder:text-muted-foreground',
            'focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring',
            'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
            'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-destructive/30 dark:aria-[invalid=true]:ring-destructive/50',
            validationState === 'valid' &&
              'border-emerald-500 ring-1 ring-emerald-500/20 dark:ring-emerald-500/30',
            loading && 'cursor-wait opacity-60',
            prClass,
            className,
          )}
          {...props}
        />

        <span className={cn(
          'absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1.5 text-muted-foreground',
        )}>
          {loading ? (
            <InputSpinner />
          ) : (
            <>
              {hasValidationIcon &&
                (validationState === 'valid' ? (
                  <CircleIcon className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
                ))}

              {hasRightIcon && (
                <span className={cn('pointer-events-none', hasReveal && 'mr-6')}>{rightIcon}</span>
              )}

              {hasReveal && (
                <button
                  type="button"
                  onClick={() => setIsRevealed((v) => !v)}
                  disabled={isDisabled}
                  aria-label={isRevealed ? 'Hide password' : 'Show password'}
                  aria-pressed={isRevealed}
                  tabIndex={-1}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
                >
                  {isRevealed ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              )}
            </>
          )}
        </span>
      </div>
    );
  },
);
Input.displayName = 'Input';
