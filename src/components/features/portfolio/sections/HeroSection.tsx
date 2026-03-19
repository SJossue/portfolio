'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { aboutData, contactLinks } from '@/content';

interface HeroSectionProps {
  onEnter3D: () => void;
}

export function HeroSection({ onEnter3D }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = el.querySelectorAll('[data-hero-anim]');
    gsap.set(items, { y: 30, opacity: 0 });
    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.2,
    });
  }, []);

  return (
    <section className="circuit-grid vignette relative flex min-h-dvh items-center justify-center px-4">
      <div ref={containerRef} className="flex max-w-2xl flex-col items-center gap-6 text-center">
        {/* Headshot */}
        <div data-hero-anim className="corner-brackets p-1">
          <Image
            src={aboutData.images[0]}
            alt={aboutData.name}
            width={140}
            height={140}
            className="rounded-sm"
            priority
          />
        </div>

        {/* Name + role */}
        <div data-hero-anim>
          <h1 className="animate-glitch text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {aboutData.name}
          </h1>
          <p className="mt-2 text-lg text-cyan-400">{aboutData.roleTitle}</p>
        </div>

        {/* Bio one-liner */}
        <p data-hero-anim className="max-w-lg text-sm leading-relaxed text-white/70">
          {aboutData.bio.split('.')[0]}.
        </p>

        {/* Contact links row */}
        <div data-hero-anim className="flex gap-4">
          {contactLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-cyan-400/40 hover:text-cyan-400"
            >
              <span className="mr-1.5 font-bold">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div data-hero-anim className="flex gap-3">
          <a
            href="#about"
            className="rounded bg-white/10 px-5 py-2 text-sm text-white transition-colors hover:bg-white/20"
          >
            Explore
          </a>
          <button
            onClick={onEnter3D}
            className="rounded border border-cyan-400/40 px-5 py-2 text-sm text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.15)] transition-all hover:bg-cyan-400/10 hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
          >
            Enter 3D World
          </button>
        </div>
      </div>
    </section>
  );
}
