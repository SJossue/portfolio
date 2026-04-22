import type { HyperspeedEffectOptions } from '@/components/ui/Hyperspeed';

export interface WorldHyperspeedPreset {
  worldId: string;
  label: string;
  accentHex: string;
  accentRgb: string;
  options: HyperspeedEffectOptions;
}

const SHARED_BASE: HyperspeedEffectOptions = {
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 22,
  lightPairsPerRoadWay: 42,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
};

const WORLD_PRESETS: WorldHyperspeedPreset[] = [
  {
    worldId: 'garage',
    label: 'My Garage',
    accentHex: '#f97316',
    accentRgb: '249, 115, 22',
    options: {
      ...SHARED_BASE,
      distortion: 'turbulentDistortion',
      colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0xfff7ed,
        brokenLines: 0xfff7ed,
        leftCars: [0xf97316, 0xfb923c, 0xea580c],
        rightCars: [0xfdba74, 0xfcd34d, 0xfb7185],
        sticks: 0xf97316,
      },
    },
  },
  {
    worldId: 'timeline',
    label: 'My Timeline',
    accentHex: '#8b5cf6',
    accentRgb: '139, 92, 246',
    options: {
      ...SHARED_BASE,
      distortion: 'LongRaceDistortion',
      colors: {
        roadColor: 0x07071a,
        islandColor: 0x0a0a1f,
        background: 0x000000,
        shoulderLines: 0xede9fe,
        brokenLines: 0xede9fe,
        leftCars: [0x8b5cf6, 0xa78bfa, 0x7c3aed],
        rightCars: [0xc4b5fd, 0xa855f7, 0xddd6fe],
        sticks: 0x8b5cf6,
      },
    },
  },
  {
    worldId: 'student',
    label: 'The Student',
    accentHex: '#06b6d4',
    accentRgb: '6, 182, 212',
    options: {
      ...SHARED_BASE,
      distortion: 'deepDistortion',
      colors: {
        roadColor: 0x041218,
        islandColor: 0x06181f,
        background: 0x000000,
        shoulderLines: 0xecfeff,
        brokenLines: 0xecfeff,
        leftCars: [0x06b6d4, 0x22d3ee, 0x0891b2],
        rightCars: [0x67e8f9, 0xa5f3fc, 0x0e7490],
        sticks: 0x06b6d4,
      },
    },
  },
  {
    worldId: 'real-me',
    label: 'About Me',
    accentHex: '#10b981',
    accentRgb: '16, 185, 129',
    options: {
      ...SHARED_BASE,
      distortion: 'mountainDistortion',
      colors: {
        roadColor: 0x041815,
        islandColor: 0x06231d,
        background: 0x000000,
        shoulderLines: 0xecfdf5,
        brokenLines: 0xecfdf5,
        leftCars: [0x10b981, 0x34d399, 0x059669],
        rightCars: [0x6ee7b7, 0xa7f3d0, 0x047857],
        sticks: 0x10b981,
      },
    },
  },
];

const DEFAULT_PRESET: WorldHyperspeedPreset = {
  worldId: 'default',
  label: 'Loading',
  accentHex: '#22d3ee',
  accentRgb: '34, 211, 238',
  options: {
    ...SHARED_BASE,
    distortion: 'turbulentDistortion',
    colors: {
      roadColor: 0x050510,
      islandColor: 0x0a0a18,
      background: 0x000000,
      shoulderLines: 0xffffff,
      brokenLines: 0xffffff,
      leftCars: [0x22d3ee, 0x06b6d4, 0x67e8f9],
      rightCars: [0xa78bfa, 0xc4b5fd, 0x8b5cf6],
      sticks: 0x22d3ee,
    },
  },
};

export function getHyperspeedPreset(worldId: string | null | undefined): WorldHyperspeedPreset {
  if (!worldId) return DEFAULT_PRESET;
  return WORLD_PRESETS.find((p) => p.worldId === worldId) ?? DEFAULT_PRESET;
}
