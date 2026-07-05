import { IconProps } from '../types';

const CameraIcon = ({
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
    <circle cx="12" cy="13" r="4" />
    <path d="M2 7h4l2-3h8l2 3h4v14H2V7z" />
  </svg>
);

export default CameraIcon;
