'use client';

import { useEffect, useState } from 'react';

const BOOT_LINES = [
  '> SYSTEM INIT...',
  '> LOADING NEURAL INTERFACE v3.7.1',
  '> CALIBRATING HOLOGRAPHIC DISPLAY',
  '> GARAGE MODULE: ONLINE',
  '> AWAITING OPERATOR INPUT',
];

const CHAR_DELAY = 35;
const LINE_DELAY = 400;

export function TerminalBoot({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIndex >= BOOT_LINES.length) {
      setDone(true);
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }

    const fullLine = BOOT_LINES[lineIndex];

    if (charIndex < fullLine.length) {
      const timer = setTimeout(() => {
        setCurrentLine(fullLine.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, CHAR_DELAY);
      return () => clearTimeout(timer);
    }

    // Line complete — add to history and move to next
    const timer = setTimeout(() => {
      setLines((prev) => [...prev, fullLine]);
      setCurrentLine('');
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, LINE_DELAY);
    return () => clearTimeout(timer);
  }, [lineIndex, charIndex, done, onComplete]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-1 rounded-lg border border-cyan-400/10 bg-black/60 p-4 font-mono text-xs backdrop-blur-sm">
        {lines.map((line, i) => (
          <div key={i} className="text-cyan-400/60">
            {line}
          </div>
        ))}
        {!done && (
          <div className="text-cyan-300">
            {currentLine}
            <span className="animate-typing-cursor ml-0.5">&nbsp;</span>
          </div>
        )}
      </div>
    </div>
  );
}
