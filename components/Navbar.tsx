import { MobileSidebar } from "@/components/MobileSidebar";
import { UserAccountNav } from "@/components/UserAccountNav";
import { auth } from "@/auth";

export const Navbar = async () => {
    const session = await auth();

    return (
        <div className="flex items-center p-4 border-b h-16 bg-white/50 backdrop-blur-sm">
            <MobileSidebar activeModules={(session?.user as any)?.activeModules || []} />
            <div className="md:hidden font-bold ml-2">AK Bharmal</div>
            <div className="flex w-full justify-end">
                {session?.user ? (
                    <UserAccountNav user={session.user} />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                )}
            </div>
        </div>
    );
}
