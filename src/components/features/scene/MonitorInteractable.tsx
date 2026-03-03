interface MonitorInteractableProps {
  hovered: boolean;
}

export function MonitorInteractable({ hovered }: MonitorInteractableProps) {
  return (
    <group>
      {/* Dark bezel */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1.2, 0.08]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Emissive blue screen */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.5, 0.9, 0.01]} />
        <meshStandardMaterial
          emissive="#0066ff"
          emissiveIntensity={hovered ? 6 : 3}
          color="#000a1a"
          toneMapped={false}
        />
      </mesh>

      {/* Pole stand */}
      <mesh position={[0, -0.9, -0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -1.3, -0.1]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Embedded blue light */}
      <pointLight position={[0, 0, 0.5]} color="#0066ff" intensity={0.6} distance={4} decay={2} />
    </group>
  );
}
