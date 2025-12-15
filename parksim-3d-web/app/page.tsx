"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { mapApi, MapConfig } from "@/app/lib/api";

export default function LobbyPage() {
  const [maps, setMaps] = useState<MapConfig[]>([]);

  useEffect(() => {
    mapApi.getAll().then(setMaps).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        OpenPMS Simulation Lobby
      </h1>
      <p className="text-slate-400 mb-12">Select a parking lot environment to start simulation</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {maps.map((map) => (
          <Link key={map.map_id} href={`/sim/${map.map_id}`} className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500 hover:bg-slate-750 transition-all cursor-pointer h-full flex flex-col shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  {map.map_id === 'gangnam' ? '🏢' : '🅿️'}
                </div>
                <span className="px-3 py-1 bg-slate-900 rounded-full text-xs font-bold text-slate-400 border border-slate-700">
                  Capacity: {map.capacity}
                </span>
              </div>
              
              <h2 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-blue-400 transition-colors">{map.name}</h2>
              <p className="text-sm text-slate-400 mb-4 flex-1 leading-relaxed">{map.description}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-500">Ready to simulate</span>
                <div className="flex items-center text-blue-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  Enter ➔
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Loading Skeleton */}
        {maps.length === 0 && (
           [1, 2].map(i => (
             <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 animate-pulse h-64">
                <div className="w-12 h-12 bg-slate-700 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-700/50 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
             </div>
           ))
        )}
      </div>
    </div>
  );
}
