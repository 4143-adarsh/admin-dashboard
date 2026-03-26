'use server'

const API_URL = 'http://localhost:5000/api';

// ==========================================
// 1. CREATE: 🚀 UPDATED FOR MULTER
// ==========================================
export async function uploadDocumentAction(formData: FormData) {
    try {
        const res = await fetch(`${API_URL}/documents/upload`, {
            method: 'POST',
            // 🚨 CRITICAL: 'Content-Type' header yahan nahi likhna hai.
            // Browser apne aap boundary ke saath 'multipart/form-data' set kar dega.
            body: formData, 
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) { 
        return { success: false, message: error.message }; 
    }
}

// ==========================================
// 2. READ ALL (Admin) - Perfect ✅
// ==========================================
export async function getAllDocumentsAction() {
    try {
        const res = await fetch(`${API_URL}/documents/all`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}

// ==========================================
// 3. DELETE - Perfect ✅
// ==========================================
export async function deleteDocumentAction(id: string | number) {
    try {
        const res = await fetch(`${API_URL}/documents/${id}`, { method: 'DELETE', cache: 'no-store' });
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}

// ==========================================
// 4. UPDATE (Details only) - Perfect ✅
// ==========================================
export async function updateDocumentAction(id: string | number, data: { title: string }) {
    try {
        const res = await fetch(`${API_URL}/documents/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}

// ==========================================
// 5. READ SINGLE - Perfect ✅
// ==========================================
export async function getDocumentByIdAction(id: string | number) {
    try {
        const res = await fetch(`${API_URL}/documents/${id}`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}

// ==========================================
// 6. READ BY CLIENT - Perfect ✅
// ==========================================
export async function getDocumentsByClientAction(clientId: string | number) {
    try {
        const res = await fetch(`${API_URL}/documents/client/${clientId}`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}

// Client Dropdown fetcher - Perfect ✅
export async function getClientsForDropdownAction() {
    try {
        const res = await fetch(`${API_URL}/clients/all`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) { return { success: false, message: error.message }; }
}