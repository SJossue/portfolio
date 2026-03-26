'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { ScrollNav } from './ScrollNav';
import { ScrollProgress } from './ScrollProgress';
import {
  HeroSection,
  AboutSection,
  ExperienceSection,
  ProjectsSection,
  ResearchSection,
  ToolsSection,
  ContactSection,
} from './sections';

interface ScrollPortfolioProps {
  onEnter3D: () => void;
  introComplete?: boolean;
}

export function ScrollPortfolio({ onEnter3D, introComplete = true }: ScrollPortfolioProps) {
  useSmoothScroll();

  return (
    <div className="noise-bg bg-[#0a0a0a] text-white">
      {introComplete && <ScrollNav onEnter3D={onEnter3D} />}
      {introComplete && <ScrollProgress />}
      <div className="vignette pointer-events-none fixed inset-0 z-40" aria-hidden="true" />
      <HeroSection introComplete={introComplete} />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ResearchSection />
      <ToolsSection />
      <ContactSection />
    </div>
  );
}
