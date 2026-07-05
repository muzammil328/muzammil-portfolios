'use client';

import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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
          // Base
          'flex min-h-[120px] w-full rounded-xl border bg-background px-4 py-3 text-sm shadow-sm transition-all duration-200 outline-none',

          // Typography
          'placeholder:text-muted-foreground/70',

          // Border & ring
          'border-input focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20',

          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-50',

          // Error state
          isError &&
            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',

          // Resize options
          resize === 'none' && 'resize-none',
          resize === 'vertical' && 'resize-y',
          resize === 'horizontal' && 'resize-x',
          resize === 'both' && 'resize',

          // Scrollbar
          'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',

          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export function FormTextarea({
  name,
  label,
  placeholder,
  description,
  error,
  className,
  required,
  maxLength,
  showCount = false,
  resize = 'vertical',
  ...props
}: FormTextareaProps) {
  const { control } = useFormContext();

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>

          {showCount && maxLength && (
            <span className="text-xs text-muted-foreground">Max {maxLength} chars</span>
          )}
        </div>
      )}

      {/* Field */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentLength = field.value?.length || 0;

          return (
            <div className="space-y-1">
              <Textarea
                id={name}
                {...field}
                {...props}
                resize={resize}
                placeholder={placeholder}
                maxLength={maxLength}
                value={field.value || ''}
                isError={!!error}
                onChange={(e) => field.onChange(e.target.value)}
              />

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div>
                  {description && !error && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                  )}

                  {error && <p className="text-xs font-medium text-destructive">{error}</p>}
                </div>

                {showCount && (
                  <span
                    className={cn(
                      'text-xs',
                      maxLength && currentLength >= maxLength * 0.9
                        ? 'text-warning'
                        : 'text-muted-foreground',
                    )}
                  >
                    {currentLength}
                    {maxLength ? ` / ${maxLength}` : ''}
                  </span>
                )}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

// ─── Usage Examples ───────────────────────────────────────────────────────────
//
// Basic Usage:
//   <TextareaField
//     name="message"
//     label="Message"
//   />
//
// With Placeholder:
//   <TextareaField
//     name="bio"
//     label="Bio"
//     placeholder="Tell us about yourself..."
//   />
//
// With Description:
//   <TextareaField
//     name="feedback"
//     label="Feedback"
//     description="Share your thoughts and suggestions."
//   />
//
// Required Field:
//   <TextareaField
//     name="review"
//     label="Review"
//     placeholder="Write your review..."
//     required
//   />
//
// Error State:
//   <TextareaField
//     name="comment"
//     label="Comment"
//     error="Comment is required."
//   />
//
// Character Counter:
//   <TextareaField
//     name="about"
//     label="About You"
//     maxLength={250}
//     showCount
//   />
//
// Auto Resizable:
//   <TextareaField
//     name="story"
//     label="Your Story"
//     resize="vertical"
//   />
//
// Disabled State:
//   <TextareaField
//     name="disabled"
//     label="Disabled Field"
//     disabled
//   />
//
// Support Ticket:
//   <TextareaField
//     name="issue"
//     label="Describe the Issue"
//     placeholder="Explain the problem in detail..."
//     description="Include steps to reproduce the issue."
//     required
//   />
//
// Product Review:
//   <TextareaField
//     name="review"
//     label="Product Review"
//     placeholder="What did you like or dislike?"
//     maxLength={500}
//     showCount
//   />
//
// User Bio:
//   <TextareaField
//     name="bio"
//     label="Profile Bio"
//     placeholder="Write a short introduction..."
//     description="Displayed publicly on your profile."
//     maxLength={160}
//     showCount
//   />
//
// Notes / Admin Input:
//   <TextareaField
//     name="notes"
//     label="Internal Notes"
//     resize="both"
//   />
//
// Custom Styling:
//   <TextareaField
//     name="custom"
//     label="Custom Styled"
//     className="rounded-2xl border-primary"
//   />
//
// Readonly Field:
//   <TextareaField
//     name="readonly"
//     label="Readonly"
//     defaultValue="This content cannot be edited."
//     readOnly
//   />
