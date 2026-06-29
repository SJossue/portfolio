import Image from 'next/image';

/**
 * Constant hero banner at the top of the center panel — Jossue's photo with his
 * name overlaid (Spotify-artist style). Stays fixed while islands are selected
 * below it. The photo's dark negative space carries the overlaid title.
 */
export default function StageHero() {
  return (
    <div className="relative aspect-[1600/863] w-full shrink-0 overflow-hidden">
      <Image
        src="/jossue/hero.png"
        alt="Jossue Sarango"
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover object-left"
      />
      {/* Scrim: darken the bottom so the overlaid title stays legible and the
          photo melts into the panel below. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(7,7,11,0.96) 0%, rgba(7,7,11,0.55) 26%, transparent 58%)',
        }}
      />
      <div className="absolute bottom-5 left-7 right-7 text-right">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/55">
          Portfolio
        </p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white sm:text-5xl 3xl:text-6xl">
          Jossue Sarango
        </h1>
        <p className="mt-1.5 text-sm text-white/60">Engineer &amp; builder — hardware × software</p>
      </div>
    </div>
  );
}
