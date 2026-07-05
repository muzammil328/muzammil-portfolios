'use client';

import * as React from 'react';

import type { FieldValues, Path } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { Eye, EyeOff, Loader2, X, AlertCircle, CheckCircle2, Mail, Lock } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Label, type LabelProps } from '../label';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../form';

// ─── Internal spinner ─────────────────────────────────────────────────────────

function InputSpinner() {
  return <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-hidden="true" />;
}

// ─── InputAdornment ───────────────────────────────────────────────────────────

/**
 * Thin wrapper that gives left / right adornment slots correct pointer-events,
 * sizing, and centering without repeating classnames across components.
 */
function InputAdornment({
  side,
  interactive = false,
  className,
  children,
}: {
  side: 'left' | 'right';
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'absolute top-1/2 -translate-y-1/2 flex items-center text-muted-foreground',
        side === 'left' ? 'left-3' : 'right-3',
        !interactive && 'pointer-events-none',
        className,
      )}
    >
      {children}
    </span>
  );
}

// ─── Base Input ───────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon or element rendered inside the left edge of the input. */
  leftIcon?: React.ReactNode;
  /**
   * Icon or element rendered inside the right edge of the input.
   * Ignored while `loading` is true (spinner takes priority).
   * Shifted left automatically when `revealToggle` is also active.
   */
  rightIcon?: React.ReactNode;
  /**
   * Adds an eye / eye-off toggle button for `type="password"` inputs.
   * No-op on any other type.
   */
  revealToggle?: boolean;
  /**
   * Renders a spinner in the right slot and sets `aria-busy`.
   * Also applies `cursor-wait` and muted opacity to signal the blocked state.
   * Stacks with the `disabled` prop — either alone is sufficient to block input.
   */
  loading?: boolean;
  /**
   * Shows a validation status icon (✓ or ✕) in the right slot.
   * Useful for inline async-validated fields (e.g. username availability).
   * Ignored while `loading` is true.
   */
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

    // Count right-slot occupants to compute padding
    const hasValidationIcon = !loading && validationState !== 'none';
    const hasRightIcon = !loading && !!rightIcon;
    const hasReveal = !loading && canReveal;

    // Right padding: each occupant is ~1.75rem; base right = 0.75rem
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
        {/* ── Left icon ── */}
        {leftIcon && <InputAdornment side="left">{leftIcon}</InputAdornment>}

        <input
          ref={ref}
          type={inputType}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          className={cn(
            // layout
            'flex h-9 w-full min-w-0 rounded-md border border-border bg-input px-3 py-1 text-sm shadow-xs outline-none',
            leftIcon && 'pl-9',
            // transitions
            'transition-[color,box-shadow,border-color,opacity] duration-150',
            // placeholder
            'placeholder:text-muted-foreground',
            // focus
            'focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring',
            // disabled
            'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
            // invalid — driven by aria-invalid (set externally by FormControl or manually)
            'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-destructive/30 dark:aria-[invalid=true]:ring-destructive/50',
            // valid state (optional inline async validation)
            validationState === 'valid' &&
              'border-emerald-500 ring-1 ring-emerald-500/20 dark:ring-emerald-500/30',
            // loading
            loading && 'cursor-wait opacity-60',
            prClass,
            className,
          )}
          {...props}
        />

        {/* ── Right slot — ordered right-to-left ── */}
        <InputAdornment side="right" interactive={hasReveal} className="gap-1.5">
          {loading ? (
            <InputSpinner />
          ) : (
            <>
              {/* Validation state icon */}
              {hasValidationIcon &&
                (validationState === 'valid' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
                ))}

              {/* Right icon (shifted left when reveal also present) */}
              {hasRightIcon && (
                <span className={cn('pointer-events-none', hasReveal && 'mr-6')}>{rightIcon}</span>
              )}

              {/* Reveal toggle */}
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
        </InputAdornment>
      </div>
    );
  },
);
Input.displayName = 'Input';

// ─── FieldShell ───────────────────────────────────────────────────────────────

/**
 * Internal layout wrapper used by all standalone field components.
 *
 * Responsibilities:
 * - Renders a Label wired to the input `id` with full LabelProps support.
 * - Shows description text — hidden while `error` is active (reduces clutter).
 * - Shows a role="alert" error paragraph, compatible with screen readers.
 * - Forwards `data-disabled` so disabled group styling applies to the Label.
 */
interface FieldShellProps {
  /** Field's `id` — passed to `htmlFor` on the Label. */
  name: string;
  label?: string;
  /** Visually hides the label but keeps it accessible to screen readers. */
  hideLabel?: boolean;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  /** Forwarded to Label as `required`. */
  required?: boolean;
  /** Forwarded to Label as `optional`. */
  optional?: boolean;
  /** Forwarded to Label as `hint`. */
  hint?: string;
  /**
   * Forwarded to Label as `suffix`.
   * Activates `fullWidth` on the label automatically.
   */
  suffix?: React.ReactNode;
  /** Forwarded to Label — controls which variant to use. */
  labelVariant?: LabelProps['variant'];
  /** Forwarded to Label. */
  labelSize?: LabelProps['size'];
  /** Forwarded to Label — shows loading dots in place of label text. */
  labelLoading?: boolean;
  disabled?: boolean;
}

function FieldShell({
  name,
  label,
  hideLabel,
  description,
  error,
  children,
  className,
  required,
  optional,
  hint,
  suffix,
  labelVariant,
  labelSize,
  labelLoading,
  disabled,
}: FieldShellProps) {
  // Resolve label variant: consumer override → auto-error → default
  const resolvedLabelVariant = labelVariant ?? (error ? 'error' : 'default');

  return (
    <div className={cn('space-y-1.5', className)} data-disabled={disabled ? 'true' : undefined}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(hideLabel && 'sr-only')}
          variant={resolvedLabelVariant}
          size={labelSize}
          required={required}
          optional={optional}
          hint={hint}
          suffix={suffix}
          fullWidth={!!suffix}
          loading={labelLoading}
        >
          {label}
        </Label>
      )}

      {children}

      {/* Description suppressed while an error is shown */}
      {description && !error && (
        <p id={`${name}-description`} className="text-xs text-muted-foreground leading-snug">
          {description}
        </p>
      )}

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          aria-live="polite"
          className="text-xs font-medium text-destructive leading-snug"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Shared base props ────────────────────────────────────────────────────────

/**
 * Props common to all controlled field components.
 * Extend this interface for field-specific additions.
 */
export interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  description?: string;
  className?: string;
  inputClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  suffix?: React.ReactNode;
  labelVariant?: LabelProps['variant'];
  labelSize?: LabelProps['size'];
  /** Shows loading dots in the label — useful when field options are async. */
  labelLoading?: boolean;
}

// ─── FormString ───────────────────────────────────────────────────────────────

/**
 * Controlled text input field.
 *
 * - Disables + shows right-slot spinner while form is submitting.
 * - Marks `aria-invalid` and turns the label red on validation error.
 * - Passes `aria-describedby` to both description and error paragraphs.
 */
export function FormString<T extends FieldValues>({
  name,
  label,
  hideLabel,
  placeholder,
  description,
  className,
  inputClassName,
  disabled,
  required,
  optional,
  hint,
  suffix,
  labelVariant,
  labelSize,
  labelLoading,
  leftIcon,
  rightIcon,
}: BaseFieldProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldShell
      name={name}
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      className={className}
      required={required}
      optional={optional}
      hint={hint}
      suffix={suffix}
      labelVariant={labelVariant}
      labelSize={labelSize}
      labelLoading={labelLoading}
      disabled={disabled || isSubmitting}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            type="text"
            {...field}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            loading={isSubmitting}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${name}-error` : description ? `${name}-description` : undefined
            }
            className={inputClassName}
          />
        )}
      />
    </FieldShell>
  );
}

// ─── FormEmail ────────────────────────────────────────────────────────────────

/**
 * Controlled email input.
 * Adds a basic RFC-5322 pattern rule on top of any schema-level validation.
 * The pattern error is surfaced through the same error paragraph as schema errors.
 */
export function FormEmail<T extends FieldValues>({
  name,
  label,
  hideLabel,
  placeholder,
  description,
  className,
  inputClassName,
  disabled,
  required,
  optional,
  hint,
  suffix,
  labelVariant,
  labelSize,
  labelLoading,
  leftIcon = <Mail className="h-4 w-4" />,
  rightIcon,
}: BaseFieldProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldShell
      name={name}
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      className={className}
      required={required}
      optional={optional}
      hint={hint}
      suffix={suffix}
      labelVariant={labelVariant}
      labelSize={labelSize}
      labelLoading={labelLoading}
      disabled={disabled || isSubmitting}
    >
      <Controller
        name={name}
        control={control}
        rules={{
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address.',
          },
        }}
        render={({ field }) => (
          <Input
            type="email"
            id={name}
            {...field}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            loading={isSubmitting}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${name}-error` : description ? `${name}-description` : undefined
            }
            className={inputClassName}
          />
        )}
      />
    </FieldShell>
  );
}

// ─── FormNumber ───────────────────────────────────────────────────────────────

/**
 * Controlled numeric input.
 * Stores the value as a number (via `valueAsNumber`) — NaN when empty.
 * Pair with `z.number()` or `.optional()` in your Zod schema accordingly.
 */
export function FormNumber<T extends FieldValues>({
  name,
  label,
  hideLabel,
  placeholder,
  description,
  className,
  inputClassName,
  disabled,
  required,
  optional,
  hint,
  suffix,
  labelVariant,
  labelSize,
  labelLoading,
  leftIcon,
  rightIcon,
}: BaseFieldProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldShell
      name={name}
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      className={className}
      required={required}
      optional={optional}
      hint={hint}
      suffix={suffix}
      labelVariant={labelVariant}
      labelSize={labelSize}
      labelLoading={labelLoading}
      disabled={disabled || isSubmitting}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            type="number"
            {...field}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.valueAsNumber)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            loading={isSubmitting}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${name}-error` : description ? `${name}-description` : undefined
            }
            className={inputClassName}
          />
        )}
      />
    </FieldShell>
  );
}

// ─── FormPassword ─────────────────────────────────────────────────────────────

export interface FormPasswordProps<T extends FieldValues> extends Omit<
  BaseFieldProps<T>,
  'rightIcon'
> {
  /**
   * Enables the eye / eye-off toggle. Default: true.
   * Set to false in contexts where the toggle is unwanted (e.g. confirm-password).
   */
  showPasswordToggle?: boolean;
}

/**
 * Controlled password input with optional reveal toggle.
 *
 * The reveal button uses `tabIndex={-1}` so it stays out of the form's
 * natural tab order — consistent with platform conventions.
 */
export function FormPassword<T extends FieldValues>({
  name,
  label,
  hideLabel,
  placeholder,
  description,
  className,
  inputClassName,
  disabled,
  required,
  optional,
  hint,
  suffix,
  labelVariant,
  labelSize,
  labelLoading,
  leftIcon = <Lock className="h-4 w-4" />,
  showPasswordToggle = true,
}: FormPasswordProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldShell
      name={name}
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      className={className}
      required={required}
      optional={optional}
      hint={hint}
      suffix={suffix}
      labelVariant={labelVariant}
      labelSize={labelSize}
      labelLoading={labelLoading}
      disabled={disabled || isSubmitting}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            type="password"
            {...field}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            loading={isSubmitting}
            revealToggle={showPasswordToggle}
            leftIcon={leftIcon}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${name}-error` : description ? `${name}-description` : undefined
            }
            className={inputClassName}
          />
        )}
      />
    </FieldShell>
  );
}

// ─── FormDate ────────────────────────────────────────────────────────────────

/**
 * Controlled date input (`type="date"`).
 * Stores value as an ISO date string (YYYY-MM-DD).
 */
export function FormDate<T extends FieldValues>({
  name,
  label,
  hideLabel,
  placeholder,
  description,
  className,
  inputClassName,
  disabled,
  required,
  optional,
  hint,
  suffix,
  labelVariant,
  labelSize,
  labelLoading,
  leftIcon,
  rightIcon,
}: BaseFieldProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldShell
      name={name}
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      className={className}
      required={required}
      optional={optional}
      hint={hint}
      suffix={suffix}
      labelVariant={labelVariant}
      labelSize={labelSize}
      labelLoading={labelLoading}
      disabled={disabled || isSubmitting}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            type="date"
            id={name}
            {...field}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            loading={isSubmitting}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${name}-error` : description ? `${name}-description` : undefined
            }
            className={inputClassName}
          />
        )}
      />
    </FieldShell>
  );
}

// ─── FormAsyncString ──────────────────────────────────────────────────────────

/**
 * Like `FormString` but supports async inline validation with a visual
 * `validationState` prop — showing ✓ or ✕ in the right slot.
 *
 * The validation state is managed externally (e.g. via a debounced API call)
 * and passed in as a prop.
 *
 * @example
 * const [state, setState] = React.useState<'valid' | 'invalid' | 'none'>('none');
 *
 * <FormAsyncString
 *   name="username"
 *   label="Username"
 *   validationState={state}
 *   onChangeDebounced={async (value) => {
 *     const available = await checkUsername(value);
 *     setState(available ? 'valid' : 'invalid');
 *   }}
 * />
 */
export interface FormAsyncStringProps<T extends FieldValues> extends BaseFieldProps<T> {
  validationState?: InputProps['validationState'];
  /** Called with the debounced input value for async validation. */
  onChangeDebounced?: (value: string) => void;
  /** Debounce delay in ms. Default: 400. */
  debounceMs?: number;
}

export function FormAsyncString<T extends FieldValues>({
  name,
  label,
  hideLabel,
  placeholder,
  description,
  className,
  inputClassName,
  disabled,
  required,
  optional,
  hint,
  suffix,
  labelVariant,
  labelSize,
  labelLoading,
  leftIcon,
  rightIcon,
  validationState = 'none',
  onChangeDebounced,
  debounceMs = 400,
}: FormAsyncStringProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = React.useCallback(
    (value: string, fieldOnChange: (v: string) => void) => {
      fieldOnChange(value);
      if (!onChangeDebounced) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChangeDebounced(value), debounceMs);
    },
    [onChangeDebounced, debounceMs],
  );

  // Clean up pending debounce on unmount
  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <FieldShell
      name={name}
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      className={className}
      required={required}
      optional={optional}
      hint={hint}
      suffix={suffix}
      labelVariant={labelVariant}
      labelSize={labelSize}
      labelLoading={labelLoading}
      disabled={disabled || isSubmitting}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            type="text"
            {...field}
            value={field.value ?? ''}
            onChange={(e) => handleChange(e.target.value, field.onChange)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            loading={isSubmitting}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            validationState={validationState}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${name}-error` : description ? `${name}-description` : undefined
            }
            className={inputClassName}
          />
        )}
      />
    </FieldShell>
  );
}

// ─── FormTags ─────────────────────────────────────────────────────────────────

export interface FormTagsProps<T extends FieldValues> extends Omit<
  BaseFieldProps<T>,
  'leftIcon' | 'rightIcon' | 'inputClassName'
> {
  /** Hard cap on the number of tags. Shows n/max counter; disables input at limit. */
  maxTags?: number;
  /**
   * Controls which keys commit a new tag.
   * Default: ['Enter', ',']
   */
  commitKeys?: string[];
}

/**
 * Controlled tag / multi-value input.
 *
 * Enhancements over the original:
 * - Configurable `commitKeys` (Enter and comma by default).
 * - Backspace on empty input removes the last tag.
 * - Duplicate tags are silently ignored.
 * - Spinner and `cursor-wait` via `isSubmitting`.
 * - Full Label integration (required, optional, hint, suffix, labelLoading).
 * - `aria-describedby` wired to both description and error paragraphs.
 * - Tag list uses `role="list"` + `role="listitem"` for AT.
 * - n/max counter positioned safely clear of the spinner.
 */
export function FormTags<T extends FieldValues>({
  name,
  label,
  hideLabel,
  placeholder = 'Add a tag…',
  description,
  className,
  disabled,
  required,
  optional,
  hint,
  suffix,
  labelVariant,
  labelSize,
  labelLoading,
  maxTags,
  commitKeys = ['Enter', ','],
}: FormTagsProps<T>) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const [inputValue, setInputValue] = React.useState('');
  const error = errors[name]?.message as string | undefined;
  const isDisabled = disabled || isSubmitting;

  return (
    <FieldShell
      name={name}
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      className={className}
      required={required}
      optional={optional}
      hint={hint}
      suffix={suffix}
      labelVariant={labelVariant}
      labelSize={labelSize}
      labelLoading={labelLoading}
      disabled={isDisabled}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const tags = (field.value as string[]) ?? [];
          const atLimit = maxTags !== undefined && tags.length >= maxTags;

          const commit = (raw: string) => {
            const trimmed = raw.trim().replace(/,$/, '');
            if (!trimmed || atLimit || tags.includes(trimmed)) return;
            field.onChange([...tags, trimmed] as never);
            setInputValue('');
          };

          return (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id={name}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (commitKeys.includes(e.key)) {
                      e.preventDefault();
                      commit(inputValue);
                    }
                    if (e.key === 'Backspace' && !inputValue && tags.length) {
                      field.onChange(tags.slice(0, -1) as never);
                    }
                  }}
                  onBlur={() => {
                    // Commit on blur so tabbing away doesn't lose typed value
                    if (inputValue.trim()) commit(inputValue);
                  }}
                  placeholder={atLimit ? `Limit of ${maxTags} reached` : placeholder}
                  disabled={isDisabled || atLimit}
                  loading={isSubmitting}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error ? `${name}-error` : description ? `${name}-description` : undefined
                  }
                  // Leave room for the counter
                  className={cn(maxTags !== undefined && !isSubmitting && 'pr-14')}
                />

                {/* n/max counter — hidden while spinner occupies right slot */}
                {maxTags !== undefined && !isSubmitting && (
                  <span
                    className={cn(
                      'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums',
                      atLimit ? 'text-destructive' : 'text-muted-foreground',
                    )}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {tags.length}/{maxTags}
                  </span>
                )}
              </div>

              {tags.length > 0 && (
                <div
                  role="list"
                  aria-label={label ? `${label} tags` : 'Tags'}
                  className={cn(
                    'flex flex-wrap gap-1.5',
                    isDisabled && 'pointer-events-none opacity-50',
                  )}
                >
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      role="listitem"
                      className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        disabled={isDisabled}
                        onClick={() =>
                          field.onChange(tags.filter((t: string) => t !== tag) as never)
                        }
                        aria-label={`Remove tag "${tag}"`}
                        className="ml-0.5 rounded-full text-primary/60 transition-colors hover:text-primary disabled:pointer-events-none"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
    </FieldShell>
  );
}

// ─── FormField wrapper variants ───────────────────────────────────────────────
//
// The components above use their own FieldShell (standalone pattern —
// no FormItem / FormControl context required). If you are using the
// Form + FormField + FormItem + FormControl composition pattern from
// form.tsx, the following HOC-style wrappers integrate with that context
// and forward all Label props through FormLabel automatically.

/**
 * Renders a plain `<Input>` inside the Form composition system
 * (FormField > FormItem > FormControl > FormMessage).
 *
 * All Label props are forwarded through `<FormLabel>`.
 */
export interface FormControlledInputProps
  extends
    InputProps,
    Pick<LabelProps, 'required' | 'optional' | 'hint' | 'suffix' | 'fullWidth' | 'loading'> {
  label?: string;
  description?: string;
}

export const FormControlledInput = React.forwardRef<HTMLInputElement, FormControlledInputProps>(
  (
    {
      label,
      description,
      required,
      optional,
      hint,
      suffix,
      fullWidth,
      loading: labelLoading,
      ...inputProps
    },
    ref,
  ) => {
    return (
      <FormItem>
        {label && (
          <FormLabel
            required={required}
            optional={optional}
            hint={hint}
            suffix={suffix}
            fullWidth={fullWidth}
            loading={labelLoading}
          >
            {label}
          </FormLabel>
        )}
        <FormControl>
          <Input ref={ref} {...inputProps} />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  },
);
FormControlledInput.displayName = 'FormControlledInput';

// ─── Usage Examples ───────────────────────────────────────────────────────────
//
// FormString:
//   <FormString
//     name="fullName"
//     label="Full name"
//     placeholder="John Doe"
//   />
//
// FormEmail:
//   <FormEmail
//     name="email"
//     label="Email address"
//     placeholder="you@example.com"
//     required
//   />
//
// FormNumber:
//   <FormNumber
//     name="age"
//     label="Age"
//     placeholder="18"
//   />
//
// FormPassword:
//   <FormPassword
//     name="password"
//     label="Password"
//     required
//   />
//
// FormPassword without reveal toggle:
//   <FormPassword
//     name="pin"
//     label="Security PIN"
//     showPasswordToggle={false}
//   />
//
// FormDate:
//   <FormDate
//     name="birthday"
//     label="Birthday"
//   />
//
// FormAsyncString:
//   <FormAsyncString
//     name="username"
//     label="Username"
//     validationState="valid"
//     onChangeDebounced={checkUsername}
//   />
//
// FormTags:
//   <FormTags
//     name="skills"
//     label="Skills"
//     placeholder="Add a skill"
//     maxTags={5}
//   />
//
// FormTags with custom commit keys:
//   <FormTags
//     name="keywords"
//     label="Keywords"
//     commitKeys={['Enter', 'Tab']}
//   />
//
// With description:
//   <FormString
//     name="bio"
//     label="Bio"
//     description="Short public description."
//   />
//
// With hint / tooltip:
//   <FormEmail
//     name="email"
//     label="Email"
//     hint="We'll never share your email."
//   />
//
// Optional field:
//   <FormString
//     name="website"
//     label="Website"
//     optional
//   />
//
// Hidden accessible label:
//   <FormString
//     name="search"
//     label="Search"
//     hideLabel
//     placeholder="Search..."
//   />
//
// With left icon:
//   <FormEmail
//     name="email"
//     label="Email"
//     leftIcon={<Mail className="h-4 w-4" />}
//   />
//
// With right icon:
//   <FormString
//     name="search"
//     label="Search"
//     rightIcon={<Search className="h-4 w-4" />}
//   />
//
// With suffix link:
//   <FormPassword
//     name="password"
//     label="Password"
//     suffix={
//       <a
//         href="/forgot-password"
//         className="text-primary hover:underline"
//       >
//         Forgot?
//       </a>
//     }
//   />
//
// With character counter:
//   <FormString
//     name="title"
//     label="Title"
//     suffix={`${title.length}/100`}
//   />
//
// Loading label:
//   <FormString
//     name="country"
//     label="Country"
//     labelLoading
//   />
//
// Strong label variant:
//   <FormString
//     name="company"
//     label="Company"
//     labelVariant="strong"
//   />
//
// Small label:
//   <FormString
//     name="search"
//     label="Search"
//     labelSize="sm"
//   />
//
// Disabled field:
//   <FormString
//     name="disabled"
//     label="Disabled"
//     disabled
//   />
//
// Login form:
//   <Form {...form}>
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="space-y-4"
//     >
//       <FormEmail
//         name="email"
//         label="Email"
//         required
//         leftIcon={<Mail className="h-4 w-4" />}
//       />
//
//       <FormPassword
//         name="password"
//         label="Password"
//         required
//       />
//
//       <Button type="submit">
//         Sign in
//       </Button>
//     </form>
//   </Form>
//
// Profile form:
//   <Form {...form}>
//     <form className="space-y-6">
//       <FormString
//         name="fullName"
//         label="Full name"
//         required
//       />
//
//       <FormEmail
//         name="email"
//         label="Email"
//         required
//       />
//
//       <FormDate
//         name="birthday"
//         label="Birthday"
//         optional
//       />
//
//       <FormTags
//         name="skills"
//         label="Skills"
//         maxTags={10}
//       />
//
//       <Button type="submit">
//         Save profile
//       </Button>
//     </form>
//   </Form>
