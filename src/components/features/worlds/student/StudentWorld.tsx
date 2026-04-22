'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { researchData } from '@/content/research';
import { aboutData } from '@/content/about';

gsap.registerPlugin(ScrollTrigger);

const StudentHero3D = dynamic(() => import('./StudentHero3D'), { ssr: false });

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Extract a short abstract from a research body (first real paragraph). */
function extractAbstract(body: string): string {
  const lines = body.split('\n').filter((l) => l.trim().length > 0);
  const para = lines.find(
    (l) =>
      !l.startsWith('#') &&
      !l.startsWith('**By') &&
      !l.startsWith('*') &&
      !l.startsWith('>') &&
      !l.startsWith('---') &&
      !l.startsWith('**Index'),
  );
  if (!para) return '';
  const clean = para.replace(/\*\*/g, '').replace(/\*/g, '');
  return clean.length > 320 ? clean.slice(0, 320).trimEnd() + '...' : clean;
}

/** Extract key topic headings from research body. */
function extractTopics(body: string): string[] {
  const headings = body
    .split('\n')
    .filter((l) => /^##\s/.test(l.trim()))
    .map((l) => l.replace(/^##\s+/, '').trim())
    .filter(
      (h) =>
        !h.toLowerCase().includes('references') &&
        !h.toLowerCase().includes('abstract') &&
        h.length < 60,
    );
  return headings.slice(0, 5);
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.student-hero-title', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.6,
      });
      gsap.from('.student-hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.9,
        stagger: 0.1,
      });
      gsap.from('.student-hero-line', {
        scaleX: 0,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 1.1,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-dvh flex-col items-center justify-start overflow-hidden px-6 pt-24 text-center sm:pt-32 md:pt-40"
    >
      {/* Ambient desk-lamp glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '800px',
          height: '800px',
          background:
            'radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)',
        }}
      />

      {/* 3D layer: floating books, papers, glowing laptop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-80">
        <StudentHero3D />
      </div>

      <div className="pointer-events-none relative z-10 text-center">
        {/* Title */}
        <h1 className="student-hero-title text-5xl font-black uppercase tracking-tight sm:text-7xl md:text-8xl">
          <span className="block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
            THE
          </span>
          <span className="block bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
            STUDENT
          </span>
        </h1>

        {/* Tagline */}
        <p className="student-hero-subtitle mt-4 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          Curiosity, research, late nights
        </p>

        {/* Accent line */}
        <div
          className="student-hero-line mx-auto mt-6 h-px w-48 origin-center sm:w-64"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.6), transparent)',
          }}
        />

        {/* Scroll hint */}
        <div className="student-hero-subtitle mt-4 flex flex-col items-center gap-2 text-white/30">
          <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="h-6 w-px animate-pulse bg-gradient-to-b from-cyan-400/60 to-transparent" />
        </div>
      </div>

      {/* Short description — bottom right */}
      <div className="student-hero-subtitle pointer-events-none absolute bottom-8 right-6 z-10 max-w-[240px] text-right sm:bottom-10 sm:right-10">
        <div className="mb-2 ml-auto h-px w-12 bg-gradient-to-l from-cyan-400/60 to-transparent" />
        <p className="font-mono text-[11px] leading-relaxed text-white/50 sm:text-xs">
          Where every question becomes a study session.
        </p>
      </div>
    </section>
  );
}

function EducationSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-edu-card]', {
        scrollTrigger: {
          trigger: '[data-edu-card]',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative px-6 py-32">
      {/* Section label */}
      <p
        className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em]"
        style={{ color: 'rgba(6,182,212,0.6)' }}
      >
        Education
      </p>
      <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
        Academic Foundation
      </h2>

      <div data-edu-card className="mx-auto max-w-2xl">
        <div
          className="relative overflow-hidden rounded-2xl border p-8 sm:p-10"
          style={{
            borderColor: 'rgba(6,182,212,0.2)',
            background:
              'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(6,182,212,0.02) 100%)',
          }}
        >
          {/* Accent bar */}
          <div
            className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
            style={{ background: 'linear-gradient(to bottom, #06b6d4, #0891b2)' }}
          />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Icon */}
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(6,182,212,0.1)' }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Bachelor of Science in Mechanical Engineering
              </h3>
              <p className="mt-1 text-base font-medium" style={{ color: '#06b6d4' }}>
                Minor in Electrical Engineering
              </p>
              <p className="mt-3 text-sm text-slate-400">
                New Jersey Institute of Technology (NJIT)
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                {aboutData.bio.split('.').slice(1, 3).join('.').trim() + '.'}
              </p>

              {/* Highlight tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  'SolidWorks',
                  'FEA Simulation',
                  'CAD Modeling',
                  'HW/SW Integration',
                  'System Testing',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: 'rgba(6,182,212,0.1)',
                      color: 'rgba(6,182,212,0.85)',
                      border: '1px solid rgba(6,182,212,0.15)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchCard({ title, body, index }: { title: string; body: string; index: number }) {
  const abstract = extractAbstract(body);
  const topics = extractTopics(body);

  return (
    <article
      data-research-card
      className="group relative overflow-hidden rounded-2xl border transition-colors duration-300 hover:border-cyan-500/30"
      style={{
        borderColor: 'rgba(6,182,212,0.12)',
        background: 'rgba(248,250,252,0.03)',
      }}
    >
      {/* Number badge */}
      <div className="absolute right-6 top-6">
        <span
          className="text-6xl font-black tabular-nums leading-none"
          style={{ color: 'rgba(6,182,212,0.07)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative p-6 sm:p-8">
        {/* Paper label */}
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'rgba(6,182,212,0.5)' }}
        >
          Research Paper
        </p>

        <h3 className="text-xl font-bold leading-snug text-white sm:text-2xl">{title}</h3>

        <p className="mt-1 text-xs text-slate-500">By Jossue Sarango</p>

        {/* Abstract */}
        {abstract && <p className="mt-5 text-sm leading-relaxed text-slate-400">{abstract}</p>}

        {/* Topics */}
        {topics.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Key Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md px-2.5 py-1 text-xs font-medium"
                  style={{
                    background: 'rgba(6,182,212,0.08)',
                    color: 'rgba(6,182,212,0.8)',
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom accent line */}
        <div
          className="mt-8 h-px w-full"
          style={{
            background: 'linear-gradient(to right, rgba(6,182,212,0.2), transparent)',
          }}
        />
      </div>
    </article>
  );
}

function ResearchSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-research-card]').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 80,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.15,
          ease: 'power3.out',
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative px-6 py-32">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        }}
      />

      <p
        className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em]"
        style={{ color: 'rgba(6,182,212,0.6)' }}
      >
        Research
      </p>
      <h2 className="mb-6 text-center text-3xl font-bold text-white sm:text-4xl">
        Published Papers
      </h2>
      <p className="mx-auto mb-16 max-w-lg text-center text-sm leading-relaxed text-slate-500">
        Deep dives into the technologies shaping tomorrow &mdash; from hybrid-electric aviation to
        maglev transportation systems.
      </p>

      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {researchData.map((entry, i) => (
          <ResearchCard key={entry.id} title={entry.title} body={entry.body} index={i} />
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-skill-group]').forEach((group, i) => {
        gsap.from(group, {
          scrollTrigger: {
            trigger: group,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.12,
          ease: 'power3.out',
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative px-6 py-32">
      <p
        className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em]"
        style={{ color: 'rgba(6,182,212,0.6)' }}
      >
        Knowledge
      </p>
      <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
        Skills &amp; Expertise
      </h2>

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {aboutData.skills.map((group) => (
          <div
            key={group.category}
            data-skill-group
            className="rounded-xl border p-6"
            style={{
              borderColor: 'rgba(6,182,212,0.1)',
              background: 'rgba(6,182,212,0.02)',
            }}
          >
            <h3
              className="mb-4 text-sm font-bold uppercase tracking-wider"
              style={{ color: '#06b6d4' }}
            >
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors duration-200"
                  style={{
                    background: 'rgba(6,182,212,0.08)',
                    border: '1px solid rgba(6,182,212,0.12)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-cta]', {
        scrollTrigger: {
          trigger: '[data-cta]',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="px-6 pb-32 pt-16">
      <div data-cta className="mx-auto flex max-w-md flex-col items-center text-center">
        {/* Divider */}
        <div className="mb-12 h-px w-24" style={{ background: 'rgba(6,182,212,0.25)' }} />

        <p className="mb-6 text-sm text-slate-500">
          Done studying? Head back to explore other worlds.
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105"
          style={{
            borderColor: 'rgba(6,182,212,0.3)',
            color: '#06b6d4',
            background: 'rgba(6,182,212,0.05)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Return to Hub
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function StudentWorld() {
  return (
    <main className="relative overflow-hidden text-white">
      <HeroSection />
      <EducationSection />
      <ResearchSection />
      <SkillsSection />
      <BottomCTA />
    </main>
  );
}
