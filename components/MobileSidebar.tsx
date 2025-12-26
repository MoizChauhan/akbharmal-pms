"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface MobileSidebarProps {
    activeModules: string[];
}

export const MobileSidebar = ({ activeModules }: MobileSidebarProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-slate-900 border-none text-white w-72">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Sidebar className="h-full" activeModules={activeModules} />
            </SheetContent>
        </Sheet>
    );
};
