'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
    { name: '1', income: 0, expense: 0 },
    { name: '2', income: 2773.75, expense: 0 },
    { name: '3', income: 0, expense: 0 },
    { name: '4', income: 0, expense: 0 },
    { name: '5', income: 0, expense: 0 },
    { name: '6', income: 0, expense: 0 },
    { name: '7', income: 0, expense: 0 },
    { name: '8', income: 0, expense: 0 },
    { name: '9', income: 0, expense: 0 },
    { name: '10', income: 0, expense: 0 },
    { name: '11', income: 0, expense: 0 },
    { name: '12', income: 0, expense: 0 },
];

export const RevenueChart = () => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex-1">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-lg font-bold text-gray-700">Income vs Expenses</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-teal-500 text-white text-[11px] font-bold rounded-full">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-sky-500 text-white text-[11px] font-bold rounded-full">Expense</span>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-[12px] font-bold">
                        2026
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#14b8a6', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#14b8a6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#14b8a6', strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-12 flex items-center justify-around border-t border-gray-50 pt-10">
                <div className="text-center">
                    <h4 className="text-3xl font-bold text-gray-700">2026</h4>
                    <p className="text-[13px] text-gray-400 font-medium uppercase mt-2 tracking-wide">Period</p>
                </div>
                <div className="text-center">
                    <h4 className="text-3xl font-bold text-gray-700">$2,773.75</h4>
                    <p className="text-[13px] text-gray-400 font-medium uppercase mt-2 tracking-wide">Income</p>
                </div>
                <div className="text-center">
                    <h4 className="text-3xl font-bold text-gray-700">$0.00</h4>
                    <p className="text-[13px] text-gray-400 font-medium uppercase mt-2 tracking-wide">Expenses</p>
                </div>
            </div>
        </div>
    );
};
