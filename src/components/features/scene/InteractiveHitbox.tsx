'use client';

import type { ThreeEvent } from '@react-three/fiber';
import { useSceneState } from './useSceneState';

interface InteractiveHitboxProps {
  section: string;
  position: [number, number, number];
  args: [number, number, number];
  rotation?: [number, number, number];
}

export function InteractiveHitbox({ section, position, args, rotation }: InteractiveHitboxProps) {
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);
  const setHoveredSection = useSceneState((s) => s.setHoveredSection);
  const interactionLocked = useSceneState((s) => s.interactionLocked);
  const selectedSection = useSceneState((s) => s.selectedSection);

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    if (!interactionLocked && !selectedSection) {
      setSelectedSection(section);
    }
  }

  function handleDoubleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
  }

  function handlePointerOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    if (!interactionLocked && !selectedSection) {
      setHoveredSection(section);
      document.body.style.cursor = 'pointer';
    }
  }

  function handlePointerOut() {
    if (useSceneState.getState().hoveredSection === section) {
      setHoveredSection(null);
      document.body.style.cursor = 'default';
    }
  }

  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      data-testid={`hitbox-${section}`}
    >
      <boxGeometry args={args} />
      {/* Always invisible — glow is handled by useEmissiveGlow on the models */}
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
