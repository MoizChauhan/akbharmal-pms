import { MobileSidebar } from "@/components/MobileSidebar";

export const Navbar = () => {
    return (
        <div className="flex items-center p-4 border-b h-16">
            <MobileSidebar />
            <div className="md:hidden font-bold ml-2">AK Bharmal</div>
            <div className="flex w-full justify-end">
                {/* Placeholder for User Profile */}
            </div>
        </div>
    );
}
