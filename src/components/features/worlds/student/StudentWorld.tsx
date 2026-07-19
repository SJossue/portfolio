'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import HubSocials from '@/components/features/hub/HubSocials';
import IslandChat from '@/components/features/hub/IslandChat';
import TrifoldLayout from '@/components/features/hub/trifold/TrifoldLayout';
import { educationData } from '@/content/education';
import { type ResearchEntry, researchData } from '@/content/research';
import { worlds } from '@/content/worlds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useWorldLoader } from '@/lib/world-loader-store';

const world = worlds.find((w) => w.id === 'student') ?? worlds[0];
const ACCENT = world.colorRgb;

const intro =
  'The grind behind the build — curiosity that turns into late nights, citations, and the occasional breakthrough. Three papers at the intersection of sustainability, autonomy, and how new transportation technology actually fits into the world.';

const eyebrow = 'mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45';

interface SectionRef {
  id: string;
  label: string;
}

const SECTIONS: SectionRef[] = [
  { id: 'education', label: 'Education & Focus' },
  { id: 'research', label: 'Research' },
];

/** Concise, hand-written summaries — never a dump of the markdown body. */
const PAPER_SUMMARIES: Record<string, string> = {
  'future-of-flight':
    'A look at how hybrid-electric propulsion can cut aviation’s carbon footprint and revive regional air travel — pairing electric motors with combustion engines for quieter, cleaner, shorter-haul flight.',
  'hybrid-air-white-paper':
    'A white paper weighing the feasibility of integrating electric and hybrid-electric aircraft systems — the propulsion mechanics, the economic and environmental drivers, and the battery, charging, and infrastructure barriers still in the way.',
  'urban-maglev':
    'A study of how Shanghai’s Transrapid maglev fits into a dense city — analyzing electromagnetic-suspension vibration, ground subsidence, and the monitoring and maintenance practices needed to replicate the line elsewhere.',
};

/** The research topics chip cloud shown in Education & Focus (world stat: 7). */
const RESEARCH_TOPICS = [
  'Autonomous Systems',
  'Ethics',
  'A* Path Planning',
  'Hybrid-Electric Aircraft',
  'Maglev',
  'Sustainability',
  'Urban Mobility',
];

/** The throughlines that connect the papers — the right-rail "Focus" block. */
const FOCUS = ['Sustainable transport', 'Autonomy & ethics', 'Urban mobility'];

/** Right-rail tally — real figures drawn from the paper bodies. */
const TALLY: { label: string; value: string }[] = [
  { label: 'Papers', value: '3' },
  { label: 'Research topics', value: '7' },
  { label: 'Words written', value: '6.3K' },
  { label: 'Works cited', value: '36' },
];

function Socials() {
  return (
    <div className="mt-auto flex justify-center pt-2">
      <HubSocials accentColor={world.color} accentRgb={world.colorRgb} layout="inline" />
    </div>
  );
}

function TopicChips({ topics }: { topics: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {topics.map((t) => (
        <li
          key={t}
          className="rounded-md px-2 py-0.5 font-mono text-[10px]"
          style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/** A selectable paper preview in the overview middle panel. */
function PaperCard({
  entry,
  index,
  onSelect,
}: {
  entry: ResearchEntry;
  index: number;
  onSelect: (e: ResearchEntry) => void;
}) {
  const summary = PAPER_SUMMARIES[entry.id];
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="border-white/8 group block w-full overflow-hidden rounded-2xl border bg-white/[0.03] text-left transition-colors hover:border-[color:var(--world-color)]"
      style={{ ['--world-color' as string]: `rgba(${ACCENT}, 0.5)` }}
    >
      {entry.heroImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={entry.heroImage}
            alt={entry.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div
            className="absolute left-3 top-3 rounded-md border px-2 py-0.5 font-mono text-[10px]"
            style={{
              borderColor: `rgba(${ACCENT}, 0.4)`,
              background: 'rgba(0,0,0,0.4)',
              color: `rgb(${ACCENT})`,
            }}
          >
            PAPER · {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      ) : null}

      <div className="p-5">
        <h3 className="text-lg font-bold text-white">{entry.title}</h3>
        {summary ? <p className="mt-2 text-sm leading-relaxed text-white/60">{summary}</p> : null}

        {entry.topics?.length ? (
          <div className="mt-3">
            <TopicChips topics={entry.topics} />
          </div>
        ) : null}

        <span
          className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold"
          style={{ color: `rgb(${ACCENT})` }}
        >
          Read paper <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </button>
  );
}

/** Education & Focus — the degree, the credibility markers, and the topic cloud.
 *  GPA / graduation / coursework render only once real values land in
 *  `education.ts`, so nothing placeholder ever ships. */
function EducationBlock() {
  const { schoolShort, degree, minor, gpa, gradTerm, coursework, honors } = educationData;
  return (
    <div className="space-y-6">
      <div className="border-white/8 rounded-2xl border bg-white/[0.03] p-5">
        <p
          className="font-mono text-xs font-bold uppercase tracking-wider"
          style={{ color: `rgb(${ACCENT})` }}
        >
          {schoolShort}
        </p>
        <h3 className="mt-2 text-lg font-bold text-white">{degree}</h3>
        {minor ? (
          <p className="mt-1 text-sm text-white/60">
            Minor in {minor} — New Jersey Institute of Technology.
          </p>
        ) : null}
        {gpa || gradTerm ? (
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {gpa ? (
              <div>
                <p className="text-xl font-black text-white">{gpa}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">GPA</p>
              </div>
            ) : null}
            {gradTerm ? (
              <div>
                <p className="text-xl font-black text-white">{gradTerm}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Expected graduation
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {honors.length > 0 ? (
        <div>
          <p className={eyebrow}>Honors &amp; Fellowships</p>
          <ul className="space-y-2">
            {honors.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm text-white/75">
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: `rgb(${ACCENT})` }}
                />
                {h}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {coursework.length > 0 ? (
        <div>
          <p className={eyebrow}>Relevant Coursework</p>
          <ul className="flex flex-wrap gap-1.5">
            {coursework.map((c) => (
              <li
                key={c}
                className="border-white/8 rounded-lg border bg-white/[0.03] px-2.5 py-1 text-xs text-white/75"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className={eyebrow}>Research Topics</p>
        <ul className="flex flex-wrap gap-1.5">
          {RESEARCH_TOPICS.map((topic) => (
            <li
              key={topic}
              className="border-white/8 rounded-lg border bg-white/[0.03] px-2.5 py-1 text-xs text-white/75"
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface StudentWorldProps {
  /** Paper bodies pre-rendered from markdown on the server, keyed by paper id. */
  renderedPapers: Record<string, ReactNode>;
}

/**
 * The Student — a self-contained trifold that swaps its three panels between an
 * overview (academic summary · paper cards · education) and a per-paper reading
 * view (hero + full rendered paper + PDF), all via client state (no route
 * change). Renders `TrifoldLayout` directly so the panel geometry matches the
 * world loader for a seamless handoff, mirroring the garage world.
 */
export default function StudentWorld({ renderedPapers }: StudentWorldProps) {
  const markReady = useWorldLoader((s) => s.markReady);
  const dismiss = useWorldLoader((s) => s.dismiss);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<ResearchEntry | null>(null);
  const [active, setActive] = useState(SECTIONS[0]?.id);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Signal the world loader to dismiss once the island chrome has painted.
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) markReady();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [markReady]);

  // Safety net: force-dismiss the loader if it's somehow still up after 6s.
  useEffect(() => {
    const t = window.setTimeout(() => dismiss(), 6000);
    return () => window.clearTimeout(t);
  }, [dismiss]);

  // Scroll-spy for the overview TOC — only meaningful when no paper is selected.
  useEffect(() => {
    if (selected) return;
    const root = isMobile ? null : scrollRef.current;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { root, rootMargin: '-15% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selected, isMobile]);

  const select = (e: ResearchEntry) => {
    setSelected(e);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const go = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setActive(id);
  };

  const paperIndex = selected ? researchData.findIndex((p) => p.id === selected.id) : -1;

  // ── Left panel ────────────────────────────────────────────────────────────
  const left = selected ? (
    <div className="flex h-full flex-col gap-5 p-6">
      <button
        type="button"
        onClick={() => setSelected(null)}
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Research
      </button>

      <div>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
          Paper · {String(paperIndex + 1).padStart(2, '0')}
        </p>
        <h2 className="mt-1.5 text-lg font-bold tracking-tight" style={{ color: world.color }}>
          {selected.title}
        </h2>
      </div>

      {selected.topics?.length ? <TopicChips topics={selected.topics} /> : null}

      {/* Paper-scoped assistant — ask questions about this specific paper. */}
      <div className="mt-auto pt-2">
        <IslandChat
          key={selected.id}
          projectId={selected.id}
          projectLabel={selected.title}
          accentColor={world.color}
          accentRgb={world.colorRgb}
          isMobile={isMobile}
          defaultMinimized={isMobile}
        />
      </div>
    </div>
  ) : (
    <div className="flex h-full flex-col gap-5 p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Hub
      </Link>
      <div>
        <p className="text-lg font-bold tracking-tight" style={{ color: world.color }}>
          {world.name}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-white/60">{intro}</p>

      <nav
        aria-label="On this page"
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {SECTIONS.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-current={on ? 'true' : undefined}
              className="flex-shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors lg:border-l-2"
              style={{
                color: on ? '#fff' : 'rgba(255,255,255,0.55)',
                background: on && isMobile ? `rgba(${ACCENT}, 0.16)` : 'transparent',
                borderColor: on && !isMobile ? world.color : 'transparent',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* General assistant — pinned to the bottom of the rail. */}
      <div className="mt-auto pt-2">
        <IslandChat
          accentColor={world.color}
          accentRgb={world.colorRgb}
          isMobile={isMobile}
          defaultMinimized={isMobile}
        />
      </div>
    </div>
  );

  // ── Center panel ──────────────────────────────────────────────────────────
  const center = (
    <div key={selected?.id ?? 'overview'} ref={scrollRef} className="lg:h-full lg:overflow-y-auto">
      {selected ? (
        <article className="text-white">
          {selected.heroImage ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={selected.heroImage}
                alt={selected.title}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full" style={{ background: `rgba(${ACCENT}, 0.12)` }} />
          )}
          <div className="mx-auto max-w-2xl px-6 py-8 sm:px-8">
            {/* Full paper body, rendered from markdown on the server. */}
            {renderedPapers[selected.id]}

            {selected.pdfUrl ? (
              <div className="border-white/8 mt-10 border-t pt-6">
                <a
                  href={selected.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-colors"
                  style={{
                    borderColor: `rgba(${ACCENT}, 0.4)`,
                    color: `rgb(${ACCENT})`,
                  }}
                >
                  Download the full PDF <span aria-hidden>&darr;</span>
                </a>
              </div>
            ) : null}
          </div>
        </article>
      ) : (
        <div className="text-white">
          <section id="education" data-island-section className="scroll-mt-6 px-6 py-12 sm:px-8">
            <header className="mb-7">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
                Foundation
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                Education &amp; Focus
              </h2>
            </header>
            <EducationBlock />
          </section>

          <section
            id="research"
            data-island-section
            className="scroll-mt-6 border-t border-white/5 px-6 py-12 sm:px-8"
          >
            <header className="mb-7">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
                Papers
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">Research</h2>
            </header>
            <div className="space-y-6">
              {researchData.map((entry, i) => (
                <PaperCard key={entry.id} entry={entry} index={i} onSelect={select} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );

  // ── Right panel ───────────────────────────────────────────────────────────
  const right = selected ? (
    <div className="flex h-full flex-col gap-8 p-6 text-white">
      {selected.topics?.length ? (
        <section>
          <p className={eyebrow}>Topics</p>
          <TopicChips topics={selected.topics} />
        </section>
      ) : null}

      {selected.pdfUrl ? (
        <section>
          <p className={eyebrow}>Full Paper</p>
          <a
            href={selected.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-white/8 flex items-center justify-between gap-2 rounded-lg border bg-white/[0.02] px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/15 hover:text-white"
          >
            Download PDF
            <span aria-hidden className="text-white/30">
              &darr;
            </span>
          </a>
        </section>
      ) : null}

      <Socials />
    </div>
  ) : (
    <div className="flex h-full flex-col gap-8 p-6 text-white">
      <section>
        <p className={eyebrow}>By the Numbers</p>
        <div className="grid grid-cols-2 gap-3">
          {TALLY.map((stat) => (
            <div key={stat.label} className="border-white/8 rounded-2xl border bg-white/[0.02] p-4">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className={eyebrow}>Focus</p>
        <ul className="flex flex-wrap gap-1.5">
          {FOCUS.map((f) => (
            <li
              key={f}
              className="rounded-lg border px-2.5 py-1 text-xs text-white/75"
              style={{ borderColor: `rgba(${ACCENT}, 0.2)`, background: `rgba(${ACCENT}, 0.07)` }}
            >
              {f}
            </li>
          ))}
        </ul>
      </section>

      <Socials />
    </div>
  );

  return (
    <TrifoldLayout
      colorRgb={world.colorRgb}
      lead={
        <a
          href="#student-main"
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
        >
          Skip to content
        </a>
      }
      left={{ as: 'aside', panelProps: { 'aria-label': 'Research navigation' }, children: left }}
      center={{
        as: 'section',
        panelProps: { id: 'student-main', tabIndex: -1, 'aria-label': world.name },
        children: center,
      }}
      right={{ as: 'aside', panelProps: { 'aria-label': 'Paper details' }, children: right }}
    />
  );
}
