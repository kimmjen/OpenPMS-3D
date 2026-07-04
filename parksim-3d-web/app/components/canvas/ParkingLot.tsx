"use client";

import { useParkingStore } from "@/app/store";
import { Text, RoundedBox } from "@react-three/drei";
import ParkingSpot from "./ParkingSpot";
import { useMemo } from "react";

function RoadMarkings({ mapId }: { mapId: string }) {
    if (mapId === 'mall') return <MallMarkings />;
    if (mapId === 'gangnam') return <GangnamMarkings />;
    return <StandardMarkings />;
}

function StandardMarkings() {
    return (
        <group>
            {/* Asphalt driveway */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.005, 5]}>
                <planeGeometry args={[18, 35]} />
                <meshStandardMaterial color="#6b7280" roughness={0.95} />
            </mesh>

            {/* Center dashed line */}
            {Array.from({ length: 8 }).map((_, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.008, 20 - i * 4]}>
                    <planeGeometry args={[0.12, 1.5]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
                </mesh>
            ))}

            {/* P symbol at entrance */}
            <Text position={[-8, 0.05, 18]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.5} color="#3b82f6" fillOpacity={0.6}>
                P
            </Text>

            {/* Direction arrows */}
            <Text position={[-8, 0.05, 10]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.8} color="#ffffff" fillOpacity={0.5}>
                {"▼"}
            </Text>
            <Text position={[2, 0.05, 10]} rotation={[-Math.PI / 2, 0, Math.PI]} fontSize={0.8} color="#ffffff" fillOpacity={0.5}>
                {"▼"}
            </Text>

            {/* Perimeter curbs */}
            {/* Left wall */}
            <mesh position={[-13, 0.4, 5]}>
                <boxGeometry args={[0.3, 0.8, 35]} />
                <meshStandardMaterial color="#9ca3af" roughness={0.9} />
            </mesh>
            {/* Right wall */}
            <mesh position={[7, 0.4, 5]}>
                <boxGeometry args={[0.3, 0.8, 35]} />
                <meshStandardMaterial color="#9ca3af" roughness={0.9} />
            </mesh>
            {/* Back wall */}
            <mesh position={[-3, 0.4, -12]}>
                <boxGeometry args={[20, 0.8, 0.3]} />
                <meshStandardMaterial color="#9ca3af" roughness={0.9} />
            </mesh>

            {/* Yellow curb at entry */}
            <mesh position={[-8, 0.15, 22]} rotation={[0, 0, 0]}>
                <boxGeometry args={[3, 0.3, 0.3]} />
                <meshStandardMaterial color="#eab308" roughness={0.7} />
            </mesh>
            <mesh position={[2, 0.15, 22]} rotation={[0, 0, 0]}>
                <boxGeometry args={[3, 0.3, 0.3]} />
                <meshStandardMaterial color="#eab308" roughness={0.7} />
            </mesh>
        </group>
    );
}

function GangnamMarkings() {
    return (
        <group>
            {/* Asphalt surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 5]}>
                <planeGeometry args={[30, 40]} />
                <meshStandardMaterial color="#6b7280" roughness={0.95} />
            </mesh>

            {/* Aisle center line */}
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.008, 20 - i * 4]}>
                    <planeGeometry args={[0.12, 1.5]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
                </mesh>
            ))}

            {/* P symbol */}
            <Text position={[-6, 0.05, 20]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.8} color="#3b82f6" fillOpacity={0.6}>
                P
            </Text>

            {/* Direction arrows along aisle */}
            {[-2, 6, 14].map((z, i) => (
                <Text key={i} position={[-6, 0.05, z]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.8} color="#ffffff" fillOpacity={0.4}>
                    {"▼"}
                </Text>
            ))}

            {/* Perimeter curbs */}
            <mesh position={[-15, 0.4, 5]}>
                <boxGeometry args={[0.3, 0.8, 40]} />
                <meshStandardMaterial color="#9ca3af" roughness={0.9} />
            </mesh>
            <mesh position={[15, 0.4, 5]}>
                <boxGeometry args={[0.3, 0.8, 40]} />
                <meshStandardMaterial color="#9ca3af" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.4, -15]}>
                <boxGeometry args={[30, 0.8, 0.3]} />
                <meshStandardMaterial color="#9ca3af" roughness={0.9} />
            </mesh>

            {/* Speed bumps near gate */}
            {[16, 14].map((z, i) => (
                <mesh key={i} position={[-6, 0.08, z]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[5, 0.15, 0.5]} />
                    <meshStandardMaterial color="#eab308" roughness={0.8} />
                </mesh>
            ))}

            {/* Yellow no-parking hatching at entry area */}
            {Array.from({ length: 5 }).map((_, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[-6, 0.007, 22 + i * 0.8]}>
                    <planeGeometry args={[0.08, 2]} />
                    <meshBasicMaterial color="#eab308" transparent opacity={0.4} />
                </mesh>
            ))}
        </group>
    );
}

function MallMarkings() {
    return (
        <group>
            {/* Entry Arrow */}
            <Text position={[-2, 0.1, 60]} rotation={[-Math.PI / 2, 0, 0]} fontSize={2} color="#00ff00">
                {"IN ▶"}
            </Text>
            {/* Exit Arrow */}
            <Text position={[12, 0.1, 60]} rotation={[-Math.PI / 2, 0, Math.PI]} fontSize={2} color="#ff0000">
                {"OUT ▶"}
            </Text>
            {/* Zone Labels */}
            <Text position={[0, -12 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={4} color="#ffc0cb" fillOpacity={0.3}>
                B3 PINK ZONE
            </Text>
            <Text position={[0, -18 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={4} color="#a0eec0" fillOpacity={0.3}>
                B4 MINT ZONE
            </Text>
            <Text position={[0, -24 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={4} color="#e0b0ff" fillOpacity={0.3}>
                B5 PURPLE ZONE
            </Text>
            <Text position={[0, -30 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={4} color="#ffcc99" fillOpacity={0.3}>
                B6 ORANGE ZONE
            </Text>
        </group>
    );
}

export default function ParkingLot() {
    const { parkingSpots, mapConfig, cars } = useParkingStore();

    const occupiedIndices = useMemo(() => {
        const set = new Set<number>();
        cars.forEach(c => {
            if ((c.status === 'PARKED' || c.status === 'ENTERING') && c.parkingSpotIndex !== undefined) {
                set.add(c.parkingSpotIndex);
            }
        });
        return set;
    }, [cars]);

    if (!mapConfig) return null;

    const entryGate = mapConfig.gates.find(g => g.gate_type === 'entry');
    const exitGate = mapConfig.gates.find(g => g.gate_type === 'exit');
    const entryPos = entryGate ? [entryGate.x, entryGate.y, entryGate.z] : [0, 0, 0];
    const exitPos = exitGate ? [exitGate.x, exitGate.y, exitGate.z] : [0, 0, 0];
    const entryLabel = entryGate?.label || "ENTRY";
    const exitLabel = exitGate?.label || "EXIT";

    const yLevels = Array.from(new Set(parkingSpots.map(s => s[1]))).concat(0).filter((v, i, a) => a.indexOf(v) === i);

    return (
        <group>
            {/* Floor Pedestals */}
            {yLevels.map((yLevel) => (
                <group key={yLevel} position={[0, yLevel - 1.05, 0]}>
                    <RoundedBox
                        args={[150, 2.5, 150]}
                        radius={0.3}
                        smoothness={4}
                        receiveShadow
                        castShadow
                    >
                        <meshStandardMaterial
                            color={yLevel === 0 ? "#d1d5db" : (mapConfig.map_id === 'mall' ? "#e5e7eb" : "#d1d5db")}
                            roughness={0.95}
                            metalness={0.0}
                        />
                    </RoundedBox>
                </group>
            ))}

            {/* Floor Labels */}
            {yLevels.map((yLevel) => {
                let label = "1F";
                if (mapConfig.map_id === 'mall') {
                    if (yLevel === -12) label = "B3";
                    else if (yLevel === -18) label = "B4";
                    else if (yLevel === -24) label = "B5";
                    else if (yLevel === -30) label = "B6";
                } else {
                    if (yLevel === -6) label = "B1";
                    else if (yLevel === -12) label = "B2";
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

            {/* Parking Spots with occupancy */}
            {parkingSpots.map((spot, i) => (
                <ParkingSpot
                    key={i}
                    position={spot as [number, number, number]}
                    index={i}
                    isOccupied={occupiedIndices.has(i)}
                />
            ))}

            {/* Entry/Exit Labels */}
            <Text
                position={[entryPos[0], 0.1, entryPos[2] + 4]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={1}
                color="white"
            >
                {entryLabel}
            </Text>
            <Text
                position={[exitPos[0], 0.1, exitPos[2] + 4]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={1}
                color="white"
            >
                {exitLabel}
            </Text>

            {/* Road Markings & Environment per map */}
            <RoadMarkings mapId={mapConfig.map_id} />

            {/* Mall parking lines */}
            {mapConfig.map_id === 'mall' && Array.from(new Set(parkingSpots.map(s => s[1]))).map((yLevel) => (
                <group key={`lines-${yLevel}`} position={[0, yLevel + 0.02, 0]}>
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
        </group>
    );
}
