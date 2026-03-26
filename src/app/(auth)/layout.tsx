"use client";

// ─── Auth Route Group Layout (Centered & White Glassy Theme) ──────────────────
// Fixed: Added proper vertical centering and removed extra wrapper gaps.

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* 🎨 Ambient Glow Blobs (Brand Colors) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-orange-100/50 blur-[100px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-emerald-100/40 blur-[120px]"
            />

            {/* 🌫️ Subtle Mesh Pattern */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(15, 27, 51, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 27, 51, 0.03) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                }}
            />

            {/* Content Wrapper - Ensuring it takes full centering power */}
            <main className="relative z-10 w-full flex items-center justify-center">
                {children}
            </main>

            {/* Sub-footer (Optional) */}
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-10">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Nighwan Technology Secure Portal
                </p>
            </div>
        </div>
    );
}