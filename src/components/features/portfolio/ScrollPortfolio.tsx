'use client';

import { ScrollNav } from './ScrollNav';
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
}

export function ScrollPortfolio({ onEnter3D }: ScrollPortfolioProps) {
  return (
    <div className="bg-[#0a0a0a] text-white">
      <ScrollNav onEnter3D={onEnter3D} />
      <HeroSection onEnter3D={onEnter3D} />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ResearchSection />
      <ToolsSection />
      <ContactSection />
    </div>
  );
}
