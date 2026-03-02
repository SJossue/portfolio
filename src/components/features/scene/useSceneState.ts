import { create } from 'zustand';

type IntroState = 'idle' | 'airingOut' | 'revealing' | 'garage';

interface SceneState {
  introState: IntroState;
  interactionLocked: boolean;
  setIntroState: (state: IntroState) => void;
}

export const useSceneState = create<SceneState>((set) => ({
  introState: 'idle',
  interactionLocked: true,
  setIntroState: (introState) =>
    set({
      introState,
      interactionLocked: introState !== 'garage',
    }),
}));
