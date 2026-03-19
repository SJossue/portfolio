import { ContactPanel } from '@/components/features/scene/panels/ContactPanel';
import { ChatPanel } from '@/components/features/scene/panels/ChatPanel';
import { ResumeButton } from '@/components/features/scene/panels/ResumeButton';
import { ScrollReveal } from '../ScrollReveal';

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <h2 className="mb-8 text-2xl font-bold text-white">
          <span className="text-cyan-400">//</span> Contact
        </h2>
      </ScrollReveal>

      <div className="grid gap-8 md:grid-cols-2">
        <ScrollReveal animation="slide-left">
          <div className="rounded border border-white/10 bg-white/[0.03] p-6">
            <ContactPanel />
            <div className="mt-4">
              <ResumeButton />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="slide-right" delay={0.15}>
          <div className="rounded border border-white/10 bg-white/[0.03] p-6">
            <ChatPanel />
          </div>
        </ScrollReveal>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} Jossue Sarango. All rights reserved.
      </div>
    </section>
  );
}
