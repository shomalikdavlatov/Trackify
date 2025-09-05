import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { type Category, type Transaction } from "../../types";
import { getCategoryAll } from "../../api/category";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    data: Transaction[];
    categoryFilter: "all" | "income" | "expense";
}

function toArray<T>(resData: any): T[] {
    if (Array.isArray(resData)) return resData as T[];
    if (Array.isArray(resData?.data)) return resData.data as T[];
    if (Array.isArray(resData?.items)) return resData.items as T[];
    return [];
}

function normalizeCategories(raw: any[]): Category[] {
    return raw.map((c: any) => ({
        id: c.id ?? c._id ?? String(c.id ?? c._id ?? crypto.randomUUID()),
        name: c.name,
        type: c.type,
    }));
}

export default function MonthlyBarChart({ data, categoryFilter }: Props) {
    // 1️⃣ Month key in YYYY-MM format
    const getMonthKey = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
        )}`;
    };

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategoryAll()
            .then((res) => {
                const arr = toArray<any>(res.data);
                setCategories(normalizeCategories(arr));
            })
            .catch(() => toast.error("Failed to load categories"));
    }, []);

    if (categoryFilter === "all") {
        // Simple month bars, income vs expense
        const grouped = data.reduce<
            Record<string, { month: string; income: number; expense: number }>
        >((acc, t) => {
            const m = getMonthKey(t.datetime);
            acc[m] ||= { month: m, income: 0, expense: 0 };
            if (t.type === "income") acc[m].income += t.amount;
            else acc[m].expense += t.amount;
            return acc;
        }, {});

        const rows = Object.values(grouped).sort((a, b) =>
            a.month.localeCompare(b.month)
        );

        return (
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rows}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="income" stackId="a" fill="#16a34a" />
                        <Bar dataKey="expense" stackId="a" fill="#dc2626" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    // Income or Expense filtered
    const filtered = data.filter((t) => t.type === categoryFilter);

    // Group by month → category name
    const groupedByMonth: Record<
        string,
        { month: string; [key: string]: number | any }
    > = {};

    filtered.forEach((t) => {
        const month = getMonthKey(t.datetime);

        // 🔹 Correctly get category name from categories array
        const catObj = categories.find((c) => c.id === t.category);
        const catName = catObj?.name || "Uncategorized";

        groupedByMonth[month] ||= { month };
        groupedByMonth[month][catName] ||= 0;
        groupedByMonth[month][catName] += t.amount;
    });

    const rows = Object.values(groupedByMonth).sort((a, b) =>
        a.month.localeCompare(b.month)
    );

    // Pick color palette for categories
    let colors = [
        "#4ade80",
        "#34d399",
        "#2dd4bf",
        "#22d3ee",
        "#38bdf8",
        "#60a5fa",
        "#818cf8",
        "#a78bfa",
        "#f87171",
        "#fb923c",
        "#fbbf24",
        "#facc15",
        "#a3e635",
        "#c084fc",
        "#e879f9",
        "#f472b6",
        "#fb7185",
        "#fca5a5",
        "#fdba74",
        "#fde047",
        "#bef264",
        "#86efac",
        "#6ee7b7",
        "#5eead4",
        "#67e8f9",
        "#93c5fd",
        "#a5b4fc",
        "#c4b5fd",
        "#d8b4fe",
        "#f0abfc",
        "#f9a8d4",
        "#fda4af",
        "#fed7aa",
        "#fef08a",
        "#d9f99d",
        "#bbf7d0",
        "#99f6e4",
        "#a5f3fc",
        "#bfdbfe",
        "#c7d2fe",
        "#ddd6fe",
        "#e9d5ff",
        "#f5d0fe",
        "#fbcfe8",
        "#fecdd3",
        "#ffe4e6",
        "#ffedd5",
        "#fef9c3",
        "#ecfccb",
        "#ccfbf1",
    ];

    colors.sort(() => Math.random() - 0.5);

    // Only include categories that actually appear in filtered data
    const activeCategories = categories.filter((c) =>
        filtered.some((t) => t.category === c.id)
    );

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {activeCategories.map((cat, idx) => (
                        <Bar
                            key={cat.id}
                            dataKey={cat.name}
                            stackId="a"
                            fill={colors[idx % colors.length]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
