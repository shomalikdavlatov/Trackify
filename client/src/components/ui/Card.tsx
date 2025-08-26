import React from "react";

export default function Card({
    children,
    className = "",
}: React.PropsWithChildren<{ className?: string }>) {
    return (
        <div
            className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}
        >
            {children}
        </div>
    );
}
