"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, AlertCircle, CheckCircle2, User, Send, Loader2 } from 'lucide-react';
import { getTicketDetailAction, sendTicketReplyAction } from '@/actions/supportActions';

export default function TicketDetailPage({ params }: { params: { id: string } }) {
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    // 1. Ticket Data Load karna
    useEffect(() => {
        const fetchTicket = async () => {
            const response = await getTicketDetailAction(params.id);
            if (response?.success) {
                setTicket(response.data);
            }
            setLoading(false);
        };
        fetchTicket();
    }, [params.id]);

    // 2. 🔥 SEND REPLY FUNCTION (Asli call yahan hai)
    const handleSendReply = async () => {
        if (!replyText.trim()) {
            alert("Kuch toh likho bhai! 😅");
            return;
        }

        setIsSending(true);
        try {
            // Asli Action Call
            const res = await sendTicketReplyAction(params.id, replyText);

            if (res.success) {
                alert("🚀 Email sent successfully!");
                setReplyText(""); // Box saaf kar do
            } else {
                alert("❌ Error: " + res.message);
            }
        } catch (error) {
            alert("Backend se connection toot gaya!");
        } finally {
            setIsSending(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Open": return <AlertCircle size={16} className="text-amber-500 stroke-[2.5]" />;
            case "In Progress": return <Clock size={16} className="text-[#00b4d8] stroke-[2.5]" />;
            case "Resolved": return <CheckCircle2 size={16} className="text-green-500 stroke-[2.5]" />;
            default: return <CheckCircle2 size={16} className="text-slate-400 stroke-[2.5]" />;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400 font-sans">
            <Loader2 className="animate-spin mb-4 text-[#00b4d8]" size={40} />
            <p className="text-sm font-medium">Loading Ticket Details...</p>
        </div>
    );
    
    if (!ticket) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400 font-sans space-y-4">
            <AlertCircle size={48} className="text-slate-200 stroke-[1.5]" />
            <p className="text-base font-medium text-slate-600">Ticket nahi mila!</p>
            <Link href="/support/tickets" className="text-[#00b4d8] hover:underline text-sm">Return to Tickets</Link>
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-[1000px] mx-auto bg-slate-50 min-h-screen font-sans space-y-6 w-full">
            
            {/* Header with Back Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <Link href="/support/tickets" className="inline-flex items-center text-[13px] font-semibold text-slate-400 hover:text-[#00b4d8] transition-colors">
                    <ArrowLeft size={16} className="mr-1.5 stroke-[2]" /> Back to Tickets
                </Link>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 tracking-widest uppercase">
                    <span>APP</span>
                    <span className="text-slate-300">&gt;</span>
                    <span>TICKET</span>
                    <span className="text-slate-300">&gt;</span>
                    <span className="text-slate-800">DETAIL</span>
                </div>
            </div>

            {/* Ticket Info Header */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="bg-sky-50 text-[#00b4d8] font-mono text-[11px] px-2.5 py-1 rounded border border-sky-100 font-bold tracking-wider">
                            {ticket.ticketId}
                        </span>
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                            {getStatusIcon(ticket.status)}
                            {ticket.status}
                        </div>
                    </div>
                    <h1 className="text-2xl font-light text-[#00b4d8] tracking-wide">{ticket.subject}</h1>
                </div>
                
                {/* Client Info Box */}
                <div className="flex items-center gap-4 bg-slate-50 px-5 py-4 rounded-lg border border-slate-100 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-[#00b4d8] border border-sky-100">
                        <User size={18} className="stroke-[2]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Client Email</p>
                        <p className="text-[14px] font-medium text-slate-700">{ticket.clientEmail}</p>
                    </div>
                </div>
            </div>

            {/* Message Description */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                    <h3 className="text-[13px] font-semibold text-slate-700 tracking-wide">Client Message</h3>
                </div>
                <div className="p-6 md:p-8">
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed font-light text-[15px]">
                        {ticket.message}
                    </p>
                </div>
            </div>

            {/* Reply Box */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
                <h3 className="text-[13px] font-semibold text-slate-700 tracking-wide mb-4">Reply to Client</h3>
                <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-5 text-[14px] font-light text-slate-700 outline-none focus:ring-1 focus:ring-[#00b4d8] focus:border-[#00b4d8] resize-none transition-all disabled:opacity-50 placeholder:text-slate-300"
                    rows={5}
                    placeholder="Type your official reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={isSending}
                ></textarea>
                
                <div className="flex justify-end mt-5">
                    <button 
                        onClick={handleSendReply}
                        disabled={isSending}
                        className="bg-[#0e8bf1] hover:bg-[#0b73c9] text-white font-medium py-2.5 px-8 rounded text-[14px] transition-colors flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {isSending ? "Sending..." : "Send Reply"}
                    </button>
                </div>
            </div>

        </div>
    );
}