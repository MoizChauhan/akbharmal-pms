import { getClients } from "@/lib/services/clientService";
import { getGlassMasters, getAluminumMasters } from "@/lib/services/cmsService";
import { OrderForm } from "@/components/orders/OrderForm";

export default async function CreateOrderPage() {
    const [clients, glassMasters, aluminumMasters] = await Promise.all([
        getClients(),
        getGlassMasters(),
        getAluminumMasters(),
    ]);

    return (
        <div className="max-w-5xl mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Create Order</h1>
                <p className="text-muted-foreground">Add items and calculate costs</p>
            </div>
            <OrderForm
                clients={clients}
                glassMasters={glassMasters}
                aluminumMasters={aluminumMasters}
            />
        </div>
    );
}
