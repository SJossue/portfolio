/**
 * Shared LogRocket helpers. Session replay is gated to deployed builds (Vercel
 * preview + production) and the SDK is dynamically imported, so it never enters the
 * initial bundle or runs during local `next dev`.
 */

/** Public client identifier; override per-environment with NEXT_PUBLIC_LOGROCKET_ID. */
const APP_ID = process.env.NEXT_PUBLIC_LOGROCKET_ID ?? 'w3kmv1/portfolio';

const enabled = () =>
  typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && Boolean(APP_ID);

/** Initialise session replay. Safe to call once on mount; a no-op off deployed builds. */
export async function initLogRocket(): Promise<void> {
  if (!enabled()) return;
  const { default: LogRocket } = await import('logrocket');
  LogRocket.init(APP_ID);
}

export type LogRocketTraits = Record<string, string | number | boolean>;

/**
 * Link the current session to a known person — used after a visitor books a call,
 * the one place this site learns an identity (name + email). No-op off deployed
 * builds or when `id` is empty, and fire-and-forget: it never throws into the caller.
 */
export async function identifyLogRocketUser(id: string, traits?: LogRocketTraits): Promise<void> {
  if (!enabled() || !id) return;
  try {
    const { default: LogRocket } = await import('logrocket');
    LogRocket.identify(id, traits);
  } catch {
    // Replay identity is best-effort; never disrupt the booking flow.
  }
}
