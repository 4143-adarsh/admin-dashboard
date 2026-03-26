"use client";

import React, { useState, useEffect } from 'react';
import { 
    FileUp, Trash2, Download, Search, FolderOpen, 
    FileText, Loader2, CheckCircle2, User, X
} from 'lucide-react';
import { 
    uploadDocumentAction, 
    getAllDocumentsAction, 
    deleteDocumentAction,
    getClientsForDropdownAction
} from '@/actions/documentActions';

export default function AdminDocumentsPage() {
    // States
    const [clients, setClients] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form States
    const [selectedClient, setSelectedClient] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // Initial Data Fetch
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [clientsRes, docsRes] = await Promise.all([
            getClientsForDropdownAction(),
            getAllDocumentsAction()
        ]);
        
        if (clientsRes?.success) setClients(clientsRes.data);
        if (docsRes?.success) setDocuments(docsRes.data);
        setLoading(false);
    };

    // 🔥 Form Submit Handler (Multer Compatible)
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient || !title || !file) {
            alert("Please fill all fields and select a file.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('clientId', selectedClient);
        formData.append('title', title);
        formData.append('file', file); 

        const res = await uploadDocumentAction(formData);

        if (res?.success) {
            setSelectedClient('');
            setTitle('');
            setFile(null);
            await fetchData();
            alert("File Uploaded Successfully!"); 
        } else {
            alert(res?.message || "Failed to upload document");
        }
        
        setIsSubmitting(false);
    };

    // Delete Handler
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        
        const res = await deleteDocumentAction(id);
        if (res?.success) {
            setDocuments(docs => docs.filter(d => d.id !== id));
        } else {
            alert(res?.message || "Failed to delete");
        }
    };

    // Format Bytes
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredDocs = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.client?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        // 🔥 Responsive Wrapper: tight on mobile, wide on desktop
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 md:space-y-6 lg:space-y-8 bg-slate-50 min-h-screen font-sans w-full overflow-x-hidden">
            
            {/* 🔝 HEADER SECTION: Responsive Flex Layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 pb-2">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
                        Shared Documents
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                        <span>APP</span>
                        <span className="text-slate-300">&gt;</span>
                        <span>CLIENTS</span>
                        <span className="text-slate-300">&gt;</span>
                        <span className="text-slate-800">DOCUMENTS</span>
                    </div>
                </div>
            </div>

            {/* 📦 MAIN GRID: 1 column on Mobile/Tablet, 3 columns on XL screens */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8 items-start">
                
                {/* ⬅️ LEFT: Upload Form */}
                <div className="xl:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm xl:sticky xl:top-24 overflow-hidden w-full">
                    <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-[15px] md:text-[16px] font-semibold text-slate-800 flex items-center gap-2">
                            <FileUp size={18} className="text-[#00b4d8]" /> Upload New File
                        </h2>
                    </div>

                    <form onSubmit={handleUpload} className="p-5 md:p-6 space-y-5 md:space-y-6">
                        {/* Client Select */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] md:text-[13px] text-slate-500 font-medium">Assign to Client <span className="text-red-500">*</span></label>
                            <select 
                                required
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-[13px] md:text-sm text-slate-700 focus:border-[#00b4d8] outline-none appearance-none cursor-pointer transition-all"
                            >
                                <option value="" disabled>Select a company...</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>{c.companyName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Document Title */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] md:text-[13px] text-slate-500 font-medium">Document Title <span className="text-red-500">*</span></label>
                            <input 
                                required
                                type="text" 
                                value={title}
                                placeholder="e.g. Q3 Server Invoice"
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-[13px] md:text-sm text-slate-700 focus:border-[#00b4d8] outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {/* Drag & Drop File Area */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] md:text-[13px] text-slate-500 font-medium">Select File <span className="text-red-500">*</span></label>
                            <div className="relative border border-dashed border-slate-300 rounded-lg p-6 md:p-8 text-center hover:border-[#00b4d8] hover:bg-sky-50/30 transition-colors group cursor-pointer overflow-hidden">
                                <input 
                                    required
                                    type="file" 
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {file ? (
                                    <div className="flex flex-col items-center gap-1.5 md:gap-2 relative z-0">
                                        <div className="p-1.5 md:p-2 bg-green-50 text-green-500 rounded-full">
                                            <CheckCircle2 size={20} className="md:w-6 md:h-6" />
                                        </div>
                                        <p className="text-[13px] md:text-sm font-medium text-slate-700 truncate w-full px-2">{file.name}</p>
                                        <p className="text-[11px] md:text-xs text-slate-400">{formatBytes(file.size)}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 md:gap-2 text-slate-500 group-hover:text-[#00b4d8] transition-colors relative z-0">
                                        <FileText size={24} className="md:w-7 md:h-7 text-slate-300 group-hover:text-[#00b4d8]" strokeWidth={1.5} />
                                        <p className="text-[13px] md:text-sm font-medium mt-1">Click or tap to upload</p>
                                        <p className="text-[10px] md:text-xs text-slate-400">PDF, DOCX, PNG (Max 10MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full px-5 md:px-6 py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <FileUp size={16} />}
                            {isSubmitting ? 'Uploading...' : 'Upload Document'}
                        </button>
                    </form>
                </div>

                {/* ➡️ RIGHT: Document List */}
                <div className="xl:col-span-2 space-y-4 w-full">
                    
                    {/* Search Bar for Documents */}
                    <div className="flex items-center bg-white px-3 py-2 rounded-md border border-slate-200 w-full sm:w-80 md:w-96 shadow-sm h-10">
                        <Search className="text-slate-400 mr-2 shrink-0" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search documents..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Documents Container */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px] md:min-h-[500px]">
                        <div className="px-5 md:px-6 py-3.5 md:py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-[13px] md:text-[14px] font-semibold text-slate-700">
                                All Files <span className="text-slate-400 font-normal ml-1">({filteredDocs.length})</span>
                            </h3>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] text-slate-400">
                                <Loader2 className="animate-spin mb-3 md:mb-4 text-[#00b4d8]" size={28} />
                                <p className="text-xs md:text-sm font-medium">Loading documents...</p>
                            </div>
                        ) : filteredDocs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] text-slate-400 p-6 text-center">
                                <FolderOpen size={40} className="md:w-12 md:h-12 text-slate-200 mb-3 md:mb-4 stroke-[1.5]" />
                                <p className="text-sm md:text-base font-medium text-slate-600">No documents found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredDocs.map((doc) => (
                                    <div key={doc.id} className="p-3.5 md:p-4 px-4 md:px-6 flex flex-row items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors group">
                                        
                                        {/* File Info */}
                                        <div className="flex items-center gap-3 md:gap-4 overflow-hidden flex-1">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-sky-50 rounded-lg flex items-center justify-center text-[#00b4d8] border border-sky-100 shrink-0">
                                                <FileText size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
                                            </div>
                                            
                                            <div className="flex flex-col overflow-hidden w-full">
                                                <h4 className="text-[13px] md:text-[14px] font-medium text-[#00b4d8] cursor-pointer hover:underline truncate" title={doc.title}>
                                                    {doc.title}
                                                </h4>
                                                
                                                {/* Meta Info (Wrapped nicely on mobile) */}
                                                <div className="flex flex-wrap items-center gap-x-2 md:gap-x-3 gap-y-1 mt-0.5 md:mt-1 text-[11px] md:text-[12px] text-slate-400">
                                                    <span className="flex items-center gap-1 truncate max-w-[120px] md:max-w-none">
                                                        <User size={10} className="md:w-3 md:h-3 shrink-0" /> <span className="truncate">{doc.client?.companyName || 'Unknown'}</span>
                                                    </span>
                                                    <span className="hidden sm:inline text-slate-300">•</span>
                                                    <span className="whitespace-nowrap">{formatBytes(doc.fileSize)}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="whitespace-nowrap">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-0.5 md:gap-2 shrink-0">
                                            <a 
                                                href={doc.fileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="p-1.5 md:p-2 text-slate-400 hover:text-[#00b4d8] transition-colors"
                                                title="Download File"
                                            >
                                                <Download size={16} className="md:w-[18px] md:h-[18px] stroke-[1.5]" />
                                            </a>
                                            <button 
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete File"
                                            >
                                                <Trash2 size={16} className="md:w-[18px] md:h-[18px] stroke-[1.5]" />
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}