'use client';

import { useEffect } from 'react';

import { useLightboxStore } from '@/lib/lightbox-store';

/** Full-screen image viewer, mounted once at the root layout and driven by
 *  `lightbox-store`. Any gallery on the site can open it via `LightboxTrigger`
 *  without needing to know about its siblings elsewhere on the page. */
export default function Lightbox() {
  const images = useLightboxStore((s) => s.images);
  const index = useLightboxStore((s) => s.index);
  const isOpen = useLightboxStore((s) => s.isOpen);
  const close = useLightboxStore((s) => s.close);
  const next = useLightboxStore((s) => s.next);
  const prev = useLightboxStore((s) => s.prev);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, close, next, prev]);

  if (!isOpen || images.length === 0) return null;
  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      onClick={close}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M4 4L16 16M16 4L4 16"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:left-4"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M12 4L6 10L12 16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:right-4"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M8 4L14 10L8 16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      ) : null}

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary-aspect
            full-size view; next/image needs known dimensions ahead of render,
            which the source galleries don't always have. */}
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
        />
      </div>

      {images.length > 1 ? (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-white/60">
          {index + 1} / {images.length}
        </p>
      ) : null}
    </div>
  );
}
