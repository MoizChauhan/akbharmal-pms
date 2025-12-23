import { getOrders } from "@/lib/services/orderService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderTable } from "@/components/orders/OrderTable";
import { Plus } from "lucide-react";

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">Manage orders</p>
                </div>
                <Link href="/orders/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Order
                    </Button>
                </Link>
            </div>
            <OrderTable data={orders} />
        </div>
    );
}
