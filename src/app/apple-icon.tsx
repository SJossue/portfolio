import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#050510',
        backgroundImage:
          'radial-gradient(ellipse at 30% 25%, rgba(6,182,212,0.25), transparent 60%)',
        color: '#22d3ee',
        fontSize: 96,
        fontWeight: 800,
        fontFamily: 'monospace',
        letterSpacing: -4,
      }}
    >
      JS
    </div>,
    { ...size },
  );
}
