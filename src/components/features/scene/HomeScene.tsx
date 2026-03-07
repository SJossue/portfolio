'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { OverlayPanel, SceneSkeleton, TopNav } from '.';
import { MobileScene } from './MobileScene';
import { TerminalBoot } from './TerminalBoot';
import { useSceneState } from './useSceneState';

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
}

export function HomeScene() {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setMobile(isMobileDevice());
  }, []);

  // Show nothing until we know (avoids hydration mismatch)
  if (mobile === null) {
    return <div className="h-dvh w-full bg-[#0a0908]" />;
  }

  if (mobile) {
    return <MobileScene />;
  }

  return <DesktopScene />;
}

function DesktopScene() {
  const {
    introState,
    setIntroState,
    selectedSection,
    setSelectedSection,
    bootComplete,
    modelsReady,
    setBootComplete,
    cameraArrived,
  } = useSceneState();

  const handleBootComplete = useCallback(() => {
    setBootComplete();
  }, [setBootComplete]);

  // Global Escape key: deselect during camera flight (before OverlayPanel mounts)
  useEffect(() => {
    if (!selectedSection) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedSection(null);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSection, setSelectedSection]);

  const transitioning = useRef(false);

  // Transition: both boot + models ready → pause → fade out → garage
  useEffect(() => {
    if (bootComplete && modelsReady && !transitioning.current) {
      transitioning.current = true;
      const delayTimer = setTimeout(() => {
        setIntroState('airingOut');
      }, 1500);
      const garageTimer = setTimeout(() => setIntroState('garage'), 2000);
      return () => {
        clearTimeout(delayTimer);
        clearTimeout(garageTimer);
      };
    }
  }, [bootComplete, modelsReady, setIntroState]);

  return (
    <div className="relative h-dvh w-full">
      <SceneSkeleton />
      <TopNav />

      {introState !== 'garage' && (
        <div
          className={`absolute inset-0 z-[100] bg-[#0a0908] transition-opacity duration-500 ${
            introState === 'airingOut' ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <TerminalBoot onComplete={handleBootComplete} />
          {bootComplete && !modelsReady && (
            <div className="absolute inset-x-0 bottom-1/4 text-center font-mono text-xs text-cyan-400/60">
              Initializing environment...
            </div>
          )}
        </div>
      )}

      {selectedSection && cameraArrived && (
        <OverlayPanel section={selectedSection} onClose={() => setSelectedSection(null)} />
      )}
    </div>
  );
}
