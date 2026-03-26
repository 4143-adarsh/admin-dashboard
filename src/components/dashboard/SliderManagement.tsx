'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, Edit, Trash2, Image as ImageIcon, Loader2, 
    X, ArrowUpDown, CheckCircle2, AlertCircle,
    ChevronLeft, ChevronRight
} from 'lucide-react';

export default function SliderManagement() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const [sliders, setSliders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState<any | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 🔥 Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // 🔥 CUSTOM TOAST STATE
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const [formData, setFormData] = useState({
        label: 'Partner',
        title: 'Our Partner',
        description: '',
        componentType: 'partner',
        order: 1,
        isActive: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fetchSliders = async () => {
        if (!API_BASE_URL) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/slider/admin/all`);
            const result = await res.json();
            if (result.success && result.data) {
                setSliders(result.data);
            } else if (Array.isArray(result)) {
                setSliders(result);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSliders(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('label', formData.label);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('componentType', formData.componentType);
        data.append('order', formData.order.toString());
        data.append('isActive', formData.isActive.toString());
        if (imageFile) data.append('image', imageFile);

        try {
            const url = editingSlider ? `${API_BASE_URL}/api/slider/${editingSlider.id}` : `${API_BASE_URL}/api/slider`;
            const method = editingSlider ? 'PUT' : 'POST';
            const res = await fetch(url, { method, body: data });
            const result = await res.json();

            if (result.success || result.message === 'Created' || result.message === 'Updated') {
                fetchSliders();
                closeModal();
                showToast(editingSlider ? "Logo updated successfully!" : "Logo added successfully!", "success");
            } else {
                showToast(result.message || "Something went wrong", "error");
            }
        } catch (error) {
            showToast("Server error", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this slider?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/slider/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success || result.message === 'Deleted successfully') {
                fetchSliders();
                showToast("Logo deleted successfully!", "success");
            }
        } catch (error) { console.error(error); }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.length} sliders?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/slider/DeleteMultiple`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });
            const result = await res.json();
            if (result.success || result.message === 'Selected sliders deleted') {
                setSelectedIds([]);
                fetchSliders();
                showToast(`${selectedIds.length} logos deleted!`, "success");
            }
        } catch (error) { console.error(error); }
    };

    const openModal = (slider: any = null) => {
        setEditingSlider(slider);
        if (slider) {
            setFormData({
                label: slider.label || '',
                title: slider.title || '',
                description: slider.description || '',
                componentType: slider.componentType || 'partner',
                order: slider.order || 1,
                isActive: slider.isActive ?? true
            });
        } else {
            setFormData({ label: 'Partner', title: 'Our Partner', description: '', componentType: 'partner', order: 1, isActive: true });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingSlider(null); };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(sliders.map(s => s.id));
        else setSelectedIds([]);
    };
    const handleSelectOne = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // 🔥 Pagination Calculation Logic
    const totalPages = Math.ceil(sliders.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSliders = sliders.slice(indexOfFirstItem, indexOfLastItem);

    return (
        // 🔥 FIX: Reduced padding and space-y to kill top white space
        <div className="p-1 md:p-3 max-w-[1400px] mx-auto space-y-3 bg-slate-50 h-full font-sans w-full relative">

            {toast.show && (
                <div className={`fixed top-6 right-6 z-[999999] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 duration-300 ${toast.type === 'success' ? 'bg-white border-l-4 border-[#3ed4b2] text-slate-800' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="text-[#3ed4b2]" size={20} /> : <AlertCircle size={20} />}
                    <span className="font-semibold text-[14px] tracking-wide">{toast.message}</span>
                </div>
            )}

            {/* 🔝 HEADER SECTION - Super Tight Spacing */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-2 pb-0">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-light text-[#00b4d8] leading-tight tracking-wide">
                        Partner Logos
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 tracking-widest uppercase">
                        <span>APP</span>
                        <span className="text-slate-300">&gt;</span>
                        <span>SETTINGS</span>
                        <span className="text-slate-300">&gt;</span>
                        <span className="text-slate-800">SLIDERS</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full xl:w-auto">
                    {selectedIds.length > 0 && (
                        <button 
                            onClick={handleBulkDelete} 
                            className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-[12px] font-medium hover:bg-red-100 flex items-center gap-2 border border-red-200 transition-colors h-8"
                        >
                            <Trash2 size={14} className="stroke-[1.5]" /> Delete ({selectedIds.length})
                        </button>
                    )}
                    
                    <button 
                        onClick={() => openModal()}
                        className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white p-2.5 rounded-full shadow-md shadow-red-200 transition-transform hover:scale-105 ml-auto h-9 w-9 flex items-center justify-center"
                        title="Add New Logo"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Premium Data Table Container */}
            <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-100 text-[12px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                                <th className="p-2.5 w-10 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" 
                                        onChange={handleSelectAll} 
                                        checked={sliders.length > 0 && selectedIds.length === sliders.length} 
                                    />
                                </th>
                                <th className="p-2.5 font-medium w-24">Image</th>
                                <th className="p-2.5 font-medium cursor-pointer">
                                    Label & Title <ArrowUpDown size={10} className="inline ml-1 opacity-50" />
                                </th>
                                <th className="p-2.5 font-medium cursor-pointer text-center">
                                    Status
                                </th>
                                <th className="p-2.5 font-medium text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Loader2 className="animate-spin mb-3 text-[#00b4d8]" size={28} />
                                            <p className="text-xs font-medium">Fetching logos...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : sliders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-xs text-slate-500">No sliders found</td>
                                </tr>
                            ) : (
                                currentSliders.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-2.5 text-center">
                                            <input 
                                                type="checkbox" 
                                                className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" 
                                                checked={selectedIds.includes(s.id)} 
                                                onChange={() => handleSelectOne(s.id)} 
                                            />
                                        </td>
                                        <td className="p-2.5">
                                            <div className="h-9 w-16 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-0.5">
                                                <img 
                                                    src={`${API_BASE_URL}${s.imageUrl}`} 
                                                    className="max-h-full max-w-full object-contain" 
                                                    alt="Logo" 
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                                />
                                            </div>
                                        </td>
                                        <td className="p-2.5">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{s.label}</div>
                                            <div className="font-light text-[#00b4d8] text-[14px] leading-tight">{s.title}</div>
                                        </td>
                                        <td className="p-2.5 text-center">
                                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${s.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                {s.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-2.5 text-right pr-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openModal(s)} className="text-slate-300 hover:text-[#00d2d3] transition-colors p-1">
                                                    <Edit size={16} className="stroke-[1.5]" />
                                                </button>
                                                <button onClick={() => handleDelete(s.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                                    <Trash2 size={16} className="stroke-[1.5]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🧭 PAGINATION UI - Very Compact */}
                {!loading && sliders.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-2 border-t border-slate-50 bg-white">
                        <span className="text-[11px] font-medium text-slate-400">
                            {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sliders.length)} of {sliders.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1 border border-slate-100 text-slate-400 rounded hover:bg-slate-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <span className="text-[11px] font-bold text-slate-600 px-1">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-1 border border-slate-100 text-slate-400 rounded hover:bg-slate-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 🔥 POPUP / MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" onClick={closeModal}></div>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] relative z-10 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                            <h2 className="text-[18px] font-semibold text-slate-800">{editingSlider ? 'Edit Logo' : 'Add New Logo'}</h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleSubmit} id="sliderForm" className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[12px] text-slate-500">Logo Slider Type</label>
                                    <select
                                        required
                                        className="w-full p-2 bg-white border border-slate-200 rounded text-sm outline-none transition-all"
                                        value={formData.componentType}
                                        onChange={e => setFormData({ ...formData, componentType: e.target.value })}
                                    >
                                        <option value="partner">Partner Logo Slider (Marquee)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[12px] text-slate-500">Label</label>
                                        <input type="text" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[12px] text-slate-500">Title</label>
                                        <input type="text" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] text-slate-500">Description</label>
                                    <textarea className="w-full p-2 border border-slate-200 rounded text-sm outline-none resize-none" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[12px] text-slate-500">Order</label>
                                        <input type="number" className="w-full p-2 border border-slate-200 rounded text-sm outline-none" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[12px] text-slate-500">Status</label>
                                        <select className="w-full p-2 border border-slate-200 rounded text-sm outline-none" value={formData.isActive ? 'true' : 'false'} onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] text-slate-500">Logo Image {editingSlider && <span className="text-[10px] text-slate-400 italic">(Keep blank for no change)</span>}</label>
                                    <input type="file" required={!editingSlider} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-[#00b4d8]/10 file:text-[#00b4d8] transition-all cursor-pointer" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 shrink-0">
                            <button type="button" onClick={closeModal} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded text-[13px] hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" form="sliderForm" disabled={submitting} className="px-4 py-2 bg-[#0e8bf1] text-white rounded text-[13px] hover:bg-[#0b73c9] transition-colors flex items-center gap-2">
                                {submitting ? <Loader2 className="animate-spin" size={14} /> : (editingSlider ? 'Update' : 'Save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}