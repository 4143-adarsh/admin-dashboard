'use client';

import React, { useState } from 'react';
// 🔥 NAYA: updateCareerStatusAction ko import kiya gaya hai
import { deleteCareerAction, updateCareerStatusAction } from "@/actions/career";
import { 
    Trash2, Mail, Phone, Briefcase, FileText, 
    CalendarClock, ChevronDown, ArrowUpDown,
    ChevronLeft, ChevronRight 
} from 'lucide-react'; 

export default function Openings({ applications }: any) {
    // Loading states
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    // 🔥 Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleDelete = async (id: number) => {
        if (window.confirm("Bhai, kya aap sach mein is application ko delete karna chahte hain?")) {
            setDeletingId(id);
            const res = await deleteCareerAction(id);

            if (!res.success) {
                alert("Kuch gadbad ho gayi, delete nahi hua!");
            }
            setDeletingId(null);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        setUpdatingId(id);
        const res = await updateCareerStatusAction(id, { status: newStatus });

        if (!res.success) {
            alert(res.error || "Status update nahi ho paya!");
        }
        setUpdatingId(null);
    };

    const resumeUrl = (path: string) => {
        if (!path) return '#';
        const formattedPath = path.startsWith('/') ? path : `/${path}`;
        return `https://nighwan-tech-webbackend.onrender.com${formattedPath}`;
    };

    // 🔥 Pagination Calculation
    const totalPages = Math.ceil((applications?.length || 0) / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApplications = applications?.slice(indexOfFirstItem, indexOfLastItem);

    return (
        // 🔥 Container updated to match tighter spacing
        <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden font-sans">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-slate-100 text-[13px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                            <th className="p-4 font-medium cursor-pointer">
                                Candidate Info <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                            </th>
                            <th className="p-4 font-medium cursor-pointer">
                                Role / Dept
                            </th>
                            <th className="p-4 font-medium cursor-pointer">
                                Status / Date
                            </th>
                            <th className="p-4 font-medium text-center">Documents</th>
                            <th className="p-4 font-medium text-right pr-6">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50">
                        {(!applications || applications.length === 0) ? (
                            <tr>
                                <td colSpan={5} className="p-16 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Briefcase size={48} className="text-slate-200 mb-4 stroke-[1.5]" />
                                        <p className="text-base font-medium text-slate-600">No Applications Yet</p>
                                        <p className="text-sm mt-1">Nayi job openings ka intezaar karein.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentApplications?.map((app: any) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">

                                    {/* 1. Candidate Info */}
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-light text-[#00b4d8] text-[15px] mb-0.5">{app.fullName}</span>
                                            <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Mail size={12} className="opacity-70" /> {app.email}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Phone size={12} className="opacity-70" /> {app.phone || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* 2. Role & Department */}
                                    <td className="p-4">
                                        <div className="flex flex-col items-start">
                                            <span className="text-[14px] font-medium text-slate-700 mb-0.5">
                                                {app.appliedFor}
                                            </span>
                                            <span className="text-[12px] text-slate-400 flex items-center gap-1.5">
                                                <Briefcase size={12} className="opacity-60" /> {app.department || 'General'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* 3. Status & Date */}
                                    <td className="p-4">
                                        <div className="flex flex-col items-start gap-1.5">
                                            <div className="relative group/dropdown">
                                                <select
                                                    value={app.status || 'Pending'}
                                                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                    disabled={updatingId === app.id}
                                                    className={`appearance-none outline-none border cursor-pointer pl-2 pr-6 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                                                        ${app.status === 'Shortlisted' ? 'bg-green-50 text-green-600 border-green-200' :
                                                        app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                                        'bg-amber-50 text-amber-600 border-amber-200'}
                                                        ${updatingId === app.id ? 'opacity-50 cursor-wait' : ''}
                                                    `}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shortlisted">Shortlisted</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                                                    {updatingId === app.id ? (
                                                        <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <ChevronDown size={12} className="text-current opacity-60" />
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-1">
                                                <CalendarClock size={11} className="opacity-70" />
                                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* 4. Resume Link */}
                                    <td className="p-4 text-center">
                                        <a
                                            href={resumeUrl(app.resumePath)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-sky-50 text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white border border-sky-100 rounded text-[11px] font-semibold transition-colors duration-300"
                                        >
                                            <FileText size={14} /> Resume
                                        </a>
                                    </td>

                                    {/* 5. Delete Action */}
                                    <td className="p-4 text-right pr-6">
                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            disabled={deletingId === app.id}
                                            className={`p-2 rounded-lg transition-colors duration-300 ${deletingId === app.id
                                                ? 'text-slate-300 cursor-not-allowed'
                                                : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                        >
                                            {deletingId === app.id ? (
                                                <span className="h-4 w-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin block" />
                                            ) : (
                                                <Trash2 size={16} className="stroke-[1.5]" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 🧭 PAGINATION UI (Strictly UI-only, logic based on currentApplications) */}
            {(!applications || applications.length > 0) && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-slate-50 bg-white">
                    <span className="text-[12px] font-medium text-slate-400">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, applications?.length || 0)} of {applications?.length || 0} entries
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1 border border-slate-100 text-slate-400 rounded hover:bg-slate-50 disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-[12px] font-bold text-slate-600 px-2">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-1 border border-slate-100 text-slate-400 rounded hover:bg-slate-50 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}