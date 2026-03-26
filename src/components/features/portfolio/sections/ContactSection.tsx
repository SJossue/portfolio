'use client';

import { ContactPanel } from '@/components/features/scene/panels/ContactPanel';
import { ChatPanel } from '@/components/features/scene/panels/ChatPanel';
import { ResumeButton } from '@/components/features/scene/panels/ResumeButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MagneticWrap } from '@/components/ui/MagneticWrap';
import { ScrollReveal } from '../ScrollReveal';

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <SectionHeader title="Contact" />
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        <ScrollReveal animation="slide-left">
          <div className="glass-card rounded-lg p-6">
            <ContactPanel />
            <div className="mt-4">
              <MagneticWrap>
                <ResumeButton />
              </MagneticWrap>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="slide-right" delay={0.15}>
          <div className="glass-card rounded-lg p-6">
            <ChatPanel />
          </div>
        </ScrollReveal>
      </div>

      {/* Footer */}
      <div className="section-divider mt-16" />
      <div className="pt-6 text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} Jossue Sarango. All rights reserved.
      </div>
    </section>
  );
}
