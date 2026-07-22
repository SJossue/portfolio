'use client';

import dynamic from 'next/dynamic';

/**
 * `IslandChat` behind `next/dynamic` (no SSR) so `@ai-sdk/react` and the markdown
 * renderer load in their own chunk instead of the hub/island route's initial
 * bundle. Every call site should import this instead of `./IslandChat` directly.
 * `loading: null` — the chat sits at the bottom of an already-flexible column on
 * every host, so the brief swap-in doesn't shift layout.
 */
const LazyIslandChat = dynamic(() => import('./IslandChat'), { ssr: false });

export default LazyIslandChat;
