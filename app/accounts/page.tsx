import { getReadyOrders } from "@/lib/services/accountService";
import { AccountsTable } from "@/components/accounts/AccountsTable";

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
    const orders = await getReadyOrders();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-muted-foreground">Manage payments for ready orders</p>
                </div>
            </div>

            <AccountsTable data={orders} />
        </div>
    );
}
