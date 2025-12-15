"use client";

import { useParkingStore } from "@/app/store";
import React from "react";

export default function Structure() {
    const { mapConfig } = useParkingStore();

    if (!mapConfig || mapConfig.map_id !== 'mall') return null;

    // Architecture for Mall B1/B2
    // We have floors at 0, -6, -12.
    // We need pillars connecting these.

    const pillars = [];
    // Grid of pillars - Mega Scale
    // X Range: -55 to 55
    // Z Range: -55 to 55
    for (let x = -55; x <= 55; x += 10) {
        for (let z = -55; z <= 55; z += 10) {
            // Avoid ramp area roughly
            if (Math.abs(x) < 4 && z > 5 && z < 25) continue;
            pillars.push([x, z]);
        }
    }

    return (
        <group>
            {/* Pillars - Segmented for Zoning */}
            {pillars.map((pos, i) => (
                <group key={i} position={[pos[0], 0, pos[1]]}>
                    {/* Upper Shaft */}
                    <mesh position={[0, -6, 0]}>
                        <cylinderGeometry args={[0.8, 0.8, 12]} />
                        <meshStandardMaterial color="#eeeeee" />
                    </mesh>
                    {/* B3 Zone Band (Pink) */}
                    <mesh position={[0, -12, 0]}>
                        <cylinderGeometry args={[0.85, 0.85, 2]} />
                        <meshStandardMaterial color="#ffc0cb" />
                    </mesh>
                    {/* B4 Zone Band (Mint) */}
                    <mesh position={[0, -18, 0]}>
                        <cylinderGeometry args={[0.85, 0.85, 2]} />
                        <meshStandardMaterial color="#a0eec0" />
                    </mesh>
                    {/* B5 Zone Band (Purple) */}
                    <mesh position={[0, -24, 0]}>
                        <cylinderGeometry args={[0.85, 0.85, 2]} />
                        <meshStandardMaterial color="#e0b0ff" />
                    </mesh>
                    {/* B6 Zone Band (Orange) */}
                    <mesh position={[0, -30, 0]}>
                        <cylinderGeometry args={[0.85, 0.85, 2]} />
                        <meshStandardMaterial color="#ffcc99" />
                    </mesh>
                    {/* Connecting Shafts */}
                    <mesh position={[0, -15, 0]}>
                        <cylinderGeometry args={[0.8, 0.8, 4]} />
                        <meshStandardMaterial color="#eeeeee" />
                    </mesh>
                    <mesh position={[0, -21, 0]}>
                        <cylinderGeometry args={[0.8, 0.8, 4]} />
                        <meshStandardMaterial color="#eeeeee" />
                    </mesh>
                    <mesh position={[0, -27, 0]}>
                        <cylinderGeometry args={[0.8, 0.8, 4]} />
                        <meshStandardMaterial color="#eeeeee" />
                    </mesh>
                </group>
            ))}

            {/* Ramp Shaft Area */}
            <mesh position={[0, -15, 15]}>
                <cylinderGeometry args={[4, 4, 32, 32, 1, true]} />
                <meshStandardMaterial color="#00ffff" transparent opacity={0.15} side={2} />
            </mesh>

            {/* Walls enclosing the deep space - Mega Vertical */}
            <group position={[0, -15, 0]}>
                {/* Back Wall (Z-) */}
                <mesh position={[0, 0, -60]}>
                    <boxGeometry args={[120, 32, 1]} />
                    <meshStandardMaterial color="#f5f5f5" />
                </mesh>
                {/* Front Wall (Z+) */}
                <mesh position={[0, 0, 60]}>
                    <boxGeometry args={[120, 32, 1]} />
                    <meshStandardMaterial color="#f5f5f5" />
                </mesh>
                {/* Left Wall (X-) */}
                <mesh position={[-60, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[120, 32, 1]} />
                    <meshStandardMaterial color="#f5f5f5" />
                </mesh>
                {/* Right Wall (X+) */}
                <mesh position={[60, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[120, 32, 1]} />
                    <meshStandardMaterial color="#f5f5f5" />
                </mesh>
            </group>
        </group>
    );
}

