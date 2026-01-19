import { FaBoxOpen, FaExclamationTriangle, FaPaintBrush } from "react-icons/fa";
import { cls } from "./ui";

const KpiCard = ({
    icon,
    title,
    value,
    tone = "warm",
    hint,
}: {
    icon: React.ReactNode;
    title: string;
    value: React.ReactNode;
    hint?: string;
    tone?: "warm" | "accent";
}) => {
    const toneCls =
        tone === "accent"
            ? "bg-[#B9895B] text-white border-[#B9895B]/25"
            : "bg-white/35 text-[#1E1E1E] border-[#B9895B]/18";

    return (
        <div className={cls("rounded-[24px] border p-5 shadow-[0_14px_50px_rgba(30,30,30,0.10)]", toneCls)}>
            <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20">
                    {icon}
                </div>
                <div className="text-end">
                    <div className="text-2xl font-extrabold leading-none">{value}</div>
                    <div className={cls("mt-1 text-xs", tone === "accent" ? "text-white/85" : "text-[#1E1E1E]/65")}>
                        {title}
                    </div>
                </div>
            </div>
            {hint && (
                <div className={cls("mt-3 text-xs", tone === "accent" ? "text-white/85" : "text-[#1E1E1E]/60")}>
                    {hint}
                </div>
            )}
        </div>
    );
};

const AdminKpis = ({
    totalProducts,
    outOfStockCount,
    totalSketches,
}: {
    totalProducts: number;
    outOfStockCount: number;
    totalSketches: number;
}) => {
    return (
        <>
            <KpiCard
                icon={<FaBoxOpen className="text-white" />}
                title="סה״כ מוצרים"
                value={totalProducts}
                tone="accent"
                hint="כולל מוצרים עם/בלי מלאי מידות"
            />
            <KpiCard
                icon={<FaExclamationTriangle className="text-[#B9895B]" />}
                title="אזל מהמלאי"
                value={outOfStockCount}
                tone="warm"
                hint="חישוב לפי L/XL/XXL"
            />
            <KpiCard
                icon={<FaPaintBrush className="text-[#B9895B]" />}
                title="סה״כ סקיצות"
                value={totalSketches}
                tone="warm"
                hint="סכום כל הקטגוריות"
            />
        </>
    );
};

export default AdminKpis;
