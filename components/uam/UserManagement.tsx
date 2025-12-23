"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface UserManagementProps {
    users: any[];
}

const MODULES = [
    "Dashboard",
    "Clients",
    "Orders",
    "Workshop",
    "CMS",
    "UAM",
    "Accounts"
];

export const UserManagement = ({ users }: UserManagementProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const toggleModule = async (userId: string, currentModules: string[], moduleName: string) => {
        setLoading(userId + moduleName);
        const newModules = currentModules.includes(moduleName)
            ? currentModules.filter((m) => m !== moduleName)
            : [...currentModules, moduleName];

        try {
            const response = await fetch(`/api/users/${userId}/modules`, {
                method: "POST",
                body: JSON.stringify({ modules: newModules }),
            });

            if (!response.ok) throw new Error("Failed to update");

            toast.success(`Updated ${moduleName} access`);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update user access");
        } finally {
            setLoading(null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Permissions</CardTitle>
                <CardDescription>
                    Enable or disable access to specific modules for each user.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            {MODULES.map((module) => (
                                <TableHead key={module} className="text-center">
                                    {module}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </TableCell>
                                {MODULES.map((module) => {
                                    const activeModules = (user.activeModules as string[]) || [];
                                    const isActive = activeModules.includes(module);
                                    return (
                                        <TableCell key={module} className="text-center">
                                            <Switch
                                                checked={isActive}
                                                disabled={loading === user.id + module}
                                                onCheckedChange={() => toggleModule(user.id, activeModules, module)}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={MODULES.length + 1} className="text-center py-10 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
