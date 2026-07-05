import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';
import { LoaderCircle } from '../../icons';

const buttonVariants = cva(
  // Base styles
  [
    'group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap',
    'rounded-lg border border-transparent bg-clip-padding',
    'text-sm font-medium select-none cursor-pointer',
    'transition-all duration-200 outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-3',
    'active:translate-y-px',
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        // ── Core ──────────────────────────────────────────────────────
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95',

        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground ' +
          'dark:bg-input/30 dark:border-input dark:hover:bg-input/50 ' +
          'aria-expanded:bg-muted aria-expanded:text-foreground',

        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 ' +
          'aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',

        ghost:
          'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 ' +
          'aria-expanded:bg-muted aria-expanded:text-foreground',

        destructive:
          'bg-destructive/10 hover:bg-destructive/20 text-destructive ' +
          'focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ' +
          'dark:bg-destructive/20 focus-visible:border-destructive/40 dark:hover:bg-destructive/30',

        link: 'text-primary underline-offset-4 hover:underline h-auto p-0',

        // ── Landing page heroes ───────────────────────────────────────
        /**
         * High-contrast CTA — use as the primary hero button on landing pages.
         * Renders a solid, full-opacity primary button with a subtle lift shadow.
         */
        cta:
          'bg-primary text-primary-foreground shadow-md shadow-primary/30 ' +
          'hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 ' +
          'active:translate-y-0 active:shadow-sm',

        /**
         * Frosted-glass button — ideal for hero sections over image/video backgrounds.
         * Works in both light and dark contexts.
         */
        glass:
          'bg-white/15 backdrop-blur-md border border-white/25 text-white ' +
          'hover:bg-white/25 hover:border-white/40 shadow-sm',

        /**
         * Gradient fill — eye-catching accent for marketing pages.
         * Customize --btn-from / --btn-to CSS vars per-instance if needed.
         */
        gradient:
          'bg-gradient-to-r from-[--btn-from,theme(colors.violet.500)] ' +
          'to-[--btn-to,theme(colors.indigo.500)] text-white border-0 ' +
          'shadow-md shadow-indigo-500/25 hover:opacity-90 hover:-translate-y-0.5 ' +
          'hover:shadow-lg hover:shadow-indigo-500/35 active:translate-y-0',

        /**
         * Soft tinted — subtle brand-colored fill, great for secondary CTAs.
         */
        soft:
          'bg-primary/10 text-primary border-primary/20 ' +
          'hover:bg-primary/15 hover:border-primary/30 dark:bg-primary/15 dark:hover:bg-primary/20',

        // ── Dashboard utility ─────────────────────────────────────────
        /**
         * Muted action — low-emphasis action inside cards, tables, toolbars.
         */
        muted:
          'bg-muted/60 text-muted-foreground border-transparent ' +
          'hover:bg-muted hover:text-foreground',

        /**
         * Success — confirm / save actions.
         */
        success:
          'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 ' +
          'hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/15',

        /**
         * Warning — caution-level actions (archive, publish, etc.).
         */
        warning:
          'bg-amber-500/10 text-amber-700 border-amber-500/20 ' +
          'hover:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 dark:hover:bg-amber-500/15',

        /**
         * Sidebar nav item — active/inactive states for nav links inside dashboards.
         * Pair with aria-current="page" for the active indicator.
         */
        nav:
          'w-full justify-start gap-2 rounded-md border-0 text-muted-foreground ' +
          'hover:bg-muted hover:text-foreground ' +
          'aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary aria-[current=page]:font-semibold',
      },

      size: {
        default:
          'h-9 gap-1.5 px-4 ' +
          'has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',

        xs:
          "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs " +
          "in-data-[slot=button-group]:rounded-lg " +
          "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 " +
          "[&_svg:not([class*='size-'])]:size-3",

        sm:
          "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] " +
          "in-data-[slot=button-group]:rounded-lg " +
          "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 " +
          "[&_svg:not([class*='size-'])]:size-3.5",

        lg:
          'h-11 gap-2 px-6 text-base ' +
          'has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',

        xl:
          'h-13 gap-2 px-8 text-lg rounded-xl ' +
          'has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',

        // Icon-only sizes
        icon:    'size-9',
        'icon-xs': "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-10',
        'icon-xl': 'size-12 rounded-xl',
      },

      /**
       * width="full" makes the button fill its container — handy for mobile
       * stacked CTAs or full-width dashboard form actions.
       */
      width: {
        auto: '',
        full: 'w-full',
      },

      /**
       * rounded="pill" for marketing pill buttons; "square" for toolbar icons.
       */
      rounded: {
        default: '',
        pill:   'rounded-full',
        square: 'rounded-none',
      },
    },

    defaultVariants: {
      variant: 'default',
      size:    'default',
      width:   'auto',
      rounded: 'default',
    },
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child component (e.g. Next.js `<Link>`). */
  asChild?: boolean;
  /** Show a spinner and optionally swap the label. */
  loading?: boolean;
  /** Label shown while `loading` is true. Falls back to `children`. */
  loadingText?: React.ReactNode;
  /**
   * Render a leading icon slot.
   * The icon is hidden during loading so the spinner takes its place cleanly.
   */
  leftIcon?: React.ReactNode;
  /**
   * Render a trailing icon slot.
   * Useful for "arrow" or "external link" affordances on CTA buttons.
   */
  rightIcon?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

function Button({
  className,
  variant  = 'default',
  size     = 'default',
  width    = 'auto',
  rounded  = 'default',
  asChild  = false,
  loading,
  disabled,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, width, rounded, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : loading ? (
        <>
          <LoaderCircle className="size-4 animate-spin shrink-0" aria-hidden />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="shrink-0 -ml-0.5" data-icon="inline-start" aria-hidden>
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span className="shrink-0 -mr-0.5" data-icon="inline-end" aria-hidden>
              {rightIcon}
            </span>
          )}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };

// ─── Usage Examples ───────────────────────────────────────────────────────────
//
// Landing page hero:
//   <Button variant="cta" size="xl" rounded="pill">Get started free</Button>
//   <Button variant="glass" size="lg">Watch demo</Button>
//   <Button variant="gradient" size="lg" rightIcon={<ArrowRight />}>Start building</Button>
//
// Secondary CTA:
//   <Button variant="soft" size="lg">Learn more</Button>
//   <Button variant="outline" size="lg" leftIcon={<Github />}>View on GitHub</Button>
//
// Dashboard actions:
//   <Button variant="success" size="sm" leftIcon={<Check />}>Save changes</Button>
//   <Button variant="warning" size="sm">Archive</Button>
//   <Button variant="destructive" size="sm">Delete</Button>
//   <Button variant="muted" size="sm" leftIcon={<Download />}>Export</Button>
//
// Loading state:
//   <Button loading loadingText="Saving…">Save</Button>
//
// Sidebar nav:
//   <Button variant="nav" size="sm" aria-current="page" leftIcon={<LayoutDashboard />}>Dashboard</Button>
//   <Button variant="nav" size="sm" leftIcon={<Users />}>Team</Button>
//
// Full-width mobile CTA:
//   <Button variant="cta" width="full">Create account</Button>
//
// Icon-only toolbar:
//   <Button variant="ghost" size="icon" aria-label="Search"><Search /></Button>
//   <Button variant="outline" size="icon-sm" aria-label="Settings"><Settings /></Button>