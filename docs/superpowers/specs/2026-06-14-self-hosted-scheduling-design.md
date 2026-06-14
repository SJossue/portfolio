# Self-Hosted Scheduling (`/book`) — Design

**Date:** 2026-06-14
**Status:** Approved (design) — pending implementation plan
**Owner:** Jossue Sarango

## Context

The portfolio currently has no way for a visitor to book time with Jossue. The
goal is a **self-hosted Calendly replacement** at `/book` — a fully self-serve
scheduler that "functions the same if not better" without depending on the
Calendly SaaS.

The site today is a static-content Next.js 16 App Router project with **no
database, no email, no date library**, and a single AI chat API route. Adding
scheduling therefore introduces the first stateful backend in the project. It
must respect the existing constraints: thin route handlers delegating to
`features/**`, one-way `features → ui` imports, Server Components by default,
the performance budget (client JS ≤ 200 KB gzipped, LCP ≤ 2.5s, CLS ≤ 0.1,
INP ≤ 200ms), and accessibility (semantic HTML, keyboard, visible focus).

### Decisions made during brainstorming

- **Calendar sync:** Full two-way Google — read free/busy **and** write the
  confirmed event onto Jossue's Google Calendar.
- **Google auth method:** **Service account + calendar sharing** (not interactive
  OAuth). Jossue shares his personal calendar with the service account email and
  grants "Make changes to events." The app authenticates with a static JSON key.
  Rationale: no OAuth consent screen, no callback route, and **no refresh-token
  expiry** (interactive OAuth in "testing" mode expires tokens every 7 days and
  would silently break the scheduler). Native Google email invites from a service
  account are unreliable, but that is irrelevant — confirmation emails are sent
  via Resend with an attached `.ics`.
- **Backend:** Neon Postgres (booking source of truth) + Resend (email).
- **Meeting types:** Multiple named types (e.g. Intro call, Project chat,
  Mentoring), each with its own duration and description.
- **Route:** `/book`. Linked from the `real-me` Connect section and the header.

## Architecture

```
Visitor → /book page (client widget)
              │  GET /api/schedule/availability   POST /api/schedule/book
              ▼
        Availability engine (pure, tested)  ◄── weekly rules (config in code)
              ▲                              ◄── Google free/busy (service acct)
              └──────────────────────────── ◄── confirmed bookings (Neon)
        POST /api/schedule/book:
          1. re-check slot free   2. reserve row in Neon (overlap-proof)
          3. write Google event   4. Resend emails (.ics) to owner + visitor
```

Scheduling **config lives in code** (`src/content/scheduling.ts`) following the
existing `src/content/*.ts` convention — typed, version-controlled, no admin UI.

## Units & boundaries

| Unit                | File(s)                                                             | Responsibility                                                                                                | Depends on                            |
| ------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Scheduling config   | `src/content/scheduling.ts`                                         | Meeting types + availability rules (weekly windows, owner tz, min-notice, horizon, buffers, slot granularity) | —                                     |
| Availability engine | `src/lib/scheduling/availability.ts`                                | **Pure** `getAvailableSlots(type, range, rules, busy, bookings)` → bookable UTC slots                         | config types only                     |
| `.ics` generator    | `src/lib/scheduling/ics.ts`                                         | Build a valid VEVENT string (no extra dep)                                                                    | —                                     |
| Google adapter      | `src/lib/scheduling/google.ts`                                      | `getBusy()`, `createEvent()`, `deleteEvent()`                                                                 | `google-auth-library` + Calendar REST |
| DB layer            | `src/lib/db.ts`, `db/schema.sql`                                    | Neon client; `bookings` table + queries (`findConfirmedInRange`, `reserve`, `cancel`)                         | `@neondatabase/serverless`            |
| Email               | `src/lib/scheduling/email.ts`                                       | Send confirmation to invitee + notification to owner, with `.ics`                                             | `resend`, `ics.ts`                    |
| Availability API    | `src/app/api/schedule/availability/route.ts`                        | `GET ?type=&from=&to=&tz=` → slots                                                                            | engine, google, db                    |
| Book API            | `src/app/api/schedule/book/route.ts`                                | `POST` validate → reserve → google → email                                                                    | all of the above + `rate-limit`       |
| Cancel API          | `src/app/api/schedule/cancel/route.ts`                              | `POST`/`GET ?token=` → cancel row, delete event, email                                                        | db, google, email                     |
| Visitor UI          | `src/components/features/schedule/*`                                | Type picker → month calendar → slot list (visitor tz) → form → confirmation                                   | `ui/*`, `date-fns`                    |
| Page                | `src/app/book/page.tsx`                                             | Thin server shell in site aesthetic (no heavy 3D world)                                                       | features/schedule                     |
| Reusable primitives | `src/components/ui/{Input,Button}.tsx` (only if genuinely reusable) | Accessible form primitives                                                                                    | —                                     |

**Bundle posture:** Google/Neon/Resend are **server-only** and never reach the
client. The only new _client_ dependency is `date-fns` + `date-fns-tz`
(tree-shakeable) for timezone-correct slot rendering.

## Data model (`bookings`)

| Column                           | Type                      | Notes                         |
| -------------------------------- | ------------------------- | ----------------------------- |
| `id`                             | uuid pk                   |                               |
| `meeting_type_id`                | text                      | references config             |
| `start_utc` / `end_utc`          | timestamptz               |                               |
| `invitee_name` / `invitee_email` | text                      |                               |
| `invitee_timezone`               | text                      |                               |
| `notes`                          | text null                 |                               |
| `google_event_id`                | text null                 | set after Google write        |
| `status`                         | text                      | `confirmed` \| `cancelled`    |
| `cancel_token`                   | text                      | signed/random; in email links |
| `created_at`                     | timestamptz default now() |                               |

Overlap protection at the database level (requires `btree_gist`):

```sql
EXCLUDE USING gist (tstzrange(start_utc, end_utc) WITH &&)
  WHERE (status = 'confirmed')
```

## Correctness

- Availability = union of Google busy + DB confirmed bookings, minus
  buffers / min-notice / horizon, generated at slot granularity from weekly rules.
- `POST /book` ordering: **reserve in Neon first** (the exclusion constraint wins
  same-instant races between two visitors) → **then** create the Google event →
  **then** send emails. If the Google write fails, roll back the DB row and return
  an error so no phantom booking persists.
- All API routes use the Node runtime and reuse the existing
  `src/lib/rate-limit.ts`, origin-check, and error-response shape from
  `src/app/api/chat/route.ts`.

## Cancellation / reschedule

Each confirmation email includes a cancel/reschedule link carrying the row's
`cancel_token`. Cancelling marks the row `cancelled`, deletes the Google event,
and emails both sides. **Reschedule = cancel + rebook**; ship cancel first,
reschedule as a fast-follow.

## Environment variables (add to `.env.example`)

```
DATABASE_URL=                 # Neon Postgres connection string
RESEND_API_KEY=
GOOGLE_SERVICE_ACCOUNT_JSON=  # base64-encoded service account key JSON
GOOGLE_CALENDAR_ID=           # Jossue's calendar email (shared with the SA)
OWNER_EMAIL=
OWNER_TIMEZONE=               # e.g. America/New_York
SCHEDULE_ALLOWED_ORIGINS=
```

## Build phases (each independently shippable)

1. **Scheduler core, no Google.** Config + availability engine (tested) + Neon
   schema + availability & book APIs (busy = DB only) + full visitor UI + Resend
   confirmation with `.ics`. Delivers a working self-serve scheduler.
2. **Two-way Google.** Fold service-account free/busy into availability; write the
   event on booking; store/delete `google_event_id`; wire cancellation deletion.
3. **Polish.** Multiple named meeting types in the UI, cancel page, rate-limit +
   a11y + edge-case pass, ADR (`docs/adr/000X-self-hosted-scheduling.md` +
   `docs/ADRS.md`), OG image for `/book`.

## Verification

- **Unit:** `availability.ts` (DST boundaries, buffers, min-notice, horizon,
  overlap exclusion, granularity) and `ics.ts`, colocated as `*.test.ts`.
- **API:** `book` route with mocked Google/DB/Resend — assert reserve-then-write
  ordering and rollback on Google failure.
- **Manual E2E:** apply `db/schema.sql` to Neon; set env; `npm run dev`; open
  `/book`; pick a type → day → slot → submit; confirm (a) Neon row created,
  (b) event on Google Calendar, (c) two emails delivered with a valid `.ics`,
  (d) the slot disappears from availability, (e) cancel link removes the event.
- **Gates:** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`
  all pass before merge.

## Dependencies introduced (ADR required)

`@neondatabase/serverless`, `resend`, `google-auth-library`, `date-fns` +
`date-fns-tz`. Documented in `docs/adr/000X-self-hosted-scheduling.md`.
