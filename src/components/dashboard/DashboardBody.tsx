'use client';

import React from 'react';
import { KPICard } from './KPICard';
import { RevenueChart } from './RevenueChart';
import { LeadsChart } from './LeadsChart';
import { CreditCard, Wallet, Calendar, AlertCircle } from 'lucide-react';

export const DashboardBody = () => {
    return (
        <div className="w-full min-h-full bg-gray-50 flex flex-col p-6 space-y-6">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    label="Payments - Today"
                    value="$2,773.75"
                    icon={CreditCard}
                    borderColor="border-teal-400"
                    iconColor="text-teal-400"
                />
                <KPICard
                    label="Payments - Month"
                    value="$2,773.75"
                    icon={Wallet}
                    borderColor="border-sky-400"
                    iconColor="text-sky-400"
                />
                <KPICard
                    label="Invoices - Due"
                    value="$0.00"
                    icon={Calendar}
                    borderColor="border-orange-400"
                    iconColor="text-orange-400"
                />
                <KPICard
                    label="Invoices - Overdue"
                    value="$973.70"
                    icon={AlertCircle}
                    borderColor="border-rose-400"
                    iconColor="text-rose-400"
                />
            </div>

            {/* Charts Section */}
            <div className="flex flex-col lg:flex-row gap-6">
                <RevenueChart />
                <LeadsChart />
            </div>
        </div>
    );
};
