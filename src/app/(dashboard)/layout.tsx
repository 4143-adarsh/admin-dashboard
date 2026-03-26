'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <DashboardSidebar isCollapsed={isCollapsed} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}