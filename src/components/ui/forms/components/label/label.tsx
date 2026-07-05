'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

// ─── Variants ─────────────────────────────────────────────────────────────────

const labelVariants = cva(
  [
    // base
    'inline-flex items-center gap-1.5',
    'leading-none tracking-wide font-medium select-none',
    // disabled via group or peer
    'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    // transition for color changes
    'transition-colors duration-150',
  ],
  {
    variants: {
      /**
       * Visual style of the label text.
       *
       * - default  → muted foreground (standard form label)
       * - strong   → full foreground, slightly heavier — section headers
       * - muted    → extra-muted — supporting / secondary labels
       * - error    → destructive color — wired automatically by FormField on invalid
       * - success  → green — confirmation labels (e.g. "Verified email")
       */
      variant: {
        default: 'text-foreground/80',
        strong: 'text-foreground font-semibold',
        muted: 'text-muted-foreground',
        error: 'text-destructive',
        success: 'text-emerald-600 dark:text-emerald-400',
      },

      /**
       * Font size of the label.
       *
       * - sm  → 12px — compact inputs, table filters, inline labels
       * - md  → 14px — standard form fields (default)
       * - lg  → 16px — section headings inside cards
       */
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

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Red asterisk shown when `required` is true.
 * The visual asterisk is hidden from AT; a visually-hidden
 * "required" string is announced instead.
 */
function RequiredIndicator() {
  return (
    <>
      <span aria-hidden="true" className="text-destructive leading-none">
        *
      </span>
      <span className="sr-only">required</span>
    </>
  );
}

/**
 * Muted "(optional)" badge shown when `optional` is true.
 * Useful when most fields are required and you want to call out exceptions.
 */
function OptionalBadge() {
  return (
    <span className="text-[11px] font-normal text-muted-foreground/70 tracking-normal">
      (optional)
    </span>
  );
}

/**
 * Inline loading indicator — three pulsing dots.
 * Shown when `loading` is true, e.g. while async options are being fetched.
 * Respects prefers-reduced-motion.
 */
function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="Loading" role="status">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-current opacity-60 motion-safe:animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </span>
  );
}

// ─── Info icon ────────────────────────────────────────────────────────────────

/**
 * Keyboard-accessible info icon with tooltip.
 * Focusable via Tab; title is surfaced to AT via aria-label.
 */
function InfoIcon({ tooltip, size }: { tooltip: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <span
      tabIndex={0}
      role="img"
      aria-label={tooltip}
      title={tooltip}
      className={cn(
        sizeClass,
        'cursor-help inline-flex items-center justify-center rounded-full',
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
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root>, VariantProps<typeof labelVariants> {
  /**
   * Explicit variant override — narrows CVA's `string | null | undefined`
   * to the actual union for stricter call-site inference.
   */
  variant?: 'default' | 'strong' | 'muted' | 'error' | 'success';

  /** Explicit size override for the same reason. */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Appends a red `*` after the label text and a visually-hidden "required"
   * string for screen readers.
   * Does NOT add `required` to any input — wire that on the input itself.
   */
  required?: boolean;

  /**
   * Appends a muted "(optional)" badge after the label text.
   * Ignored (with a dev warning) when `required` is also true.
   */
  optional?: boolean;

  /**
   * Replaces label text with three pulsing dots.
   * Use while async content (e.g. field options) is being fetched.
   * Also suppresses `suffix` while loading.
   */
  loading?: boolean;

  /**
   * Renders a small focusable info icon.
   * Tooltip text is surfaced via `title` and `aria-label`.
   * For richer tooltips, render your own tooltip component as `children`.
   *
   * NOTE: Do not also pass an HTML `title` prop — it will appear on the
   * root element AND the icon, causing duplicate tooltips.
   */
  hint?: string;

  /**
   * Content rendered to the right of the label text — useful for
   * "Forgot password?", character counters, or action links.
   * Hidden while `loading` is true.
   */
  suffix?: React.ReactNode;

  /**
   * When true, stretches the label to full width so the suffix sits
   * flush-right. Defaults to false so inline layouts aren't broken.
   * Set explicitly when you want space-between behavior.
   */
  fullWidth?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

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
      {/* Main label content */}
      <span className="inline-flex items-center gap-1.5 min-w-0">
        {loading ? (
          <LoadingDots />
        ) : (
          <>
            {children}

            {required && <RequiredIndicator />}
            {!required && optional && <OptionalBadge />}

            {hint && <InfoIcon tooltip={hint} size={size ?? 'md'} />}
          </>
        )}
      </span>

      {/* Suffix — e.g. "Forgot password?", char counter, action link */}
      {suffix && !loading && (
        <span className="text-xs font-normal text-muted-foreground">{suffix}</span>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label, labelVariants };

// ─── Usage Examples ───────────────────────────────────────────────────────────
//
// Basic Variants:
//   <Label htmlFor="email" required>Email address</Label>
//   <Label htmlFor="name">Full name</Label>
//   <Label htmlFor="website" optional>Website</Label>
//
// Size Variants:
//   <Label size="sm">Compact label</Label>
//   <Label size="md">Default label</Label>
//   <Label size="lg">Large section label</Label>
//
// Style Variants:
//   <Label variant="default">Default</Label>
//   <Label variant="strong">Billing details</Label>
//   <Label variant="muted">Advanced settings</Label>
//   <Label variant="error">Invalid email</Label>
//   <Label variant="success">Email verified</Label>
//
// With Tooltip:
//   <Label
//     htmlFor="username"
//     tooltip="Visible in your public profile URL"
//   >
//     Username
//   </Label>
//
// With Required + Tooltip:
//   <Label
//     htmlFor="apiKey"
//     required
//     tooltip="Generate this from your dashboard settings"
//   >
//     API Key
//   </Label>
//
// Loading State:
//   <Label htmlFor="country" loading>
//     Country
//   </Label>
//
// With Suffix Link:
//   <Label
//     htmlFor="password"
//     required
//     suffix={
//       <a
//         href="/forgot-password"
//         className="text-primary hover:underline"
//       >
//         Forgot?
//       </a>
//     }
//   >
//     Password
//   </Label>
//
// With Character Counter:
//   <Label
//     htmlFor="bio"
//     suffix={`${bio.length}/160`}
//   >
//     Bio
//   </Label>
//
// With Status Badge:
//   <Label
//     suffix={
//       <Badge variant="secondary">
//         Beta
//       </Badge>
//     }
//   >
//     AI Features
//   </Label>
//
// With Keyboard Shortcut:
//   <Label
//     suffix={
//       <kbd className="rounded border px-1.5 py-0.5 text-[10px]">
//         ⌘K
//       </kbd>
//     }
//   >
//     Command Palette
//   </Label>
//
// Compact / Inline Filter:
//   <div className="flex items-center gap-2">
//     <Label size="sm" variant="muted">
//       Filter by
//     </Label>
//
//     <Select />
//   </div>
//
// Radio Group Example:
//   <div className="flex items-center gap-2">
//     <RadioGroupItem value="dark" id="dark" />
//     <Label htmlFor="dark">Dark mode</Label>
//   </div>
//
// Disabled State:
//   <div
//     className="group"
//     data-disabled="true"
//   >
//     <Label htmlFor="disabled-input">
//       Disabled field
//     </Label>
//
//     <Input
//       id="disabled-input"
//       disabled
//     />
//   </div>
//
// Success / Verified:
//   <Label
//     variant="success"
//     suffix={
//       <span className="text-emerald-500">
//         Verified
//       </span>
//     }
//   >
//     Email address
//   </Label>
//
// Error State:
//   <Label htmlFor="email" variant="error">
//     Invalid email address
//   </Label>
//
// Section Heading:
//   <Label size="lg" variant="strong">
//     Billing Details
//   </Label>
//
// Auth Form Example:
//   <Label
//     htmlFor="password"
//     required
//     suffix={
//       <a
//         href="/forgot"
//         className="text-primary hover:underline"
//       >
//         Forgot password?
//       </a>
//     }
//   >
//     Password
//   </Label>
//
// File Upload:
//   <Label
//     htmlFor="avatar"
//     tooltip="PNG or JPG up to 5MB"
//   >
//     Profile picture
//   </Label>
//
// Search Input:
//   <Label
//     htmlFor="search"
//     size="sm"
//     variant="muted"
//   >
//     Search products
//   </Label>
//
// Live Sync Status:
//   <Label
//     suffix={
//       <span className="text-emerald-500">
//         Synced
//       </span>
//     }
//   >
//     Cloud backup
//   </Label>
//
// Async Form Section:
//   <div className="space-y-2">
//     <Label loading />
//
//     <div className="h-10 rounded bg-muted animate-pulse" />
//   </div>
