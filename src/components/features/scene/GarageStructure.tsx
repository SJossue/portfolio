import { WALL_CONCRETE, DARK_METAL, FLOOR_STAIN } from './garage-materials';

function FloorStain({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number];
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={scale} />
      <meshStandardMaterial {...FLOOR_STAIN} />
    </mesh>
  );
}

function WallPanel({
  position,
  rotation = [0, 0, 0],
  size,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial {...WALL_CONCRETE} />
      </mesh>
      {/* Horizontal panel lines */}
      {[1.5, 3, 4.5].map((y) => (
        <mesh key={y} position={[0, y - size[1] / 2, size[2] / 2 + 0.001]}>
          <boxGeometry args={[size[0], 0.02, 0.001]} />
          <meshStandardMaterial {...DARK_METAL} />
        </mesh>
      ))}
    </group>
  );
}

function IBeam({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Top flange */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[30, 0.04, 0.3]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {/* Web */}
      <mesh>
        <boxGeometry args={[30, 0.2, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {/* Bottom flange */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[30, 0.04, 0.3]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}

export function GarageStructure() {
  return (
    <group>
      {/* Floor slab */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[30, 0.3, 30]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Floor stain decals */}
      <FloorStain position={[-3, 0.005, 2]} scale={[4, 3]} />
      <FloorStain position={[2, 0.005, -4]} scale={[3, 2.5]} />
      <FloorStain position={[5, 0.005, 5]} scale={[2, 3]} />

      {/* Back wall */}
      <WallPanel position={[0, 3, -15]} size={[30, 6, 0.2]} />
      {/* Left wall */}
      <WallPanel position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]} size={[30, 6, 0.2]} />
      {/* Right wall */}
      <WallPanel position={[15, 3, 0]} rotation={[0, Math.PI / 2, 0]} size={[30, 6, 0.2]} />

      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#080808" roughness={0.95} />
      </mesh>

      {/* Structural I-beams across ceiling */}
      <IBeam position={[0, 5.7, -7]} />
      <IBeam position={[0, 5.7, -2]} />
      <IBeam position={[0, 5.7, 3]} />
      <IBeam position={[0, 5.7, 8]} />
    </group>
  );
}
