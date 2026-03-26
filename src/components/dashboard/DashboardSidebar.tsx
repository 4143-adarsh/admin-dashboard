"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Users,
    Briefcase,
    TrendingUp,
    LifeBuoy,
    ChevronRight,
    Layout,
    Mail,
    CreditCard,
    FileStack // 🔥 NAYA ADD KIYA: Documents ke liye icon
} from 'lucide-react';

interface DashboardSidebarProps {
    isCollapsed: boolean;
}

type MenuItem = {
    icon: any;
    label: string;
    href?: string;
    children?: {
        name: string;
        href?: string;
        subItems?: { name: string; href: string }[]
    }[];
};

const menuItems: MenuItem[] = [
    { icon: BarChart3, label: 'Dashboard', href: '/crm-dashboard' },
    
    // Yahan aage chalke '#' ko '/clients' aur '/client-users' se replace kar lenge
    { icon: Users, label: 'Customers', children: [{ name: 'Clients', href: '/clients' }, { name: 'Client Users', href: '/client-users' }] },

    { icon: TrendingUp, label: 'Sales', children: [{ name: 'Leads', href: '#' }, { name: 'Invoices', href: '/invoices' }, { name: 'Proposals', href: '#' }, { name: 'Contracts', href: '#' }, { name: 'Expenses', href: '#' }] },

    { icon: Briefcase, label: 'Projects', href: '/projects' },

    { icon: CreditCard, label: 'Payments & Invoices', href: '/invoices' },

    // 🔥 NAYA ADD KIYA: Shared Documents wala menu
    { icon: FileStack, label: 'Shared Documents', href: '/documents' },

    {
        icon: Layout,
        label: 'Website Content',
        children: [
            {
                name: 'Home Page',
                subItems: [
                    { name: 'Client Logos', href: '/sliders' },
                    { name: 'Services', href: '/services' },
                    { name: 'Career', href: '/career' }
                ]
            }
        ]
    },

    { icon: Mail, label: 'Contact Messages', href: '/contact' },

    // 🔥 SUPPORT SECTION
    { 
        icon: LifeBuoy, 
        label: 'Support', 
        children: [
            { name: 'Tickets', href: '/support/tickets' }, 
            { name: 'Knowledgebase', href: '/knowledgebase' } 
        ] 
    },
];

export const DashboardSidebar = ({ isCollapsed }: DashboardSidebarProps) => {
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    useEffect(() => {
        if (isCollapsed) {
            setOpenMenu(null);
            return;
        }

        const activeItem = menuItems.find(item =>
            item.children?.some(child => {
                if (child.subItems) {
                    return child.subItems.some(sub => sub.href !== '#' && pathname.startsWith(sub.href));
                }
                return child.href && child.href !== '#' && pathname.startsWith(child.href);
            })
        );

        if (activeItem) {
            setOpenMenu(activeItem.label);
        }
    }, [pathname, isCollapsed]);

    const toggleMenu = (label: string) => {
        if (isCollapsed) return;
        setOpenMenu((prev) => (prev === label ? null : label));
    };

    return (
        <aside className={`shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
            <div className="h-16 flex items-center border-b border-slate-100 shrink-0 overflow-hidden px-3">
                {isCollapsed ? (
                    <div className="mx-auto">
                        <img src="/images/nighlogo-Bxm7gxow.svg" alt="Nighwan" className="h-9 w-9 object-contain" />
                    </div>
                ) : (
                    <Link href="/crm-dashboard" className="flex items-center select-none">
                        <img src="/images/nighlogo-Bxm7gxow.svg" alt="Nighwan Technology" className="h-12 w-auto object-contain" />
                    </Link>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-3 overflow-x-hidden">
                {menuItems.map((item) => {
                    const hasChildren = !!item.children?.length;
                    const isOpen = openMenu === item.label;

                    const isActive = !hasChildren && item.href && item.href !== '#' && (pathname === item.href || pathname.startsWith(item.href + '/'));
                    const isChildActive = hasChildren && item.children?.some(child => {
                        if (child.subItems) {
                            return child.subItems.some(sub => sub.href !== '#' && pathname.startsWith(sub.href));
                        }
                        return child.href && child.href !== '#' && pathname.startsWith(child.href);
                    });

                    if (hasChildren) {
                        return (
                            <div key={item.label}>
                                <button
                                    title={isCollapsed ? item.label : undefined}
                                    onClick={() => toggleMenu(item.label)}
                                    className={`w-full flex items-center py-2.5 cursor-pointer hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors duration-200 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'} ${(isOpen || isChildActive) ? 'bg-orange-50/30' : ''}`}
                                >
                                    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                                        <item.icon size={20} strokeWidth={1.5} className={`shrink-0 ${isChildActive ? 'text-orange-500' : 'text-slate-400'}`} />
                                        {!isCollapsed && (
                                            <span className={`text-[13.5px] font-medium ${isChildActive ? 'text-orange-600' : ''}`}>{item.label}</span>
                                        )}
                                    </div>
                                    {!isCollapsed && (
                                        <ChevronRight size={15} strokeWidth={2} className={`text-slate-300 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                                    )}
                                </button>

                                {!isCollapsed && (
                                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <div className="border-l-2 border-slate-100 ml-[28px] mb-1 pb-2">

                                                {item.children!.map((child) => (
                                                    <div key={child.name} className="mt-1">
                                                        {child.subItems ? (
                                                            <div className="mb-2">
                                                                <span className="block px-5 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                                    {child.name}
                                                                </span>
                                                                {child.subItems.map((sub) => (
                                                                    <Link
                                                                        key={sub.name}
                                                                        href={sub.href}
                                                                        className={`block pl-8 pr-5 py-2 text-[13px] transition-colors duration-200 ${pathname === sub.href ? 'text-orange-500 font-medium bg-slate-50 relative before:absolute before:left-[-2px] before:top-0 before:h-full before:w-[2px] before:bg-orange-500' : 'text-slate-500 hover:text-orange-500 hover:bg-slate-50'}`}
                                                                    >
                                                                        {sub.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <Link
                                                                href={child.href!}
                                                                className={`block px-5 py-2 text-[13px] transition-colors duration-200 ${pathname === child.href ? 'text-orange-500 font-medium bg-slate-50 relative before:absolute before:left-[-2px] before:top-0 before:h-full before:w-[2px] before:bg-orange-500' : 'text-slate-500 hover:text-orange-500 hover:bg-slate-50'}`}
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.href!}
                            title={isCollapsed ? item.label : undefined}
                            className={`flex items-center py-2.5 hover:bg-slate-50 transition-colors duration-200 group ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-5'} ${isActive ? 'bg-orange-50 text-orange-500' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            <item.icon size={20} strokeWidth={1.5} className={`shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-700'}`} />
                            {!isCollapsed && <span className="text-[13.5px] font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};