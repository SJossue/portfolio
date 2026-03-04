import { ContactShadows, Sparkles } from '@react-three/drei';

function LightShaft({
  position,
  height = 4,
}: {
  position: [number, number, number];
  height?: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.3, height, 0.3]} />
      <meshStandardMaterial
        emissive="#00f0ff"
        emissiveIntensity={0.3}
        transparent
        opacity={0.04}
        toneMapped={false}
      />
    </mesh>
  );
}

export function GarageAtmosphere() {
  return (
    <group>
      {/* Cyan dust motes (migrated from GarageEnvironment) */}
      <Sparkles count={40} scale={[20, 5, 20]} color="#00f0ff" opacity={0.15} speed={0.2} />

      {/* White ambient particles (slower, larger area) */}
      <Sparkles count={30} scale={[25, 6, 25]} color="#ffffff" opacity={0.08} speed={0.1} />

      {/* Fake light shafts */}
      <LightShaft position={[-5, 3, -12]} height={5} />
      <LightShaft position={[3, 3, -13]} height={4} />
      <LightShaft position={[8, 2.5, -11]} height={3.5} />

      {/* Ground fog plane */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0a1520"
          transparent
          opacity={0.12}
          emissive="#00f0ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Contact shadows (migrated from GarageEnvironment) */}
      <ContactShadows
        position={[0, 0, 0]}
        resolution={256}
        blur={2}
        opacity={0.6}
        far={10}
        frames={1}
      />
    </group>
  );
}
