'use client';

import React, { useEffect, useState } from 'react';
import { 
    Search, 
    Loader2, 
    Download, 
    RefreshCw, 
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Trash2,
    X // 🔥 Popup close karne ke liye icon
} from 'lucide-react';
import { toast } from 'sonner';
// 🔥 NAYA: createLeadAction import kiya
import { getLeadsAction, updateLeadAction, deleteLeadAction, createLeadAction } from '@/actions/leadAction';

export default function LeadsPage() {
    // --- Existing States ---
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- 🔥 NAYE STATES (Popup Modal ke liye) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', sourcePage: 'Direct', budget: '', message: ''
    });

    // --- Existing Fetch Logic ---
    const fetchLeads = async () => {
        setIsLoading(true);
        const res = await getLeadsAction();
        if (res && res.success) {
            setLeads(res.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // --- Existing Update & Delete Logic ---
    const handleStatusChange = async (id: number, newStatus: string) => {
        const res = await updateLeadAction(id, { status: newStatus });
        if (res.success) {
            setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
            toast.success(`Status updated to ${newStatus}`); 
        } else {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this lead?")) {
            const res = await deleteLeadAction(id);
            if (res.success) {
                setLeads(leads.filter(lead => lead.id !== id));
                toast.success("Lead deleted successfully!"); 
            } else {
                toast.error("Failed to delete lead");
            }
        }
    };

    // --- 🔥 NAYA: Add Lead Logic ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await createLeadAction(formData);

        if (res && res.success) {
            toast.success("Lead created successfully!");
            setLeads([res.data, ...leads]); // Nayi lead table ke top par daalo
            setIsModalOpen(false); // Modal band karo
            setFormData({ fullName: '', email: '', phone: '', sourcePage: 'Direct', budget: '', message: '' }); // Form reset karo
        } else {
            toast.error(res?.message || "Failed to create lead");
        }
        setIsSubmitting(false);
    };

    // --- Existing Formatting & Pagination Logic ---
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const totalPages = Math.ceil(leads.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentLeads = leads.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

    return (
        <div className="p-4 sm:p-6 w-full max-w-[1400px] mx-auto bg-white min-h-screen font-sans relative">
            
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div>
                    <h1 className="text-[2.2rem] font-light text-[#2cb1c4] tracking-wide mb-1">Contact Leads</h1>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold tracking-widest uppercase">
                        <span>App</span> <span className="text-gray-300 font-normal">&gt;</span> <span>Leads</span> <span className="text-gray-300 font-normal">&gt;</span> <span className="text-gray-800">Contacts</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                    {/* 🔥 Yahan Link hata kar Button laga diya jo Modal open karega */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-orange-500 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-[13px] font-medium whitespace-nowrap"
                    >
                        <Plus size={15} strokeWidth={2} /> Add New Lead
                    </button>

                    <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#2ecc71] text-[#2ecc71] rounded hover:bg-emerald-50 transition-colors text-[13px] font-medium whitespace-nowrap">
                        <Download size={15} strokeWidth={2} /> Export
                    </button>
                    
                    <div className="relative flex-1 md:w-64">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search leads..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 focus:outline-none focus:border-[#2cb1c4] transition-colors" />
                    </div>

                    <button onClick={fetchLeads} className="p-2 border border-gray-200 text-gray-400 rounded hover:bg-gray-50 transition-colors">
                        <RefreshCw size={16} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* --- Table Section --- */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-100 text-[#2cb1c4] text-[13px] font-medium">
                                <th className="px-6 py-4 w-1/4">Lead Info</th>
                                <th className="px-6 py-4 w-1/4">Contact</th>
                                <th className="px-6 py-4 w-1/4">Source & Budget</th>
                                <th className="px-6 py-4 w-1/5">Status</th>
                                <th className="px-6 py-4 w-16 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50/80">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-6 py-16 text-center"><Loader2 className="animate-spin text-[#2cb1c4] mx-auto" size={28} /></td></tr>
                            ) : leads.length > 0 ? (
                                currentLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-[14px] text-[#2cb1c4] hover:underline cursor-pointer mb-0.5">{lead.fullName}</div>
                                            <div className="text-[12px] text-gray-400">{formatDate(lead.createdAt)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[13px] text-gray-600 font-medium mb-0.5">{lead.phone}</div>
                                            <div className="text-[12px] text-gray-400">{lead.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[13px] text-gray-600 uppercase font-medium tracking-wide mb-0.5">{lead.sourcePage || 'DIRECT'}</div>
                                            <div className="text-[12px] text-gray-400">{lead.budget ? `Budget: ${lead.budget}` : '-'}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="relative inline-block w-[120px]">
                                                <select 
                                                    value={lead.status || 'NEW'}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className={`appearance-none w-full border rounded px-3 py-1.5 text-[11px] font-semibold tracking-wide bg-transparent cursor-pointer focus:outline-none 
                                                        ${lead.status === 'CLOSED' ? 'border-[#2ecc71] text-[#2ecc71]' : 'border-[#2cb1c4] text-[#2cb1c4]'}`}
                                                >
                                                    <option value="NEW">NEW</option>
                                                    <option value="CONTACTED">CONTACTED</option>
                                                    <option value="QUALIFIED">QUALIFIED</option>
                                                    <option value="CLOSED">CLOSED</option>
                                                    <option value="LOST">LOST</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-gray-400" />
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleDelete(lead.id)}
                                                className="text-red-300 hover:text-red-600 transition-all duration-200 p-2 rounded-full hover:bg-red-50"
                                            >
                                                <Trash2 size={18} strokeWidth={1.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">No leads found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination Section --- */}
                {!isLoading && leads.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/30">
                        <div className="text-[13px] text-gray-500">
                            Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to <span className="font-medium text-gray-700">{Math.min(startIndex + itemsPerPage, leads.length)}</span> of <span className="font-medium text-gray-700">{leads.length}</span> leads
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors"><ChevronLeft size={16} /></button>
                            <div className="flex items-center gap-1 px-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-7 h-7 flex items-center justify-center rounded text-[13px] font-medium transition-colors ${currentPage === page ? 'bg-[#2cb1c4] text-white border border-[#2cb1c4]' : 'text-gray-500 hover:bg-white border border-transparent hover:border-gray-200'}`}>{page}</button>
                                ))}
                            </div>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* 🔥 ADD NEW LEAD MODAL (POPUP) 🔥 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-[1.3rem] font-light text-[#2cb1c4] tracking-wide">Add New Lead</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[12px] font-semibold text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] focus:outline-none focus:border-[#2cb1c4]" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-semibold text-gray-600 mb-1">Email <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] focus:outline-none focus:border-[#2cb1c4]" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-semibold text-gray-600 mb-1">Phone <span className="text-red-500">*</span></label>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] focus:outline-none focus:border-[#2cb1c4]" placeholder="9876543210" />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-semibold text-gray-600 mb-1">Source</label>
                                    <div className="relative">
                                        <select name="sourcePage" value={formData.sourcePage} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] focus:outline-none focus:border-[#2cb1c4] appearance-none bg-white">
                                            <option value="Direct">Direct</option>
                                            <option value="Website">Website</option>
                                            <option value="Referral">Referral</option>
                                            <option value="Social Media">Social Media</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[12px] font-semibold text-gray-600 mb-1">Budget (Optional)</label>
                                    <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] focus:outline-none focus:border-[#2cb1c4]" placeholder="e.g. ₹50k - ₹1L" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[12px] font-semibold text-gray-600 mb-1">Message</label>
                                    <textarea name="message" rows={3} value={formData.message} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] focus:outline-none focus:border-[#2cb1c4] resize-none" placeholder="Requirements..." />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 text-[13px] font-medium text-white bg-orange-500 rounded hover:bg-orange-600 disabled:opacity-70">
                                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                                    {isSubmitting ? 'Saving...' : 'Save Lead'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
        </div>
    );
}