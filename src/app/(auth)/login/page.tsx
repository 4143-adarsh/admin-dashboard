"use client";

// ─── /login Page ─────────────────────────────────────────────────────────────
// Logic remains EXACTLY the same. Design upgraded to light theme IT Agency style with Forgot Password toggle.

import { useEffect, useState } from "react";
// 🔥 FIX: useActionState (React 19) ko useFormState (React 18) se replace kiya
import { useFormState, useFormStatus } from "react-dom"; 
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, Send, ArrowLeft } from "lucide-react";
import { loginAction, forgotPasswordAction, type AuthActionResult } from "@/actions/auth";

// ── Login Submit Button ─────────────────────────────────────────────────────────────
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <motion.button
            type="submit"
            disabled={pending}
            whileHover={!pending ? { scale: 1.01 } : {}}
            whileTap={!pending ? { scale: 0.99 } : {}}
            className="relative w-full h-12 md:h-14 flex items-center justify-center gap-2 rounded-xl font-bold text-sm md:text-base tracking-wide text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
            {pending ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Logging in…
                </>
            ) : (
                <>
                    <LogIn size={18} />
                    Continue
                </>
            )}
        </motion.button>
    );
}

// ── Forgot Password Submit Button ──────────────────────────────────────────────────
function ForgotSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <motion.button
            type="submit"
            disabled={pending}
            whileHover={!pending ? { scale: 1.01 } : {}}
            whileTap={!pending ? { scale: 0.99 } : {}}
            className="relative w-full h-12 md:h-14 flex items-center justify-center gap-2 rounded-xl font-bold text-sm md:text-base tracking-wide text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
            {pending ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending link…
                </>
            ) : (
                <>
                    <Send size={18} />
                    Send Reset Link
                </>
            )}
        </motion.button>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const initialState: AuthActionResult = { success: false };

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'forgot'>('login');
    // 🔥 FIX: useActionState ki jagah useFormState use kiya gaya hai
    const [state, formAction] = useFormState(loginAction, initialState);
    const [forgotState, forgotFormAction] = useFormState(forgotPasswordAction, initialState);

    const [showPass, setShowPass] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (state.success && state.redirectTo) {
            setRedirecting(true);
            window.location.href = state.redirectTo;
        }
    }, [state]);

    return (
        <div className="min-h-[100dvh] w-full flex bg-[#f8fafc] font-sans relative overflow-hidden">

            {/* ── Left Illustration Area (Hidden on Mobile) ── */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#fff7ed] overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-orange-200/30 blur-[120px] rounded-full z-0" />
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-full flex justify-center items-center"
                >
                    <img
                        src="/images/login.png"
                        alt="IT Solutions and Growth"
                        className="w-[85%] max-w-lg object-contain transition-all duration-1000"
                    />
                </motion.div>
            </div>

            {/* ── Right Auth Form Area ── */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 z-20">

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 md:mb-8">
                    <img src="/images/nighlogo-Bxm7gxow.svg" alt="Nighwan Technology" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="w-full max-w-[420px]">
                    <div className="rounded-2xl md:rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">

                        <div className="px-6 py-8 md:px-8 md:py-10">
                            {/* Heading */}
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                                    {mode === 'login' ? "Sign in to your account" : "Reset your password"}
                                </h2>
                                {mode === 'forgot' && (
                                    <p className="text-sm text-slate-500 mt-3 px-2">Enter your registered email address and we'll send you a link to reset your password.</p>
                                )}
                            </div>

                            {/* Banners */}
                            <AnimatePresence mode="wait">
                                {mode === 'login' && redirecting ? (
                                    <motion.div key="redirecting" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs md:text-sm px-4 py-3 rounded-xl mb-6">
                                        <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                                        <span>Login successful! Redirecting...</span>
                                    </motion.div>
                                ) : mode === 'login' && state?.error ? (
                                    <motion.div key="login-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 text-xs md:text-sm px-4 py-3 rounded-xl mb-6" role="alert">
                                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                                        <span>{state.error}</span>
                                    </motion.div>
                                ) : mode === 'forgot' && forgotState?.error ? (
                                    <motion.div key="forgot-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 text-xs md:text-sm px-4 py-3 rounded-xl mb-6" role="alert">
                                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                                        <span>{forgotState.error}</span>
                                    </motion.div>
                                ) : mode === 'forgot' && forgotState?.success ? (
                                    <motion.div key="forgot-success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs md:text-sm px-4 py-3 rounded-xl mb-6" role="alert">
                                        <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-500" />
                                        <span>Reset link sent! Please check your email.</span>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            {/* Forms Toggle */}
                            {mode === 'login' ? (
                                /* --- 🔐 LOGIN FORM --- */
                                <form action={formAction} className="space-y-5">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandOrange transition-colors duration-300">
                                                <Mail size={18} />
                                            </span>
                                            <input id="email" name="email" type="email" autoComplete="email" required placeholder="admin@example.com" className="w-full pl-11 pr-4 py-3.5 md:py-4 rounded-xl text-base sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brandOrange focus:ring-4 focus:ring-brandOrange/10 transition-all duration-300" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandOrange transition-colors duration-300">
                                                <Lock size={18} />
                                            </span>
                                            <input id="password" name="password" type={showPass ? "text" : "password"} autoComplete="current-password" required placeholder="••••••••" className="w-full pl-11 pr-11 py-3.5 md:py-4 rounded-xl text-base sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brandOrange focus:ring-4 focus:ring-brandOrange/10 transition-all duration-300" />
                                            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brandOrange transition-colors p-1">
                                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center px-1 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brandOrange focus:ring-brandOrange/20 cursor-pointer" />
                                            <span className="text-xs md:text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me</span>
                                        </label>
                                        <button type="button" onClick={() => setMode('forgot')} className="text-xs md:text-sm text-slate-500 hover:text-brandOrange font-medium transition-colors">
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <SubmitButton />
                                </form>
                            ) : (
                                /* --- 📧 FORGOT PASSWORD FORM --- */
                                <form action={forgotFormAction} className="space-y-5">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandOrange transition-colors duration-300">
                                                <Mail size={18} />
                                            </span>
                                            <input id="forgot-email" name="email" type="email" required placeholder="Enter your email" className="w-full pl-11 pr-4 py-3.5 md:py-4 rounded-xl text-base sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brandOrange focus:ring-4 focus:ring-brandOrange/10 transition-all duration-300" />
                                        </div>
                                    </div>

                                    <ForgotSubmitButton />

                                    <div className="flex justify-center mt-6">
                                        <button type="button" onClick={() => setMode('login')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brandOrange font-medium transition-colors p-2">
                                            <ArrowLeft size={16} />
                                            Back to Login
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* 🔥 FIX: Added 'or learn more' using <Link href="/"> exactly like Linear */}
                        {mode === 'login' && (
                            <div className="px-6 py-5 md:px-8 bg-slate-50 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-500">
                                    Don't have an account?{" "}
                                    <Link href="/signup" className="font-bold text-brandOrange hover:text-orange-600 transition-colors ml-1">
                                        Sign Up
                                    </Link>
                                    {" or "}
                                    <Link href="/" className="font-bold text-slate-500 hover:text-textmain hover:underline transition-colors">
                                        learn more
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}