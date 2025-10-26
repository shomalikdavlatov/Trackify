import { useEffect, useState } from "react";

function DashboardMock() {
    // initial heights (percent)
    const [bars, setBars] = useState<number[]>([40, 65, 35, 80, 55, 70, 45]);

    useEffect(() => {
        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced) return;

        const id = setInterval(() => {
            setBars((prev) =>
                prev.map((h) => {
                    const delta = Math.random() * 100 - 50; // [-12, +12]
                    const next = Math.max(8, Math.min(92, h + delta)); // clamp
                    return next;
                })
            );
        }, 1000);

        return () => clearInterval(id);
    }, []);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-3 w-24 rounded bg-slate-100" />
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-3">
                {/* === Animated Bars === */}
                <div className="col-span-2 rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 h-4 w-40 rounded bg-slate-100" />
                    <div className="mt-2 grid grid-cols-7 items-end gap-2">
                        {bars.map((h, i) => (
                            <div
                                key={i}
                                className="relative h-28 w-full rounded bg-slate-50 overflow-hidden"
                            >
                                <div
                                    className="absolute bottom-0 w-full rounded bg-gradient-to-t from-indigo-500 to-sky-400 transition-all duration-700 ease-in-out"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 h-4 w-28 rounded bg-slate-100" />
                    <div className="space-y-3">
                        {[
                            ["Food & Dining", 42],
                            ["Transport", 28],
                            ["Shopping", 18],
                            ["Bills", 12],
                        ].map(([name, pct], i) => (
                            <div key={i}>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="text-slate-700">
                                        {name}
                                    </span>
                                    <span className="font-medium text-slate-900">
                                        {pct}%
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded bg-slate-100">
                                    <div
                                        className="h-2 rounded bg-gradient-to-r from-sky-500 to-indigo-600"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 h-4 w-28 rounded bg-slate-100" />
                    <ul className="space-y-3">
                        {[
                            { label: "Paycheck", amt: "+$1,200" },
                            { label: "Groceries", amt: "-$86" },
                            { label: "Electricity", amt: "-$34" },
                            { label: "Coffee", amt: "-$6" },
                        ].map((row, i) => (
                            <li
                                key={i}
                                className="flex items-center justify-between"
                            >
                                <span className="h-3 w-32 rounded bg-slate-100"></span>
                                <span className="rounded bg-slate-100 px-2 py-1">
                                    {row.amt}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-span-2 rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 h-4 w-28 rounded bg-slate-100" />
                    <div className="flex flex-wrap gap-2">
                        {[
                            "Rent",
                            "Salary",
                            "Gym",
                            "Groceries",
                            "Dining",
                            "Transport",
                        ].map((t, i) => (
                            <span
                                key={i}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <div className="mt-4 h-24 rounded-xl bg-gradient-to-r from-indigo-50 to-sky-50 ring-1 ring-inset ring-slate-200" />
                </div>
            </div>
        </div>
    );
}

export default DashboardMock;
