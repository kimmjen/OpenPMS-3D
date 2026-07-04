"use client";

import { useRef, useMemo, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { N8AOPostPass } from "n8ao";
import ParkingLot from "./ParkingLot";
import Gate from "./Gate";
import Car from "./Car";
import Structure from "./Structure";
import FloorStatusBoard from "./FloorStatusBoard";
import CameraControls from "./CameraControls";
import { useParkingStore } from "@/app/store";

// Custom N8AO wrapper for R3F
function N8AO({ aoRadius = 2, intensity = 2, quality = "high" }) {
  const { scene, camera, size } = useThree();
  const pass = useMemo(() => new N8AOPostPass(scene, camera, size.width, size.height), [scene, camera, size.width, size.height]);

  useEffect(() => {
    if (pass) {
      pass.configuration.aoRadius = aoRadius;
      pass.configuration.intensity = intensity;
      pass.setQualityMode(quality);
    }
  }, [pass, aoRadius, intensity, quality]);

  return <primitive object={pass} />;
}

function SceneContent() {
  const { mapConfig, entryGateOpen, exitGateOpen, cars } = useParkingStore();

  if (!mapConfig) return null;

  const { misc_config, gates } = mapConfig;
  const camera = misc_config.camera;

  const entryGate = gates.find(g => g.gate_type === 'entry');
  const exitGate = gates.find(g => g.gate_type === 'exit');

  return (
    <>
      <PerspectiveCamera makeDefault position={camera.position} fov={camera.fov} />
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.85}
        enableDamping={true}
        dampingFactor={0.1}
      />

      <ParkingLot />
      <Structure />
      {entryGate && <Gate position={[entryGate.x, entryGate.y, entryGate.z]} isOpen={entryGateOpen} label={entryGate.label} />}
      {exitGate && <Gate position={[exitGate.x, exitGate.y, exitGate.z]} isOpen={exitGateOpen} label={exitGate.label} />}

      <FloorStatusBoard />
      <CameraControls />

      {cars.map((car) => (
        <Car key={car.id} data={car} />
      ))}

      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.5}
        scale={200}
        blur={2}
        far={10}
        resolution={1024}
        color="#000000"
      />
    </>
  );
}

export default function Scene() {
  return (
    <div className="w-full h-full bg-[#f8fafc]">
      <Canvas
        shadows
        gl={{ antialias: true, stencil: true, depth: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#f8fafc"]} />
        <fog attach="fog" args={["#f8fafc", 80, 250]} />

        <Sky sunPosition={[100, 50, 100]} turbidity={0.0} rayleigh={0.5} />
        <Environment preset="apartment" blur={0.5} />

        <ambientLight intensity={0.8} />

        {/* High-Clarity Studio Lighting */}
        <directionalLight
          position={[50, 100, 50]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[4096, 4096]}
        />

        <pointLight position={[-30, 40, -30]} intensity={1} color="#ffffff" />
        <pointLight position={[30, 40, 30]} intensity={1} color="#ffffff" />

        <SceneContent />

        {/* @ts-expect-error disableNormalPass is valid at runtime */}
        <EffectComposer disableNormalPass>
          <N8AO
            aoRadius={2.5}
            intensity={1.5}
            quality="high"
          />
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.1}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
