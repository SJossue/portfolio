'use client';

import { useEffect, useRef, useCallback } from 'react';

interface TerminalBootProps {
  onComplete: () => void;
  modelsReady: boolean;
}

export function TerminalBoot({ onComplete, modelsReady }: TerminalBootProps) {
  const completedRef = useRef(false);

  const markComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  // When models are ready, fire onComplete after a brief moment
  useEffect(() => {
    if (!modelsReady) return;
    const timer = setTimeout(markComplete, 300);
    return () => clearTimeout(timer);
  }, [modelsReady, markComplete]);

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

      {/* Right Side: Loading Screen */}
      <div className="flex w-full flex-col items-start justify-center p-8 md:w-[60%] lg:w-[50%] lg:p-16">
        {/* Branding */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <span className="font-mono text-xs tracking-widest text-orange-400">
            JOSSUE.AI // BUILD MODE
          </span>
        </div>

        {/* Status */}
        <p className="mb-6 font-mono text-sm text-white/60">
          {modelsReady ? (
            <span className="text-cyan-400">Environment ready.</span>
          ) : (
            'Loading 3D environment...'
          )}
        </p>

        {/* Progress bar */}
        <div className="h-[2px] w-full max-w-md overflow-hidden rounded bg-white/10">
          {modelsReady ? (
            <div className="h-full w-full bg-cyan-400 transition-all duration-300" />
          ) : (
            <div className="h-full w-1/3 animate-slide-lr bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}
