'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experienceData } from '@/content/experience';

const TimelineHero3D = dynamic(() => import('./TimelineHero3D'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Collect unique skills across all experience entries. */
function collectSkills(): string[] {
  const set = new Set<string>();
  experienceData.forEach((e) => e.techStack.forEach((t) => set.add(t)));
  return Array.from(set);
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function TimelineWorld() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      /* Hero entrance */
      if (!prefersReducedMotion) {
        gsap.fromTo(
          '.timeline-hero-title',
          { y: 60, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 },
        );
        gsap.fromTo(
          '.timeline-hero-subtitle',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 },
        );
        gsap.fromTo(
          '.timeline-hero-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power2.out', delay: 0.8 },
        );
      }

      /* Timeline cards */
      const cards = gsap.utils.toArray<HTMLElement>('[data-timeline-card]');
      cards.forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      /* Timeline dots pulse */
      const dots = gsap.utils.toArray<HTMLElement>('[data-timeline-dot]');
      dots.forEach((dot) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      /* Skills tags */
      const tags = gsap.utils.toArray<HTMLElement>('[data-skill-tag]');
      tags.forEach((tag, i) => {
        gsap.from(tag, {
          y: 30,
          opacity: 0,
          duration: 0.4,
          delay: i * 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const skills = collectSkills();

  return (
    <main className="relative min-h-dvh overflow-x-hidden text-white">
      {/* ---- HERO ---- */}
      <section
        ref={heroRef}
        className="relative flex min-h-dvh flex-col items-center justify-start px-6 pt-24 text-center sm:pt-32 md:pt-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,.25) 0%, rgba(3,3,24,1) 70%)',
        }}
      >
        {/* 3D hero scene (sits behind the title text) */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-90" aria-hidden="true">
          <TimelineHero3D />
        </div>

        {/* Soft vignette to keep the title readable over the 3D scene */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(3,3,24,0) 0%, rgba(3,3,24,.55) 55%, rgba(3,3,24,.85) 100%)',
          }}
        />

        <div className="pointer-events-none relative z-10 text-center">
          {/* Title */}
          <h1 className="timeline-hero-title text-5xl font-black uppercase tracking-tight sm:text-7xl md:text-8xl">
            <span className="block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
              MY
            </span>
            <span className="block bg-gradient-to-r from-violet-500 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              TIMELINE
            </span>
          </h1>

          {/* Tagline */}
          <p className="timeline-hero-subtitle mt-4 font-mono text-xs uppercase tracking-[0.3em] text-violet-300/80">
            Milestones along the path so far
          </p>

          {/* Accent line */}
          <div
            className="timeline-hero-line mx-auto mt-6 h-px w-48 origin-center sm:w-64"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent)',
            }}
          />

          {/* Scroll hint */}
          <div className="timeline-hero-subtitle mt-4 flex flex-col items-center gap-2 text-white/30">
            <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="h-6 w-px animate-pulse bg-gradient-to-b from-violet-400/60 to-transparent" />
          </div>
        </div>

        {/* Short description — bottom right */}
        <div className="timeline-hero-subtitle pointer-events-none absolute bottom-8 right-6 z-10 max-w-[240px] text-right sm:bottom-10 sm:right-10">
          <div className="mb-2 ml-auto h-px w-12 bg-gradient-to-l from-violet-400/60 to-transparent" />
          <p className="font-mono text-[11px] leading-relaxed text-white/50 sm:text-xs">
            A journey measured in moments, not titles.
          </p>
        </div>
      </section>

      {/* ---- EXPERIENCE TIMELINE ---- */}
      <section ref={timelineRef} className="relative mx-auto max-w-5xl px-4 py-32">
        <h2 className="mb-20 text-center text-3xl font-bold tracking-wide sm:text-4xl">
          Experience
        </h2>

        {/* Central vertical line */}
        <div
          className="absolute left-1/2 top-40 hidden h-[calc(100%-12rem)] w-px -translate-x-1/2 md:block"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(139,92,246,.5) 10%, rgba(139,92,246,.5) 90%, transparent)',
            boxShadow: '0 0 12px rgba(139,92,246,.35)',
          }}
        />

        {/* Mobile vertical line (left-aligned) */}
        <div
          className="absolute left-6 top-40 h-[calc(100%-12rem)] w-px md:hidden"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(139,92,246,.5) 10%, rgba(139,92,246,.5) 90%, transparent)',
          }}
        />

        <div className="relative flex flex-col gap-20">
          {experienceData.map((entry, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div key={entry.id} className="relative">
                {/* Dot on the timeline (desktop) */}
                <div
                  data-timeline-dot
                  className="absolute left-1/2 top-6 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full md:block"
                  style={{
                    background: 'rgba(139,92,246,1)',
                    boxShadow: '0 0 14px rgba(139,92,246,.6)',
                  }}
                />

                {/* Dot on the timeline (mobile) */}
                <div
                  data-timeline-dot
                  className="absolute left-6 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full md:hidden"
                  style={{
                    background: 'rgba(139,92,246,1)',
                    boxShadow: '0 0 10px rgba(139,92,246,.5)',
                  }}
                />

                {/* Card */}
                <div
                  data-timeline-card
                  className={`relative ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                    isLeft ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'
                  }`}
                >
                  <div
                    className="rounded-2xl border p-6 sm:p-8"
                    style={{
                      background: 'rgba(139,92,246,.06)',
                      borderColor: 'rgba(139,92,246,.18)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                  >
                    <span
                      className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'rgba(139,92,246,.8)' }}
                    >
                      {entry.period}
                    </span>

                    <h3 className="text-xl font-bold leading-snug text-white sm:text-2xl">
                      {entry.role}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-slate-400">{entry.company}</p>

                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                      {entry.description}
                    </p>

                    {/* Tech stack tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {entry.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            background: 'rgba(139,92,246,.12)',
                            color: 'rgba(139,92,246,.9)',
                            border: '1px solid rgba(139,92,246,.2)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- SKILLS / TOOLS ---- */}
      <section ref={skillsRef} className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-wide sm:text-4xl">
          Skills &amp; Tools
        </h2>

        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              data-skill-tag
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-violet-500/20"
              style={{
                background: 'rgba(139,92,246,.08)',
                color: 'rgba(200,180,255,.9)',
                border: '1px solid rgba(139,92,246,.22)',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="flex flex-col items-center gap-4 pb-32 pt-12 text-center">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105"
          style={{
            borderColor: 'rgba(139,92,246,.4)',
            color: 'rgba(139,92,246,1)',
            background: 'rgba(139,92,246,.06)',
          }}
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          Return to Hub
        </Link>
      </section>
    </main>
  );
}
