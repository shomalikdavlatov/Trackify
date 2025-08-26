import React from "react";
import clsx from "clsx";
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost" | "danger";
}
export default function Button({
    className,
    variant = "primary",
    ...rest
}: Props) {
    const base =
        "px-4 py-2 rounded-2xl text-sm font-medium transition disabled:opacity-50";
    const variants = {
        primary: "bg-brand-600 text-white hover:bg-brand-700",
        ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
        danger: "bg-red-600 text-white hover:bg-red-700",
    } as const;
    return (
        <button
            className={clsx(base, variants[variant], className)}
            {...rest}
        />
    );
}
