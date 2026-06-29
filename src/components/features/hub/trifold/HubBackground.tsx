'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HubBackgroundProps {
  /** Selected world accent, e.g. "249, 115, 22". */
  colorRgb: string;
  /** Selected world id — drives the crossfade between island themes. */
  worldId: string;
}

/**
 * Full-bleed background for the trifold hub. A near-black base with a soft wash
 * tinted to the SELECTED island's color; the wash crossfades when the island
 * changes. (Placeholder for a room scene later — swap the tinted layer below.)
 */
export default function HubBackground({ colorRgb, worldId }: HubBackgroundProps) {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#07070b]" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={worldId}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(110% 90% at 12% -5%, rgba(${colorRgb}, 0.55) 0%, transparent 55%), radial-gradient(110% 90% at 88% 105%, rgba(${colorRgb}, 0.3) 0%, transparent 55%)`,
          }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.6 }}
        />
      </AnimatePresence>

      {/* Depth: faint top sheen + bottom vignette so the glass panels read. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 55%), linear-gradient(to bottom, transparent 38%, rgba(0,0,0,0.45) 100%)',
        }}
      />
      {/* TODO: swap the world-tinted wash above for the room scene image here. */}
    </div>
  );
}
