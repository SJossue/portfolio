'use client';

import { useEffect } from 'react';

/** LogRocket app ID (public — shipped to the client). Override per-environment with
 *  NEXT_PUBLIC_LOGROCKET_ID if needed. */
const APP_ID = process.env.NEXT_PUBLIC_LOGROCKET_ID ?? 'w3kmv1/portfolio';

/**
 * Boots LogRocket session replay on the client. Mounted once in the root layout.
 *
 * - Runs only in deployed builds (NODE_ENV === 'production', i.e. Vercel preview +
 *   production) — never during local `next dev`, so dev noise and hot-reloads don't
 *   pollute the session data.
 * - Dynamically imported so LogRocket's ~50KB stays out of the initial JS bundle,
 *   preserving the LCP/bundle posture from docs/PROJECT.md.
 */
export default function LogRocketInit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !APP_ID) return;

    let cancelled = false;
    import('logrocket').then(({ default: LogRocket }) => {
      if (cancelled) return;
      LogRocket.init(APP_ID);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
