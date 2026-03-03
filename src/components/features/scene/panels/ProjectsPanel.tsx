import { projects } from '@/content';
import type { Project } from '@/content';

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-cyan-400/50 hover:bg-white/10">
      <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
      <p className="mb-3 text-sm leading-relaxed text-white/60">{project.description}</p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub`}
            className="text-xs text-white/40 transition-colors hover:text-cyan-400"
          >
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live demo`}
            className="hover:text-magenta-400 text-xs text-white/40 transition-colors hover:text-fuchsia-400"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

export function ProjectsPanel() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-white/50">A curated selection of engineering work.</p>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
