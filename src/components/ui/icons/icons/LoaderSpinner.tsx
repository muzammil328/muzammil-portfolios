import { IconProps } from '../types';

export const Loader = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <circle cx="12" cy="12" r="10" strokeWidth="4" opacity={0.25} />
    <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" opacity={0.75} />
  </svg>
);

export const LoaderCircle = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
