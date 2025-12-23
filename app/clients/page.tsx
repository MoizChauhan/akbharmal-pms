import { getClients } from "@/lib/services/clientService";
import { ClientTable } from "@/components/clients/ClientTable";
import { ClientDialog } from "@/components/clients/ClientDialog";

export default async function ClientsPage(props: {
    searchParams?: Promise<{ q?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q || "";
    const clients = await getClients(query);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
                    <p className="text-muted-foreground">Manage your client database</p>
                </div>
                <ClientDialog />
            </div>

            {/* To implement search, we would add a client component here that updates the URL query param 'q' */}

            <ClientTable data={clients} />
        </div>
    );
}
