
export const ChevronIconLeft = ({
  className = '',
  size = 20,
  ...props
}: {
  className?: string;
  size?: number;
} & Omit<React.SVGProps<SVGSVGElement>, 'direction'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
};

export const ChevronIconRight = ({
  className = '',
  size = 20,
  ...props
}: {
  className?: string;
  size?: number;
} & Omit<React.SVGProps<SVGSVGElement>, 'direction'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
};

export const ChevronIconTop = ({
  className = '',
  size = 20,
  ...props
}: {
  className?: string;
  size?: number;
} & Omit<React.SVGProps<SVGSVGElement>, 'direction'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
};

export const ChevronIconBottom = ({
  className = '',
  size = 20,
  ...props
}: {
  className?: string;
  size?: number;
} & Omit<React.SVGProps<SVGSVGElement>, 'direction'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};
