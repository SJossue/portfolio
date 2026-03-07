const TOOL_CATEGORIES = [
  {
    category: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'SQL'],
  },
  {
    category: 'Frameworks',
    items: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Three.js'],
  },
  {
    category: 'DevOps',
    items: ['Docker', 'GitHub Actions', 'Vercel', 'Linux'],
  },
  {
    category: 'Tools',
    items: ['Git', 'SolidWorks', 'Blender', 'Figma', 'Postman'],
  },
];

export function ToolsPanel() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed text-white/70">
        Technologies and tools I use to build modern, performant applications.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {TOOL_CATEGORIES.map((group) => (
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
