"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { mapApi, MapConfig } from "@/app/lib/api";
import { Building2, ShoppingBag, MapPin, ArrowRight, Car, Zap } from "lucide-react";

export default function LobbyPage() {
  const [maps, setMaps] = useState<MapConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapApi.getAll()
      .then(data => {
        setMaps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="z-10 w-full max-w-6xl px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-medium mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 tracking-tight">
            OpenPMS <span className="text-blue-500">Simulation</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Select a high-fidelity digital twin environment to begin real-time parking management simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading Skeletons
            [1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 h-80 animate-pulse flex flex-col">
                <div className="w-14 h-14 bg-zinc-800 rounded-2xl mb-6"></div>
                <div className="h-8 bg-zinc-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-full mb-2"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-2/3 mt-auto"></div>
              </div>
            ))
          ) : (
            maps.map((map, index) => (
              <Link
                key={map.map_id}
                href={`/sim/${map.map_id}`}
                className="group relative block"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-duration-500 transition-opacity"></div>
                <div className="relative h-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 transform group-hover:-translate-y-2 flex flex-col shadow-2xl overflow-hidden">

                  {/* Header Icon & Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-300 ${map.map_id === 'gangnam' ? 'bg-gradient-to-br from-indigo-500 to-blue-600' :
                        map.map_id === 'mall' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                          'bg-gradient-to-br from-zinc-700 to-zinc-600'
                      }`}>
                      {map.map_id === 'gangnam' ? <Building2 size={28} /> :
                        map.map_id === 'mall' ? <ShoppingBag size={28} /> :
                          <MapPin size={28} />}
                    </div>
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-mono text-zinc-300 border border-white/10 flex items-center gap-2">
                      <Car size={12} className="text-zinc-500" />
                      {map.capacity} Spots
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{map.name}</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                      {map.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center group/btn">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Digital Twin</span>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 text-white transition-all group-hover:scale-110 shadow-lg">
                      <ArrowRight size={18} className="group-hover:-rotate-45 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="mt-20 text-center">
          <p className="text-zinc-600 text-sm font-mono">
            OpenPMS v1.2.0 • Powered by Smart City Digital Twin
          </p>
        </div>
      </div>
    </div>
  );
}
