import { type Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'slide-lr': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 4px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 12px rgba(0, 240, 255, 0.6), 0 0 24px rgba(0, 240, 255, 0.2)' },
        },
      },
      animation: {
        'slide-lr': 'slide-lr 1.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
