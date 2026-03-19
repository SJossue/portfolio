'use client';

import { useState } from 'react';
import Image from 'next/image';
import { projects } from '@/content';
import { ScrollReveal } from '../ScrollReveal';

export function ProjectsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <h2 className="mb-12 text-2xl font-bold text-white">
          <span className="text-cyan-400">//</span> Projects
        </h2>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => {
          const expanded = expandedId === project.id;
          return (
            <ScrollReveal key={project.id} animation="fade-up" delay={i * 0.08}>
              <div className="group overflow-hidden rounded border border-white/10 bg-white/[0.03] transition-colors hover:border-cyan-400/20">
                {/* Hero image */}
                {project.heroImage && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-sm font-bold text-white">{project.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    {project.description}
                  </p>

                  {/* Tech pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-400/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links + expand */}
                  <div className="mt-3 flex items-center gap-3">
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
                    {(project.situation || project.task) && (
                      <button
                        onClick={() => setExpandedId(expanded ? null : project.id)}
                        className="ml-auto text-xs text-white/40 transition-colors hover:text-white"
                      >
                        {expanded ? 'Show less' : 'Details'}
                      </button>
                    )}
                  </div>

                  {/* Expanded STAR detail */}
                  {expanded && (
                    <div className="mt-4 space-y-3 border-t border-white/10 pt-4 text-xs text-white/70">
                      {project.situation && (
                        <div>
                          <span className="font-semibold text-cyan-400">Situation:</span>{' '}
                          {project.situation}
                        </div>
                      )}
                      {project.task && (
                        <div>
                          <span className="font-semibold text-cyan-400">Task:</span> {project.task}
                        </div>
                      )}
                      {project.action && (
                        <div>
                          <span className="font-semibold text-cyan-400">Action:</span>{' '}
                          {project.action}
                        </div>
                      )}
                      {project.solution && (
                        <div>
                          <span className="font-semibold text-cyan-400">Result:</span>{' '}
                          {project.solution}
                        </div>
                      )}
                      {project.lessons && project.lessons.length > 0 && (
                        <div>
                          <span className="font-semibold text-fuchsia-400">Lessons:</span>
                          <ul className="mt-1 space-y-0.5 pl-3">
                            {project.lessons.map((l, j) => (
                              <li key={j}>
                                <span className="mr-1 text-cyan-400">▹</span> {l}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
