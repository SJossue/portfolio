import type { Metadata } from 'next';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/features/blog/mdx-components';
import { StudentSelectTrigger } from '@/components/features/worlds/student/StudentSelectTrigger';
import StudentShell from '@/components/features/worlds/student/StudentShell';
import {
  ACCENT,
  EducationBlock,
  FOCUS,
  PaperCardBody,
  SECTIONS,
  Socials,
  TALLY,
  TopicChips,
  WORLD,
  eyebrow,
} from '@/components/features/worlds/student/StudentStatic';
import { researchData } from '@/content/research';

export const metadata: Metadata = {
  title: 'The Student',
  description: 'Research, education, and the academic journey.',
  alternates: { canonical: '/student' },
  openGraph: {
    title: 'The Student — Jossue Sarango',
    description: 'Research, education, and the academic journey.',
    url: '/student',
  },
};

const introText =
  'The grind behind the build — curiosity that turns into late nights, citations, and the occasional breakthrough. Three papers at the intersection of sustainability, autonomy, and how new transportation technology actually fits into the world.';

// Precompute every paper's detail panels once, server-side, including its MDX
// body (MDX must render in a server component). The client shell only ever
// picks between these ready-made nodes and the overview ones below — the full
// paper prose never reaches the client bundle as data, only as rendered HTML.
const details = Object.fromEntries(
  researchData.map((entry, index) => {
    const left = (
      <>
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
            Paper · {String(index + 1).padStart(2, '0')}
          </p>
          <h2 className="mt-1.5 text-lg font-bold tracking-tight" style={{ color: WORLD.color }}>
            {entry.title}
          </h2>
        </div>
        {entry.topics?.length ? <TopicChips topics={entry.topics} /> : null}
      </>
    );

    const center = (
      <article className="text-white">
        {entry.heroImage ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={entry.heroImage}
              alt={entry.title}
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
          <MDXRemote
            source={entry.body}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />

          {entry.pdfUrl ? (
            <div className="border-white/8 mt-10 border-t pt-6">
              <a
                href={entry.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-colors"
                style={{ borderColor: `rgba(${ACCENT}, 0.4)`, color: `rgb(${ACCENT})` }}
              >
                Download the full PDF <span aria-hidden>&darr;</span>
              </a>
            </div>
          ) : null}
        </div>
      </article>
    );

    const right = (
      <div className="flex h-full flex-col gap-8 p-6 text-white">
        {entry.topics?.length ? (
          <section>
            <p className={eyebrow}>Topics</p>
            <TopicChips topics={entry.topics} />
          </section>
        ) : null}

        {entry.pdfUrl ? (
          <section>
            <p className={eyebrow}>Full Paper</p>
            <a
              href={entry.pdfUrl}
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
    );

    return [entry.id, { left, center, right }];
  }),
);

const paperTitles = Object.fromEntries(researchData.map((p) => [p.id, p.title]));

const overviewCenter = (
  <div className="text-white">
    <section id={SECTIONS[0].id} data-island-section className="scroll-mt-6 px-6 py-12 sm:px-8">
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
      id={SECTIONS[1].id}
      data-island-section
      className="scroll-mt-6 border-t border-white/5 px-6 py-12 sm:px-8"
    >
      <header className="mb-7">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">Papers</p>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">Research</h2>
      </header>
      <div className="space-y-6">
        {researchData.map((entry, i) => (
          <StudentSelectTrigger
            key={entry.id}
            paperId={entry.id}
            className="border-white/8 group block w-full overflow-hidden rounded-2xl border bg-white/[0.03] text-left transition-colors hover:border-[color:var(--world-color)]"
            style={{ ['--world-color' as string]: `rgba(${ACCENT}, 0.5)` }}
          >
            <PaperCardBody entry={entry} index={i} />
          </StudentSelectTrigger>
        ))}
      </div>
    </section>
  </div>
);

const overviewRight = (
  <div className="flex h-full flex-col gap-8 p-6 text-white">
    <section>
      <p className={eyebrow}>By the Numbers</p>
      <div className="grid grid-cols-2 gap-3">
        {TALLY.map((stat) => (
          <div key={stat.label} className="border-white/8 rounded-2xl border bg-white/[0.02] p-4">
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/60">
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

export default function StudentPage() {
  return (
    <StudentShell
      worldName={WORLD.name}
      worldColor={WORLD.color}
      worldColorRgb={WORLD.colorRgb}
      introText={introText}
      overviewCenter={overviewCenter}
      overviewRight={overviewRight}
      paperTitles={paperTitles}
      details={details}
    />
  );
}
