'use server'
import { cookies } from 'next/headers';


import { revalidatePath } from 'next/cache';

async function fetchWithToken(url: string, options: RequestInit = {}) {
    const token = cookies().get('admin_token')?.value;
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', "Bearer " + token);
    }
    return fetch(url, { ...options, headers });
}


// 🔥 FIXED: Base URL logic same rakha hai
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:5000"; 
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

const API_URL = `${getBaseUrl()}/api/support/tickets`;

// 🔥 Same logic: Crash-proof response handling
async function handleResponse(res: Response) {
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend didn't return JSON. Check if server is running on port 5000.");
    }
    return await res.json();
}

// 1. [READ ALL]
export async function getAllTicketsAction() {
    try {
        const res = await fetchWithToken(API_URL, { cache: 'no-store' });
        return await handleResponse(res);
    } catch (error) {
        console.error("Fetch Tickets Error:", error);
        return { success: false, data: [], message: "Backend se connect nahi ho paya" };
    }
}

// 2. [READ SINGLE]
export async function getTicketDetailAction(id: string | number) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}`, { cache: 'no-store' });
        return await handleResponse(res);
    } catch (error) {
        return { success: false, message: "Ticket detail fetch fail" };
    }
}

// 3. [UPDATE]
export async function updateTicketAction(id: string | number, updateData: { status?: string, priority?: string }) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });
        
        const result = await handleResponse(res);
        if (result.success) {
            revalidatePath('/support/tickets'); 
            revalidatePath(`/support/tickets/${id}`);
        }
        return result;
    } catch (error) {
        return { success: false, message: "Update failed" };
    }
}

// 4. [DELETE]
export async function deleteTicketAction(id: string | number) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}`, { method: 'DELETE' });
        const result = await handleResponse(res);
        if (result.success) revalidatePath('/support/tickets');
        return result;
    } catch (error) {
        return { success: false, message: "Delete failed" };
    }
}

// 5. [SEND EMAIL REPLY] - Ye SMTP (Email) ke liye hai
export async function sendTicketReplyAction(id: string | number, replyMessage: string) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ replyMessage }),
        });
        
        const result = await handleResponse(res);
        if (result.success) {
            revalidatePath('/support/tickets'); 
            revalidatePath(`/support/tickets/${id}`); 
        }
        return result;
    } catch (error) {
        return { success: false, message: "Email Reply failed" };
    }
}

// 🔥 SYNCED: 6. [ADD CHAT REPLY] - Backend ke sath sync kiya (attachments accept karega)
export async function addChatReplyAction(id: string | number, message: string, attachments?: any) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}/reply/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                sender: 'Admin', // Admin panel se hai isliye Admin hardcoded
                attachments: attachments || null // 🔥 Synced with controller
            }),
        });
        
        const result = await handleResponse(res);
        if (result.success) {
            revalidatePath('/support/tickets'); 
            revalidatePath(`/support/tickets/${id}`); 
        }
        return result;
    } catch (error) {
        console.error("Chat Reply Error:", error);
        return { success: false, message: "Chat reply failed" };
    }
}