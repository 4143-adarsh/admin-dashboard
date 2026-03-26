'use server'

import { revalidatePath } from 'next/cache';

// 🔥 DYNAMIC API URL (Sirf Base Domain dega, bina '/api' ke)
const getBaseUrl = () => {
    let base = process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
    if (process.env.NODE_ENV === "development") {
        base = "http://127.0.0.1:5000";
    }
    
    // Agar end me '/' hai toh use hata dein
    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }

    return base; 
};

const API_URL = getBaseUrl();

// 1. CREATE
export async function createClientUserAction(data: any) {
    try {
        // Yahan dhyan dein: `/api/client-users/...` explicitly likha hai
        const res = await fetch(`${API_URL}/api/client-users/create`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(data), 
            cache: 'no-store'
        });
        const result = await res.json();
        if (result.success) revalidatePath('/client-users');
        return result;
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}

// 2. READ ALL
export async function getClientUsersAction() {
    try {
        const res = await fetch(`${API_URL}/api/client-users/all`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}

// 3. READ BY COMPANY
export async function getClientUsersByCompanyAction(clientId: string | number) {
    try {
        const res = await fetch(`${API_URL}/api/client-users/company/${clientId}`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}

// 4. READ SINGLE
export async function getClientUserByIdAction(id: string | number) {
    try {
        const res = await fetch(`${API_URL}/api/client-users/${id}`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}

// 5. UPDATE
export async function updateClientUserAction(id: string | number, data: any) {
    try {
        const res = await fetch(`${API_URL}/api/client-users/${id}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(data), 
            cache: 'no-store'
        });
        const result = await res.json();
        if (result.success) revalidatePath('/client-users');
        return result;
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}

// 6. DELETE
export async function deleteClientUserAction(id: string | number) {
    try {
        const res = await fetch(`${API_URL}/api/client-users/${id}`, { method: 'DELETE', cache: 'no-store' });
        const result = await res.json();
        if (result.success) revalidatePath('/client-users');
        return result;
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}

// Dropdown Helper (Company List laane ke liye)
export async function getClientsDropdownAction() {
    try {
        const res = await fetch(`${API_URL}/api/clients/all`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}