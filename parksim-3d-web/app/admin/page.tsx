"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi, mapApi, MapConfig } from '@/app/lib/api';
import { useParkingStore } from '@/app/store';
import AdminSidebar from './AdminSidebar';
import RevenueTab from './RevenueTab';
import { Car, Building2, ShoppingBag, Activity, CheckCircle, Zap, RefreshCw, AlertTriangle, ArrowLeft, Save, MapPin, CreditCard } from 'lucide-react';

export default function AdminPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State from URL or Default
    const activeTab = (searchParams.get('tab') as 'dashboard' | 'maps' | 'revenue') || 'dashboard';
    const selectedMapId = searchParams.get('mapId');

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [maps, setMaps] = useState<MapConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState<string>("");

    // Derived State
    const selectedMap = maps.find(m => m.map_id === selectedMapId) || null;

    // Navigation Helpers
    const setTab = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        params.delete('mapId'); // Clear map selection when switching tabs
        router.push(`?${params.toString()}`);
    };

    const setSelectedMapId = (id: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id) {
            params.set('mapId', id);
        } else {
            params.delete('mapId');
        }
        router.push(`?${params.toString()}`);
    };

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);

    // Global Store
    const currentMapId = useParkingStore((state) => state.currentMapId);
    const loadMap = useParkingStore((state) => state.loadMap);

    // Fetching
    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getStatus();
            setVehicles(data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const fetchMaps = async () => {
        try {
            const data = await mapApi.getAll();
            setMaps(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchStatus();
        fetchMaps();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleForceExit = async (plate: string) => {
        if (!confirm(`Force exit ${plate}?`)) return;
        await adminApi.forceExit(plate);
        fetchStatus();
    };

    const handleReset = async () => {
        if (!confirm("WARNING: This will delete ALL data. Continue?")) return;
        await adminApi.resetSystem();
        alert("System Reset Complete.");
        fetchStatus();
    };

    const handleSaveMapDetail = async (e: any) => {
        e.preventDefault();
        if (!selectedMap) return;

        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            capacity: parseInt(formData.get('capacity') as string),
            base_rate: parseFloat(formData.get('base_rate') as string),
            unit_minutes: parseInt(formData.get('unit_minutes') as string),
            free_minutes: parseInt(formData.get('free_minutes') as string),
            max_daily_fee: parseFloat(formData.get('max_daily_fee') as string),
        };

        try {
            await mapApi.updateMap(selectedMap.map_id, data);
            alert("Map Settings Updated!");
            fetchMaps();
            setSelectedMapId(null);
        } catch (e) {
            console.error(e);
            alert("Failed to update map");
        }
    };

    // --- Sub-components ---

    const DashboardTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cards */}
                <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Car size={14} /> Active Vehicles
                    </h3>
                    <p className="text-4xl font-bold text-white">{vehicles.length}</p>
                    <div className="mt-4 flex gap-2">
                        <button onClick={fetchStatus} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-zinc-300 transition flex items-center gap-1">
                            <RefreshCw size={12} /> Refresh
                        </button>
                        <button onClick={handleReset} className="text-xs bg-red-900/20 hover:bg-red-900/40 text-red-300 px-3 py-1.5 rounded transition border border-red-500/20 flex items-center gap-1">
                            <AlertTriangle size={12} /> Reset System
                        </button>
                    </div>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={14} /> Current Zone
                    </h3>
                    <p className="text-2xl font-bold text-blue-400 font-mono mt-1 uppercase">{currentMapId}</p>
                    <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1"><Activity size={12} /> Live Monitoring</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Zap size={14} /> System Status
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-emerald-400 font-bold">Operational</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">Uptime: 99.9%</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity size={18} className="text-blue-500" /> Live Traffic
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-zinc-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Spot</th>
                                <th className="px-6 py-4 font-medium">Plate Number</th>
                                <th className="px-6 py-4 font-medium">Entry Time</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-zinc-300">
                            {vehicles.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-zinc-600">No active vehicles found.</td></tr>
                            ) : vehicles.map((v) => (
                                <tr key={v.event_id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-amber-500 bg-amber-900/20 px-2 py-1 rounded text-xs">{v.parking_spot}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-white">{v.plate_number}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-500">{new Date(v.entry_time).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleForceExit(v.plate_number)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded text-xs border border-red-500/20 transition"
                                        >
                                            Force Exit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const MapsTab = () => {
        if (selectedMap) {
            return (
                <div className="max-w-4xl mx-auto animate-fade-in-up">
                    <button
                        onClick={() => setSelectedMapId(null)}
                        className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Back to Map List
                    </button>

                    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                        <div className="p-8 border-b border-white/10 bg-black/20">
                            <h2 className="text-2xl font-bold text-white mb-1">{selectedMap.name}</h2>
                            <p className="text-zinc-500 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Configuration for ID: <span className="font-mono text-zinc-300">{selectedMap.map_id}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSaveMapDetail} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Map Name</label>
                                    <input name="name" defaultValue={selectedMap.name} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Capacity</label>
                                    <input name="capacity" type="number" defaultValue={selectedMap.capacity} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description</label>
                                    <textarea name="description" defaultValue={selectedMap.description} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition h-24 resize-none" />
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-8">
                                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <CreditCard size={16} /> Pricing Policy <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">PER ZONE</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 mb-2">Base Rate (₩)</label>
                                        <input name="base_rate" type="number" defaultValue={selectedMap.base_rate || 1000} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 mb-2">Unit Time (min)</label>
                                        <input name="unit_minutes" type="number" defaultValue={selectedMap.unit_minutes || 60} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 mb-2">Free Time (min)</label>
                                        <input name="free_minutes" type="number" defaultValue={selectedMap.free_minutes || 30} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 mb-2">Daily Max (₩)</label>
                                        <input name="max_daily_fee" type="number" defaultValue={selectedMap.max_daily_fee || 20000} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {maps.map(map => (
                    <div key={map.map_id} onClick={() => setSelectedMapId(map.map_id)} className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-zinc-800/50 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowLeft className="rotate-180 text-zinc-500" size={20} />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white border border-white/10 shadow-inner ${map.map_id === 'gangnam' ? 'bg-indigo-500/20 text-indigo-400' :
                                map.map_id === 'mall' ? 'bg-purple-500/20 text-purple-400' :
                                    'bg-blue-500/20 text-blue-400'
                                }`}>
                                {map.map_id === 'gangnam' ? <Building2 size={24} /> : map.map_id === 'mall' ? <ShoppingBag size={24} /> : <MapPin size={24} />}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                {map.map_id}
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{map.name}</h3>
                        <p className="text-zinc-500 text-sm line-clamp-2 h-10 mb-4">{map.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-xs text-zinc-500 flex items-center gap-1"><Car size={12} /> {map.capacity} Spots</span>
                            {currentMapId === map.map_id ? (
                                <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                                    <CheckCircle size={12} /> Active
                                </span>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); loadMap(map.map_id); }}
                                    className="text-blue-400 hover:text-white hover:bg-blue-600 px-3 py-1 rounded text-xs border border-blue-500/30 transition"
                                >
                                    Activate
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="z-10 relative h-screen sticky top-0">
                <AdminSidebar currentTab={activeTab} setTab={setTab} />
            </div>

            <main className="flex-1 p-8 overflow-y-auto relative z-10">
                <header className="mb-8 flex justify-between items-end border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {activeTab === 'dashboard' ? 'Overview' : activeTab === 'maps' ? 'Map Management' : 'Revenue & Analytics'}
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1">Real-time System Administration</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-zinc-600 font-mono bg-white/5 px-3 py-1 rounded-full">{currentDate}</div>
                    </div>
                </header>

                <div className="animate-fade-in-up">
                    {activeTab === 'dashboard' && <DashboardTab />}
                    {activeTab === 'maps' && <MapsTab />}
                    {activeTab === 'revenue' && <RevenueTab />}
                </div>
            </main>
        </div>
    );
}
