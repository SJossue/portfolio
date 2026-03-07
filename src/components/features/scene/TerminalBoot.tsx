'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

const INIT_LOGS = [
  { prefix: '⚡', text: 'jossue.ai Engine Initializing...', color: 'text-amber-400' },
  { prefix: '>', text: 'Connecting to neural interface...', color: 'text-cyan-400/60' },
  { prefix: '[+]', text: 'Loaded 3D Context Window', color: 'text-white/60' },
  { prefix: '[~]', text: 'Optimizing WebGL shaders...', color: 'text-white/60' },
];

const KEYWORDS = [
  'const',
  'let',
  'function',
  'return',
  'import',
  'export',
  'if',
  'else',
  'for',
  'await',
  'async',
  'new',
  'class',
  'extends',
  'yield',
  'switch',
  'case',
  'try',
  'catch',
  'throw',
];
const IDENTS = [
  'mesh',
  'ref',
  'node',
  'ctx',
  'gl',
  'mat',
  'buf',
  'ptr',
  'env',
  'cfg',
  'res',
  'idx',
  'tmp',
  'src',
  'out',
  'cam',
  'pos',
  'rot',
  'vel',
  'dt',
  'state',
  'prev',
  'next',
  'data',
  'scene',
  'frame',
  'delta',
  'alpha',
  'shader',
  'pipeline',
];
const SYMBOLS = [
  ' = ',
  ' => ',
  ' !== ',
  ' === ',
  ' += ',
  ' |= ',
  ' && ',
  ' || ',
  ': ',
  ' << ',
  ' >> ',
];
const ENDINGS = [
  ';',
  ' {',
  ' }',
  ');',
  '],',
  '});',
  ' });',
  '();',
  ' {}',
  ' = null;',
  ' = [];',
  ' = 0;',
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomLine(): string {
  const indent = '  '.repeat(Math.floor(Math.random() * 3));
  const parts = [
    randomPick(KEYWORDS),
    ' ',
    randomPick(IDENTS),
    randomPick(SYMBOLS),
    randomPick(IDENTS),
    '.',
    randomPick(IDENTS),
    '(',
    String(Math.floor(Math.random() * 256)),
    ', 0x' + Math.floor(Math.random() * 0xffff).toString(16),
    ')',
    randomPick(ENDINGS),
  ];
  return indent + parts.join('');
}

const CHARS_PER_TICK = 3;
const TYPE_SPEED_MS = 4;
const LINE_PAUSE_MS = 40;
const STREAM_INTERVAL_MS = 35;
const MAX_VISIBLE_LINES = 80;

type LogLine = { prefix: string; text: string; color: string };

export function TerminalBoot({ onComplete }: { onComplete: () => void }) {
  const [history, setHistory] = useState<LogLine[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [logIndex, setLogIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<'init' | 'streaming'>('init');
  const completedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const markComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  // Init phase — type out boot lines character-by-character
  useEffect(() => {
    if (phase !== 'init') return;

    if (logIndex >= INIT_LOGS.length) {
      markComplete();
      setPhase('streaming');
      return;
    }

    const target = INIT_LOGS[logIndex];

    if (charIndex < target.text.length) {
      const nextIndex = Math.min(charIndex + CHARS_PER_TICK, target.text.length);
      const timer = setTimeout(() => {
        setCurrentLineText(target.text.slice(0, nextIndex));
        setCharIndex(nextIndex);
      }, TYPE_SPEED_MS);
      return () => clearTimeout(timer);
    }

    // Line complete — push to history and advance
    const timer = setTimeout(() => {
      setHistory((prev) => [...prev, target]);
      setCurrentLineText('');
      setLogIndex((l) => l + 1);
      setCharIndex(0);
    }, LINE_PAUSE_MS);

    return () => clearTimeout(timer);
  }, [logIndex, charIndex, phase, markComplete]);

  // Streaming phase — dump whole random lines rapidly
  useEffect(() => {
    if (phase !== 'streaming') return;

    const interval = setInterval(() => {
      const line: LogLine = {
        prefix: '>',
        text: generateRandomLine(),
        color: 'text-cyan-400/60',
      };
      setHistory((prev) => {
        const next = [...prev, line];
        return next.length > MAX_VISIBLE_LINES ? next.slice(next.length - MAX_VISIBLE_LINES) : next;
      });
    }, STREAM_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [phase]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, currentLineText]);

  const activeLine = phase === 'init' && logIndex < INIT_LOGS.length ? INIT_LOGS[logIndex] : null;

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex h-full w-full bg-[#111010]">
      {/* Left Side: Image */}
      <div className="relative hidden w-[40%] border-r border-white/5 md:block lg:w-[50%]">
        <img
          src="/social/jossue-accord-photo.jpg"
          alt="Jossue"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#111010]" />
      </div>

      {/* Right Side: AI Terminal Screen */}
      <div className="flex w-full flex-col justify-center p-8 md:w-[60%] lg:w-[50%] lg:p-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <span className="font-mono text-xs tracking-widest text-orange-400">
            JOSSUE.AI // BUILD MODE
          </span>
        </div>

        <div
          ref={containerRef}
          className="h-[60vh] w-full max-w-2xl overflow-y-auto p-6 font-mono text-sm leading-relaxed"
        >
          {history.map((log, i) => (
            <div key={i} className="mb-1 flex gap-3">
              <span className="w-6 shrink-0 text-white/30">{log.prefix}</span>
              <span className={log.color}>{log.text}</span>
            </div>
          ))}

          {activeLine ? (
            <div className="flex gap-3">
              <span className="w-6 shrink-0 text-white/30">{activeLine.prefix}</span>
              <span className={activeLine.color}>
                {currentLineText}
                <span className="animate-typing-cursor ml-[1px] inline-block h-[1em] w-[8px] bg-white align-middle" />
              </span>
            </div>
          ) : (
            phase === 'streaming' && (
              <div className="flex gap-3">
                <span className="w-6 shrink-0 text-white/30">&gt;</span>
                <span className="animate-typing-cursor ml-[1px] inline-block h-[1em] w-[8px] bg-white align-middle" />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
