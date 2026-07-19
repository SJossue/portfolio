import type { ReactNode } from 'react';

interface IslandSectionProps {
  /** Anchor id — referenced by the left-rail TOC / scroll-spy. */
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}

/**
 * An anchored content block in an island's middle panel. Provides the section
 * heading and the scroll-margin so the TOC lands cleanly at the top of it.
 */
export default function IslandSection({ id, eyebrow, title, children }: IslandSectionProps) {
  return (
    <section
      id={id}
      data-island-section
      className="scroll-mt-6 border-t border-white/5 px-6 py-12 first:border-t-0 sm:px-8"
    >
      <header className="mb-7">
        {eyebrow ? (
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      </header>
      {children}
    </section>
  );
}
