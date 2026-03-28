'use server'

import { revalidatePath } from 'next/cache';

const getBaseUrl = () => {
    let base = process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
    if (process.env.NODE_ENV === "development") {
        base = "http://127.0.0.1:5000";
    }
    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }
    return base; 
};

const API_URL = `${getBaseUrl()}/api/notifications`;

// 1. Fetch All Notifications
export async function getNotificationsAction() {
    try {
        const res = await fetch(`${API_URL}/all`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}

// 2. Mark All as Read
export async function markAllReadAction() {
    try {
        const res = await fetch(`${API_URL}/read-all`, { method: 'PUT', cache: 'no-store' });
        const result = await res.json();
        // Optional: aap chahein toh path revalidate kar sakte hain
        return result;
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}