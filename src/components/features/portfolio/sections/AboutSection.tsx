import Image from 'next/image';
import { aboutData } from '@/content';
import { ResumeButton } from '@/components/features/scene/panels/ResumeButton';
import { ScrollReveal } from '../ScrollReveal';

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-4 py-24">
      <ScrollReveal>
        <h2 className="mb-8 text-2xl font-bold text-white">
          <span className="text-cyan-400">//</span> About
        </h2>
      </ScrollReveal>

      <div className="grid gap-12 md:grid-cols-[1fr_auto]">
        {/* Bio + highlights + skills */}
        <div className="space-y-8">
          <ScrollReveal>
            <p className="text-sm leading-relaxed text-white/80">{aboutData.bio}</p>
          </ScrollReveal>

          {/* Highlights */}
          <ScrollReveal animation="fade-in" delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {aboutData.highlights.map((h) => (
                <div
                  key={h.label}
                  className="corner-brackets rounded border border-white/10 bg-white/5 p-3"
                >
                  <span className="text-xs text-cyan-400">{h.label}</span>
                  <p className="mt-1 text-sm text-white">{h.value}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Skills */}
          <ScrollReveal animation="fade-up" delay={0.2} stagger={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              {aboutData.skills.map((group) => (
                <div
                  key={group.category}
                  className="rounded border border-white/10 bg-white/[0.03] p-4"
                >
                  <h3 className="mb-2 text-xs font-semibold text-fuchsia-400">{group.category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-white/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" delay={0.3}>
            <ResumeButton />
          </ScrollReveal>
        </div>

        {/* Image gallery */}
        <ScrollReveal animation="slide-right" className="hidden md:block">
          <div className="flex w-48 flex-col gap-3">
            {aboutData.images.slice(0, 3).map((src, i) => (
              <div key={i} className="corner-brackets overflow-hidden rounded">
                <Image
                  src={src}
                  alt={`${aboutData.name} ${i + 1}`}
                  width={192}
                  height={240}
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
