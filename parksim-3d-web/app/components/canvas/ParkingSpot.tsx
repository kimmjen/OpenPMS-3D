"use client";

import { Text } from "@react-three/drei";
import React from "react";

interface ParkingSpotProps {
    position: [number, number, number];
    index: number;
    isOccupied?: boolean;
    width?: number;
    depth?: number;
}

const ParkingSpot = React.memo(function ParkingSpot({
    position, index, isOccupied = false, width = 2.5, depth = 5
}: ParkingSpotProps) {
    const lineThickness = 0.1;
    const lineLength = depth * 0.9;
    const lineColor = isOccupied ? '#fca5a5' : '#ffffff';
    const fillColor = isOccupied ? '#ef4444' : '#22c55e';

    return (
        <group position={[position[0], position[1] + 0.01, position[2]]}>
            {/* Occupancy fill */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
                <planeGeometry args={[width * 0.9, depth * 0.85]} />
                <meshBasicMaterial color={fillColor} transparent opacity={isOccupied ? 0.25 : 0.08} />
            </mesh>

            {/* Left Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-(width / 2 - lineThickness), 0.01, 0]}>
                <planeGeometry args={[lineThickness, lineLength]} />
                <meshBasicMaterial color={lineColor} />
            </mesh>
            {/* Right Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(width / 2 - lineThickness), 0.01, 0]}>
                <planeGeometry args={[lineThickness, lineLength]} />
                <meshBasicMaterial color={lineColor} />
            </mesh>
            {/* Back Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -(depth / 2 - lineThickness)]}>
                <planeGeometry args={[width, lineThickness]} />
                <meshBasicMaterial color={lineColor} />
            </mesh>

            {/* Status indicator dot */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, depth / 2 - 0.6]}>
                <circleGeometry args={[0.2, 16]} />
                <meshBasicMaterial color={fillColor} transparent opacity={0.7} />
            </mesh>

            {/* Number */}
            <Text position={[0, 0.1, depth / 3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color={isOccupied ? '#fca5a5' : '#facc15'}>
                {index + 1}
            </Text>
        </group>
    );
});

export default ParkingSpot;
