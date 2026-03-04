import { DARK_METAL, RUST_METAL, NEON_ORANGE } from './garage-materials';

function ShelfUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Vertical posts */}
      <mesh position={[-0.6, 1.2, 0]}>
        <boxGeometry args={[0.06, 2.4, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0.6, 1.2, 0]}>
        <boxGeometry args={[0.06, 2.4, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Shelf planes */}
      {[0.4, 1.2, 2.0].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.3, 0.04, 0.4]} />
          <meshStandardMaterial {...RUST_METAL} />
        </mesh>
      ))}

      {/* Prop boxes on shelves */}
      <mesh position={[-0.3, 0.52, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.15]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>
      <mesh position={[0.2, 0.52, 0.05]}>
        <boxGeometry args={[0.25, 0.18, 0.2]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0.1, 1.32, -0.05]}>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}

export function GarageShelving() {
  return (
    <group>
      {/* Left wall shelf */}
      <ShelfUnit position={[-13, 0, -8]} />

      {/* Right wall shelf */}
      <group position={[13, 0, -10]}>
        <ShelfUnit position={[0, 0, 0]} />
        {/* Powered device with orange emissive */}
        <mesh position={[-0.2, 2.12, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.2]} />
          <meshStandardMaterial {...NEON_ORANGE} />
        </mesh>
      </group>
    </group>
  );
}
