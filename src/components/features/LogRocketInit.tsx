'use client';

import { useEffect } from 'react';

import { initLogRocket } from '@/lib/logrocket';

/**
 * Boots LogRocket session replay on the client. Mounted once in the root layout.
 * The gating (deployed-only) and dynamic import live in `@/lib/logrocket`, which the
 * booking flow also uses for `identify`.
 */
export default function LogRocketInit() {
  useEffect(() => {
    void initLogRocket();
  }, []);

  return null;
}
