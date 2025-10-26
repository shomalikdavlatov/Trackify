import React from "react";
import Card from "../ui/Card";

type Props = {
    title: string;
    description: string;
    icon?: React.ReactNode;
    className?: string;
};

export default function Feature({
    title,
    description,
    icon,
    className,
}: Props) {
    return (
        <Card
            className={
                "p-6 rounded-2xl border border-slate-200 bg-white/80 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition backdrop-blur " +
                (className ?? "")
            }
        >
            {icon ? <div className="mb-3">{icon}</div> : null}
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            <p className="mt-1 text-slate-600 text-sm">{description}</p>
        </Card>
    );
}
