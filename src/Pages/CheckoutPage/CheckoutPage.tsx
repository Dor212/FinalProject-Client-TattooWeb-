import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/context/CartContext.tsx";

type Customer = {
    fullname: string;
    phone: string;
    city: string;
    street: string;
    houseNumber: string;
    email?: string;
    notes?: string;
};

type CartPayloadItem = {
    _id: string;
    title: string;
    size: string;
    quantity: number;
    imageUrl: string;
    category: string;
    price?: number;
};

type OrderResponse = {
    totals?: {
        total?: number;
    };
};

const API = import.meta.env.VITE_API_URL as string;

function safeTrim(v: string): string {
    return v.trim();
}

function isMinLen(v: string, n: number): boolean {
    return safeTrim(v).length >= n;
}

function calcPrice(category: string): number | undefined {
    if (category === "pair") return 390;
    if (category === "triple") return 550;
    return undefined;
}

function formatILS(n: number): string {
    return `₪${Math.round(n).toLocaleString("he-IL")}`;
}

export default function CheckoutPage() {
    const cart = useCart();
    const navigate = useNavigate();

    if (!cart) {
        return (
            <div dir="rtl" className="max-w-2xl p-4 mx-auto">
                <h1 className="text-2xl font-bold text-[#B9895B]">תשלום</h1>
                <p className="mt-3 text-[#1E1E1E]/75">שגיאה בטעינת העגלה.</p>
            </div>
        );
    }

    const { state, totals, clear } = cart;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [form, setForm] = useState<Customer>({
        fullname: "",
        phone: "",
        city: "",
        street: "",
        houseNumber: "",
        email: "",
        notes: "",
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [err, setErr] = useState<string | null>(null);

    const canSubmit =
        state.items.length > 0 &&
        isMinLen(form.fullname, 2) &&
        isMinLen(form.phone, 6) &&
        isMinLen(form.city, 2) &&
        isMinLen(form.street, 2) &&
        isMinLen(form.houseNumber, 1);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cartPayload: CartPayloadItem[] = useMemo(
        () =>
            state.items.map((i) => ({
                _id: i.id,
                title: i.name,
                size: i.size,
                quantity: i.qty,
                imageUrl: i.image,
                category: i.category,
                price: calcPrice(i.category),
            })),
        [state.items]
    );

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErr(null);
        if (!canSubmit || loading) return;

        setLoading(true);

        try {
            const res = await fetch(`${API}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source: "canvas",
                    section: "/canvases",
                    customerDetails: form,
                    cart: cartPayload,
                }),
            });

            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || "Order failed");
            }

            let finalTotal: number | undefined;
            try {
                const data: OrderResponse = (await res.json()) as OrderResponse;
                finalTotal = data?.totals?.total;
            } catch {
                finalTotal = undefined;
            }

            clear();
            setLoading(false);

            const msg =
                `תודה! ההזמנה נקלטה ונשלחה למייל של עומר` +
                (typeof finalTotal === "number" ? ` (סכום: ${formatILS(finalTotal)})` : "") +
                ".";

            alert(msg);
            navigate("/canvases", { replace: true });
        } catch (e: unknown) {
            const errorMessage =
                typeof e === "object" && e !== null && "message" in e ? String((e as { message?: unknown }).message) : null;

            setErr(errorMessage || "שגיאה בשליחת ההזמנה");
            setLoading(false);
        }
    }

    if (state.items.length === 0) {
        return (
            <div dir="rtl" className="max-w-2xl p-4 mx-auto">
                <h1 className="text-2xl font-extrabold tracking-wide text-[#B9895B]">תשלום</h1>
                <p className="mt-3 text-[#1E1E1E]/75">העגלה ריקה.</p>
            </div>
        );
    }

    return (
        <div dir="rtl" className="px-4 pt-24 pb-16">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-[#B9895B]">פרטי משלוח והזמנה</h1>
                    <p className="mt-2 text-sm md:text-base text-[#1E1E1E]/70">
                        הטופס נשמר נקי, הסכום הסופי נסגר בצד השרת ונשלח במייל.
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-[26px] border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.12)]">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_12%,rgba(185,137,91,0.14),transparent_55%),radial-gradient(circle_at_82%_92%,rgba(232,217,194,0.28),transparent_55%)]" />

                    <div className="relative p-5 md:p-7 border-b border-[#B9895B]/12">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg md:text-xl font-extrabold text-[#1E1E1E]">סיכום עגלה</h2>
                                <p className="mt-1 text-xs md:text-sm text-[#1E1E1E]/65">בדיקה מהירה לפני שליחה ✍️</p>
                            </div>

                            <div className="text-left">
                                <div className="text-xs text-[#1E1E1E]/60">סה״כ משוער</div>
                                <div className="text-lg md:text-xl font-extrabold text-[#B9895B]">{formatILS(totals.total)}</div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {state.items.map((i) => (
                                <div
                                    key={`${i.id}-${i.size}`}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-[#B9895B]/12 bg-white/35 px-3 py-2"
                                >
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-[#1E1E1E] truncate">{i.name}</div>
                                        <div className="text-xs text-[#1E1E1E]/65">
                                            מידה: <span className="font-semibold text-[#1E1E1E]/80">{i.size}</span> · כמות:{" "}
                                            <span className="font-semibold text-[#1E1E1E]/80">{i.qty}</span>
                                        </div>
                                    </div>

                                    <div className="text-xs text-[#1E1E1E]/55 whitespace-nowrap">
                                        {i.category === "pair" ? "PAIR" : i.category === "triple" ? "TRIPLE" : String(i.category).toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 text-xs text-[#1E1E1E]/60">
                            הסכום הסופי מחושב בשרת ונשלח במייל. במידת הצורך נחזור אליך לאישור.
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="relative p-5 md:p-7">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">שם מלא</label>
                                    <input
                                        className="w-full rounded-xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                        placeholder="ישראל ישראלי"
                                        value={form.fullname}
                                        onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">טלפון</label>
                                    <input
                                        className="w-full rounded-xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                        placeholder="050-0000000"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        required
                                        inputMode="tel"
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">עיר</label>
                                    <input
                                        className="w-full rounded-xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                        placeholder="תל אביב"
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                        required
                                        autoComplete="address-level2"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">רחוב</label>
                                    <input
                                        className="w-full rounded-xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                        placeholder="דיזנגוף"
                                        value={form.street}
                                        onChange={(e) => setForm({ ...form, street: e.target.value })}
                                        required
                                        autoComplete="address-line1"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">מס׳ בית</label>
                                    <input
                                        className="w-full rounded-xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                        placeholder="12"
                                        value={form.houseNumber}
                                        onChange={(e) => setForm({ ...form, houseNumber: e.target.value })}
                                        required
                                        inputMode="numeric"
                                        autoComplete="address-line2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">אימייל (אופציונלי)</label>
                                    <input
                                        className="w-full rounded-xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                        placeholder="name@email.com"
                                        value={form.email || ""}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        inputMode="email"
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">הערות (אופציונלי)</label>
                                    <textarea
                                        className="w-full min-h-[46px] rounded-xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                        placeholder="שעות נוחות למשלוח / הערות מיוחדות"
                                        value={form.notes || ""}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            {err && (
                                <div className="px-4 py-3 text-sm text-red-700 border rounded-xl border-red-500/25 bg-red-500/10">
                                    {err}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!canSubmit || loading}
                                className={`mt-1 w-full rounded-xl py-3 font-semibold transition ${!canSubmit || loading
                                        ? "bg-[#B9895B]/35 text-white/85 cursor-not-allowed"
                                        : "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90"
                                    }`}
                            >
                                {loading ? "שולח הזמנה…" : "שלח הזמנה"}
                            </button>

                            <div className="pt-1 text-center text-xs text-[#1E1E1E]/55">
                                ממשיכים? אפשר לחזור לעמוד הקנבסים אחרי השליחה.
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mt-5 text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/canvases")}
                        className="inline-flex items-center justify-center rounded-xl border border-[#B9895B]/20 bg-white/25 px-4 py-2 text-sm font-semibold text-[#1E1E1E]/80 hover:bg-white/40 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                    >
                        חזרה לעמוד הקנבסים
                    </button>
                </div>
            </div>
        </div>
    );
}
