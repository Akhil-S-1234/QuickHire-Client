"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardContent } from "./components/DashboardContent";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname == '/admin/login') {
        return <>
            {children}
        </>
    }

    return (
        <div className="flex h-screen bg-gray-100">

            <Sidebar activeTab={pathname} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <DashboardContent>
                    {children}
                </DashboardContent>
            </div>
        </div>
    );
}
