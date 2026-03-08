'use client';

import { useChat } from '@ai-sdk/react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { ContactPanel } from './ContactPanel';
import { contactLinks } from '@/content';

const MAX_LENGTH = 500;
const MAX_TURNS = 20;

export function ChatPanel() {
  const [chatAvailable, setChatAvailable] = useState<boolean | null>(null);
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'streaming' || status === 'submitted';
  const atTurnLimit = messages.length >= MAX_TURNS;

  // Check if chat API is available on mount
  useEffect(() => {
    fetch('/api/chat')
      .then((r) => r.json())
      .then((data: { available?: boolean }) => setChatAvailable(data.available === true))
      .catch(() => setChatAvailable(false));
  }, []);

  // Fall back to static contact panel if chat is unavailable
  if (chatAvailable === false) return <ContactPanel />;
  // Show nothing while checking (avoids flash)
  if (chatAvailable === null) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading || atTurnLimit) return;
    setInput('');
    sendMessage({ role: 'user', parts: [{ type: 'text', text }] });
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-sm text-white/50">
        <span className="text-orange-400">Ask me anything</span> about Jossue&apos;s work, skills,
        or projects.
      </p>

      {/* Messages */}
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2 text-xs text-white/30">
            <p>Try asking:</p>
            <button
              type="button"
              onClick={() => setInput('What tech stack does Jossue work with?')}
              className="text-left text-white/50 transition-colors hover:text-cyan-400"
            >
              &gt; What tech stack does Jossue work with?
            </button>
            <button
              type="button"
              onClick={() => setInput('Tell me about his projects')}
              className="text-left text-white/50 transition-colors hover:text-cyan-400"
            >
              &gt; Tell me about his projects
            </button>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-sm ${m.role === 'user' ? 'text-cyan-400' : 'text-white/80'}`}
          >
            <span className="font-bold text-white/40">{m.role === 'user' ? '> ' : '$ '}</span>
            {m.parts
              .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('')}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="text-sm text-white/40">
            <span className="animate-pulse">$ thinking...</span>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-400/80">
            {error.message.includes('Rate limit') || error.message.includes('429')
              ? 'Too many requests. Please wait a moment.'
              : 'Connection error. Try again.'}
          </div>
        )}

        {atTurnLimit && (
          <div className="text-sm text-yellow-400/80">
            Conversation limit reached. Reach out directly via the links below.
          </div>
        )}
      </div>

      {/* Scroll anchor */}
      <ScrollAnchor scrollRef={scrollRef} deps={messages} />

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={atTurnLimit ? 'Limit reached' : 'Ask something...'}
          className="min-w-0 flex-1 border border-white/20 bg-black/40 px-3 py-2 font-mono text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
          disabled={isLoading || atTurnLimit}
          maxLength={MAX_LENGTH}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || atTurnLimit}
          className="border border-white/20 bg-black/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black disabled:opacity-30"
        >
          Send
        </button>
      </form>

      {/* Contact links fallback */}
      <div className="border-t border-white/10 pt-3">
        <p className="mb-2 text-xs text-white/30">Or reach out directly:</p>
        <div className="flex flex-wrap gap-3">
          {contactLinks.map((link) => {
            const styles: Record<string, string> = {
              github: 'bg-white text-black border-white hover:bg-white/80',
              linkedin: 'bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-[#004182]',
              email: 'bg-[#EA4335] text-white border-[#EA4335] hover:bg-[#C5221F]',
            };
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className={`border px-3 py-1.5 font-mono text-xs transition-colors ${styles[link.id] ?? 'border-white/10 text-white/50 hover:border-cyan-400/50 hover:text-cyan-400'}`}
              >
                {link.icon} {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Auto-scroll to bottom when messages change. */
function ScrollAnchor({
  scrollRef,
  deps,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  deps: unknown;
}) {
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [scrollRef, deps]);
  return null;
}
