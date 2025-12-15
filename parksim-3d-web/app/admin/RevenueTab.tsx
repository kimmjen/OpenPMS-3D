"use client";

import { useEffect, useState } from 'react';
import { adminApi } from '@/app/lib/api';
import { DollarSign, CreditCard, Filter, Calendar, Car, MapPin } from 'lucide-react';

interface Transaction {
    id: number;
    date: string;
    plate_number: string;
    map_id: string;
    fee_paid: number;
    method: string;
    is_paid: boolean;
}

export default function RevenueTab() {
    const [history, setHistory] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterMap, setFilterMap] = useState("all");

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getHistory(filterMap, 100);
            setHistory(data);
        } catch (e) {
            console.error("Failed to fetch history", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [filterMap]);

    // Calculate Total Revenue
    const totalRevenue = history.reduce((sum, tx) => sum + (tx.is_paid ? tx.fee_paid : 0), 0);

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                        <DollarSign size={14} /> Total Revenue (Last 100)
                    </h3>
                    <p className="text-3xl font-bold text-emerald-400 font-mono">
                        ₩ {totalRevenue.toLocaleString()}
                    </p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                        <CreditCard size={14} /> Total Transactions
                    </h3>
                    <p className="text-3xl font-bold text-blue-400 font-mono">
                        {history.length}
                    </p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-center">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
                        <select
                            value={filterMap}
                            onChange={(e) => setFilterMap(e.target.value)}
                            className="w-full bg-black/30 text-white pl-10 pr-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="all">All Zones</option>
                            <option value="standard">Standard Lot</option>
                            <option value="gangnam">Gangnam Tower</option>
                            <option value="mall">The Hyundai Seoul</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="flex-1 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Calendar size={18} className="text-blue-500" /> Transaction History
                    </h2>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-black/20 text-zinc-500 text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                            <tr>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Plate Number</th>
                                <th className="p-4 font-medium">Zone ID</th>
                                <th className="p-4 font-medium">Method</th>
                                <th className="p-4 font-medium text-right">Fee Paid</th>
                                <th className="p-4 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-300 divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-zinc-500">Loading transactions...</td></tr>
                            ) : history.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-zinc-500">No transactions found.</td></tr>
                            ) : history.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-sm text-zinc-500 font-mono">{new Date(tx.date).toLocaleString()}</td>
                                    <td className="p-4 font-mono text-white font-medium flex items-center gap-2">
                                        <Car size={14} className="text-zinc-600 group-hover:text-zinc-400" />
                                        {tx.plate_number}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-mono border border-white/5 ${tx.map_id === 'mall' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                tx.map_id === 'gangnam' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                    'bg-zinc-700/50 text-zinc-400'
                                            }`}>
                                            {tx.map_id.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-zinc-400">{tx.method || '-'}</td>
                                    <td className="p-4 text-right font-mono text-emerald-400 font-medium">
                                        ₩ {tx.fee_paid.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        {tx.is_paid ? (
                                            <span className="text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">PAID</span>
                                        ) : (
                                            <span className="text-red-500 text-[10px] font-bold bg-red-500/10 px-2 py-1 rounded border border-red-500/20">UNPAID</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
