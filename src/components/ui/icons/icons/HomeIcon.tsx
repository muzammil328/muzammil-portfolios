import { IconProps } from '../types';

const HomeIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-9z" />
  </svg>
);

export default HomeIcon;
