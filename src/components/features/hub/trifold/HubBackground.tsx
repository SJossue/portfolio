// Plain-green placeholder behind the trifold hub. Isolated here so swapping in
// a room scene later is a one-file change: replace the `background` below with
// an <Image>/CSS background pointing at the room asset.
const BG = '#0f3d2e';

export default function HubBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{ background: BG }}
    >
      {/* Soft vertical depth so the glass panels read against the flat color. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 55%), linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)',
        }}
      />
      {/* TODO: swap the plain green above for the room scene image here. */}
    </div>
  );
}
