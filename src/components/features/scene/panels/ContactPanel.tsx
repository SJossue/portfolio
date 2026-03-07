import { contactLinks } from '@/content';

export function ContactPanel() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-white/50">Get in touch for collaboration or opportunities.</p>

      <div className="flex flex-col gap-3">
        {contactLinks.map((link) => {
          const iconStyles: Record<string, string> = {
            github: 'bg-white/20 text-white',
            linkedin: 'bg-[#0A66C2]/20 text-[#0A66C2]',
            email: 'bg-[#EA4335]/20 text-[#EA4335]',
          };
          const borderStyles: Record<string, string> = {
            github: 'border-white/20 hover:border-white/50',
            linkedin: 'border-[#0A66C2]/20 hover:border-[#0A66C2]/50',
            email: 'border-[#EA4335]/20 hover:border-[#EA4335]/50',
          };
          return (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={`group flex items-center gap-4 rounded-lg border bg-white/5 p-4 transition-colors hover:bg-white/10 ${borderStyles[link.id] ?? 'border-white/10 hover:border-cyan-400/50'}`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-md font-mono text-sm ${iconStyles[link.id] ?? 'bg-fuchsia-500/10 text-fuchsia-400'}`}
              >
                {link.icon}
              </span>
              <div>
                <div className="text-sm font-medium text-white">{link.label}</div>
                <div className="text-xs text-white/40">{link.href.replace(/^mailto:/, '')}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
