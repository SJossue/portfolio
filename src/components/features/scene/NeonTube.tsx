interface NeonTubeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  color: string;
  intensity?: number;
  distance?: number;
}

export function NeonTube({
  position,
  rotation = [0, 0, 0],
  length,
  color,
  intensity = 2,
  distance = 6,
}: NeonTubeProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={intensity}
          color={color}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={color} intensity={0.8} distance={distance} decay={2} />
    </group>
  );
}
