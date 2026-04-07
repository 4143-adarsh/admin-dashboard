'use server'

import { cookies } from 'next/headers';

async function fetchWithToken(url: string, options: RequestInit = {}) {
    const token = cookies().get('admin_token')?.value;
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', "Bearer " + token);
    }
    return fetch(url, { ...options, headers });
}

// 🌐 Dynamic Base URL Logic (Bulletproofed)
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

const API_URL = `${getBaseUrl()}/api/slider`;

export async function fetchSlidersAction() {
    try {
        const res = await fetchWithToken(`${API_URL}/admin/all`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function addSliderAction(formData: FormData) {
    try {
        const res = await fetchWithToken(API_URL, {
            method: 'POST',
            body: formData,
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateSliderAction(id: number, formData: FormData) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}`, {
            method: 'PUT',
            body: formData,
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteSliderAction(id: number) {
    try {
        const res = await fetchWithToken(`${API_URL}/${id}`, {
            method: 'DELETE',
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function bulkDeleteSlidersAction(ids: number[]) {
    try {
        const res = await fetchWithToken(`${API_URL}/DeleteMultiple`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
