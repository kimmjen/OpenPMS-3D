"use client";

import { useParkingStore } from "@/app/store";
import { Text } from "@react-three/drei";
import ParkingSpot from "./ParkingSpot";

export default function ParkingLot() {
  const { parkingSpots, mapConfig } = useParkingStore();

  if (!mapConfig) return null;

  const entryGate = mapConfig.gates.find(g => g.gate_type === 'entry');
  const exitGate = mapConfig.gates.find(g => g.gate_type === 'exit');

  // Fallbacks if not found
  const entryPos = entryGate ? [entryGate.x, entryGate.y, entryGate.z] : [0, 0, 0];
  const exitPos = exitGate ? [exitGate.x, exitGate.y, exitGate.z] : [0, 0, 0];
  const entryLabel = entryGate?.label || "ENTRY";
  const exitLabel = exitGate?.label || "EXIT";

  return (
    <group>
      {/* Dynamic Floors based on Spots Y levels */}
      {Array.from(new Set(parkingSpots.map(s => s[1]))).concat(0).filter((v, i, a) => a.indexOf(v) === i).map((yLevel) => (
        <mesh key={yLevel} rotation={[-Math.PI / 2, 0, 0]} position={[0, yLevel - 0.01, 0]} receiveShadow>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial
            color={yLevel === 0 ? "#333333" : (mapConfig.map_id === 'mall' ? "#e0e0e0" : "#555555")}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Floor Labels */}
      {Array.from(new Set(parkingSpots.map(s => s[1]))).concat(0).filter((v, i, a) => a.indexOf(v) === i).map((yLevel) => {
        let label = "1F";
        if (yLevel < 0) label = `B${Math.abs(yLevel / 6)}`;

        // Special logic for The Hyundai (mall)
        if (mapConfig.map_id === 'mall') {
          if (yLevel === -12) label = "B3";
          if (yLevel === -18) label = "B4";
          if (yLevel === -24) label = "B5";
          if (yLevel === -30) label = "B6";
        } else {
          if (yLevel === -6) label = "B1";
          if (yLevel === -12) label = "B2";
        }

        return (
          <Text
            key={`label-${yLevel}`}
            position={[-55, yLevel + 2, 0]}
            fontSize={6}
            color="black"
            rotation={[0, Math.PI / 2, 0]}
          >
            {label}
          </Text>
        );
      })}

      {/* Parking Spots Dynamic Rendering */}
      {parkingSpots.map((spot, i) => (
        <ParkingSpot key={i} position={spot as [number, number, number]} index={i} />
      ))}

      {/* Entry Marking (Dynamic) */}
      <Text
        position={[entryPos[0], 0.1, entryPos[2] + 4]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1}
        color="white"
      >
        {entryLabel}
      </Text>

      {/* Exit Marking (Dynamic) */}
      <Text
        position={[exitPos[0], 0.1, exitPos[2] + 4]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1}
        color="white"
      >
        {exitLabel}
      </Text>
      {/* Parking Lines (Decoration) */}
      {mapConfig.map_id === 'mall' && Array.from(new Set(parkingSpots.map(s => s[1]))).map((yLevel) => (
        <group key={`lines-${yLevel}`} position={[0, yLevel + 0.02, 0]}>
          {/* Draw lines for islands */}
          {[-45, -35, -25, -15, 15, 25, 35, 45].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.1, 96]} />
                <meshBasicMaterial color="white" opacity={0.5} transparent />
              </mesh>
              <mesh position={[-3, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.1, 96]} />
                <meshBasicMaterial color="white" opacity={0.5} transparent />
              </mesh>
              <mesh position={[3, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.1, 96]} />
                <meshBasicMaterial color="white" opacity={0.5} transparent />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Directional Arrows for The Hyundai (Mall) */}
      {mapConfig.map_id === 'mall' && (
        <group>
          {/* Entry Arrow */}
          <Text position={[-2, 0.1, 60]} rotation={[-Math.PI / 2, 0, 0]} fontSize={2} color="#00ff00">
            ➜ IN
          </Text>
          {/* Exit Arrow */}
          <Text position={[12, 0.1, 60]} rotation={[-Math.PI / 2, 0, Math.PI]} fontSize={2} color="#ff0000">
            OUT ➜
          </Text>
          {/* B3 Zone Label */}
          <Text position={[0, -12 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={4} color="#ffc0cb" fillOpacity={0.3}>
            B3 PINK ZONE
          </Text>
          {/* B4 Zone Label */}
          <Text position={[0, -18 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={4} color="#a0eec0" fillOpacity={0.3}>
            B4 MINT ZONE
          </Text>
          {/* B5 Zone Label */}
          <Text position={[0, -24 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={4} color="#e0b0ff" fillOpacity={0.3}>
            B5 PURPLE ZONE
          </Text>
          {/* B6 Zone Label */}
          <Text position={[0, -30 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={4} color="#ffcc99" fillOpacity={0.3}>
            B6 ORANGE ZONE
          </Text>
        </group>
      )}
    </group>
  );
}

