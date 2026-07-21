import Image from 'next/image';

/**
 * Full-bleed background for the trifold hub: a fixed, crisp `wallpaper.jpg` scene
 * dissolved into near-black toward the bottom (Spotify-style color bleed). The
 * wallpaper itself stays sharp — only the glass panels blur it, via their
 * backdrop-filter, so they read as a gentle color-at-top → dark-at-bottom wash.
 * Fixed — it no longer reacts to the selected island (the accent still tints the
 * panels via `--world-color-rgb`).
 *
 * Rendered through `next/image` (fill + priority) so it's AVIF/WebP-optimized and
 * preloaded as the above-the-fold LCP candidate instead of a late-discovered CSS
 * background.
 */
export default function HubBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#07070b]" aria-hidden="true">
      {/* Wallpaper — crisp; only the glass panels blur it via backdrop-filter. */}
      <Image
        src="/wallpaper.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Spotify-style dissolve: color reads at the top, then melts into the
          near-black page toward the bottom. Faint top sheen for depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 70% at 50% -5%, rgba(255,255,255,0.06) 0%, transparent 45%), linear-gradient(to bottom, rgba(7,7,11,0.15) 0%, rgba(7,7,11,0.55) 45%, rgba(6,6,10,0.92) 100%)',
        }}
      />
    </div>
  );
}
