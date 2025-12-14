"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Environment } from "@react-three/drei";
import ParkingLot from "./ParkingLot";
import Gate from "./Gate";
import Car from "./Car";
import { useParkingStore } from "@/app/store";

export default function Scene() {
  const { entryGateOpen, exitGateOpen, cars } = useParkingStore();

  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        <ParkingLot />
        
        {/* Entry Gate (Left Front) */}
        <Gate position={[-8, 0, 4]} isOpen={entryGateOpen} label="ENTRY" />
        
        {/* Exit Gate (Right Front) */}
        <Gate position={[3, 0, 4]} isOpen={exitGateOpen} label="EXIT" />
        
        {/* Cars */}
        {cars.map((car) => (
            <Car key={car.id} data={car} />
        ))}

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
