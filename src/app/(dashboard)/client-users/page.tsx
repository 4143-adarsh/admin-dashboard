"use client";

import React, { useState, useEffect } from 'react';
import { 
    Users, Plus, Building2, Mail, Lock, Loader2, 
    UserPlus, CheckCircle2, Phone, Edit, Trash2, ShieldAlert, Image as ImageIcon,
    Search, Filter, ArrowUpDown, Star, MoreHorizontal, X
} from 'lucide-react';
import { 
    getClientUsersAction, 
    createClientUserAction, 
    updateClientUserAction, 
    deleteClientUserAction, 
    getClientsDropdownAction 
} from '@/actions/clientUserActions';

export default function ClientUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form States
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const initialForm = { fullName: '', email: '', password: '', phone: '', avatar: '', clientId: '' };
    const [formData, setFormData] = useState(initialForm);

    // Initial Load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [usersRes, clientsRes] = await Promise.all([
            getClientUsersAction(),
            getClientsDropdownAction()
        ]);
        
        if (usersRes?.success) setUsers(usersRes.data);
        if (clientsRes?.success) setClients(clientsRes.data);
        setLoading(false);
    };

    // Handle Create & Update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        
        let res;
        if (isEditing && editId) {
            res = await updateClientUserAction(editId, formData);
        } else {
            res = await createClientUserAction(formData);
        }
        
        if (res?.success) {
            setSuccessMsg(isEditing ? 'User updated successfully!' : 'User created successfully!');
            fetchData(); 
            setTimeout(() => {
                setSuccessMsg('');
                closeForm();
            }, 2000);
        } else {
            alert(res?.message || "Something went wrong!");
        }
        setSubmitLoading(false);
    };

    // Handle Edit Button Click
    const openEditForm = (user: any) => {
        setFormData({
            fullName: user.fullName,
            email: user.email,
            password: '', 
            phone: user.phone || '',
            avatar: user.avatar || '', 
            clientId: user.clientId || ''
        });
        setEditId(user.id);
        setIsEditing(true);
        setShowForm(true);
    };

    // Handle Delete Button Click
    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to permanently delete ${name}?`)) {
            const res = await deleteClientUserAction(id);
            if (res?.success) {
                fetchData();
            } else {
                alert("Failed to delete user: " + res?.message);
            }
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        setFormData(initialForm);
        setSuccessMsg('');
    };

    const formatLastSeen = (dateString: string | null) => {
        if (!dateString) return "---";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        // 🔥 Responsive Container & Spacing
        <div className="p-3 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 bg-slate-50 min-h-screen font-sans overflow-x-hidden w-full">
            
            {/* 🔝 HEADER SECTION: Responsive Flex Layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
                        Users
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                        <span>APP</span>
                        <span className="text-slate-300">&gt;</span>
                        <span>CLIENTS</span>
                        <span className="text-slate-300">&gt;</span>
                        <span className="text-slate-800">USERS</span>
                    </div>
                </div>
                
                {/* Actions: Search & Add Button */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-64">
                        <Search className="text-slate-400 mr-2 shrink-0" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10">
                        <Filter size={18} />
                    </button>
                    <button 
                        onClick={() => setShowForm(true)}
                        className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white p-2.5 rounded-full shadow-md shadow-red-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
                        title="Add New User"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* 📝 POPUP / MODAL SECTION: Fully Responsive */}
            {showForm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 overflow-hidden">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-5 md:px-8 py-4 border-b border-slate-100 shrink-0 rounded-t-xl bg-white">
                            <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">
                                {isEditing ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button onClick={closeForm} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                            {successMsg && (
                                <div className="mb-6 p-3 md:p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle2 size={18} /> {successMsg}
                                </div>
                            )}

                            {/* Responsive Grid Form */}
                            <form onSubmit={handleSubmit} id="userForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                
                                {/* Basic Info */}
                                <div className="space-y-4 md:space-y-6">
                                    <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2">Basic Info</h3>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Full Name <span className="text-red-500">*</span></label>
                                        <input required type="text" placeholder="e.g. John Doe" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] outline-none transition-all" 
                                            value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Email Address <span className="text-red-500">*</span></label>
                                        <input required type="email" placeholder="john@example.com" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] outline-none transition-all" 
                                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Phone Number</label>
                                        <input type="text" placeholder="(415) 294-3375" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] outline-none transition-all" 
                                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="space-y-4 md:space-y-6">
                                    <h3 className="text-[#3ed4b2] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2">Account Details</h3>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Assign to Client Company <span className="text-red-500">*</span></label>
                                        <select required className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] outline-none appearance-none cursor-pointer"
                                            value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                                            <option value="" disabled>-- Select a company --</option>
                                            {clients?.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">
                                            {isEditing ? 'New Password (Leave blank to keep)' : 'Password *'}
                                        </label>
                                        <input required={!isEditing} type="text" placeholder="Set a secure password" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] outline-none transition-all" 
                                            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Avatar URL <span className="text-slate-400 italic font-normal text-[10px]">(Optional)</span></label>
                                        <input type="text" placeholder="https://example.com/photo.jpg" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-[#00b4d8] outline-none transition-all" 
                                            value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer - Fixed at Bottom */}
                        <div className="px-5 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                            <button 
                                type="button" 
                                onClick={closeForm} 
                                className="px-5 md:px-6 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                form="userForm"
                                disabled={submitLoading} 
                                className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                {submitLoading ? <Loader2 className="animate-spin" size={16} /> : (isEditing ? 'Update User' : 'Save User')}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* 📊 DATA TABLE SECTION: Horizontal Scroll on Mobile */}
            <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-[350px] md:h-[400px] text-slate-400">
                        <Loader2 className="animate-spin mb-4 text-[#00b4d8]" size={32} />
                        <p className="text-sm font-medium">Fetching users...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-100 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                                    <th className="p-3 md:p-4 w-12 text-center">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                                    </th> 
                                    <th className="p-3 md:p-4 font-medium cursor-pointer">
                                        Name <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer">
                                        Client <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer">
                                        Email <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer hidden sm:table-cell">
                                        Phone <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer">
                                        Status
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer hidden md:table-cell">
                                        Last Seen
                                    </th>
                                    <th className="p-3 md:p-4 font-medium text-right pr-4 md:pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users?.length > 0 ? users.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                        
                                        {/* Checkbox */}
                                        <td className="p-3 md:p-4 text-center">
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                                        </td>
                                        
                                        {/* Avatar & Name */}
                                        <td className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                                            {u.avatar ? (
                                                <img src={u.avatar} alt={u.fullName} className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shrink-0" />
                                            ) : (
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-medium text-xs md:text-sm shrink-0">
                                                    {u.fullName?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-medium text-[#00b4d8] text-[13px] md:text-[14px]">{u.fullName}</span>
                                            <Star size={12} className="text-slate-300 cursor-pointer hover:text-orange-400 shrink-0 hidden sm:block" />
                                        </td>
                                        
                                        {/* Client */}
                                        <td className="p-3 md:p-4">
                                            <span className="text-[12px] md:text-[13px] font-medium text-slate-600 hover:text-[#00b4d8] cursor-pointer">
                                                {u.client?.companyName || 'System'}
                                            </span>
                                        </td>
                                        
                                        {/* Email */}
                                        <td className="p-3 md:p-4 text-[12px] md:text-[13px] font-light text-slate-500">{u.email}</td>
                                        
                                        {/* Phone */}
                                        <td className="p-3 md:p-4 text-[12px] md:text-[13px] font-light text-slate-500 hidden sm:table-cell">
                                            {u.phone || '---'}
                                        </td>
                                        
                                        {/* Status */}
                                        <td className="p-3 md:p-4">
                                            {u.isActive ? (
                                                <span className="px-2 md:px-3 py-1 bg-green-50 text-green-600 text-[10px] md:text-[11px] font-bold uppercase tracking-wider rounded-md">Active</span>
                                            ) : (
                                                <span className="px-2 md:px-3 py-1 bg-slate-100 text-slate-600 text-[10px] md:text-[11px] font-bold uppercase tracking-wider rounded-md">Locked</span>
                                            )}
                                        </td>

                                        {/* Last Seen */}
                                        <td className="p-3 md:p-4 text-[12px] md:text-[13px] font-light text-slate-500 hidden md:table-cell">
                                            {formatLastSeen(u.lastSeen)}
                                        </td>
                                        
                                        {/* Actions */}
                                        <td className="p-3 md:p-4 pr-4 md:pr-6">
                                            <div className="flex items-center justify-end gap-1.5 md:gap-3 text-slate-400">
                                                <button onClick={() => handleDelete(u.id, u.fullName)} className="hover:text-red-500 p-1" title="Delete">
                                                    <Trash2 size={16} strokeWidth={1.5} />
                                                </button>
                                                <button onClick={() => openEditForm(u)} className="hover:text-[#00d2d3] p-1" title="Edit">
                                                    <Edit size={16} strokeWidth={1.5} />
                                                </button>
                                                <button className="hover:text-orange-400 p-1 hidden sm:block">
                                                    <Mail size={16} strokeWidth={1.5} />
                                                </button>
                                                <button className="hover:text-slate-600 p-1 hidden sm:block">
                                                    <Lock size={16} strokeWidth={1.5} />
                                                </button>
                                                <button className="hover:text-slate-600 p-1">
                                                    <MoreHorizontal size={16} strokeWidth={1.5} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="p-10 md:p-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <ShieldAlert size={40} md-size={48} className="mb-4 text-slate-200" />
                                                <p className="text-sm md:text-base font-medium text-slate-600">No Users Found</p>
                                                <p className="text-xs text-slate-400 mt-1">Click the + button to add a new user.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
}