import { experienceData } from '@/content';
import { ScrollReveal } from '../ScrollReveal';

export function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <h2 className="mb-12 text-2xl font-bold text-white">
          <span className="text-cyan-400">//</span> Experience
        </h2>
      </ScrollReveal>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-3 top-0 w-px bg-white/10 md:left-4" />

        <div className="space-y-10">
          {experienceData.map((entry, i) => (
            <ScrollReveal key={entry.id} animation="fade-up" delay={i * 0.05}>
              <div className="relative pl-10 md:pl-12">
                {/* Timeline dot */}
                <div className="absolute left-[9px] top-1.5 h-2 w-2 rounded-full border border-cyan-400 bg-black md:left-[13px]" />

                {/* Card */}
                <div className="rounded border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs text-cyan-400">{entry.period}</span>
                  <h3 className="mt-1 text-sm font-bold text-white">{entry.company}</h3>
                  <p className="text-xs text-fuchsia-400">{entry.role}</p>

                  <p className="mt-3 text-xs leading-relaxed text-white/70">{entry.description}</p>

                  {entry.achievements && entry.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {entry.achievements.map((a, j) => (
                        <li key={j} className="text-xs text-white/60">
                          <span className="mr-1 text-cyan-400">▹</span> {a}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-400/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
