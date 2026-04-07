'use server';
import { cookies } from 'next/headers';

// 🔥 Base URL Logic (Development vs Production)
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:5000";
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

const OPENINGS_API = `${getBaseUrl()}/api/career/openings`;
const APPLICATIONS_API = `${getBaseUrl()}/api/career`;

// 🛡️ Helper: Get Auth Header with Token from Cookies
const getAuthHeaders = () => {
    const token = cookies().get('admin_token')?.value || cookies().get('token')?.value;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// ==========================================
// ✨ 1. JOB OPENINGS CRUD (Admin Panel)
// ==========================================

// GET ALL (Admin - Includes both Active & Inactive)
export async function getAdminJobOpeningsAction() {
    try {
        const res = await fetch(`${OPENINGS_API}/all`, {
            headers: getAuthHeaders(),
            cache: 'no-store' // Hamesha fresh data aaye
        });
        return await res.json();
    } catch (error) {
        console.error("Get Admin Jobs Error:", error);
        return { success: false, data: [] };
    }
}

// CREATE NEW JOB OPENING
export async function createJobOpeningAction(jobData: any) {
    try {
        const res = await fetch(OPENINGS_API, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(jobData),
        });
        return await res.json();
    } catch (error) {
        console.error("Create Job Error:", error);
        return { success: false, message: "Failed to create job opening." };
    }
}

// UPDATE JOB OPENING
export async function updateJobOpeningAction(id: string | number, jobData: any) {
    try {
        const res = await fetch(`${OPENINGS_API}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(jobData),
        });
        return await res.json();
    } catch (error) {
        console.error("Update Job Error:", error);
        return { success: false, message: "Failed to update job opening." };
    }
}

// DELETE JOB OPENING
export async function deleteJobOpeningAction(id: string | number) {
    try {
        const res = await fetch(`${OPENINGS_API}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return await res.json();
    } catch (error) {
        console.error("Delete Job Error:", error);
        return { success: false, message: "Failed to delete job opening." };
    }
}

// TOGGLE STATUS (Active/Inactive switch)
export async function toggleJobStatusAction(id: string | number) {
    try {
        const res = await fetch(`${OPENINGS_API}/${id}/toggle`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
        });
        return await res.json();
    } catch (error) {
        console.error("Toggle Status Error:", error);
        return { success: false, message: "Failed to toggle status." };
    }
}

// ==========================================
// 🚀 2. JOB APPLICATIONS CRUD (Admin Panel)
// ==========================================

// GET ALL APPLICATIONS (Candidates ki list)
export async function getAdminApplicationsAction() {
    try {
        const res = await fetch(APPLICATIONS_API, {
            headers: getAuthHeaders(),
            cache: 'no-store'
        });
        return await res.json();
    } catch (error) {
        console.error("Get Applications Error:", error);
        return { success: false, data: [] };
    }
}

// GET SINGLE APPLICATION BY ID
export async function getApplicationByIdAction(id: string | number) {
    try {
        const res = await fetch(`${APPLICATIONS_API}/${id}`, {
            headers: getAuthHeaders(),
            cache: 'no-store'
        });
        return await res.json();
    } catch (error) {
        console.error("Get Single Application Error:", error);
        return { success: false, message: "Failed to fetch application details." };
    }
}

// UPDATE APPLICATION (For status changes like 'Shortlisted', 'Rejected')
export async function updateApplicationAction(id: string | number, updateData: any) {
    try {
        const res = await fetch(`${APPLICATIONS_API}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updateData),
        });
        return await res.json();
    } catch (error) {
        console.error("Update Application Error:", error);
        return { success: false, message: "Failed to update application." };
    }
}

// DELETE SINGLE APPLICATION
export async function deleteApplicationAction(id: string | number) {
    try {
        const res = await fetch(`${APPLICATIONS_API}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return await res.json();
    } catch (error) {
        console.error("Delete Application Error:", error);
        return { success: false, message: "Failed to delete application." };
    }
}

// DELETE MULTIPLE APPLICATIONS (Bulk Delete - Checkboxes wale feature ke liye)
export async function deleteMultipleApplicationsAction(ids: (string | number)[]) {
    try {
        const res = await fetch(`${APPLICATIONS_API}/DeleteMultiple`, {
            method: 'POST', // Backend route post use kar raha hai bulk delete ke liye
            headers: getAuthHeaders(),
            body: JSON.stringify({ ids }),
        });
        return await res.json();
    } catch (error) {
        console.error("Bulk Delete Applications Error:", error);
        return { success: false, message: "Failed to delete multiple applications." };
    }
}