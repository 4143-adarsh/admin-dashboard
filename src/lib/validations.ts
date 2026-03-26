// ─── Auth Input Validators ────────────────────────────────────────────────────

export interface AuthError {
    field?: string;
    message: string;
}

// ── Login ─────────────────────────────────────────────────────────────────────
export function validateLoginInput(
    email: string,
    password: string
): AuthError | null {
    if (!email.trim()) return { field: "email", message: "Email is required." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { field: "email", message: "Enter a valid email address." };
    if (!password) return { field: "password", message: "Password is required." };
    if (password.length < 6)
        return { field: "password", message: "Password must be at least 6 characters." };
    return null;
}

// ── Signup ────────────────────────────────────────────────────────────────────
export function validateSignupInput(
    fullName: string,
    email: string,
    password: string
): AuthError | null {
    if (!fullName.trim()) return { field: "fullName", message: "Full name is required." };
    if (fullName.trim().length < 2)
        return { field: "fullName", message: "Name must be at least 2 characters." };
    if (!email.trim()) return { field: "email", message: "Email is required." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { field: "email", message: "Enter a valid email address." };
    if (!password) return { field: "password", message: "Password is required." };
    if (password.length < 8)
        return { field: "password", message: "Password must be at least 8 characters." };
    if (!/[A-Z]/.test(password))
        return { field: "password", message: "Password must contain at least one uppercase letter." };
    if (!/[0-9]/.test(password))
        return { field: "password", message: "Password must contain at least one number." };
    return null;
}
