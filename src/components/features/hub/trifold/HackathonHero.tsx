'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';

import { hackathons } from '@/content/hackathons';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function TrophyIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 flex-shrink-0"
    >
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
      <path d="M10 14.5V18M14 14.5V18M8 20h8M9 18h6v2H9z" />
    </svg>
  );
}

/**
 * Right-panel hero: cycles through hackathon photos, with the respective event's
 * name (and a trophy icon) labeled beneath the photo.
 */
export default function HackathonHero() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((p) => (p + 1) % hackathons.length);
    }, 4500);
    return () => window.clearInterval(t);
  }, []);

  const hack = hackathons[index];
  const fade = {
    initial: reduced ? false : ({ opacity: 0 } as const),
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduced ? 0 : 0.6 },
  };

  return (
    <div className="mb-6">
      {/* Cycling photo — full-bleed to the panel edge and the same height as the
          center hero (both sized by viewport on lg+). */}
      <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-[45dvh]">
        <AnimatePresence initial={false}>
          <motion.div key={hack.id} className="absolute inset-0" {...fade}>
            <Image src={hack.image} alt={hack.name} fill sizes="22rem" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(7,7,11,0.55) 0%, transparent 32%)',
          }}
        />
      </div>

      {/* Respective hackathon — icon on the left, cycling name on the right. */}
      <div className="flex items-center gap-3 px-6 pt-4 text-white">
        <TrophyIcon />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={hack.id} className="text-base font-semibold" {...fade}>
            {hack.name}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
