import { ToolsPanel } from '@/components/features/scene/panels/ToolsPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '../ScrollReveal';

export function ToolsSection() {
  return (
    <section id="tools" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <SectionHeader title="Tools & Technologies" />
      </ScrollReveal>

      <ScrollReveal animation="blur-in" delay={0.1}>
        <div className="glass-card rounded-lg p-6">
          <ToolsPanel />
        </div>
      </ScrollReveal>
    </section>
  );
}
