'use server'

import { revalidatePath } from 'next/cache';

// 🔥 DYNAMIC API URL (Local vs Production)
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:5000"; // Localhost for dev
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

const API_URL = getBaseUrl();

// 1. Fetch All Projects
export async function getProjectsAction() {
    console.log("🚀 [GET] Hitting Backend URL:", `${API_URL}/api/projects`);
    try {
        const res = await fetch(`${API_URL}/api/projects`, { cache: 'no-store' });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("❌ GET ERROR: Backend didn't return JSON.");
            return { success: false, message: "API didn't return JSON. Check Backend URL." };
        }

        return await res.json();
    } catch (error) {
        console.error("❌ Action Error (GET):", error);
        return { success: false, message: "Failed to fetch projects. Server might be off." };
    }
}

// 2. Create Project
export async function createProjectAction(formData: any) {
    console.log("🚀 [POST] Hitting Backend URL:", `${API_URL}/api/projects`);
    console.log("📦 Data being sent:", formData); // Dekhte hain data sahi ja raha hai ya nahi

    try {
        const res = await fetch(`${API_URL}/api/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            cache: 'no-store'
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textData = await res.text();
            console.error("❌ POST ERROR: Backend sent HTML instead of JSON. First 50 chars:", textData.substring(0, 50));
            return { success: false, message: "API URL issue: Backend sent HTML instead of JSON." };
        }

        const result = await res.json();
        if (result.success) revalidatePath('/projects');
        return result;
    } catch (error) {
        console.error("❌ Create Action Error (POST):", error);
        return { success: false, message: "Failed to connect to backend server." };
    }
}

// 3. Update Project
export async function updateProjectAction(projectId: string, formData: any) {
    console.log("🚀 [PUT] Hitting Backend URL:", `${API_URL}/api/projects/${projectId}`);
    try {
        const res = await fetch(`${API_URL}/api/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            cache: 'no-store'
        });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { success: false, message: "API didn't return JSON." };
        }

        const result = await res.json();
        if (result.success) revalidatePath('/projects');
        return result;
    } catch (error) {
        return { success: false, message: "Failed to update project" };
    }
}

// 4. Delete Project
export async function deleteProjectAction(projectId: string) {
    console.log("🚀 [DELETE] Hitting Backend URL:", `${API_URL}/api/projects/${projectId}`);
    try {
        const res = await fetch(`${API_URL}/api/projects/${projectId}`, {
            method: 'DELETE',
            cache: 'no-store'
        });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { success: false, message: "API didn't return JSON." };
        }

        const result = await res.json();
        if (result.success) revalidatePath('/projects');
        return result;
    } catch (error) {
        return { success: false, message: "Failed to delete project" };
    }
}