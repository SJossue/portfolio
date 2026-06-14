import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const alt = `Book a call with ${siteConfig.author}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function BookOgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        backgroundColor: '#050510',
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 70% 10%, rgba(34,211,238,0.20), transparent 60%), radial-gradient(ellipse 60% 50% at 10% 100%, rgba(167,139,250,0.14), transparent 60%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 22,
          letterSpacing: 8,
          textTransform: 'uppercase',
          color: '#22d3ee',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: '#22d3ee',
          }}
        />
        Scheduling console · availability online
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 28,
          fontSize: 120,
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.0,
        }}
      >
        Book a call
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 28,
          fontSize: 34,
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 880,
        }}
      >
        Pick a time with {siteConfig.author}. Instant confirmation, calendar invite in your inbox —
        no Calendly.
      </div>
      <div style={{ display: 'flex', marginTop: 48, gap: 16 }}>
        {[
          ['Intro Call', '#22d3ee'],
          ['Project Chat', '#a78bfa'],
          ['Mentoring', '#f472b6'],
        ].map(([label, color]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: 999,
              border: `1px solid ${color}66`,
              color,
              fontSize: 24,
              fontFamily: 'monospace',
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
