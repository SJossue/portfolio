'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { researchData } from '@/content';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '../ScrollReveal';
import { useTiltEffect } from '@/hooks/useTiltEffect';

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

function ResearchCard({
  entry,
  index,
  expanded,
  onToggle,
}: {
  entry: (typeof researchData)[number];
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tiltRef = useTiltEffect<HTMLDivElement>();
  const detailRef = useRef<HTMLDivElement>(null);
  const preview = entry.body.split('\n').slice(0, 6).join('\n');

  const handleToggle = useCallback(() => {
    const el = detailRef.current;
    if (!el) {
      onToggle();
      return;
    }

    if (expanded) {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onToggle,
      });
    } else {
      onToggle();
      requestAnimationFrame(() => {
        if (!detailRef.current) return;
        gsap.fromTo(
          detailRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' },
        );
      });
    }
  }, [expanded, onToggle]);

  return (
    <ScrollReveal animation="fade-up" delay={index * 0.08}>
      <div ref={tiltRef} className="glass-card overflow-hidden rounded-lg">
        {entry.heroImage && (
          <div className="relative h-40 overflow-hidden sm:h-48 md:h-64">
            <Image src={entry.heroImage} alt={entry.title} fill className="object-cover" />
          </div>
        )}
        <div className="p-5">
          <h3 className="text-base font-bold text-white">{entry.title}</h3>
          <div ref={detailRef} className="mt-3 space-y-1 overflow-hidden">
            {renderMarkdown(expanded ? entry.body : preview)}
          </div>
          <button
            onClick={handleToggle}
            className="mt-3 font-mono text-xs text-cyan-400/70 transition-colors hover:text-cyan-400"
          >
            {expanded ? 'Show less ↑' : 'Read full paper →'}
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function ResearchSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="research" className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <ScrollReveal>
        <SectionHeader title="Research" />
      </ScrollReveal>

      <div className="space-y-8">
        {researchData.map((entry, i) => (
          <ResearchCard
            key={entry.id}
            entry={entry}
            index={i}
            expanded={expandedId === entry.id}
            onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
          />
        ))}
      </div>
    </section>
  );
}
