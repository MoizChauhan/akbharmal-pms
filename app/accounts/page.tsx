import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getReadyOrders() {
    return prisma.order.findMany({
        where: { status: 'ReadyToDispatch' },
        include: { client: true },
        orderBy: { updatedAt: 'desc' }
    });
}

export default async function AccountsPage() {
    const orders = await getReadyOrders();
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
                <p className="text-muted-foreground">Track payments for completed orders</p>
            </div>
            <Card>
                <CardHeader><CardTitle>Ready for Dispatch</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(o => (
                                <TableRow key={o.id}>
                                    <TableCell className="font-mono text-xs">{o.id.slice(-6)}</TableCell>
                                    <TableCell>{o.client.name}</TableCell>
                                    <TableCell className="font-bold">₹{o.totalAmount}</TableCell>
                                    <TableCell><Badge className="bg-green-500">Ready</Badge></TableCell>
                                </TableRow>
                            ))}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No orders ready for dispatch</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
