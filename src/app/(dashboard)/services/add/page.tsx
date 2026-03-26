import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ServiceForm from "@/components/dashboard/services/ServiceForm";

export default function AddServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          {/* 🚀 FIXED: href ko change karke '/services' kar diya hai */}
          <Link 
            href="/services" 
            className="flex items-center gap-2 text-brandGreen font-bold hover:text-brandOrange transition-colors mb-4 w-fit"
          >
            <ArrowLeft size={18} /> Back to Services
          </Link>
          
          <h1 className="text-4xl font-black text-textmain tracking-tight uppercase">
            Add <span className="text-brandOrange">New Service</span>
          </h1>
        </div>
        
        <ServiceForm />
      </div>
    </div>
  );
}