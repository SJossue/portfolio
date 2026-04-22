import { create } from 'zustand';

export type LoaderPhase = 'idle' | 'entering' | 'ready';

interface WorldLoaderState {
  worldId: string | null;
  phase: LoaderPhase;
  startedAt: number | null;
  start: (worldId: string) => void;
  markReady: () => void;
  dismiss: () => void;
}

export const useWorldLoader = create<WorldLoaderState>((set) => ({
  worldId: null,
  phase: 'idle',
  startedAt: null,
  start: (worldId) => set({ worldId, phase: 'entering', startedAt: Date.now() }),
  markReady: () =>
    set((state) => (state.phase === 'entering' ? { ...state, phase: 'ready' } : state)),
  dismiss: () => set({ worldId: null, phase: 'idle', startedAt: null }),
}));
