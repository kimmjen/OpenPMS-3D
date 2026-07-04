import { useRef, useEffect, useState } from "react";
import { Group } from "three";
import { useParkingStore, CarInstance } from "@/app/store";
import { RoundedBox, Text, Html } from "@react-three/drei";
import anime from "animejs";
import { getEntryWaypoints, getExitWaypoints, getExitDepartWaypoints, animateAlongPath } from "@/app/lib/paths";

interface CarProps {
    data: CarInstance;
}

export default function Car({ data }: CarProps) {
    const groupRef = useRef<Group>(null);
    const hasRequestedEntry = useRef(false);
    const hasRequestedExit = useRef(false);
    const cleanupRef = useRef<(() => void) | null>(null);
    const [hovered, setHovered] = useState(false);

    const {
        setEntryGate, setExitGate,
        requestEntry, requestExitProcess,
        updateCarStatus, removeCar,
        parkingSpots,
        mapConfig
    } = useParkingStore();

    useEffect(() => {
        if (!groupRef.current) return;

        if (data.status === 'PARKED' && data.parkingSpotIndex !== undefined) {
            const spot = parkingSpots[data.parkingSpotIndex];
            if (spot) groupRef.current.position.set(spot[0], spot[1], spot[2]);
        } else {
            groupRef.current.position.set(data.position[0], data.position[1], data.position[2]);
        }
    }, []);

    useEffect(() => {
        return () => { cleanupRef.current?.(); };
    }, []);

    useEffect(() => {
        if (!groupRef.current || !mapConfig) return;

        if (data.status === 'ENTERING') {
            if (hasRequestedEntry.current) return;
            hasRequestedEntry.current = true;

            const spotIndex = data.parkingSpotIndex ?? 0;
            const spot = parkingSpots[spotIndex];
            if (!spot) return;

            const waypoints = getEntryWaypoints(mapConfig, spot);
            // First 2 waypoints: approach gate, then request entry
            const approachWaypoints = waypoints.slice(0, 1);
            const pastGateWaypoints = waypoints.slice(1);

            cleanupRef.current = animateAlongPath(
                groupRef.current,
                approachWaypoints,
                async () => {
                    if (!groupRef.current) return;
                    const success = await requestEntry(data.plateNumber);
                    if (!groupRef.current) return;

                    if (success) {
                        cleanupRef.current = animateAlongPath(
                            groupRef.current,
                            pastGateWaypoints,
                            () => {
                                setEntryGate(false);
                                updateCarStatus(data.id, 'PARKED');
                            },
                            anime
                        );
                    } else {
                        removeCar(data.id);
                    }
                },
                anime
            );
        } else if (data.status === 'EXITING') {
            if (hasRequestedExit.current) return;
            hasRequestedExit.current = true;

            const spotIndex = data.parkingSpotIndex ?? 0;
            const spot = parkingSpots[spotIndex] || data.position;

            const exitWaypoints = getExitWaypoints(mapConfig, spot);
            const departWaypoints = getExitDepartWaypoints(mapConfig);

            cleanupRef.current = animateAlongPath(
                groupRef.current,
                exitWaypoints,
                async () => {
                    if (!groupRef.current) return;
                    const success = await requestExitProcess(data.plateNumber);
                    if (!groupRef.current) return;

                    if (success) {
                        cleanupRef.current = animateAlongPath(
                            groupRef.current,
                            departWaypoints,
                            () => {
                                setExitGate(false);
                                removeCar(data.id);
                            },
                            anime
                        );
                    }
                },
                anime
            );
        }
    }, [data.status, mapConfig]);

    const bodyColor = data.color || "#3b82f6";
    const statusColors: Record<string, string> = {
        ENTERING: '#3b82f6',
        PARKED: '#22c55e',
        EXITING: '#f59e0b',
        IDLE: '#6b7280',
    };
    const indicatorColor = statusColors[data.status] || '#6b7280';
    const emissiveVal = hovered ? '#ffffff' : '#000000';
    const emissiveIntensity = hovered ? 0.12 : 0;

    return (
        <group
            ref={groupRef}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
            {/* Lower body */}
            <RoundedBox args={[1.9, 0.5, 4.2]} radius={0.15} smoothness={4} position={[0, 0.35, 0]} castShadow>
                <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.4} emissive={emissiveVal} emissiveIntensity={emissiveIntensity} />
            </RoundedBox>

            {/* Upper cabin */}
            <RoundedBox args={[1.6, 0.5, 2.2]} radius={0.12} smoothness={4} position={[0, 0.85, -0.3]} castShadow>
                <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.45} emissive={emissiveVal} emissiveIntensity={emissiveIntensity} />
            </RoundedBox>

            {/* Hood slope */}
            <mesh position={[0, 0.68, 0.85]} rotation={[-0.3, 0, 0]} castShadow>
                <boxGeometry args={[1.5, 0.08, 0.9]} />
                <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.4} />
            </mesh>

            {/* Rear slope */}
            <mesh position={[0, 0.68, -1.5]} rotation={[0.35, 0, 0]} castShadow>
                <boxGeometry args={[1.5, 0.08, 0.6]} />
                <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.4} />
            </mesh>

            {/* Front windshield */}
            <mesh position={[0, 0.85, 0.72]} rotation={[0.45, 0, 0]}>
                <boxGeometry args={[1.35, 0.5, 0.06]} />
                <meshPhysicalMaterial color="#88ccff" transmission={0.4} roughness={0} metalness={0.1} transparent opacity={0.55} />
            </mesh>

            {/* Rear windshield */}
            <mesh position={[0, 0.85, -1.38]} rotation={[-0.4, 0, 0]}>
                <boxGeometry args={[1.35, 0.45, 0.06]} />
                <meshPhysicalMaterial color="#88ccff" transmission={0.4} roughness={0} metalness={0.1} transparent opacity={0.55} />
            </mesh>

            {/* Side windows left */}
            <mesh position={[0.82, 0.88, -0.3]}>
                <boxGeometry args={[0.06, 0.35, 1.8]} />
                <meshPhysicalMaterial color="#88ccff" transmission={0.4} roughness={0} metalness={0.1} transparent opacity={0.45} />
            </mesh>

            {/* Side windows right */}
            <mesh position={[-0.82, 0.88, -0.3]}>
                <boxGeometry args={[0.06, 0.35, 1.8]} />
                <meshPhysicalMaterial color="#88ccff" transmission={0.4} roughness={0} metalness={0.1} transparent opacity={0.45} />
            </mesh>

            {/* Headlights */}
            <mesh position={[0.65, 0.4, 2.06]}>
                <boxGeometry args={[0.35, 0.15, 0.06]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[-0.65, 0.4, 2.06]}>
                <boxGeometry args={[0.35, 0.15, 0.06]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>

            {/* Taillights */}
            <mesh position={[0.7, 0.4, -2.06]}>
                <boxGeometry args={[0.3, 0.12, 0.06]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[-0.7, 0.4, -2.06]}>
                <boxGeometry args={[0.3, 0.12, 0.06]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.6} />
            </mesh>

            {/* Wheels */}
            {[
                [0.9, 0.22, 1.3], [-0.9, 0.22, 1.3],
                [0.9, 0.22, -1.3], [-0.9, 0.22, -1.3]
            ].map((pos, i) => (
                <group key={i} position={pos as [number, number, number]}>
                    {/* Tire */}
                    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                        <cylinderGeometry args={[0.28, 0.28, 0.22, 20]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                    </mesh>
                    {/* Hubcap */}
                    <mesh rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.17, 0.17, 0.24, 16]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>
            ))}

            {/* Bumper front */}
            <mesh position={[0, 0.2, 2.05]}>
                <boxGeometry args={[1.7, 0.2, 0.12]} />
                <meshStandardMaterial color="#333333" roughness={0.6} />
            </mesh>

            {/* Bumper rear */}
            <mesh position={[0, 0.2, -2.05]}>
                <boxGeometry args={[1.7, 0.2, 0.12]} />
                <meshStandardMaterial color="#333333" roughness={0.6} />
            </mesh>

            {/* License plate rear */}
            <group position={[0, 0.35, -2.12]}>
                <mesh>
                    <boxGeometry args={[0.75, 0.22, 0.02]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
                <Text
                    position={[0, 0, 0.02]}
                    fontSize={0.1}
                    color="#000000"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={0.7}
                >
                    {data.plateNumber}
                </Text>
            </group>

            {/* Status indicator on roof */}
            <mesh position={[0, 1.12, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.12, 0.2, 16]} />
                <meshBasicMaterial color={indicatorColor} />
            </mesh>
            <mesh position={[0, 1.13, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.1, 16]} />
                <meshBasicMaterial color={indicatorColor} transparent opacity={0.8} />
            </mesh>

            {/* Hover tooltip */}
            {hovered && (
                <Html position={[0, 2.0, 0]} center distanceFactor={15}>
                    <div className="bg-black/85 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none shadow-lg border border-white/10">
                        <div className="font-bold text-base">{data.plateNumber}</div>
                        <div className="text-xs text-gray-300 mt-0.5">{data.status}</div>
                    </div>
                </Html>
            )}
        </group>
    );
}
