import * as React from 'react';

import { cn } from '@/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'text-card-foreground flex flex-col rounded-2xl',
  {
    variants: {
      variant: {
        default: 'bg-card border border-border',
        ghost: 'bg-transparent',
        dashboard: 'bg-background rounded-none w-full shadow-none',
      },
      size: {
        sm: 'gap-3 py-3',
        md: 'gap-4 lg:py-4 py-3',
        lg: 'gap-6 py-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const cardHeaderVariants = cva(
'@container/card-header flex md:flex-row flex-col items-start justify-between gap-1 [.border-b]:pb-6',
  {
    variants: {
      size: {
        sm: 'px-3',
        md: 'lg:px-4 px-3',
        lg: 'px-6',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

const cardContentVariants = cva('text-sm leading-relaxed', {
  variants: {
    size: {
      sm: 'px-3',
      md: 'lg:px-4 px-3',
      lg: 'px-6',
    },
  },
  defaultVariants: { size: 'md' },
});

const cardFooterVariants = cva(
  'flex items-center text-sm text-muted-foreground [.border-t]:pt-6',
  {
    variants: {
      size: {
        sm: 'px-3',
        md: 'lg:px-4 px-3',
        lg: 'px-6',
      },
      position: {
        start: 'justify-start',
        end: 'justify-end',
        between: 'justify-between',
      }
    },
    defaultVariants: { size: 'md', position: 'between' },
  }
);

type CardSize = VariantProps<typeof cardVariants>['size'];
type CardVariant = VariantProps<typeof cardVariants>['variant'];

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps
  extends React.ComponentProps<'div'>,
  VariantProps<typeof cardVariants> { }

function Card({ className, variant, size, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? 'default'}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  );
}

// ─── CardHeader ──────────────────────────────────────────────────────────────

interface CardHeaderProps extends React.ComponentProps<'div'> {
  size?: CardSize;
}

function CardHeader({ className, size = 'md', ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ size }), className)}
      {...props}
    />
  );
}

// ─── CardTitle ───────────────────────────────────────────────────────────────

function CardTitle({ className, variant, ...props }: React.ComponentProps<'div'> & { variant?: CardVariant }) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'leading-none font-semibold',
        variant === 'dashboard' ? 'text-3xl lg:text-4xl' : 'text-xl md:text-2xl',
        className
      )}
      {...props}
    />
  );
}

// ─── CardDescription ─────────────────────────────────────────────────────────

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

// ─── SectionHeading ──────────────────────────────────────────────────────────────

interface SectionHeadingProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: CardVariant;
}

function SectionHeading({ title, description, variant, ...props }: SectionHeadingProps) {
  return (
    <div className="md:mb-2 mb-1">
      <CardTitle variant={variant}>{title}</CardTitle>

      <CardDescription className="max-w-2xl">
        {description}
      </CardDescription>
    </div>
  )
}

// ─── CardAction ──────────────────────────────────────────────────────────────

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

// ─── CardContent ─────────────────────────────────────────────────────────────

interface CardContentProps extends React.ComponentProps<'div'> {
  size?: CardSize;
}

function CardContent({ className, size = 'md', ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ size }), className)}
      {...props}
    />
  );
}

// ─── CardFooter ──────────────────────────────────────────────────────────────

interface CardFooterProps extends React.ComponentProps<'div'> {
  size?: CardSize;
  position?: 'start' | 'end' | 'between';
}

function CardFooter({ className, size = 'md', position = 'between', ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ size, position }), className)}
      {...props}
    />
  );
}

// ─── CardSeparator ───────────────────────────────────────────────────────────

function CardSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-separator"
      className={cn('border-t', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  SectionHeading,
  CardAction,
  CardContent,
  CardSeparator,
};

export type { CardSize, CardVariant };