'use client';

import { useState, useEffect } from 'react';

export interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
}

export function useSession() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Provide a fallback simulated session to fix module errors
        // since the original hooks were removed during folder restructure
        const checkSession = async () => {
            try {
                setUser({
                    id: '1',
                    name: 'Admin User',
                    email: 'admin@nighwan.com',
                    role: 'Admin'
                });
            } catch (error) {
                console.error('Session error', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    return { user, isLoading };
}
