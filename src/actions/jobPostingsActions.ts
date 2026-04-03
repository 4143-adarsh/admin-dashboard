// src/actions/jobPostingsActions.ts

// Apna base API URL yahan set karein, ya .env se lein
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; 

export const getJobPostings = async (search = '') => {
    try {
        const response = await fetch(`${API_URL}/jobpostings?search=${search}`, {
            cache: 'no-store' // Dashboard data hamesha fresh hona chahiye
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return { success: false, data: [] };
    }
};

export const createJobPosting = async (data: any) => {
    try {
        const response = await fetch(`${API_URL}/jobpostings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating job:", error);
        return { success: false, message: "Network Error" };
    }
};

export const updateJobPosting = async (id: number | string, data: any) => {
    try {
        const response = await fetch(`${API_URL}/jobpostings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating job:", error);
        return { success: false, message: "Network Error" };
    }
};

export const deleteJobPosting = async (id: number | string) => {
    try {
        const response = await fetch(`${API_URL}/jobpostings/${id}`, {
            method: 'DELETE',
        });
        return await response.json();
    } catch (error) {
        console.error("Error deleting job:", error);
        return { success: false, message: "Network Error" };
    }
};

export const deleteMultipleJobPostings = async (ids: (number | string)[]) => {
    try {
        const response = await fetch(`${API_URL}/jobpostings/DeleteMultiple`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error deleting multiple jobs:", error);
        return { success: false, message: "Network Error" };
    }
};