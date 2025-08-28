import React from "react";
import Button from "./Button";

interface ModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Modal({
    open,
    title,
    onClose,
    children,
}: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-slate-900/40" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b">
                        <h3 className="font-semibold">{title}</h3>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="!py-2 !px-3"
                        >
                            ✕
                        </Button>
                    </div>

                    <div className="p-5">{children}</div>
                </div>
            </div>
        </div>
    );
}
