import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateInvoiceForm from "@/components/dashboard/invoices/CreateInvoiceForm";

export const metadata = {
    title: "Create Invoice | Admin Dashboard",
    description: "Generate a new payment link for a client",
};

export default function CreateInvoicePage() {
    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-3xl mx-auto px-6">

                {/* Top Header & Back Button */}
                <div className="mb-6 flex flex-col gap-2">
                    <Link
                        href="/invoices"
                        className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors w-fit"
                    >
                        <ArrowLeft size={16} /> Back to Invoices
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase mt-2">
                        Generate Payment Link
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Fill in the details below to create a secure Razorpay payment link.
                    </p>
                </div>

                {/* Form Component */}
                <CreateInvoiceForm />

            </div>
        </div>
    );
}