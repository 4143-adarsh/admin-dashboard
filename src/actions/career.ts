"use server";

import { revalidatePath } from "next/cache";

// 🔥 MAIN FIX: Same URL Logic jo aapne website me use kiya tha
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:5000"; // Development me local backend
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

// --- 🟢 1. GET ALL APPLICATIONS (Bina Token) ---
export async function getCareersAction() {
    const API_URL = getBaseUrl();
    try {
        console.log(`⏳ Admin Fetching data from: ${API_URL}/api/career`); // Terminal me check karne ke liye

        const response = await fetch(`${API_URL}/api/career`, {
            method: "GET",
            headers: {
                "Cache-Control": "no-cache",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("❌ Backend Error Status:", response.status);
            return [];
        }

        const result = await response.json();
        return result.data || [];

    } catch (error) {
        console.error("🚨 Admin Action Fetch Error:", error);
        return [];
    }
}

// --- 🟡 2. UPDATE APPLICATION STATUS (Naya Logic) ---
export async function updateCareerStatusAction(id: number, payload: { status?: string; remarks?: string }) {
    const API_URL = getBaseUrl();
    try {
        const response = await fetch(`${API_URL}/api/career/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload), // Jaise { status: "Shortlisted", remarks: "Good fit" }
        });

        if (response.ok) {
            // 🔥 Status update hone ke baad table auto-refresh ho jayegi
            revalidatePath("/career");
            return { success: true };
        }
        return { success: false, error: "Status update nahi ho paya." };
    } catch (error) {
        return { success: false, error: "Server connection error." };
    }
}

// --- 🔴 3. DELETE SINGLE APPLICATION (Bina Token) ---
export async function deleteCareerAction(id: number) {
    const API_URL = getBaseUrl();
    try {
        const response = await fetch(`${API_URL}/api/career/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            revalidatePath("/career");
            return { success: true };
        }
        return { success: false, error: "Delete nahi ho paya." };
    } catch (error) {
        return { success: false, error: "Server connection error." };
    }
}

// --- 🚀 4. BULK DELETE (Bina Token) ---
export async function deleteMultipleCareersAction(ids: number[]) {
    const API_URL = getBaseUrl();
    try {
        const response = await fetch(`${API_URL}/api/career/DeleteMultiple`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
        });

        if (response.ok) {
            revalidatePath("/career");
            return { success: true };
        }
        return { success: false };
    } catch (error) {
        return { success: false };
    }
}