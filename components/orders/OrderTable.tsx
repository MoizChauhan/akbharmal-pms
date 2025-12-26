"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Need to check if badge exists or I use span
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderTableProps {
    data: any[];
}

export const OrderTable = ({ data }: OrderTableProps) => {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'UnderProcess': return 'bg-blue-500 hover:bg-blue-600';
            case 'ReadyToDispatch': return 'bg-green-500 hover:bg-green-600';
            default: return 'bg-slate-500';
        }
    }

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs">{order.id.slice(-6)}</TableCell>
                            <TableCell className="font-medium">{order.client?.name}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{order.items?.length || 0}</TableCell>
                            <TableCell>₹{order.totalAmount != null ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}</TableCell>
                            <TableCell>
                                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => router.push(`/orders/${order.id}/edit`)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => router.push(`/orders/${order.id}`)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
