"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderFormProps {
    clients: any[];
    glassMasters: any[];
    aluminumMasters: any[];
}

export const OrderForm = ({ clients, glassMasters, aluminumMasters }: OrderFormProps) => {
    const router = useRouter();
    const [clientId, setClientId] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Current Item State
    const [itemType, setItemType] = useState("glass");
    const [glassId, setGlassId] = useState("");
    const [aluminumId, setAluminumId] = useState("");
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [price, setPrice] = useState<number>(0);
    const [manualDescription, setManualDescription] = useState("");
    const [customGlassDetails, setCustomGlassDetails] = useState({
        type: "",
        color: "",
        mmRange: "4-6mm"
    });

    // Helper for formatting size
    const formatSize = (inches: number) => {
        if (!inches && inches !== 0) return "-";
        const feet = (inches / 12).toFixed(2);
        return `${inches}in (${feet}ft)`;
    };

    // Calculations for Aluminum
    const aluminumCalculations = useMemo(() => {
        if (itemType !== "aluminum" || !aluminumId || !width || !height) return null;

        const master = aluminumMasters.find(m => m.id === aluminumId);
        if (!master || !master.constants) return null;

        const c = master.constants as any;

        const bearing = (width - Number(c.bearingOffset || 0)) / 2;
        const handle = (height - Number(c.handleOffset || 0));
        const glassWidth = bearing + Number(c.glassWidthOffset || 0);
        const glassHeight = handle - Number(c.glassHeightOffset || 0);

        return {
            bearing,
            handle,
            glassWidth,
            glassHeight
        };
    }, [itemType, aluminumId, width, height, aluminumMasters]);

    // Handle Glass Selection to auto-set price
    const handleGlassChange = (id: string, w: number, h: number) => {
        setGlassId(id);
        if (id && id !== "custom" && w > 0 && h > 0) {
            const master = glassMasters.find(g => g.id === id);
            if (master) {
                const sqFt = (w * h) / 144;
                setPrice(Number((master.pricePerSqFt * sqFt).toFixed(2)));
            }
        }
    }

    const addItem = () => {
        let newItem = {
            id: Math.random().toString(36).substr(2, 9),
            type: itemType,
            quantity,
            price,
            total: price * quantity,
            details: {} as any
        };

        if (itemType === "glass") {
            if (glassId === "custom") {
                newItem.details = {
                    glassType: customGlassDetails.type,
                    color: customGlassDetails.color,
                    mmRange: customGlassDetails.mmRange,
                    width,
                    height,
                    sqFt: (width * height) / 144
                };
            } else {
                const master = glassMasters.find(g => g.id === glassId);
                newItem.details = {
                    glassMasterId: master?.id,
                    glassType: master?.type,
                    color: master?.color,
                    width,
                    height,
                    sqFt: (width * height) / 144
                };
            }
        } else if (itemType === "aluminum") {
            const master = aluminumMasters.find(a => a.id === aluminumId);
            newItem.details = {
                aluminumMasterId: master?.id,
                buildType: master?.buildType,
                width,
                height,
                calculations: aluminumCalculations
            };
        } else {
            newItem.details = { description: manualDescription };
        }

        setItems([...items, newItem]);

        // Reset fields but keep width/height if user wants to add multiple of same size
        setManualDescription("");
        setPrice(0);
        setQuantity(1);
        setGlassId("");
        setAluminumId("");
    };

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const totalPrice = items.reduce((acc, item) => acc + item.total, 0);

    const onSubmit = async () => {
        if (!clientId) return toast.error("Please select a client");
        if (items.length === 0) return toast.error("Please add items");

        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId,
                    items,
                    totalAmount: totalPrice
                })
            });

            if (!res.ok) throw new Error("Failed");

            toast.success("Order created!");
            router.push("/orders");
            router.refresh();
        } catch (e) {
            toast.error("Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Client Details</CardTitle></CardHeader>
                    <CardContent>
                        <Label>Client</Label>
                        <Select value={clientId} onValueChange={setClientId}>
                            <SelectTrigger><SelectValue placeholder="Select Client" /></SelectTrigger>
                            <SelectContent>
                                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Add Item</CardTitle></CardHeader>
                    <CardContent>
                        <Tabs value={itemType} onValueChange={setItemType}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="glass">Glass</TabsTrigger>
                                <TabsTrigger value="aluminum">Aluminum</TabsTrigger>
                                <TabsTrigger value="labor">Labor</TabsTrigger>
                            </TabsList>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {itemType !== "labor" && (
                                    <>
                                        <div>
                                            <Label>Width (in)</Label>
                                            <Input type="number" value={width} onChange={e => {
                                                const w = Number(e.target.value);
                                                setWidth(w);
                                                if (itemType === 'glass') handleGlassChange(glassId, w, height);
                                            }} />
                                        </div>
                                        <div>
                                            <Label>Height (in)</Label>
                                            <Input type="number" value={height} onChange={e => {
                                                const h = Number(e.target.value);
                                                setHeight(h);
                                                if (itemType === 'glass') handleGlassChange(glassId, width, h);
                                            }} />
                                        </div>
                                    </>
                                )}
                            </div>

                            <TabsContent value="glass" className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Label>Glass Type</Label>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0"
                                        onClick={() => setGlassId(glassId === "custom" ? "" : "custom")}
                                    >
                                        {glassId === "custom" ? "Select from list" : "Enter custom"}
                                    </Button>
                                </div>
                                {glassId === "custom" ? (
                                    <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                                        <div>
                                            <Label>Type</Label>
                                            <Input placeholder="e.g. Tinted" value={customGlassDetails.type} onChange={e => setCustomGlassDetails({ ...customGlassDetails, type: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Color</Label>
                                                <Input placeholder="e.g. Green" value={customGlassDetails.color} onChange={e => setCustomGlassDetails({ ...customGlassDetails, color: e.target.value })} />
                                            </div>
                                            <div>
                                                <Label>mm Range</Label>
                                                <Input placeholder="e.g. 5mm" value={customGlassDetails.mmRange} onChange={e => setCustomGlassDetails({ ...customGlassDetails, mmRange: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Select value={glassId} onValueChange={(v) => handleGlassChange(v, width, height)}>
                                        <SelectTrigger><SelectValue placeholder="Select Glass" /></SelectTrigger>
                                        <SelectContent>
                                            {glassMasters.map(g => (
                                                <SelectItem key={g.id} value={g.id}>{g.type} - {g.color} ({g.mmRange})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </TabsContent>

                            <TabsContent value="aluminum" className="space-y-4">
                                <div>
                                    <Label>Build Type</Label>
                                    <Select value={aluminumId} onValueChange={setAluminumId}>
                                        <SelectTrigger><SelectValue placeholder="Select Build Type" /></SelectTrigger>
                                        <SelectContent>
                                            {aluminumMasters.map(a => (
                                                <SelectItem key={a.id} value={a.id}>{a.buildType}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {aluminumCalculations && (
                                    <div className="p-4 bg-slate-50 rounded-md text-sm space-y-1">
                                        <p className="font-semibold text-slate-700 mb-2 flex items-center"><Calculator className="w-3 h-3 mr-1" /> Calculations</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>Bearing: <span className="font-mono">{formatSize(aluminumCalculations.bearing)}</span></div>
                                            <div>Handle: <span className="font-mono">{formatSize(aluminumCalculations.handle)}</span></div>
                                            <div>Glass W: <span className="font-mono">{formatSize(aluminumCalculations.glassWidth)}</span></div>
                                            <div>Glass H: <span className="font-mono">{formatSize(aluminumCalculations.glassHeight)}</span></div>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="labor" className="space-y-4">
                                <Label>Description</Label>
                                <Input value={manualDescription} onChange={e => setManualDescription(e.target.value)} placeholder="Labor description" />
                            </TabsContent>

                            <div className="flex gap-4 items-end mt-4">
                                <div className="flex-1">
                                    <Label>Price (Total Item Price)</Label>
                                    <Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
                                </div>
                                <div className="w-24">
                                    <Label>Quantity</Label>
                                    <Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
                                </div>
                                <Button onClick={addItem} className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" /> Add</Button>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full flex flex-col">
                    <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                    <CardContent className="flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-xs">
                                            <div className="font-bold uppercase text-indigo-600">{item.type}</div>
                                            <div className="text-muted-foreground">
                                                {item.type === 'labor'
                                                    ? item.details?.description
                                                    : `${item.details?.width}" x ${item.details?.height}"`}
                                            </div>
                                            {item.type === 'glass' && <div className="text-[10px] italic">{item.details?.glassType} ({item.details?.color})</div>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div>{item.quantity} x ₹{item.price}</div>
                                            <div className="font-bold">₹{item.total}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-8 pt-4 border-t flex justify-between items-center">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-bold text-indigo-700">₹{totalPrice}</span>
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800" size="lg" onClick={onSubmit} disabled={loading}>
                            {loading ? "Creating..." : "Create Order"}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
