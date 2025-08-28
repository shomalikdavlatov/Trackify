import React from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: React.PropsWithChildren) {
    return (
        <div className="min-h-screen">
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
