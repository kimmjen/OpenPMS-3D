import Scene from "@/app/components/canvas/Scene";
import ControlPanel from "@/app/components/ui/ControlPanel";

export default function Home() {
  return (
    <main className="w-full h-screen relative">
      <Scene />
      <ControlPanel />
    </main>
  );
}
