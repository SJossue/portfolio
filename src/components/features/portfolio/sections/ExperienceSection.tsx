'use client';

import { experienceData } from '@/content';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '../ScrollReveal';
import { useTiltEffect } from '@/hooks/useTiltEffect';

function ExperienceCard({
  entry,
  index,
}: {
  entry: (typeof experienceData)[number];
  index: number;
}) {
  const ref = useTiltEffect<HTMLDivElement>();

  return (
    <ScrollReveal animation="fade-up" delay={index * 0.05}>
      <div className="relative pl-10 md:pl-12">
        {/* Timeline dot with pulse */}
        <div className="absolute left-[9px] top-1.5 md:left-[13px]">
          <div className="h-2.5 w-2.5 rounded-full border border-cyan-400 bg-black" />
          <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/20" />
        </div>

        {/* Card */}
        <div ref={ref} className="glass-card rounded-lg p-5">
          <span className="font-mono text-xs font-medium text-cyan-400">{entry.period}</span>
          <h3 className="mt-1.5 text-base font-bold text-white">{entry.company}</h3>
          <p className="text-sm text-fuchsia-400">{entry.role}</p>

          <p className="mt-3 text-sm leading-relaxed text-white/70">{entry.description}</p>

          {entry.achievements && entry.achievements.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {entry.achievements.map((a, j) => (
                <li key={j} className="text-sm text-white/60">
                  <span className="mr-1.5 text-cyan-400">▹</span> {a}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-1.5">
            {entry.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] text-cyan-400/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <SectionHeader title="Experience" />
      </ScrollReveal>

      <div className="relative">
        {/* Timeline line — gradient */}
        <div
          className="absolute bottom-0 left-3 top-0 w-px md:left-4"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 240, 255, 0.4), transparent)',
          }}
        />

        <div className="space-y-10">
          {experienceData.map((entry, i) => (
            <ExperienceCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
