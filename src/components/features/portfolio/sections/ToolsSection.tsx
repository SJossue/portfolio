import { ToolsPanel } from '@/components/features/scene/panels/ToolsPanel';
import { ScrollReveal } from '../ScrollReveal';

export function ToolsSection() {
  return (
    <section id="tools" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <h2 className="mb-8 text-2xl font-bold text-white">
          <span className="text-cyan-400">//</span> Tools & Technologies
        </h2>
      </ScrollReveal>

      <ScrollReveal animation="fade-in" delay={0.1}>
        <div className="rounded border border-white/10 bg-white/[0.03] p-6">
          <ToolsPanel />
        </div>
      </ScrollReveal>
    </section>
  );
}
