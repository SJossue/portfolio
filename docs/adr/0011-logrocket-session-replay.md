# ADR 0011: LogRocket Session Replay

**Status**: Accepted
**Date**: 2026-07-20
**Deciders**: Project owner

## Context

The portfolio ships analytics (`@vercel/analytics`) and performance telemetry
(`@vercel/speed-insights`), but neither shows _what a visitor actually did_ — the
path through the trifold hub, where they hesitated, or the client-side state when
a JS error fired. For a heavily interactive, animation-driven site (world loader,
island navigation, AI chat, booking flow), qualitative session replay is the
missing signal for diagnosing UX friction and hard-to-reproduce bugs.

## Decision

Add **LogRocket** for session replay + frontend error capture.

- `LogRocketInit` (`src/components/features/LogRocketInit.tsx`) is a client
  component mounted once in the root `layout.tsx`.
- It initializes **only in deployed builds** (`NODE_ENV === 'production'`, which
  covers both Vercel preview and production) — never during local `next dev`.
- The SDK is **dynamically imported** inside a `useEffect`, keeping its ~50KB out
  of the initial bundle so the first paint / LCP posture is unaffected.
- The app ID (`w3kmv1/portfolio`) is a public client identifier; it defaults in
  code and can be overridden per environment with `NEXT_PUBLIC_LOGROCKET_ID`.

## Rationale

- **Complements, not replaces, Vercel telemetry**: Vercel gives aggregate traffic
  and Web Vitals; LogRocket gives the per-session replay and console/network
  context those lack.
- **Zero server surface**: LogRocket is browser-only — no API routes, no secrets.
- **Bundle discipline**: dynamic import + production-only gate keep dev fast and
  the initial bundle lean, honoring `docs/PROJECT.md`.

### Alternatives Considered

| Alternative                     | Why Not                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| Vercel Analytics only (current) | Aggregate metrics; no per-session replay or error context       |
| Sentry (Replay)                 | Heavier; error-first. Can be added later — LogRocket integrates |
| PostHog / FullStory             | Broader product-analytics scope than needed for a portfolio     |
| No replay tool                  | Leaves UX friction and client errors unobservable               |

## Consequences

- New dependency: `logrocket`.
- Session replay records real user input. Password fields are masked by default;
  when the booking (`/book`) form or chat capture anything sensitive, mask those
  inputs (`data-private` / an input sanitizer) before relying on this in prod.
- Recording is active on **every deployed environment** (preview included), not
  local dev. Preview deployments will generate sessions for each PR.
- Free tier caps at 1,000 sessions/month; revisit sampling or plan if traffic
  grows past that.
- Future error tooling (Sentry) can link crashes to LogRocket replays via its
  first-class integration.
