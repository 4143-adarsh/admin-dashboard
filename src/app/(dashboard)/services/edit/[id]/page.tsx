import ServiceForm from "@/components/dashboard/services/ServiceForm";
import { getServiceById } from "@/actions/services";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// 🚀 FIXED: Next.js 15+ mein params ko Promise type dena zaroori hai
export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    
    // 1. Params ko await karna padta hai taaki ID 'NaN' na bane
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 2. Database se data lekar aao (parseInt ab sahi kaam karega)
    const serviceData = await getServiceById(parseInt(id));

    // 3. Agar data nahi mila toh error handle karo
    if (!serviceData) {
        return (
            <div className="p-10 text-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 inline-block">
                    <h2 className="text-xl font-bold mb-2">Service nahi mili!</h2>
                    <p className="mb-4 text-sm opacity-80">ID: {id} ka data fetch nahi ho paya.</p>
                    <Link href="/services" className="text-blue-500 font-bold hover:underline">
                        Wapas Table Par Jayein
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <Link href="/services" className="flex items-center gap-2 text-brandGreen font-bold hover:text-brandOrange mb-4 w-fit transition-all">
                        <ArrowLeft size={18} /> Back to List
                    </Link>
                    <h1 className="text-4xl font-black text-textmain uppercase">
                        Edit <span className="text-brandOrange">Service</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Updating: {serviceData.title}</p>
                </div>

                {/* --- 🚀 Form Component --- */}
                <ServiceForm initialData={serviceData} isEdit={true} />
            </div>
        </div>
    );
}