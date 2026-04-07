"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Power, Briefcase, MapPin, Save, X } from 'lucide-react';
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
    const handleToggle = async (id: number) => {
        try {
            await toggleJobStatusAction(id);
            fetchOpenings();
        } catch (err: any) {
            alert("Status change failed!");
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

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Job Listings Admin</h1>
                        <p className="text-slate-500 mt-1">Manage and track all current job openings on your website.</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center transition-all active:scale-95"
                    >
                        <Plus className="mr-2 w-5 h-5" /> Add New Job
                    </button>
                </div>

                {/* Main Content Card */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-600 uppercase tracking-wider">Position & Dept</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right font-semibold text-slate-600 uppercase tracking-wider">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {openings.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No job openings found.</td></tr>
                                ) : (
                                    openings.map((job: any) => (
                                        <tr key={job.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{job.title}</div>
                                                <div className="flex items-center text-slate-500 text-xs mt-0.5">
                                                    <Briefcase className="w-3 h-3 mr-1" /> {job.department}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700 font-medium">{job.experience}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold">
                                                <span className={`px-2.5 py-1 rounded-full ${job.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    {job.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-1">
                                                <button onClick={() => handleToggle(job.id)} title="Switch Status" className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"><Power className="w-5 h-5" /></button>
                                                <button onClick={() => openEditModal(job)} title="Edit Details" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(job.id)} title="Delete Job" className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Form Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-extrabold text-slate-800">{currentJob ? 'Update Job Posting' : 'Post New Job'}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                                </div>

                                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Job Public Title</label>
                                        <input type="text" required placeholder="e.g. Senior Frontend Engineer" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Department</label>
                                        <input type="text" required placeholder="e.g. Technology" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Experience Required</label>
                                        <input type="text" required placeholder="e.g. 3-5 Years" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Work Location</label>
                                        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Category / Type</label>
                                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                                            <option>Full Time</option>
                                            <option>Part Time</option>
                                            <option>Contract</option>
                                            <option>Remote</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Short Description / Summary</label>
                                        <textarea required rows={3} placeholder="Tell applicants what this role is about..." value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"></textarea>
                                    </div>

                                    <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-all">Discard</button>
                                        <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
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
