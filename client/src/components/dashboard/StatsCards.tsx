import Card from "../ui/Card";
import { money } from "../../utils/functions";
import { type Transaction } from "../../types";

export default function StatsCards({ data }: { data: Transaction[] }) {
    const income = data
        .filter((d) => d.type === "income")
        .reduce((s, d) => s + d.amount, 0);
    const expense = data
        .filter((d) => d.type === "expense")
        .reduce((s, d) => s + d.amount, 0);
    const balance = income - expense;
    const items = [
        { label: "Income", value: money(income) },
        { label: "Expense", value: money(expense) },
        { label: "Balance", value: money(balance) },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {items.map((it) => (
                <Card key={it.label} className="p-5">
                    <div className="text-sm text-slate-500">{it.label}</div>
                    <div className="text-2xl font-semibold mt-1">
                        {it.value}
                    </div>
                </Card>
            ))}
        </div>
    );
}
