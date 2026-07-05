import type React from 'react';
export type { InputProps } from './components/input';
export type { LabelProps } from './components/label';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}
