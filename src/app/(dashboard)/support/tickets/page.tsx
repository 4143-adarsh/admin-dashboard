"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search, Loader2, Trash2, Eye, Filter,
    AlertCircle, CheckCircle2, Clock, ArrowUpDown, ChevronDown, MessageSquare,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { getAllTicketsAction, updateTicketAction, deleteTicketAction } from "@/actions/supportActions";

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // 🔥 Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Fetch Tickets on Load
    const fetchTickets = async () => {
        setLoading(true);
        const res = await getAllTicketsAction();
        if (res?.success) {
            setTickets(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // Quick Action: Update Status
    const handleStatusChange = async (id: number, newStatus: string) => {
        setTickets((prev) => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        await updateTicketAction(id, { status: newStatus });
    };

    // Action: Delete Ticket
    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this ticket?")) {
            setTickets((prev) => prev.filter(t => t.id !== id));
            await deleteTicketAction(id);
        }
    };

    // Styling Helpers
    const getPriorityStyle = (prio: string) => {
        switch (prio) {
            case "Urgent": return "bg-red-50 text-red-600 border-red-200";
            case "High": return "bg-orange-50 text-orange-600 border-orange-200";
            case "Medium": return "bg-blue-50 text-blue-600 border-blue-200";
            case "Low": return "bg-green-50 text-green-600 border-green-200";
            default: return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Open": return <AlertCircle size={14} className="text-amber-500 mr-1.5 stroke-[2.5]" />;
            case "In Progress": return <Clock size={14} className="text-[#00b4d8] mr-1.5 stroke-[2.5]" />;
            case "Resolved": return <CheckCircle2 size={14} className="text-green-500 mr-1.5 stroke-[2.5]" />;
            default: return <CheckCircle2 size={14} className="text-slate-400 mr-1.5 stroke-[2.5]" />;
        }
    };

    // Filter Logic
    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 🔥 Pagination Calculation
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

    return (
        // 🔥 Responsive Wrapper: adjusted paddings for mobile
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 md:space-y-6 bg-slate-50 min-h-screen font-sans w-full overflow-x-hidden">
            
            {/* 🔝 HEADER SECTION: Responsive Flex Layout */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-3 pb-2">
                <div className="w-full xl:w-auto">
                    <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
                        Support Desk
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                        <span>APP</span>
                        <span className="text-slate-300">&gt;</span>
                        <span>SUPPORT</span>
                        <span className="text-slate-300">&gt;</span>
                        <span className="text-slate-800">TICKETS</span>
                    </div>
                </div>

                {/* Actions: Badge, Filter, Search */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 md:gap-3 w-full xl:w-auto mt-2 xl:mt-0">
                    
                    {/* Open Tickets Badge - Full width on very small screens */}
                    <div className="bg-white px-3 md:px-4 py-2 rounded-md border border-slate-200 shadow-sm flex items-center justify-center gap-2 md:gap-2.5 h-10 w-full sm:w-auto shrink-0">
                        <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[12px] md:text-[13px] font-bold text-slate-700">
                            {tickets.filter(t => t.status === 'Open').length} Open
                        </span>
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full sm:w-40 h-10">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-md text-[12px] md:text-[13px] font-semibold text-slate-600 appearance-none outline-none hover:border-[#00b4d8] transition-colors shadow-sm h-full cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown size={14} className="text-slate-400" />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center bg-white px-3 py-2 rounded-md border border-slate-200 w-full sm:w-64 md:w-72 shadow-sm h-10">
                        <Search className="text-slate-400 mr-2 shrink-0" size={16} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 📊 DATA TABLE */}
            <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] text-slate-400">
                        <Loader2 className="animate-spin mb-4 text-[#00b4d8]" size={32} />
                        <p className="text-sm font-medium">Fetching tickets...</p>
                    </div>
                ) : currentTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] text-slate-400 p-6 text-center">
                       <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-slate-200 mb-3 md:mb-4 stroke-[1.5]" />
                        <p className="text-sm md:text-base font-medium text-slate-600">No tickets found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[750px]">
                            <thead>
                                <tr className="border-b border-slate-100 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                                    <th className="p-3 md:p-4 w-10 text-center">
                                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer">
                                        Ticket Details <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer hidden sm:table-cell">
                                        Department
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer text-center">
                                        Priority
                                    </th>
                                    <th className="p-3 md:p-4 font-medium cursor-pointer">
                                        Status
                                    </th>
                                    <th className="p-3 md:p-4 font-medium text-right pr-4 md:pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                                        
                                        <td className="p-3 md:p-4 text-center">
                                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                                        </td>

                                        <td className="p-3 md:p-4">
                                            <div className="flex flex-col gap-1 md:gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-sky-50 text-[#00b4d8] font-mono text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded border border-sky-100 font-bold tracking-wider shrink-0">
                                                        {ticket.ticketId}
                                                    </span>
                                                    <p className="text-[#00b4d8] font-medium md:font-light text-[13px] md:text-[15px] truncate max-w-[150px] sm:max-w-xs">
                                                        {ticket.subject}
                                                    </p>
                                                </div>
                                                <p className="text-slate-400 text-[11px] md:text-[12px] truncate max-w-[200px] sm:max-w-xs">{ticket.clientEmail}</p>
                                            </div>
                                        </td>

                                        <td className="p-3 md:p-4 hidden sm:table-cell">
                                            <span className="text-slate-600 font-medium text-[12px] md:text-[13px]">
                                                {ticket.department}
                                            </span>
                                        </td>

                                        <td className="p-3 md:p-4 text-center">
                                            <span className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-widest border ${getPriorityStyle(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>

                                        <td className="p-3 md:p-4">
                                            <div className="relative group/dropdown inline-block w-32 md:w-36">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:pl-3 pointer-events-none">
                                                    {getStatusIcon(ticket.status)}
                                                </div>
                                                <select
                                                    value={ticket.status}
                                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                                    className="appearance-none w-full outline-none border border-slate-200 cursor-pointer pl-7 md:pl-9 pr-6 md:pr-8 py-1 md:py-1.5 rounded text-[10px] md:text-[11px] font-semibold text-slate-600 uppercase tracking-wider transition-all duration-300 hover:border-[#00b4d8] bg-white shadow-sm"
                                                >
                                                    <option value="Open">Open</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Closed">Closed</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 md:pr-2">
                                                    <ChevronDown size={14} className="text-slate-400" />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-3 md:p-4 text-right pr-4 md:pr-6">
                                            <div className="flex items-center justify-end gap-1.5 md:gap-3">
                                                <Link
                                                    href={`/support/tickets/${ticket.id}`}
                                                    className="p-1 md:p-1.5 text-slate-400 hover:text-[#00b4d8] transition-colors"
                                                    title="View Message"
                                                >
                                                    <Eye size={16} className="md:w-[18px] md:h-[18px] stroke-[1.5]" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ticket.id)}
                                                    className="p-1 md:p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete Ticket"
                                                >
                                                    <Trash2 size={16} className="md:w-[18px] md:h-[18px] stroke-[1.5]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 🧭 PAGINATION UI - Responsive Stack */}
                {!loading && filteredTickets.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-slate-100 bg-white gap-3">
                        <span className="text-[11px] md:text-[13px] font-medium text-slate-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTickets.length)} of {filteredTickets.length} entries
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1 md:p-1.5 border border-slate-200 text-slate-400 rounded-md hover:bg-slate-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs md:text-[13px] font-semibold text-slate-600 px-2 md:px-3">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-1 md:p-1.5 border border-slate-200 text-slate-400 rounded-md hover:bg-slate-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
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