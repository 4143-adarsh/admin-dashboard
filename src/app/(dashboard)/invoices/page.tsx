import React from "react";
import InvoiceTable from "@/components/dashboard/invoices/InvoiceTable";

export const metadata = {
    title: "Invoices & Payments | Admin Dashboard",
    description: "Manage client invoices and payment links",
};

export default function InvoicesPage() {
    return (
        // 🔥 Layout Fix: बाहरी padding और header हटा दिया गया है
        <div className="bg-slate-50 h-full w-full">
            {/* अब सीधा Table Component लोड होगा, 
                जिसका अपना Blue Header ("Invoices") सबसे ऊपर दिखेगा।
            */}
            <InvoiceTable />
        </div>
    );
}