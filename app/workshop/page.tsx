import { getWorkshopOrders } from "@/lib/services/orderService";
import { WorkshopList } from "@/components/workshop/WorkshopList";

export default async function WorkshopPage() {
    const orders = await getWorkshopOrders();

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Workshop</h2>
                <p className="text-muted-foreground">Manage active production orders</p>
            </div>
            <WorkshopList orders={orders} />
        </div>
    );
}
