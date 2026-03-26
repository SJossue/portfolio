'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { aboutData, contactLinks } from '@/content';
import { useTextSplit } from '@/hooks/useTextSplit';
import { useIsMobile } from '@/hooks/useIsMobile';
import { MagneticWrap } from '@/components/ui/MagneticWrap';

interface HeroSectionProps {
  introComplete?: boolean;
}

export function HeroSection({ introComplete = true }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const isMobile = useIsMobile();
  const { elements: nameElements } = useTextSplit(aboutData.name, 'translate-y-full');

  // Mousemove parallax for gradient (desktop only)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile || !gradientRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      gradientRef.current.style.setProperty('--gx', `${x}%`);
      gradientRef.current.style.setProperty('--gy', `${y}%`);
    },
    [isMobile],
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Animation timeline — wait for intro to complete
  useEffect(() => {
    const el = containerRef.current;
    const roleEl = roleRef.current;
    if (!el || !roleEl) return;
    if (!introComplete) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Instantly show everything
      gsap.set(el.querySelectorAll('.split-char'), { y: 0 });
      gsap.set(el.querySelectorAll('[data-hero-anim]'), { opacity: 1, y: 0 });
      roleEl.textContent = aboutData.roleTitle;
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });
    const chars = el.querySelectorAll('.split-char');

    // 1. Split-text name reveal
    tl.to(chars, {
      y: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: 'power3.out',
    });

    // 2. Typewriter role title
    const roleText = aboutData.roleTitle;
    tl.to(
      {},
      {
        duration: roleText.length * 0.04,
        ease: 'none',
        onUpdate: function () {
          const progress = this.progress();
          const charCount = Math.floor(progress * roleText.length);
          roleEl.textContent = roleText.slice(0, charCount);
        },
      },
      '-=0.2',
    );

    // 3. Stagger in remaining elements
    const animItems = el.querySelectorAll('[data-hero-anim]');
    tl.fromTo(
      animItems,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      },
      '-=0.3',
    );

    return () => {
      tl.kill();
    };
  }, [introComplete]);

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      {/* Animated gradient mesh background */}
      <div
        ref={gradientRef}
        className="gradient-mesh pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      {/* Subtle circuit grid on top */}
      <div className="circuit-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div
        ref={containerRef}
        className="relative z-10 flex max-w-3xl flex-col items-center gap-5 text-center sm:gap-8"
      >
        {/* Headshot */}
        <div data-hero-anim className="corner-brackets p-1 opacity-0">
          <Image
            src={aboutData.images[0]}
            alt={aboutData.name}
            width={140}
            height={140}
            className="h-24 w-24 rounded-sm sm:h-[140px] sm:w-[140px]"
            priority
          />
        </div>

        {/* Name — split-text reveal */}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl">
          {nameElements}
        </h1>

        {/* Role — typewriter */}
        <p className="h-7 text-base text-cyan-400 sm:text-lg md:text-xl">
          <span ref={roleRef} className="font-mono" />
          <span className="animate-typing-cursor ml-0.5" aria-hidden="true" />
        </p>

        {/* Quote */}
        <p
          data-hero-anim
          className="max-w-lg text-sm italic leading-relaxed text-white/70 opacity-0 sm:text-base"
        >
          &ldquo;If you&apos;re going through hell, keep going. Why would you stop?&rdquo;
        </p>

        {/* Contact links */}
        <div data-hero-anim className="flex flex-wrap justify-center gap-3 opacity-0">
          {contactLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-lg px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:text-cyan-400 sm:px-4 sm:py-2 sm:text-xs"
            >
              <span className="mr-1.5 font-bold">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div data-hero-anim className="opacity-0">
          <MagneticWrap>
            <a
              href="#about"
              className="rounded-lg bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Explore
            </a>
          </MagneticWrap>
        </div>

        {/* Scroll indicator */}
        <div data-hero-anim className="mt-4 opacity-0">
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex flex-col items-center gap-1 text-white/40 transition-colors hover:text-cyan-400"
            aria-label="Scroll to content"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
            <svg
              className="h-5 w-5 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
