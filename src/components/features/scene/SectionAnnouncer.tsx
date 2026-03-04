'use client';

import { useEffect, useRef } from 'react';
import { useSceneState } from './useSceneState';

export function SectionAnnouncer() {
  const selectedSection = useSceneState((s) => s.selectedSection);
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSection && announceRef.current) {
      announceRef.current.textContent = `${selectedSection} section opened`;
    } else if (announceRef.current) {
      announceRef.current.textContent = '';
    }
  }, [selectedSection]);

  return (
    <div
      ref={announceRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      data-testid="section-announcer"
    />
  );
}
