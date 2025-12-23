"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface WorkshopListProps {
    orders: any[];
}

export const WorkshopList = ({ orders }: WorkshopListProps) => {
    const router = useRouter();

    const toggleItem = async (orderId: string, index: number, currentStatus: string) => {
        const completed = currentStatus !== 'Completed';
        try {
            const res = await fetch(`/api/orders/${orderId}/item-status`, {
                method: 'POST',
                body: JSON.stringify({ index, completed })
            });

            if (!res.ok) throw new Error("Failed");

            router.refresh();
            toast.success(completed ? "Item completed" : "Item pending");
        } catch (e) {
            toast.error("Failed to update status");
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map(order => (
                <Card key={order.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base">Order #{order.id.slice(-6)}</CardTitle>
                            <p className="text-xs text-muted-foreground">{order.client?.name}</p>
                        </div>
                        <Badge variant={order.status === 'UnderProcess' ? 'default' : 'secondary'}>{order.status}</Badge>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-4">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="space-y-2">
                            {(Array.isArray(order.items) ? order.items : []).map((item: any, idx: number) => (
                                <div key={idx} className={`flex items-start space-x-3 p-3 border rounded-md transition-colors ${item.status === 'Completed' ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                                    <Checkbox
                                        checked={item.status === 'Completed'}
                                        onCheckedChange={() => toggleItem(order.id, idx, item.status)}
                                        className="mt-1"
                                    />
                                    <div className="text-sm">
                                        <div className="font-semibold uppercase text-xs tracking-wider mb-1">{item.type}</div>
                                        {item.type !== 'labor' && (
                                            <div className="text-muted-foreground text-xs font-mono">
                                                {item.details?.width}in ({(item.details?.width / 12).toFixed(1)}ft) x {item.details?.height}in ({(item.details?.height / 12).toFixed(1)}ft)
                                            </div>
                                        )}
                                        {item.type === 'labor' && (
                                            <div className="text-muted-foreground text-xs">
                                                {item.details?.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
            {orders.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                    No orders in workshop. Create a new order to see it here.
                </div>
            )}
        </div>
    )
}
