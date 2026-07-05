import { IconProps } from '../types';

const CircleIcon = ({
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
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-circle-icon lucide-circle"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export default CircleIcon;
