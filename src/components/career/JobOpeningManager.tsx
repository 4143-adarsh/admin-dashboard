"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Briefcase, MapPin, X, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import {
    getAdminJobOpeningsAction,
    createJobOpeningAction,
    updateJobOpeningAction,
    deleteJobOpeningAction,
    toggleJobStatusAction
} from '@/actions/openingActions';

const JobOpeningManager = () => {
    const [openings, setOpenings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        experience: '',
        summary: '',
        location: 'Hyderabad',
        type: 'Full Time',
        isActive: true,
        sortOrder: 0
    });

    useEffect(() => {
        fetchOpenings();
    }, []);

    // 1. Fetch Openings
    const fetchOpenings = async () => {
        try {
            setLoading(true);
            const res = await getAdminJobOpeningsAction(); // Calls Server Action
            if (res.success) setOpenings(res.data);
        } catch (err: any) {
            console.error("Fetch Error:", err);
            alert("Openings load nahi ho saki: " + (err.error || "Server issue"));
        } finally {
            setLoading(false);
        }
    };

    // 2. Save (Create or Update)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let res;
            if (currentJob) {
                // Update call
                res = await updateJobOpeningAction(currentJob.id, formData);
            } else {
                // Create call
                res = await createJobOpeningAction(formData);
            }

            if (res && res.success) {
                setIsModalOpen(false);
                fetchOpenings();
                resetForm();
            } else {
                alert("Error: " + (res?.message || res?.error || "Failed to save job opening."));
            }
        } catch (err: any) {
            alert("Exception saving job: " + (err.message || typeof err === 'string' ? err : "Unknown Error"));
        }
    };

    // 3. Delete
    const handleDelete = async (id: number) => {
        if (window.confirm("Kya aap sach me ye job listing delete karna chahte hain?")) {
            try {
                await deleteJobOpeningAction(id);
                fetchOpenings();
            } catch (err: any) {
                alert("Delete failed!");
            }
        }
    };

    // 4. Toggle Status (Active/Inactive)
    const handleStatusChange = async (id: number, newStatus: string) => {
        const jobToUpdate = openings.find(job => job.id === id);
        if (!jobToUpdate) return;

        const isCurrentlyActive = jobToUpdate.isActive;
        const newIsActive = newStatus === 'ACTIVE';

        if (isCurrentlyActive !== newIsActive) {
            try {
                await toggleJobStatusAction(id);
                fetchOpenings();
            } catch (err: any) {
                alert("Status change failed!");
            }
        }
    };

    const openEditModal = (job: any) => {
        setCurrentJob(job);
        setFormData({ ...job });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentJob(null);
        setFormData({
            title: '', department: '', experience: '', summary: '',
            location: 'Hyderabad', type: 'Full Time', isActive: true, sortOrder: 0
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "04/04/2026";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-[1400px] mx-auto">
                {/* Header matching screenshot */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
                    <div>
                        <h1 className="text-3xl font-light text-[#00b4d8] mb-1">Job Openings</h1>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                            <span>APP</span>
                            <span className="text-slate-300">&gt;</span>
                            <span>CAREER</span>
                            <span className="text-slate-300">&gt;</span>
                            <span className="text-slate-800">OPENINGS</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="bg-white border border-slate-200 rounded-md px-4 py-2 flex items-center shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#00b4d8] mr-2"></span>
                            <span className="text-sm text-slate-600 font-medium">Total Openings: <span className="font-bold text-slate-800 ml-1">{openings.length}</span></span>
                        </div>
                        <button
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="bg-[#00b4d8] hover:bg-[#0096b4] text-white font-medium px-4 py-2 rounded-md shadow-sm transition-colors text-sm"
                        >
                            Post New Job
                        </button>
                    </div>
                </div>

                {/* Main Table Content */}
                <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-slate-100 text-[13px] text-[#00b4d8] font-medium bg-white">
                                    <th className="p-4 pl-6 cursor-pointer">
                                        Job Title <span className="inline-block ml-1 opacity-60">⇅</span>
                                    </th>
                                    <th className="p-4">Department / Location</th>
                                    <th className="p-4">Status / Date</th>
                                    <th className="p-4 text-center">Experience</th>
                                    <th className="p-4 pr-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-400">
                                            <div className="flex justify-center mb-2">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b4d8]"></div>
                                            </div>
                                            Loading openings...
                                        </td>
                                    </tr>
                                ) : openings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                                            No job openings found.
                                        </td>
                                    </tr>
                                ) : (
                                    openings.map((job: any) => (
                                        <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                                            {/* Column 1: Title & Type */}
                                            <td className="p-4 pl-6">
                                                <div className="text-[#00b4d8] text-[15px] font-medium">
                                                    {job.title}
                                                </div>
                                                <div className="flex items-center text-slate-400 text-[12px] mt-1 gap-4">
                                                    <span className="flex items-center">
                                                        <Briefcase className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                                        {job.type}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Column 2: Dept & Location */}
                                            <td className="p-4">
                                                <div className="text-slate-800 text-[14px] font-medium">{job.department}</div>
                                                <div className="flex items-center text-slate-400 text-[12px] mt-1">
                                                    <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                                    {job.location}
                                                </div>
                                            </td>

                                            {/* Column 3: Status & Date */}
                                            <td className="p-4">
                                                <div className="relative inline-block w-[110px]">
                                                    <select
                                                        value={job.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                                                        className={`appearance-none w-full outline-none border cursor-pointer pl-2 pr-6 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                                                            ${job.isActive ? 'bg-white text-amber-500 border-amber-300' : 'bg-white text-slate-400 border-slate-300'}
                                                        `}
                                                    >
                                                        <option value="ACTIVE" className="text-amber-500 font-bold">ACTIVE</option>
                                                        <option value="INACTIVE" className="text-slate-500 font-bold">INACTIVE</option>
                                                    </select>
                                                    <ChevronDown size={12} className={`absolute right-1.5 top-1/2 -translate-y-1/2 opacity-60 ${job.isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                                                </div>
                                                <div className="flex items-center text-slate-400 text-[11px] mt-1">
                                                    <span className="border border-slate-300 rounded-[2px] w-3 h-3 flex items-center justify-center mr-1 text-[8px] leading-none pb-[1px] opacity-70">
                                                        📅
                                                    </span>
                                                    {formatDate(job.createdAt)}
                                                </div>
                                            </td>

                                            {/* Column 4: Experience */}
                                            <td className="p-4 text-center">
                                                <span className="text-[#00b4d8] text-[13px] font-medium px-3 py-1 bg-cyan-50 border border-cyan-100 rounded-md">
                                                    {job.experience}
                                                </span>
                                            </td>

                                            {/* Column 5: Actions (Edit & Delete updated) */}
                                            <td className="p-4 pr-6 text-right align-middle">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(job)}
                                                        title="Edit Job"
                                                        className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 transition-colors p-2 rounded-md"
                                                    >
                                                        <Edit size={16} className="stroke-[2.5]" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(job.id)}
                                                        title="Delete Job"
                                                        className="text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-800 transition-colors p-2 rounded-md"
                                                    >
                                                        <Trash2 size={16} className="stroke-[2.5]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Modal (Unchanged Logic) */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl animate-in fade-in zoom-in duration-200">
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-light text-[#00b4d8]">{currentJob ? 'Update Job Posting' : 'Post New Job'}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 p-1.5 rounded-full text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                                </div>

                                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                        <input type="text" required placeholder="e.g. Senior Frontend Engineer" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00b4d8] transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                        <input type="text" required placeholder="e.g. Technology" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00b4d8] transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Experience Required</label>
                                        <input type="text" required placeholder="e.g. 3-5 Years" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00b4d8] transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Work Location</label>
                                        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00b4d8] transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Category / Type</label>
                                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00b4d8] transition-all">
                                            <option>Full Time</option>
                                            <option>Part Time</option>
                                            <option>Contract</option>
                                            <option>Remote</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Short Description / Summary</label>
                                        <textarea required rows={3} placeholder="Tell applicants what this role is about..." value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00b4d8] transition-all"></textarea>
                                    </div>

                                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm text-slate-500 font-medium hover:bg-slate-100 rounded-md transition-all border border-transparent">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-[#00b4d8] text-white text-sm font-medium rounded-md hover:bg-[#0096b4] transition-all shadow-sm">
                                            {currentJob ? 'Update Listing' : 'Publish Job'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobOpeningManager;