"use client";

import { useParkingStore } from "@/app/store";
import { Text } from "@react-three/drei";
import React from "react";

function StandardStructure() {
    return (
        <group>
            {/* Gate booth */}
            <mesh position={[-5, 0.75, 12]} castShadow>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.5} />
            </mesh>
            <mesh position={[-5, 1.65, 12]}>
                <boxGeometry args={[1.8, 0.15, 1.8]} />
                <meshStandardMaterial color="#78716c" roughness={0.7} />
            </mesh>

            {/* Overhead sign at entry */}
            <group position={[-8, 3.5, 14]}>
                {/* Sign poles */}
                <mesh position={[-2.5, -1.5, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
                    <meshStandardMaterial color="#6b7280" metalness={0.6} />
                </mesh>
                <mesh position={[2.5, -1.5, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
                    <meshStandardMaterial color="#6b7280" metalness={0.6} />
                </mesh>
                {/* Sign board */}
                <mesh>
                    <boxGeometry args={[5, 1, 0.1]} />
                    <meshStandardMaterial color="#1e40af" roughness={0.3} />
                </mesh>
                <Text position={[0, 0, 0.06]} fontSize={0.5} color="#ffffff">
                    PARKING
                </Text>
            </group>

            {/* Light poles */}
            {[[-12, 0, -5], [6, 0, -5], [-12, 0, 15], [6, 0, 15]].map((pos, i) => (
                <group key={i} position={pos as [number, number, number]}>
                    <mesh position={[0, 2, 0]}>
                        <cylinderGeometry args={[0.06, 0.08, 4, 8]} />
                        <meshStandardMaterial color="#6b7280" metalness={0.5} />
                    </mesh>
                    <mesh position={[0, 4, 0]}>
                        <sphereGeometry args={[0.2, 12, 12]} />
                        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={0.5} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

function GangnamStructure() {
    // Covered parking with roof beams and pillars
    const pillarPositions: [number, number][] = [
        [-14, -14], [-14, 0], [-14, 12], [-14, 24],
        [14, -14], [14, 0], [14, 12], [14, 24],
        [0, -14], [0, 24],
    ];

    return (
        <group>
            {/* Pillars */}
            {pillarPositions.map((pos, i) => (
                <group key={i} position={[pos[0], 0, pos[1]]}>
                    <mesh position={[0, 2.5, 0]} castShadow>
                        <cylinderGeometry args={[0.25, 0.3, 5, 12]} />
                        <meshStandardMaterial color="#d1d5db" roughness={0.7} metalness={0.1} />
                    </mesh>
                </group>
            ))}

            {/* Roof beams */}
            {[-14, 0, 14].map((x, i) => (
                <mesh key={i} position={[x, 5, 5]} castShadow>
                    <boxGeometry args={[0.3, 0.4, 40]} />
                    <meshStandardMaterial color="#9ca3af" roughness={0.6} />
                </mesh>
            ))}

            {/* Cross beams */}
            {[-14, 0, 12, 24].map((z, i) => (
                <mesh key={i} position={[0, 5, z]} castShadow>
                    <boxGeometry args={[28, 0.3, 0.3]} />
                    <meshStandardMaterial color="#9ca3af" roughness={0.6} />
                </mesh>
            ))}

            {/* Partial roof panels (translucent) */}
            {[-7, 7].map((x, i) => (
                <mesh key={i} position={[x, 5.2, 5]}>
                    <boxGeometry args={[14, 0.05, 40]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.15}
                        roughness={0}
                        transmission={0.8}
                        side={2}
                    />
                </mesh>
            ))}

            {/* Gate booth */}
            <mesh position={[-3, 0.75, 14]} castShadow>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.5} />
            </mesh>
            <mesh position={[-3, 1.65, 14]}>
                <boxGeometry args={[1.8, 0.15, 1.8]} />
                <meshStandardMaterial color="#78716c" roughness={0.7} />
            </mesh>

            {/* Overhead sign */}
            <group position={[-6, 4.2, 22]}>
                <mesh>
                    <boxGeometry args={[6, 1.2, 0.1]} />
                    <meshStandardMaterial color="#1e40af" roughness={0.3} />
                </mesh>
                <Text position={[0, 0, 0.06]} fontSize={0.6} color="#ffffff">
                    GANGNAM PARKING
                </Text>
            </group>

            {/* Ceiling lights */}
            {[-7, 7].map((x) =>
                [-10, 0, 10, 20].map((z, j) => (
                    <mesh key={`${x}-${j}`} position={[x, 4.9, z]}>
                        <boxGeometry args={[1.5, 0.05, 0.3]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
                    </mesh>
                ))
            )}
        </group>
    );
}

function MallStructure() {
    const pillars: [number, number][] = [];
    for (let x = -55; x <= 55; x += 10) {
        for (let z = -55; z <= 55; z += 10) {
            if (Math.abs(x) < 4 && z > 5 && z < 25) continue;
            pillars.push([x, z]);
        }
    }

    return (
        <group>
            {/* Crystal Aesthetic Pillars */}
            {pillars.map((pos, i) => (
                <group key={i} position={[pos[0], 0, pos[1]]}>
                    <mesh position={[0, -15, 0]} castShadow receiveShadow>
                        <cylinderGeometry args={[0.5, 0.5, 30, 24]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            roughness={0}
                            metalness={0.1}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>

                    {/* Floating Glow Indicator */}
                    <mesh position={[0, -12, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.7, 0.05, 12, 32]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                </group>
            ))}

            {/* Central Ramp Volume - Crystal Glass */}
            <mesh position={[0, -15, 15]}>
                <cylinderGeometry args={[4, 4, 30, 32, 1, true]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.9}
                    thickness={0.5}
                    roughness={0}
                    transparent
                    opacity={0.2}
                    side={2}
                />
            </mesh>
        </group>
    );
}

export default function Structure() {
    const { mapConfig } = useParkingStore();

    if (!mapConfig) return null;

    if (mapConfig.map_id === 'standard') return <StandardStructure />;
    if (mapConfig.map_id === 'gangnam') return <GangnamStructure />;
    if (mapConfig.map_id === 'mall') return <MallStructure />;

    return null;
}
