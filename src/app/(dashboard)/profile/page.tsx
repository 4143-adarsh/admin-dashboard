'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Loader2, ShieldCheck } from 'lucide-react';
// Dhyan dein: Agar aapki auth file ka naam 'authAction.ts' hai, toh usko yahan sahi se import karein
import { getProfileAction, updateProfileAction } from '@/actions/auth'; 

export default function ProfilePage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Page load hote hi User ki details lana
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfileAction();
                if (res && res.success && res.data) {
                    setFullName(res.data.fullName || '');
                    setEmail(res.data.email || '');
                }
            } catch (error) {
                console.error("Profile Fetch Error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Form submit karne par details Update karna
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);

        try {
            // Humne pehle action me (prevState, formData) ka pattern banaya tha
            const res = await updateProfileAction({ success: false }, formData);

            if (res.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: res.error || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.type === 'success' && <ShieldCheck size={18} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name Field */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-slate-100 mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}