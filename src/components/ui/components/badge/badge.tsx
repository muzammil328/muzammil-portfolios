import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { CloseIcon } from '../../icons';

// ─── Types ───────────────────────────────────────────────────────────────────

type BadgeColor = 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'neutral';
type BadgeStyle = 'solid' | 'outline' | 'subtle';

// ─── Color token maps ─────────────────────────────────────────────────────────

const solidMap: Record<BadgeColor, string> = {
  primary: 'bg-primary/10 text-primary border-transparent',
  success: 'bg-success text-success-foreground border-transparent',
  warning: 'bg-warning text-warning-foreground border-transparent',
  info:    'bg-info text-info-foreground border-transparent',
  danger:  'bg-danger text-danger-foreground border-transparent',
  neutral: 'bg-neutral text-neutral-foreground border-transparent',
};

const outlineMap: Record<BadgeColor, string> = {
  primary: 'bg-transparent text-primary border-primary',
  success: 'bg-transparent text-success-foreground border-success-foreground',
  warning: 'bg-transparent text-warning-foreground border-warning-foreground',
  info:    'bg-transparent text-info-foreground border-info-foreground',
  danger:  'bg-transparent text-danger-foreground border-danger-foreground',
  neutral: 'bg-transparent text-neutral-foreground border-neutral-foreground',
};

const subtleMap: Record<BadgeColor, string> = {
  primary: 'bg-primary/10 text-primary border-primary/30',
  success: 'bg-success/10 text-success-foreground border-success/30',
  warning: 'bg-warning/10 text-warning-foreground border-warning/30',
  info:    'bg-info/10 text-info-foreground border-info/30',
  danger:  'bg-danger/10 text-danger-foreground border-danger/30',
  neutral: 'bg-neutral/10 text-neutral-foreground border-neutral/20',
};

const dotMap: Record<BadgeColor, string> = {
  primary: 'bg-primary',
  success: 'bg-success-foreground',
  warning: 'bg-warning-foreground',
  info:    'bg-info-foreground',
  danger:  'bg-danger-foreground',
  neutral: 'bg-neutral-foreground',
};

function resolveColorClasses(color: BadgeColor, style: BadgeStyle): string {
  if (style === 'solid')   return solidMap[color];
  if (style === 'outline') return outlineMap[color];
  return subtleMap[color];
}

function resolveDotClass(color: BadgeColor): string {
  return dotMap[color];
}

// ─── Base CVA (layout / shape / size only) ───────────────────────────────────

const badgeBase = cva(
  [
    'inline-flex items-center justify-center font-medium shrink-0 gap-1',
    'border transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    '[&>svg]:size-3 [&>svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1 text-sm',
      },
      shape: {
        rounded: 'rounded-md',
        pill:    'rounded-full',
      },
      withDot: {
        true: 'pl-1.5 pr-2.5 gap-1.5',
      },
      dismissible: {
        true: 'pr-1',
      },
    },
    defaultVariants: {
      size:  'sm',
      shape: 'rounded',
    },
  }
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface BadgeProps
  extends Omit<React.ComponentProps<'span'>, 'color'>,
    VariantProps<typeof badgeBase> {
  /** Semantic color. Default: "primary" */
  color?: BadgeColor;
  /** Visual style. Default: "subtle" */
  badgeStyle?: BadgeStyle;

  // Legacy flat variant string still accepted for backwards-compat
  variant?: `${BadgeColor}_${BadgeStyle}`;

  asChild?: boolean;
  /** Leading icon */
  icon?: React.ReactNode;
  /** Show animated pulse dot */
  withDot?: boolean;
  /** Show ✕ dismiss button */
  dismissible?: boolean;
  /** Called when dismiss button is clicked */
  onDismiss?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Numeric badge (e.g. notification count) */
  count?: number;
  /** Cap count display at this value (default 99) */
  countMax?: number;
  /** Animated pulse on the dot */
  pulse?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

function Badge({
  className,
  color: colorProp,
  badgeStyle: styleProp,
  variant,         // legacy support
  size,
  shape,
  withDot,
  dismissible,
  onDismiss,
  asChild = false,
  icon,
  count,
  countMax = 99,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  // Resolve color + style — support legacy `variant` string like "success_solid"
  let color: BadgeColor = colorProp ?? 'primary';
  let style: BadgeStyle = styleProp ?? 'subtle';

  if (variant) {
    const [c, s] = variant.split('_') as [BadgeColor, BadgeStyle];
    if (!colorProp) color = c;
    if (!styleProp) style = s;
  }

  const colorClasses  = resolveColorClasses(color, style);
  const dotClass      = resolveDotClass(color);

  const Comp = asChild ? Slot : 'span';

  const countLabel =
    count !== undefined
      ? count > countMax
        ? `${countMax}+`
        : String(count)
      : null;

  return (
    <Comp
      data-slot="badge"
      data-color={color}
      data-style={style}
      className={cn(
        badgeBase({ size, shape, withDot, dismissible }),
        colorClasses,
        className
      )}
      {...props}
    >
      {/* Dot */}
      {withDot && (
        <span className="relative flex size-2 shrink-0">
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
                dotClass
              )}
            />
          )}
          <span className={cn('relative inline-flex size-2 rounded-full', dotClass)} />
        </span>
      )}

      {/* Leading icon */}
      {icon && !withDot && (
        <span className="shrink-0 [&>svg]:size-3">{icon}</span>
      )}

      {/* Label */}
      {children}

      {/* Count bubble */}
      {countLabel !== null && (
        <span className="ml-0.5 rounded-sm bg-black/10 dark:bg-white/15 px-1 font-mono text-[10px] leading-none tabular-nums">
          {countLabel}
        </span>
      )}

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            'ml-0.5 -mr-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-sm',
            'opacity-60 transition-opacity hover:opacity-100',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current'
          )}
        >
          <CloseIcon className="size-3" />
        </button>
      )}
    </Comp>
  );
}

export { Badge };
export type { BadgeProps, BadgeColor, BadgeStyle };