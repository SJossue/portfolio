'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  type Choice,
  DEPT_CHOICES,
  EARLY_CHOICES,
  GRID_SIZE,
  labelFor,
  PATTERN_LENGTH,
} from '@/content/field-test';

import { MemoryGrid } from './MemoryGrid';

const FALLBACK_EMAIL = 'js2823@njit.edu';
const MAX_PLAYS = 2; // one play, one replay
const LIGHT_MS = 650;
const GAP_MS = 250;

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type SubmitStatus = 'submitting' | 'success' | 'error';

const STEP_LABELS: Record<Exclude<Step, 7>, string> = {
  1: 'Step 1 of 6',
  2: 'Step 2 of 6',
  3: 'Step 3 of 6',
  4: 'Step 4 of 6',
  5: 'Step 5 of 6',
  6: 'Step 6 of 6',
};

const eyebrow = 'font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45';

function randomPattern(): number[] {
  return Array.from({ length: PATTERN_LENGTH }, () => Math.floor(Math.random() * GRID_SIZE));
}

/** Plain-text fallback — only ever shown if the automatic submission fails,
 * so a network hiccup can't lose a completed assessment. */
function buildFallbackText(input: {
  name: string;
  deptChoice: string;
  deptWhy: string;
  earlyChoice: string;
  q5: string;
  pattern: number[];
  recall: number[];
}): string {
  const matched = JSON.stringify(input.pattern) === JSON.stringify(input.recall);
  const lines = [
    `IVP COMMITTEE SCREENING RESULT (fallback — the automatic submission didn't go through)`,
    `Name: ${input.name}`,
    '',
    'Step 3 (unresponsive department):',
    `  Choice: ${labelFor(DEPT_CHOICES, input.deptChoice)}`,
    input.deptWhy ? `  Why: ${input.deptWhy}` : null,
    '',
    'Step 4 (finished early):',
    `  Choice: ${labelFor(EARLY_CHOICES, input.earlyChoice)}`,
    '',
    'Step 5 (kept pushing, nobody checking):',
    `  ${input.q5}`,
    '',
    `Step 6 (pattern recall): ${matched ? 'matched exactly' : 'did not match'}`,
    `  Shown:    ${input.pattern.join(',')}`,
    `  Repeated: ${input.recall.join(',')}`,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

interface ChoiceCardProps {
  choice: Choice;
  selected: boolean;
  onSelect: () => void;
}

function ChoiceCard({ choice, selected, onSelect }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="glass-card w-full rounded-2xl p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={
        selected
          ? { borderColor: 'rgba(34, 211, 238, 0.55)', background: 'rgba(34, 211, 238, 0.07)' }
          : undefined
      }
    >
      <p className="font-bold text-white">{choice.title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/60">{choice.body}</p>
    </button>
  );
}

/** Six-step, no-backward candidate assessment: name, a memory round, two quick
 * decision prompts, an open-ended story, then recalling the pattern from memory.
 * Completing it submits automatically to `/api/field-test/submit` — the candidate
 * never has to send or copy anything themselves. */
export function FieldTest() {
  const [step, setStep] = useState<Step>(1);

  const [name, setName] = useState('');
  const [deptChoice, setDeptChoice] = useState('');
  const [deptWhy, setDeptWhy] = useState('');
  const [earlyChoice, setEarlyChoice] = useState('');
  const [q5, setQ5] = useState('');

  const [pattern, setPattern] = useState<number[]>([]);
  const [lit, setLit] = useState<number[]>([]);
  const [playbackDone, setPlaybackDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playsUsed, setPlaysUsed] = useState(0);
  const [recall, setRecall] = useState<number[]>([]);

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('submitting');
  const [submitCode, setSubmitCode] = useState('');
  const [copied, setCopied] = useState(false);

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Generate a fresh pattern the moment step 2 mounts — playback itself is
  // manual, triggered by the candidate.
  useEffect(() => {
    if (step !== 2) return;
    setPattern(randomPattern());
    setPlaybackDone(false);
    setPlaysUsed(0);
    setLit([]);
    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [step]);

  function playPattern() {
    if (isPlaying || playsUsed >= MAX_PLAYS) return;
    setIsPlaying(true);
    let elapsed = 300;
    pattern.forEach((tile, i) => {
      const onTimeout = setTimeout(() => setLit([tile]), elapsed);
      timeouts.current.push(onTimeout);
      elapsed += LIGHT_MS;

      const offTimeout = setTimeout(() => {
        setLit([]);
        if (i === pattern.length - 1) {
          setPlaybackDone(true);
          setIsPlaying(false);
          setPlaysUsed((prev) => prev + 1);
        }
      }, elapsed);
      timeouts.current.push(offTimeout);
      elapsed += GAP_MS;
    });
  }

  function tapRecall(index: number) {
    if (recall.length >= PATTERN_LENGTH) return;
    setRecall((prev) => [...prev, index]);
  }

  async function submit() {
    setStep(7);
    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/field-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          deptChoiceId: deptChoice,
          deptWhy,
          earlyChoiceId: earlyChoice,
          story: q5,
          pattern,
          recall,
        }),
      });
      if (!res.ok) throw new Error(`submit failed with ${res.status}`);
      const data = (await res.json()) as { code: string };
      setSubmitCode(data.code);
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  }

  async function copyFallback() {
    const text = buildFallbackText({ name, deptChoice, deptWhy, earlyChoice, q5, pattern, recall });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API unavailable — the mailto fallback still works.
    }
  }

  const fallbackText = buildFallbackText({
    name,
    deptChoice,
    deptWhy,
    earlyChoice,
    q5,
    pattern,
    recall,
  });
  const fallbackMailHref = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(`IVP Committee Screening Result — ${name}`)}&body=${encodeURIComponent(fallbackText)}`;

  const playsLeft = MAX_PLAYS - playsUsed;
  const progress = step === 7 ? 6 : step - 1;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#07070b]" aria-hidden="true">
        <Image
          src="/wallpaper.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/90" />
      </div>
      <main id="main-content" className="relative z-10 mx-auto max-w-xl px-5 py-16 sm:py-24">
        <div
          className="mb-10 flex gap-1.5"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={6}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < progress
                  ? 'bg-cyan-400'
                  : i === progress && step !== 7
                    ? 'bg-cyan-400/40'
                    : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {step !== 7 && <p className={eyebrow}>SHPE NJIT &middot; Internal VP Committee</p>}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                IVP Committee Screening
              </h1>
              <p className="mt-3 max-w-prose text-white/60">
                Six short steps — a memory round, two quick calls, and one real story. No wrong
                answers, and once you move forward you can&apos;t go back, so take your time on each
                step before continuing. About 6&ndash;9 minutes total.
              </p>
            </div>
            <Input
              label="Your name"
              placeholder="First and last name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-3.5">
              <span aria-hidden="true" className="text-amber-400">
                ⚠
              </span>
              <p className="text-xs leading-relaxed text-amber-200/90">
                Once you hit Start, there&apos;s no going back to an earlier step. Make sure
                you&apos;re ready before you begin.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/45">{STEP_LABELS[1]}</span>
              <Button disabled={name.trim().length < 2} onClick={() => setStep(2)}>
                Start &rarr;
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Watch the pattern.</h2>
              <p className="mt-3 max-w-prose text-white/60">
                Press play when you&apos;re ready. You get one replay after that — then you&apos;ll
                repeat it from memory in step 6, with no way back to check.
              </p>
            </div>
            <MemoryGrid lit={lit} />
            <Button
              variant="secondary"
              type="button"
              onClick={playPattern}
              disabled={isPlaying || playsUsed >= MAX_PLAYS}
            >
              {playsUsed === 0
                ? 'Play pattern'
                : playsUsed < MAX_PLAYS
                  ? `Replay (${playsLeft} left)`
                  : 'No replays left'}
            </Button>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/45">
                {playbackDone
                  ? "That's the pattern. You'll repeat it in step 6."
                  : 'Not played yet.'}
              </span>
              <Button disabled={!playbackDone} onClick={() => setStep(3)}>
                Continue &rarr;
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                You get handed a department nobody&apos;s cracked yet.
              </h2>
              <p className="mt-3 max-w-prose text-white/60">
                Jossue splits up NJIT&apos;s academic departments across the committee for outreach.
                You draw one that&apos;s never once replied to a SHPE email. Where do you actually
                start?
              </p>
            </div>
            <div className="flex flex-col gap-3.5">
              {DEPT_CHOICES.map((choice) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  selected={deptChoice === choice.id}
                  onSelect={() => setDeptChoice(choice.id)}
                />
              ))}
            </div>
            {deptChoice && (
              <Input
                label="One line on why (optional)"
                placeholder="If you want to say more"
                value={deptWhy}
                onChange={(e) => setDeptWhy(e.target.value)}
              />
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/45">{STEP_LABELS[3]}</span>
              <Button disabled={!deptChoice} onClick={() => setStep(4)}>
                Continue &rarr;
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                You finish early. Nobody else has.
              </h2>
              <p className="mt-3 max-w-prose text-white/60">
                Your piece of a group task is done a day ahead. The rest of the committee is still
                grinding through theirs. What do you do with the extra time?
              </p>
            </div>
            <div className="flex flex-col gap-3.5">
              {EARLY_CHOICES.map((choice) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  selected={earlyChoice === choice.id}
                  onSelect={() => setEarlyChoice(choice.id)}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/45">{STEP_LABELS[4]}</span>
              <Button disabled={!earlyChoice} onClick={() => setStep(5)}>
                Continue &rarr;
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Tell me about a time you kept pushing on something even though nobody was checking
                on you.
              </h2>
              <p className="mt-3 max-w-prose text-white/60">
                Doesn&apos;t have to be engineering. Doesn&apos;t have to be SHPE. Three or four
                sentences is plenty.
              </p>
            </div>
            <Textarea
              label="Your story"
              placeholder="Three or four sentences is plenty"
              rows={6}
              value={q5}
              onChange={(e) => setQ5(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/45">{STEP_LABELS[5]}</span>
              <Button disabled={q5.trim().length < 20} onClick={() => setStep(6)}>
                Continue &rarr;
              </Button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Repeat the pattern from step 2.
              </h2>
              <p className="mt-3 max-w-prose text-white/60">
                Tap the tiles in the order they lit up. No hints, no replay.
              </p>
            </div>
            <MemoryGrid picked={recall} onTap={tapRecall} />
            <div className="flex items-center justify-between">
              <Button variant="secondary" type="button" onClick={() => setRecall([])}>
                Clear
              </Button>
              <span className="text-xs text-white/45">
                {recall.length} of {PATTERN_LENGTH} tapped
              </span>
              <Button disabled={recall.length < PATTERN_LENGTH} onClick={submit}>
                Submit &rarr;
              </Button>
            </div>
          </div>
        )}

        {step === 7 && submitStatus === 'submitting' && (
          <div className="flex flex-col gap-6">
            <p className={eyebrow}>Submitting</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Sending this in&hellip;</h2>
            <p className="max-w-prose text-white/60">One second — no need to do anything.</p>
          </div>
        )}

        {step === 7 && submitStatus === 'success' && (
          <div className="flex flex-col gap-6">
            <p className={eyebrow}>Done</p>
            <div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                That&apos;s it — thank you.
              </h2>
              <p className="mt-3 max-w-prose text-white/60">
                Saved — you&apos;re all set. There&apos;s nothing else for you to send.
                <span className="mt-1 block text-white/40">Reference {submitCode}</span>
              </p>
            </div>
            <p className="text-xs leading-relaxed text-white/45">
              Whatever the outcome here, if you want to talk through anything — outreach, events,
              how the chapter runs — I&apos;m glad to. That&apos;s most of the point of the
              committee anyway.
            </p>
          </div>
        )}

        {step === 7 && submitStatus === 'error' && (
          <div className="flex flex-col gap-6">
            <p className={eyebrow}>One hiccup</p>
            <div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                That didn&apos;t go through.
              </h2>
              <p className="mt-3 max-w-prose text-white/60">
                Your answers are still right here — nothing&apos;s lost. Try submitting again; if it
                keeps failing, use the backup option below.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={submit}>Try again</Button>
            </div>
            <div className="glass-card flex flex-col gap-3 rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                Backup, only if retrying doesn&apos;t work
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" onClick={copyFallback}>
                  {copied ? 'Copied ✓' : 'Copy my answers'}
                </Button>
                <a
                  href={fallbackMailHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Email my answers
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
