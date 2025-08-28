import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { type Transaction } from "../../types";

interface Props {
    data: Transaction[];
}

const COLOR_BY_NAME: Record<"Income" | "Expense", string> = {
    Income: "#16a34a",
    Expense: "#dc2626",
};

export default function TypePieChart({ data }: Props) {
    const totalIncome = data
        .filter((d) => d.type === "income")
        .reduce((s, d) => s + d.amount, 0);
    const totalExpense = data
        .filter((d) => d.type === "expense")
        .reduce((s, d) => s + d.amount, 0);

    const rows = [
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense },
    ];

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={rows}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        innerRadius={75} // donut look (optional)
                        labelLine={false}
                    >
                        {rows.map((entry) => (
                            <Cell
                                key={entry.name}
                                fill={
                                    COLOR_BY_NAME[
                                        entry.name as "Income" | "Expense"
                                    ]
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
