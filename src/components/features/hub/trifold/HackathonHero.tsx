'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';

import { hackathons } from '@/content/hackathons';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Right-panel hero: cycles through hackathon photos, with that event's logo in
 * a rectangle straddling the bottom edge of the photo (half on, half off).
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
    <div className="relative mb-14 px-5 pt-5">
      <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
        Hackathons
      </p>

      {/* Cycling photo */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <AnimatePresence initial={false}>
          <motion.div key={hack.id} className="absolute inset-0" {...fade}>
            <Image src={hack.image} alt={hack.name} fill sizes="22rem" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(7,7,11,0.65) 0%, transparent 45%)',
          }}
        />
      </div>

      {/* Event logo — a rectangle straddling the photo's bottom edge. */}
      <div className="absolute bottom-0 left-1/2 z-10 aspect-[2/1] w-[64%] -translate-x-1/2 translate-y-1/2 overflow-hidden rounded-xl bg-[#0e0e14] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/20">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div key={hack.id} className="absolute inset-0" {...fade}>
            <Image
              src={hack.logo}
              alt={`${hack.name} logo`}
              fill
              sizes="14rem"
              className="object-contain p-2"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
