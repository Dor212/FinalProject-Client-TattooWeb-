import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import { useCart } from "../../../components/context/CartContext";
import { useCanvases } from "../../CanvasesPage/hooks/useCanvases";
import type { CanvasItem } from "../../CanvasesPage/components/types";
import { formatILS, priceForSize } from "../../CanvasesPage/components/ui";

type Props = {
    onOpenCart: () => void;
};

const cls = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

function ImageStage({ src, size }: { src: string; size: CanvasItem["size"] }) {
    const stageClass =
        size === "80×25" ? "h-[clamp(240px,44svh,420px)]" : "h-[clamp(280px,48svh,460px)]";

    return (
        <div
            className={cls(
                "relative w-full rounded-[26px] overflow-hidden border border-[#B9895B]/16 bg-white/20 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.14)] p-3",
                stageClass
            )}
        >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_10%,rgba(185,137,91,0.16),transparent_55%),radial-gradient(circle_at_88%_92%,rgba(232,217,194,0.32),transparent_58%)]" />
            <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-[#F6F1E8]/72 ring-1 ring-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.11)]">
                <img
                    src={src}
                    alt=""
                    className="block object-contain w-full h-full"
                    loading="lazy"
                    decoding="async"
                />
            </div>
        </div>
    );
}

function CanvasCard({ item, onAdd }: { item: CanvasItem; onAdd: (item: CanvasItem) => void }) {
    const price = priceForSize(item.size);
    const hasVariants = (item.variants?.length || 0) > 0;

    const [activeId, setActiveId] = useState<string>("__base");

    const activeSrc = useMemo(() => {
        if (activeId === "__base") return item.imageUrl;
        const hit = item.variants?.find((v) => v.id === activeId);
        return hit?.imageUrl || item.imageUrl;
    }, [activeId, item.imageUrl, item.variants]);

    const handleAdd = () => {
        onAdd({ ...item, imageUrl: activeSrc });
    };

    return (
        <div className="w-full min-w-0 rounded-[28px] border border-[#B9895B]/14 bg-white/18 backdrop-blur-xl shadow-[0_22px_80px_rgba(30,30,30,0.12)] overflow-hidden">
            <div className="p-3.5 sm:p-4">
                <ImageStage src={activeSrc} size={item.size} />

                {hasVariants && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => setActiveId("__base")}
                            title="תמונה ראשית"
                            aria-label="תמונה ראשית"
                            className={cls(
                                "h-7 w-7 rounded-xl border transition grid place-items-center",
                                activeId === "__base"
                                    ? "border-[#B9895B] ring-2 ring-[#B9895B]/25 bg-white/70"
                                    : "border-[#B9895B]/18 bg-white/45 hover:bg-white/60"
                            )}
                        >
                            <span className="h-3.5 w-3.5 rounded-md bg-[linear-gradient(135deg,rgba(185,137,91,0.25),rgba(246,241,232,0.85))] border border-[#B9895B]/18" />
                        </button>

                        {(item.variants || []).map((v) => {
                            const active = v.id === activeId;
                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => setActiveId(v.id)}
                                    title={v.label ? `${v.label}` : "צבע"}
                                    aria-label={v.label ? `${v.label}` : "צבע"}
                                    className={cls(
                                        "h-7 w-7 rounded-xl border transition",
                                        active
                                            ? "border-[#B9895B] ring-2 ring-[#B9895B]/25"
                                            : "border-[#B9895B]/18 hover:ring-2 hover:ring-[#B9895B]/15"
                                    )}
                                    style={{ backgroundColor: v.color }}
                                />
                            );
                        })}
                    </div>
                )}

                <div className="mt-3 text-center">
                    <div className="font-extrabold text-[13.5px] sm:text-[14.5px] text-[#1E1E1E] truncate">
                        {item.name}
                    </div>

                    <div className="mt-1 text-[15px] sm:text-[16px] font-extrabold text-[#B9895B]">
                        {formatILS(price)}
                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="mt-2.5 w-full rounded-2xl bg-[#B9895B] text-white py-2.5 text-[13.5px] sm:text-sm font-extrabold shadow-[0_16px_46px_rgba(30,30,30,0.15)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                    >
                        הוסף לעגלה
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CanvasesHomeSection({ onOpenCart }: Props) {
    const navigate = useNavigate();
    const cart = useCart();

    const apiBase = import.meta.env.VITE_API_URL as string;
    const { loading, error, filtered } = useCanvases(apiBase);

    const previewItems = useMemo<CanvasItem[]>(
        () => filtered.slice(0, 3),
        [filtered]
    );

    const toast = useMemo(
        () =>
            Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 850,
                backdrop: false,
                background: "#F6F1E8",
                color: "#3B3024",
                customClass: {
                    popup: "rounded-2xl border border-[#B9895B]/25 shadow-lg",
                    title: "text-sm font-extrabold",
                    htmlContainer: "text-xs opacity-80",
                },
            }),
        []
    );

    const onAdd = (item: CanvasItem) => {
        cart.addCanvas(
            {
                id: item._id,
                name: item.name,
                size: item.size,
                image: item.imageUrl,
            },
            1
        );

        onOpenCart();

        void toast.fire({
            title: "נוסף",
            html: `<span>${item.name}</span>`,
        });
    };

    return (
        <section className="container px-5 pb-10 mx-auto pt-14">
            <div className="max-w-5xl mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E]"
                >
                    קאנבסים בעיצוב הסטודיו
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                    className="mt-2 text-sm sm:text-base text-[#1E1E1E]/65"
                >
                    כל קאנבס הוא יצירה בפני עצמה · מידה קבועה · איכות סטודיו
                </motion.p>

                <div className="grid grid-cols-2 gap-4 mt-7 lg:grid-cols-3 sm:gap-5">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-[28px] border border-[#B9895B]/14 bg-white/18 backdrop-blur-xl shadow-[0_22px_80px_rgba(30,30,30,0.12)] overflow-hidden animate-pulse"
                            >
                                <div className="p-3.5 sm:p-4">
                                    <div className="h-[clamp(240px,44svh,420px)] rounded-[26px] bg-white/20 border border-[#B9895B]/16" />
                                    <div className="h-4 mt-3 rounded bg-white/25" />
                                    <div className="h-5 mt-2 rounded bg-white/25" />
                                    <div className="h-10 mt-3 rounded-2xl bg-white/25" />
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="text-sm text-red-700 col-span-full">{error}</div>
                    ) : (
                        previewItems.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.38, delay: idx * 0.06 }}
                                className="min-w-0"
                            >
                                <CanvasCard item={item} onAdd={onAdd} />
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="flex justify-center mt-7">
                    <button
                        onClick={() => navigate("/canvases")}
                        className="px-6 py-3 rounded-2xl font-extrabold bg-[#1E1E1E] text-[#F6F1E8] hover:brightness-110 transition"
                    >
                        לכל הקאנבסים
                    </button>
                </div>
            </div>
        </section>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useMemo as _useMemo, useState } from "react";
