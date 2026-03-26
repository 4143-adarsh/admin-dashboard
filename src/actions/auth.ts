'use server'

import { cookies } from 'next/headers';

// 🔥 Type definition jo aapke UI components mein use hui hai
export type AuthActionResult = {
    success: boolean;
    error?: string;
    userName?: string;
    redirectTo?: string;
    message?: string;
    data?: any;
};

// Aapke naye backend ka URL
const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:5000/api/admin-auth';
// ==========================================
// 1. SIGNUP (Create Admin Account)
// ==========================================
export async function signupAction(prevState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password }),
            cache: 'no-store'
        });
        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.message || 'Signup failed');

        return { success: true, userName: data.userName };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// 2. LOGIN (Authenticate & Set Cookie)
// ==========================================
export async function loginAction(prevState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            cache: 'no-store'
        });
        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.message || 'Invalid email or password');

        // 🚀 SMART NEXT.JS MOVE: Save token in secure HTTP-only cookie
        cookies().set('admin_token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 days valid
        });

        return { success: true, redirectTo: data.redirectTo || '/crm-dashboard' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// 3. FORGOT PASSWORD (Send Reset Link)
// ==========================================
export async function forgotPasswordAction(prevState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
    const email = formData.get('email') as string;

    try {
        const res = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            cache: 'no-store'
        });
        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send reset link');

        return { success: true, message: data.message };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// 4. RESET PASSWORD 
// ==========================================
export async function resetPasswordAction(token: string, prevState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
    const password = formData.get('password') as string;

    try {
        const res = await fetch(`${API_URL}/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
            cache: 'no-store'
        });
        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.message || 'Password reset failed');

        return { success: true, message: data.message };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// 5. GET PROFILE (Uses Saved Cookie)
// ==========================================
export async function getProfileAction() {
    const token = cookies().get('admin_token')?.value;
    
    if (!token) return { success: false, message: 'Not logged in' };

    try {
        const res = await fetch(`${API_URL}/profile`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// ==========================================
// 6. UPDATE PROFILE
// ==========================================
export async function updateProfileAction(prevState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
    const token = cookies().get('admin_token')?.value;
    if (!token) return { success: false, error: 'Unauthorized' };

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;

    try {
        const res = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ fullName, email }),
            cache: 'no-store'
        });
        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.message || 'Update failed');

        return { success: true, data: data.data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// 🎁 BONUS: LOGOUT ACTION
// ==========================================
export async function logoutAction() {
    cookies().delete('admin_token');
    return { success: true, redirectTo: '/login' };
}