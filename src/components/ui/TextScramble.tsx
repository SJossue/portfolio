'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleChars?: string;
  speed?: number;
  trigger?: boolean;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export default function TextScramble({
  text,
  className = '',
  scrambleChars = DEFAULT_CHARS,
  speed = 50,
  trigger = true,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const scramble = useCallback(() => {
    const duration = text.length * speed;
    startTimeRef.current = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealedCount) {
          result += text[i];
        } else {
          result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }
      setDisplayed(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(update);
      }
    };
    frameRef.current = requestAnimationFrame(update);
  }, [text, speed, scrambleChars]);

  useEffect(() => {
    if (trigger) {
      scramble();
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [trigger, scramble]);

  return <span className={className}>{displayed}</span>;
}
