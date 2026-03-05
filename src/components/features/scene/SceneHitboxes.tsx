'use client';

import { useSceneState } from './useSceneState';
import { InteractiveHitbox } from './InteractiveHitbox';

export function SceneHitboxes() {
  const introState = useSceneState((s) => s.introState);

  if (introState !== 'garage') return null;

  return (
    <group>
      {/* Desk */}
      <InteractiveHitbox section="contact" position={[2, 0.8, 5]} args={[1.5, 1.2, 1.2]} />
      {/* Right cabinet */}
      <InteractiveHitbox section="projects" position={[5, 1.5, -1]} args={[2, 3, 2]} />
      {/* Car */}
      <InteractiveHitbox
        section="about"
        position={[0.5, 0.5, -1]}
        args={[5, 2, 4]}
        rotation={[0, -Math.PI / 8, 0]}
      />
      {/* Back tools/workbench */}
      <InteractiveHitbox section="tools" position={[0, 1.5, -4]} args={[3, 2, 2]} />
      {/* Tire on rack (left of car) */}
      <InteractiveHitbox section="experience" position={[-3, 1.2, -1]} args={[1.5, 1.5, 1.5]} />
    </group>
  );
}
