// ─── Persistent User Store (Dev) ─────────────────────────────────────────────
//
// WHY global.*:
//   Next.js hot-module replacement (HMR) re-evaluates every module on each
//   file save, which would reset a plain module-level `const USERS = new Map()`
//   back to empty — wiping out any users who signed up earlier that session.
//
//   Attaching the Map to the Node.js `global` object bypasses HMR: `global` is
//   per-process and survives module re-evaluation, so the store persists across
//   hot reloads for the entire lifetime of the dev server.
//
// 🔄 SWAP FOR REAL DB: Replace `getUsers()` calls in auth.ts with Prisma /
//    Drizzle / Supabase queries and delete this file.

export type StoredUser = {
    id: string;
    name: string;
    email: string;
    passwordHash: string; // SHA-256 hex
    role: "admin" | "user";
};

// Augment the Node.js global type so TypeScript doesn't complain.
declare global {
    // eslint-disable-next-line no-var
    var __nighwanUsers: Map<string, StoredUser> | undefined;
}

// ── Seed the admin account ONCE per process ───────────────────────────────────
function seedAdmin(store: Map<string, StoredUser>) {
    const adminEmail = "admin@nighwan.tech";
    if (!store.has(adminEmail)) {
        store.set(adminEmail, {
            id: "u_admin_001",
            name: "Pawan Kumar",
            email: adminEmail,
            // SHA-256("Admin@1234")
            passwordHash:
                "bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24",
            role: "admin",
        });
        console.log("[users-db] Admin account seeded.");
    }
}

// ── Accessor — always returns the same Map instance ───────────────────────────
export function getUsers(): Map<string, StoredUser> {
    if (!global.__nighwanUsers) {
        global.__nighwanUsers = new Map<string, StoredUser>();
        seedAdmin(global.__nighwanUsers);
        console.log("[users-db] User store initialised (new process or first access).");
    }
    return global.__nighwanUsers;
}

// ── Convenience CRUD helpers ──────────────────────────────────────────────────
export function findUserByEmail(email: string): StoredUser | undefined {
    return getUsers().get(email.toLowerCase().trim());
}

export function userExistsByEmail(email: string): boolean {
    return getUsers().has(email.toLowerCase().trim());
}

export function saveUser(user: StoredUser): void {
    getUsers().set(user.email, user);
}
