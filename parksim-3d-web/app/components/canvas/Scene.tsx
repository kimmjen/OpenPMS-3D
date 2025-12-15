"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Environment, PerspectiveCamera } from "@react-three/drei";
import ParkingLot from "./ParkingLot";
import Gate from "./Gate";
import Car from "./Car";
import Structure from "./Structure";
import FloorStatusBoard from "./FloorStatusBoard";
import CameraControls from "./CameraControls";
import { useParkingStore } from "@/app/store";

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
      <OrbitControls makeDefault />

      <ParkingLot />
      <Structure />
      <FloorStatusBoard />
      <CameraControls />

      {entryGate && <Gate position={[entryGate.x, entryGate.y, entryGate.z]} isOpen={entryGateOpen} label={entryGate.label} />}
      {exitGate && <Gate position={[exitGate.x, exitGate.y, exitGate.z]} isOpen={exitGateOpen} label={exitGate.label} />}

      {cars.map((car) => (
        <Car key={car.id} data={car} />
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows>
        <Sky sunPosition={[100, 20, 100]} />
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />

        <SceneContent />
      </Canvas>
    </div>
  );
}
