'use client';

import { useSceneState } from './useSceneState';

const POINTS = [
  { id: 'projects', x: 30, y: 40, label: 'P', color: '#00f0ff' },
  { id: 'contact', x: 70, y: 70, label: 'C', color: '#ff00cc' },
  { id: 'about', x: 15, y: 65, label: 'A', color: '#00ff88' },
  { id: 'experience', x: 80, y: 40, label: 'E', color: '#ffaa00' },
];

export function Minimap() {
  const selectedSection = useSceneState((s) => s.selectedSection);

  return (
    <div className="absolute left-4 top-12 z-10 hidden sm:block">
      <div className="relative h-24 w-24 rounded border border-cyan-400/10 bg-black/60 backdrop-blur-sm">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-400/20" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-cyan-400/20" />
        </div>

        {/* Location dots */}
        {POINTS.map((point) => (
          <div
            key={point.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                selectedSection === point.id
                  ? 'scale-150 shadow-[0_0_6px_currentColor]'
                  : 'animate-pulse opacity-60'
              }`}
              style={{ backgroundColor: point.color, color: point.color }}
            />
            <span
              className="absolute -right-3 font-mono text-[8px] opacity-40"
              style={{ color: point.color }}
            >
              {point.label}
            </span>
          </div>
        ))}

        {/* Label */}
        <div className="absolute bottom-0.5 right-1 font-mono text-[7px] uppercase tracking-wider text-white/20">
          MAP
        </div>
      </div>
    </div>
  );
}
