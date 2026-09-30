'use client';

import type { ReactNode } from 'react';

import { useLightboxStore, type LightboxImage } from '@/lib/lightbox-store';

interface LightboxTriggerProps {
  /** The full sibling set this image belongs to, in display order. */
  images: LightboxImage[];
  /** This image's position within `images`. */
  index: number;
  className?: string;
  children: ReactNode;
}

/** Wraps a gallery thumbnail so clicking it opens the shared Lightbox at this
 *  image's position within its sibling set. Kept as its own tiny client
 *  component so the gallery grids around it (`Gallery`, `RealMeIsland`) can
 *  stay server-rendered markup. */
export function LightboxTrigger({ images, index, className, children }: LightboxTriggerProps) {
  const open = useLightboxStore((s) => s.open);
  return (
    <button
      type="button"
      onClick={() => open(images, index)}
      className={className}
      aria-label={`View ${images[index]?.alt ?? 'image'} larger`}
    >
      {children}
    </button>
  );
}
