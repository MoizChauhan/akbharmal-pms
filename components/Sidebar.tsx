"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Hammer,
    Database,
    ShieldCheck,
    CreditCard,
} from "lucide-react";

// Update routes to have labels matching the seed data and module names
const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Clients",
        icon: Users,
        href: "/clients",
        color: "text-violet-500",
    },
    {
        label: "Orders",
        icon: ShoppingCart,
        href: "/orders",
        color: "text-pink-700",
    },
    {
        label: "Workshop",
        icon: Hammer,
        href: "/workshop",
        color: "text-orange-700",
    },
    {
        label: "Accounts",
        icon: CreditCard,
        href: "/accounts",
        color: "text-indigo-400",
    },
    {
        label: "CMS",
        icon: Database,
        href: "/cms",
        color: "text-emerald-500",
    },
    {
        label: "UAM",
        icon: ShieldCheck,
        href: "/uam",
        color: "text-green-700",
    },
];

interface SidebarProps {
    className?: string;
    activeModules?: string[];
}

export const Sidebar = ({ className, activeModules = [] }: SidebarProps) => {
    const pathname = usePathname();

    // Filter routes based on active modules
    // Dashboard is always available if logged in, others depend on permission
    const filteredRoutes = routes.filter(route =>
        route.label === "Dashboard" || activeModules.includes(route.label)
    );

    return (
        <div className={cn("space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white", className)}>
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">
                        AK Bharmal
                    </h1>
                </Link>
                <div className="space-y-1">
                    {filteredRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname.startsWith(route.href) ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
