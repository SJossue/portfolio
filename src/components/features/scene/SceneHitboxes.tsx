'use client';

import { useSceneState } from './useSceneState';
import { InteractiveHitbox } from './InteractiveHitbox';

export function SceneHitboxes() {
  const introState = useSceneState((s) => s.introState);

  if (introState !== 'garage') return null;

  return (
    <group>
      {/* Right monitor only */}
      <InteractiveHitbox section="contact" position={[0.8, 1.5, 6]} args={[0.8, 0.8, 0.5]} />
      <InteractiveHitbox section="projects" position={[5, 1.5, -1]} args={[2, 3, 2]} />
      <InteractiveHitbox section="tools" position={[0, 1.5, -4]} args={[3, 2, 2]} />
      <InteractiveHitbox
        section="about"
        position={[0.5, 0.5, -1]}
        args={[5, 2, 4]}
        rotation={[0, -Math.PI / 8, 0]}
      />
    </group>
  );
}
