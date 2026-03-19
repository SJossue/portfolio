'use client';

import { useState } from 'react';
import Image from 'next/image';
import { researchData } from '@/content';
import { ScrollReveal } from '../ScrollReveal';

/** Minimal markdown renderer for research body text */
function renderMarkdown(body: string) {
  return body.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('# '))
      return (
        <h3 key={i} className="mt-4 text-base font-bold text-white">
          {trimmed.slice(2)}
        </h3>
      );
    if (trimmed.startsWith('## '))
      return (
        <h4 key={i} className="mt-3 text-sm font-semibold text-white/90">
          {trimmed.slice(3)}
        </h4>
      );
    if (trimmed.startsWith('> '))
      return (
        <blockquote
          key={i}
          className="my-2 border-l-2 border-cyan-400/40 pl-3 text-xs italic text-white/60"
        >
          {trimmed.slice(2)}
        </blockquote>
      );
    if (trimmed.startsWith('* '))
      return (
        <li key={i} className="ml-4 text-xs text-white/70">
          {trimmed.slice(2)}
        </li>
      );
    return (
      <p key={i} className="text-xs leading-relaxed text-white/70">
        {trimmed}
      </p>
    );
  });
}

export function ResearchSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="research" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <h2 className="mb-12 text-2xl font-bold text-white">
          <span className="text-cyan-400">//</span> Research
        </h2>
      </ScrollReveal>

      <div className="space-y-8">
        {researchData.map((entry, i) => {
          const expanded = expandedId === entry.id;
          const preview = entry.body.split('\n').slice(0, 6).join('\n');

          return (
            <ScrollReveal key={entry.id} animation="fade-up" delay={i * 0.08}>
              <div className="overflow-hidden rounded border border-white/10 bg-white/[0.03]">
                {entry.heroImage && (
                  <div className="relative h-48 overflow-hidden sm:h-64">
                    <Image src={entry.heroImage} alt={entry.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white">{entry.title}</h3>
                  <div className="mt-3 space-y-1">
                    {renderMarkdown(expanded ? entry.body : preview)}
                  </div>
                  <button
                    onClick={() => setExpandedId(expanded ? null : entry.id)}
                    className="mt-3 text-xs text-cyan-400/70 transition-colors hover:text-cyan-400"
                  >
                    {expanded ? '▴ Show less' : '▾ Read more'}
                  </button>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
