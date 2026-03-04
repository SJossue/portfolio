'use client';

import { ExperienceInteractable } from './ExperienceInteractable';
import { InfoPanelInteractable } from './InfoPanelInteractable';
import { Interactable } from './Interactable';
import { MonitorInteractable } from './MonitorInteractable';
import { useSceneState } from './useSceneState';
import { WorkstationInteractable } from './WorkstationInteractable';

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
  {
    id: 'filecabinet',
    label: 'File Cabinet',
    section: 'experience',
    position: [9, 0.7, -3] as [number, number, number],
    color: '#333333',
  },
] as const;

const CHILDREN_MAP: Record<string, (hovered: boolean) => React.ReactNode> = {
  workbench: (hovered) => <WorkstationInteractable hovered={hovered} />,
  monitor: (hovered) => <MonitorInteractable hovered={hovered} />,
  toolboard: (hovered) => <InfoPanelInteractable hovered={hovered} />,
  filecabinet: (hovered) => <ExperienceInteractable hovered={hovered} />,
};

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
        >
          {CHILDREN_MAP[item.id]}
        </Interactable>
      ))}
    </group>
  );
}
