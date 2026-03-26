'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { createElement } from 'react';

interface SplitResult {
  words: { chars: string[]; word: string }[];
  elements: ReactNode;
}

export function useTextSplit(text: string, className?: string): SplitResult {
  return useMemo(() => {
    const words = text.split(' ').map((word) => ({
      word,
      chars: word.split(''),
    }));

    let charIndex = 0;
    const elements = createElement(
      'span',
      { 'aria-label': text, role: 'text' },
      words.map((w, wi) =>
        createElement(
          'span',
          {
            key: wi,
            className: 'inline-block overflow-hidden',
            'aria-hidden': 'true',
          },
          w.chars.map((char) => {
            const idx = charIndex++;
            return createElement(
              'span',
              {
                key: idx,
                className: `inline-block split-char ${className ?? ''}`.trim(),
                'data-char-index': idx,
              },
              char,
            );
          }),
          // Add space after each word except the last
          wi < words.length - 1
            ? createElement(
                'span',
                { key: `space-${wi}`, className: 'inline-block split-char' },
                '\u00A0',
              )
            : null,
        ),
      ),
    );

    return { words, elements };
  }, [text, className]);
}
