"use client";

import { useRef, useEffect } from "react";
import { Group } from "three";
import { useParkingStore, CarInstance } from "@/app/store";
import anime from "animejs";

interface CarProps {
  data: CarInstance;
}

export default function Car({ data }: CarProps) {
  const groupRef = useRef<Group>(null);
  const hasRequestedEntry = useRef(false);
  const hasRequestedExit = useRef(false);

  const {
    setEntryGate, setExitGate, addLog,
    requestEntry, requestExitProcess,
    updateCarStatus, removeCar,
    parkingSpots,
    mapConfig
  } = useParkingStore();

  useEffect(() => {
    if (!groupRef.current) return;

    // Initial Position
    if (data.status === 'PARKED' && data.parkingSpotIndex !== undefined) {
      const spot = parkingSpots[data.parkingSpotIndex];
      if (spot) groupRef.current.position.set(spot[0], spot[1], spot[2]);
    } else {
      groupRef.current.position.set(data.position[0], data.position[1], data.position[2]);
    }
  }, []);

  // Handle Status Changes
  useEffect(() => {
    if (!groupRef.current || !mapConfig) return;

    const paths = mapConfig.misc_config.paths;

    if (data.status === 'ENTERING') {
      if (hasRequestedEntry.current) return;
      hasRequestedEntry.current = true;

      addLog(`[${data.plateNumber}] Approaching entry...`);

      // 1. Move to Entry Gate (Approaching)
      // paths.entry_gate is [x, y, z]
      // We want to stop slightly before the gate? Or exactly at?
      // Let's assume paths.entry_gate is where the gate bar is.
      // We stop a bit before.

      const gatePos = paths.entry_gate;

      anime({
        targets: groupRef.current.position,
        x: gatePos[0],
        z: gatePos[2] + 4, // Stop 4 units before gate (assuming entry is from +Z)
        duration: 1500,
        easing: 'easeOutQuad',
        complete: async () => {
          if (!groupRef.current) return;

          const success = await requestEntry(data.plateNumber);

          if (!groupRef.current) return;

          if (success) {
            // 2. Pass Gate & Move to Spot (Complex Logic)
            anime({
              targets: groupRef.current.position,
              x: gatePos[0],
              z: gatePos[2] - 4, // Move past gate
              duration: 1000,
              delay: 500,
              easing: 'linear',
              complete: () => {
                if (!groupRef.current) return;
                setEntryGate(false);

                // 3. Park into Spot (Path Logic)
                const spotIndex = data.parkingSpotIndex ?? 0;
                const spot = parkingSpots[spotIndex];

                if (spot) {
                  // Check if we need complex path (Mall / Multi-level)
                  const isMall = mapConfig.map_id === 'mall';
                  const targetY = spot[1];
                  let waypoints: { x: number, y: number, z: number }[] = [];

                  if (isMall && targetY < 0) {
                    // Ramp Logic: Go to center shaft to descend
                    // 1. Move to Ramp Entrance (e.g., Z=10, X=0) on Ground (y=0)
                    waypoints.push({ x: 0, y: 0, z: 10 });
                    // 2. Spiral/Drop to Target Level (x=0, y=Target, z=10)
                    waypoints.push({ x: 0, y: targetY, z: 10 });
                    // 3. Move to Spot Level (x=Spot.x, y=Target, z=Spot.z)
                    waypoints.push({ x: spot[0], y: spot[1], z: spot[2] });
                  } else {
                    // Direct
                    waypoints.push({ x: spot[0], y: spot[1], z: spot[2] });
                  }

                  // Recursive Move Function
                  const moveStep = (index: number) => {
                    if (index >= waypoints.length) {
                      updateCarStatus(data.id, 'PARKED');
                      addLog(`[${data.plateNumber}] Parked at Spot #${spotIndex + 1}`);
                      return;
                    }
                    const pt = waypoints[index];
                    anime({
                      targets: groupRef.current!.position,
                      x: pt.x,
                      y: pt.y,
                      z: pt.z,
                      duration: 1500,
                      easing: 'easeInOutQuad',
                      complete: () => moveStep(index + 1)
                    });
                  };

                  moveStep(0);
                }
              }
            });
          } else {
            addLog(`[${data.plateNumber}] Access Denied. Leaving...`);
            removeCar(data.id);
          }
        }
      });
    } else if (data.status === 'EXITING') {
      if (hasRequestedExit.current) return;
      hasRequestedExit.current = true;

      addLog(`[${data.plateNumber}] Leaving spot...`);

      const gatePos = paths.exit_gate;
      const exitEnd = paths.exit_end;

      // 1. Move to Exit Lane (Align with Exit Gate X)
      // First move Z to "Lane" (e.g. Z=0 or middle) if needed, then X.
      // For simplicity, move direct to front of exit gate.

      anime({
        targets: groupRef.current.position,
        x: gatePos[0], // Align X with exit gate
        z: gatePos[2] - 4, // Stop before gate (from inside)
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: () => {
          if (!groupRef.current) return;

          // 2. Wait at Gate (Payment Check)
          anime({
            targets: groupRef.current.position,
            // Small wiggle or wait
            z: gatePos[2] - 3,
            duration: 1000,
            easing: 'easeOutQuad',
            complete: async () => {
              if (!groupRef.current) return;

              const success = await requestExitProcess(data.plateNumber);

              if (!groupRef.current) return;

              if (success) {
                // 3. Pass Exit Gate and Leave
                anime({
                  targets: groupRef.current.position,
                  x: exitEnd[0],
                  z: exitEnd[2], // Move to end of map
                  duration: 2000, // Slower exit
                  delay: 2000, // Wait for gate
                  easing: 'linear',
                  complete: () => {
                    if (!groupRef.current) return;
                    setExitGate(false);
                    removeCar(data.id);
                    addLog(`[${data.plateNumber}] Session Ended.`);
                  }
                });
              } else {
                addLog(`[${data.plateNumber}] Exit Denied. Stuck at gate.`);
              }
            }
          })
        }
      });
    }

  }, [data.status, mapConfig]);

  return (
    <group ref={groupRef}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 0.8, 4]} />
        <meshStandardMaterial color={data.status === 'PARKED' ? "#10b981" : "#3b82f6"} roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.2, -0.5]}>
        <boxGeometry args={[1.6, 0.6, 2.5]} />
        <meshStandardMaterial color={data.status === 'PARKED' ? "#6ee7b7" : "#93c5fd"} />
      </mesh>
      {/* Wheels */}
      <mesh position={[0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}
