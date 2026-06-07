import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const alt = `${siteConfig.author} — Engineer & Builder`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
          'radial-gradient(ellipse 80% 60% at 30% 20%, rgba(6,182,212,0.18), transparent 60%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 22,
          letterSpacing: 8,
          textTransform: 'uppercase',
          color: '#22d3ee',
          fontFamily: 'monospace',
        }}
      >
        jossue.dev
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 24,
          fontSize: 108,
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.05,
        }}
      >
        Jossue Sarango
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 28,
          fontSize: 36,
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 900,
        }}
      >
        Engineer & builder across hardware and software — FEA, CAD, React, Next.js & applied AI.
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 48,
          gap: 16,
        }}
      >
        {['Garage', 'Timeline', 'Student', 'About'].map((label) => (
          <div
            key={label}
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: 999,
              border: '1px solid rgba(6,182,212,0.4)',
              color: '#67e8f9',
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
