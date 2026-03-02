import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: '#f6f8fb',
        ink: '#101828',
        accent: '#0f766e',
      },
    },
  },
  plugins: [],
};

export default config;
