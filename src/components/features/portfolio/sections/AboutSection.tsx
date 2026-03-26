'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { aboutData } from '@/content';
import { ResumeButton } from '@/components/features/scene/panels/ResumeButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '../ScrollReveal';
import { useTiltEffect } from '@/hooks/useTiltEffect';

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useTiltEffect<HTMLDivElement>();
  return (
    <div ref={ref} className={`glass-card rounded-lg p-5 ${className}`}>
      {children}
    </div>
  );
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isNumeric = /^\d+$/.test(value);

  useEffect(() => {
    if (!isNumeric || !ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (ref.current) ref.current.textContent = value;
      return;
    }

    const target = parseInt(value);
    let tween: gsap.core.Tween | undefined;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      const obj = { val: 0 };
      tween = gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.round(obj.val).toString();
        },
      });
    });

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [value, isNumeric]);

  if (!isNumeric) return <span>{value}</span>;
  return <span ref={ref}>0</span>;
}

function CyclingImage({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-full min-h-[200px] w-full sm:min-h-[240px]">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${name} photo ${i + 1}`}
          width={400}
          height={500}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === idx ? 'bg-cyan-400' : 'bg-white/30'
            }`}
            aria-label={`View photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function AboutSection() {
  const isNumeric = (v: string) => /^\d+$/.test(v);

  return (
    <section id="about" className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <ScrollReveal>
        <SectionHeader title="About" />
      </ScrollReveal>

      {/* Bento grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Bio — spans 2 cols */}
        <ScrollReveal animation="blur-in" className="md:col-span-2">
          <TiltCard className="h-full">
            <p className="text-sm leading-relaxed text-white/80">{aboutData.bio}</p>
          </TiltCard>
        </ScrollReveal>

        {/* Image carousel */}
        <ScrollReveal animation="scale-up" delay={0.1}>
          <TiltCard className="h-full overflow-hidden !p-0">
            <CyclingImage images={aboutData.images} name={aboutData.name} />
          </TiltCard>
        </ScrollReveal>

        {/* Highlights stacked */}
        <ScrollReveal animation="fade-up" delay={0.15} stagger={0.08}>
          {aboutData.highlights.map((h) => (
            <TiltCard key={h.label} className="mb-4 last:mb-0">
              <span className="font-mono text-xs text-cyan-400">{h.label}</span>
              <p
                className={`mt-1 font-bold text-white ${isNumeric(h.value) ? 'text-3xl' : 'text-lg'}`}
              >
                <AnimatedValue value={h.value} />
              </p>
            </TiltCard>
          ))}
        </ScrollReveal>

        {/* Skills — span full width */}
        <ScrollReveal animation="fade-up" delay={0.2} stagger={0.06} className="md:col-span-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutData.skills.map((group) => (
              <TiltCard key={group.category}>
                <h3 className="mb-3 font-mono text-xs font-semibold text-fuchsia-400">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>

        {/* Resume */}
        <ScrollReveal animation="fade-in" delay={0.3} className="md:col-span-4">
          <ResumeButton />
        </ScrollReveal>
      </div>
    </section>
  );
}
