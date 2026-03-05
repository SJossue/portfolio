import { create } from 'zustand';

type IntroState = 'idle' | 'airingOut' | 'revealing' | 'garage';

interface SceneState {
  introState: IntroState;
  interactionLocked: boolean;
  selectedSection: string | null;
  hoveredSection: string | null;
  bootComplete: boolean;
  modelsReady: boolean;
  cameraArrived: boolean;
  setIntroState: (state: IntroState) => void;
  setSelectedSection: (section: string | null) => void;
  setHoveredSection: (section: string | null) => void;
  setBootComplete: () => void;
  setModelsReady: () => void;
  setCameraArrived: (v: boolean) => void;
}

export const useSceneState = create<SceneState>((set, get) => ({
  introState: 'idle',
  interactionLocked: true,
  selectedSection: null,
  hoveredSection: null,
  bootComplete: false,
  modelsReady: false,
  cameraArrived: false,
  setIntroState: (introState) =>
    set({
      introState,
      interactionLocked: introState !== 'garage',
    }),
  setSelectedSection: (section) => {
    if (get().interactionLocked && section !== null) return;
    set({ selectedSection: section, ...(section !== null ? { cameraArrived: false } : {}) });
  },
  setHoveredSection: (section) => {
    if (get().interactionLocked && section !== null) return;
    set({ hoveredSection: section });
  },
  setBootComplete: () => set({ bootComplete: true }),
  setModelsReady: () => set({ modelsReady: true }),
  setCameraArrived: (v) => set({ cameraArrived: v }),
}));
