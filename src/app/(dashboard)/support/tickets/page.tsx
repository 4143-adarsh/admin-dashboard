"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
    getAllTicketsAction, 
    addChatReplyAction, 
    updateTicketAction 
} from '@/actions/supportActions';
import { Loader2, Search, CheckCircle2, Clock, AlertCircle, MessageSquare, RefreshCw, Send, XCircle, Paperclip, ExternalLink, Download } from 'lucide-react';

export default function AdminTicketDashboard() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- 🔍 Filters & Search ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    // --- 💬 Reply State ---
    const [adminReply, setAdminReply] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    
    // --- Image Error State ---
    const [imgError, setImgError] = useState(false);

    // ==========================================
    // 🔄 FETCH ALL TICKETS (Global)
    // ==========================================
    const fetchAllTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAllTicketsAction();
            if (res.success) {
                setTickets(res.data || []);
                setFilteredTickets(res.data || []);
            }
        } catch (error) {
            console.error("Fetch Error");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllTickets();
    }, [fetchAllTickets]);

    // ==========================================
    // 🔍 SEARCH & FILTER LOGIC
    // ==========================================
    useEffect(() => {
        let result = tickets;

        if (statusFilter !== "All") {
            result = result.filter(t => t.status === statusFilter);
        }
        
        if (priorityFilter !== "All") {
            result = result.filter(t => t.priority === priorityFilter);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(t => 
                t.ticketId.toLowerCase().includes(lowerTerm) ||
                t.clientEmail.toLowerCase().includes(lowerTerm) ||
                t.subject.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredTickets(result);
    }, [searchTerm, statusFilter, priorityFilter, tickets]);

    // ==========================================
    // 💬 ADMIN SEND REPLY
    // ==========================================
    const handleAdminReply = async () => {
        if (!adminReply.trim()) return;
        setIsReplying(true);
        try {
            const res = await addChatReplyAction(selectedTicket.id, adminReply);
            const data = res; 

            if (data.success) {
                setSelectedTicket(data.data);
                setAdminReply("");
                fetchAllTickets();
            } else {
                alert("Failed to send reply");
            }
        } catch (error) {
            alert("Error sending message.");
        } finally {
            setIsReplying(false);
        }
    };

    // ==========================================
    // 🛑 CLOSE TICKET
    // ==========================================
    const handleCloseTicket = async (id: number) => {
        if (!confirm("Mark this ticket as Closed?")) return;
        try {
             const res = await updateTicketAction(id, { status: 'Closed' });
             const data = res;

            if (data.success) {
                setSelectedTicket(null);
                fetchAllTickets();
            }
        } catch (error) {
            alert("Failed to close ticket");
        }
    };

    // UI Helper for Status Badges
    const getStatusBadge = (status: string) => {
        if (status === 'Pending') return 'bg-orange-50 text-orange-600 border-orange-200';
        if (status === 'Replied') return 'bg-blue-50 text-blue-600 border-blue-200';
        if (status === 'Closed') return 'bg-slate-100 text-slate-500 border-slate-200';
        return 'bg-slate-50 text-slate-600 border-slate-200';
    };

    // 🔥 SMART URL EXTRACTOR (Sync fix)
    const getFullAttachmentUrl = (attachmentData: any) => {
        if (!attachmentData) return '';
        
        let parsedData = attachmentData;
        
        if (typeof attachmentData === 'string') {
            try {
                parsedData = JSON.parse(attachmentData);
            } catch (e) {
                parsedData = attachmentData; 
            }
        }
        
        let url = '';
        if (Array.isArray(parsedData) && parsedData.length > 0) {
            url = typeof parsedData[0] === 'object' ? (parsedData[0].url || parsedData[0].path || parsedData[0].filename || '') : parsedData[0];
        } else if (typeof parsedData === 'object' && parsedData !== null) {
            url = parsedData.url || parsedData.path || parsedData.filename || '';
        } else if (typeof parsedData === 'string') {
            url = parsedData;
        }
        
        if (!url || typeof url !== 'string') return '';
        if (url.startsWith('http')) return url; 
        
        const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://nighwan-tech-webbackend.onrender.com';
        let cleanPath = url.startsWith('/') ? url : `/${url}`;
        
        if (!cleanPath.startsWith('/uploads')) {
            cleanPath = `/uploads${cleanPath}`;
        }
        
        return `${baseUrl}${cleanPath}`;
    };

    // ==========================================
    // 🔥 UI: TICKET DETAIL VIEW (Right Panel)
    // ==========================================
    const renderDetailView = () => {
        if (!selectedTicket) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                    <MessageSquare size={48} className="mb-4 text-slate-300" strokeWidth={1.5} />
                    <p className="text-[14px] font-medium text-slate-500">Select a ticket to view conversation</p>
                </div>
            );
        }

        const mainAttachmentUrl = getFullAttachmentUrl(selectedTicket.attachments);

        return (
            <div className="bg-white border border-slate-100 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-[16px] text-slate-800 flex items-center gap-2">
                            {selectedTicket.ticketId}
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getStatusBadge(selectedTicket.status)}`}>
                                {selectedTicket.status}
                            </span>
                        </h3>
                        <p className="text-[12px] text-slate-500 mt-0.5 font-medium">{selectedTicket.clientEmail}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                        {selectedTicket.status !== 'Closed' && (
                            <button 
                                onClick={() => handleCloseTicket(selectedTicket.id)} 
                                className="flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                            >
                                <XCircle size={14} /> Close Ticket
                            </button>
                        )}
                        <button onClick={() => {
                            setSelectedTicket(null);
                            setImgError(false);
                        }} className="md:hidden text-slate-400 hover:text-slate-600 text-[12px] underline font-medium">Back</button>
                    </div>
                </div>

                {/* Details Bar */}
                <div className="bg-slate-50/50 border-b border-slate-100 p-3 px-5 grid grid-cols-3 gap-4 text-[12px] text-slate-600 flex-shrink-0">
                    <div><span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-0.5">Domain</span> <span className="font-medium text-slate-700">{selectedTicket.domain}</span></div>
                    <div><span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-0.5">Category</span> <span className="font-medium text-slate-700">{selectedTicket.category || 'General'}</span></div>
                    <div><span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-0.5">Priority</span> <span className={`font-bold ${selectedTicket.priority === 'High' ? 'text-red-500' : 'text-slate-700'}`}>{selectedTicket.priority || 'Medium'}</span></div>
                </div>

                {/* Chat / Content Area */}
                <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 bg-white">
                    {/* Original Complaint */}
                    <div className="flex flex-col items-start">
                        <div className="max-w-[85%] p-4 text-[13px] shadow-sm bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm relative">
                            <span className="text-[10px] font-bold block mb-1.5 uppercase tracking-wider text-slate-400">
                                Client (Original Issue) • {new Date(selectedTicket.createdAt).toLocaleString()}
                            </span>
                            <h4 className="font-bold text-slate-800 text-[14px] mb-2">{selectedTicket.subject}</h4>
                            <div className="whitespace-pre-wrap leading-relaxed">{selectedTicket.description}</div>
                            
                            {/* Original Issue Attachment */}
                            {mainAttachmentUrl && (
                                <div className="mt-4 pt-3 border-t border-slate-100">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                            <Paperclip size={12} /> Attachment
                                        </p>
                                        <a href={mainAttachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[11px] font-bold transition-colors border border-slate-200">
                                            <ExternalLink size={12} /> Open
                                        </a>
                                        <a href={mainAttachmentUrl} download="Attachment" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-[11px] font-bold transition-colors border border-blue-100">
                                            <Download size={12} /> Download
                                        </a>
                                    </div>
                                    {!imgError && (
                                        <div className="block bg-slate-50 p-2 rounded-xl border border-slate-100 inline-block">
                                            <img src={mainAttachmentUrl} alt="Ticket Preview" className="max-w-full sm:max-w-[280px] max-h-[180px] object-contain rounded-lg" onError={() => setImgError(true)} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Replies */}
                    {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                        <div className="space-y-5 pt-2">
                            {selectedTicket.replies.map((reply: any, idx: number) => {
                                // 🔥 SYNCED: Extract attachment for EACH individual reply chat bubble 🔥
                                const replyAttachmentUrl = getFullAttachmentUrl(reply.attachments);

                                return (
                                    <div key={idx} className={`flex flex-col ${reply.sender === 'Admin' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-4 text-[13px] shadow-sm ${
                                            reply.sender === 'Admin' 
                                            ? 'bg-orange-500 text-white rounded-2xl rounded-tr-sm' 
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm'
                                        }`}>
                                            <span className={`text-[10px] font-bold block mb-1.5 uppercase tracking-wider ${reply.sender === 'Admin' ? 'text-orange-100' : 'text-slate-400'}`}>
                                                {reply.sender === 'Admin' ? 'You (Support)' : 'Client'} • {new Date(reply.timestamp).toLocaleString()}
                                            </span>
                                            
                                            {reply.message && <div className="whitespace-pre-wrap leading-relaxed">{reply.message}</div>}

                                            {/* 🔥 SYNCED: Show attachment UI inside the reply bubble 🔥 */}
                                            {replyAttachmentUrl && (
                                                <div className={`mt-3 pt-3 border-t ${reply.sender === 'Admin' ? 'border-orange-400' : 'border-slate-100'}`}>
                                                    <a 
                                                        href={replyAttachmentUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className={`flex items-center gap-1.5 text-[11px] font-bold hover:underline mb-2 ${reply.sender === 'Admin' ? 'text-white' : 'text-blue-600'}`}
                                                    >
                                                        <Paperclip size={12} /> View Attached File
                                                    </a>
                                                    <img 
                                                        src={replyAttachmentUrl} 
                                                        alt="Reply Attachment" 
                                                        className={`max-w-full sm:max-w-[200px] max-h-[120px] object-cover rounded-lg border shadow-sm ${reply.sender === 'Admin' ? 'border-orange-400' : 'border-slate-200'}`}
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Reply Input Box */}
                {selectedTicket.status !== 'Closed' ? (
                    <div className="p-5 border-t border-slate-100 bg-white flex-shrink-0">
                        <textarea 
                            value={adminReply}
                            onChange={(e) => setAdminReply(e.target.value)}
                            placeholder="Type your response to the client here..."
                            className="w-full bg-slate-50 border border-slate-200 p-3.5 text-[13px] text-slate-700 rounded-xl outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100 min-h-[90px] resize-none mb-3 transition-all placeholder:text-slate-400"
                        ></textarea>
                        <div className="flex justify-end">
                            <button 
                                onClick={handleAdminReply}
                                disabled={isReplying || !adminReply.trim()}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:hover:bg-orange-500 flex items-center gap-2 shadow-sm shadow-orange-200"
                            >
                                {isReplying ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Reply</>}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 text-center text-[12px] font-bold text-slate-400 border-t border-slate-100 flex-shrink-0 rounded-b-2xl flex items-center justify-center gap-2">
                        <AlertCircle size={14} /> Ticket is Closed. No further replies can be added.
                    </div>
                )}
            </div>
        );
    };

    // ==========================================
    // 🌐 MAIN LAYOUT
    // ==========================================
    return (
        <div className="w-full bg-slate-50/50 min-h-[calc(100vh-60px)] p-4 md:p-6 font-sans flex flex-col">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
                        <MessageSquare className="text-orange-500" size={24} /> 
                        Support Tickets
                    </h2>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Manage and resolve client support requests</p>
                </div>
                
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search tickets..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 outline-none focus:border-orange-300 cursor-pointer transition-all font-medium"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Replied">Replied</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                
                {/* LEFT PANEL: Ticket List */}
                <div className={`md:w-1/3 flex flex-col bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-[14px] font-bold text-slate-800">Inbox <span className="text-slate-400 font-medium ml-1">({filteredTickets.length})</span></h2>
                        <button onClick={fetchAllTickets} className="text-[12px] text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1.5 transition-colors">
                            <RefreshCw size={12} /> Refresh
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-0.5 p-2 bg-slate-50/30">
                        {isLoading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-400" /></div>
                        ) : filteredTickets.length > 0 ? (
                            filteredTickets.map(ticket => (
                                <div 
                                    key={ticket.id} 
                                    onClick={() => {
                                        setSelectedTicket(ticket);
                                        setImgError(false); 
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                                        selectedTicket?.id === ticket.id 
                                        ? 'bg-orange-50/50 border-orange-200 shadow-sm' 
                                        : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1.5">
                                        <span className="text-[13px] font-bold text-slate-800">{ticket.ticketId}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${getStatusBadge(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="text-[12px] text-slate-600 font-medium truncate mb-2">{ticket.subject}</div>
                                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
                                        <span className="truncate max-w-[140px] flex items-center gap-1.5"><MessageSquare size={10}/> {ticket.clientEmail}</span>
                                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-[13px] font-medium text-slate-400 mt-10">No tickets found.</div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Ticket Detail */}
                <div className={`md:w-2/3 flex-col h-full ${!selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                    {renderDetailView()}
                </div>

            </div>
        </div>
    );
}