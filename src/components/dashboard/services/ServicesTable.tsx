"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Edit, Trash2, Plus, Star, Home as HomeIcon, Sparkles, 
  Loader2, Search, Filter, ArrowUpDown, LayoutList,
  ChevronLeft, ChevronRight
} from "lucide-react";

// 🚀 API Actions
import { getServices, deleteService, updateServiceToggle } from "../../../actions/services";

export default function ServicesTable() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Ek page par kitne services dikhane hain

  // Data Load Karna
  const fetchTableData = async () => {
    setIsLoading(true);
    const data = await getServices();
    setServices(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  // Delete Handler
  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      const res = await deleteService(id);
      if (res.success) {
        fetchTableData();
      } else {
        alert("Delete failed! Check console.");
      }
    }
  };

  // Toggle Handler
  const handleToggle = async (id: number, field: string, currentValue: boolean) => {
    const updateData = { [field]: !currentValue };
    setServices(services.map(s => s.id === id ? { ...s, ...updateData } : s));
    await updateServiceToggle(id, updateData);
  };

  // 🔥 Search Logic (Bina logic chede filtering ke liye)
  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔥 Pagination Calculation
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

  return (
    // 🔥 Responsive Wrapper: tight on mobile, wide on desktop
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 md:space-y-6 bg-slate-50 min-h-screen font-sans w-full overflow-x-hidden">
      
      {/* 🔝 HEADER SECTION: Responsive Flex Layout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 pb-2">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Services
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>SERVICES</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">MANAGE</span>
          </div>
        </div>

        {/* Actions: Search & Add Button */}
        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="flex items-center bg-white px-3 py-2 rounded-md border border-slate-200 flex-grow md:w-64 shadow-sm h-10">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
                type="text" 
                placeholder="Search services..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>
          
          <Link
            href="/services/add"
            className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white p-2.5 md:p-3 rounded-full shadow-md shadow-red-200 transition-transform hover:scale-105 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center shrink-0"
            title="Add New Service"
          >
            <Plus size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* 📊 DATA TABLE SECTION */}
      <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[350px] text-slate-400">
            <Loader2 className="animate-spin mb-4 text-[#00b4d8]" size={32} />
            <p className="text-sm font-medium">Loading Services...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide bg-slate-50/50">
                    <th className="p-3 md:p-4 w-10 md:w-12 text-center">
                       <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                    </th>
                    <th className="p-3 md:p-4 font-medium cursor-pointer">
                      Service Details <ArrowUpDown size={12} className="inline ml-1 opacity-60" />
                    </th>
                    <th className="p-3 md:p-4 font-medium text-center">"New" Tag</th>
                    <th className="p-3 md:p-4 font-medium text-center">Navbar Box</th>
                    <th className="p-3 md:p-4 font-medium text-center">Home Page</th>
                    <th className="p-3 md:p-4 font-medium text-right pr-4 md:pr-6">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 md:p-16 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center">
                              <LayoutList size={40} className="text-slate-200 mb-3" />
                              <p className="text-sm md:text-base font-medium text-slate-600">No services found.</p>
                          </div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((service) => (
                      <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-3 md:p-4 text-center">
                          <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 cursor-pointer" />
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="font-medium text-[#00b4d8] text-[13px] md:text-[15px] truncate max-w-[180px] sm:max-w-xs" title={service.title}>
                              {service.title}
                          </div>
                          <div className="text-[11px] md:text-[12px] text-slate-400 mt-0.5 truncate max-w-[180px] sm:max-w-xs" title={`/${service.slug}`}>
                              /{service.slug}
                          </div>
                        </td>
                        <td className="p-3 md:p-4 text-center">
                          <button onClick={() => handleToggle(service.id, 'isNew', service.isNew)}
                            className={`p-1.5 md:p-2 rounded-lg transition-all ${service.isNew ? 'bg-sky-50 text-[#00b4d8]' : 'text-slate-300 hover:text-[#00b4d8]'}`}>
                            <Sparkles size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={service.isNew ? 2 : 1.5} />
                          </button>
                        </td>
                        <td className="p-3 md:p-4 text-center">
                          <button onClick={() => handleToggle(service.id, 'isFeatured', service.isFeatured)}
                            className={`p-1.5 md:p-2 rounded-lg transition-all ${service.isFeatured ? 'bg-amber-50 text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}>
                            <Star size={16} className={`md:w-[18px] md:h-[18px] ${service.isFeatured ? 'fill-amber-500' : ''}`} strokeWidth={service.isFeatured ? 2 : 1.5} />
                          </button>
                        </td>
                        <td className="p-3 md:p-4 text-center">
                          <button onClick={() => handleToggle(service.id, 'showOnHome', service.showOnHome)}
                            className={`p-1.5 md:p-2 rounded-lg transition-all ${service.showOnHome ? 'bg-emerald-50 text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}>
                            <HomeIcon size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={service.showOnHome ? 2 : 1.5} />
                          </button>
                        </td>
                        <td className="p-3 md:p-4 text-right pr-4 md:pr-6">
                          <div className="flex items-center justify-end gap-2 md:gap-3">
                            <button onClick={() => handleDelete(service.id, service.title)} className="text-slate-300 hover:text-red-500 p-1 transition-colors" title="Delete Service">
                              <Trash2 size={16} className="md:w-[18px] md:h-[18px] stroke-[1.5]" />
                            </button>
                            <Link href={`/services/edit/${service.id}`} className="text-slate-300 hover:text-[#00d2d3] p-1 transition-colors" title="Edit Service">
                              <Edit size={16} className="md:w-[18px] md:h-[18px] stroke-[1.5]" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 🧭 PAGINATION UI - Responsive Stack */}
            {!isLoading && filteredServices.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-slate-100 bg-white gap-3">
                <span className="text-[11px] md:text-[13px] font-medium text-slate-500">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredServices.length)} of {filteredServices.length}
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
          </>
        )}
      </div>

      <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}