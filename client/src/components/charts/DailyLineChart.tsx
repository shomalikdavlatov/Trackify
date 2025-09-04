// components/charts/DailyLineChart.tsx
import { useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import { type Transaction } from "../../types";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function daysInMonth(year: number, monthZeroBased: number) {
    return new Date(year, monthZeroBased + 1, 0).getDate();
}

function buildDailySeries(
    transactions: Transaction[],
    year: number,
    monthZeroBased: number
) {
    const nDays = daysInMonth(year, monthZeroBased);
    const buckets = Array.from({ length: nDays }, (_, i) => ({
        day: i + 1,
        income: 0,
        expense: 0,
    }));
    for (const t of transactions) {
        if (!t?.datetime || !t?.type) continue;
        const d = new Date(t.datetime);
        if (d.getFullYear() !== year || d.getMonth() !== monthZeroBased)
            continue;
        const idx = d.getDate() - 1;
        const amt = Number(t.amount) || 0;
        if (t.type === "income") buckets[idx].income += amt;
        else if (t.type === "expense") buckets[idx].expense += amt;
    }
    return buckets.map((b) => ({
        label: String(b.day),
        income: b.income,
        expense: b.expense,
    }));
}

function getMonthsFromData(transactions: Transaction[]) {
    const set = new Set<string>();
    for (const t of transactions) {
        if (!t?.datetime) continue;
        const d = new Date(t.datetime);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
        )}`;
        set.add(key);
    }
    if (set.size === 0) {
        const now = new Date();
        const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            "0"
        )}`;
        set.add(key);
    }
    const arr = Array.from(set).map((k) => {
        const [y, m] = k.split("-").map(Number);
        return { year: y, month: m - 1, key: k };
    });
    arr.sort((a, b) =>
        a.year === b.year ? b.month - a.month : b.year - a.year
    );
    return arr;
}

export default function DailyLineChart({ data }: { data: Transaction[] }) {
    const months = useMemo(
        () => getMonthsFromData(Array.isArray(data) ? data : []),
        [data]
    );
    const [selected, setSelected] = useState(() => months[0]);
    useEffect(() => {
        if (!months.length) return;
        if (!selected || !months.find((m) => m.key === selected.key))
            setSelected(months[0]);
    }, [months, selected]);

    const series = useMemo(() => {
        if (!selected) return [];
        return buildDailySeries(
            Array.isArray(data) ? data : [],
            selected.year,
            selected.month
        );
    }, [data, selected]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Daily Income & Expense</div>
                <select
                    value={selected?.key ?? ""}
                    onChange={(e) => {
                        const next = months.find(
                            (m) => m.key === e.target.value
                        );
                        if (next) setSelected(next);
                    }}
                    className="border rounded-xl px-3 py-2"
                >
                    {months.map((m) => (
                        <option key={m.key} value={m.key}>
                            {MONTHS[m.month]} {m.year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={series}
                        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tickLine={false} />
                        <YAxis tickLine={false} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="income"
                            name="Income"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            name="Expense"
                            stroke="#dc2626"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
