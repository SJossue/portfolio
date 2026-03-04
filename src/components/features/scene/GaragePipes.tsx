import { DARK_METAL } from './garage-materials';

function Pipe({
  position,
  rotation = [0, 0, 0],
  radius = 0.08,
  length,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  length: number;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial {...DARK_METAL} />
    </mesh>
  );
}

export function GaragePipes() {
  return (
    <group>
      {/* Existing ceiling pipes (migrated from GarageEnvironment) */}
      <Pipe position={[-6, 5.5, -14.5]} rotation={[0, 0, Math.PI / 2]} length={28} />
      <Pipe position={[0, 5.8, -14.5]} rotation={[0, 0, Math.PI / 2]} radius={0.06} length={28} />

      {/* Vertical corner pipes floor-to-ceiling */}
      <Pipe position={[-14.5, 3, -14.5]} length={6} radius={0.1} />
      <Pipe position={[14.5, 3, -14.5]} length={6} radius={0.1} />

      {/* Cable bundles along left wall */}
      {[0, 0.08, -0.08].map((offset, i) => (
        <Pipe
          key={`cable-l-${i}`}
          position={[-14.6, 4.5, offset]}
          rotation={[0, 0, Math.PI / 2]}
          radius={0.025}
          length={20}
        />
      ))}
      <Pipe
        position={[-14.6, 4.35, 0.04]}
        rotation={[0, 0, Math.PI / 2]}
        radius={0.02}
        length={20}
      />

      {/* Conduit track along right wall ceiling */}
      <mesh position={[14.6, 5.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.15, 28, 0.12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}
