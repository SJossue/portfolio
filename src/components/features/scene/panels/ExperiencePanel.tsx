import { experienceData } from '@/content/experience';

export function ExperiencePanel() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-white/50">Career timeline and key roles.</p>

      <div className="relative flex flex-col gap-0">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-[7px] top-0 w-px bg-cyan-400/20" />

        {experienceData.map((entry, i) => (
          <div key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Timeline dot */}
            <div className="relative z-10 mt-1.5 flex h-4 w-4 flex-shrink-0 items-center justify-center">
              <div
                className={`h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.5)]' : 'border border-cyan-400/40 bg-black'}`}
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="font-mono text-xs tracking-wider text-cyan-400">{entry.period}</div>
              <h3 className="mt-1 text-sm font-medium text-white">{entry.role}</h3>
              <div className="text-xs text-fuchsia-400">{entry.company}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{entry.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {entry.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
