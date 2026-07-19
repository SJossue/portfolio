import type { ComponentProps } from 'react';

/**
 * Element → styled-component map handed to `<MDXRemote>` so post bodies render
 * in the site's voice (Space Grotesk body, mono code, cyan accents) without a
 * typography plugin. Syntax tokens are colored by the highlight.js theme
 * imported in the blog layout; here we only style the containers.
 */

const ACCENT = '34, 211, 238';

export const mdxComponents = {
  h1: (props: ComponentProps<'h1'>) => (
    <h1 className="mt-10 text-3xl font-bold tracking-tight text-white first:mt-0" {...props} />
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2
      className="mt-10 border-t border-white/5 pt-8 text-2xl font-bold tracking-tight text-white"
      {...props}
    />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mt-8 text-xl font-semibold text-white" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p className="mt-4 leading-relaxed text-white/75" {...props} />
  ),
  a: ({ href = '', ...props }: ComponentProps<'a'>) => {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="font-medium underline underline-offset-2 transition-opacity hover:opacity-80"
        style={{ color: `rgb(${ACCENT})` }}
        {...props}
      />
    );
  },
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="mt-4 list-disc space-y-1.5 pl-6 text-white/75" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="mt-4 list-decimal space-y-1.5 pl-6 text-white/75" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote
      className="mt-6 border-l-2 pl-4 italic text-white/60"
      style={{ borderColor: `rgba(${ACCENT}, 0.5)` }}
      {...props}
    />
  ),
  strong: (props: ComponentProps<'strong'>) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  code: (props: ComponentProps<'code'>) => (
    <code
      className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-white/90"
      {...props}
    />
  ),
  pre: (props: ComponentProps<'pre'>) => (
    <pre
      className="border-white/8 mt-6 overflow-x-auto rounded-2xl border bg-black/40 p-4 text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  table: (props: ComponentProps<'table'>) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-white/75" {...props} />
    </div>
  ),
  th: (props: ComponentProps<'th'>) => (
    <th
      className="border border-white/10 px-3 py-2 text-left font-semibold text-white"
      {...props}
    />
  ),
  td: (props: ComponentProps<'td'>) => (
    <td className="border border-white/10 px-3 py-2" {...props} />
  ),
};
