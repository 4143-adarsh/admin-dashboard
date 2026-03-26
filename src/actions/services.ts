// File: actions/services.ts
"use server";

import { revalidatePath } from 'next/cache';

// 🔥 DYNAMIC API URL (Local vs Production)
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:5000";
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";
};

const API_URL = `${getBaseUrl()}/api/services`;

// 1. Fetch all services
export async function getServices() {
  try {
    const res = await fetch(API_URL, { cache: 'no-store' }); // Hamesha fresh data layega
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
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) revalidatePath('/services');
    return data;
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Failed to delete" };
  }
}

// 3. Toggle Feature / Home status (Quick Update)
export async function updateServiceToggle(id: number, updateData: any) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (data.success) revalidatePath('/services');
    return data;
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "Failed to update" };
  }
}

// 4. Create a new service 
export async function createService(serviceData: any) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (data.success) revalidatePath('/services');
    return data;
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "System Error: Failed to create" };
  }
}

// 🚀 NAYA: 5. Fetch a SINGLE service by ID (Edit page ke liye)
export async function getServiceById(id: number) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    return null;
  }
}

// 🚀 NAYA: 6. Update Full Service (Form se edit karne ke baad)
export async function updateService(id: number, serviceData: any) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (data.success) revalidatePath('/services');
    return data;
  } catch (error) {
    console.error(`Error updating service ${id}:`, error);
    return { success: false, error: "System Error: Failed to update" };
  }
}