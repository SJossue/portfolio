'use client';

import { useEffect } from 'react';
import { useSceneState } from './useSceneState';

const SHORTCUT_MAP: Record<string, string> = {
  '1': 'projects',
  '2': 'experience',
  '3': 'contact',
  '4': 'about',
};

export function KeyboardShortcuts() {
  const introState = useSceneState((s) => s.introState);
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  useEffect(() => {
    if (introState !== 'garage') return;
    if (selectedSection !== null) return;

    function handleKeyDown(e: KeyboardEvent) {
      const section = SHORTCUT_MAP[e.key];
      if (section) {
        setSelectedSection(section);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introState, selectedSection, setSelectedSection]);

  return null;
}
