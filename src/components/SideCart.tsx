import { useMemo } from "react";
import { useCart } from "./context/CartContext";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
};

const formatILS = (n: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

export default function SideCart({ isOpen, onClose, onCheckout }: Props) {
    const cart = useCart();
    const items = cart.items;
    const hasItems = items.length > 0;

    const summary = useMemo(() => {
        const canvasCount = items.filter((i) => i.kind === "canvas").reduce((s, i) => s + i.qty, 0);
        const productCount = items.filter((i) => i.kind === "product").reduce((s, i) => s + i.qty, 0);
        return { canvasCount, productCount };
    }, [items]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" onClick={onClose} role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/30" />

            <aside
                className="absolute top-0 right-0 h-full w-[340px] max-w-[92vw] bg-[#F6F1E8] shadow-2xl border-l border-[#1E1E1E]/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-[#1E1E1E]/10 flex items-center justify-between">
                        <div>
                            <div className="text-lg font-extrabold text-[#1E1E1E]">העגלה שלך</div>
                            <div className="text-xs text-[#1E1E1E]/60">
                                קאנבסים: {summary.canvasCount} · מוצרים: {summary.productCount}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-3 py-1 rounded-lg border border-[#1E1E1E]/15 bg-white/50 text-[#1E1E1E] hover:bg-white"
                        >
                            סגור
                        </button>
                    </div>

                    <div className="flex-1 p-4 space-y-3 overflow-auto">
                        {!hasItems ? (
                            <div className="rounded-2xl border border-[#B9895B]/18 bg-white/40 p-4 text-center text-sm text-[#1E1E1E]/70">
                                העגלה ריקה בינתיים.
                            </div>
                        ) : (
                            items.map((i) => {
                                const key = `${i.kind}:${i.id}:${i.size}`;

                                return (
                                    <div key={key} className="rounded-2xl border border-[#B9895B]/16 bg-white/45 p-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#1E1E1E]/10 bg-white shrink-0">
                                                <img src={i.image} alt={i.name} className="object-cover w-full h-full" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm text-[#1E1E1E] truncate">{i.name}</div>
                                                <div className="text-xs text-[#1E1E1E]/65 mt-0.5">
                                                    {i.kind === "canvas" ? "קאנבס" : "מוצר"} · מידה:{" "}
                                                    <span className="font-semibold">{String(i.size).toUpperCase()}</span>
                                                </div>

                                                <div className="flex items-center justify-between gap-2 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => cart.setQty(key, i.qty - 1)}
                                                            className="w-8 h-8 rounded-lg border border-[#1E1E1E]/12 bg-white/70 text-[#1E1E1E] hover:bg-white"
                                                        >
                                                            -
                                                        </button>
                                                        <div className="min-w-[26px] text-center text-sm font-bold text-[#1E1E1E]">
                                                            {i.qty}
                                                        </div>
                                                        <button
                                                            onClick={() => cart.setQty(key, i.qty + 1)}
                                                            className="w-8 h-8 rounded-lg border border-[#1E1E1E]/12 bg-white/70 text-[#1E1E1E] hover:bg-white"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => cart.remove(key)}
                                                        className="text-xs font-semibold text-red-700 hover:underline"
                                                    >
                                                        הסר
                                                    </button>
                                                </div>

                                                {i.kind === "product" && (
                                                    <div className="mt-2 text-xs font-bold text-[#B9895B]">
                                                        {formatILS(i.price * i.qty)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="p-4 border-t border-[#1E1E1E]/10 bg-[#F6F1E8]">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-[#1E1E1E]/75">סה״כ</div>
                            <div className="text-lg font-extrabold text-[#B9895B]">{formatILS(cart.totals.total)}</div>
                        </div>

                        <button
                            disabled={!hasItems}
                            onClick={onCheckout}
                            className={`mt-3 w-full py-3 rounded-xl font-bold transition ${!hasItems
                                    ? "bg-[#B9895B]/35 text-white/80 cursor-not-allowed"
                                    : "bg-[#B9895B] text-[#F6F1E8] hover:brightness-95 active:brightness-90"
                                }`}
                        >
                            להמשך לתשלום
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
