'use server'

import { revalidatePath } from 'next/cache';

// 🔥 DYNAMIC API URL (Local vs Production)
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:5000";
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

// Aapke backend ka exact base URL (Tickets ke liye)
const API_URL = `${getBaseUrl()}/api/support/tickets`;

// 1. [READ ALL] - Table mein saare tickets dikhane ke liye
export async function getAllTicketsAction() {
    try {
        const res = await fetch(API_URL, { 
            cache: 'no-store' 
        });
        return await res.json();
    } catch (error) {
        console.error("Fetch Tickets Error:", error);
        return { success: false, message: "Backend se connect nahi ho paya" };
    }
}

// 2. [READ SINGLE] - Kisi ek ticket ki poori chat/detail dekhne ke liye
export async function getTicketDetailAction(id: string | number) {
    try {
        const res = await fetch(`${API_URL}/${id}`, { 
            cache: 'no-store' 
        });
        return await res.json();
    } catch (error) {
        return { success: false, message: "Ticket detail fetch fail" };
    }
}

// 3. [UPDATE] - Status ya Priority badalne ke liye
export async function updateTicketAction(id: string | number, updateData: { status?: string, priority?: string }) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });
        
        const result = await res.json();
        
        if (result.success) {
            revalidatePath('/support/tickets'); // Path update kiya folder structure ke hisaab se
        }
        
        return result;
    } catch (error) {
        return { success: false, message: "Update failed" };
    }
}

// 4. [DELETE] - Ticket hatane ke liye
export async function deleteTicketAction(id: string | number) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        
        const result = await res.json();
        
        if (result.success) {
            revalidatePath('/support/tickets');
        }
        
        return result;
    } catch (error) {
        return { success: false, message: "Delete failed" };
    }
}

// 🔥 NAYA ADD KIYA: 5. [SEND EMAIL REPLY] - Customer ko asli email bhejne ke liye
export async function sendTicketReplyAction(id: string | number, replyMessage: string) {
    try {
        const res = await fetch(`${API_URL}/${id}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ replyMessage }),
        });
        
        const result = await res.json();
        
        // Agar reply chala gaya, toh data refresh kar do
        if (result.success) {
            revalidatePath('/support/tickets'); // Table refresh
            revalidatePath(`/support/tickets/${id}`); // Detail page refresh
        }
        
        return result;
    } catch (error) {
        console.error("Reply Action Error:", error);
        return { success: false, message: "Server se connect nahi ho paya" };
    }
}