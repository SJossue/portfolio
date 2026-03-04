import { DARK_METAL, RUST_METAL } from './garage-materials';

function Wrench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, 0.3]}>
      {/* Handle */}
      <mesh>
        <boxGeometry args={[0.02, 0.25, 0.01]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.06, 0.04, 0.01]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}

function Screwdriver({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, -0.15]}>
      {/* Handle */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.02, 0.015, 0.12, 8]} />
        <meshStandardMaterial color="#cc3300" roughness={0.6} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.14, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}

function Pliers({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, 0.1]}>
      {/* Left handle */}
      <mesh position={[-0.012, -0.06, 0]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[0.015, 0.16, 0.008]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>
      {/* Right handle */}
      <mesh position={[0.012, -0.06, 0]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[0.015, 0.16, 0.008]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>
      {/* Jaw */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.008]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}

export function ToolBoardDetails() {
  return (
    <group position={[6.8, 1.8, -14.6]}>
      <Wrench position={[-0.15, 0.1, 0]} />
      <Screwdriver position={[0, 0.1, 0]} />
      <Pliers position={[0.15, 0.05, 0]} />
      <Wrench position={[-0.1, -0.1, 0]} />
      <Screwdriver position={[0.1, -0.1, 0]} />
    </group>
  );
}
