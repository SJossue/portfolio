'use client';

import { Interactable } from './Interactable';
import { useSceneState } from './useSceneState';

const INTERACTABLES = [
  {
    id: 'workbench',
    label: 'Workbench',
    section: 'projects',
    position: [-4, 0.75, -3] as [number, number, number],
    color: '#8B4513',
  },
  {
    id: 'monitor',
    label: 'Monitor',
    section: 'contact',
    position: [4, 2, -7] as [number, number, number],
    color: '#333333',
  },
  {
    id: 'toolboard',
    label: 'Tool Board',
    section: 'about',
    position: [-9, 2.5, -2] as [number, number, number],
    color: '#444444',
  },
] as const;

export function GarageInteractables() {
  const introState = useSceneState((s) => s.introState);

  if (introState !== 'garage') return null;

  return (
    <group>
      {INTERACTABLES.map((item) => (
        <Interactable
          key={item.id}
          id={item.id}
          label={item.label}
          section={item.section}
          position={[...item.position]}
          color={item.color}
        />
      ))}
    </group>
  );
}
