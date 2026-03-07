'use client';

import { useSceneState } from './useSceneState';
import { InteractiveHitbox } from './InteractiveHitbox';

export function SceneHitboxes() {
  const introState = useSceneState((s) => s.introState);

  if (introState !== 'garage') return null;

  return (
    <group>
      {/* Desk */}
      <InteractiveHitbox
        section="research"
        position={[3, 0.5, 2.5]}
        args={[2.2, 1.2, 1.2]}
        rotation={[0, -Math.PI / 2.2, 0]}
      />
      {/* Right cabinet */}
      <InteractiveHitbox section="projects" position={[5.5, 1.5, -2]} args={[1.5, 3, 1.5]} />
      {/* Car */}
      <InteractiveHitbox
        section="about"
        position={[0.5, 0.5, -1]}
        args={[4.8, 1.6, 2.2]}
        rotation={[0, -Math.PI / 8, 0]}
      />
      {/* Back tools/workbench */}
      <InteractiveHitbox section="tools" position={[3.5, 1.5, -8]} args={[3, 2, 2]} />
      {/* Tire on rack (left of car) */}
      <InteractiveHitbox section="experience" position={[-6, 1.5, 0]} args={[2, 3, 2]} />
    </group>
  );
}
