"use client";

import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAccountNavProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}

export const UserAccountNav = ({ user }: UserAccountNavProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <Avatar>
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-sky-500 text-white">
                        {user.name?.[0]?.toUpperCase() || <User />}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
