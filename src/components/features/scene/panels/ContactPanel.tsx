import { contactLinks } from '@/content';

export function ContactPanel() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-white/50">Get in touch for collaboration or opportunities.</p>

      <div className="flex flex-col gap-3">
        {contactLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-cyan-400/50 hover:bg-white/10"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-fuchsia-500/10 font-mono text-sm text-fuchsia-400 transition-colors group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
              {link.icon}
            </span>
            <div>
              <div className="text-sm font-medium text-white">{link.label}</div>
              <div className="text-xs text-white/40">{link.href.replace(/^mailto:/, '')}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
