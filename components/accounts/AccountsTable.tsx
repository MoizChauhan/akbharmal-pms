"use client";

import { PaymentStatus } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

interface AccountsTableProps {
    data: any[];
}

export const AccountsTable = ({ data }: AccountsTableProps) => {
    const router = useRouter();
    const [updating, setUpdating] = useState<string | null>(null);
    const [partialDialogOpen, setPartialDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [partialAmount, setPartialAmount] = useState<number>(0);

    const updateStatus = async (orderId: string, status: PaymentStatus, amount?: number) => {
        setUpdating(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, paidAmount: amount }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Payment status updated");
            router.refresh();
        } catch (e) {
            toast.error("Error updating status");
        } finally {
            setUpdating(null);
        }
    }

    const handleStatusChange = async (orderId: string, status: PaymentStatus, order: any) => {
        if (status === 'Partial') {
            setSelectedOrder(order);
            setPartialAmount(order.paidAmount || 0);
            setPartialDialogOpen(true);
        } else {
            await updateStatus(orderId, status);
        }
    };

    const handlePartialSubmit = async () => {
        if (!selectedOrder) return;
        if (partialAmount <= 0) return toast.error("Amount must be greater than 0");
        if (partialAmount >= selectedOrder.totalAmount) return toast.error("Amount must be less than total amount (Use 'Paid' status)");

        setPartialDialogOpen(false);
        await updateStatus(selectedOrder.id, 'Partial', partialAmount);
        setSelectedOrder(null);
    }

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case 'Paid': return 'text-green-600 font-bold';
            case 'Partial': return 'text-yellow-600 font-bold';
            default: return 'text-red-600 font-bold';
        }
    }

    const calculateClientTotal = (clientName: string) => {
        const clientOrders = data.filter(d => d.client?.name === clientName);
        const total = clientOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const paid = clientOrders.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
        return { total, paid, remaining: total - paid };
    }

    // Sort data to group by client if needed, currently implied by order of rows or handled in backend
    // But for "Client Total" view, we might want a summary row or just showing it per row is confusing if not grouped.
    // The requirement "client should show a total of payment to be taken" suggests we should perhaps show this either in a separate card or tooltip.
    // Let's add it as a small summary under the Client Name for now.

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Paid Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((order) => {
                        const { remaining } = calculateClientTotal(order.client?.name);
                        return (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id.slice(-6)}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{order.client?.name}</div>
                                    <div className="text-[10px] text-muted-foreground">Total Pending (All Orders): ₹{remaining}</div>
                                </TableCell>
                                <TableCell>{new Date(order.updatedAt).toLocaleDateString()}</TableCell>
                                <TableCell className="font-medium">₹{order.totalAmount}</TableCell>
                                <TableCell>₹{order.paidAmount || 0}</TableCell>
                                <TableCell>
                                    <span className={getStatusColor(order.paymentStatus)}>
                                        {order.paymentStatus}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Select
                                        defaultValue={order.paymentStatus}
                                        onValueChange={(val) => handleStatusChange(order.id, val as PaymentStatus, order)}
                                        disabled={updating === order.id}
                                    >
                                        <SelectTrigger className="w-[130px] ml-auto">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                                            <SelectItem value="Partial">Partial</SelectItem>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                No ready orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Dialog open={partialDialogOpen} onOpenChange={setPartialDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Partial Payment</DialogTitle>
                        <DialogDescription>Enter the amount paid so far for Order #{selectedOrder?.id.slice(-6)}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={partialAmount}
                                onChange={(e) => setPartialAmount(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="text-sm text-right text-muted-foreground">
                            Total Order Amount: ₹{selectedOrder?.totalAmount}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPartialDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePartialSubmit}>Save Payment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
