'use client';

import React, { useState } from 'react';
import { Search, Plus, CheckCircle, Clock, Link as LinkIcon, Download, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceTable() {
    // 🔥 Dummy Data (Baad mein ye backend se aayega)
    const dummyInvoices = [
        { id: 'INV-1001', client: 'Rahul Kumar', service: 'E-Commerce Website', amount: 25000, status: 'Paid', date: '20 Oct 2026' },
        { id: 'INV-1002', client: 'Priya Singh', service: 'SEO Optimization', amount: 15000, status: 'Unpaid', date: '22 Oct 2026' },
        { id: 'INV-1003', client: 'Amit Sharma', service: 'Mobile App UI/UX', amount: 45000, status: 'Unpaid', date: '25 Oct 2026' },
    ];

    return (
        // 🔥 Responsive Wrapper: tight on mobile, wide on desktop
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 md:space-y-6 bg-slate-50 min-h-screen font-sans w-full overflow-x-hidden">
            
            {/* 🔝 HEADER SECTION: Responsive Flex Layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 pb-2">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
                        Invoices
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                        <span>APP</span>
                        <span className="text-slate-300">&gt;</span>
                        <span>PAYMENTS</span>
                        <span className="text-slate-300">&gt;</span>
                        <span className="text-slate-800">INVOICES</span>
                    </div>
                </div>

                {/* Actions: Search & Add Button */}
                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <div className="flex items-center bg-white px-3 py-2 rounded-md border border-slate-200 flex-grow md:w-64 shadow-sm h-10">
                        <Search className="text-slate-400 mr-2 shrink-0" size={16} />
                        <input
                            type="text"
                            placeholder="Search client or ID..."
                            className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
                        />
                    </div>
                    
                    <Link 
                        href="/invoices/create"
                        className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white p-2.5 md:p-3 rounded-full shadow-md shadow-red-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center"
                        title="Create New Invoice"
                    >
                        <Plus size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
                    </Link>
                </div>
            </div>

            {/* 📊 DATA TABLE - Horizontal Scroll on Mobile */}
            <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-100 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                                <th className="p-3 md:p-4 w-10 text-center">
                                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                                </th>
                                <th className="p-3 md:p-4 font-medium cursor-pointer">
                                    Invoice ID <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                </th>
                                <th className="p-3 md:p-4 font-medium cursor-pointer">
                                    Client & Service <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                </th>
                                <th className="p-3 md:p-4 font-medium cursor-pointer">
                                    Amount <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                </th>
                                <th className="p-3 md:p-4 font-medium cursor-pointer">
                                    Status <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                </th>
                                <th className="p-3 md:p-4 font-medium text-right pr-4 md:pr-6">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-slate-50">
                            {dummyInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                    
                                    {/* Checkbox */}
                                    <td className="p-3 md:p-4 text-center">
                                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                                    </td>

                                    {/* Invoice ID */}
                                    <td className="p-3 md:p-4">
                                        <span className="bg-sky-50 text-[#00b4d8] font-mono text-[10px] md:text-[11px] px-2 md:px-2.5 py-1 rounded border border-sky-100 font-bold tracking-wider">
                                            {inv.id}
                                        </span>
                                    </td>

                                    {/* Client & Service */}
                                    <td className="p-3 md:p-4">
                                        <p className="font-light text-[#00b4d8] text-[14px] md:text-[15px] mb-0.5">{inv.client}</p>
                                        <p className="text-[11px] md:text-[12px] text-slate-400 font-medium flex items-center gap-1 md:gap-1.5">
                                            {inv.service} <span className="text-slate-300 hidden sm:inline">•</span> <span className="hidden sm:inline">{inv.date}</span>
                                        </p>
                                    </td>

                                    {/* Amount */}
                                    <td className="p-3 md:p-4">
                                        <p className="font-medium text-slate-700 text-[13px] md:text-[14px]">
                                            ₹{inv.amount.toLocaleString('en-IN')}
                                        </p>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="p-3 md:p-4">
                                        <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded text-[9px] md:text-[11px] font-semibold uppercase tracking-wider border
                                            ${inv.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}
                                        >
                                            {inv.status === 'Paid' ? <CheckCircle size={12} className="md:w-[14px] md:h-[14px] stroke-[2.5]" /> : <Clock size={12} className="md:w-[14px] md:h-[14px] stroke-[2.5]" />}
                                            {inv.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3 md:p-4 text-right pr-4 md:pr-6">
                                        <div className="flex items-center justify-end gap-1.5 md:gap-2">
                                            {/* Copy Link Button */}
                                            <button className="p-1 md:p-2 text-slate-400 hover:text-amber-500 transition-colors" title="Copy Payment Link">
                                                <LinkIcon size={16} className="md:w-[18px] md:h-[18px] stroke-[1.5]" />
                                            </button>
                                            {/* Download PDF Button */}
                                            <button className="p-1 md:p-2 text-slate-400 hover:text-[#00b4d8] transition-colors" title="Download Invoice PDF">
                                                <Download size={16} className="md:w-[18px] md:h-[18px] stroke-[1.5]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
}