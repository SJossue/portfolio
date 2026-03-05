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
  const [waitingForInput, setWaitingForInput] = useState(false);

  useEffect(() => {
    if (waitingForInput) return;

    if (lineIndex >= BOOT_LINES.length) {
      setWaitingForInput(true);
      return;
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
  }, [lineIndex, charIndex, waitingForInput]);

  // Handle actual operator input to proceed
  useEffect(() => {
    if (!waitingForInput) return;

    function handleInput() {
      onComplete();
    }

    window.addEventListener('keydown', handleInput);
    window.addEventListener('click', handleInput);

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('click', handleInput);
    };
  }, [waitingForInput, onComplete]);

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-[#0a0908]">
      <div className="w-full max-w-md space-y-1 rounded-lg border border-cyan-400/10 bg-black/60 p-4 font-mono text-xs backdrop-blur-sm">
        {lines.map((line, i) => (
          <div key={i} className="text-cyan-400/60">
            {line}
          </div>
        ))}
        {!waitingForInput && (
          <div className="text-cyan-300">
            {currentLine}
            <span className="animate-typing-cursor ml-0.5">&nbsp;</span>
          </div>
        )}
        {waitingForInput && (
          <div className="mt-4 animate-pulse text-center text-cyan-400">
            [ CLICK OR PRESS ANY KEY TO INITIALIZE ]
          </div>
        )}
      </div>
    </div>
  );
}
