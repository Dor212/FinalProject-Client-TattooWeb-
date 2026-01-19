import React, { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface CartItem {
    _id: string;
    title: string;
    price?: number;
    quantity: number;
    size: string;
    imageUrl: string;
}

interface SideCartProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string, size: string) => void;
    handleCheckout: () => void;
    totalsILS?: number;
}

const formatILS = (n: number) =>
    new Intl.NumberFormat("he-IL", {
        style: "currency",
        currency: "ILS",
        maximumFractionDigits: 0,
    }).format(n);

function clampQty(raw: string | number): number {
    const num = typeof raw === "string" ? parseInt(raw, 10) : raw;
    const safe = Number.isFinite(num) ? Number(num) : 1;
    return Math.max(1, safe);
}

export default function SideCart({
    isOpen,
    onClose,
    cart,
    updateQuantity,
    removeFromCart,
    handleCheckout,
    totalsILS,
}: SideCartProps) {
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    const derivedTotal = useMemo(() => {
        if (typeof totalsILS === "number") return totalsILS;
        return cart.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
    }, [cart, totalsILS]);

    const onQtyChange = (id: string, raw: string | number) => {
        updateQuantity(id, clampQty(raw));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.button
                        type="button"
                        aria-label="סגור עגלה"
                        className="fixed inset-0 z-40 bg-black/45"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.aside
                        dir="rtl"
                        className="fixed top-0 left-0 z-50 flex h-full w-[22.5rem] max-w-[92vw] flex-col overflow-hidden"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 34 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="עגלה"
                    >
                        <div className="relative h-full border-r border-[#B9895B]/18 bg-white/28 backdrop-blur-xl shadow-[12px_0_70px_rgba(30,30,30,0.18)]">
                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(185,137,91,0.16),transparent_55%),radial-gradient(circle_at_80%_92%,rgba(232,217,194,0.28),transparent_55%)]" />

                            <div className="relative flex items-center justify-between gap-4 px-5 py-5 border-b border-[#B9895B]/12">
                                <div className="min-w-0">
                                    <h2 className="text-xl font-extrabold tracking-wide text-[#B9895B]">העגלה שלך</h2>
                                    <p className="mt-1 text-xs text-[#1E1E1E]/65">פריטים שנבחרו, מוכן לצ׳קאאוט</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="סגור"
                                    className="grid w-10 h-10 place-items-center rounded-xl border border-[#B9895B]/20 bg-white/30 text-[#1E1E1E]/70 hover:bg-white/45 transition focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="relative flex-1 px-5 py-10">
                                    <div className="rounded-2xl border border-[#B9895B]/14 bg-white/22 p-6 text-center">
                                        <p className="text-sm font-semibold text-[#1E1E1E]/80">העגלה ריקה.</p>
                                        <p className="mt-1 text-xs text-[#1E1E1E]/55">תוסיף פריט ונמשיך מפה 🙂</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="relative flex-1 px-5 py-5 space-y-3 overflow-y-auto">
                                        {cart.map((item) => (
                                            <div
                                                key={`${item._id}-${item.size}`}
                                                className="group rounded-2xl border border-[#B9895B]/14 bg-white/22 p-3 shadow-sm hover:bg-white/30 transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="relative overflow-hidden rounded-xl border border-[#B9895B]/12 bg-white/20">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="object-cover w-16 h-16"
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <h3 className="text-sm font-extrabold text-[#1E1E1E] truncate">{item.title}</h3>
                                                                <p className="mt-0.5 text-xs text-[#1E1E1E]/65">
                                                                    מידה: <span className="font-semibold text-[#1E1E1E]/80">{item.size}</span>
                                                                </p>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => removeFromCart(item._id, item.size)}
                                                                className="grid text-red-600 transition border w-9 h-9 place-items-center rounded-xl border-red-500/20 bg-red-500/10 hover:bg-red-500/14 focus:outline-none focus:ring-2 focus:ring-red-500/25"
                                                                aria-label={`הסר ${item.title}`}
                                                                title="הסר פריט"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-3 mt-3">
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-xs font-semibold text-[#1E1E1E]/70" htmlFor={`qty-${item._id}-${item.size}`}>
                                                                    כמות
                                                                </label>
                                                                <input
                                                                    id={`qty-${item._id}-${item.size}`}
                                                                    type="number"
                                                                    min={1}
                                                                    inputMode="numeric"
                                                                    value={item.quantity}
                                                                    onChange={(e) => onQtyChange(item._id, e.target.value)}
                                                                    className="w-20 rounded-xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                                                    aria-label={`כמות עבור ${item.title}`}
                                                                />
                                                            </div>

                                                            <div className="text-left">
                                                                {typeof item.price === "number" ? (
                                                                    <div className="text-sm font-extrabold text-[#B9895B]">
                                                                        {formatILS(item.price * item.quantity)}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-xs text-[#1E1E1E]/55">מחיר יחושב בהמשך</div>
                                                                )}
                                                                {typeof item.price === "number" && (
                                                                    <div className="text-[11px] text-[#1E1E1E]/55">{formatILS(item.price)} ליח׳</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative border-t border-[#B9895B]/12 px-5 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold text-[#1E1E1E]/75">סה״כ</div>
                                            <div className="text-lg font-extrabold text-[#B9895B]">{formatILS(derivedTotal)}</div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleCheckout}
                                            disabled={cart.length === 0}
                                            className={`mt-4 w-full rounded-xl py-3 font-semibold transition ${cart.length === 0
                                                    ? "bg-[#B9895B]/35 text-white/85 cursor-not-allowed"
                                                    : "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90"
                                                }`}
                                            aria-label="המשך לתשלום"
                                        >
                                            לתשלום
                                        </button>

                                        <p className="mt-2 text-center text-[11px] text-[#1E1E1E]/55">תשלום ומשלוח נסגרים בעמוד הבא</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
