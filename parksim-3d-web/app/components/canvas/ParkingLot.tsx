"use client";

import { useParkingStore } from "@/app/store";
import { Text } from "@react-three/drei";

export default function ParkingLot() {
  const parkingSpots = useParkingStore((state) => state.parkingSpots);

  return (
    <group>
      {/* Ground - Asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>

      {/* Parking Spots Dynamic Rendering */}
      {parkingSpots.map((spot, i) => (
          <group key={i} position={[spot[0], 0.01, spot[2]]}>
              {/* Left Line */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.2, 0, 0]}>
                  <planeGeometry args={[0.1, 4.5]} />
                  <meshBasicMaterial color="white" />
              </mesh>
              {/* Right Line */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0, 0]}>
                  <planeGeometry args={[0.1, 4.5]} />
                  <meshBasicMaterial color="white" />
              </mesh>
              {/* Back Line */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2.25]}>
                  <planeGeometry args={[2.5, 0.1]} />
                  <meshBasicMaterial color="white" />
              </mesh>
              {/* Number */}
              <Text position={[0, 0.1, 1.5]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.8} color="yellow">
                  {i + 1}
              </Text>
          </group>
      ))}
      
      {/* Entry Marking */}
      <Text position={[-5, 0.1, 6]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="white">
        ENTRY
      </Text>
      
       {/* Exit Marking */}
       <Text position={[5, 0.1, 6]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="white">
        EXIT
      </Text>
    </group>
  );
}
