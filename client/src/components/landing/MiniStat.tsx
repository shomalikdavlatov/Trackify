type Props = {
    label: string;
    value: string;
    deltaPct?: number | null;
    goodWhenUp?: boolean;
    className?: string;
};

export default function MiniStat({
    label,
    value,
    deltaPct = null,
    goodWhenUp,
    className,
}: Props) {
    let deltaText = "—";
    let deltaColor = "text-slate-500";
    let arrow: "↑" | "↓" | "-" = "-";

    if (deltaPct !== null && Number.isFinite(deltaPct)) {
        const up = deltaPct > 0;
        const down = deltaPct < 0;
        arrow = up ? "↑" : down ? "↓" : "-";
        const favorable =
            goodWhenUp == null
                ? null
                : up
                ? goodWhenUp
                : down
                ? !goodWhenUp
                : null;

        deltaColor =
            favorable == null
                ? "text-slate-600"
                : favorable
                ? "text-green-600"
                : "text-rose-600";

        deltaText = `${arrow} ${Math.abs(deltaPct).toFixed(0)}% vs last period`;
    }

    return (
        <div
            className={
                "rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur " +
                (className ?? "")
            }
        >
            <div className="text-xs text-slate-500">{label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">
                {value}
            </div>
            <div className={"mt-1 text-xs " + deltaColor}>{deltaText}</div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" />
            </div>
        </div>
    );
}
