'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

const data = [
    { name: 'New', value: 30, color: '#e5e7eb' },
    { name: 'Disqualified', value: 15, color: '#f43f5e' },
    { name: 'Qualified', value: 25, color: '#0ea5e9' },
    { name: 'Contacted', value: 20, color: '#f59e0b' },
    { name: 'Proposal Sent', value: 40, color: '#bef264' },
    { name: 'Converted', value: 60, color: '#14b8a6' },
];

export const LeadsChart = () => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full lg:max-w-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-700">Leads</h3>
                <span className="text-[12px] text-gray-400 font-medium tracking-tight">This Year</span>
            </div>

            <div className="h-[240px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={105}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Leads</span>
                </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-[280px]">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 px-3 py-1 rounded-full shadow-sm border border-gray-50" style={{ backgroundColor: item.color }}>
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter drop-shadow-sm whitespace-nowrap">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
