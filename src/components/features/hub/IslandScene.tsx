'use client';

import BorderGlow from '@/components/ui/BorderGlow';
import { useTiltEffect } from '@/hooks/useTiltEffect';

interface IslandSceneProps {
  worldId: string;
  worldName: string;
  /** World accent color (hex). Used for the BorderGlow edge + mesh gradient. */
  color: string;
  colorRgb: string;
  isActive: boolean;
  onEnter: () => void;
}

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export default function IslandScene({
  worldId,
  worldName,
  color,
  colorRgb,
  isActive,
  onEnter,
}: IslandSceneProps) {
  const islandRef = useTiltEffect<HTMLButtonElement>(isActive);
  const [h, s, l] = hexToHsl(color);

  return (
    <button
      ref={islandRef}
      type="button"
      data-island-frozen={!isActive}
      onClick={onEnter}
      aria-label={`Enter ${worldName}`}
      className="mx-auto block w-full max-w-[620px] animate-island-float cursor-pointer select-none appearance-none border-0 bg-transparent p-0 text-left 3xl:max-w-[820px] 4xl:max-w-[1080px]"
    >
      <BorderGlow
        glowColor={`${h} ${s} ${l}`}
        backgroundColor="#030318"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1.1}
        coneSpread={28}
        colors={[color, color, color]}
      >
        <div
          className="relative aspect-[2879/1799] w-full"
          style={{
            backgroundImage: `url(/islands/${worldId}.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: `rgba(${colorRgb}, 0.05)`,
          }}
        >
          {/* World-color wash — keeps each island tinted to its theme */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(${colorRgb}, 0.05) 0%, transparent 35%, rgba(${colorRgb}, 0.08) 100%)`,
            }}
          />
        </div>
      </BorderGlow>
    </button>
  );
}
