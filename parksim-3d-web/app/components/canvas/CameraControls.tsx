"use client";

import { useThree } from "@react-three/fiber";
import React from "react";
import gsap from "gsap";
import { Html } from "@react-three/drei";

export default function CameraControls() {
    const { camera, controls } = useThree();

    const moveCamera = (pos: [number, number, number], target: [number, number, number]) => {
        // Animate position
        gsap.to(camera.position, {
            x: pos[0],
            y: pos[1],
            z: pos[2],
            duration: 1.5,
            ease: "power2.inOut"
        });

        // Animate target (requires OrbitControls ref if available, but we can try simple lookAt logic or controls.target)
        // @ts-ignore
        if (controls && controls.target) {
            // @ts-ignore
            gsap.to(controls.target, {
                x: target[0],
                y: target[1],
                z: target[2],
                duration: 1.5,
                ease: "power2.inOut",
                // @ts-ignore
                onUpdate: () => controls.update()
            });
        }
    };

    return (
        <Html position={[0, 0, 0]} fullscreen style={{ pointerEvents: 'none' }}>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto bg-black/50 p-2 rounded backdrop-blur-sm">
                <span className="text-white text-xs font-bold mb-1">CCTV Views</span>
                <button onClick={() => moveCamera([0, 150, 0], [0, 0, 0])} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded">
                    Top View (Mega)
                </button>
                <button onClick={() => moveCamera([80, 80, 80], [0, 0, 0])} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded">
                    ISO View
                </button>
                <div className="h-px bg-gray-500 my-1"></div>
                <button onClick={() => moveCamera([0, 10, 40], [0, 0, 20])} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded">
                    Gate / Ground
                </button>
                <button onClick={() => moveCamera([0, -12, 50], [0, -12, 0])} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded">
                    B3 View
                </button>
                <button onClick={() => moveCamera([0, -18, 50], [0, -18, 0])} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded">
                    B4 View
                </button>
                <button onClick={() => moveCamera([0, -24, 50], [0, -24, 0])} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded">
                    B5 View
                </button>
                <button onClick={() => moveCamera([0, -30, 50], [0, -30, 0])} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded">
                    B6 View
                </button>
            </div>
        </Html>
    );
}
