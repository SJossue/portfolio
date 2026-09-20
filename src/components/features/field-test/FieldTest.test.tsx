import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FieldTest } from './FieldTest';

async function startAssessment(user: ReturnType<typeof userEvent.setup>) {
  render(<FieldTest />);
  await user.type(screen.getByLabelText('Your name'), 'Jane Doe');
  await user.click(screen.getByRole('button', { name: /start/i }));
}

async function playPatternOnce(user: ReturnType<typeof userEvent.setup>) {
  vi.useFakeTimers();
  fireEvent.click(screen.getByRole('button', { name: 'Play pattern' }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(6000);
  });
  vi.useRealTimers();
  await user.click(screen.getByRole('button', { name: /continue/i }));
}

/** Drives the assessment from a fresh render through step 6, one tap short of
 * the pattern recall so the caller can decide how the recall goes. */
async function reachRecallStep(user: ReturnType<typeof userEvent.setup>) {
  await startAssessment(user);
  await playPatternOnce(user);

  await user.click(screen.getByRole('button', { name: /send the cold email today/i }));
  await user.click(screen.getByRole('button', { name: /continue/i }));

  await user.click(screen.getByRole('button', { name: /jump in on whoever's behind/i }));
  await user.click(screen.getByRole('button', { name: /continue/i }));

  await user.type(
    screen.getByLabelText('Your story'),
    'I kept a personal project going for months with nobody watching.',
  );
  await user.click(screen.getByRole('button', { name: /continue/i }));
}

describe('FieldTest', () => {
  it('keeps Start disabled until a name is entered', async () => {
    const user = userEvent.setup();
    render(<FieldTest />);

    const start = screen.getByRole('button', { name: /start/i });
    expect(start).toBeDisabled();

    await user.type(screen.getByLabelText('Your name'), 'Jane Doe');
    expect(start).toBeEnabled();
  });

  it('advances to the memory round immediately after Start, with no way back', async () => {
    const user = userEvent.setup();
    await startAssessment(user);

    expect(screen.getByRole('heading', { name: 'Watch the pattern.' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('does not auto-play the pattern, and only allows one play plus one replay', async () => {
    const user = userEvent.setup();
    await startAssessment(user);
    vi.useFakeTimers();

    const playButton = screen.getByRole('button', { name: 'Play pattern' });
    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();

    fireEvent.click(playButton);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000);
    });

    expect(continueButton).toBeEnabled();
    const replayButton = screen.getByRole('button', { name: /replay \(1 left\)/i });

    fireEvent.click(replayButton);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000);
    });

    expect(screen.getByRole('button', { name: 'No replays left' })).toBeDisabled();
    vi.useRealTimers();
  });

  it('reveals the optional "why" field only after a department choice is picked, and gates Continue on a selection', async () => {
    const user = userEvent.setup();
    await startAssessment(user);
    vi.useFakeTimers();

    fireEvent.click(screen.getByRole('button', { name: 'Play pattern' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000);
    });
    vi.useRealTimers();

    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(
      screen.getByRole('heading', { name: /department nobody's cracked yet/i }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/one line on why/i)).not.toBeInTheDocument();

    const deptContinue = screen.getByRole('button', { name: /continue/i });
    expect(deptContinue).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /send the cold email today/i }));
    expect(screen.getByLabelText(/one line on why/i)).toBeInTheDocument();
    expect(deptContinue).toBeEnabled();
  });

  describe('submission', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('submits automatically on completion and shows a success state with a reference code', async () => {
      const user = userEvent.setup();
      const fetchMock = vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ code: 'AB12' }) });
      global.fetch = fetchMock as unknown as typeof fetch;

      await reachRecallStep(user);
      for (let i = 1; i <= 5; i++) {
        await user.click(screen.getByRole('button', { name: `Tile ${i}` }));
      }
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(
        await screen.findByRole('heading', { name: "That's it — thank you." }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Reference AB12/)).toBeInTheDocument();

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/field-test/submit',
        expect.objectContaining({ method: 'POST' }),
      );
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.name).toBe('Jane Doe');
      expect(body.deptChoiceId).toBe('cold-email');
      expect(body.earlyChoiceId).toBe('jump-in');
      expect(body.pattern).toHaveLength(5);
      expect(body.recall).toHaveLength(5);
    });

    it('shows a retry and a backup option if the submission fails, without losing the answers', async () => {
      const user = userEvent.setup();
      global.fetch = vi
        .fn()
        .mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

      await reachRecallStep(user);
      for (let i = 1; i <= 5; i++) {
        await user.click(screen.getByRole('button', { name: `Tile ${i}` }));
      }
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(
        await screen.findByRole('heading', { name: "That didn't go through." }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy my answers/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /email my answers/i })).toBeInTheDocument();
    });
  });
});
