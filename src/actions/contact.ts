"use server";

import { revalidatePath } from "next/cache";

const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:5000"; // IPv6 error se bachne ke liye
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

const API_URL = getBaseUrl();

// =========================================================================
// 🛠️ ADMIN PANEL ACTIONS (Without Token)
// =========================================================================

export async function getContactsAction() {
    try {
        const response = await fetch(`${API_URL}/api/contact`, {
            method: "GET",
            headers: { "Cache-Control": "no-cache" },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("❌ API Response Failed:", response.status); 
            return [];
        }

        const result = await response.json();
        console.log("📦 Total Data from Backend:", result.data ? result.data.length : 0, "rows");

        if (result.success && Array.isArray(result.data)) {
            const normalContacts = result.data
                .filter((item: any) => {
                    const typeValue = item.type ? item.type.toUpperCase() : '';
                    return typeValue === 'GENERAL' || typeValue === 'CONTACT_FORM' || typeValue === ''; 
                })
                .map((item: any) => ({
                    ...item,
                    status: item.status || 'New' 
                }));
            
            console.log("✅ Filtered Data for Table:", normalContacts.length, "rows");
            return normalContacts;
        }
        return [];
    } catch (error) {
        console.error("❌ Action Fetch Error:", error);
        return [];
    }
}

export async function updateContactStatusAction(id: number, payload: { status: string }) {
    try {
        const response = await fetch(`${API_URL}/api/contact/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            revalidatePath("/admin/contacts");
            return { success: true };
        }
        return { success: false, error: "Status update failed." };
    } catch (error) {
        return { success: false, error: "Server error." };
    }
}

export async function deleteContactAction(id: number) {
    try {
        const response = await fetch(`${API_URL}/api/contact/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            revalidatePath("/admin/contacts");
            return { success: true };
        }
        return { success: false, error: "Delete failed." };
    } catch (error) {
        return { success: false, error: "Server error." };
    }
}

export async function bulkDeleteContactsAction(ids: number[]) {
    try {
        const response = await fetch(`${API_URL}/api/contact/DeleteMultiple`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        });

        if (response.ok) {
            revalidatePath("/admin/contacts");
            return { success: true };
        }
        return { success: false, error: "Bulk delete failed." };
    } catch (error) {
        return { success: false, error: "Server error." };
    }
}