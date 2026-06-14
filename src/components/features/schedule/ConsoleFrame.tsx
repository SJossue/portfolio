import type { PropsWithChildren } from 'react';

interface ConsoleFrameProps extends PropsWithChildren {
  /** Mono label shown in the top-left bracket, e.g. "01 / MEETING". */
  label?: string;
  className?: string;
}

/**
 * A HUD-style panel: faint border, four glowing corner brackets, and an
 * optional mono label. Brackets recolor with the active `--accent`.
 */
export function ConsoleFrame({ label, className = '', children }: ConsoleFrameProps) {
  const corner = 'pointer-events-none absolute h-4 w-4 border-[color:var(--accent,#22d3ee)]/70';
  return (
    <div
      className={`relative rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 backdrop-blur-sm sm:p-6 ${className}`}
    >
      <span className={`${corner} left-0 top-0 rounded-tl-2xl border-l border-t`} />
      <span className={`${corner} right-0 top-0 rounded-tr-2xl border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 rounded-bl-2xl border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 rounded-br-2xl border-b border-r`} />
      {label ? (
        <div className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--accent,#22d3ee)]">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}
