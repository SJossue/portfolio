import { MeshReflectorMaterial } from '@react-three/drei';

import { GarageAtmosphere } from './GarageAtmosphere';
import { GarageLightFixtures } from './GarageLightFixtures';
import { GaragePipes } from './GaragePipes';
import { GarageShelving } from './GarageShelving';
import { GarageStructure } from './GarageStructure';
import { NeonTube } from './NeonTube';

export function GarageEnvironment() {
  return (
    <group>
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={1.2}
          roughness={0.9}
          color="#050505"
          metalness={0.3}
          mirror={0.5}
        />
      </mesh>

      <GarageStructure />
      <GaragePipes />
      <GarageShelving />
      <GarageLightFixtures />
      <GarageAtmosphere />

      {/* Neon tubes — back wall */}
      <NeonTube
        position={[-5, 2.5, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={8}
        color="#00f0ff"
        distance={8}
      />
      <NeonTube
        position={[5, 2.5, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={8}
        color="#00f0ff"
        distance={8}
      />
      <NeonTube
        position={[0, 0.2, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={20}
        color="#ff00cc"
        intensity={1.5}
        distance={6}
      />

      {/* Neon tubes — left wall */}
      <NeonTube position={[-14.8, 2, -5]} length={3} color="#ff00cc" distance={5} />
      <NeonTube position={[-14.8, 2, 3]} length={3} color="#ff00cc" distance={5} />
      <NeonTube position={[-14.8, 2, -10]} length={3} color="#ff00cc" distance={5} />

      {/* Neon tube — right wall */}
      <NeonTube
        position={[14.8, 2.5, -3]}
        rotation={[0, 0, Math.PI / 2]}
        length={10}
        color="#00f0ff"
        distance={8}
      />
    </group>
  );
}
