'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/lib/cn';
import { Label, type LabelProps } from '../label';

// ─── Form (re-export FormProvider) ───────────────────────────────────────────

// Cast once here to absorb RHF's generic variance issue in strict TS.
// Safe at runtime — FormProvider ignores extra props.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Form = FormProvider as React.ComponentType<
  { children: React.ReactNode } & Record<string, any>
>;

// ─── FormField ────────────────────────────────────────────────────────────────

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// ─── useFormField ─────────────────────────────────────────────────────────────

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext.name) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// ─── FormItem ─────────────────────────────────────────────────────────────────

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-1.5', className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

// ─── FormLabel ────────────────────────────────────────────────────────────────

/**
 * FormLabel is a thin wrapper around `Label` that:
 *
 * 1. Automatically sets `htmlFor` to the associated `FormItem`'s input id.
 * 2. Switches to `variant="error"` when the field has a validation error —
 *    no manual wiring needed.
 * 3. Forwards all `LabelProps` (variant, size, required, optional, hint,
 *    suffix, fullWidth, loading) so FormLabel is a full superset of Label.
 *
 * Do NOT pass `htmlFor` manually — it is derived from `FormItem` context.
 */
type FormLabelProps = Omit<LabelProps, 'htmlFor'>;

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
  ({ className, variant, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    // Automatically downgrade to error variant when the field is invalid,
    // unless the consumer has explicitly set a variant.
    const resolvedVariant = variant ?? (error ? 'error' : 'default');

    return (
      <Label
        ref={ref}
        className={className}
        htmlFor={formItemId}
        variant={resolvedVariant}
        {...props}
      />
    );
  },
);
FormLabel.displayName = 'FormLabel';

// ─── FormControl ──────────────────────────────────────────────────────────────

/**
 * Wraps the field control (Input, Select, Textarea, etc.) via Radix `Slot`.
 * Automatically wires:
 * - `id` → links to the FormLabel's `htmlFor`
 * - `aria-describedby` → points to description + (if invalid) error message
 * - `aria-invalid` → true when the field has a validation error
 *
 * This is the layer that provides ARIA semantics; the Label's `variant="error"`
 * is purely visual. Together they satisfy WCAG 1.3.1 and 4.1.3.
 */
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

// ─── FormDescription ──────────────────────────────────────────────────────────

/**
 * Helper text rendered below the control.
 * Always rendered in the DOM (even if visually hidden) so `aria-describedby`
 * on FormControl always resolves to a valid element.
 */
const FormDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn('text-xs text-muted-foreground leading-snug', className)}
        {...props}
      />
    );
  },
);
FormDescription.displayName = 'FormDescription';

// ─── FormMessage ──────────────────────────────────────────────────────────────

/**
 * Validation error message, rendered below the control (and description).
 *
 * - Prefers `error.message` from react-hook-form when the field is invalid.
 * - Falls back to `children` for manually composed messages.
 * - Returns `null` when there is nothing to display (no error, no children),
 *   so it does not occupy vertical space when the field is valid.
 *
 * The element's `id` is referenced by `FormControl`'s `aria-describedby`
 * when `error` is present, satisfying WCAG 4.1.3 (Status Messages).
 */
const FormMessage = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error.message ?? error) : children;

    if (!body) return null;

    return (
      <p
        ref={ref}
        id={formMessageId}
        role="alert"
        aria-live="polite"
        className={cn('text-xs font-medium text-destructive leading-snug', className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = 'FormMessage';

// ─── FormSection ──────────────────────────────────────────────────────────────

/**
 * Optional layout helper — a titled group of FormItems.
 * Not connected to react-hook-form; purely presentational.
 *
 * @example
 * <FormSection title="Billing Details" description="Used on your invoices.">
 *   <FormField … />
 *   <FormField … />
 * </FormSection>
 */
interface FormSectionProps extends React.ComponentProps<'fieldset'> {
  /** Section heading, rendered as a <legend>. */
  title?: string;
  /** Supporting text beneath the title. */
  description?: string;
}

const FormSection = React.forwardRef<HTMLFieldSetElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={cn('space-y-4 border-0 p-0 m-0 min-w-0', className)}
        {...props}
      >
        {(title || description) && (
          <div className="space-y-0.5">
            {title && (
              <legend className="text-base font-semibold text-foreground leading-none">
                {title}
              </legend>
            )}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        )}
        {children}
      </fieldset>
    );
  },
);
FormSection.displayName = 'FormSection';

// ─── FormRow ──────────────────────────────────────────────────────────────────

/**
 * Optional layout helper — places two or more FormItems side-by-side
 * on wider viewports and stacks them on mobile.
 *
 * @example
 * <FormRow>
 *   <FormField name="firstName" … />
 *   <FormField name="lastName" … />
 * </FormRow>
 */
const FormRow = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)} {...props} />
  ),
);
FormRow.displayName = 'FormRow';

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormSection,
  FormRow,
};

// ─── Usage Examples ───────────────────────────────────────────────────────────
//
// Basic Form Field:
//   <FormField
//     control={form.control}
//     name="email"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel required>Email</FormLabel>
//
//         <FormControl>
//           <Input
//             type="email"
//             placeholder="you@example.com"
//             {...field}
//           />
//         </FormControl>
//
//         <FormDescription>
//           We'll never share your email.
//         </FormDescription>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// Password Field With Suffix Link:
//   <FormField
//     control={form.control}
//     name="password"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel
//           required
//           suffix={
//             <a
//               href="/forgot-password"
//               className="text-primary hover:underline"
//             >
//               Forgot?
//             </a>
//           }
//         >
//           Password
//         </FormLabel>
//
//         <FormControl>
//           <Input
//             type="password"
//             {...field}
//           />
//         </FormControl>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// Optional Field:
//   <FormField
//     control={form.control}
//     name="website"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel optional>
//           Website
//         </FormLabel>
//
//         <FormControl>
//           <Input
//             placeholder="https://example.com"
//             {...field}
//           />
//         </FormControl>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// With Tooltip:
//   <FormField
//     control={form.control}
//     name="username"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel
//           required
//           tooltip="Used in your public profile URL"
//         >
//           Username
//         </FormLabel>
//
//         <FormControl>
//           <Input {...field} />
//         </FormControl>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// Textarea Field:
//   <FormField
//     control={form.control}
//     name="bio"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel
//           optional
//           suffix={`${field.value?.length ?? 0}/160`}
//         >
//           Bio
//         </FormLabel>
//
//         <FormControl>
//           <Textarea
//             rows={4}
//             maxLength={160}
//             {...field}
//           />
//         </FormControl>
//
//         <FormDescription>
//           Short public description.
//         </FormDescription>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// Select Field:
//   <FormField
//     control={form.control}
//     name="role"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel required>
//           Role
//         </FormLabel>
//
//         <Select
//           value={field.value}
//           onValueChange={field.onChange}
//         >
//           <FormControl>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a role" />
//             </SelectTrigger>
//           </FormControl>
//
//           <SelectContent>
//             <SelectItem value="admin">
//               Admin
//             </SelectItem>
//
//             <SelectItem value="editor">
//               Editor
//             </SelectItem>
//           </SelectContent>
//         </Select>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// Checkbox Field:
//   <FormField
//     control={form.control}
//     name="terms"
//     render={({ field }) => (
//       <FormItem className="flex flex-row items-start gap-3 space-y-0">
//         <FormControl>
//           <Checkbox
//             checked={field.value}
//             onCheckedChange={field.onChange}
//           />
//         </FormControl>
//
//         <div className="space-y-1 leading-none">
//           <FormLabel required>
//             Accept terms and conditions
//           </FormLabel>
//
//           <FormDescription>
//             You must accept before continuing.
//           </FormDescription>
//
//           <FormMessage />
//         </div>
//       </FormItem>
//     )}
//   />
//
// Radio Group:
//   <FormField
//     control={form.control}
//     name="theme"
//     render={({ field }) => (
//       <FormItem className="space-y-3">
//         <FormLabel>
//           Theme
//         </FormLabel>
//
//         <FormControl>
//           <RadioGroup
//             value={field.value}
//             onValueChange={field.onChange}
//             className="flex flex-col gap-2"
//           >
//             <div className="flex items-center gap-2">
//               <RadioGroupItem
//                 value="light"
//                 id="light"
//               />
//
//               <Label htmlFor="light">
//                 Light
//               </Label>
//             </div>
//
//             <div className="flex items-center gap-2">
//               <RadioGroupItem
//                 value="dark"
//                 id="dark"
//               />
//
//               <Label htmlFor="dark">
//                 Dark
//               </Label>
//             </div>
//           </RadioGroup>
//         </FormControl>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// File Upload:
//   <FormField
//     control={form.control}
//     name="avatar"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel
//           tooltip="PNG or JPG up to 5MB"
//         >
//           Profile picture
//         </FormLabel>
//
//         <FormControl>
//           <Input
//             type="file"
//             onChange={(e) =>
//               field.onChange(e.target.files?.[0])
//             }
//           />
//         </FormControl>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// Form Section:
//   <FormSection
//     title="Billing Details"
//     description="Used for invoices and receipts."
//   >
//     <FormRow>
//       <FormField ... />
//       <FormField ... />
//     </FormRow>
//
//     <FormField ... />
//   </FormSection>
//
// Form Row:
//   <FormRow>
//     <FormField
//       control={form.control}
//       name="firstName"
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel required>
//             First name
//           </FormLabel>
//
//           <FormControl>
//             <Input {...field} />
//           </FormControl>
//
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//
//     <FormField
//       control={form.control}
//       name="lastName"
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel required>
//             Last name
//           </FormLabel>
//
//           <FormControl>
//             <Input {...field} />
//           </FormControl>
//
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   </FormRow>
//
// Loading State:
//   <FormField
//     control={form.control}
//     name="country"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel loading>
//           Country
//         </FormLabel>
//
//         <FormControl>
//           <Select disabled {...field} />
//         </FormControl>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// Error State (automatic via RHF):
//   <FormField
//     control={form.control}
//     name="email"
//     rules={{
//       required: 'Email is required',
//     }}
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel required>
//           Email
//         </FormLabel>
//
//         <FormControl>
//           <Input {...field} />
//         </FormControl>
//
//         <FormMessage />
//       </FormItem>
//     )}
//   />
//
// Full Form Example:
//   <Form {...form}>
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="space-y-6"
//     >
//       <FormSection
//         title="Account"
//         description="Manage your account settings."
//       >
//         <FormRow>
//           <FormField ... />
//           <FormField ... />
//         </FormRow>
//
//         <FormField ... />
//       </FormSection>
//
//       <Button type="submit">
//         Save changes
//       </Button>
//     </form>
//   </Form>
