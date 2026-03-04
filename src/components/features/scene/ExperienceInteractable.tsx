interface ExperienceInteractableProps {
  hovered: boolean;
}

export function ExperienceInteractable({ hovered }: ExperienceInteractableProps) {
  const intensity = hovered ? 4 : 2;

  return (
    <group>
      {/* Filing cabinet body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 1.4, 0.6]} />
        <meshStandardMaterial color="#0c0c14" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* Drawer fronts */}
      {[-0.35, 0, 0.35].map((y) => (
        <mesh key={y} position={[0, y, 0.31]}>
          <boxGeometry args={[0.7, 0.35, 0.02]} />
          <meshStandardMaterial color="#111118" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Drawer handles */}
      {[-0.35, 0, 0.35].map((y) => (
        <mesh key={y} position={[0, y, 0.33]}>
          <boxGeometry args={[0.2, 0.03, 0.02]} />
          <meshStandardMaterial
            emissive="#00f0ff"
            emissiveIntensity={intensity}
            color="#001a1f"
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Top label strip */}
      <mesh position={[0, 0.65, 0.31]}>
        <boxGeometry args={[0.6, 0.06, 0.01]} />
        <meshStandardMaterial
          emissive="#ff00cc"
          emissiveIntensity={intensity}
          color="#1a0015"
          toneMapped={false}
        />
      </mesh>

      {/* Side accent line */}
      <mesh position={[0.41, 0, 0]}>
        <boxGeometry args={[0.01, 1.2, 0.02]} />
        <meshStandardMaterial
          emissive="#00f0ff"
          emissiveIntensity={intensity * 0.5}
          color="#001a1f"
          toneMapped={false}
        />
      </mesh>

      <pointLight position={[0, 0, 0.5]} color="#00f0ff" intensity={0.4} distance={3} decay={2} />
    </group>
  );
}
