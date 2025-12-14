"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { useParkingStore, CarInstance } from "@/app/store";
import anime from "animejs";

interface CarProps {
    data: CarInstance;
}

export default function Car({ data }: CarProps) {
  const groupRef = useRef<Group>(null);
  const hasRequestedEntry = useRef(false); // Prevent double call
  const hasRequestedExit = useRef(false); // Prevent double call

  const { 
    setEntryGate, setExitGate, addLog,
    requestEntry, requestExitProcess,
    updateCarStatus, removeCar,
    parkingSpots
  } = useParkingStore();

  useEffect(() => {
    if (!groupRef.current) return;
    
    // If spawned as PARKED or already PARKED, snap to spot
    if (data.status === 'PARKED' && data.parkingSpotIndex !== undefined) {
        const spot = parkingSpots[data.parkingSpotIndex];
        groupRef.current.position.set(spot[0], spot[1], spot[2]);
    } else {
        // Initial Position for ENTERING
        groupRef.current.position.set(data.position[0], data.position[1], data.position[2]);
    }
  }, []);

  // Handle Status Changes
  useEffect(() => {
    if (!groupRef.current) return;

    if (data.status === 'ENTERING') {
      if (hasRequestedEntry.current) return; // Skip if already requested
      hasRequestedEntry.current = true;

      addLog(`[${data.plateNumber}] Approaching entry...`);
      
      // 1. Move to Entry Gate (Z=15 -> Z=8)
      anime({
        targets: groupRef.current.position,
        z: 8, 
        duration: 1500,
        easing: 'easeOutQuad',
        complete: async () => {
          if (!groupRef.current) return; // Safe check

          // CALL API
          const success = await requestEntry(data.plateNumber);
          
          if (!groupRef.current) return; // Safe check after await

          if (success) {
             // 2. Pass Gate & Move to Spot
             // First move past the gate (Z=0) to avoid clipping pillar
             anime({
               targets: groupRef.current.position,
               z: -2, // Move past gate
               duration: 1500,
               delay: 500, 
               easing: 'linear',
               complete: () => {
                 if (!groupRef.current) return;
                 setEntryGate(false);
                 
                 // 3. Park into Spot
                 const spotIndex = data.parkingSpotIndex ?? 0;
                 const spot = parkingSpots[spotIndex];
                 
                 anime({
                     targets: groupRef.current.position,
                     x: spot[0],
                     z: spot[2],
                     duration: 2000,
                     easing: 'easeInOutQuad',
                     complete: () => {
                         if (!groupRef.current) return;
                         updateCarStatus(data.id, 'PARKED');
                         addLog(`[${data.plateNumber}] Parked at Spot #${spotIndex + 1}`);
                     }
                 });
               }
             });
          } else {
             addLog(`[${data.plateNumber}] Access Denied. Leaving...`);
             // Turn back or disappear
             removeCar(data.id);
          }
        }
      });
    } else if (data.status === 'EXITING') {
      if (hasRequestedExit.current) return;
      hasRequestedExit.current = true;

      addLog(`[${data.plateNumber}] Leaving spot...`);
      
      // 1. Move to Exit Gate Path (Spot -> Center Lane aligned with Exit Gate X=3)
      anime({
          targets: groupRef.current.position,
          z: 1, // Move to lane Z (Before Gate)
          x: 5, // Move to Exit Gate X
          duration: 2000,
          easing: 'easeInOutQuad',
          complete: () => {
              if (!groupRef.current) return;
              
              // 2. Stop at Exit Gate (Z=3, just before Z=4)
              anime({
                  targets: groupRef.current.position,
                  z: 1, 
                  duration: 1000,
                  easing: 'easeOutQuad',
                  complete: async () => {
                      if (!groupRef.current) return;
                      // API Call
                      const success = await requestExitProcess(data.plateNumber);
                      
                      if (!groupRef.current) return;

                      if (success) {
                          // 3. Pass Exit Gate and Leave
                          anime({
                              targets: groupRef.current.position,
                              z: 15, // Move out of view
                              duration: 1500,
                              delay: 2000, // Wait for gate to open
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

  }, [data.status]);

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
      <mesh position={[0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
       <mesh position={[0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}
