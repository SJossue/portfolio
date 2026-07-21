'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useCoarsePointer } from '@/hooks/useCoarsePointer';
import { renderChatMarkdown } from '@/lib/chat-markdown';

interface IslandChatProps {
  accentColor: string;
  accentRgb: string;
  isMobile?: boolean;
  defaultMinimized?: boolean;
  /** When set, scopes the assistant to a single project (sent to the API). */
  projectId?: string;
  /** Human-readable project name — drives the placeholder/suggestions. */
  projectLabel?: string;
}

type ViewMode = 'default' | 'minimized' | 'fullscreen';

const MAX_INPUT_CHARS = 500;

const SUGGESTIONS = [
  'What project are you proudest of?',
  'Walk me through your experience.',
  'What are you studying?',
  'How can I get in touch?',
];

const PROJECT_SUGGESTIONS = [
  'What problem does this solve?',
  'What was the hardest part?',
  'Which tools did you use?',
  'What did you learn?',
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

export default function IslandChat({
  accentColor,
  accentRgb,
  isMobile = false,
  defaultMinimized = false,
  projectId,
  projectLabel,
}: IslandChatProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        ...(projectId ? { body: { projectId } } : {}),
      }),
    [projectId],
  );

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport,
    experimental_throttle: 50,
  });

  const [input, setInput] = useState('');
  const [available, setAvailable] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMinimized ? 'minimized' : 'default');
  const closeMode: ViewMode = isMobile ? 'minimized' : 'default';
  const openMode: ViewMode = isMobile ? 'fullscreen' : 'default';
  const touch = useCoarsePointer();
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // On mobile the chat rests as a FAB, opening to fullscreen on tap. `isMobile` is
  // correct on the first client render, but `viewMode` is seeded during the
  // server-snapshot pass (when it's still false), so bridge them once after mount —
  // only from the untouched `default` state, so a user who has opened it stays open.
  const bridgedRef = useRef(false);
  useEffect(() => {
    if (bridgedRef.current || !isMobile) return;
    bridgedRef.current = true;
    setViewMode((m) => (m === 'default' ? 'minimized' : m));
  }, [isMobile]);

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

  // Lock body scroll + bind Escape in fullscreen.
  useEffect(() => {
    if (viewMode !== 'fullscreen') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewMode(closeMode);
    };
    window.addEventListener('keydown', onKey);
    // Don't auto-focus on mobile — that pops up the on-screen keyboard
    // immediately and covers half the chat the moment it opens.
    if (!isMobile) inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [viewMode, closeMode, isMobile]);

  const busy = status === 'submitted' || status === 'streaming';
  const hasMessages = messages.length > 0;
  const disabled = available === false || busy;
  const isFullscreen = viewMode === 'fullscreen';

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

  const sendSuggestion = useCallback(
    async (text: string) => {
      if (busy || available === false) return;
      if (error) clearError();
      try {
        await sendMessage({ text });
      } catch {
        // swallowed — error surfaced via `error`
      }
    },
    [busy, available, error, clearError, sendMessage],
  );

  const suggestions = projectId ? PROJECT_SUGGESTIONS : SUGGESTIONS;
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
        : projectLabel
          ? `Ask about ${projectLabel}…`
          : 'Ask about Jossue…';

  if (viewMode === 'minimized') {
    return (
      <button
        type="button"
        onClick={() => setViewMode(openMode)}
        aria-label="Open chat"
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:-translate-y-0.5 md:h-auto md:w-auto md:gap-2 md:px-4 md:py-2 md:font-mono md:text-[11px] md:uppercase md:tracking-wider"
        style={{
          ['--accent' as string]: accent,
          ['--accent-rgb' as string]: rgb,
          background: 'rgba(0,0,0,0.55)',
          borderColor: `rgba(${rgb}, 0.3)`,
          color: accent,
          boxShadow: `0 10px 30px -15px rgba(${rgb}, 0.45)`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5 md:h-[14px] md:w-[14px]"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="hidden md:inline">Chat with Jossue</span>
      </button>
    );
  }

  const panel = (
    <div
      className={
        isFullscreen
          ? 'relative z-10 flex h-full max-h-[min(720px,90dvh)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border px-4 py-4 backdrop-blur-md sm:px-6'
          : 'w-full'
      }
      style={
        isFullscreen
          ? {
              background: 'rgba(6,6,14,0.85)',
              borderColor: `rgba(${rgb}, 0.28)`,
              boxShadow: `0 30px 80px -20px rgba(${rgb}, 0.4)`,
            }
          : undefined
      }
      onClick={(e) => {
        if (isFullscreen) e.stopPropagation();
      }}
    >
      {/* Toolbar: minimize + fullscreen toggle */}
      <div
        className={`flex items-center justify-between gap-2 ${
          isFullscreen ? 'mb-3 pb-2' : 'mb-1.5'
        }`}
        style={isFullscreen ? { borderBottom: `1px solid rgba(${rgb}, 0.15)` } : undefined}
      >
        {isFullscreen ? (
          <span
            className="font-mono text-[11px] uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            Chat with Jossue
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('minimized')}
            aria-label="Minimize chat"
            className={`flex items-center justify-center rounded-md transition-colors hover:bg-white/10 ${
              touch ? 'h-11 w-11' : 'h-6 w-6'
            }`}
            style={{ color: accent }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode(isFullscreen ? closeMode : 'fullscreen')}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Expand chat'}
            className={`flex items-center justify-center rounded-md transition-colors hover:bg-white/10 ${
              touch ? 'h-11 w-11' : 'h-6 w-6'
            }`}
            style={{ color: accent }}
          >
            {isFullscreen ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Message thread */}
      {hasMessages && (
        <div
          ref={threadRef}
          className={`scrollbar-thin mb-2 overflow-y-auto rounded-2xl border px-3 py-2 text-[13px] leading-relaxed backdrop-blur-md transition-[max-height] duration-300 ${
            isFullscreen
              ? 'max-h-none flex-1'
              : messages.length >= 2
                ? 'max-h-[260px] sm:max-h-[340px]'
                : 'max-h-[140px] sm:max-h-[180px]'
          }`}
          style={{
            background: 'rgba(0,0,0,0.55)',
            borderColor: `rgba(${rgb}, 0.2)`,
            boxShadow: isFullscreen ? 'none' : `0 10px 30px -15px rgba(${rgb}, 0.35)`,
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
                  {text ? (
                    isUser ? (
                      text
                    ) : (
                      renderChatMarkdown(text)
                    )
                  ) : !isUser && busy ? (
                    <ThinkingDots />
                  ) : null}
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
        <div
          className={`mb-2 flex flex-wrap gap-1.5 ${
            isFullscreen ? 'flex-1 content-start justify-start' : 'justify-center'
          }`}
        >
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
          ref={inputRef}
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
            className={`flex items-center justify-center rounded-full transition-colors ${
              touch ? 'h-11 w-11' : 'h-7 w-7'
            }`}
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
            className={`flex items-center justify-center rounded-full transition-all hover:scale-105 disabled:opacity-40 ${
              touch ? 'h-11 w-11' : 'h-7 w-7'
            }`}
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
            <span className="text-white/60">Answers return when chat is back online.</span>
          )}
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    // Portal to <body>: the trifold side panels use a CSS `transform`, which
    // creates a containing block and would otherwise trap this `fixed` overlay
    // inside its panel. Rendering at the document root escapes that.
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Chat with Jossue"
        className="pointer-events-auto fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
        style={{
          ['--accent' as string]: accent,
          ['--accent-rgb' as string]: rgb,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        onClick={() => setViewMode(closeMode)}
      >
        {panel}
      </div>,
      document.body,
    );
  }

  return (
    <div
      className="pointer-events-auto w-full max-w-[520px] px-2 sm:max-w-[560px]"
      style={{ ['--accent' as string]: accent, ['--accent-rgb' as string]: rgb }}
    >
      {panel}
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
