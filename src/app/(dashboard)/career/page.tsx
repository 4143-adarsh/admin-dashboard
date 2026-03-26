import { getCareersAction } from "../../../actions/career";
import Openings from "@/components/career/Openings";

// Ye ek Server Component hai (async)
export default async function CareerAdminPage() {

    // 🔥 1. Cookies aur Token nikalne wala logic hata diya hai

    // 2. Server Action call karke seedha data lana (Bina token ke)
    const applications = await getCareersAction();

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-8 bg-slate-50 min-h-screen font-sans">

            {/* --- Top Header Section (Matched with theme) --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
                <div>
                    <h1 className="text-3xl font-light text-[#00b4d8] mb-2 tracking-wide">
                        Job Applications
                    </h1>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                        <span>APP</span>
                        <span className="text-slate-300">&gt;</span>
                        <span>CAREER</span>
                        <span className="text-slate-300">&gt;</span>
                        <span className="text-slate-800">APPLICATIONS</span>
                    </div>
                </div>

                {/* Total Count Display (Clean, matching the Stats Bar style) */}
                <div className="flex items-center gap-6 text-sm font-medium text-slate-500 bg-white px-5 py-3 rounded-md border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00b4d8]"></div> 
                        Total Applicants: 
                        <span className="text-slate-800 font-bold ml-1">
                            {Array.isArray(applications) ? applications.length : 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* --- Main Table Component --- */}
            {/* 🔥 Yahan se bhi token prop hata diya gaya hai */}
            <Openings applications={applications} />

        </div>
    );
}