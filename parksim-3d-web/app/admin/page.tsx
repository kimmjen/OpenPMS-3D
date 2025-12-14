"use client";

import { useEffect, useState } from 'react';
import { adminApi } from '@/app/lib/api';
import { useParkingStore } from '@/app/store';

const PRICING_PRESETS = {
    "default": { name: "Standard (General)", base: 1000, unit: 60, free: 30, daily: 20000 },
    "gangnam": { name: "Gangnam (Hotspot)", base: 1500, unit: 10, free: 5, daily: 80000 },
    "public": { name: "Public Parking", base: 400, unit: 5, free: 10, daily: 15000 },
    "expensive": { name: "Premium / Hotel", base: 3000, unit: 30, free: 60, daily: 100000 },
};

export default function AdminPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [policy, setPolicy] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<string>("");
    
    // Time Edit State
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [editTimeValue, setEditTimeValue] = useState<string>("");

    // Global Store Action
    const setCapacity = useParkingStore((state) => state.setCapacity);
    const capacity = useParkingStore((state) => state.capacity);

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

    useEffect(() => {
        fetchStatus();
        fetchPolicy();

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
        alert("Policy Updated Successfully");
        fetchPolicy(); 
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
        setSelectedPreset(""); // Clear preset selection on manual edit
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

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
            <header className="mb-8 border-b pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">OpenPMS Dashboard</h1>
                    <p className="text-gray-500 mt-1">System Administration & Monitoring</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchStatus} className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium transition-colors">
                        Refresh Data
                    </button>
                    <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 text-sm font-medium transition-colors">
                        Reset System
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Panel (Left) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Live Parking Status</h2>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                {vehicles.length} / {capacity} Occupied
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
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
                                            <td className="px-6 py-4 font-medium text-gray-900">{v.parking_spot}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-gray-700">{v.plate_number}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {editingEventId === v.event_id ? (
                                                    <div className="flex gap-2 items-center">
                                                        <input 
                                                            type="datetime-local" 
                                                            value={editTimeValue}
                                                            onChange={(e) => setEditTimeValue(e.target.value)}
                                                            className="border rounded px-2 py-1 text-xs"
                                                        />
                                                        <button onClick={saveTimeEdit} className="text-green-600 hover:text-green-800 text-xs font-bold">Save</button>
                                                        <button onClick={() => setEditingEventId(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                                                    </div>
                                                ) : (
                                                    <div className="group flex items-center gap-2">
                                                        <span>{new Date(v.entry_time).toLocaleString()}</span>
                                                        <button 
                                                            onClick={() => openTimeEdit(v)}
                                                            className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 text-xs underline"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
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

                {/* Policy Panel (Right) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">Configuration</h2>
                        {policy ? (
                            <form onSubmit={handleUpdatePolicy} className="space-y-5">
                                {/* Preset Selector */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <label className="block text-xs font-bold text-blue-800 mb-2 uppercase tracking-wide">🚀 Quick Presets</label>
                                    <select 
                                        value={selectedPreset} 
                                        onChange={handlePresetChange} 
                                        className="w-full border-blue-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">-- Select Region/Type --</option>
                                        {Object.entries(PRICING_PRESETS).map(([key, val]) => (
                                            <option key={key} value={key}>{val.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Total Capacity</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            name="capacity" 
                                            type="number" 
                                            value={policy.capacity || 5} 
                                            onChange={handleInputChange}
                                            min="1" max="20" 
                                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border" 
                                        />
                                        <span className="text-sm text-gray-400">spots</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Updates 3D scene immediately</p>
                                </div>

                                <hr className="border-gray-100" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Base Rate</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-400">₩</span>
                                            <input 
                                                name="base_rate" 
                                                type="number" 
                                                value={policy.base_rate} 
                                                onChange={handleInputChange}
                                                className="block w-full pl-8 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Unit Time</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                name="unit_minutes" 
                                                type="number" 
                                                value={policy.unit_minutes} 
                                                onChange={handleInputChange}
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border" 
                                            />
                                            <span className="text-xs text-gray-400">min</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Free Time</label>
                                    <input 
                                        name="free_minutes" 
                                        type="number" 
                                        value={policy.free_minutes} 
                                        onChange={handleInputChange}
                                        className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border" 
                                    />
                                    <p className="text-xs text-gray-400 mt-1">First {policy.free_minutes} minutes are free</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Daily Max Fee</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-400">₩</span>
                                        <input 
                                            name="max_daily_fee" 
                                            type="number" 
                                            value={policy.max_daily_fee} 
                                            onChange={handleInputChange}
                                            className="block w-full pl-8 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border bg-yellow-50" 
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-transform active:scale-95">
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
