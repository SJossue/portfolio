'use client';

import { useEffect } from 'react';
import { SceneSkeleton } from './SceneSkeleton';
import { useSceneState } from './useSceneState';

export function HomeScene() {
  const { setIntroState } = useSceneState();

  // Skip intro for now — go straight to scene
  useEffect(() => {
    setIntroState('garage');
  }, [setIntroState]);

  return (
    <div className="relative h-screen w-full">
      <SceneSkeleton />
    </div>
  );
}
