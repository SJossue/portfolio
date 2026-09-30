import { create } from 'zustand';

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxState {
  images: LightboxImage[];
  index: number;
  isOpen: boolean;
  open: (images: LightboxImage[], index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

/** Which image gallery is currently enlarged, if any. Lives in a store rather
 *  than component state so server-rendered gallery grids can trigger it via a
 *  small client wrapper, without threading callback props across the
 *  server/client boundary (same pattern as `garage-selection-store`). */
export const useLightboxStore = create<LightboxState>((set) => ({
  images: [],
  index: 0,
  isOpen: false,
  open: (images, index) => set({ images, index, isOpen: true }),
  close: () => set({ isOpen: false }),
  next: () => set((s) => ({ index: (s.index + 1) % s.images.length })),
  prev: () => set((s) => ({ index: (s.index - 1 + s.images.length) % s.images.length })),
}));
