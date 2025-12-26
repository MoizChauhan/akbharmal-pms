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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Plus, UserPlus } from "lucide-react";

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
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Edit States
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPassword, setEditPassword] = useState(""); // Only if changing
    const [editModules, setEditModules] = useState<string[]>([]);

    const openAddDialog = () => {
        setName("");
        setEmail("");
        setPassword("");
        setIsAddOpen(true);
    };

    const openEditDialog = (user: any) => {
        setSelectedUser(user);
        setEditName(user.name || "");
        setEditEmail(user.email || "");
        setEditPassword(""); // Reset password field
        setEditModules((user.activeModules as string[]) || ["Workshop"]); // Default to stored or Workshop if empty (legacy)
        setIsEditOpen(true);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) throw new Error("Failed");

            toast.success("User created successfully");
            setIsAddOpen(false);
            router.refresh();
        } catch (e) {
            toast.error("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setLoading(true);

        const payload: any = {
            name: editName,
            email: editEmail,
            modules: editModules
        };

        if (editPassword) {
            payload.password = editPassword;
        }

        try {
            const res = await fetch(`/api/users/${selectedUser.id}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed");

            toast.success("User updated successfully");
            setIsEditOpen(false);
            router.refresh();
        } catch (e) {
            toast.error("Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    const toggleEditModule = (moduleName: string) => {
        setEditModules(prev =>
            prev.includes(moduleName)
                ? prev.filter(m => m !== moduleName)
                : [...prev, moduleName]
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>User Permissions</CardTitle>
                    <CardDescription>
                        Manage system users and their access rights.
                    </CardDescription>
                </div>
                <Button onClick={openAddDialog}>
                    <UserPlus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Access Level</TableHead>
                            <TableHead className="text-right">Action</TableHead>
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
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {(user.activeModules as string[] || []).map(m => (
                                            <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded border border-slate-200 uppercase font-semibold">
                                                {m}
                                            </span>
                                        ))}
                                        {(!user.activeModules || (user.activeModules as string[]).length === 0) && (
                                            <span className="text-muted-foreground text-sm italic">No access</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                                        <Eye className="w-4 h-4 text-indigo-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {/* ADD USER DIALOG */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user. Default access is 'Workshop' only.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT USER DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
                        <DialogDescription>Update profile or modify access permissions.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateUser} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={editName} onChange={e => setEditName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required />
                            </div>
                            <div className="col-span-2 space-y-2 p-3 bg-slate-50 rounded border">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Change Password (Optional)</Label>
                                <Input
                                    type="password"
                                    value={editPassword}
                                    onChange={e => setEditPassword(e.target.value)}
                                    placeholder="Leave blank to keep current"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-900">Module Access</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {MODULES.map(m => (
                                    <div key={m} className="flex items-center justify-between space-x-2 border p-2 rounded hover:bg-slate-50 transition-colors">
                                        <Label htmlFor={`switch-${m}`} className="cursor-pointer flex-1">{m}</Label>
                                        <Switch
                                            id={`switch-${m}`}
                                            checked={editModules.includes(m)}
                                            onCheckedChange={() => toggleEditModule(m)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
