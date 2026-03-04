import { NEON_ORANGE, NEON_CYAN } from './garage-materials';

function HazardStripe({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  width = 2,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: Math.floor(width / 0.15) }, (_, i) => (
        <mesh key={i} position={[i * 0.15 - width / 2 + 0.075, 0, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.002]} />
          <meshStandardMaterial
            {...(i % 2 === 0 ? NEON_ORANGE : { color: '#111111', metalness: 0.5, roughness: 0.6 })}
          />
        </mesh>
      ))}
    </group>
  );
}

function WarningSign({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sign backing */}
      <mesh>
        <boxGeometry args={[0.4, 0.3, 0.01]} />
        <meshStandardMaterial color="#1a1a00" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Border */}
      <mesh position={[0, 0, 0.006]}>
        <boxGeometry args={[0.36, 0.26, 0.002]} />
        <meshStandardMaterial {...NEON_ORANGE} />
      </mesh>
      {/* Exclamation mark — vertical bar */}
      <mesh position={[0, 0.03, 0.008]}>
        <boxGeometry args={[0.03, 0.1, 0.002]} />
        <meshStandardMaterial color="#1a1a00" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Exclamation mark — dot */}
      <mesh position={[0, -0.06, 0.008]}>
        <boxGeometry args={[0.03, 0.03, 0.002]} />
        <meshStandardMaterial color="#1a1a00" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

function DataPlaque({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Plaque backing */}
      <mesh>
        <boxGeometry args={[0.5, 0.2, 0.008]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Glowing data lines */}
      {[0.05, 0, -0.05].map((y, i) => (
        <mesh key={i} position={[0, y, 0.005]}>
          <boxGeometry args={[0.4 - i * 0.08, 0.015, 0.002]} />
          <meshStandardMaterial {...NEON_CYAN} />
        </mesh>
      ))}
    </group>
  );
}

export function GarageDecals() {
  return (
    <group>
      {/* Hazard stripe on floor near entrance */}
      <HazardStripe position={[0, 0.005, 12]} rotation={[-Math.PI / 2, 0, 0]} width={6} />

      {/* Warning sign on back wall */}
      <WarningSign position={[-10, 2.5, -14.85]} />

      {/* Warning sign on left wall */}
      <WarningSign position={[-14.85, 2, -12]} />

      {/* Data plaque on right wall */}
      <DataPlaque position={[14.85, 1.5, -5]} />

      {/* Floor hazard stripe near shelving */}
      <HazardStripe
        position={[-13, 0.005, -8]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        width={2}
      />
    </group>
  );
}
