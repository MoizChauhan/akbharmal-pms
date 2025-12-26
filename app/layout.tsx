import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AK Bharmal Management",
  description: "ERP System",
};

import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-full relative">
          {session?.user && (
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 text-white">
              <Sidebar activeModules={(session.user as any)?.activeModules || []} />
            </div>
          )}
          <main className={`${session?.user ? 'md:pl-72' : ''} h-full min-h-screen gradient-bg`}>
            {session?.user && <Navbar />}
            <div className={session?.user ? "p-8" : ""}>
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
