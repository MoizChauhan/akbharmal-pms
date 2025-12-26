"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calculator, ArrowLeft, ArrowRight, User, Calendar, Ruler } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkshopListProps {
    orders: any[];
}

export const WorkshopList = ({ orders }: WorkshopListProps) => {
    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const toggleItem = async (orderId: string, itemId: string, currentStatus: string) => {
        const completed = currentStatus !== 'Completed';
        try {
            const res = await fetch(`/api/orders/${orderId}/item-status`, {
                method: 'POST',
                body: JSON.stringify({ itemId, completed })
            });

            if (!res.ok) throw new Error("Failed");

            router.refresh();
            // Optimistically update local state for smoother UI
            if (selectedOrder && selectedOrder.id === orderId) {
                const updatedItems = selectedOrder.items.map((item: any) =>
                    item.id === itemId ? { ...item, status: completed ? 'Completed' : 'Pending' } : item
                );
                setSelectedOrder({ ...selectedOrder, items: updatedItems });
            }
            toast.success(completed ? "Item completed" : "Item pending");
        } catch (e) {
            toast.error("Failed to update status");
        }
    }

    const formatSize = (inches: number) => {
        if (!inches && inches !== 0) return "-";
        const feet = (inches / 12);
        return `${inches}" (${feet}ft)`;
    };

    return (
        <div className="space-y-6">
            <AnimatePresence mode="wait">
                {!selectedOrder ? (
                    // --------------------------------------------------------------------------------
                    // VIEW 1: ORDER LIST (DASHBOARD)
                    // --------------------------------------------------------------------------------
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {orders.map((order) => {
                            const totalItems = order.items?.length || 0;
                            const completedItems = order.items?.filter((i: any) => i.status === 'Completed').length || 0;
                            const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

                            return (
                                <Card
                                    key={order.id}
                                    className="cursor-pointer group hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-indigo-500 overflow-hidden"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="pb-3 relative">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <User className="w-4 h-4 text-indigo-500" />
                                                    {order.client?.name}
                                                </CardTitle>
                                                <CardDescription className="font-mono text-xs">
                                                    Order #{order.id.slice(-6)}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={order.status === 'UnderProcess' ? 'default' : 'secondary'} className="shadow-sm">
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <div className="space-y-4">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>Progress</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <div className="text-xs text-muted-foreground text-right border-t pt-2 mt-2">
                                                    {completedItems} of {totalItems} items ready
                                                </div>
                                            </div>

                                            <div className="pt-2 flex justify-end">
                                                <div className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform">
                                                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                        {orders.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground bg-white rounded-xl border border-dashed">
                                <div className="bg-slate-50 p-4 rounded-full mb-4">
                                    <Ruler className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-lg font-medium">No active workshop orders</p>
                                <p className="text-sm">Create a new order to get started.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    // --------------------------------------------------------------------------------
                    // VIEW 2: ORDER DETAIL
                    // --------------------------------------------------------------------------------
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm sticky top-0 z-10">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mr-2 hover:bg-slate-100"
                                onClick={() => setSelectedOrder(null)}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    {selectedOrder.client?.name}
                                    <span className="text-muted-foreground text-base font-normal">#{selectedOrder.id.slice(-6)}</span>
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Started {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <Badge variant="outline" className="text-base px-4 py-1">
                                    {selectedOrder.items.filter((i: any) => i.status === 'Completed').length} / {selectedOrder.items.length} Completed
                                </Badge>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                            {(selectedOrder.items || []).map((item: any, idx: number) => {
                                // Extract metadata from item (now stored in item.metadata based on schema update)
                                const details = (item.metadata as any) || {};

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`
                                        relative overflow-hidden rounded-xl border transition-all duration-300
                                        ${item.status === 'Completed'
                                                ? 'bg-emerald-50/50 border-emerald-200'
                                                : 'bg-white hover:shadow-lg hover:border-indigo-200'}
                                    `}
                                    >
                                        <div className="p-5 flex items-start gap-4">
                                            <div className="pt-1">
                                                <Checkbox
                                                    checked={item.status === 'Completed'}
                                                    onCheckedChange={() => toggleItem(selectedOrder.id, item.id, item.status)}
                                                    className="w-5 h-5 border-2 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                                />
                                            </div>

                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm uppercase tracking-wider text-white bg-slate-800 px-2 py-0.5 rounded-md shadow-sm">
                                                                {item.type}
                                                            </span>
                                                            {item.status === 'Completed' && (
                                                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                                    Ready
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Specification Display from new Schema or fallback */}
                                                        <div className="text-sm font-medium text-slate-700 mt-1">
                                                            {item.specification || (item.type === 'labor' ? 'Custom Work' : 'Standard Item')}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dimensions */}
                                                {item.type !== 'labor' && (item.width || item.height) && (
                                                    <div className="flex items-center gap-2 p-2 bg-slate-100/80 rounded-lg w-fit">
                                                        <Ruler className="w-4 h-4 text-slate-500" />
                                                        <span className="font-mono font-bold text-slate-800">
                                                            {formatSize(item.width)} <span className="text-slate-400">x</span> {formatSize(item.height)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Calculations Box */}
                                                {item.type === 'aluminum' && details.calculations && (
                                                    <div className="mt-3 bg-indigo-50/50 rounded-lg p-3 border border-indigo-100">
                                                        <div className="flex items-center text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">
                                                            <Calculator className="w-3 h-3 mr-1.5" /> Fabrication Specs
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                                                            <div className="flex justify-between items-center border-b border-indigo-100 pb-1">
                                                                <span className="text-slate-500">Bearing</span>
                                                                <span className="font-mono font-semibold text-slate-700">{formatSize(details.calculations.bearing)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center border-b border-indigo-100 pb-1">
                                                                <span className="text-slate-500">Handle</span>
                                                                <span className="font-mono font-semibold text-slate-700">{formatSize(details.calculations.handle)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-slate-500">Glass W</span>
                                                                <span className="font-mono font-semibold text-slate-700">{formatSize(details.calculations.glassWidth)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-slate-500">Glass H</span>
                                                                <span className="font-mono font-semibold text-slate-700">{formatSize(details.calculations.glassHeight)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Labor Description */}
                                                {item.type === 'labor' && (
                                                    <p className="text-sm text-slate-500 italic bg-slate-50 p-2 rounded border">
                                                        "{item.description}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
