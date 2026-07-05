'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';

import { Controller, useFormContext } from 'react-hook-form';
import type { FieldValues, Path } from 'react-hook-form';

import { CheckIcon } from '../../../icons';

import { cn } from '@/lib/cn';

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  isError?: boolean;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, isError, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        // Base
        'peer flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 outline-none',

        // Colors
        'border-input bg-background shadow-sm',

        // Checked state
        'data-[state=checked]:border-primary',
        'data-[state=checked]:bg-primary',
        'data-[state=checked]:text-primary-foreground',

        // Hover
        'hover:border-primary/60',

        // Focus
        'focus-visible:ring-4 focus-visible:ring-ring/20',
        'focus-visible:border-ring',

        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',

        // Error state
        isError && 'border-destructive focus-visible:ring-destructive/20',

        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = 'Checkbox';

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: CheckedState) => void;
}

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
  required,
  onCheckedChange,
}: FormCheckboxProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <label
            htmlFor={name}
            className={cn(
              'group flex cursor-pointer items-start gap-3 rounded-lg transition-colors',
              disabled || isSubmitting ? 'cursor-not-allowed opacity-60' : 'hover:bg-muted/40',
            )}
          >
            <Checkbox
              id={name}
              checked={!!field.value}
              disabled={disabled || isSubmitting}
              isError={!!error}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onCheckedChange?.(checked);
              }}
              className="mt-0.5"
            />

            <div className="space-y-1">
              {label && (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium leading-none">{label}</span>

                  {required && <span className="text-destructive">*</span>}
                </div>
              )}

              {description && <p className="text-sm text-muted-foreground">{description}</p>}

              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            </div>
          </label>
        )}
      />
    </div>
  );
}
// ─── Usage Examples ───────────────────────────────────────────────────────────
//
// Basic Usage:
//   <FormCheckbox<FormValues>
//     name="terms"
//     label="Accept Terms"
//   />
//
// With Description:
//   <FormCheckbox<FormValues>
//     name="marketing"
//     label="Marketing Emails"
//     description="Receive updates and promotions."
//   />
//
// Required Checkbox:
//   <FormCheckbox<FormValues>
//     name="privacy"
//     label="Privacy Policy"
//     description="You must agree before continuing."
//     required
//   />
//
// Disabled State:
//   <FormCheckbox<FormValues>
//     name="notifications"
//     label="Push Notifications"
//     disabled
//   />
//
// Account Security:
//   <FormCheckbox<FormValues>
//     name="twoFactor"
//     label="Enable Two-Factor Authentication"
//     description="Add extra security to your account."
//   />
//
// Newsletter Subscription:
//   <FormCheckbox<FormValues>
//     name="newsletter"
//     label="Subscribe to Newsletter"
//     description="Get weekly news and resources."
//   />
//
// Product Updates:
//   <FormCheckbox<FormValues>
//     name="updates"
//     label="Product Updates"
//     description="Receive feature announcements."
//   />
//
// Remember Device:
//   <FormCheckbox<FormValues>
//     name="remember"
//     label="Remember this device"
//     description="Stay signed in for 30 days."
//   />
//
// Age Confirmation:
//   <FormCheckbox<FormValues>
//     name="ageConfirm"
//     label="I am over 18 years old"
//     required
//   />
//
// Custom Class Styling:
//   <FormCheckbox<FormValues>
//     name="beta"
//     label="Join Beta Program"
//     className="rounded-xl border p-4"
//   />
//
// With External Change Handler:
//   <FormCheckbox<FormValues>
//     name="analytics"
//     label="Analytics Tracking"
//     onCheckedChange={(checked) => {
//       console.log(checked);
//     }}
//   />
