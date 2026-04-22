'use client';

import { useCallback, useEffect, useState } from 'react';

interface HubIntroProps {
  onDismiss?: () => void;
}

export default function HubIntro({ onDismiss }: HubIntroProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const handleDismiss = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('hub-intro-seen', '1');
      } catch {}
      onDismiss?.();
    }, 600);
  }, [onDismiss]);

  useEffect(() => {
    // Check if user has seen intro before
    try {
      if (sessionStorage.getItem('hub-intro-seen')) {
        setVisible(false);
        return;
      }
    } catch {}

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => handleDismiss(), 5000);
    return () => clearTimeout(timer);
  }, [handleDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-24 left-1/2 z-[25] -translate-x-1/2 text-center transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-2 backdrop-blur-md">
        <span className="font-mono text-[10px] tracking-[2px] text-slate-300">SCROLL OR USE</span>
        <div className="flex items-center gap-2">
          <kbd className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/80">
            &larr;
          </kbd>
          <kbd className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/80">
            &rarr;
          </kbd>
        </div>
        <span className="font-mono text-[10px] tracking-[2px] text-slate-300">TO EXPLORE</span>
      </div>
    </div>
  );
}
