"use client";

import React from 'react';

interface SidebarProps {
    currentTab: string;
    setTab: (tab: string) => void;
}

import { LayoutDashboard, Map, CreditCard } from 'lucide-react';

export default function AdminSidebar({ currentTab, setTab }: SidebarProps) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'maps', label: 'Map Management', icon: <Map size={20} /> },
        { id: 'revenue', label: 'Revenue & History', icon: <CreditCard size={20} /> },
    ];

    return (
        <div className="w-64 h-full bg-white/10 backdrop-blur-md border-r border-white/20 p-6 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-white mb-8 tracking-wider">PMS ADMIN</h1>

            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentTab === tab.id
                        ? 'bg-blue-500/80 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium text-sm">{tab.label}</span>
                </button>
            ))}

            <div className="mt-auto text-xs text-gray-500 text-center">
                OpenPMS-3D v1.2
            </div>
        </div>
    );
}
