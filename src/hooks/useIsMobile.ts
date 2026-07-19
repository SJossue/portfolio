import { useSyncExternalStore } from 'react';

const DEFAULT_BREAKPOINT = 768;

/** Subscribe/getSnapshot cache keyed by the `max-width` query so repeat calls at the
 *  same breakpoint share one MediaQueryList (and its listeners). */
const cache = new Map<number, { mql: MediaQueryList; subscribe: (cb: () => void) => () => void }>();

function entry(breakpoint: number) {
  let e = cache.get(breakpoint);
  if (!e) {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);
    e = {
      mql,
      subscribe: (cb: () => void) => {
        mql.addEventListener('change', cb);
        return () => mql.removeEventListener('change', cb);
      },
    };
    cache.set(breakpoint, e);
  }
  return e;
}

/**
 * `true` when the viewport is narrower than `breakpoint` (default 768px). Backed by
 * `matchMedia` through `useSyncExternalStore`, so the value is correct on the client's
 * very first render — no `false → true` flash — while the server snapshot stays `false`
 * to keep hydration stable.
 */
export function useIsMobile(breakpoint = DEFAULT_BREAKPOINT) {
  const subscribe = (cb: () => void) => {
    if (typeof window === 'undefined') return () => {};
    return entry(breakpoint).subscribe(cb);
  };
  const getSnapshot = () => (typeof window === 'undefined' ? false : entry(breakpoint).mql.matches);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
