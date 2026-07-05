import { IconProps } from '../types';

const AttachmentIcon = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <svg
    fill="none"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path d="M21.44 11.05l-9.19 9.2a4 4 0 0 1-5.66-5.66l9.19-9.19a2 2 0 0 1 2.83 2.83l-9.2 9.19a1 1 0 0 1-1.41-1.42l8.49-8.48" />
  </svg>
);

export default AttachmentIcon;
