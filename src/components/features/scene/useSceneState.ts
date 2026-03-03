import { create } from 'zustand';

type IntroState = 'idle' | 'airingOut' | 'revealing' | 'garage';

interface SceneState {
  introState: IntroState;
  interactionLocked: boolean;
  selectedSection: string | null;
  setIntroState: (state: IntroState) => void;
  setSelectedSection: (section: string | null) => void;
}

export const useSceneState = create<SceneState>((set, get) => ({
  introState: 'idle',
  interactionLocked: true,
  selectedSection: null,
  setIntroState: (introState) =>
    set({
      introState,
      interactionLocked: introState !== 'garage',
    }),
  setSelectedSection: (section) => {
    if (get().interactionLocked) return;
    set({ selectedSection: section });
  },
}));
