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
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ----------------------------------------------------------------------------
// Glass Table
// ----------------------------------------------------------------------------

export const GlassTable = ({ data }: { data: any[] }) => {
    const router = useRouter();
    const [editingItem, setEditingItem] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Form States
    const [type, setType] = useState("");
    const [color, setColor] = useState("");
    const [mmRange, setMmRange] = useState("");
    const [price, setPrice] = useState(0);

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setType(item.type);
        setColor(item.color);
        setMmRange(item.mmRange);
        setPrice(item.pricePerSqFt);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const res = await fetch(`/api/cms/glass/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed");
            toast.success("Deleted successfully");
            router.refresh();
        } catch (e) {
            toast.error("Failed to delete");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/cms/glass/${editingItem.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ type, color, mmRange, pricePerSqFt: price })
            });

            if (!res.ok) throw new Error("Failed");
            toast.success("Updated successfully");
            setEditingItem(null);
            router.refresh();
        } catch (e) {
            toast.error("Failed to update");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Range (mm)</TableHead>
                            <TableHead>Price/SqFt</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.type}</TableCell>
                                <TableCell>{item.color}</TableCell>
                                <TableCell>{item.mmRange}</TableCell>
                                <TableCell>₹{item.pricePerSqFt}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                            <Edit className="w-4 h-4 text-indigo-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No records</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Glass Master</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Input value={type} onChange={e => setType(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <Input value={color} onChange={e => setColor(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>mm Range</Label>
                                <Input value={mmRange} onChange={e => setMmRange(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Price (₹/SqFt)</Label>
                                <Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setEditingItem(null)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

// ----------------------------------------------------------------------------
// Aluminum Table
// ----------------------------------------------------------------------------

export const AluminumTable = ({ data }: { data: any[] }) => {
    const router = useRouter();
    const [editingItem, setEditingItem] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Form States
    const [buildType, setBuildType] = useState("");
    const [price, setPrice] = useState(0);
    const [constants, setConstants] = useState({
        bearingOffset: 0,
        handleOffset: 0,
        glassWidthOffset: 0,
        glassHeightOffset: 0
    });

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setBuildType(item.buildType);
        setPrice(item.pricePerSqFt);
        setConstants({
            bearingOffset: item.constants.bearingOffset || 0,
            handleOffset: item.constants.handleOffset || 0,
            glassWidthOffset: item.constants.glassWidthOffset || 0,
            glassHeightOffset: item.constants.glassHeightOffset || 0
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const res = await fetch(`/api/cms/aluminum/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed");
            toast.success("Deleted successfully");
            router.refresh();
        } catch (e) {
            toast.error("Failed to delete");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/cms/aluminum/${editingItem.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    buildType,
                    pricePerSqFt: price,
                    constants
                })
            });

            if (!res.ok) throw new Error("Failed");
            toast.success("Updated successfully");
            setEditingItem(null);
            router.refresh();
        } catch (e) {
            toast.error("Failed to update");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[200px]">Build Type</TableHead>
                            <TableHead className="w-[100px]">Rate</TableHead>
                            <TableHead>Constants</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium align-top">{item.buildType}</TableCell>
                                <TableCell className="align-top">₹{item.pricePerSqFt}</TableCell>
                                <TableCell>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                        <div className="bg-slate-50 border rounded p-1">
                                            <span className="text-muted-foreground block text-[10px] uppercase">Bearing</span>
                                            <span className="font-mono font-medium">{item.constants.bearingOffset}</span>
                                        </div>
                                        <div className="bg-slate-50 border rounded p-1">
                                            <span className="text-muted-foreground block text-[10px] uppercase">Handle</span>
                                            <span className="font-mono font-medium">{item.constants.handleOffset}</span>
                                        </div>
                                        <div className="bg-slate-50 border rounded p-1">
                                            <span className="text-muted-foreground block text-[10px] uppercase">Glass W</span>
                                            <span className="font-mono font-medium">{item.constants.glassWidthOffset}</span>
                                        </div>
                                        <div className="bg-slate-50 border rounded p-1">
                                            <span className="text-muted-foreground block text-[10px] uppercase">Glass H</span>
                                            <span className="font-mono font-medium">{item.constants.glassHeightOffset}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right align-top">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                            <Edit className="w-4 h-4 text-indigo-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No records</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Aluminum Master</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1 space-y-2">
                                <Label>Build Type</Label>
                                <Input value={buildType} onChange={e => setBuildType(e.target.value)} required />
                            </div>
                            <div className="col-span-1 space-y-2">
                                <Label>Rate (₹/SqFt)</Label>
                                <Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required />
                            </div>
                        </div>

                        <div className="space-y-4 border rounded-md p-4 bg-slate-50">
                            <Label className="text-sm font-semibold text-slate-900">Manufacturing Constants (Offsets)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Bearing Offset</Label>
                                    <Input type="number" step="0.001" value={constants.bearingOffset} onChange={e => setConstants({ ...constants, bearingOffset: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Handle Offset</Label>
                                    <Input type="number" step="0.001" value={constants.handleOffset} onChange={e => setConstants({ ...constants, handleOffset: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Glass Width Offset</Label>
                                    <Input type="number" step="0.001" value={constants.glassWidthOffset} onChange={e => setConstants({ ...constants, glassWidthOffset: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Glass Height Offset</Label>
                                    <Input type="number" step="0.001" value={constants.glassHeightOffset} onChange={e => setConstants({ ...constants, glassHeightOffset: Number(e.target.value) })} />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setEditingItem(null)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
