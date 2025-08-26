import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { monthKey } from "../../utils/functions";
import { type Transaction  } from "../../types";

interface Props {
    data: Transaction[];
}
export default function MonthlyBarChart({ data }: Props) {
    // group by month; income positive, expense negative
    const grouped = data.reduce<Record<string, { month: string; income: number; expense: number }>>((acc, t) => {
        const m = monthKey(t.datetime);
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
