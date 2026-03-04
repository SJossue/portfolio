import { CeilingFan } from './CeilingFan';
import { CyberpunkPoster } from './CyberpunkPoster';
import { FireExtinguisher } from './FireExtinguisher';
import { FlickeringLight } from './FlickeringLight';
import { FloorDrain } from './FloorDrain';
import { GarageAtmosphere } from './GarageAtmosphere';
import { GarageDecals } from './GarageDecals';
import { GarageLightFixtures } from './GarageLightFixtures';
import { GaragePipes } from './GaragePipes';
import { GarageShelving } from './GarageShelving';
import { GarageStructure } from './GarageStructure';
import { HologramDisplay } from './HologramDisplay';
import { HydraulicLift } from './HydraulicLift';
import { NeonNameSign } from './NeonNameSign';
import { NeonOpenSign } from './NeonOpenSign';
import { NeonTube } from './NeonTube';
import { OilDrums } from './OilDrums';
import { RollingToolCart } from './RollingToolCart';
import { SecurityCamera } from './SecurityCamera';
import { SwingingChain } from './SwingingChain';
import { TireRack } from './TireRack';
import { ToolBoardDetails } from './ToolBoardDetails';
import { VendingMachine } from './VendingMachine';
import { WeldingSparks } from './WeldingSparks';
import { WorkbenchVise } from './WorkbenchVise';

export function GarageEnvironment() {
  return (
    <group>
      {/* Dark garage floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#050505" roughness={0.85} metalness={0.4} />
      </mesh>

      <GarageStructure />
      <GaragePipes />
      <GarageShelving />
      <GarageLightFixtures />
      <GarageAtmosphere />
      <GarageDecals />
      <ToolBoardDetails />
      <OilDrums />
      <TireRack />
      <FloorDrain />
      <FireExtinguisher />
      <WorkbenchVise />
      <HologramDisplay />
      <CeilingFan />
      <FlickeringLight />
      <SwingingChain />
      <WeldingSparks />
      <HydraulicLift />
      <VendingMachine />
      <SecurityCamera />
      <RollingToolCart />
      <NeonNameSign />
      <NeonOpenSign />
      <CyberpunkPoster position={[-7, 3, -14.75]} accentColor="#00f0ff" headerColor="#ff6600" />
      <CyberpunkPoster position={[7, 3, -14.75]} accentColor="#ff00cc" headerColor="#00f0ff" />

      {/* Neon tubes — back wall */}
      <NeonTube
        position={[-5, 2.5, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={8}
        color="#00f0ff"
      />
      <NeonTube
        position={[5, 2.5, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={8}
        color="#00f0ff"
      />
      <NeonTube
        position={[0, 0.2, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={20}
        color="#ff00cc"
        intensity={1.5}
      />

      {/* Neon tubes — left wall */}
      <NeonTube position={[-14.8, 2, -5]} length={3} color="#ff00cc" />
      <NeonTube position={[-14.8, 2, 3]} length={3} color="#ff00cc" />
      <NeonTube position={[-14.8, 2, -10]} length={3} color="#ff00cc" />

      {/* Neon tube — right wall */}
      <NeonTube
        position={[14.8, 2.5, -3]}
        rotation={[0, 0, Math.PI / 2]}
        length={10}
        color="#00f0ff"
      />

      {/* Left wall near car bay — cyan vertical tubes */}
      <NeonTube position={[-14.8, 2, 8]} length={3} color="#00f0ff" />
      <NeonTube position={[-14.8, 2, 12]} length={3} color="#00f0ff" />

      {/* Right wall — magenta vertical tubes */}
      <NeonTube position={[14.8, 2, 2]} length={3} color="#ff00cc" />
      <NeonTube position={[14.8, 2, 8]} length={3} color="#ff00cc" />

      {/* Floor accent strip along back wall */}
      <NeonTube
        position={[0, 0.05, -14.5]}
        rotation={[0, 0, Math.PI / 2]}
        length={20}
        color="#ff00cc"
        intensity={1}
      />
    </group>
  );
}
