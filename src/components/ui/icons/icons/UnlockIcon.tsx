import { IconProps } from '../types';

const UnlockIcon = ({
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
    <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
    <path d="M16 11V7a4 4 0 0 0-8 0" />
  </svg>
);

export default UnlockIcon;
