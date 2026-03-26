"use server";

import { revalidatePath } from 'next/cache';

// 🔥 TESTING KE LIYE HARDCODED URL (Jaise Tickets mein hai)
const API_URL = "http://127.0.0.1:5000/api/support/knowledgebase";

// 1. Get All Articles (Admin)
export async function getAdminArticlesAction() {
    try {
        const res = await fetch(`${API_URL}/admin`, {
            cache: "no-store"
        });
        return await res.json();
    } catch (error) {
        console.error("KB Fetch Error:", error);
        return { success: false, message: "Server error" };
    }
}

// 2. Get Single Article (For Editing)
export async function getArticleByIdAction(id: number) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            cache: "no-store"
        });
        return await res.json();
    } catch (error) {
        return { success: false, message: "Server error" };
    }
}

// 3. Create Article
export async function createArticleAction(data: { title: string, content: string, category: string, isActive: boolean }) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (result.success) {
            revalidatePath('/knowledgebase'); // Aapka admin table path
        }
        return result;
    } catch (error) {
        return { success: false, message: "Server error" };
    }
}

// 4. Update Article
export async function updateArticleAction(id: number, data: { title?: string, content?: string, category?: string, isActive?: boolean }) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (result.success) {
            revalidatePath('/support/knowledgebase');
        }
        return result;
    } catch (error) {
        return { success: false, message: "Server error" };
    }
}

// 5. Delete Article
export async function deleteArticleAction(id: number) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        const result = await res.json();
        if (result.success) {
            revalidatePath('/support/knowledgebase');
        }
        return result;
    } catch (error) {
        return { success: false, message: "Server error" };
    }
}