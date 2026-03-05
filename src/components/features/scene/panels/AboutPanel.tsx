import { aboutData } from '@/content';
import { ResumeButton } from './ResumeButton';

export function AboutPanel() {
  return (
    <div className="flex flex-col gap-6">
      {/* Bio */}
      <p className="text-sm leading-relaxed text-white/70">{aboutData.bio}</p>

      {/* Resume download */}
      <ResumeButton />

      {/* Highlights */}
      <div className="flex gap-4">
        {aboutData.highlights.map((h) => (
          <div key={h.label} className="flex-1 border-l-2 border-white/40 bg-white/5 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-white/50">
              {h.label}
            </div>
            <div className="mt-1 font-mono text-lg text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              {h.value}
            </div>
          </div>
        ))}
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 gap-4">
        {aboutData.skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-2 border-b border-white/20 pb-2 font-mono text-xs font-bold uppercase tracking-widest text-white">
              {group.category}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-white/60">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
