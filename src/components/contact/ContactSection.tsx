"use client";

import React, { useState, useEffect } from "react";
import { 
  Trash2, Search, RefreshCw, Mail, Phone, Clock, 
  MapPin, Loader2, Download, ChevronLeft, ChevronRight, 
  ArrowUpDown, MessageSquare, ChevronDown 
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { getContactsAction, updateContactStatusAction, deleteContactAction, bulkDeleteContactsAction } from "@/actions/contact";

interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  sourcePage?: string;
  status: string;
  createdAt: string;
  type?: string;
}

export default function ContactLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔄 Data Load Function
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getContactsAction();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Data load karne mein dikkat aayi");
      setLeads([]);
    } finally {
      setSelectedIds([]);
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    loadData();
  }, []);

  // Search change hone par Page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // 📝 Status Update
  const handleStatusChange = async (id: number, status: string) => {
    const res = await updateContactStatusAction(id, { status });
    if (res.success) {
      setLeads((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      toast.success(`Status update ho gaya: ${status}`);
    } else {
      toast.error("Status update fail ho gaya");
    }
  };

  // 🗑️ Single Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Kya aap sach mein ise delete karna chahte hain?")) return;
    const res = await deleteContactAction(id);
    if (res.success) {
      setLeads((prev) => prev.filter((item) => item.id !== id));
      toast.success("Lead delete kar di gayi");
    } else {
      toast.error("Delete fail ho gaya");
    }
  };

  // 💥 Bulk Delete
  const handleBulkDelete = async () => {
    if (!confirm(`${selectedIds.length} leads delete karein?`)) return;
    const res = await bulkDeleteContactsAction(selectedIds);
    if (res.success) {
      setLeads((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} leads deleted!`);
    } else {
      toast.error("Bulk delete fail ho gaya");
    }
  };

  // 📥 Excel Download Handler
  const handleDownloadExcel = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    window.open(`${API_URL}/api/contact/export`, "_blank");
    toast.success("Excel export start ho gaya hai");
  };

  // Frontend Filtering Logic
  const filteredLeads = leads.filter((lead) =>
    lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase()) ||
    lead.phone.includes(search)
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const indexOfLastLead = currentPage * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  // ☑️ Checkbox Logic
  const toggleSelectAll = () => {
    if (selectedIds.length === currentLeads.length && currentLeads.length > 0) setSelectedIds([]);
    else setSelectedIds(currentLeads.map((item) => item.id));
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  return (
    // 🔥 FIX: Reduced padding (p-4 md:p-6) and space-y-4 to fit content better
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-4 bg-slate-50 h-full font-sans w-full">
      <Toaster position="top-right" richColors closeButton />

      {/* 🔝 Header Section - Optimized Spacing */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-3 pb-1">
        <div>
          <h1 className="text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Contact Leads
          </h1>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>LEADS</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">CONTACTS</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete} 
              className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-[13px] font-medium hover:bg-red-100 flex items-center gap-2 border border-red-200 transition-colors shadow-sm h-9"
            >
              <Trash2 size={15} className="stroke-[1.5]" /> Delete ({selectedIds.length})
            </button>
          )}

          <button
            onClick={handleDownloadExcel}
            className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-md text-[13px] font-medium hover:bg-emerald-100 flex items-center gap-2 border border-emerald-200 transition-colors shadow-sm h-9"
          >
            <Download size={15} className="stroke-[1.5]" /> Export
          </button>

          <div className="flex items-center bg-white px-3 py-1.5 rounded-md border border-slate-200 w-full sm:w-64 shadow-sm h-9">
            <Search className="text-slate-400 mr-2" size={15} />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={loadData} 
            className="p-2 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-[#00b4d8] transition-colors h-9 flex items-center justify-center"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-[#00b4d8]" : "stroke-[1.5]"} />
          </button>
        </div>
      </div>

      {/* 📊 Main Table Container */}
      <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-[13px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                <th className="p-3 w-12 font-medium">
                  <input 
                    type="checkbox" 
                    checked={currentLeads.length > 0 && selectedIds.length === currentLeads.length} 
                    onChange={toggleSelectAll} 
                    className="w-4 h-4 rounded border-slate-300 text-cyan-500 cursor-pointer" 
                  />
                </th>
                <th className="p-3 font-medium cursor-pointer">
                  Lead Details <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                </th>
                <th className="p-3 font-medium cursor-pointer hidden md:table-cell">
                  Message & Source
                </th>
                <th className="p-3 font-medium cursor-pointer">
                  Status
                </th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Loader2 className="animate-spin mb-3 text-[#00b4d8]" size={28} />
                      <p className="text-sm font-medium">Fetching leads...</p>
                    </div>
                  </td>
                </tr>
              ) : currentLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <MessageSquare size={40} className="text-slate-200 mb-3 stroke-[1.5]" />
                      <p className="text-base font-medium text-slate-600">No leads found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLeads.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-3 align-middle">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)} 
                        onChange={() => toggleSelect(item.id)} 
                        className="w-4 h-4 rounded border-slate-300 text-cyan-500 cursor-pointer" 
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-light text-[#00b4d8] text-[15px] mb-0.5">{item.fullName}</div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><Mail size={11} /> {item.email}</span>
                        <span className="flex items-center gap-1"><Phone size={11} /> {item.phone}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell max-w-xs whitespace-normal">
                      <p className="text-[12px] text-slate-600 line-clamp-1" title={item.message}>
                        {item.message || <span className="italic text-slate-300">No message</span>}
                      </p>
                      <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-tighter">
                        {item.sourcePage || "Direct"}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="relative inline-block w-28">
                        <select
                          value={item.status || "New"}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`appearance-none w-full outline-none border cursor-pointer pl-2 pr-6 py-1 rounded text-[10px] font-semibold uppercase tracking-wider
                            ${item.status === 'Closed' ? 'bg-green-50 text-green-600 border-green-200' :
                              item.status === 'Contacted' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                              'bg-sky-50 text-[#00b4d8] border-sky-100'}
                          `}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-current opacity-60" />
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} className="stroke-[1.5]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🧭 Pagination UI */}
        {!loading && filteredLeads.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-50 bg-white rounded-b-md">
            <span className="text-[12px] font-medium text-slate-400">
              {indexOfFirstLead + 1}-{Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length}
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
                {currentPage} / {totalPages}
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
    </div>
  );
}