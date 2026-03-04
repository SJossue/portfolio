'use client';

import { useEffect, useState } from 'react';

export function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-cyan-400/5 bg-black/50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-cyan-400/40">{time}</span>
        <span className="text-white/20">|</span>
        <span className="text-white/30">SYS.PORTFOLIO</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/80" />
        <span className="text-emerald-400/60">CONNECTED</span>
      </div>
    </div>
  );
}
