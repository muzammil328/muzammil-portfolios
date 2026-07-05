import { IconProps } from '../types';

type ArrowIconProps = IconProps & {
  direction?: 'right' | 'left' | 'up' | 'down';
};

export const ArrowIcon = ({
  direction = 'down',
  className,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}: ArrowIconProps) => {
  const rotation = {
    right: 0,
    left: 180,
    up: -90,
    down: 90,
  }[direction];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <g transform={`rotate(${rotation}, 12, 12)`}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" fill="none" />
      </g>
    </svg>
  );
};

export default ArrowIcon;
