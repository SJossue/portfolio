'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { projects } from '@/content';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '../ScrollReveal';
import { useTiltEffect } from '@/hooks/useTiltEffect';

function ProjectCard({
  project,
  index,
  expanded,
  onToggle,
}: {
  project: (typeof projects)[number];
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tiltRef = useTiltEffect<HTMLDivElement>();
  const detailRef = useRef<HTMLDivElement>(null);
  const isFeatured = index === 0;

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
      // Animate open after state update triggers render
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

  const hasDetails = project.situation || project.task;

  return (
    <ScrollReveal
      animation="fade-up"
      delay={index * 0.08}
      className={isFeatured ? 'md:col-span-2' : ''}
    >
      <div
        ref={tiltRef}
        className={`group h-full overflow-hidden rounded-lg transition-colors ${
          isFeatured
            ? 'border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-white/[0.03] to-fuchsia-500/10 backdrop-blur-sm'
            : 'glass-card'
        }`}
      >
        {/* Hero image */}
        {project.heroImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {isFeatured && (
              <div className="scanline-overlay absolute inset-0 z-[1]" aria-hidden="true" />
            )}
            {isFeatured && (
              <span className="absolute right-3 top-3 z-10 rounded bg-cyan-400/90 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                Featured
              </span>
            )}
          </div>
        )}

        <div className="p-5">
          <h3 className={`font-bold text-white ${isFeatured ? 'text-lg' : 'text-base'}`}>
            {project.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">{project.description}</p>

          {/* Tech pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] text-cyan-400/80"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links + expand */}
          <div className="mt-4 flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/50 transition-colors hover:text-cyan-400"
              >
                GitHub →
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/50 transition-colors hover:text-cyan-400"
              >
                Live →
              </a>
            )}
            {hasDetails && (
              <button
                onClick={handleToggle}
                className="ml-auto font-mono text-xs text-white/40 transition-colors hover:text-cyan-400"
              >
                {expanded ? 'Show less ↑' : 'View case study →'}
              </button>
            )}
          </div>

          {/* Expanded STAR detail — animated */}
          {expanded && (
            <div
              ref={detailRef}
              className="mt-4 space-y-3 overflow-hidden border-t border-white/10 pt-4 text-sm text-white/70"
            >
              {project.situation && (
                <div>
                  <span className="font-mono font-semibold text-cyan-400">Situation:</span>{' '}
                  {project.situation}
                </div>
              )}
              {project.task && (
                <div>
                  <span className="font-mono font-semibold text-cyan-400">Task:</span>{' '}
                  {project.task}
                </div>
              )}
              {project.action && (
                <div>
                  <span className="font-mono font-semibold text-cyan-400">Action:</span>{' '}
                  {project.action}
                </div>
              )}
              {project.solution && (
                <div>
                  <span className="font-mono font-semibold text-cyan-400">Result:</span>{' '}
                  {project.solution}
                </div>
              )}
              {project.lessons && project.lessons.length > 0 && (
                <div>
                  <span className="font-mono font-semibold text-fuchsia-400">Lessons:</span>
                  <ul className="mt-1 space-y-1 pl-3">
                    {project.lessons.map((l, j) => (
                      <li key={j}>
                        <span className="mr-1.5 text-cyan-400">▹</span> {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.images && project.images.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <span className="font-mono text-xs font-semibold text-fuchsia-400">Gallery</span>
                  <div className="scrollbar-cyber mt-2 flex gap-3 overflow-x-auto pb-2">
                    {project.images.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded"
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
        </div>
      </div>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <SectionHeader title="Projects" />
      </ScrollReveal>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            expanded={expandedId === project.id}
            onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
          />
        ))}
      </div>
    </section>
  );
}
