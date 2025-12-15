"use client";

import { useEffect, useState, useRef } from 'react';
import { Text, Billboard } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { parkingApi } from '@/app/lib/api';
import { useParkingStore } from '@/app/store';

export default function FloorStatusBoard() {
    const { mapConfig } = useParkingStore();
    const [stats, setStats] = useState<any>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchStats = async () => {
        try {
            // Need to implement getStats in api.ts first
            // For now, let's fetch directly or assume api exists
            const res = await fetch(`http://localhost:8000/api/v1/maps/mall/stats`);
            const data = await res.json();
            setStats(data.floors);
        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };

    useEffect(() => {
        if (mapConfig?.map_id !== 'mall') return;

        fetchStats();
        intervalRef.current = setInterval(fetchStats, 5000); // Update every 5s
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [mapConfig?.map_id]);

    if (!mapConfig || mapConfig.map_id !== 'mall') return null;
    if (!stats) return null;

    // Define Y levels for B3, B4, B5, B6
    // B3: -12, B4: -18, B5: -24, B6: -30

    const getFloorText = (yLevel: number, name: string) => {
        const s = stats[String(yLevel)];
        if (!s) return `${name}: -- / --`;
        return `${name}: ${s.occupied} / ${s.total}`;
    };

    return (
        <group position={[0, 10, 50]}>
            <Billboard follow={true}>
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[20, 12]} />
                    <meshStandardMaterial color="black" transparent opacity={0.8} />
                </mesh>
                <Text position={[0, 4, 0.1]} fontSize={1.5} color="white" anchorY="middle">
                    PARKING STATUS
                </Text>
                <Text position={[0, 2, 0.1]} fontSize={1.2} color="#ffc0cb" anchorY="middle">
                    {getFloorText(-12, "B3 Pink")}
                </Text>
                <Text position={[0, 0, 0.1]} fontSize={1.2} color="#a0eec0" anchorY="middle">
                    {getFloorText(-18, "B4 Mint")}
                </Text>
                <Text position={[0, -2, 0.1]} fontSize={1.2} color="#e0b0ff" anchorY="middle">
                    {getFloorText(-24, "B5 Purple")}
                </Text>
                <Text position={[0, -4, 0.1]} fontSize={1.2} color="#ffcc99" anchorY="middle">
                    {getFloorText(-30, "B6 Orange")}
                </Text>
            </Billboard>
        </group>
    );
}
