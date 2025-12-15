"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import anime from "animejs";

interface GateProps {
  position: [number, number, number];
  isOpen: boolean;
  label?: string;
}

export default function Gate({ position, isOpen, label }: GateProps) {
  const barRef = useRef<Group>(null);

  useEffect(() => {
    if (barRef.current) {
      anime({
        targets: barRef.current.rotation,
        z: isOpen ? Math.PI / 2 : 0, // 90 degrees when open
        duration: 1000,
        easing: "easeOutElastic(1, .8)",
      });
    }
  }, [isOpen]);

  return (
    <group position={position}>
      {/* Base - Offset to side */}
      <mesh position={[-2.5, 0.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Pivot & Bar */}
      <group ref={barRef} position={[-2.5, 0.8, 0]}>
        {/* Bar (Offset center to rotate from end) */}
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[3.5, 0.1, 0.1]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
      </group>
    </group>
  );
}
