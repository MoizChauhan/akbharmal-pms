import { getClients } from "@/lib/services/clientService";
import { getGlassMasters, getAluminumMasters } from "@/lib/services/cmsService";
import { getOrderById } from "@/lib/services/orderService";
import { OrderForm } from "@/components/orders/OrderForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditOrderPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const [clients, glassMasters, aluminumMasters, order] = await Promise.all([
        getClients(),
        getGlassMasters(),
        getAluminumMasters(),
        getOrderById(params.id)
    ]);

    if (!order) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Edit Order #{order.id.slice(-6)}</h1>
                <p className="text-muted-foreground">Modify order details and items</p>
            </div>
            <OrderForm
                clients={clients}
                glassMasters={glassMasters}
                aluminumMasters={aluminumMasters}
                initialData={order}
            />
        </div>
    );
}
