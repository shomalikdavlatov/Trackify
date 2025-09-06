// components/dashboard/TopThisMonth.tsx
import Card from "../ui/Card";
import { money } from "../../utils/functions";
import { type Transaction } from "../../types";

function isSameMonth(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function top3ByTypeThisMonth(data: Transaction[], type: "income" | "expense") {
    const now = new Date();
    const monthTx = (Array.isArray(data) ? data : []).filter(
        (t) =>
            t?.type === type &&
            t?.datetime &&
            isSameMonth(new Date(t.datetime), now)
    );
    return monthTx
        .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
        .slice(0, 3);
}

function RankItem({
    tx,
    rank,
    color,
}: {
    tx: Transaction;
    rank: number;
    color: "green" | "red";
}) {
    const tone =
        rank === 1
            ? "text-slate-900 font-bold"
            : rank === 2
            ? "text-slate-700 font-semibold"
            : "text-slate-500";
    const border =
        color === "green"
            ? "border-l-4 border-green-600"
            : "border-l-4 border-rose-600";
    const bg =
        color === "green"
            ? rank === 1
                ? "bg-green-100"
                : rank === 2
                ? "bg-green-100/70"
                : "bg-green-100/50"
            : rank === 1
            ? "bg-rose-100"
            : rank === 2
            ? "bg-rose-100/70"
            : "bg-rose-100/50";

    return (
        <div className={`rounded-md ${border} ${bg} px-3 py-2 overflow-x-auto`}>
            <div className={`truncate text-base ${tone}`}>
                {tx.note?.trim() || (color === "green" ? "Income" : "Expense")}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
                {new Date(tx.datetime).toLocaleDateString()}
            </div>
            <div className={`mt-1 tabular-nums ${tone}`}>
                {money(Number(tx.amount) || 0)}
            </div>
        </div>
    );
}

export default function TopThisMonth({ data }: { data: Transaction[] }) {
    const topIncome = top3ByTypeThisMonth(data, "income");
    const topExpense = top3ByTypeThisMonth(data, "expense");

    return (
        <Card className="p-5">
            <div className="font-medium mb-2">Top This Month</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <div className="text-sm text-slate-500 mb-2">
                        Top 3 Income
                    </div>
                    <div className="space-y-3">
                        {topIncome.length === 0 ? (
                            <div className="text-sm text-slate-500">
                                No income yet
                            </div>
                        ) : (
                            topIncome.map((tx, i) => (
                                <RankItem
                                    key={tx.id}
                                    tx={tx}
                                    rank={i + 1}
                                    color="green"   
                                />
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-slate-500 mb-2">
                        Top 3 Expense
                    </div>
                    <div className="space-y-3">
                        {topExpense.length === 0 ? (
                            <div className="text-sm text-slate-500">
                                No expense yet
                            </div>
                        ) : (
                            topExpense.map((tx, i) => (
                                <RankItem
                                    key={tx.id}
                                    tx={tx}
                                    rank={i + 1}
                                    color="red"
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
