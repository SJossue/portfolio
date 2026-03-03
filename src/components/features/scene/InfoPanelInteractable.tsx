interface InfoPanelInteractableProps {
  hovered: boolean;
}

export function InfoPanelInteractable({ hovered }: InfoPanelInteractableProps) {
  const intensity = hovered ? 4 : 2;

  return (
    <group>
      {/* Dark backing panel */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 2, 0.06]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Magenta header strip */}
      <mesh position={[0, 0.7, 0.04]}>
        <boxGeometry args={[1.5, 0.15, 0.01]} />
        <meshStandardMaterial
          emissive="#ff00cc"
          emissiveIntensity={intensity}
          color="#1a0015"
          toneMapped={false}
        />
      </mesh>

      {/* Cyan data rows */}
      <mesh position={[0, 0.3, 0.04]}>
        <boxGeometry args={[1.4, 0.08, 0.01]} />
        <meshStandardMaterial
          emissive="#00f0ff"
          emissiveIntensity={intensity}
          color="#001a1f"
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.1, 0.05, 0.04]}>
        <boxGeometry args={[1.2, 0.08, 0.01]} />
        <meshStandardMaterial
          emissive="#00f0ff"
          emissiveIntensity={intensity}
          color="#001a1f"
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.1, -0.2, 0.04]}>
        <boxGeometry args={[1.0, 0.08, 0.01]} />
        <meshStandardMaterial
          emissive="#00f0ff"
          emissiveIntensity={intensity}
          color="#001a1f"
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.15, -0.45, 0.04]}>
        <boxGeometry args={[0.8, 0.08, 0.01]} />
        <meshStandardMaterial
          emissive="#00f0ff"
          emissiveIntensity={intensity}
          color="#001a1f"
          toneMapped={false}
        />
      </mesh>

      {/* Corner brackets — top-left */}
      <mesh position={[-0.85, 0.95, 0.04]}>
        <boxGeometry args={[0.15, 0.02, 0.01]} />
        <meshStandardMaterial emissive="#ff00cc" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[-0.92, 0.88, 0.04]}>
        <boxGeometry args={[0.02, 0.15, 0.01]} />
        <meshStandardMaterial emissive="#ff00cc" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Corner brackets — bottom-right */}
      <mesh position={[0.85, -0.95, 0.04]}>
        <boxGeometry args={[0.15, 0.02, 0.01]} />
        <meshStandardMaterial emissive="#ff00cc" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[0.92, -0.88, 0.04]}>
        <boxGeometry args={[0.02, 0.15, 0.01]} />
        <meshStandardMaterial emissive="#ff00cc" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Embedded magenta light */}
      <pointLight position={[0, 0, 0.5]} color="#ff00cc" intensity={0.6} distance={4} decay={2} />
    </group>
  );
}
