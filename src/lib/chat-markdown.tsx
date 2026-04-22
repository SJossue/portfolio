import Link from 'next/link';
import type { ReactNode } from 'react';

import { chatLinks, isInternalHref, isSafeHref } from '@/lib/chat-links';

const INLINE_RE =
  /(\*\*([^*\n]+?)\*\*)|(\*([^*\n]+?)\*)|(`([^`\n]+?)`)|(\[([^\]\n]+?)\]\(([^)\s]+?)\))/g;

const LINK_CLASS = 'underline decoration-dotted underline-offset-2 hover:opacity-80';

function renderLink(href: string, children: ReactNode, key: number): ReactNode {
  if (!isSafeHref(href)) return <span key={key}>{children}</span>;
  if (isInternalHref(href)) {
    return (
      <Link key={key} href={href} className={LINK_CLASS} style={{ color: 'var(--accent)' }}>
        {children}
      </Link>
    );
  }
  const isMail = href.startsWith('mailto:');
  return (
    <a
      key={key}
      href={href}
      target={isMail ? undefined : '_blank'}
      rel={isMail ? undefined : 'noopener noreferrer'}
      className={LINK_CLASS}
      style={{ color: 'var(--accent)' }}
    >
      {children}
    </a>
  );
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function autolink(text: string, used: Set<string>, nextKey: () => number): ReactNode[] {
  const candidates: { pattern: string; href: string }[] = [];
  for (const entry of chatLinks) {
    if (used.has(entry.href)) continue;
    for (const p of entry.patterns) candidates.push({ pattern: p, href: entry.href });
  }
  if (candidates.length === 0) return [text];
  candidates.sort((a, b) => b.pattern.length - a.pattern.length);

  const alternation = candidates.map((c) => escapeRegex(c.pattern)).join('|');
  const re = new RegExp(`\\b(?:${alternation})\\b`, 'gi');

  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const matched = m[0];
    const entry = candidates.find((c) => c.pattern.toLowerCase() === matched.toLowerCase());
    if (!entry || used.has(entry.href)) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(renderLink(entry.href, matched, nextKey()));
    used.add(entry.href);
    last = m.index + matched.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out.length ? out : [text];
}

export function renderChatMarkdown(text: string): ReactNode {
  if (!text) return null;
  const used = new Set<string>();
  let counter = 0;
  const nextKey = () => counter++;

  const nodes: ReactNode[] = [];
  const re = new RegExp(INLINE_RE.source, 'g');
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(...autolink(text.slice(last, m.index), used, nextKey));
    }
    if (m[2] !== undefined) {
      nodes.push(<strong key={nextKey()}>{autolink(m[2], used, nextKey)}</strong>);
    } else if (m[4] !== undefined) {
      nodes.push(<em key={nextKey()}>{autolink(m[4], used, nextKey)}</em>);
    } else if (m[6] !== undefined) {
      nodes.push(
        <code key={nextKey()} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.9em]">
          {m[6]}
        </code>,
      );
    } else if (m[7] !== undefined) {
      nodes.push(renderLink(m[9], m[8], nextKey()));
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    nodes.push(...autolink(text.slice(last), used, nextKey));
  }

  return <>{nodes}</>;
}
