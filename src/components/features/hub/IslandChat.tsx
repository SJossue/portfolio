'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';

interface IslandChatProps {
  accentColor: string;
  accentRgb: string;
}

const MAX_INPUT_CHARS = 500;

const SUGGESTIONS = [
  'What project are you proudest of?',
  'Walk me through your experience.',
  'What are you studying?',
  'How can I get in touch?',
];

interface UIPart {
  type: string;
  text?: string;
}

function extractText(parts: UIPart[] | undefined): string {
  if (!parts) return '';
  return parts
    .filter((p) => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text ?? '')
    .join('');
}

export default function IslandChat({ accentColor, accentRgb }: IslandChatProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
      }),
    [],
  );

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport,
    experimental_throttle: 50,
  });

  const [input, setInput] = useState('');
  const [available, setAvailable] = useState<boolean | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (available !== null) return;
    let cancelled = false;
    fetch('/api/chat', { method: 'GET' })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setAvailable(Boolean(d?.available));
      })
      .catch(() => {
        if (!cancelled) setAvailable(true);
      });
    return () => {
      cancelled = true;
    };
  }, [available]);

  // Auto-scroll message thread to bottom as tokens arrive.
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const busy = status === 'submitted' || status === 'streaming';
  const hasMessages = messages.length > 0;
  const disabled = available === false || busy;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy || available === false) return;
    setInput('');
    if (error) clearError();
    try {
      await sendMessage({ text });
    } catch {
      // useChat surfaces the error through `error`; nothing more to do here.
    }
  };

  const sendSuggestion = async (text: string) => {
    if (busy || available === false) return;
    if (error) clearError();
    try {
      await sendMessage({ text });
    } catch {
      // swallowed — error surfaced via `error`
    }
  };

  const suggestions = SUGGESTIONS;
  const accent = accentColor;
  const rgb = accentRgb;

  const friendlyError = (() => {
    if (!error) return null;
    const msg = error.message ?? '';
    if (msg.includes('429') || /rate limit/i.test(msg))
      return 'Rate limit reached. Give it a minute.';
    if (msg.includes('503') || /unavailable/i.test(msg)) return 'Chat is temporarily unavailable.';
    return 'Something went wrong. Try again.';
  })();

  const placeholder =
    available === false
      ? 'Chat unavailable right now'
      : hasMessages
        ? 'Keep asking…'
        : 'Ask about Jossue…';

  return (
    <div
      className="pointer-events-auto w-full max-w-[520px] px-2 sm:max-w-[560px]"
      style={{ ['--accent' as string]: accent, ['--accent-rgb' as string]: rgb }}
    >
      {/* Message thread — only when there are messages */}
      {hasMessages && (
        <div
          ref={threadRef}
          className="scrollbar-thin mb-2 max-h-[140px] overflow-y-auto rounded-2xl border px-3 py-2 text-[13px] leading-relaxed backdrop-blur-md sm:max-h-[180px]"
          style={{
            background: 'rgba(0,0,0,0.55)',
            borderColor: `rgba(${rgb}, 0.2)`,
            boxShadow: `0 10px 30px -15px rgba(${rgb}, 0.35)`,
          }}
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((m) => {
            const text = extractText(m.parts as UIPart[] | undefined);
            const isUser = m.role === 'user';
            return (
              <div key={m.id} className={`mb-1.5 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-xl px-3 py-1.5 ${
                    isUser ? 'text-white' : 'text-white/90'
                  }`}
                  style={
                    isUser
                      ? {
                          background: `rgba(${rgb}, 0.18)`,
                          border: `1px solid rgba(${rgb}, 0.3)`,
                        }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }
                  }
                >
                  {text || (!isUser && busy ? <ThinkingDots /> : null)}
                </div>
              </div>
            );
          })}
          {status === 'submitted' && (
            <div className="flex justify-start">
              <div
                className="rounded-xl px-3 py-1.5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <ThinkingDots />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestion chips — only when empty and available */}
      {!hasMessages && available !== false && suggestions.length > 0 && (
        <div className="mb-2 flex flex-wrap justify-center gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => sendSuggestion(s)}
              disabled={busy}
              className="rounded-full px-3 py-1 font-mono text-[11px] transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{
                background: `rgba(${rgb}, 0.06)`,
                border: `1px solid rgba(${rgb}, 0.18)`,
                color: accent,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-md transition-colors focus-within:border-[color:var(--accent)]"
        style={{
          background: 'rgba(0,0,0,0.55)',
          borderColor: `rgba(${rgb}, 0.22)`,
          boxShadow: `0 10px 30px -20px rgba(${rgb}, 0.45)`,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
          maxLength={MAX_INPUT_CHARS}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Chat with Jossue's assistant"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-white/35 focus:outline-none disabled:opacity-50"
        />
        {busy ? (
          <button
            type="button"
            onClick={() => stop()}
            aria-label="Stop response"
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
            style={{
              background: `rgba(${rgb}, 0.18)`,
              color: accent,
              border: `1px solid rgba(${rgb}, 0.3)`,
            }}
          >
            <span className="block h-2.5 w-2.5 rounded-[2px] bg-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            aria-label="Send message"
            className="flex h-7 w-7 items-center justify-center rounded-full transition-all hover:scale-105 disabled:opacity-40"
            style={{
              background: `rgba(${rgb}, 0.18)`,
              color: accent,
              border: `1px solid rgba(${rgb}, 0.3)`,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        )}
      </form>

      {(friendlyError || available === false) && (
        <div className="mt-1.5 text-center font-mono text-[10px] tracking-wide">
          {friendlyError ? (
            <span className="text-red-400/80">{friendlyError}</span>
          ) : (
            <span className="text-white/30">Answers return when chat is back online.</span>
          )}
        </div>
      )}
    </div>
  );
}

function ThinkingDots() {
  return (
    <span
      aria-label="assistant is thinking"
      className="inline-flex items-center gap-1 align-middle"
    >
      <span className="h-1 w-1 animate-pulse rounded-full bg-white/60 [animation-delay:0ms]" />
      <span className="h-1 w-1 animate-pulse rounded-full bg-white/60 [animation-delay:150ms]" />
      <span className="h-1 w-1 animate-pulse rounded-full bg-white/60 [animation-delay:300ms]" />
    </span>
  );
}
