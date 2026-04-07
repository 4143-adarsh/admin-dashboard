"use client";
import React, { useState, useEffect } from 'react';
import { Users, Eye, Trash2, Download, FileText, Loader2, CheckSquare } from 'lucide-react';
import {
    getAdminApplicationsAction,
    deleteApplicationAction,
    deleteMultipleApplicationsAction
} from '@/actions/openingActions';

// Base URL for constructing resume links (if they are stored locally)
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:5000";
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

export default function AdminApplications() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any>(null); // For Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Bulk Delete State
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        const result = await getAdminApplicationsAction();
        if (result.success) {
            setApplications(result.data);
        }
        setLoading(false);
        setSelectedIds([]); // Reset selection on fresh fetch
    };

    // View Single Application details
    const handleView = (app: any) => {
        setSelectedApp(app);
        setIsModalOpen(true);
    };

    // Single Delete
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this application?")) {
            const result = await deleteApplicationAction(id);
            if (result.success) {
                fetchApplications();
                if (isModalOpen && selectedApp?.id === id) setIsModalOpen(false);
            } else {
                alert(result.message || "Failed to delete.");
            }
        }
    };

    // Checkbox toggles
    const handleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === applications.length) {
            setSelectedIds([]); // Deselect all
        } else {
            setSelectedIds(applications.map(app => app.id)); // Select all
        }
    };

    // Bulk Delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} applications?`)) {
            setIsDeletingBulk(true);
            const result = await deleteMultipleApplicationsAction(selectedIds);
            if (result.success) {
                fetchApplications();
            } else {
                alert(result.message || "Bulk delete failed.");
            }
            setIsDeletingBulk(false);
        }
    };

    // Format Date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                        <Users className="text-brandOrange" size={28} /> Job Applications
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Review candidates who applied from the career page.</p>
                </div>

                {/* Bulk Action Button - Only visible when items are selected */}
                {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        disabled={isDeletingBulk}
                        className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-colors border border-red-200"
                    >
                        {isDeletingBulk ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            {/* TABLE */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-brandOrange" size={40} />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === applications.length && applications.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded text-brandOrange focus:ring-brandOrange/20 cursor-pointer"
                                    />
                                </th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Applied Role</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(app.id)}
                                            onChange={() => handleSelectOne(app.id)}
                                            className="w-4 h-4 rounded text-brandOrange focus:ring-brandOrange/20 cursor-pointer"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 text-[15px]">{app.fullName}</p>
                                        <p className="text-[12px] text-slate-500 font-medium mt-1">{app.email}</p>
                                        <p className="text-[11px] text-slate-400 font-bold tracking-wider mt-0.5">{app.phone}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-orange-50 text-brandOrange text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
                                            {app.appliedFor}
                                        </span>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1">
                                            {app.department}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-[13px] font-medium text-slate-600">{formatDate(app.createdAt)}</p>
                                    </td>
                                    <td className="p-4 flex items-center justify-end gap-2">
                                        <button onClick={() => handleView(app)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="View Full Details">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(app.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <FileText size={40} className="text-slate-300" />
                                            <p className="text-slate-500 font-medium">No applications received yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FULL DETAILS MODAL */}
            {isModalOpen && selectedApp && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                Candidate Details
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">✕</button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Full Name</p>
                                    <p className="text-base font-bold text-slate-800">{selectedApp.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Applied For</p>
                                    <span className="bg-orange-50 text-brandOrange text-xs font-bold px-3 py-1 rounded-full border border-orange-100 inline-block">
                                        {selectedApp.appliedFor}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Address</p>
                                    <p className="text-sm font-medium text-slate-700">{selectedApp.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Phone Number</p>
                                    <p className="text-sm font-medium text-slate-700">{selectedApp.phone}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Department</p>
                                    <p className="text-sm font-medium text-slate-700">{selectedApp.department}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Applied On</p>
                                    <p className="text-sm font-medium text-slate-700">{formatDate(selectedApp.createdAt)}</p>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 flex items-center justify-center rounded-xl">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">Candidate Resume</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Uploaded PDF Document</p>
                                    </div>
                                </div>
                                {/* Make sure to construct the proper URL for the resume based on how backend serves static files */}
                                <a
                                    href={`${getBaseUrl()}/${selectedApp.resumePath?.replace(/\\/g, '/')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-brandOrange transition-colors"
                                >
                                    <Download size={14} /> View / Download
                                </a>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => handleDelete(selectedApp.id)} className="px-5 py-2.5 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                                <Trash2 size={16} /> Delete Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}