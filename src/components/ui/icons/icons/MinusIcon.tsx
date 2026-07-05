import { IconProps } from '../types';

const MinusIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default MinusIcon;
