'use client';

interface SocialLink {
  id: string;
  label: string;
  href: string;
  external: boolean;
  icon: React.ReactNode;
}

const links: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/SJossue',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[14px] w-[14px]">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jossue-sarango',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[14px] w-[14px]">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
      </svg>
    ),
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/JossueAI',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[13px] w-[13px]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'resume',
    label: 'Resume',
    href: '/resume/JossueSarango-Resume.pdf',
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[14px] w-[14px]"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
        <line x1="8" y1="9" x2="10" y2="9" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:jossuesarango1@gmail.com',
    external: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[14px] w-[14px]"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

interface HubSocialsProps {
  accentColor: string;
  accentRgb: string;
  layout?: 'fixed' | 'inline';
}

export default function HubSocials({ accentColor, accentRgb, layout = 'fixed' }: HubSocialsProps) {
  const navClass =
    layout === 'fixed'
      ? 'fixed left-1/2 top-14 z-30 flex -translate-x-1/2 items-center gap-3'
      : 'flex items-center gap-3';
  return (
    <nav aria-label="Contact links" className={navClass}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          aria-label={link.label}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className="group relative flex h-9 w-9 items-center justify-center rounded-full border text-white/60 transition-all duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none"
          style={{
            background: `rgba(${accentRgb}, 0.04)`,
            borderColor: `rgba(${accentRgb}, 0.18)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `rgba(${accentRgb}, 0.14)`;
            e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.55)`;
            e.currentTarget.style.boxShadow = `0 0 16px rgba(${accentRgb}, 0.35)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `rgba(${accentRgb}, 0.04)`;
            e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.18)`;
            e.currentTarget.style.boxShadow = 'none';
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = accentColor;
            e.currentTarget.style.boxShadow = `0 0 0 2px rgba(${accentRgb}, 0.35)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.18)`;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {link.icon}
        </a>
      ))}
    </nav>
  );
}
