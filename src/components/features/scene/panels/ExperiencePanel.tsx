import { experienceData } from '@/content/experience';

interface ExperiencePanelProps {
  experienceId?: string;
}

export function ExperiencePanel({ experienceId }: ExperiencePanelProps) {
  // Gracefully fallback if state is somehow missing
  const activeExperience = experienceData.find((e) => e.id === experienceId) || experienceData[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Block */}
      <div className="flex items-start justify-between gap-3 rounded border border-white/10 bg-black/40 p-4 sm:gap-4 sm:p-6">
        <div className="flex flex-col gap-2">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
            {activeExperience.period}
          </div>
          <h2 className="text-lg font-bold tracking-wide text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] sm:text-2xl">
            {activeExperience.role}
          </h2>
          <div className="text-sm font-medium text-fuchsia-400 sm:text-lg">
            {activeExperience.company}
          </div>
        </div>
        {activeExperience.logo && (
          <div className="flex-shrink-0">
            <img
              src={activeExperience.logo}
              alt={`${activeExperience.company} logo`}
              className="h-12 w-12 rounded border border-white/10 bg-white/5 object-contain p-1 sm:h-16 sm:w-16"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="rounded border border-white/5 bg-black/50 p-6">
        <h4 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-white/50">
          Overview
        </h4>
        <p className="text-base leading-relaxed text-white/90">{activeExperience.description}</p>
      </div>

      {/* Key Achievements List (Conditional) */}
      {activeExperience.achievements && activeExperience.achievements.length > 0 && (
        <div className="rounded border border-white/5 bg-black/50 p-6">
          <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
            Key Achievements
          </h4>
          <ul className="flex flex-col gap-3 pl-4 text-sm text-white/90">
            {activeExperience.achievements.map((item, idx) => (
              <li key={idx} className="list-disc marker:text-cyan-500">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech/Skills Pillbox */}
      <div className="pt-2">
        <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-white/50">
          Core Capabilities
        </h4>
        <div className="flex flex-wrap gap-2">
          {activeExperience.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs font-medium text-white/90"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Image Gallery (Conditional) */}
      {activeExperience.images && activeExperience.images.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {activeExperience.images.map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded border border-white/20">
                <img
                  src={img}
                  alt={`${activeExperience.company} gallery image ${idx + 1}`}
                  className="h-[200px] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
