"use client";

import { useParkingStore } from "@/app/store";
import { useEffect } from "react";

export default function ControlPanel() {
  const { 
    logs, 
    plateNumber, setPlateNumber,
    entryGateOpen, setEntryGate,
    exitGateOpen, setExitGate,
    spawnCar, cars, updateCarStatus,
    parkingSpots,
    exitInfo,
    syncPolicy
  } = useParkingStore();

  useEffect(() => {
    syncPolicy();
    const interval = setInterval(() => syncPolicy(), 5000);
    return () => clearInterval(interval);
  }, []);

  const generateRandomPlate = () => {
    const number = Math.floor(Math.random() * 9000) + 1000;
    const chars = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "하"];
    const char = chars[Math.floor(Math.random() * chars.length)];
    const prefix = Math.floor(Math.random() * 90) + 10;
    setPlateNumber(`${prefix}${char}${number}`);
  };

  const handleSimulateEntry = () => spawnCar();

  const handleSimulateExit = () => {
      const parkedCars = cars.filter(c => c.status === 'PARKED');
      if (parkedCars.length > 0) {
          const randomIndex = Math.floor(Math.random() * parkedCars.length);
          const randomCar = parkedCars[randomIndex];
          updateCarStatus(randomCar.id, 'EXITING');
      } else {
          alert("No parked cars to exit!");
      }
  };

  const occupancy = cars.filter(c => c.status === 'PARKED').length;
  const capacity = parkingSpots?.length || 5;
  const occupancyRate = (occupancy / capacity) * 100;

  return (
    <>
    {/* Receipt Overlay */}
    {exitInfo && exitInfo.isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-80 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-slide-up">
                <div className="bg-slate-900 text-white p-4 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <h3 className="text-lg font-bold tracking-wider">PARKING RECEIPT</h3>
                    <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleString()}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-4">
                        <span className="text-sm text-gray-500 font-medium">Plate Number</span>
                        <span className="text-2xl font-mono font-bold text-slate-800">{exitInfo.plateNumber}</span>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Duration</span>
                            <span className="font-semibold text-slate-700">{exitInfo.duration} min</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Parking Spot</span>
                            <span className="font-semibold text-slate-700">Zone A-{exitInfo.parkingSpot}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Method</span>
                            <span className="font-semibold text-blue-600">{exitInfo.paymentMethod}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
                        <span className="text-slate-900 font-bold">TOTAL</span>
                        <span className="text-3xl font-black text-slate-900">{exitInfo.fee.toLocaleString()} ₩</span>
                    </div>
                </div>
                <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-mono">OpenPMS Smart System</p>
                </div>
            </div>
        </div>
    )}

    {/* Modern Control Dashboard */}
    <div className="absolute right-6 top-6 w-[340px] flex flex-col gap-4 z-40 font-sans">
        
        {/* Status Card */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        🅿️ Parking Status
                    </h2>
                    <p className="text-xs text-slate-400">Live Monitoring System</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${occupancy >= capacity ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                    {occupancy >= capacity ? 'FULL' : 'AVAILABLE'}
                </div>
            </div>

            <div className="mb-3 flex justify-between items-end">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tight">{occupancy}</span>
                    <span className="text-sm text-slate-400 font-medium">/ {capacity}</span>
                </div>
                <span className="text-xs font-bold text-slate-500 mb-1">{Math.round(occupancyRate)}% Used</span>
            </div>
            
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                <div 
                    className={`h-full transition-all duration-700 ease-out ${occupancy >= capacity ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                    style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                />
            </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simulation Controls</h3>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            
            {/* Plate Input */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={plateNumber} 
                        onChange={(e) => setPlateNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="12가3456"
                    />
                </div>
                <button 
                    onClick={generateRandomPlate}
                    className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 transition-colors"
                    title="Generate Random Plate"
                >
                    🎲
                </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                    onClick={handleSimulateEntry}
                    disabled={occupancy >= capacity}
                    className="group relative flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="text-xl mb-1 relative z-10">⬇️</span>
                    <span className="text-xs font-bold relative z-10">Spawn Entry</span>
                </button>
                <button 
                    onClick={handleSimulateExit}
                    disabled={occupancy === 0}
                    className="group relative flex flex-col items-center justify-center p-3 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="text-xl mb-1 relative z-10">⬆️</span>
                    <span className="text-xs font-bold relative z-10">Simulate Exit</span>
                </button>
            </div>

            {/* Gate Override */}
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => setEntryGate(!entryGateOpen)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${entryGateOpen ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                    {entryGateOpen ? '⛔ Close Entry' : '🔓 Open Entry'}
                </button>
                <button 
                    onClick={() => setExitGate(!exitGateOpen)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${exitGateOpen ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                    {exitGateOpen ? '⛔ Close Exit' : '🔓 Open Exit'}
                </button>
            </div>
        </div>

        {/* System Logs */}
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/10 max-h-48 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-3 sticky top-0 bg-transparent pb-1 border-b border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Logs</span>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            </div>
            <div className="space-y-2 font-mono text-[10px]">
                {logs.length === 0 && <div className="text-slate-600 italic text-center py-4">System Initialized...</div>}
                {logs.map((log, i) => (
                    <div key={i} className="text-emerald-400/90 break-words leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                        <span className="text-slate-500 text-[9px] block mb-0.5">{new Date().toLocaleTimeString()}</span>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    </div>
    </>
  );
}
