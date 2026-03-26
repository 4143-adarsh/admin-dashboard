// ─── JWT Session Helpers ──────────────────────────────────────────────────────
// Uses `jose` which is already bundled inside Next.js — zero extra packages.
// Works in both Node.js (server actions) and Edge (middleware).

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

// ── Constants ─────────────────────────────────────────────────────────────────
export const SESSION_COOKIE = "nighwan_session";

// Secret key — in production set NEXTAUTH_SECRET in .env.local
const RAW_SECRET = process.env.JWT_SECRET ?? "nighwan-super-secret-dev-key-change-me";
const SECRET = new TextEncoder().encode(RAW_SECRET);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SessionPayload extends JWTPayload {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
}

// ── Sign Token ────────────────────────────────────────────────────────────────
export async function signToken(payload: Omit<SessionPayload, keyof JWTPayload>): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET);
}

// ── Verify Token ──────────────────────────────────────────────────────────────
// Returns the decoded payload, or null if invalid / expired.
export async function verifyToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET, {
            algorithms: ["HS256"],
        });
        return payload as SessionPayload;
    } catch {
        return null;
    }
}

// ── getSession ────────────────────────────────────────────────────────────────
// Server-components / server-actions helper.
// Returns the decoded session or null (no redirect — caller decides).
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
}

// ── Cookie Options ────────────────────────────────────────────────────────────
export const SESSION_COOKIE_OPTIONS = {
    httpOnly: true, // Critical for security and accessibility
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/", // Critical for across-domain accessibility
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
};
