'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, Save, Loader2, User, Mail, Phone, Globe, DollarSign, MessageSquare, ChevronDown 
} from 'lucide-react';
import { toast } from 'sonner';
import { createLeadAction } from '@/actions/leadAction';

export default function CreateLeadPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State (Aapke database fields ke hisaab se)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        sourcePage: 'Direct',
        budget: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const res = await createLeadAction(formData);

        if (res && res.success) {
            toast.success("Lead created successfully!");
            router.push('/leads'); // Save hone ke baad wapas table wale page par bhej dega
        } else {
            toast.error(res?.message || "Failed to create lead");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 w-full max-w-[900px] mx-auto bg-white min-h-screen font-sans">
            
            {/* Header */}
            <div className="mb-8">
                <Link href="/leads" className="inline-flex items-center gap-2 text-[13px] text-gray-400 hover:text-[#2cb1c4] transition-colors mb-4">
                    <ArrowLeft size={14} /> Back to Leads
                </Link>
                <h1 className="text-[2.2rem] font-light text-[#2cb1c4] tracking-wide mb-1">Add New Lead</h1>
                <p className="text-[13px] text-gray-500">Fill in the details below to create a new contact lead.</p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Grid for Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Full Name */}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" name="fullName" required
                                    value={formData.fullName} onChange={handleChange}
                                    placeholder="e.g. Rahul Sharma" 
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#2cb1c4] focus:ring-1 focus:ring-[#2cb1c4] transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="email" name="email" required
                                    value={formData.email} onChange={handleChange}
                                    placeholder="e.g. rahul@example.com" 
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#2cb1c4] focus:ring-1 focus:ring-[#2cb1c4] transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="tel" name="phone" required
                                    value={formData.phone} onChange={handleChange}
                                    placeholder="e.g. 9876543210" 
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#2cb1c4] focus:ring-1 focus:ring-[#2cb1c4] transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Source Page */}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Lead Source</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select 
                                    name="sourcePage" 
                                    value={formData.sourcePage} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:border-[#2cb1c4] focus:ring-1 focus:ring-[#2cb1c4] transition-all appearance-none bg-white cursor-pointer"
                                >
                                    <option value="Direct">Direct</option>
                                    <option value="Website">Website</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Social Media">Social Media</option>
                                    <option value="Other">Other</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Estimated Budget (Optional)</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" name="budget" 
                                    value={formData.budget} onChange={handleChange}
                                    placeholder="e.g. ₹50,000 - ₹1,00,000" 
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#2cb1c4] focus:ring-1 focus:ring-[#2cb1c4] transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Client Message / Notes</label>
                            <div className="relative">
                                <MessageSquare size={16} className="absolute left-3 top-4 text-gray-400" />
                                <textarea 
                                    name="message" rows={4}
                                    value={formData.message} onChange={handleChange}
                                    placeholder="Write any specific requirements or notes here..." 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#2cb1c4] focus:ring-1 focus:ring-[#2cb1c4] transition-all resize-y placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <Link 
                            href="/leads"
                            className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg text-[13px] font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSubmitting ? 'Saving...' : 'Save Lead'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}