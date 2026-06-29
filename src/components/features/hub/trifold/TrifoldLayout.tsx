'use client';

import { createElement, type ElementType, type HTMLAttributes, type ReactNode } from 'react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { useIsMobile } from '@/hooks/useIsMobile';

import HubBackground from './HubBackground';

/** One column of the trifold. `glass: false` renders a transparent framed div
 *  (used by the loader's clear center) instead of the frosted glass panel. */
export interface TrifoldSlot {
  children: ReactNode;
  as?: ElementType;
  accent?: boolean;
  glass?: boolean;
  className?: string;
  panelProps?: HTMLAttributes<HTMLElement>;
}

interface TrifoldLayoutProps {
  /** Drives the themed background + accent crossfade. */
  worldId: string;
  /** Accent as "r, g, b" — sets `--world-color-rgb`. */
  colorRgb: string;
  left: TrifoldSlot;
  center: TrifoldSlot;
  right: TrifoldSlot;
  /** Full-bleed layer behind the panels. Defaults to the themed HubBackground. */
  background?: ReactNode;
  /** Root container classes. Defaults to a page; the loader overrides to a fixed overlay. */
  rootClassName?: string;
  rootStyle?: React.CSSProperties;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  /** Rendered first inside the root (e.g. a skip link). */
  lead?: ReactNode;
}

const BASE_SIDE = 'overflow-visible lg:h-full lg:overflow-y-auto';
const BASE_CENTER = 'focus-visible:outline-none lg:h-full lg:overflow-hidden';

function Panel({
  slot,
  base,
  style,
}: {
  slot: TrifoldSlot;
  base: string;
  style?: React.CSSProperties;
}) {
  const className = `${base} ${slot.className ?? ''}`.trim();

  if (slot.glass === false) {
    return createElement(
      slot.as ?? 'div',
      { className: `glass-panel--frame ${className}`, style, ...slot.panelProps },
      slot.children,
    );
  }

  return (
    <GlassPanel
      as={slot.as}
      accent={slot.accent ?? true}
      className={className}
      style={style}
      {...slot.panelProps}
    >
      {slot.children}
    </GlassPanel>
  );
}

/**
 * The shared trifold chrome — one geometry for the whole site: a themed
 * background plus three glass panels (left + right angled inward) on a
 * `20rem · 1.5fr · 22rem` grid. The hub, every island, and the world loader all
 * render through this, so their panels line up pixel-for-pixel and the loader
 * hands off seamlessly into its destination.
 */
export default function TrifoldLayout({
  worldId,
  colorRgb,
  left,
  center,
  right,
  background,
  rootClassName = 'relative min-h-dvh bg-[#07070b]',
  rootStyle,
  rootProps,
  lead,
}: TrifoldLayoutProps) {
  const isMobile = useIsMobile();
  const angle = (deg: number, origin: string) =>
    isMobile
      ? undefined
      : { transform: `perspective(1600px) rotateY(${deg}deg)`, transformOrigin: origin };

  return (
    <div
      className={rootClassName}
      style={{ '--world-color-rgb': colorRgb, ...rootStyle } as React.CSSProperties}
      {...rootProps}
    >
      {lead}
      {background ?? <HubBackground colorRgb={colorRgb} worldId={worldId} />}

      <div className="relative z-10 flex flex-col gap-4 p-4 lg:grid lg:h-dvh lg:grid-cols-[minmax(0,20rem)_1.5fr_minmax(0,22rem)] lg:gap-5 lg:p-6">
        <Panel slot={left} base={BASE_SIDE} style={angle(13, 'right center')} />
        <Panel slot={center} base={BASE_CENTER} />
        <Panel slot={right} base={BASE_SIDE} style={angle(-13, 'left center')} />
      </div>
    </div>
  );
}
