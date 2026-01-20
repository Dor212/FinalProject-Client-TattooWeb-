import { FaBoxOpen, FaLayerGroup, FaPaintBrush } from "react-icons/fa";
import { cls, formatILS } from "./ui";

const KpiCard = ({
    icon,
    title,
    value,
    sub,
}: {
    icon: React.ReactNode;
    title: string;
    value: React.ReactNode;
    sub?: React.ReactNode;
}) => {
    const toneCls = "bg-[#B9895B]/12 text-[#1E1E1E] border-[#B9895B]/22";

    return (
        <div className={cls("rounded-[24px] border p-5 shadow-[0_14px_50px_rgba(30,30,30,0.10)]", toneCls)}>
            <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/35 text-[#B9895B]">
                    {icon}
                </div>
                <div className="text-end">
                    <div className="text-2xl font-extrabold leading-none">{value}</div>
                    <div className="mt-1 text-xs text-[#1E1E1E]/65">{title}</div>
                </div>
            </div>
            {sub && <div className="mt-3 text-xs text-[#1E1E1E]/65 text-end">{sub}</div>}
        </div>
    );
};

const AdminKpis = ({
    productsCount,
    productsRevenueILS,
    sketchesCount,
    canvasesCount,
}: {
    productsCount: number;
    productsRevenueILS: number;
    sketchesCount: number;
    canvasesCount: number;
}) => {
    return (
        <>
            <KpiCard
                icon={<FaBoxOpen />}
                title="מוצרים"
                value={productsCount}
                sub={<span className="font-semibold text-[#B9895B]">{formatILS(productsRevenueILS)}</span>}
            />
            <KpiCard icon={<FaPaintBrush />} title="סקיצות" value={sketchesCount} />
            <KpiCard icon={<FaLayerGroup />} title="קאנבסים" value={canvasesCount} />
        </>
    );
};

export default AdminKpis;
