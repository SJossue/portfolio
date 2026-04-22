'use client';

import { A11yAnnouncer } from '@react-three/a11y';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { aboutData } from '@/content/about';
import { projects } from '@/content/projects';
import CountUp from '@/components/ui/CountUp';
import SpotlightCard from '@/components/ui/SpotlightCard';

const GarageHero3D = dynamic(() => import('./GarageHero3D'), { ssr: false });

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ACCENT = 'rgba(249, 115, 22, 1)';
const ACCENT_60 = 'rgba(249, 115, 22, 0.6)';
const ACCENT_20 = 'rgba(249, 115, 22, 0.2)';
const ACCENT_10 = 'rgba(249, 115, 22, 0.1)';

const stats = [
  { label: 'Projects', value: 6 },
  { label: 'Technologies', value: 14 },
  { label: 'Simulations Run', value: 50 },
  { label: 'Years Building', value: 3 },
];

/* ------------------------------------------------------------------ */
/*  Blueprint grid decoration                                          */
/* ------------------------------------------------------------------ */

function BlueprintCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      aria-hidden="true"
    >
      <path d="M10 10 H70 M10 10 V70" stroke="rgba(249, 115, 22, 0.35)" strokeWidth="1" />
      <circle cx="10" cy="10" r="2.5" fill="rgba(249, 115, 22, 0.5)" />
      <path
        d="M30 30 L150 30 L150 150"
        stroke="rgba(249, 115, 22, 0.15)"
        strokeWidth="0.5"
        strokeDasharray="3 5"
      />
      <circle cx="150" cy="30" r="2" fill="rgba(249, 115, 22, 0.3)" />
      <circle cx="150" cy="150" r="2" fill="rgba(249, 115, 22, 0.3)" />
      <path d="M40 90 L70 90 L70 120" stroke="rgba(249, 115, 22, 0.12)" strokeWidth="0.5" />
      <rect
        x="80"
        y="70"
        width="24"
        height="14"
        stroke="rgba(249, 115, 22, 0.18)"
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Project showcase card                                              */
/* ------------------------------------------------------------------ */

function ProjectShowcase({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    const el = detailRef.current;
    if (!el) {
      setExpanded((prev) => !prev);
      return;
    }
    if (expanded) {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setExpanded(false),
      });
    } else {
      setExpanded(true);
      requestAnimationFrame(() => {
        if (!detailRef.current) return;
        gsap.fromTo(
          detailRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' },
        );
      });
    }
  }, [expanded]);

  const hasDetails = project.situation || project.task;
  const isEven = index % 2 === 0;

  return (
    <div className={`flex flex-col gap-6 md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''}`}>
      {/* Image side */}
      {project.heroImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl md:w-1/2">
          <Image src={project.heroImage} alt={project.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Orange glow overlay */}
          <div
            className="absolute inset-0 opacity-25 mix-blend-overlay"
            style={{ background: `linear-gradient(135deg, ${ACCENT_20}, transparent 70%)` }}
          />
          {/* Project index badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md border border-orange-500/30 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-orange-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            PROJECT · {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      )}

      {/* Content side */}
      <div className="flex w-full flex-col justify-center md:w-1/2">
        <SpotlightCard
          className="rounded-xl border border-orange-500/20 bg-white/[0.03] p-6 backdrop-blur-sm"
          spotlightColor={ACCENT_20}
        >
          <h3 className="text-xl font-bold text-white sm:text-2xl">{project.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{project.description}</p>

          {/* Tech pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 font-mono text-[11px] text-orange-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 font-mono text-xs text-orange-300 transition-colors hover:bg-orange-500/20"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {hasDetails && (
              <button
                onClick={handleToggle}
                className="font-mono text-xs text-white/40 transition-colors hover:text-orange-300"
              >
                {expanded ? 'Show less' : 'View case study'}
              </button>
            )}
          </div>

          {/* STAR details */}
          {expanded && (
            <div
              ref={detailRef}
              className="mt-5 space-y-3 overflow-hidden border-t border-orange-500/20 pt-4 text-sm text-white/70"
            >
              {project.situation && (
                <div>
                  <span className="font-mono font-semibold text-orange-300">Situation:</span>{' '}
                  {project.situation}
                </div>
              )}
              {project.task && (
                <div>
                  <span className="font-mono font-semibold text-orange-300">Task:</span>{' '}
                  {project.task}
                </div>
              )}
              {project.action && (
                <div>
                  <span className="font-mono font-semibold text-orange-300">Action:</span>{' '}
                  {project.action}
                </div>
              )}
              {project.solution && (
                <div>
                  <span className="font-mono font-semibold text-orange-300">Result:</span>{' '}
                  {project.solution}
                </div>
              )}
              {project.lessons && project.lessons.length > 0 && (
                <div>
                  <span className="font-mono font-semibold text-orange-200">Lessons:</span>
                  <ul className="mt-1 space-y-1 pl-3">
                    {project.lessons.map((l, j) => (
                      <li key={j}>
                        <span className="mr-1.5 text-orange-300">&#9657;</span> {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.images && project.images.length > 0 && (
                <div className="border-t border-orange-500/10 pt-4">
                  <span className="font-mono text-xs font-semibold text-orange-200">Gallery</span>
                  <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
                    {project.images.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded sm:h-32 sm:w-48"
                      >
                        <Image
                          src={src}
                          alt={`${project.title} image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function GarageWorld() {
  const heroRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Hero title animation
      gsap.fromTo(
        '.garage-hero-title',
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 },
      );
      gsap.fromTo(
        '.garage-hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 },
      );
      gsap.fromTo(
        '.garage-hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power2.out', delay: 0.8 },
      );
    }, heroRef);

    let scrollCtx: gsap.Context | undefined;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      scrollCtx = gsap.context(() => {
        // Stagger project cards
        if (projectsRef.current) {
          gsap.utils.toArray<HTMLElement>('.garage-project-card').forEach((card, i) => {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: i * 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              },
            );
          });
        }

        // Skills section
        if (skillsRef.current) {
          gsap.utils.toArray<HTMLElement>('.garage-skill-item').forEach((item, i) => {
            gsap.fromTo(
              item,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: i * 0.05,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 90%',
                  toggleActions: 'play none none none',
                },
              },
            );
          });
        }

        // Stats section
        if (statsRef.current) {
          gsap.fromTo(
            statsRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            },
          );
        }
      });
    });

    return () => {
      ctx.revert();
      scrollCtx?.revert();
    };
  }, []);

  return (
    <main className="relative min-h-dvh overflow-hidden text-white">
      {/* ---- Blueprint corner decoration ---- */}
      <BlueprintCorner className="left-0 top-0 hidden opacity-70 lg:block" />
      <BlueprintCorner className="right-0 top-1/3 hidden rotate-90 opacity-50 lg:block" />

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative flex min-h-dvh flex-col items-center justify-start px-4 pt-24 sm:pt-32 md:pt-40"
      >
        {/* Background radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${ACCENT_10}, transparent 70%)`,
          }}
        />

        {/* Blueprint grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(249,115,22,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* 3D layer: rotating Accord + floating rings.
            Interactive (drag-to-rotate) on desktop; A11y component announces it to screen readers. */}
        <div className="absolute inset-0 z-0 opacity-85">
          <GarageHero3D />
        </div>

        <div className="pointer-events-none relative z-10 text-center">
          {/* Title */}
          <h1 className="garage-hero-title text-5xl font-black uppercase tracking-tight sm:text-7xl md:text-8xl">
            <span className="block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
              MY
            </span>
            <span className="block bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              GARAGE
            </span>
          </h1>

          {/* Tagline */}
          <p className="garage-hero-subtitle mt-4 font-mono text-xs uppercase tracking-[0.3em] text-orange-300/80">
            Where ideas become real
          </p>

          {/* Accent line */}
          <div
            className="garage-hero-line mx-auto mt-6 h-px w-48 origin-center sm:w-64"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_60}, transparent)` }}
          />

          {/* Scroll hint */}
          <div className="garage-hero-subtitle mt-4 flex flex-col items-center gap-2 text-white/30">
            <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="h-6 w-px animate-pulse bg-gradient-to-b from-orange-400/60 to-transparent" />
          </div>
        </div>

        {/* Short description — bottom right */}
        <div className="garage-hero-subtitle pointer-events-none absolute bottom-8 right-6 z-10 max-w-[240px] text-right sm:bottom-10 sm:right-10">
          <div className="mb-2 ml-auto h-px w-12 bg-gradient-to-l from-orange-400/60 to-transparent" />
          <p className="font-mono text-[11px] leading-relaxed text-white/50 sm:text-xs">
            The workshop where projects, tools, and ideas come together.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURED PROJECTS                                            */}
      {/* ============================================================ */}
      <section ref={projectsRef} className="relative mx-auto max-w-6xl px-4 py-20 sm:py-32">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-300/70">
            Case Studies
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Featured Projects
          </h2>
          <div
            className="mx-auto mt-4 h-px w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_60}, transparent)` }}
          />
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/40">
            Six builds spanning mechanical systems, AI infrastructure, and product UX. Each one a
            different way to think through a problem.
          </p>
        </div>

        <div className="space-y-20 sm:space-y-28">
          {projects.map((project, i) => (
            <div key={project.id} className="garage-project-card">
              <ProjectShowcase project={project} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TOOLS / SKILLS                                               */}
      {/* ============================================================ */}
      <section ref={skillsRef} className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-300/70">
            The Toolbox
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tools &amp; Skills
          </h2>
          <div
            className="mx-auto mt-4 h-px w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_60}, transparent)` }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {aboutData.skills.map((group) => (
            <div
              key={group.category}
              className="garage-skill-item rounded-xl border border-orange-500/15 bg-white/[0.02] p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                {/* Wrench icon decoration */}
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <div className="absolute h-full w-full rounded-md border border-orange-500/30" />
                  <div className="h-2 w-2 rounded-sm bg-orange-400" />
                </div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-orange-300">
                  {group.category}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {group.items.map((skill) => (
                  <div
                    key={skill}
                    className="garage-skill-item flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400/60" />
                    <span className="text-xs text-white/75">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STATS                                                        */}
      {/* ============================================================ */}
      <section ref={statsRef} className="mx-auto max-w-4xl px-4 py-20 sm:py-28">
        <div className="rounded-2xl border border-orange-500/15 bg-white/[0.02] p-8 backdrop-blur-sm sm:p-12">
          <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.25em] text-orange-300/70">
            By the Numbers
          </p>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white sm:text-4xl">
                  <CountUp to={stat.value} duration={2.5} />
                  {stat.value >= 10 && <span className="text-orange-400">+</span>}
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BOTTOM CTA                                                   */}
      {/* ============================================================ */}
      <section className="flex flex-col items-center gap-6 px-4 pb-24 pt-8 text-center">
        <div
          className="h-px w-32"
          style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_20}, transparent)` }}
        />
        <p className="font-mono text-xs uppercase tracking-widest text-white/30">
          Explore more worlds
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-6 py-3 font-mono text-sm text-orange-300 transition-all hover:bg-orange-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.18)]"
          style={{ '--accent': ACCENT } as React.CSSProperties}
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
            className="transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Return to Hub
        </Link>
      </section>

      {/* A11y announcer for @react-three/a11y — must live in the DOM, outside any Canvas */}
      <A11yAnnouncer />
    </main>
  );
}
