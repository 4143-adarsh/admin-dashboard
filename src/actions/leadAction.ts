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


const getBaseUrl = () => {
    let base = process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
    if (process.env.NODE_ENV === "development") {
        base = "http://127.0.0.1:5000";
    }
    if (base.endsWith('/')) base = base.slice(0, -1);
    return base;
};

const API_URL = `${getBaseUrl()}/api/leads`;

export async function getLeadsAction() {
    try {
        const res = await fetchWithToken(API_URL, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}

export async function updateLeadAction(id: number, data: any) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        revalidatePath('/leads');
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}

export async function deleteLeadAction(id: number) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}`, { method: 'DELETE' });
        revalidatePath('/leads');
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}

// 🔥 NAYA ADD KIYA: Nayi Lead create karne ke liye
export async function createLeadAction(data: any) {
    try {
        const res = await fetchWithToken(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        revalidatePath('/leads'); // UI ko turant update karne ke liye
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}