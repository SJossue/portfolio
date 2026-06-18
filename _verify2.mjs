import { readFileSync } from 'fs';
import { JWT } from 'google-auth-library';
import { neon } from '@neondatabase/serverless';

const line = (s) => console.log(s);

// ---------- Google free/busy ----------
line('=== GOOGLE (free/busy + calendar access) ===');
try {
  let text = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '').trim();
  if (!text.startsWith('{')) text = Buffer.from(text, 'base64').toString('utf8');
  const creds = JSON.parse(text);
  const client = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  const { token } = await client.getAccessToken();
  const calId = process.env.GOOGLE_CALENDAR_ID;
  const now = new Date();
  const week = new Date(now.getTime() + 7 * 86400000);
  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      timeMin: now.toISOString(),
      timeMax: week.toISOString(),
      items: [{ id: calId }],
    }),
  });
  const j = await res.json();
  const cal = j.calendars?.[calId];
  if (cal?.errors)
    line(`FAIL calendar not accessible → ${JSON.stringify(cal.errors)} (not shared yet?)`);
  else if (cal)
    line(`OK  calendar "${calId}" readable ✓ · busy blocks next 7d: ${cal.busy?.length ?? 0}`);
  else line(`FAIL HTTP ${res.status} · ${JSON.stringify(j).slice(0, 200)}`);
} catch (e) {
  line(`ERROR ${e.message}`);
}

// ---------- Neon: connect, apply schema, confirm ----------
line('\n=== NEON (database) ===');
try {
  const sql = neon(process.env.DATABASE_URL);
  const ping = await sql`SELECT 1 as ok`;
  line(`connect: OK ✓ (${JSON.stringify(ping[0])})`);

  const schema = readFileSync('db/schema.sql', 'utf8');
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => (s && !s.startsWith('--') === false ? s : s)) // keep all
    .filter(Boolean);
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  line('schema: applied ✓');

  const tbl = await sql`SELECT to_regclass('public.bookings') as t`;
  const con = await sql`SELECT conname FROM pg_constraint WHERE conname = 'no_overlap'`;
  line(
    `table bookings: ${tbl[0].t ? 'exists ✓' : 'MISSING'} · no_overlap constraint: ${con.length ? 'present ✓' : 'MISSING'}`,
  );
} catch (e) {
  line(`ERROR ${e.message}`);
}
line('');
