// components/dashboard/StatsCards.tsx
import { useEffect, useState } from "react";
import Card from "../ui/Card";
import { money } from "../../utils/functions";
import { type Transaction } from "../../types";
import { me } from "../../api/auth";

function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function rangeForMonthOffset(offset: number) {
    const now = new Date();
    const start = startOfMonth(
        new Date(now.getFullYear(), now.getMonth() + offset, 1)
    );
    const end = startOfMonth(
        new Date(now.getFullYear(), now.getMonth() + offset + 1, 1)
    );
    return { start, end };
}
function sumByTypeInRange(
    data: Transaction[],
    type: "income" | "expense",
    start: Date,
    end: Date
) {
    const s = start.getTime();
    const e = end.getTime();
    return (Array.isArray(data) ? data : [])
        .filter((t) => t?.type === type && t?.datetime)
        .filter((t) => {
            const ts = new Date(t.datetime).getTime();
            return ts >= s && ts < e;
        })
        .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
}
function highestLastNDays(data: Transaction[], days: number) {
    const now = Date.now();
    const start = now - days * 24 * 60 * 60 * 1000;
    const list = (Array.isArray(data) ? data : []).filter(
        (t) => t?.datetime && new Date(t.datetime).getTime() >= start
    );
    if (list.length === 0) return null;
    return list.reduce((max, cur) =>
        (Number(cur.amount) || 0) > (Number(max.amount) || 0) ? cur : max
    );
}
function pctDelta(currTotal: number, prevTotal: number) {
    if (!isFinite(prevTotal) || prevTotal === 0) return { pct: null, dir: 0 };
    const pct = ((currTotal - prevTotal) / prevTotal) * 100;
    const dir = pct > 0 ? 1 : pct < 0 ? -1 : 0;
    return { pct, dir };
}
function deltaTextVsLastMonth(
    pct: number | null,
    dir: number,
    goodWhenUp: boolean
) {
    if (pct === null) return { text: "— vs last month", cls: "text-slate-400" };
    const arrow = dir > 0 ? "↑" : dir < 0 ? "↓" : "=";
    const pctStr = `${Math.abs(pct).toFixed(0)}%`;
    const favorable = dir === 0 ? null : dir > 0 ? goodWhenUp : !goodWhenUp;
    const cls =
        favorable === null
            ? "text-slate-500"
            : favorable
            ? "text-green-600"
            : "text-rose-600";
    return { text: `${arrow} ${pctStr} vs last month`, cls };
}

type Item = {
    label: string;
    value: string;
    sub?: string;
    valueClass?: string;
    subClass?: string;
};

export default function StatsCards({ data }: { data: Transaction[] }) {
    const [userBalance, setUserBalance] = useState<number | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await me();
                const raw = (res as any)?.data ?? {};
                const u = raw.user ?? raw.data ?? raw;
                const bal = Number(u?.balance);
                if (mounted) setUserBalance(Number.isFinite(bal) ? bal : null);
            } catch {
                if (mounted) setUserBalance(null);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const curr = rangeForMonthOffset(0);
    const last = rangeForMonthOffset(-1);

    const incomeCurr = sumByTypeInRange(data, "income", curr.start, curr.end);
    const incomeLast = sumByTypeInRange(data, "income", last.start, last.end);

    const expenseCurr = sumByTypeInRange(data, "expense", curr.start, curr.end);
    const expenseLast = sumByTypeInRange(data, "expense", last.start, last.end);

    const incDelta = pctDelta(incomeCurr, incomeLast);
    const expDelta = pctDelta(expenseCurr, expenseLast);

    const incDeltaTxt = deltaTextVsLastMonth(incDelta.pct, incDelta.dir, true); // up income = good
    const expDeltaTxt = deltaTextVsLastMonth(expDelta.pct, expDelta.dir, false); // up expense = bad

    const top14 = highestLastNDays(data, 14);
    const topValue = top14 ? money(Number(top14.amount) || 0) : "—";
    const topSub = top14
        ? `${
              top14.note?.trim() ||
              (top14.type === "income" ? "Income" : "Expense")
          } • ${new Date(top14.datetime).toLocaleDateString()}`
        : "No tx in last 14 days";
    const topClass = top14
        ? top14.type === "income"
            ? "text-green-600"
            : "text-rose-600"
        : "text-slate-400";

    const userBalValue = userBalance === null ? "—" : money(userBalance);
    const userBalClass =
        userBalance === null
            ? "text-slate-400"
            : userBalance >= 0
            ? "text-green-600"
            : "text-rose-600";

    const items: Item[] = [
        {
            label: "Account Balance",
            value: userBalValue,
            valueClass: userBalClass,
        },
        {
            label: "Income (this month)",
            value: money(incomeCurr),
            valueClass: "text-green-600",
            sub: incDeltaTxt.text,
            subClass: incDeltaTxt.cls,
        },
        {
            label: "Expense (this month)",
            value: money(expenseCurr),
            valueClass: "text-rose-600",
            sub: expDeltaTxt.text,
            subClass: expDeltaTxt.cls,
        },
        {
            label: "Top Transaction (last 14 days)",
            value: topValue,
            sub: topSub,
            valueClass: topClass,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((it) => (
                <Card key={it.label} className="p-5">
                    <div className="text-sm text-slate-500">{it.label}</div>
                    <div
                        className={`text-2xl font-semibold mt-1 ${
                            it.valueClass ?? ""
                        }`}
                    >
                        {it.value}
                    </div>
                    {it.sub ? (
                        <div
                            className={`text-xs mt-1 ${
                                it.subClass ?? "text-slate-500"
                            }`}
                        >
                            {it.sub}
                        </div>
                    ) : null}
                </Card>
            ))}
        </div>
    );
}
