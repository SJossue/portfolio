import { aboutData } from '@/content';

export function AboutPanel() {
  return (
    <div className="flex flex-col gap-6">
      {/* Bio */}
      <p className="text-sm leading-relaxed text-white/70">{aboutData.bio}</p>

      {/* Highlights */}
      <div className="flex gap-4">
        {aboutData.highlights.map((h) => (
          <div key={h.label} className="flex-1 rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-fuchsia-400">{h.label}</div>
            <div className="mt-1 text-sm font-medium text-white">{h.value}</div>
          </div>
        ))}
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 gap-4">
        {aboutData.skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
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
