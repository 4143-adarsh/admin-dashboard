'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    borderColor: string;
    iconColor: string;
}

export const KPICard = ({ label, value, icon: Icon, borderColor, iconColor }: KPICardProps) => {
    return (
        <div className={`bg-white rounded-lg p-6 shadow-sm border-b-[4px] ${borderColor} flex items-center justify-between`}>
            <div className="flex flex-col">
                <h3 className="text-2xl font-bold text-gray-800 leading-tight">{value}</h3>
                <p className="text-[13px] text-gray-400 font-medium mt-1 uppercase tracking-tight">{label}</p>
            </div>
            <div className={`p-2 rounded-lg border border-gray-100 flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={1.5} />
            </div>
        </div>
    );
};
