import { NextRequest, NextResponse } from 'next/server';

import {
  DEPT_CHOICES,
  EARLY_CHOICES,
  isValidChoiceId,
  labelFor,
  PATTERN_LENGTH,
  GRID_SIZE,
} from '@/content/field-test';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendSubmissionNotification } from '@/lib/field-test/email';
import { insertSubmission } from '@/lib/field-test/submissions';

export const runtime = 'nodejs';

// Bound candidate-supplied strings so a crafted request can't write unbounded data.
const MAX_NAME = 120;
const MAX_WHY = 300;
const MAX_STORY = 4000;
const MIN_STORY = 10;

interface SubmitBody {
  name?: string;
  deptChoiceId?: string;
  deptWhy?: string;
  earlyChoiceId?: string;
  story?: string;
  pattern?: unknown;
  recall?: unknown;
}

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isValidTileSequence(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === PATTERN_LENGTH &&
    value.every((n) => Number.isInteger(n) && n >= 0 && n < GRID_SIZE)
  );
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(clientIp(req));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'too many requests' },
      {
        status: 429,
        headers: { 'retry-after': String(Math.ceil((limit.retryAfterMs ?? 60_000) / 1000)) },
      },
    );
  }

  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const name = body.name?.trim() ?? '';
  const deptWhy = body.deptWhy?.trim() ?? '';
  const story = body.story?.trim() ?? '';

  if (!name || name.length > MAX_NAME)
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  if (!body.deptChoiceId || !isValidChoiceId(DEPT_CHOICES, body.deptChoiceId))
    return NextResponse.json({ error: 'invalid department choice' }, { status: 400 });
  if (!body.earlyChoiceId || !isValidChoiceId(EARLY_CHOICES, body.earlyChoiceId))
    return NextResponse.json({ error: 'invalid finish-early choice' }, { status: 400 });
  if (deptWhy.length > MAX_WHY)
    return NextResponse.json({ error: 'why is too long' }, { status: 400 });
  if (story.length < MIN_STORY || story.length > MAX_STORY)
    return NextResponse.json({ error: 'story is out of bounds' }, { status: 400 });
  if (!isValidTileSequence(body.pattern) || !isValidTileSequence(body.recall))
    return NextResponse.json({ error: 'invalid pattern data' }, { status: 400 });

  const pattern = body.pattern;
  const recall = body.recall;
  const patternMatched = JSON.stringify(pattern) === JSON.stringify(recall);
  const code = Math.random().toString(36).slice(2, 6).toUpperCase();

  const submission = {
    code,
    candidateName: name,
    deptChoiceId: body.deptChoiceId,
    deptChoiceLabel: labelFor(DEPT_CHOICES, body.deptChoiceId),
    deptWhy: deptWhy || null,
    earlyChoiceId: body.earlyChoiceId,
    earlyChoiceLabel: labelFor(EARLY_CHOICES, body.earlyChoiceId),
    story,
    patternShown: pattern,
    patternRecalled: recall,
    patternMatched,
  };

  try {
    await insertSubmission(submission);
  } catch (e) {
    console.error('field-test: failed to save submission', e);
    return NextResponse.json({ error: 'failed to save submission' }, { status: 500 });
  }

  // Best-effort — the row above is already durable, so a notification failure
  // (missing env vars, Resend outage) must not fail the request.
  try {
    await sendSubmissionNotification(submission);
  } catch (e) {
    console.error('field-test: failed to send notification email', e);
  }

  return NextResponse.json({ code });
}
