import { create } from 'zustand';

type IntroState = 'idle' | 'animating' | 'skipped' | 'done';

interface SceneState {
  introState: IntroState;
  setIntroState: (state: IntroState) => void;
}

export const useSceneState = create<SceneState>((set) => ({
  introState: 'idle',
  setIntroState: (introState) => set({ introState }),
}));
