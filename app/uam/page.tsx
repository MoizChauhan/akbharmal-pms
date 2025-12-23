import { getUsers } from "@/lib/services/userService";
import { UserManagement } from "@/components/uam/UserManagement";

export default async function UAMPage() {
    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">User Access Management</h2>
                <p className="text-muted-foreground">Manage user permissions and module access</p>
            </div>
            <UserManagement users={users} />
        </div>
    );
}
