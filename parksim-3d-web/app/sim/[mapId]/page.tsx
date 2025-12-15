"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Scene from "@/app/components/canvas/Scene";
import ControlPanel from "@/app/components/ui/ControlPanel";
import { useParkingStore } from "@/app/store";

export default function SimulationPage() {
  const { mapId } = useParams();
  const loadMap = useParkingStore((state) => state.loadMap);

  useEffect(() => {
    if (mapId) {
      loadMap(mapId as string);
    }
  }, [mapId, loadMap]);

  return (
    <main className="w-full h-screen relative bg-black">
      <Scene />
      <ControlPanel />
    </main>
  );
}
