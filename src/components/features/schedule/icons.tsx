/** Small inline icons for the booking UI — familiar, lightweight, no deps. */
type P = { className?: string };
const base = (className = '') => ({
  className,
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const ClockIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const GlobeIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
  </svg>
);

export const CalendarIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

export const ChevronLeft = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const ArrowLeft = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
