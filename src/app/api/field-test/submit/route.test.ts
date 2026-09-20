import { NextRequest } from 'next/server';

import { POST } from './route';

vi.mock('@/lib/field-test/submissions', () => ({
  insertSubmission: vi.fn().mockResolvedValue({ id: 'row-1' }),
}));
vi.mock('@/lib/field-test/email', () => ({
  sendSubmissionNotification: vi.fn().mockResolvedValue(undefined),
}));

import { sendSubmissionNotification } from '@/lib/field-test/email';
import { insertSubmission } from '@/lib/field-test/submissions';

const validPattern = [0, 1, 2, 3, 4];

function post(body: unknown) {
  return POST(
    new NextRequest('http://localhost/api/field-test/submit', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  );
}

const validBody = {
  name: 'Ada Lovelace',
  deptChoiceId: 'cold-email',
  deptWhy: '',
  earlyChoiceId: 'jump-in',
  story: 'Kept a personal project alive for months with nobody checking.',
  pattern: validPattern,
  recall: validPattern,
};

describe('POST /api/field-test/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects a missing name', async () => {
    const res = await post({ ...validBody, name: '' });
    expect(res.status).toBe(400);
    expect(insertSubmission).not.toHaveBeenCalled();
  });

  it('rejects an unknown department choice id', async () => {
    const res = await post({ ...validBody, deptChoiceId: 'not-a-real-choice' });
    expect(res.status).toBe(400);
  });

  it('rejects an unknown finish-early choice id', async () => {
    const res = await post({ ...validBody, earlyChoiceId: 'not-a-real-choice' });
    expect(res.status).toBe(400);
  });

  it('rejects a story that is too short', async () => {
    const res = await post({ ...validBody, story: 'too short' });
    expect(res.status).toBe(400);
  });

  it('rejects a pattern of the wrong shape', async () => {
    const res = await post({ ...validBody, pattern: [0, 1, 2] });
    expect(res.status).toBe(400);
    expect(insertSubmission).not.toHaveBeenCalled();
  });

  it('saves a valid submission, recomputes the match server-side, and returns a code', async () => {
    const res = await post({ ...validBody, recall: [4, 3, 2, 1, 0] });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { code: string };
    expect(json.code).toMatch(/^[A-Z0-9]{4}$/);

    expect(insertSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        candidateName: 'Ada Lovelace',
        deptChoiceLabel: 'Send the cold email today.',
        earlyChoiceLabel: "Jump in on whoever's behind.",
        patternMatched: false, // recall was reversed
      }),
    );
    expect(sendSubmissionNotification).toHaveBeenCalled();
  });

  it('returns 500 and never emails if the database write fails', async () => {
    vi.mocked(insertSubmission).mockRejectedValueOnce(new Error('db down'));
    const res = await post(validBody);
    expect(res.status).toBe(500);
    expect(sendSubmissionNotification).not.toHaveBeenCalled();
  });

  it('still returns 200 if the notification email fails — the saved row is the source of truth', async () => {
    vi.mocked(sendSubmissionNotification).mockRejectedValueOnce(new Error('resend down'));
    const res = await post(validBody);
    expect(res.status).toBe(200);
    expect(insertSubmission).toHaveBeenCalled();
  });
});
