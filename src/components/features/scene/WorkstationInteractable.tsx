interface WorkstationInteractableProps {
  hovered: boolean;
}

export function WorkstationInteractable({ hovered }: WorkstationInteractableProps) {
  return (
    <group>
      {/* Dark metal desk */}
      <mesh position={[0, -0.375, 0]}>
        <boxGeometry args={[2.5, 0.75, 1.2]} />
        <meshStandardMaterial color="#0d0d14" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Holographic screen */}
      <mesh position={[0, 0.4, -0.3]}>
        <boxGeometry args={[1.6, 0.9, 0.02]} />
        <meshStandardMaterial
          emissive="#00f0ff"
          emissiveIntensity={hovered ? 5 : 3}
          color="#001a1f"
          toneMapped={false}
        />
      </mesh>

      {/* Keyboard strip */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[1.2, 0.03, 0.3]} />
        <meshStandardMaterial
          emissive="#ff6600"
          emissiveIntensity={1}
          color="#0d0d14"
          toneMapped={false}
        />
      </mesh>

      {/* Embedded orange light */}
      <pointLight position={[0, 0.5, 0]} color="#ff6600" intensity={0.6} distance={4} decay={2} />
    </group>
  );
}
