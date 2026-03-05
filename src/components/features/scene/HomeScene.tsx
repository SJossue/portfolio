'use client';

import { useEffect, useCallback, useRef } from 'react';
import { OverlayPanel } from './OverlayPanel';
import { SceneSkeleton } from './SceneSkeleton';
import { TerminalBoot } from './TerminalBoot';
import { useSceneState } from './useSceneState';

export function HomeScene() {
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

  const transitioning = useRef(false);

  // Transition: both boot + models ready → fade out → garage
  useEffect(() => {
    if (bootComplete && modelsReady && !transitioning.current) {
      transitioning.current = true;
      setIntroState('airingOut');
      const timer = setTimeout(() => setIntroState('garage'), 500);
      return () => clearTimeout(timer);
    }
  }, [bootComplete, modelsReady, setIntroState]);

  return (
    <div className="relative h-screen w-full">
      <SceneSkeleton />

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
