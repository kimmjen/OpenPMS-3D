"use client";

import { Text } from "@react-three/drei";
import React from "react";

interface ParkingSpotProps {
    position: [number, number, number];
    index: number;
    width?: number;
    depth?: number;
}

export default function ParkingSpot({ position, index, width = 2.5, depth = 5 }: ParkingSpotProps) {
    const lineThickness = 0.1;
    const lineLength = depth * 0.9;

    return (
        <group position={[position[0], position[1] + 0.01, position[2]]}>
            {/* Left Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-(width / 2 - lineThickness), 0, 0]}>
                <planeGeometry args={[lineThickness, lineLength]} />
                <meshBasicMaterial color="white" />
            </mesh>
            {/* Right Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(width / 2 - lineThickness), 0, 0]}>
                <planeGeometry args={[lineThickness, lineLength]} />
                <meshBasicMaterial color="white" />
            </mesh>
            {/* Back Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -(depth / 2 - lineThickness)]}>
                <planeGeometry args={[width, lineThickness]} />
                <meshBasicMaterial color="white" />
            </mesh>
            {/* Number */}
            <Text position={[0, 0.1, depth / 3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.8} color="yellow">
                {index + 1}
            </Text>
        </group>
    );
}
