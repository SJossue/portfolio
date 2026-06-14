# Scheduling Phase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a working, self-serve scheduler at `/book` — visitors pick a meeting type, day, and time (in their own timezone), submit a booking that persists to Neon Postgres, and both sides receive a confirmation email with an `.ics` attachment. No Google sync yet (busy = DB bookings only); that lands in Phase 2.

**Architecture:** Scheduling config lives in code (`src/content/scheduling.ts`). A pure availability engine turns weekly rules + busy intervals + existing bookings into bookable UTC slots. Two Node-runtime API routes (`availability`, `book`) sit in front of the engine and a Neon-backed `bookings` repo. The visitor UI is a client widget composed from new accessible `ui/` primitives and `features/schedule/*` components, rendered by a thin `/book` server page.

**Tech Stack:** Next.js 16 App Router, TypeScript, Vitest, Tailwind v3, `@neondatabase/serverless`, `resend`, `date-fns` + `date-fns-tz`, `motion` (already installed) for UI animation.

---

## File structure

| File                                          | Responsibility                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/content/scheduling.ts`                   | Typed meeting types + availability rules (the single source of config)                   |
| `src/lib/scheduling/types.ts`                 | Shared TS types (`Slot`, `Interval`, `BookingInput`, `MeetingType`, `AvailabilityRules`) |
| `src/lib/scheduling/availability.ts`          | **Pure** slot generation; no IO                                                          |
| `src/lib/scheduling/availability.test.ts`     | Unit tests for the engine                                                                |
| `src/lib/scheduling/ics.ts`                   | `.ics` VEVENT builder (pure)                                                             |
| `src/lib/scheduling/ics.test.ts`              | Unit tests for the builder                                                               |
| `src/lib/scheduling/email.ts`                 | Resend send helpers + email bodies                                                       |
| `src/lib/db.ts`                               | Neon client singleton                                                                    |
| `src/lib/scheduling/bookings.ts`              | Booking repo: `findConfirmedBetween`, `reserve`, `findByToken`, `cancel`                 |
| `db/schema.sql`                               | `bookings` table + exclusion constraint                                                  |
| `src/app/api/schedule/availability/route.ts`  | `GET` → slots JSON                                                                       |
| `src/app/api/schedule/book/route.ts`          | `POST` → reserve + email                                                                 |
| `src/components/ui/Button.tsx`                | Reusable accessible button                                                               |
| `src/components/ui/Input.tsx`, `Textarea.tsx` | Reusable accessible fields                                                               |
| `src/components/features/schedule/*`          | Booking widget composition (picker, calendar, slots, form, confirmation, store)          |
| `src/app/book/page.tsx`                       | Thin server shell + metadata                                                             |
| `.env.example`                                | New env vars                                                                             |

---

## Task 1: Scheduling config + shared types

**Files:**

- Create: `src/lib/scheduling/types.ts`
- Create: `src/content/scheduling.ts`

- [ ] **Step 1: Write the types**

```ts
// src/lib/scheduling/types.ts
export interface Interval {
  start: Date; // UTC instant
  end: Date; // UTC instant
}

export interface MeetingType {
  id: string;
  name: string;
  slug: string;
  durationMin: number;
  description: string;
  /** tailwind-friendly accent hex, matches site palette */
  accent: string;
}

/** A daily window expressed in the OWNER's timezone, 24h "HH:mm". */
export interface DailyWindow {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  start: string; // "09:00"
  end: string; // "17:00"
}

export interface AvailabilityRules {
  ownerTimezone: string; // IANA, e.g. "America/New_York"
  windows: DailyWindow[];
  slotGranularityMin: number; // e.g. 30
  minNoticeMin: number; // earliest a slot may be booked from "now"
  horizonDays: number; // furthest day out that may be booked
  bufferBeforeMin: number;
  bufferAfterMin: number;
}

export interface Slot {
  startUtc: string; // ISO
  endUtc: string; // ISO
}

export interface BookingInput {
  meetingTypeId: string;
  startUtc: string; // ISO
  name: string;
  email: string;
  timezone: string;
  notes?: string;
}
```

- [ ] **Step 2: Write the config**

```ts
// src/content/scheduling.ts
import type { AvailabilityRules, MeetingType } from '@/lib/scheduling/types';

export const meetingTypes: MeetingType[] = [
  {
    id: 'intro',
    name: 'Intro Call',
    slug: 'intro',
    durationMin: 30,
    description: 'A quick hello — opportunities, collaboration, or just to connect.',
    accent: '#22d3ee',
  },
  {
    id: 'project',
    name: 'Project Chat',
    slug: 'project',
    durationMin: 45,
    description: 'Deep-dive on a build, a hardware/software problem, or applied AI.',
    accent: '#a78bfa',
  },
  {
    id: 'mentoring',
    name: 'Mentoring',
    slug: 'mentoring',
    durationMin: 60,
    description: 'Career, engineering school, or breaking into hardware + software.',
    accent: '#f472b6',
  },
];

export const availabilityRules: AvailabilityRules = {
  ownerTimezone: process.env.OWNER_TIMEZONE ?? 'America/New_York',
  windows: [
    { weekday: 1, start: '10:00', end: '17:00' },
    { weekday: 2, start: '10:00', end: '17:00' },
    { weekday: 3, start: '10:00', end: '17:00' },
    { weekday: 4, start: '10:00', end: '17:00' },
    { weekday: 5, start: '10:00', end: '15:00' },
  ],
  slotGranularityMin: 30,
  minNoticeMin: 240,
  horizonDays: 30,
  bufferBeforeMin: 0,
  bufferAfterMin: 10,
};

export function meetingTypeById(id: string): MeetingType | undefined {
  return meetingTypes.find((m) => m.id === id);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/scheduling/types.ts src/content/scheduling.ts
git commit -m "feat(schedule): meeting-type + availability config and shared types"
```

---

## Task 2: Availability engine (pure, TDD)

**Files:**

- Create: `src/lib/scheduling/availability.test.ts`
- Create: `src/lib/scheduling/availability.ts`

Dependency: `date-fns` + `date-fns-tz`.

- [ ] **Step 1: Install date libs**

```bash
npm install date-fns date-fns-tz
```

- [ ] **Step 2: Write failing tests**

```ts
// src/lib/scheduling/availability.test.ts
import { describe, expect, it } from 'vitest';
import { getAvailableSlots } from './availability';
import type { AvailabilityRules } from './types';

const rules: AvailabilityRules = {
  ownerTimezone: 'America/New_York',
  windows: [{ weekday: 3, start: '10:00', end: '12:00' }], // Wednesdays 10–12 ET
  slotGranularityMin: 30,
  minNoticeMin: 0,
  horizonDays: 30,
  bufferBeforeMin: 0,
  bufferAfterMin: 0,
};

// Wed 2026-06-17 is a Wednesday.
const from = new Date('2026-06-15T00:00:00Z');
const to = new Date('2026-06-21T00:00:00Z');
const now = new Date('2026-06-15T00:00:00Z');

it('generates 30-min slots inside the weekly window', () => {
  const slots = getAvailableSlots({
    durationMin: 30,
    rules,
    busy: [],
    from,
    to,
    now,
  });
  // 10:00,10:30,11:00,11:30 ET on Wed -> 4 slots
  expect(slots).toHaveLength(4);
  // 10:00 ET = 14:00 UTC (EDT, -4)
  expect(slots[0].startUtc).toBe('2026-06-17T14:00:00.000Z');
});

it('drops slots overlapping a busy interval (incl. duration)', () => {
  const slots = getAvailableSlots({
    durationMin: 30,
    rules,
    busy: [{ start: new Date('2026-06-17T14:15:00Z'), end: new Date('2026-06-17T14:45:00Z') }],
    from,
    to,
    now,
  });
  // 10:00 (14:00-14:30) overlaps; 10:30 (14:30-15:00) overlaps -> 2 remain
  expect(slots.map((s) => s.startUtc)).toEqual([
    '2026-06-17T15:00:00.000Z',
    '2026-06-17T15:30:00.000Z',
  ]);
});

it('respects minNotice', () => {
  const slots = getAvailableSlots({
    durationMin: 30,
    rules: { ...rules, minNoticeMin: 60 },
    busy: [],
    from,
    to,
    now: new Date('2026-06-17T14:15:00Z'), // 10:15 ET
  });
  // earliest bookable is now+60min = 15:15 UTC -> only 11:30 (15:30) survives among 10:00..11:30
  expect(slots.map((s) => s.startUtc)).toEqual(['2026-06-17T15:30:00.000Z']);
});

it('respects horizonDays', () => {
  const slots = getAvailableSlots({
    durationMin: 30,
    rules: { ...rules, horizonDays: 1 },
    busy: [],
    from,
    to,
    now,
  });
  expect(slots).toHaveLength(0); // Wed 6/17 is > 1 day after now (6/15)
});
```

- [ ] **Step 3: Run tests — expect FAIL**

Run: `npm run test -- availability`
Expected: FAIL (`getAvailableSlots is not a function`).

- [ ] **Step 4: Implement the engine**

```ts
// src/lib/scheduling/availability.ts
import { addDays, addMinutes } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import type { AvailabilityRules, Interval, Slot } from './types';

interface Params {
  durationMin: number;
  rules: AvailabilityRules;
  busy: Interval[];
  from: Date;
  to: Date;
  now: Date;
}

function overlaps(aStart: Date, aEnd: Date, b: Interval): boolean {
  return aStart < b.end && b.start < aEnd;
}

export function getAvailableSlots({ durationMin, rules, busy, from, to, now }: Params): Slot[] {
  const slots: Slot[] = [];
  const earliest = addMinutes(now, rules.minNoticeMin);
  const latest = addDays(now, rules.horizonDays);

  // Walk each calendar day in the owner's timezone across [from, to].
  for (let cursor = new Date(from); cursor <= to; cursor = addDays(cursor, 1)) {
    const zoned = toZonedTime(cursor, rules.ownerTimezone);
    const weekday = zoned.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const windows = rules.windows.filter((w) => w.weekday === weekday);

    for (const w of windows) {
      const [sh, sm] = w.start.split(':').map(Number);
      const [eh, em] = w.end.split(':').map(Number);
      const y = zoned.getFullYear();
      const mo = zoned.getMonth();
      const d = zoned.getDate();

      // Build the window edges as UTC instants from owner-local wall time.
      const windowStart = fromZonedTime(new Date(y, mo, d, sh, sm), rules.ownerTimezone);
      const windowEnd = fromZonedTime(new Date(y, mo, d, eh, em), rules.ownerTimezone);

      for (
        let slotStart = windowStart;
        addMinutes(slotStart, durationMin) <= windowEnd;
        slotStart = addMinutes(slotStart, rules.slotGranularityMin)
      ) {
        const slotEnd = addMinutes(slotStart, durationMin);
        const guardStart = addMinutes(slotStart, -rules.bufferBeforeMin);
        const guardEnd = addMinutes(slotEnd, rules.bufferAfterMin);

        if (slotStart < earliest) continue;
        if (slotStart > latest) continue;
        if (busy.some((b) => overlaps(guardStart, guardEnd, b))) continue;

        slots.push({ startUtc: slotStart.toISOString(), endUtc: slotEnd.toISOString() });
      }
    }
  }

  // De-dup + sort (windows on the same day could theoretically overlap).
  const seen = new Set<string>();
  return slots
    .filter((s) => (seen.has(s.startUtc) ? false : seen.add(s.startUtc)))
    .sort((a, b) => a.startUtc.localeCompare(b.startUtc));
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `npm run test -- availability`
Expected: PASS (4 tests). If the DST/offset assertions fail, fix the engine, not the test — the expected ISO values are correct for EDT.

- [ ] **Step 6: Commit**

```bash
git add src/lib/scheduling/availability.ts src/lib/scheduling/availability.test.ts package.json package-lock.json
git commit -m "feat(schedule): pure availability engine with tests"
```

---

## Task 3: `.ics` generator (pure, TDD)

**Files:**

- Create: `src/lib/scheduling/ics.test.ts`
- Create: `src/lib/scheduling/ics.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/lib/scheduling/ics.test.ts
import { describe, expect, it } from 'vitest';
import { buildIcs } from './ics';

it('builds a valid single-event VCALENDAR', () => {
  const ics = buildIcs({
    uid: 'abc-123',
    start: new Date('2026-06-17T14:00:00Z'),
    end: new Date('2026-06-17T14:30:00Z'),
    summary: 'Intro Call with Jossue Sarango',
    description: 'Looking forward to it.',
    organizerEmail: 'hi@jossue.dev',
    attendeeEmail: 'guest@example.com',
  });
  expect(ics).toContain('BEGIN:VCALENDAR');
  expect(ics).toContain('BEGIN:VEVENT');
  expect(ics).toContain('UID:abc-123');
  expect(ics).toContain('DTSTART:20260617T140000Z');
  expect(ics).toContain('DTEND:20260617T143000Z');
  expect(ics).toContain('SUMMARY:Intro Call with Jossue Sarango');
  expect(ics).toContain('END:VCALENDAR');
});

it('escapes commas and newlines in text fields', () => {
  const ics = buildIcs({
    uid: 'x',
    start: new Date('2026-06-17T14:00:00Z'),
    end: new Date('2026-06-17T14:30:00Z'),
    summary: 'A, B',
    description: 'line1\nline2',
    organizerEmail: 'a@b.c',
    attendeeEmail: 'd@e.f',
  });
  expect(ics).toContain('SUMMARY:A\\, B');
  expect(ics).toContain('DESCRIPTION:line1\\nline2');
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm run test -- ics`
Expected: FAIL (`buildIcs is not a function`).

- [ ] **Step 3: Implement**

```ts
// src/lib/scheduling/ics.ts
export interface IcsInput {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  organizerEmail: string;
  attendeeEmail: string;
  location?: string;
}

function stamp(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildIcs(i: IcsInput): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//jossue.dev//scheduling//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${i.uid}`,
    `DTSTAMP:${stamp(i.start)}`,
    `DTSTART:${stamp(i.start)}`,
    `DTEND:${stamp(i.end)}`,
    `SUMMARY:${esc(i.summary)}`,
    `DESCRIPTION:${esc(i.description)}`,
    i.location ? `LOCATION:${esc(i.location)}` : '',
    `ORGANIZER:mailto:${i.organizerEmail}`,
    `ATTENDEE;RSVP=TRUE:mailto:${i.attendeeEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}
```

- [ ] **Step 4: Run — expect PASS**, then **commit**

```bash
npm run test -- ics
git add src/lib/scheduling/ics.ts src/lib/scheduling/ics.test.ts
git commit -m "feat(schedule): RFC5545 .ics builder with tests"
```

---

## Task 4: Database schema + Neon client + bookings repo

**Files:**

- Create: `db/schema.sql`
- Create: `src/lib/db.ts`
- Create: `src/lib/scheduling/bookings.ts`

- [ ] **Step 1: Install Neon driver**

```bash
npm install @neondatabase/serverless
```

- [ ] **Step 2: Write the schema**

```sql
-- db/schema.sql  (apply once via the Neon SQL console)
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS bookings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_type_id  text NOT NULL,
  start_utc        timestamptz NOT NULL,
  end_utc          timestamptz NOT NULL,
  invitee_name     text NOT NULL,
  invitee_email    text NOT NULL,
  invitee_timezone text NOT NULL,
  notes            text,
  google_event_id  text,
  status           text NOT NULL DEFAULT 'confirmed',
  cancel_token     text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    tstzrange(start_utc, end_utc) WITH &&
  ) WHERE (status = 'confirmed')
);
```

- [ ] **Step 3: Neon client**

```ts
// src/lib/db.ts
import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  if (!_sql) _sql = neon(url);
  return _sql;
}
```

- [ ] **Step 4: Bookings repo**

```ts
// src/lib/scheduling/bookings.ts
import { getSql } from '@/lib/db';
import type { Interval } from './types';

export interface BookingRow {
  id: string;
  meeting_type_id: string;
  start_utc: string;
  end_utc: string;
  invitee_name: string;
  invitee_email: string;
  invitee_timezone: string;
  notes: string | null;
  google_event_id: string | null;
  status: string;
  cancel_token: string;
}

export async function findConfirmedBetween(from: Date, to: Date): Promise<Interval[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT start_utc, end_utc FROM bookings
    WHERE status = 'confirmed' AND start_utc < ${to.toISOString()} AND end_utc > ${from.toISOString()}
  `) as { start_utc: string; end_utc: string }[];
  return rows.map((r) => ({ start: new Date(r.start_utc), end: new Date(r.end_utc) }));
}

/** Insert a confirmed booking. Throws on the exclusion-constraint violation
 *  (slot taken) so the caller can return a 409. */
export async function reserve(input: {
  meetingTypeId: string;
  startUtc: string;
  endUtc: string;
  name: string;
  email: string;
  timezone: string;
  notes?: string;
}): Promise<BookingRow> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO bookings (meeting_type_id, start_utc, end_utc, invitee_name, invitee_email, invitee_timezone, notes)
    VALUES (${input.meetingTypeId}, ${input.startUtc}, ${input.endUtc}, ${input.name}, ${input.email}, ${input.timezone}, ${input.notes ?? null})
    RETURNING *
  `) as BookingRow[];
  return rows[0];
}

export function isOverlapError(e: unknown): boolean {
  return e instanceof Error && /no_overlap|exclusion|conflicting key/i.test(e.message);
}
```

- [ ] **Step 5: Commit**

```bash
git add db/schema.sql src/lib/db.ts src/lib/scheduling/bookings.ts package.json package-lock.json
git commit -m "feat(schedule): Neon schema, client, and bookings repo"
```

---

## Task 5: Email (Resend + .ics)

**Files:**

- Create: `src/lib/scheduling/email.ts`

- [ ] **Step 1: Install Resend**

```bash
npm install resend
```

- [ ] **Step 2: Implement**

```ts
// src/lib/scheduling/email.ts
import { Resend } from 'resend';
import { siteConfig } from '@/lib/site';
import { buildIcs } from './ics';
import type { MeetingType } from './types';

interface ConfirmInput {
  meetingType: MeetingType;
  start: Date;
  end: Date;
  inviteeName: string;
  inviteeEmail: string;
  inviteeTimezone: string;
  notes?: string;
  bookingId: string;
  cancelToken: string;
}

function fmt(d: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: tz,
  }).format(d);
}

export async function sendConfirmationEmails(i: ConfirmInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.OWNER_EMAIL;
  if (!apiKey || !owner) throw new Error('RESEND_API_KEY or OWNER_EMAIL not set');
  const resend = new Resend(apiKey);

  const ics = buildIcs({
    uid: i.bookingId,
    start: i.start,
    end: i.end,
    summary: `${i.meetingType.name} with ${siteConfig.author}`,
    description: i.notes ?? '',
    organizerEmail: owner,
    attendeeEmail: i.inviteeEmail,
  });
  const attachments = [{ filename: 'invite.ics', content: Buffer.from(ics).toString('base64') }];
  const from = `${siteConfig.author} <booking@jossue.dev>`;
  const cancelUrl = `${siteConfig.url}/book/cancel?token=${i.cancelToken}`;

  await resend.emails.send({
    from,
    to: i.inviteeEmail,
    subject: `Confirmed: ${i.meetingType.name} with ${siteConfig.author}`,
    text: `You're booked for a ${i.meetingType.name}.\n\n${fmt(i.start, i.inviteeTimezone)} (${i.inviteeTimezone})\n\nNeed to cancel? ${cancelUrl}`,
    attachments,
  });

  await resend.emails.send({
    from,
    to: owner,
    subject: `New booking: ${i.meetingType.name} — ${i.inviteeName}`,
    text: `${i.inviteeName} (${i.inviteeEmail}) booked a ${i.meetingType.name}.\n\n${fmt(i.start, process.env.OWNER_TIMEZONE ?? 'America/New_York')}\n\nNotes: ${i.notes ?? '—'}`,
    attachments,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/scheduling/email.ts package.json package-lock.json
git commit -m "feat(schedule): Resend confirmation emails with .ics"
```

---

## Task 6: Availability API route

**Files:**

- Create: `src/app/api/schedule/availability/route.ts`

- [ ] **Step 1: Implement** (Node runtime, mirrors error shape of `src/app/api/chat/route.ts`)

```ts
// src/app/api/schedule/availability/route.ts
import { addDays } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { availabilityRules, meetingTypeById } from '@/content/scheduling';
import { getAvailableSlots } from '@/lib/scheduling/availability';
import { findConfirmedBetween } from '@/lib/scheduling/bookings';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('type') ?? '';
  const type = meetingTypeById(typeId);
  if (!type) return NextResponse.json({ error: 'unknown meeting type' }, { status: 400 });

  const from = new Date();
  const to = addDays(from, availabilityRules.horizonDays);

  try {
    const busy = await findConfirmedBetween(from, to);
    const slots = getAvailableSlots({
      durationMin: type.durationMin,
      rules: availabilityRules,
      busy,
      from,
      to,
      now: from,
    });
    return NextResponse.json({ slots });
  } catch (e) {
    return NextResponse.json({ error: 'availability unavailable' }, { status: 503 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/schedule/availability/route.ts
git commit -m "feat(schedule): availability API route"
```

---

## Task 7: Book API route

**Files:**

- Create: `src/app/api/schedule/book/route.ts`

- [ ] **Step 1: Implement** — validate, reserve (overlap-proof), email; reuse `checkRateLimit` from `src/lib/rate-limit.ts`.

```ts
// src/app/api/schedule/book/route.ts
import { addMinutes } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { meetingTypeById } from '@/content/scheduling';
import { isOverlapError, reserve } from '@/lib/scheduling/bookings';
import { sendConfirmationEmails } from '@/lib/scheduling/email';
import type { BookingInput } from '@/lib/scheduling/types';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: BookingInput;
  try {
    body = (await req.json()) as BookingInput;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const type = meetingTypeById(body.meetingTypeId);
  if (!type) return NextResponse.json({ error: 'unknown meeting type' }, { status: 400 });
  if (!body.name?.trim() || !EMAIL_RE.test(body.email ?? ''))
    return NextResponse.json({ error: 'name and valid email required' }, { status: 400 });
  const start = new Date(body.startUtc);
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now())
    return NextResponse.json({ error: 'invalid or past slot' }, { status: 400 });
  const end = addMinutes(start, type.durationMin);

  try {
    const row = await reserve({
      meetingTypeId: type.id,
      startUtc: start.toISOString(),
      endUtc: end.toISOString(),
      name: body.name.trim(),
      email: body.email.trim(),
      timezone: body.timezone || 'UTC',
      notes: body.notes?.trim(),
    });

    try {
      await sendConfirmationEmails({
        meetingType: type,
        start,
        end,
        inviteeName: row.invitee_name,
        inviteeEmail: row.invitee_email,
        inviteeTimezone: row.invitee_timezone,
        notes: row.notes ?? undefined,
        bookingId: row.id,
        cancelToken: row.cancel_token,
      });
    } catch {
      // Booking is saved; email failure shouldn't 500 the visitor. Log + continue.
    }

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (e) {
    if (isOverlapError(e))
      return NextResponse.json({ error: 'slot just got taken' }, { status: 409 });
    return NextResponse.json({ error: 'could not book' }, { status: 503 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/schedule/book/route.ts
git commit -m "feat(schedule): booking API route with overlap + validation"
```

---

## Task 8: Reusable UI primitives

**Files:**

- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Textarea.tsx`

These are presentational only (no domain logic), per `docs/ARCHITECTURE.md`. Each forwards refs, exposes native props, has visible `focus-visible` rings, and uses the site palette (cyan accent, `#050510` base, JetBrains Mono labels). Build them to match the existing aesthetic — see the design notes in Task 10.

- [ ] **Step 1: Implement the three primitives** (full accessible markup; keyboard + focus states).
- [ ] **Step 2: Commit** `feat(ui): accessible Button, Input, Textarea primitives`.

---

## Task 9: Booking widget (features/schedule)

**Files:**

- Create: `src/components/features/schedule/store.ts` (zustand — selected type/day/slot/step)
- Create: `src/components/features/schedule/MeetingTypePicker.tsx`
- Create: `src/components/features/schedule/MonthCalendar.tsx`
- Create: `src/components/features/schedule/SlotList.tsx`
- Create: `src/components/features/schedule/BookingForm.tsx`
- Create: `src/components/features/schedule/Confirmation.tsx`
- Create: `src/components/features/schedule/BookingWidget.tsx` (client orchestrator)
- Create: `src/components/features/schedule/timezone.ts` (detect + label helper)

Behavior:

- Detect visitor tz via `Intl.DateTimeFormat().resolvedOptions().timeZone`; allow override via a `<select>` of common zones.
- Step flow: **type → date → time → details → confirmation** (state in zustand, matches existing store pattern).
- `MonthCalendar` enables only days that have ≥1 slot (fetched from `/api/schedule/availability?type=`); keyboard navigable (arrow keys, Enter), `aria-selected`.
- `SlotList` renders slot times formatted in the visitor's tz with `date-fns-tz`.
- `BookingForm` posts to `/api/schedule/book`; handles 409 (“slot just got taken — pick another”) and 201 (→ confirmation).
- Respect `prefers-reduced-motion` for any `motion` transitions.

- [ ] **Step 1:** Implement store + timezone helper. Commit.
- [ ] **Step 2:** Implement MeetingTypePicker + MonthCalendar. Commit.
- [ ] **Step 3:** Implement SlotList + BookingForm + Confirmation. Commit.
- [ ] **Step 4:** Implement BookingWidget orchestrator wiring the steps. Commit.

---

## Task 10: The `/book` page (the beautiful shell)

**Files:**

- Create: `src/app/book/page.tsx`
- Modify: `src/components/features/worlds/real-me/RealMeWorld.tsx` (add "Book a call" CTA → `/book`)
- Modify: header nav component (add `/book` link)

**Design direction** (this is the "beautiful page" deliverable — apply the `frontend-design` skill):

- Full-bleed dark canvas (`#050510`) consistent with the site; reuse an existing ambient primitive (`Aurora` or `Particles`) **lazily + behind `prefers-reduced-motion`** so it never blocks LCP.
- Two-column on desktop: left = persistent summary rail (who you're meeting, selected type/duration/day/time, your timezone), right = the active step. Single column on mobile, stacked, auto-advancing.
- Type cards with the per-type accent glow (reuse `SpotlightCard`/`BorderGlow`). Selected state lifts + rings in the accent color.
- Calendar + slots use JetBrains Mono for times, Space Grotesk for headings. Motion: subtle step cross-fades via `motion`, gated on reduced-motion.
- Confirmation screen: celebratory but tasteful — checkmark draw-on, the booking details, an "Add to calendar" (downloads the same `.ics`), and a return-home link.
- Server component shell sets metadata (`title: 'Book a call — Jossue Sarango'`, description, canonical); the widget is the only client island.

- [ ] **Step 1:** Page shell + metadata + lazy ambient bg. Commit.
- [ ] **Step 2:** Compose `BookingWidget` + summary rail into the responsive layout. Commit.
- [ ] **Step 3:** Add CTA in real-me Connect section + header nav link. Commit.

---

## Task 11: Env, docs, gates

**Files:**

- Modify: `.env.example`
- Create: `docs/adr/000X-self-hosted-scheduling.md`; Modify: `docs/ADRS.md`

- [ ] **Step 1:** Append to `.env.example`:

```
# Scheduling (/book)
DATABASE_URL=
RESEND_API_KEY=
OWNER_EMAIL=
OWNER_TIMEZONE=America/New_York
SCHEDULE_ALLOWED_ORIGINS=
# Phase 2 (Google two-way) — not used in Phase 1:
# GOOGLE_SERVICE_ACCOUNT_JSON=
# GOOGLE_CALENDAR_ID=
```

- [ ] **Step 2:** Write the ADR (decisions: Neon over KV, Resend, service-account Google deferred to Phase 2, date-fns choice, in-code config over admin UI). Update `docs/ADRS.md` index.
- [ ] **Step 3:** Run all gates and fix until green:

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

- [ ] **Step 4:** Commit `docs(schedule): ADR + env example + green gates`.

---

## Verification (end of Phase 1)

1. Apply `db/schema.sql` to a Neon database; set `DATABASE_URL`, `RESEND_API_KEY`, `OWNER_EMAIL`, `OWNER_TIMEZONE` in `.env.local`.
2. `npm run dev`, open `/book`.
3. Pick a meeting type → a day → a time (shown in your local tz) → fill details → submit.
4. Confirm: (a) a `bookings` row exists in Neon, (b) two emails arrive with a valid `invite.ics` that imports cleanly into Google/Apple Calendar, (c) the just-booked slot disappears from `/book` on reload, (d) submitting the same slot twice returns the "slot just got taken" message.
5. Lighthouse the `/book` route: LCP ≤ 2.5s, CLS ≤ 0.1, no client bundle regression beyond the date-fns addition.

**Out of scope (later phases):** Google free/busy + event write (Phase 2), cancel page UI + reschedule + rate-limit/a11y/OG polish (Phase 3). The cancel link in emails points at `/book/cancel`, implemented in Phase 3.
