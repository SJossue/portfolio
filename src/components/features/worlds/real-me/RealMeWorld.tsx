'use client';

import gsap from 'gsap';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { aboutData } from '@/content/about';
import { contactLinks } from '@/content/contact';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const RealMeHero3D = dynamic(() => import('./RealMeHero3D'), { ssr: false });

const EMERALD = 'rgb(16, 185, 129)';
const EMERALD_DIM = 'rgba(16, 185, 129, 0.15)';
const EMERALD_GLOW = 'rgba(16, 185, 129, 0.4)';

export default function RealMeWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  useSmoothScroll();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tweens: gsap.core.Tween[] = [];

    /* Hero mount entrance — runs immediately without waiting for ScrollTrigger */
    const heroSection = container.querySelector<HTMLElement>('[data-hero-reveal]');
    if (heroSection) {
      const heroChildren = heroSection.querySelectorAll<HTMLElement>('[data-reveal-child]');
      const heroTargets = heroChildren.length > 0 ? heroChildren : [heroSection];
      gsap.set(heroTargets, { y: 40, opacity: 0 });
      const heroTween = gsap.to(heroTargets, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });
      tweens.push(heroTween);
    }

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      const sections = container.querySelectorAll<HTMLElement>('[data-reveal]');
      sections.forEach((section) => {
        const children = section.querySelectorAll<HTMLElement>('[data-reveal-child]');
        const targets = children.length > 0 ? children : [section];

        gsap.set(targets, { y: 40, opacity: 0 });

        const tween = gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
        tweens.push(tween);
      });

      // Hero parallax
      const heroGlow = container.querySelector<HTMLElement>('[data-hero-glow]');
      if (heroGlow) {
        const t = gsap.to(heroGlow, {
          y: 120,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroGlow,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
        tweens.push(t);
      }
    });

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-dvh text-white">
      {/* ── Hero Section ── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-start overflow-hidden px-4 pt-24 sm:pt-32 md:pt-40">
        {/* Background glow */}
        <div
          data-hero-glow
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${EMERALD_DIM}, transparent 70%)`,
          }}
        />

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* 3D layer: rotating robotic arm + floating hex accents */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-80">
          <RealMeHero3D />
        </div>

        <div data-hero-reveal className="pointer-events-none relative z-10 text-center">
          {/* Title */}
          <h1
            data-reveal-child
            className="text-5xl font-black uppercase tracking-tight sm:text-7xl md:text-8xl 3xl:text-9xl 4xl:text-[12rem]"
          >
            <span className="block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
              ABOUT
            </span>
            <span className="block bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-300 bg-clip-text text-transparent">
              ME
            </span>
          </h1>

          {/* Tagline */}
          <p
            data-reveal-child
            className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/80"
          >
            The human behind the code
          </p>

          {/* Accent line */}
          <div
            data-reveal-child
            className="mx-auto mt-6 h-px w-48 origin-center sm:w-64"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6), transparent)',
            }}
          />

          {/* Scroll hint */}
          <div data-reveal-child className="mt-4 flex flex-col items-center gap-2 text-white/30">
            <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="h-6 w-px animate-pulse bg-gradient-to-b from-emerald-400/60 to-transparent" />
          </div>
        </div>

        {/* Short description — bottom right */}
        <div className="pointer-events-none absolute bottom-8 right-6 z-10 max-w-[240px] text-right sm:bottom-10 sm:right-10">
          <div className="mb-2 ml-auto h-px w-12 bg-gradient-to-l from-emerald-400/60 to-transparent" />
          <p className="font-mono text-[11px] leading-relaxed text-white/50 sm:text-xs">
            Connect, chat, and see who I really am.
          </p>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 3xl:max-w-7xl 4xl:max-w-[100rem]">
        {/* Photo collage */}
        <div data-reveal className="mb-16 flex justify-center">
          <div className="relative h-72 w-80 sm:h-80 sm:w-96">
            {aboutData.images.slice(0, 3).map((src, i) => {
              const rotations = [-6, 3, -2];
              const offsets = [
                { top: '0%', left: '0%' },
                { top: '8%', left: '20%' },
                { top: '4%', left: '40%' },
              ];
              return (
                <div
                  key={src}
                  data-reveal-child
                  className="absolute overflow-hidden rounded-xl border-2 shadow-2xl"
                  style={{
                    width: '55%',
                    aspectRatio: '3/4',
                    transform: `rotate(${rotations[i]}deg)`,
                    ...offsets[i],
                    borderColor: i === 1 ? EMERALD : 'rgba(255,255,255,0.1)',
                    zIndex: i === 1 ? 3 : i === 2 ? 2 : 1,
                  }}
                >
                  <Image
                    src={src}
                    alt={`${aboutData.name} photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 200px, 250px"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Name + Role + Ethnicity */}
        <div data-reveal className="mb-12 text-center">
          <h2 data-reveal-child className="text-4xl font-bold sm:text-5xl">
            {aboutData.name}
          </h2>
          <p data-reveal-child className="mt-2 text-lg font-medium" style={{ color: EMERALD }}>
            {aboutData.roleTitle}
          </p>
          <p data-reveal-child className="mt-1 text-sm text-slate-500">
            {aboutData.ethnicity}
          </p>
        </div>

        {/* Bio */}
        <div data-reveal className="mx-auto max-w-3xl">
          <p
            data-reveal-child
            className="text-center text-lg leading-relaxed text-slate-300 sm:text-xl"
          >
            {aboutData.bio}
          </p>
        </div>

        {/* Highlights */}
        <div data-reveal className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {aboutData.highlights.map((h) => (
            <div
              key={h.label}
              data-reveal-child
              className="rounded-2xl border p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:border-emerald-500/50"
              style={{
                background: EMERALD_DIM,
                borderColor: 'rgba(16, 185, 129, 0.2)',
              }}
            >
              <p className="text-2xl font-bold" style={{ color: EMERALD }}>
                {h.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                {h.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills Grid ── */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32 3xl:max-w-7xl 4xl:max-w-[100rem]">
        <div data-reveal className="mb-12 text-center">
          <h2 data-reveal-child className="text-3xl font-bold sm:text-4xl">
            Skills & Expertise
          </h2>
          <div
            data-reveal-child
            className="mx-auto mt-4 h-px w-16"
            style={{ background: EMERALD }}
          />
        </div>

        <div data-reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutData.skills.map((group) => (
            <div
              key={group.category}
              data-reveal-child
              className="rounded-2xl border p-6 backdrop-blur-sm"
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                borderColor: 'rgba(16, 185, 129, 0.15)',
              }}
            >
              <h3
                className="mb-4 text-sm font-semibold uppercase tracking-wider"
                style={{ color: EMERALD }}
              >
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full px-3 py-1 text-xs font-medium text-white transition-shadow duration-300 hover:shadow-lg"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      boxShadow: `0 0 0 1px rgba(16, 185, 129, 0.25)`,
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.boxShadow = `0 0 12px ${EMERALD_GLOW}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.boxShadow =
                        `0 0 0 1px rgba(16, 185, 129, 0.25)`;
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Connect Section ── */}
      <section className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
        <div data-reveal className="mb-12 text-center">
          <h2 data-reveal-child className="text-3xl font-bold sm:text-4xl">
            Connect
          </h2>
          <p data-reveal-child className="mt-3 text-slate-400">
            Reach out on any platform.
          </p>
        </div>

        <div data-reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactLinks.map((link) => (
            <a
              key={link.id}
              data-reveal-child
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="group relative flex flex-col items-center gap-3 rounded-2xl border p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                borderColor: 'rgba(16, 185, 129, 0.15)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${EMERALD_DIM}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold transition-transform duration-300 group-hover:scale-110"
                style={{ background: EMERALD_DIM, color: EMERALD }}
              >
                {link.icon}
              </span>
              <span className="text-lg font-semibold">{link.label}</span>
              <span className="text-xs text-slate-500 transition-colors group-hover:text-slate-400">
                {link.href.replace('mailto:', '').replace('https://', '')}
              </span>
            </a>
          ))}
        </div>

        <div data-reveal className="mt-10 flex flex-col items-center gap-3 text-center">
          <p
            data-reveal-child
            className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500"
          >
            Prefer to talk?
          </p>
          <Link
            href="/book"
            data-reveal-child
            className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: EMERALD_DIM,
              color: EMERALD,
              boxShadow: `0 0 0 1px ${EMERALD_GLOW}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                `0 8px 32px ${EMERALD_DIM}, 0 0 0 1px ${EMERALD}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${EMERALD_GLOW}`;
            }}
          >
            <span aria-hidden>📅</span>
            Book a call
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Personal Touch ── */}
      <section className="px-6 py-24 sm:py-32">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <div
            data-reveal-child
            className="mx-auto mb-6 h-px w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${EMERALD}, transparent)` }}
          />
          <p
            data-reveal-child
            className="text-2xl font-light leading-relaxed text-slate-300 sm:text-3xl"
          >
            Let&apos;s build something{' '}
            <span className="font-semibold" style={{ color: EMERALD }}>
              together
            </span>
            .
          </p>
          <p data-reveal-child className="mt-4 text-sm text-slate-500">
            Whether it&apos;s a product, a system, or an idea worth exploring.
          </p>
        </div>
      </section>

      {/* ── Return to Hub ── */}
      <section className="pb-24 text-center">
        <div data-reveal>
          <Link
            href="/"
            data-reveal-child
            className="inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              borderColor: 'rgba(16, 185, 129, 0.3)',
              color: EMERALD,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = EMERALD_DIM;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${EMERALD_DIM}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Return to Hub
          </Link>
        </div>
      </section>
    </div>
  );
}
