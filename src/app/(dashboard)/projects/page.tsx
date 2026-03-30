"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, X,
    Send, Loader2, Building, LayoutDashboard,
    Filter, ArrowUpDown, CheckCircle2, MoreHorizontal, Mail, Lock
} from 'lucide-react';

import {
    getProjectsAction,
    createProjectAction,
    updateProjectAction,
    deleteProjectAction
} from '@/actions/projectActions';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal & Form State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // 🔥 NAYA: Validation errors store karne ke liye
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        projectId: '', clientEmail: '', title: '', description: '', status: 'Planning', progress: 0, dueDate: ''
    });

    // 🚀 Fetch Projects
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const result = await getProjectsAction();
            if (result.success) setProjects(result.data);
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    // 🔍 Filter Logic
    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 📝 Open Drawer for Create or Edit
    const openDrawer = (project: any = null) => {
        setErrors({}); // Modal khulte hi purane errors saaf
        if (project) {
            setFormData(project);
            setEditMode(true);
        } else {
            setFormData({ projectId: '', clientEmail: '', title: '', description: '', status: 'Planning', progress: 0, dueDate: '' });
            setEditMode(false);
        }
        setIsDrawerOpen(true);
    };

    // 🔥 NAYA: Smart Input Change Handler (Auto Formatting)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        // 1. Project ID: Sirf Digits & Letters, Auto Capital
        if (name === 'projectId') {
            newValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        } 
        // 2. Project Title: Har word ka first letter Capital
        else if (name === 'title') {
            newValue = value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        } 
        // 3. Scope/Description: Sentence ka sirf pehla letter Capital
        else if (name === 'description') {
            if (value.length > 0) {
                newValue = value.charAt(0).toUpperCase() + value.slice(1);
            }
        }

        setFormData({ ...formData, [name]: newValue });

        // Error hatana jab user type kare
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // 💾 Save or Update Project via Server Action
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 🔥 NAYA: Validations Logic before save
        const newErrors: Record<string, string> = {};

        if (!formData.projectId.trim()) newErrors.projectId = "Project ID is required";
        if (!formData.title.trim()) newErrors.title = "Project Title is required";
        
        // Email @ validation
        if (!formData.clientEmail.trim() || !formData.clientEmail.includes('@')) {
            newErrors.clientEmail = "Valid email with @ is required";
        }
        
        if (!formData.dueDate) newErrors.dueDate = "Due Date is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            let result;
            if (editMode) {
                result = await updateProjectAction(formData.projectId, formData);
            } else {
                result = await createProjectAction(formData);
            }

            if (result.success) {
                alert(editMode ? "✅ Project Updated Successfully!" : "🎉 Project Created Successfully!");
                setIsDrawerOpen(false);
                fetchProjects();
            } else {
                alert("❌ Error: " + result.message);
            }
        } catch (error) {
            alert("❌ Server Connection Error");
        } finally {
            setIsSaving(false);
        }
    };

    // 🗑️ Delete Project
    const handleDelete = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            const result = await deleteProjectAction(projectId);
            if (result.success) {
                fetchProjects();
            } else {
                alert("❌ Delete Error: " + result.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 🎨 Helper: Status Colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Review': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    // 🔥 Helper: Input styling with Error state
    const getInputClass = (fieldName: string, isReadOnly: boolean = false) => {
        const baseClass = "w-full p-2.5 border rounded-lg text-[13px] md:text-sm text-slate-700 outline-none transition-all";
        const errorClass = errors[fieldName] ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8]";
        const readOnlyClass = isReadOnly ? "bg-slate-50 cursor-not-allowed text-slate-500 border-slate-200" : "bg-white";
        
        return isReadOnly ? `${baseClass} ${readOnlyClass}` : `${baseClass} ${errorClass}`;
    };

    return (
        <div className="p-3 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 md:space-y-6 bg-slate-50 min-h-screen font-sans w-full overflow-x-hidden">
            
            {/* 🔝 HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 pb-2">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">Projects</h1>
                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                        <span>APP</span> <span className="text-slate-300">&gt;</span> <span>CLIENTS</span> <span className="text-slate-300">&gt;</span> <span className="text-slate-800">PROJECTS</span>
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-64">
                        <Search className="text-slate-400 mr-2 shrink-0" size={16} />
                        <input 
                            type="text" placeholder="Search projects..." 
                            className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10">
                        <Filter size={18} />
                    </button>
                    <button 
                        onClick={() => openDrawer()}
                        className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white p-2.5 rounded-full shadow-md shadow-red-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
                        title="Add New Project"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* 📊 Stats Bar */}
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-medium text-slate-500 bg-white p-3 md:p-4 rounded-md border border-slate-200 shadow-sm w-full overflow-x-auto custom-scrollbar whitespace-nowrap">
                <div className="flex items-center gap-2"><div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#00b4d8]"></div> Total Projects: <span className="text-slate-800 font-bold">{projects.length}</span></div>
                <div className="flex items-center gap-2"><div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-amber-400"></div> Active: <span className="text-slate-800 font-bold">{projects.filter(p => p.status !== 'Completed').length}</span></div>
                <div className="flex items-center gap-2"><div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#3ed4b2]"></div> Completed: <span className="text-slate-800 font-bold">{projects.filter(p => p.status === 'Completed').length}</span></div>
            </div>

            {/* 📋 Premium Data Table */}
            <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-[300px] md:h-[400px] text-slate-400">
                        <Loader2 className="animate-spin mb-4 text-[#00b4d8]" size={32} />
                        <p className="text-sm font-medium">Fetching projects...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] text-slate-500">
                       <Building className="w-10 h-10 md:w-12 md:h-12 text-slate-300 mb-3 md:mb-4" />
                        <p className="text-sm md:text-base font-medium text-slate-600">No projects found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-100 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                                    <th className="p-3 md:p-4 w-10 text-center"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" /></th>
                                    <th className="p-3 md:p-4 font-medium">Project Info <ArrowUpDown size={12} className="inline ml-1 opacity-60" /></th>
                                    <th className="p-3 md:p-4 font-medium">Client <ArrowUpDown size={12} className="inline ml-1 opacity-60" /></th>
                                    <th className="p-3 md:p-4 font-medium w-32 md:w-64">Progress <ArrowUpDown size={12} className="inline ml-1 opacity-60" /></th>
                                    <th className="p-3 md:p-4 font-medium text-center">Status <ArrowUpDown size={12} className="inline ml-1 opacity-60" /></th>
                                    <th className="p-3 md:p-4 font-medium text-right pr-4 md:pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredProjects.map((project) => (
                                    <tr key={project.projectId} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-3 md:p-4 text-center"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" /></td>
                                        <td className="p-3 md:p-4">
                                            <div className="font-medium text-[#00b4d8] text-[13px] md:text-[14px] mb-0.5">{project.title}</div>
                                            <div className="text-[11px] md:text-[12px] text-slate-400">ID: {project.projectId}</div>
                                        </td>
                                        <td className="p-3 md:p-4">
                                            <div className="text-[13px] md:text-[14px] font-medium text-slate-600 mb-0.5">{project.clientEmail}</div>
                                            <div className="text-[11px] md:text-[12px] text-slate-400">Due: {new Date(project.dueDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-3 md:p-4 w-32 md:w-64">
                                            <div className="flex justify-between text-[11px] md:text-[12px] font-medium mb-1 md:mb-1.5">
                                                <span className="text-slate-500">Completion</span>
                                                <span className="text-[#00b4d8]">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-[#3ed4b2]' : 'bg-[#00b4d8]'}`} style={{ width: `${project.progress}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="p-3 md:p-4 text-center">
                                            <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-wider rounded border ${getStatusColor(project.status)}`}>{project.status}</span>
                                        </td>
                                        <td className="p-3 md:p-4 pr-4 md:pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5 md:gap-3 text-slate-400">
                                                <button onClick={() => handleDelete(project.projectId)} className="hover:text-red-500 p-1" title="Delete Project"><Trash2 size={16} strokeWidth={1.5} /></button>
                                                <button onClick={() => openDrawer(project)} className="hover:text-[#00d2d3] p-1" title="Edit Project"><Edit2 size={16} strokeWidth={1.5} /></button>
                                                <button className="hover:text-slate-600 p-1 hidden sm:block"><MoreHorizontal size={16} strokeWidth={1.5} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 📝 POPUP / MODAL SECTION */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 overflow-hidden">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                        
                        <div className="flex justify-between items-center px-5 md:px-8 py-4 border-b border-slate-100 shrink-0 bg-white rounded-t-xl">
                            <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">{editMode ? 'Edit Project' : 'Add New Project'}</h2>
                            <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full"><X size={18} /></button>
                        </div>

                        <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                            <form id="project-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                
                                {/* Group 1: Basic Info */}
                                <div className="space-y-4 md:space-y-6">
                                    <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2">Basic Info</h3>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Project ID (Auto-Caps) <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" name="projectId" required readOnly={editMode} 
                                            className={getInputClass('projectId', editMode)} 
                                            placeholder="e.g. PROJ001"
                                            value={formData.projectId} onChange={handleChange} 
                                        />
                                        {errors.projectId && <span className="text-[10px] text-red-500 block">{errors.projectId}</span>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Project Title <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" name="title" required 
                                            placeholder="e.g. Website Redesign" 
                                            className={getInputClass('title')} 
                                            value={formData.title} onChange={handleChange} 
                                        />
                                        {errors.title && <span className="text-[10px] text-red-500 block">{errors.title}</span>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Scope / Description</label>
                                        <textarea 
                                            name="description" rows={4} 
                                            placeholder="Brief project details..." 
                                            className={getInputClass('description') + " resize-none"} 
                                            value={formData.description} onChange={handleChange} 
                                        />
                                    </div>
                                </div>

                                {/* Group 2: Project Details */}
                                <div className="space-y-4 md:space-y-6">
                                    <h3 className="text-[#3ed4b2] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2 mt-2 md:mt-0">Project Details</h3>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Client Email <span className="text-red-500">*</span></label>
                                        <input 
                                            type="email" name="clientEmail" required 
                                            placeholder="client@example.com" 
                                            className={getInputClass('clientEmail')} 
                                            value={formData.clientEmail} onChange={handleChange} 
                                        />
                                        {errors.clientEmail && <span className="text-[10px] text-red-500 block">{errors.clientEmail}</span>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Due Date <span className="text-red-500">*</span></label>
                                        <input 
                                            type="date" name="dueDate" required 
                                            className={getInputClass('dueDate') + " cursor-text"} 
                                            value={formData.dueDate} onChange={handleChange} 
                                        />
                                        {errors.dueDate && <span className="text-[10px] text-red-500 block">{errors.dueDate}</span>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Project Status</label>
                                        <select name="status" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-[13px] md:text-sm text-slate-700 focus:border-[#00b4d8] outline-none appearance-none cursor-pointer" 
                                            value={formData.status} onChange={handleChange}>
                                            <option value="Planning">Planning</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Review">Review</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Progress Tracker</label>
                                            <span className="text-[12px] md:text-[13px] font-bold text-[#00b4d8]">{formData.progress}%</span>
                                        </div>
                                        <input type="range" name="progress" min="0" max="100" className="w-full accent-[#00b4d8] cursor-pointer" 
                                            value={formData.progress} onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})} />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-5 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                            <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-5 md:px-6 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="project-form" disabled={isSaving} className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm">
                                {isSaving ? <Loader2 className="animate-spin" size={16} /> : (editMode ? 'Update Project' : 'Submit Project')}
                            </button>
                        </div>

                    </div>
                </div>
            )}
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
}