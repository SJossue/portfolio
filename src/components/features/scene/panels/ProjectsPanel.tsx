import { projects } from '@/content';

interface ProjectsPanelProps {
  projectId: string;
}

export function ProjectsPanel({ projectId }: ProjectsPanelProps) {
  const activeProject = projects.find((p) => p.id === projectId) || projects[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      {activeProject.heroImage && (
        <div className="overflow-hidden rounded border border-white/20 bg-black/60">
          <img
            src={activeProject.heroImage}
            alt={activeProject.title}
            className="h-[180px] w-full object-cover opacity-90 transition-opacity hover:opacity-100 sm:h-[300px]"
          />
        </div>
      )}

      <h2 className="mb-2 text-xl font-bold tracking-wide text-white sm:text-3xl">
        {activeProject.title}
      </h2>

      {/* Links & Tech Stack */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          {activeProject.githubUrl && (
            <a
              href={activeProject.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
            >
              <span className="font-mono">[</span> View Source <span className="font-mono">]</span>
            </a>
          )}
          {activeProject.liveUrl && (
            <a
              href={activeProject.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-fuchsia-400 hover:text-fuchsia-300"
            >
              <span className="font-mono">[</span> Live Demo <span className="font-mono">]</span>
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {activeProject.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* STAR Methodology Sections */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        {activeProject.situation && (
          <div className="flex flex-col gap-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              Situation
            </h4>
            <p className="text-sm leading-relaxed text-white/90">{activeProject.situation}</p>
          </div>
        )}
        {activeProject.task && (
          <div className="flex flex-col gap-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-fuchsia-400">
              Task
            </h4>
            <p className="text-sm leading-relaxed text-white/90">{activeProject.task}</p>
          </div>
        )}
        {activeProject.action && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
              Action & Architecture
            </h4>
            <p className="text-sm leading-relaxed text-white/90">{activeProject.action}</p>
          </div>
        )}
        {activeProject.solution && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
              Result & Impact
            </h4>
            <p className="text-sm leading-relaxed text-white/90">{activeProject.solution}</p>
          </div>
        )}
      </div>

      {/* Lessons & Extra Images */}
      {activeProject.lessons && (
        <div className="mt-8 border-t border-white/10 pt-8">
          <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-white/70">
            Core Engineering Lessons
          </h4>
          <ul className="flex flex-col gap-3 pl-4 text-sm text-white/90">
            {activeProject.lessons.map((lesson, idx) => (
              <li key={idx} className="list-disc marker:text-cyan-500">
                {lesson}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeProject.images && activeProject.images.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          {activeProject.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${activeProject.title} detail ${idx}`}
              className="h-36 w-full rounded object-cover opacity-70 transition-opacity hover:opacity-100 sm:h-48"
            />
          ))}
        </div>
      )}
    </div>
  );
}
