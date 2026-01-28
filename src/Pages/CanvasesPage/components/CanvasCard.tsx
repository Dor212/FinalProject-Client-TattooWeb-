import { useMemo, useState } from "react";
import type { CanvasItem } from "./types";
import { formatILS, priceForSize } from "./ui";

const cls = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

function ImageStage({ src, size }: { src: string; size: CanvasItem["size"] }) {
    const stageClass = size === "80×25" ? "h-[clamp(240px,44svh,420px)]" : "h-[clamp(280px,48svh,460px)]";

    return (
        <div
            className={cls(
                "relative w-full rounded-[26px] overflow-hidden border border-[#B9895B]/16 bg-white/20 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.14)] p-3",
                stageClass,
            )}
        >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_10%,rgba(185,137,91,0.16),transparent_55%),radial-gradient(circle_at_88%_92%,rgba(232,217,194,0.32),transparent_58%)]" />
            <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-[#F6F1E8]/72 ring-1 ring-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.11)]">
                <img src={src} alt="" className="block object-contain w-full h-full" loading="lazy" decoding="async" />
            </div>
        </div>
    );
}

export default function CanvasCard({ item, onAdd }: { item: CanvasItem; onAdd: (item: CanvasItem) => void }) {
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
                                    : "border-[#B9895B]/18 bg-white/45 hover:bg-white/60",
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
                                            : "border-[#B9895B]/18 hover:ring-2 hover:ring-[#B9895B]/15",
                                    )}
                                    style={{ backgroundColor: v.color }}
                                />
                            );
                        })}
                    </div>
                )}

                <div className="mt-3 text-center">
                    <div className="font-extrabold text-[13.5px] sm:text-[14.5px] text-[#1E1E1E] truncate">{item.name}</div>

                    <div className="mt-1 text-[15px] sm:text-[16px] font-extrabold text-[#B9895B]">{formatILS(price)}</div>

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
