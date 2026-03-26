'use client';

import React, { useState } from 'react';
import { User, Briefcase, IndianRupee, Send, X, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function CreateInvoiceForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        clientName: '',
        serviceName: '',
        amount: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 🔥 Logic kept as is
        console.log("Submitting Invoice Data:", formData);

        setTimeout(() => {
            alert("Dummy Success! Baad mein yahan ashl Razorpay link aayega.");
            setLoading(false);
        }, 1500);
    };

    return (
        // 🔥 MODAL OVERLAY STYLE
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300">
            
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"></div>

            {/* Form Container */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col relative z-10 animate-in zoom-in-95 duration-200 font-sans">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-slate-100 bg-white rounded-t-xl">
                    <h2 className="text-[20px] font-semibold text-slate-800 flex items-center gap-2">
                        <FileText size={20} className="text-[#00b4d8]" /> Create New Invoice
                    </h2>
                    <Link href="/invoices" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={22} />
                    </Link>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto">
                    <form id="invoiceForm" onSubmit={handleSubmit} className="space-y-6">
                        
                        <h3 className="text-[#00b4d8] text-[13px] font-bold tracking-wider uppercase mb-2">Billing Details</h3>

                        {/* Client Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] text-slate-500">Client Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="clientName"
                                    required
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    placeholder="e.g. Rahul Kumar"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Service Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] text-slate-500">Project / Service Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="serviceName"
                                    required
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    placeholder="e.g. Custom E-Commerce Website"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Amount Field */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] text-slate-500">Amount (₹) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    min="1"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="e.g. 25000"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded text-sm font-semibold text-slate-800 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all"
                                />
                            </div>
                            <p className="text-[11px] text-slate-400 italic">Enter the exact amount to collect from the client.</p>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 md:px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                    <Link 
                        href="/invoices" 
                        className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded text-[14px] font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button 
                        type="submit" 
                        form="invoiceForm"
                        disabled={loading} 
                        className="px-6 py-2.5 bg-[#0e8bf1] text-white rounded text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        {loading ? 'Generating Link...' : 'Generate Payment Link'}
                    </button>
                </div>

            </div>
        </div>
    );
}