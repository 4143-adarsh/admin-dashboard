"use client";

import React, { useState, useEffect } from 'react';
import { 
    Search, Plus, Loader2, BookOpen, Trash2, 
    Edit, X, Save, ArrowUpDown, CheckCircle2, AlertCircle,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { getAdminArticlesAction, deleteArticleAction, createArticleAction, updateArticleAction } from '@/actions/knowledgebaseActions';

export default function AdminKnowledgebasePage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', content: '', category: 'General', isActive: true });

    // 🔥 Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // 🔥 CUSTOM TOAST STATE
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const fetchArticles = async () => {
        setLoading(true);
        const res = await getAdminArticlesAction();
        if (res?.success) setArticles(res.data || []);
        setLoading(false);
    };

    useEffect(() => { fetchArticles(); }, []);

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this article?")) {
            await deleteArticleAction(id);
            fetchArticles();
            showToast("Article deleted successfully!", "success");
        }
    };

    const handleEdit = (article: any) => {
        setEditingId(article.id);
        setFormData({ title: article.title, content: article.content, category: article.category, isActive: article.isActive });
        setIsModalOpen(true);
    };

    const handleOpenNew = () => {
        setEditingId(null);
        setFormData({ title: '', content: '', category: 'General', isActive: true });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (editingId) {
                await updateArticleAction(editingId, formData);
                showToast("Article updated successfully!", "success");
            } else {
                await createArticleAction(formData);
                showToast("Article published successfully!", "success");
            }
        } catch (error) {
            showToast("Something went wrong!", "error");
        }

        setIsSaving(false);
        setIsModalOpen(false);
        fetchArticles(); 
    };

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 🔥 Pagination Calculation Logic
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-2 md:p-6 max-w-[1400px] mx-auto space-y-4 md:space-y-6 bg-slate-50 min-h-screen font-sans relative w-full overflow-hidden">
            
            {/* 🔥 TOAST UI - Responsive Position */}
            {toast.show && (
                <div className={`fixed top-4 right-4 md:top-6 md:right-6 z-[999999] px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 duration-300 ${toast.type === 'success' ? 'bg-white border-l-4 border-[#3ed4b2] text-slate-800' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="text-[#3ed4b2]" size={18} /> : <AlertCircle size={18} />}
                    <span className="font-semibold text-xs md:text-sm tracking-wide">{toast.message}</span>
                </div>
            )}

            {/* 🔝 HEADER SECTION - Fully Responsive */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
                <div className="w-full">
                    <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
                        Knowledgebase
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                        <span>APP</span>
                        <span className="text-slate-300">&gt;</span>
                        <span>SUPPORT</span>
                        <span className="text-slate-300">&gt;</span>
                        <span className="text-slate-800">ARTICLES</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center bg-white px-3 py-2 rounded-md border border-slate-200 flex-grow md:w-64 shadow-sm h-9 md:h-10">
                        <Search className="text-slate-400 mr-2" size={16} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="bg-transparent border-none outline-none text-xs md:text-sm w-full text-slate-600 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    
                    <button 
                        onClick={handleOpenNew}
                        className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white p-2 rounded-full shadow-md transition-transform hover:scale-105 h-9 w-9 md:h-10 md:w-10 flex items-center justify-center shrink-0"
                        title="Add New Article"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* 📊 DATA TABLE - Responsive Container */}
            <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] md:text-[13px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                                <th className="p-3 md:p-4 w-10">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                                </th>
                                <th className="p-3 md:p-4 font-medium cursor-pointer">
                                    Title <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                </th>
                                <th className="p-3 md:p-4 font-medium text-center">Category</th>
                                <th className="p-3 md:p-4 font-medium text-center">Status</th>
                                <th className="p-3 md:p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Loader2 className="animate-spin mb-4 text-[#00b4d8]" size={32} />
                                            <p className="text-xs md:text-sm font-medium">Loading articles...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <BookOpen size={48} className="text-slate-200 mb-4 stroke-[1.5]" />
                                            <p className="text-sm font-medium text-slate-600">No Articles Found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group text-xs md:text-sm">
                                        <td className="p-3 md:p-4">
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                                        </td>
                                        <td className="p-3 md:p-4">
                                            <p className="font-light text-[#00b4d8] truncate max-w-[150px] md:max-w-md" title={article.title}>
                                                {article.title}
                                            </p>
                                        </td>
                                        <td className="p-3 md:p-4 text-center">
                                            <span className="text-[10px] md:text-[13px] font-medium text-slate-600 px-2 py-1 bg-slate-100 rounded-md">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="p-3 md:p-4 text-center">
                                            <span className={`px-2 py-0.5 md:py-1 text-[9px] md:text-[11px] font-semibold uppercase tracking-wider rounded border ${article.isActive ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                {article.isActive ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-3 md:p-4 text-right">
                                            <div className="flex items-center justify-end gap-1 md:gap-3">
                                                <button onClick={() => handleEdit(article)} className="text-slate-400 hover:text-[#00d2d3] p-1.5 transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(article.id)} className="text-slate-400 hover:text-red-500 p-1.5 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🧭 PAGINATION UI - Responsive Stack */}
                {!loading && filteredArticles.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-slate-100 bg-white gap-3">
                        <span className="text-[11px] md:text-[13px] font-medium text-slate-500">
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredArticles.length)} of {filteredArticles.length}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1 border border-slate-200 text-slate-400 rounded-md hover:bg-slate-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs md:text-[13px] font-semibold text-slate-600 px-3">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-1 border border-slate-200 text-slate-400 rounded-md hover:bg-slate-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 🔥 ADD/EDIT MODAL OVERLAY - Mobile Optimized */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 transition-opacity duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[95vh] relative z-10 animate-in zoom-in-95 duration-200">
                        <div className="px-5 md:px-8 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 rounded-t-xl">
                            <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">{editingId ? 'Edit Article' : 'New Article'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={22} /></button>
                        </div>
                        <div className="p-5 md:p-8 overflow-y-auto">
                            <form onSubmit={handleSubmit} id="articleForm" className="space-y-4 md:space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] md:text-[13px] text-slate-500 font-medium">Article Title *</label>
                                    <input type="text" required className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] text-slate-500 font-medium">Category</label>
                                        <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] outline-none appearance-none cursor-pointer"
                                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="General Support">General Support</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Billing">Billing</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] text-slate-500 font-medium">Status</label>
                                        <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] outline-none appearance-none cursor-pointer"
                                            value={formData.isActive ? "true" : "false"} onChange={e => setFormData({ ...formData, isActive: e.target.value === "true" })}>
                                            <option value="true">Live (Published)</option>
                                            <option value="false">Draft (Hidden)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] md:text-[13px] text-slate-500 font-medium">Content Body *</label>
                                    <textarea rows={6} md-rows={8} required className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-[14px] text-slate-700 font-light focus:border-[#00b4d8] outline-none transition-all resize-none leading-relaxed"
                                        value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="px-5 md:px-8 py-4 md:py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg text-xs md:text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" form="articleForm" disabled={isSaving} className="px-5 py-2 bg-[#0e8bf1] text-white rounded-lg text-xs md:text-sm font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2">
                                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                {editingId ? 'Update' : 'Publish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}