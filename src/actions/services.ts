"use server";

async function fetchWithToken(url: string, options: RequestInit = {}) {
    const token = cookies().get('admin_token')?.value;
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', "Bearer " + token);
    }
    return fetch(url, { ...options, headers });
}

// File: actions/services.ts (Admin Panel)

import { cookies } from 'next/headers';


import { revalidatePath } from 'next/cache';

// 🔥 DYNAMIC API URL (Local vs Production)
const getBaseUrl = () => {
    // 🛡️ Pro-tip: 127.0.0.1 ki jagah localhost use karna better hota hai development mein
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:5000"; 
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

const API_URL = `${getBaseUrl()}/api/services`;

// Helper for Response handling
async function handleResponse(res: Response) {
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend didn't return JSON.");
    }
    return await res.json();
}

// 1. Fetch all services (Table ke liye)
export async function getServices() {
  try {
    const res = await fetchWithToken(API_URL, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

// 2. Delete a single service
export async function deleteService(id: number) {
  try {
    const res = await fetchWithToken(`${API_URL}/${id}`, { method: 'DELETE' });
    const data = await handleResponse(res);
    if (data.success) {
        revalidatePath('/services');
        revalidatePath('/(public)/services/[slug]', 'page'); // 🔥 Website cache clear
    }
    return data;
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Failed to delete" };
  }
}

// 3. Toggle Quick Update (New Tag, Home Toggle etc.)
export async function updateServiceToggle(id: number, updateData: any) {
  try {
    const res = await fetchWithToken(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await handleResponse(res);
    if (data.success) {
        revalidatePath('/services');
    }
    return data;
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "Failed to update" };
  }
}

// 4. Create a new service (Pricing data ab isme include hoga)
export async function createService(serviceData: any) {
  try {
    const res = await fetchWithToken(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    const data = await handleResponse(res);
    if (data.success) {
        revalidatePath('/services');
        revalidatePath('/(public)/services/[slug]', 'page');
    }
    return data;
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "System Error: Failed to create" };
  }
}

// 5. Fetch a SINGLE service by ID (Edit page pre-fill ke liye)
export async function getServiceById(id: number) {
  try {
    const res = await fetchWithToken(`${API_URL}/${id}`, { cache: 'no-store' });
    const data = await handleResponse(res);
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    return null;
  }
}

// 6. Update Full Service (Pricing Plans ab database mein jayenge)
export async function updateService(id: number, serviceData: any) {
  try {
    const res = await fetchWithToken(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    const data = await handleResponse(res);
    if (data.success) {
        revalidatePath('/services');
        revalidatePath('/(public)/services/[slug]', 'page'); // 🔥 Pricing update hote hi website refresh
    }
    return data;
  } catch (error) {
    console.error(`Error updating service ${id}:`, error);
    return { success: false, error: "System Error: Failed to update" };
  }
}