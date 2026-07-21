import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  reactStrictMode: false,
  images: {
    // Serve AVIF (then WebP) from next/image — big byte savings on the photo-heavy
    // hero, gallery, and wallpaper vs. the JPEG/PNG/WebP sources.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
