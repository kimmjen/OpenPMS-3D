"use client";

import { useEffect, useState } from 'react';
import { adminApi, mapApi, MapConfig } from '@/app/lib/api';
import { useParkingStore } from '@/app/store';

const PRICING_PRESETS = {
    "default": { name: "Standard (General)", base: 1000, unit: 60, free: 30, daily: 20000 },
    "gangnam": { name: "Gangnam (Hotspot)", base: 1500, unit: 10, free: 5, daily: 80000 },
    "public": { name: "Public Parking", base: 400, unit: 5, free: 10, daily: 15000 },
    "expensive": { name: "Premium / Hotel", base: 3000, unit: 30, free: 60, daily: 100000 },
};

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'maps'>('dashboard');
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [policy, setPolicy] = useState<any>(null);
    const [maps, setMaps] = useState<MapConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<string>("");

    // Time Edit State
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [editTimeValue, setEditTimeValue] = useState<string>("");

    // Global Store Action
    const setCapacity = useParkingStore((state) => state.setCapacity);
    const capacity = useParkingStore((state) => state.capacity);
    const currentMapId = useParkingStore((state) => state.currentMapId);
    const loadMap = useParkingStore((state) => state.loadMap);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getStatus();
            setVehicles(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchPolicy = async () => {
        try {
            const data = await adminApi.getPolicy();
            setPolicy(data);
            if (data && data.capacity) {
                setCapacity(data.capacity);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMaps = async () => {
        try {
            const data = await mapApi.getAll();
            setMaps(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchStatus();
        fetchPolicy();
        fetchMaps();

        const interval = setInterval(() => {
            fetchStatus();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleReset = async () => {
        if (!confirm("WARNING: This will delete ALL data. Continue?")) return;
        await adminApi.resetSystem();
        alert("System Reset Complete.");
        fetchStatus();
        fetchMaps();
    };

    const handleForceExit = async (plate: string) => {
        if (!confirm(`Force exit ${plate}?`)) return;
        await adminApi.forceExit(plate);
        fetchStatus();
    };

    const handleUpdatePolicy = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            base_rate: parseFloat(formData.get('base_rate') as string),
            free_minutes: parseInt(formData.get('free_minutes') as string),
            unit_minutes: parseInt(formData.get('unit_minutes') as string),
            capacity: parseInt(formData.get('capacity') as string),
            max_daily_fee: parseFloat(formData.get('max_daily_fee') as string),
        };
        await adminApi.updatePolicy(data);
        alert("Global Policy Updated Successfully");
        fetchPolicy();
    };

    const handleUpdateMap = async (mapId: string, data: Partial<MapConfig>) => {
        try {
            await mapApi.updateMap(mapId, data);
            // alert(`Map '${mapId}' Updated!`);
            fetchMaps();
        } catch (e) {
            console.error(e);
            alert("Failed to update map");
        }
    };

    const handlePresetChange = (e: any) => {
        const key = e.target.value;
        setSelectedPreset(key);
        const preset = PRICING_PRESETS[key as keyof typeof PRICING_PRESETS];
        if (preset && policy) {
            setPolicy({
                ...policy,
                base_rate: preset.base,
                unit_minutes: preset.unit,
                free_minutes: preset.free,
                max_daily_fee: preset.daily
            });
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setPolicy({ ...policy, [name]: value });
        setSelectedPreset("");
    };

    const openTimeEdit = (event: any) => {
        setEditingEventId(event.event_id);
        const date = new Date(event.entry_time);
        const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setEditTimeValue(localIso);
    };

    const saveTimeEdit = async () => {
        if (!editingEventId || !editTimeValue) return;
        try {
            const isoString = new Date(editTimeValue).toISOString();
            await adminApi.updateEntryTime(editingEventId, isoString);
            setEditingEventId(null);
            fetchStatus();
        } catch (e) {
            console.error(e);
            alert("Failed to update time");
        }
    };

    // Map Detail State
    const [selectedMap, setSelectedMap] = useState<MapConfig | null>(null);

    // ... (existing functions)

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
            setSelectedMap(null); // Go back to list
        } catch (e) {
            console.error(e);
            alert("Failed to update map");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
            <header className="mb-8 border-b pb-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">OpenPMS Dashboard</h1>
                        <p className="text-gray-500 mt-1">System Administration & Monitoring</p>
                    </div>
                    <div className="flex gap-3">
                        {/* ... (buttons) ... */}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-200 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => { setActiveTab('dashboard'); setSelectedMap(null); }}
                        className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => { setActiveTab('maps'); setSelectedMap(null); }}
                        className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'maps' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Map Management
                    </button>
                </div>
            </header>

            {/* Content Area */}
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Status Panel (Full Width now?) or Keep Left */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Status Table ... (Keep existing code) ... */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* ... Same Table Code ... */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">Live Parking Status</h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                    {vehicles.length} Active Cars
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    {/* ... keeping the table concise for brevity in replacement ... */}
                                    <thead className="bg-gray-50 text-gray-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">Spot</th>
                                            <th className="px-6 py-4">Plate Number</th>
                                            <th className="px-6 py-4">Entry Time</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {vehicles.length === 0 ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-gray-400">No vehicles parked</td></tr>
                                        ) : vehicles.map((v) => (
                                            <tr key={v.event_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{v.parking_spot} ({v.map_id})</td>
                                                <td className="px-6 py-4 font-mono font-bold text-gray-700">{v.plate_number}</td>
                                                <td className="px-6 py-4 text-gray-500">{new Date(v.entry_time).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleForceExit(v.plate_number)}
                                                        className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded"
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
                </div>
            )}

            {activeTab === 'maps' && !selectedMap && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maps.map(map => (
                        <div
                            key={map.map_id}
                            onClick={() => setSelectedMap(map)}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg text-white group-hover:scale-110 transition-transform">
                                    {map.map_id === 'gangnam' ? '🏢' : '🅿️'}
                                </div>
                                <div className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                    ID: {map.map_id}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-1">{map.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 h-10">{map.description}</p>

                            <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm font-medium text-gray-600">
                                <span>🏗️ {map.capacity} Spots</span>
                                <div className="flex gap-2">
                                    {currentMapId === map.map_id ? (
                                        <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">Active</span>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); loadMap(map.map_id); }}
                                            className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs border border-blue-200"
                                        >
                                            Activate
                                        </button>
                                    )}
                                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">Manage &rarr;</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'maps' && selectedMap && (
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => setSelectedMap(null)}
                        className="mb-6 flex items-center text-gray-500 hover:text-gray-800 transition-colors font-medium"
                    >
                        &larr; Back to Map List
                    </button>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedMap.name}</h2>
                            <p className="text-gray-500 text-sm">Managing configuration for map ID: <span className="font-mono">{selectedMap.map_id}</span></p>
                        </div>

                        <form onSubmit={handleSaveMapDetail} className="p-8 space-y-8">
                            {/* Basic Info Section */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Map Name</label>
                                        <input name="name" type="text" defaultValue={selectedMap.name} className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                                        <input name="capacity" type="number" defaultValue={selectedMap.capacity} className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none border" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea name="description" defaultValue={selectedMap.description} className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none border h-24 resize-none" />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Pricing Policy Section */}
                            <section>
                                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span>💰 Pricing Policy</span>
                                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Per-Map</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Base Rate (₩)</label>
                                        <input name="base_rate" type="number" defaultValue={selectedMap.base_rate || 1000} className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Time (Minutes)</label>
                                        <input name="unit_minutes" type="number" defaultValue={selectedMap.unit_minutes || 60} className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Free Time (Minutes)</label>
                                        <input name="free_minutes" type="number" defaultValue={selectedMap.free_minutes || 30} className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Max Fee (₩)</label>
                                        <input name="max_daily_fee" type="number" defaultValue={selectedMap.max_daily_fee || 20000} className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none border" />
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
