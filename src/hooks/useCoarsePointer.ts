import { useSyncExternalStore } from 'react';

let mql: MediaQueryList | null = null;

function query() {
  if (!mql) mql = window.matchMedia('(pointer: coarse)');
  return mql;
}

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const q = query();
  q.addEventListener('change', cb);
  return () => q.removeEventListener('change', cb);
}

/**
 * `true` on touch/coarse-pointer devices (no precise hover). Backed by
 * `matchMedia('(pointer: coarse)')` via `useSyncExternalStore`, so it's correct on the
 * first client render. Used to switch hover-driven affordances (e.g. the hub's
 * select-then-enter island cards) to a direct single tap.
 */
export function useCoarsePointer() {
  const getSnapshot = () => (typeof window === 'undefined' ? false : query().matches);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
