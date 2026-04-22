'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { worlds } from '@/content/worlds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useWorldLoader } from '@/lib/world-loader-store';
import Aurora from '@/components/ui/Aurora';
import Particles from '@/components/ui/Particles';
import BlurText from '@/components/ui/BlurText';
import CursorGlow from './CursorGlow';
import HubIntro from './HubIntro';
import HubNav from './HubNav';
import HubSocials from './HubSocials';
import IslandChat from './IslandChat';
import IslandViewport from './IslandViewport';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function HubCarousel() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const startWorldLoader = useWorldLoader((s) => s.start);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const enteringRef = useRef(false);
  const activeIndexRef = useRef(0);
  const isScrolling = useRef(false);

  // Keep ref in sync
  activeIndexRef.current = activeIndex;
  const activeWorld = worlds[activeIndex];

  const enterWorld = useCallback(
    (world: (typeof worlds)[number]) => {
      if (enteringRef.current) return;
      enteringRef.current = true;
      startWorldLoader(world.id);
      // Allow the loader to mount/paint a frame before route navigation
      // tears down this tree.
      requestAnimationFrame(() => {
        router.push(world.slug);
      });
    },
    [router, startWorldLoader],
  );

  // Load animation
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Horizontal scroll via GSAP ScrollTrigger (desktop only)
  useEffect(() => {
    if (isMobile || !trackRef.current || !containerRef.current) return;

    const track = trackRef.current;
    const totalWidth = track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (worlds.length - 1),
          duration: { min: 0.3, max: 0.6 },
          ease: 'power2.inOut',
          // Snap to nearest world only — no direction/velocity projection.
          // Prevents programmatic scroll (click/arrow/keyboard) from overshooting by 1 world.
          directional: false,
          inertia: false,
        },
        onUpdate: (self) => {
          const newIndex = Math.round(self.progress * (worlds.length - 1));
          if (newIndex !== activeIndexRef.current) {
            setActiveIndex(newIndex);
          }
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isMobile]);

  const navigateTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= worlds.length || isScrolling.current) return;
      if (index === activeIndexRef.current) return;

      if (isMobile) {
        isScrolling.current = true;
        const section = document.getElementById(`island-${worlds[index].id}`);
        section?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        setActiveIndex(index);
        // IntersectionObserver on mobile re-fires scroll completion — release after browser finishes.
        window.setTimeout(
          () => {
            isScrolling.current = false;
          },
          reducedMotion ? 0 : 500,
        );
      } else {
        isScrolling.current = true;
        const totalScroll = (trackRef.current?.scrollWidth ?? 0) - window.innerWidth;
        const targetScroll = (index / (worlds.length - 1)) * totalScroll;

        gsap.to(window, {
          scrollTo: { y: targetScroll, autoKill: false },
          duration: reducedMotion ? 0 : 0.8,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => {
            isScrolling.current = false;
          },
        });
      }
    },
    [isMobile, reducedMotion],
  );

  const navPrev = useCallback(() => navigateTo(activeIndexRef.current - 1), [navigateTo]);
  const navNext = useCallback(() => navigateTo(activeIndexRef.current + 1), [navigateTo]);

  // Keyboard navigation — use refs to avoid stale closures
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigateTo(Math.min(activeIndexRef.current + 1, worlds.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigateTo(Math.max(activeIndexRef.current - 1, 0));
      } else if (e.key === 'Enter') {
        enterWorld(worlds[activeIndexRef.current]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTo, enterWorld]);

  // Mobile: vertical layout with IntersectionObserver
  useEffect(() => {
    if (!isMobile) return;

    const observers: IntersectionObserver[] = [];
    worlds.forEach((world, i) => {
      const el = document.getElementById(`island-${world.id}`);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { threshold: 0.5 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isMobile]);

  return (
    <div
      className="relative bg-[#030318]"
      style={{ minHeight: isMobile ? 'auto' : `${worlds.length * 100}vh` }}
    >
      {/* Skip link — visually hidden until focused */}
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
      >
        Skip to content
      </a>

      {/* Aurora background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <Aurora colorStops={activeWorld.auroraColors} amplitude={0.8} blend={0.6} speed={0.4} />
      </div>

      {/* Particles */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ opacity: loaded ? 0.6 : 0, transition: 'opacity 1s ease 0.3s' }}
      >
        {!reducedMotion && (
          <Particles
            particleCount={80}
            particleSpread={8}
            speed={0.05}
            particleColors={activeWorld.particleColors}
            alphaParticles
            particleBaseSize={60}
            sizeRandomness={0.8}
            cameraDistance={25}
            moveParticlesOnHover
            particleHoverFactor={0.3}
          />
        )}
      </div>

      {/* Cursor glow */}
      <CursorGlow color={activeWorld.color} colorRgb={activeWorld.colorRgb} />

      {/* Top scrim — improves legibility of name + social buttons over the aurora */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-32"
        style={{
          background:
            'linear-gradient(to bottom, rgba(3,3,24,0.75) 0%, rgba(3,3,24,0.35) 50%, rgba(3,3,24,0) 100%)',
        }}
      />

      {/* Top name */}
      <div
        className="fixed left-1/2 top-5 z-20 -translate-x-1/2 text-center"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1.5s ease 0.5s' }}
      >
        <BlurText
          text="JOSSUE SARANGO"
          delay={80}
          animateBy="letters"
          className="text-[11px] font-semibold tracking-[4px] text-white/35"
          stepDuration={0.25}
        />
      </div>

      {/* Navigation */}
      <HubNav activeIndex={activeIndex} onNavigate={navigateTo} onPrev={navPrev} onNext={navNext} />

      {/* Social / contact buttons */}
      <HubSocials accentColor={activeWorld.color} accentRgb={activeWorld.colorRgb} />

      {/* Scroll container */}
      {isMobile ? (
        <div className="relative z-10 snap-y snap-mandatory">
          {worlds.map((world, i) => (
            <div key={world.id} id={`island-${world.id}`} className="snap-start">
              <IslandViewport
                world={world}
                index={i}
                total={worlds.length}
                isActive={activeIndex === i}
                onEnter={() => enterWorld(world)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div ref={containerRef} className="relative z-10">
          <div ref={trackRef} className="flex">
            {worlds.map((world, i) => (
              <IslandViewport
                key={world.id}
                world={world}
                index={i}
                total={worlds.length}
                isActive={activeIndex === i}
                onEnter={() => enterWorld(world)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Universal chat — one instance across all worlds, pinned to viewport bottom */}
      {loaded && (
        <div className="pointer-events-none fixed bottom-14 left-0 right-0 z-30 flex justify-center px-4">
          <IslandChat accentColor={activeWorld.color} accentRgb={activeWorld.colorRgb} />
        </div>
      )}

      {loaded && <HubIntro />}
    </div>
  );
}
