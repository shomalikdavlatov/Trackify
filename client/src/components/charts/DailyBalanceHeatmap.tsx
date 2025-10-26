import { useEffect, useState } from "react";
import { type Transaction } from "../../types";
import Card from "../ui/Card";

function buildDailyBalances(transactions: Transaction[], year: number) {
    const days: { date: Date; income: number; expense: number }[] = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push({ date: new Date(d), income: 0, expense: 0 });
    }

    for (const t of transactions) {
        if (!t?.datetime) continue;
        const d = new Date(t.datetime);
        if (d.getFullYear() !== year) continue;

        const idx = Math.floor((+d - +start) / (1000 * 60 * 60 * 24));
        if (idx >= 0 && idx < days.length) {
            if (t.type === "income") days[idx].income += t.amount;
            else if (t.type === "expense") days[idx].expense += t.amount;
        }
    }

    return days;
}

function getColor(income: number, expense: number) {
    if (income === 0 && expense === 0) return "bg-gray-200";
    const balance = income - expense;
    if (balance > 0) {
        if (balance < 200) return "bg-green-400";
        return "bg-green-600";
    } else if (balance < 0) {
        if (balance > -200) return "bg-red-400";
        return "bg-red-600";
    } else return "bg-purple-300";
}

export default function DailyBalanceHeatmap({
    data,
    year,
    onYearChange,
}: {
    data: Transaction[];
    year: number;
    onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
    const [days, setDays] = useState<any[]>([]);
    const [hoveredDay, setHoveredDay] = useState<{
        x: number;
        y: number;
        info: string;
    } | null>(null);

    useEffect(() => {
        setDays(buildDailyBalances(data, year));
    }, [data, year]);

    const weeks: any[][] = [];
    days.forEach((day, i) => {
        const weekIndex = Math.floor(i / 7);
        if (!weeks[weekIndex]) weeks[weekIndex] = [];
        weeks[weekIndex].push(day);
    });

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return (
        <Card className="p-4 relative">
            <div className="flex items-center justify-between mb-3">
                <div className="font-medium">
                    Daily Balance Heatmap ({year})
                </div>
                <select
                    value={year}
                    onChange={onYearChange}
                    className="border rounded-lg px-2 py-1 text-sm"
                >
                    {Array.from(
                        { length: 10 },
                        (_, i) => new Date().getFullYear() - i
                    ).map((yearOption) => (
                        <option key={yearOption} value={yearOption}>
                            {yearOption}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative flex space-x-[3px]">
                {weeks.map((week, wIdx) => (
                    <div
                        key={wIdx}
                        className="flex flex-col space-y-[3px] relative"
                    >
                        {week.map((day: any, dIdx: number) => {
                            const color = getColor(day.income, day.expense);
                            const info = `${day.date.toDateString()} | Income: ${
                                day.income
                            } | Expense: ${day.expense}`;
                            return (
                                <div
                                    key={dIdx}
                                    className={`${color} h-4 w-4 rounded-sm cursor-pointer relative`}
                                    onMouseEnter={(e) => {
                                        const parentRect = (
                                            e.currentTarget
                                                .parentElement as HTMLDivElement
                                        ).getBoundingClientRect();
                                        const childRect = (
                                            e.currentTarget as HTMLDivElement
                                        ).getBoundingClientRect();
                                        setHoveredDay({
                                            x:
                                                childRect.left -
                                                parentRect.left +
                                                childRect.width / 2,
                                            y: -6, 
                                            info,
                                        });
                                    }}
                                    onMouseLeave={() => setHoveredDay(null)}
                                >
                                    {hoveredDay && hoveredDay.info === info && (
                                        <div
                                            className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none z-50 whitespace-nowrap"
                                            style={{
                                                left: hoveredDay.x,
                                                top: hoveredDay.y,
                                                transform:
                                                    "translate(-50%, -100%)",
                                            }}
                                        >
                                            {hoveredDay.info}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-2 mr-14 text-[10px] text-gray-500">
                {months.map((m, i) => (
                    <span key={i}>{m}</span>
                ))}
            </div>
        </Card>
    );
}
