"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, Mail, User, Pin, Star, Filter, Upload, Download, Settings, Loader2, X, Building2, Phone, Briefcase, FileText } from 'lucide-react';
import { createClientAction, getAllClientsAction, deleteClientAction, updateClientAction, uploadClientsCSVAction } from '@/actions/clientActions';

export default function ClientsExactMatchPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    // 🔥 NAYA: Validation errors store karne ke liye state
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Table Sorting & UI State
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [starred, setStarred] = useState<number[]>([]);
    const [pinned, setPinned] = useState<number[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sidebar States
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    
    // Profile View ke liye
    const [viewClientProfile, setViewClientProfile] = useState<any | null>(null);

    const [formData, setFormData] = useState({
        companyName: '', companyEmail: '', companyPhone: '', gstin: '', status: 'Active',
        accountOwner: '', pendingProjects: 0, totalInvoices: 0, tags: '', category: 'Default'
    });

    useEffect(() => {
        loadClients();
    }, []);

    async function loadClients() {
        setLoading(true);
        const res = await getAllClientsAction();
        if (res?.success) setClients(res.data);
        setLoading(false);
    }

    const openEditModal = (client: any) => {
        setFormData({ ...client });
        setEditingId(client.id);
        setErrors({}); // Modal kholte waqt purane errors clear
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setErrors({}); // Modal band karte waqt errors clear
        setFormData({ companyName: '', companyEmail: '', companyPhone: '', gstin: '', status: 'Active', accountOwner: '', pendingProjects: 0, totalInvoices: 0, tags: '', category: 'Default' });
    };

    // 🔥 NAYA: Smart Input Change Handler (Formatting aur Validation ke liye)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        // 1. First Letter Auto Caps
        if (name === 'companyName' || name === 'accountOwner' || name === 'tags') {
            newValue = value.charAt(0).toUpperCase() + value.slice(1);
        } 
        // 2. Phone Number (Sirf Digits, Max 10)
        else if (name === 'companyPhone') {
            newValue = value.replace(/\D/g, '').slice(0, 10);
        } 
        // 3. GSTIN (Sirf Alphanumeric, Uppercase, Max 15)
        else if (name === 'gstin') {
            newValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
        }

        setFormData({ ...formData, [name]: newValue });

        // Jab user type kare to error hata do
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // 🔥 NAYA: Validation Logic before submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: Record<string, string> = {};

        // Validations
        if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required";
        if (!formData.companyEmail.trim() || !formData.companyEmail.includes('@')) newErrors.companyEmail = "Valid email is required (must contain @)";
        
        // Agar phone dala hai toh exactly 10 digits hona chahiye
        if (formData.companyPhone && formData.companyPhone.length !== 10) {
            newErrors.companyPhone = "Mobile number must be exactly 10 digits";
        }
        // Agar GSTIN dala hai toh exactly 15 characters hona chahiye
        if (formData.gstin && formData.gstin.length !== 15) {
            newErrors.gstin = "GSTIN must be exactly 15 characters";
        }

        // Agar errors hain toh submit rok do aur red lines show karo
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        let res = editingId ? await updateClientAction(editingId, formData) : await createClientAction(formData);
        if (res?.success) { closeModal(); await loadClients(); } 
        else alert("Error: " + (res?.message || "Something went wrong!"));
        setIsSubmitting(false);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Delete ${name}?`)) return;
        const res = await deleteClientAction(id);
        if (res?.success) setClients(clients.filter(c => c.id !== id));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const csvFormData = new FormData();
        csvFormData.append('csvFile', file);
        setIsSubmitting(true);
        const res = await uploadClientsCSVAction(csvFormData);
        if (res?.success) { alert(res.message); await loadClients(); } 
        else alert("Upload Failed: " + res?.message);
        setIsSubmitting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Company Name', 'Email', 'Phone', 'GSTIN', 'Account Owner', 'Projects', 'Invoices', 'Status'];
        const csvRows = [headers.join(',')];
        clients.forEach(c => {
            const row = [ c.id, `"${c.companyName}"`, `"${c.companyEmail}"`, c.companyPhone || '-', c.gstin || '-', `"${c.accountOwner || 'Unassigned'}"`, c.pendingProjects, c.totalInvoices, c.status ];
            csvRows.push(row.join(','));
        });
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + csvRows.join('\n')));
        link.setAttribute("download", "NighwanTech_Clients.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    let processedClients = clients.filter(client => {
        const matchesSearch = client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              client.companyEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (client.tags && client.tags.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = filterStatus === 'All' ? true : client.status === filterStatus;
        const matchesCategory = filterCategory === 'All' ? true : client.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortConfig !== null) {
        processedClients.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const toggleStar = (id: number) => setStarred(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const togglePin = (id: number) => setPinned(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const totalProjects = clients.reduce((acc, curr) => acc + (Number(curr.pendingProjects) || 0), 0);
    const totalInvoicesValue = clients.reduce((acc, curr) => acc + (Number(curr.totalInvoices) || 0), 0);
    const uniqueCategories = ['All', ...Array.from(new Set(clients.map(c => c.category || 'Default')))];

    // 🔥 NAYA: Dynamic styling based on validation error
    const getInputClass = (fieldName: string, focusColor: string) => {
        return `w-full p-2 md:p-2.5 border rounded-sm outline-none text-[13px] md:text-sm transition-all ${
            errors[fieldName] 
                ? 'border-red-500 focus:border-red-500 bg-red-50/10' 
                : `border-slate-200 focus:border-[${focusColor}]`
        }`;
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 bg-[#f4f7f6] min-h-screen font-sans relative w-full overflow-x-hidden">
            
            {/* 🔝 HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl text-[#1e88e5] font-light">Clients</h1>
                    <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mt-1">APP <span className="mx-1">&gt;</span> CLIENTS</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" placeholder="Search..." value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-sm outline-none focus:border-blue-400 text-sm w-full md:w-48 bg-white" 
                        />
                    </div>
                    
                    <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={isSubmitting} className="p-2 border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors disabled:opacity-50" title="Import CSV">
                        {isSubmitting && !showModal ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18}/>}
                    </button>
                    <button onClick={exportToCSV} className="p-2 border border-slate-200 bg-white text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-sm transition-colors" title="Export CSV"><Download size={18}/></button>
                    <button onClick={() => setShowFilterPanel(true)} className={`p-2 border rounded-sm transition-colors ${filterStatus !== 'All' || filterCategory !== 'All' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`} title="Advanced Filters"><Filter size={18}/></button>
                    <button onClick={() => { closeModal(); setShowModal(true); }} className="p-2.5 md:p-3 bg-[#ff5252] text-white rounded-full hover:bg-red-500 shadow-lg shadow-red-200 transition-all ml-auto md:ml-2 shrink-0">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* 📊 STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 bg-white p-4 md:p-6 shadow-sm border border-slate-100 mb-6 rounded-md">
                <div className="px-4 md:px-6 border-b-4 border-[#4db6ac] pb-2"><h2 className="text-2xl md:text-3xl text-slate-700 font-light">{clients.length}</h2><p className="text-slate-400 text-xs md:text-sm mt-1">Clients</p></div>
                <div className="px-4 md:px-6 border-b-4 border-[#64b5f6] pb-2 sm:border-l border-slate-100"><h2 className="text-2xl md:text-3xl text-slate-700 font-light">{totalProjects}</h2><p className="text-slate-400 text-xs md:text-sm mt-1">Pending Projects</p></div>
                <div className="px-4 md:px-6 border-b-4 border-[#b39ddb] pb-2 lg:border-l border-slate-100"><h2 className="text-2xl md:text-3xl text-slate-700 font-light">₹{totalInvoicesValue.toLocaleString()}</h2><p className="text-slate-400 text-xs md:text-sm mt-1">Invoices</p></div>
                <div className="px-4 md:px-6 border-b-4 border-slate-400 pb-2 sm:border-l border-slate-100"><h2 className="text-2xl md:text-3xl text-slate-700 font-light">₹0.00</h2><p className="text-slate-400 text-xs md:text-sm mt-1">Payments</p></div>
            </div>

            {/* 📋 DATA TABLE */}
            <div className="bg-white shadow-sm border border-slate-100 relative rounded-md w-full overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-[12px] md:text-[13px] text-slate-600 whitespace-nowrap min-w-[800px]">
                        <thead className="text-[#1e88e5] border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th onClick={() => handleSort('id')} className="py-3 md:py-4 px-4 md:px-6 font-medium cursor-pointer hover:bg-slate-100">ID ↕</th>
                                <th onClick={() => handleSort('companyName')} className="py-3 md:py-4 px-4 font-medium cursor-pointer hover:bg-slate-100">Name ↕</th>
                                <th onClick={() => handleSort('accountOwner')} className="py-3 md:py-4 px-4 font-medium cursor-pointer hover:bg-slate-100">Account Owner ↕</th>
                                <th onClick={() => handleSort('pendingProjects')} className="py-3 md:py-4 px-4 font-medium cursor-pointer hover:bg-slate-100">Projects ↕</th>
                                <th onClick={() => handleSort('totalInvoices')} className="py-3 md:py-4 px-4 font-medium cursor-pointer hover:bg-slate-100">Invoices ↕</th>
                                <th className="py-3 md:py-4 px-4 font-medium">Tags</th>
                                <th onClick={() => handleSort('category')} className="py-3 md:py-4 px-4 font-medium cursor-pointer hover:bg-slate-100">Category ↕</th>
                                <th onClick={() => handleSort('status')} className="py-3 md:py-4 px-4 font-medium cursor-pointer hover:bg-slate-100">Status ↕</th>
                                <th className="py-3 md:py-4 px-4 md:px-6 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={9} className="py-16 text-center"><Loader2 className="animate-spin text-[#1e88e5] mx-auto mb-2" size={24} /></td></tr>
                            ) : processedClients.length === 0 ? (
                                <tr><td colSpan={9} className="py-16 text-center text-slate-400">No clients match your filters.</td></tr>
                            ) : processedClients.map((client) => (
                                <tr key={client.id} className="hover:bg-[#f9fbfb] transition-colors">
                                    <td className="py-3 md:py-4 px-4 md:px-6">{client.id}</td>
                                    <td onClick={() => setViewClientProfile(client)} className="py-3 md:py-4 px-4 text-[#1e88e5] cursor-pointer hover:underline font-medium">{client.companyName}</td>
                                    <td className="py-3 md:py-4 px-4 flex items-center gap-2">
                                        <img src={`https://ui-avatars.com/api/?name=${client.accountOwner || 'U'}&background=random&color=fff`} alt="avatar" className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
                                        <span className="text-slate-600">{client.accountOwner || 'Unassigned'}</span>
                                    </td>
                                    <td className="py-3 md:py-4 px-4">{client.pendingProjects}</td>
                                    <td className="py-3 md:py-4 px-4">₹{Number(client.totalInvoices).toLocaleString()}</td>
                                    <td className="py-3 md:py-4 px-4">{client.tags ? <span className="px-2 py-0.5 md:py-1 bg-slate-100 border border-slate-200 text-slate-500 rounded-sm text-[10px] md:text-[11px]">{client.tags}</span> : '-'}</td>
                                    <td className="py-3 md:py-4 px-4 text-slate-400">{client.category}</td>
                                    <td className="py-3 md:py-4 px-4"><span className={`px-2 py-0.5 md:py-1 rounded-sm text-[10px] md:text-[11px] ${client.status === 'Active' ? 'bg-[#e3f2fd] text-[#1e88e5]' : 'bg-slate-100 text-slate-500'}`}>{client.status}</span></td>
                                    
                                    <td className="py-3 md:py-4 px-4 md:px-6">
                                        <div className="flex items-center justify-end gap-1.5 md:gap-2 text-slate-400">
                                            <button onClick={() => handleDelete(client.id, client.companyName)} className="hover:text-red-400 p-1" title="Delete"><Trash2 size={16}/></button>
                                            <button onClick={() => openEditModal(client)} className="hover:text-[#4db6ac] p-1" title="Edit"><Edit size={16}/></button>
                                            <a href={`mailto:${client.companyEmail}`} className="hover:text-[#1e88e5] p-1" title="Send Email"><Mail size={16}/></a>
                                            <button onClick={() => setViewClientProfile(client)} className="hover:text-[#4db6ac] p-1" title="View Profile"><User size={16}/></button>
                                            <button onClick={() => togglePin(client.id)} className={`transition-colors p-1 ${pinned.includes(client.id) ? 'text-orange-500' : 'hover:text-orange-400'}`} title="Pin Client"><Pin size={16}/></button>
                                            <button onClick={() => toggleStar(client.id)} className={`transition-colors p-1 ${starred.includes(client.id) ? 'text-yellow-400 fill-yellow-400' : 'hover:text-yellow-400'}`} title="Star Client"><Star size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 📝 CREATE/EDIT MODAL: Scrollable on small screens */}
             {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[95vh] overflow-hidden">
                        <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100 shrink-0">
                            <h2 className="text-lg md:text-xl font-medium text-slate-800">{editingId ? 'Edit Client Profile' : 'Add New Client'}</h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-red-500 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar">
                            <form id="clientForm" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-3 md:space-y-4">
                                        <h3 className="text-xs md:text-sm font-bold text-[#1e88e5] uppercase tracking-wider mb-1 md:mb-2">Basic Info</h3>
                                        
                                        {/* Company Name */}
                                        <div>
                                            <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">Company Name *</label>
                                            <input 
                                                name="companyName" required 
                                                value={formData.companyName} onChange={handleInputChange} 
                                                className={getInputClass('companyName', '#1e88e5')} 
                                            />
                                            {errors.companyName && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.companyName}</span>}
                                        </div>
                                        
                                        {/* Email */}
                                        <div>
                                            <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">Work Email *</label>
                                            <input 
                                                name="companyEmail" required type="email" 
                                                value={formData.companyEmail} onChange={handleInputChange} 
                                                className={getInputClass('companyEmail', '#1e88e5')} 
                                            />
                                            {errors.companyEmail && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.companyEmail}</span>}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Phone */}
                                            <div>
                                                <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">Phone (10 digits)</label>
                                                <input 
                                                    name="companyPhone" 
                                                    value={formData.companyPhone} onChange={handleInputChange} 
                                                    className={getInputClass('companyPhone', '#1e88e5')} 
                                                    placeholder="9876543210"
                                                />
                                                {errors.companyPhone && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.companyPhone}</span>}
                                            </div>
                                            
                                            {/* GSTIN */}
                                            <div>
                                                <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">GSTIN</label>
                                                <input 
                                                    name="gstin" 
                                                    value={formData.gstin} onChange={handleInputChange} 
                                                    className={getInputClass('gstin', '#1e88e5')} 
                                                    placeholder="15 Characters"
                                                />
                                                {errors.gstin && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.gstin}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        <h3 className="text-xs md:text-sm font-bold text-[#4db6ac] uppercase tracking-wider mb-1 md:mb-2 mt-2 md:mt-0">CRM Details</h3>
                                        
                                        {/* Account Owner */}
                                        <div>
                                            <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">Account Owner</label>
                                            <input 
                                                name="accountOwner" 
                                                value={formData.accountOwner} onChange={handleInputChange} 
                                                placeholder="e.g. John Doe" 
                                                className={getInputClass('accountOwner', '#4db6ac')} 
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Pending Projects */}
                                            <div>
                                                <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">Pending Projects</label>
                                                <input 
                                                    name="pendingProjects" type="number" 
                                                    value={formData.pendingProjects} onChange={handleInputChange} 
                                                    className={getInputClass('pendingProjects', '#4db6ac')} 
                                                />
                                            </div>
                                            
                                            {/* Total Invoices */}
                                            <div>
                                                <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">Total Invoices (₹)</label>
                                                <input 
                                                    name="totalInvoices" type="number" step="0.01" 
                                                    value={formData.totalInvoices} onChange={handleInputChange} 
                                                    className={getInputClass('totalInvoices', '#4db6ac')} 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Tags */}
                                            <div>
                                                <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">Tags (Comma separated)</label>
                                                <input 
                                                    name="tags" 
                                                    value={formData.tags} onChange={handleInputChange} 
                                                    placeholder="Web, Seo" 
                                                    className={getInputClass('tags', '#4db6ac')} 
                                                />
                                            </div>
                                            
                                            {/* Status */}
                                            <div>
                                                <label className="text-[11px] md:text-xs text-slate-500 mb-1 block">Status</label>
                                                <select 
                                                    name="status" 
                                                    value={formData.status} onChange={handleInputChange} 
                                                    className={getInputClass('status', '#4db6ac')}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-4 md:p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50 rounded-b-xl">
                            <button type="button" disabled={isSubmitting} onClick={closeModal} className="px-4 md:px-6 py-2 md:py-2.5 text-slate-500 font-medium hover:bg-slate-100 rounded-sm transition-all border border-slate-200 text-sm">Cancel</button>
                            <button type="submit" form="clientForm" disabled={isSubmitting} className="px-4 md:px-6 py-2 md:py-2.5 bg-[#1e88e5] text-white font-medium rounded-sm hover:bg-blue-600 transition-all flex items-center text-sm">
                                {isSubmitting && <Loader2 className="animate-spin mr-2" size={16} />}{editingId ? 'Save Changes' : 'Submit Client'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔍 ADVANCED FILTERS SIDEBAR */}
            {showFilterPanel && (
                <>
                    <div className="fixed inset-0 bg-slate-900/30 z-40 transition-opacity backdrop-blur-[1px]" onClick={() => setShowFilterPanel(false)}></div>
                    <div className="fixed right-0 top-0 h-full w-[85vw] sm:w-80 bg-white shadow-2xl z-50 p-5 md:p-6 transform transition-transform duration-300 ease-in-out border-l border-slate-200 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2"><Filter size={18} className="text-[#1e88e5]"/> Advanced Filters</h3>
                            <button onClick={() => setShowFilterPanel(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20}/></button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Filter By Status</label>
                                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-2.5 md:p-3 border border-slate-200 rounded-sm outline-none focus:border-[#1e88e5] text-[13px] md:text-sm text-slate-700 bg-slate-50 cursor-pointer">
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active Clients Only</option>
                                    <option value="Inactive">Inactive Clients Only</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Filter By Category</label>
                                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full p-2.5 md:p-3 border border-slate-200 rounded-sm outline-none focus:border-[#1e88e5] text-[13px] md:text-sm text-slate-700 bg-slate-50 cursor-pointer">
                                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 border-t border-slate-100 bg-white flex flex-col gap-3">
                            <button onClick={() => { setFilterStatus('All'); setFilterCategory('All'); }} className="w-full py-2 md:py-2.5 text-slate-500 font-medium hover:bg-slate-50 border border-slate-200 rounded-sm transition-colors text-[13px] md:text-sm">Clear All Filters</button>
                            <button onClick={() => setShowFilterPanel(false)} className="w-full py-2 md:py-2.5 bg-[#1e88e5] text-white font-medium rounded-sm hover:bg-blue-600 transition-colors shadow-sm text-[13px] md:text-sm">See Results ({processedClients.length})</button>
                        </div>
                    </div>
                </>
            )}

            {/* 👤 CLIENT PROFILE VIEW SIDEBAR */}
            {viewClientProfile && (
                <>
                    <div className="fixed inset-0 bg-slate-900/30 z-40 transition-opacity backdrop-blur-[1px]" onClick={() => setViewClientProfile(null)}></div>
                    <div className="fixed right-0 top-0 h-full w-[90vw] sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col">
                        
                        <div className="bg-[#f4f7f6] p-5 md:p-6 border-b border-slate-200 relative shrink-0">
                            <button onClick={() => setViewClientProfile(null)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm"><X size={18}/></button>
                            <div className="flex items-center gap-3 md:gap-4 mt-2">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-[#1e88e5] shrink-0">
                                    <Building2 size={24} className="md:w-[30px] md:h-[30px]" />
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">{viewClientProfile.companyName}</h2>
                                    <span className={`px-2 py-0.5 mt-1 inline-block rounded-sm text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${viewClientProfile.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                        {viewClientProfile.status} Client
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 md:p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 pb-24">
                            <div>
                                <h3 className="text-[11px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Contact Information</h3>
                                <div className="space-y-2 md:space-y-3 bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3 text-[13px] md:text-sm">
                                        <Mail size={16} className="text-slate-400 shrink-0" />
                                        <a href={`mailto:${viewClientProfile.companyEmail}`} className="text-[#1e88e5] hover:underline break-all">{viewClientProfile.companyEmail}</a>
                                    </div>
                                    {viewClientProfile.companyPhone && (
                                        <div className="flex items-center gap-3 text-[13px] md:text-sm text-slate-600">
                                            <Phone size={16} className="text-slate-400 shrink-0" /> {viewClientProfile.companyPhone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[11px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Business Overview</h3>
                                <div className="grid grid-cols-2 gap-2 md:gap-3">
                                    <div className="bg-white border border-slate-200 p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center">
                                        <Briefcase size={18} className="text-[#64b5f6] mb-1 md:w-5 md:h-5" />
                                        <span className="text-xl md:text-2xl font-light text-slate-700">{viewClientProfile.pendingProjects}</span>
                                        <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Projects</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center">
                                        <FileText size={18} className="text-[#b39ddb] mb-1 md:w-5 md:h-5" />
                                        <span className="text-lg md:text-xl font-light text-slate-700">₹{Number(viewClientProfile.totalInvoices).toLocaleString()}</span>
                                        <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Invoices</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[11px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Additional Details</h3>
                                <ul className="space-y-2 md:space-y-3 text-[13px] md:text-sm text-slate-600">
                                    <li className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-400">Account Owner</span>
                                        <span className="font-medium text-right ml-2">{viewClientProfile.accountOwner || 'Unassigned'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-400">GSTIN</span>
                                        <span className="font-medium uppercase text-right ml-2">{viewClientProfile.gstin || 'N/A'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-400">Category</span>
                                        <span className="font-medium text-right ml-2">{viewClientProfile.category}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100 bg-slate-50 flex gap-2 shrink-0">
                            <button onClick={() => { setViewClientProfile(null); openEditModal(viewClientProfile); }} className="flex-1 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-[13px] md:text-sm">
                                <Edit size={16}/> Edit Client
                            </button>
                            <button onClick={() => { setViewClientProfile(null); handleDelete(viewClientProfile.id, viewClientProfile.companyName); }} className="flex-1 py-2 md:py-2.5 bg-[#ff5252] text-white font-medium rounded-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-[13px] md:text-sm">
                                <Trash2 size={16}/> Delete
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-30">
                <button onClick={() => alert("Support Chatbot opening...")} className="w-12 h-12 md:w-14 md:h-14 bg-[#64b5f6] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-transform hover:scale-105 active:scale-95">
                    <span className="text-xl md:text-2xl pt-1">💬</span>
                </button>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
}