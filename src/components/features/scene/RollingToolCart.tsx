import { DARK_METAL, NEON_CYAN } from './garage-materials';
import { useSceneState } from './useSceneState';

function CasterWheel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.04, 8]} />
      <meshStandardMaterial color="#222222" metalness={0.5} roughness={0.7} />
    </mesh>
  );
}

export function RollingToolCart() {
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  return (
    <group
      position={[-5, 0, -1]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSection('toolCart');
      }}
    >
      {/* Cart body */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.9, 0.8, 0.5]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* 3 drawer accent lines */}
      {[0.7, 0.55, 0.4].map((y, i) => (
        <mesh key={i} position={[0.451, y, 0]}>
          <boxGeometry args={[0.01, 0.015, 0.44]} />
          <meshStandardMaterial
            emissive="#00f0ff"
            emissiveIntensity={2}
            color="#00f0ff"
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Drawer handles */}
      {[0.7, 0.55, 0.4].map((y, i) => (
        <mesh key={`h-${i}`} position={[0.46, y, 0]}>
          <boxGeometry args={[0.02, 0.03, 0.12]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Top surface */}
      <mesh position={[0, 0.97, 0]}>
        <boxGeometry args={[0.95, 0.04, 0.55]} />
        <meshStandardMaterial color="#0d0d14" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Wrench on top */}
      <mesh position={[-0.15, 1.01, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.015, 0.04]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rag on top */}
      <mesh position={[0.2, 1.0, 0.1]}>
        <boxGeometry args={[0.15, 0.02, 0.1]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Caster wheels */}
      <CasterWheel position={[-0.35, 0.06, 0.2]} />
      <CasterWheel position={[0.35, 0.06, 0.2]} />
      <CasterWheel position={[-0.35, 0.06, -0.2]} />
      <CasterWheel position={[0.35, 0.06, -0.2]} />
    </group>
  );
}
