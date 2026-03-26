'use server'

// 🔥 DYNAMIC API URL (Local vs Production)
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:5000";
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

const API_URL = `${getBaseUrl()}/api/clients`;

// 1. CREATE: Naya Client Add Karna
export async function createClientAction(formData: any) {
    try {
        const res = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// 2. READ ALL: Admin Table ke liye saare clients lana
export async function getAllClientsAction() {
    try {
        const res = await fetch(`${API_URL}/all`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// 3. READ ACTIVE (6th API): Dropdowns ke liye sirf chalu clients lana
export async function getActiveClientsAction() {
    try {
        const res = await fetch(`${API_URL}/active`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// 4. READ SINGLE: Kisi ek client ki detail lana (Edit Form ke liye)
export async function getClientByIdAction(id: number | string) {
    try {
        const res = await fetch(`${API_URL}/${id}`, { cache: 'no-store' });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// 5. UPDATE: Client ki details edit karna
export async function updateClientAction(id: number | string, updateData: any) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// 6. DELETE: Client ko udana (Sath mein uske documents bhi ud jayenge cascade se!)
export async function deleteClientAction(id: number | string) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// ==========================================
// 🔥 7. UPLOAD CSV: Bulk Client Import (NAYA ADD KIYA)
// ==========================================
export async function uploadClientsCSVAction(formData: FormData) {
    try {
        const res = await fetch(`${API_URL}/upload-csv`, {
            method: 'POST',
            body: formData, // Dhyan rahe: Yahan JSON stringify nahi kiya kyunki ye ek File hai
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}