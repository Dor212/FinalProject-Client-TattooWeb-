import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/context/CartContext.tsx";
import { createHypPayment } from "../../api/hypayApi.ts";

type Customer = {
    fullname: string;
    phone: string;
    email?: string | null;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
    notes?: string;
};

type PayloadItem = {
    _id?: string;
    title: string;
    size?: string;
    quantity: number;
    price?: number;
    imageUrl?: string;
    category?: string;
};

const formatILS = (n: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

function trim(v: string) {
    return v.trim();
}

function minLen(v: string, n: number) {
    return trim(v).length >= n;
}

function makeOrderId() {
    const r = Math.floor(Math.random() * 1_000_000);
    return `ORD-${Date.now()}-${r}`;
}

function safeNumber(v: unknown): number {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
}

export default function CheckoutPage() {
    const cart = useCart();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const productsPayload = useMemo(() => cart.getMerchPayload() as PayloadItem[], [cart]);
    const canvasesPayload = useMemo(() => cart.getCanvasPayload() as PayloadItem[], [cart]);

    const combinedCartPayload = useMemo(
        () => [...canvasesPayload, ...productsPayload],
        [canvasesPayload, productsPayload]
    );

    const needsZip = productsPayload.length > 0;

    const [form, setForm] = useState<Customer>({
        fullname: "",
        phone: "",
        email: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
        notes: "",
    });

    const canSubmit =
        cart.items.length > 0 &&
        minLen(form.fullname, 2) &&
        minLen(form.phone, 6) &&
        minLen(form.city, 2) &&
        minLen(form.street, 2) &&
        minLen(form.houseNumber, 1) &&
        (!needsZip || minLen(form.zip, 2));

    const submit = async () => {
        setErr(null);
        if (!canSubmit || loading) return;

        const totalShekels = safeNumber(cart.totals.total);
        const amount = Math.round(totalShekels * 100) / 100;

        if (!Number.isFinite(amount) || amount <= 0) {
            setErr("סכום לתשלום לא תקין");
            return;
        }

        const orderId = makeOrderId();

        const customerDetails = {
            fullname: form.fullname,
            phone: form.phone,
            email: form.email || null,
            city: form.city,
            street: form.street,
            houseNumber: form.houseNumber,
            zip: form.zip,
            notes: form.notes || "",
        };

        try {
            setLoading(true);

            sessionStorage.setItem(
                `pendingOrder:${orderId}`,
                JSON.stringify({
                    source: "checkout",
                    section: "/checkout",
                    customerDetails,
                    cart: combinedCartPayload,
                })
            );

            const streetFull = `${trim(form.street)} ${trim(form.houseNumber)}`.trim();

            const res = await createHypPayment({
                amount,
                orderId,
                info: `Omer Aviv order ${orderId}`,
                pageLang: "HEB",
                coin: 1,
                tmp: 1,
                clientName: trim(form.fullname),
                email: form.email ? trim(form.email) : undefined,
                phone: trim(form.phone),
                cell: trim(form.phone),
                street: streetFull || undefined,
                city: trim(form.city) || undefined,
                zip: trim(form.zip) || undefined,
            });

            if (!res.ok) {
                setErr(res.message || "שגיאה ביצירת תשלום");
                setLoading(false);
                return;
            }

            window.location.href = String(res.paymentUrl);
        } catch (e: unknown) {
            const msg =
                typeof e === "object" && e !== null && "message" in e
                    ? String((e as { message?: unknown }).message)
                    : null;
            setErr(msg || "שגיאה ביצירת תשלום");
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div dir="rtl" className="max-w-2xl p-4 pt-24 mx-auto">
                <h1 className="text-2xl font-extrabold text-[#B9895B]">תשלום</h1>
                <p className="mt-3 text-[#1E1E1E]/75">העגלה ריקה.</p>
            </div>
        );
    }

    return (
        <div dir="rtl" className="px-4 pt-24 pb-16">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-[#B9895B]">סיום הזמנה</h1>
                    <p className="mt-2 text-sm md:text-base text-[#1E1E1E]/70">Checkout אחד לכל מה שבחרת באתר.</p>
                </div>

                <div className="relative overflow-hidden rounded-[26px] border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.12)]">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_12%,rgba(185,137,91,0.14),transparent_55%),radial-gradient(circle_at_82%_92%,rgba(232,217,194,0.28),transparent_55%)]" />

                    <div className="relative p-5 md:p-7 border-b border-[#B9895B]/12">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg md:text-xl font-extrabold text-[#1E1E1E]">סיכום עגלה</h2>
                                <p className="mt-1 text-xs md:text-sm text-[#1E1E1E]/65">בדיקה מהירה לפני תשלום</p>
                            </div>

                            <div className="text-left">
                                <div className="text-xs text-[#1E1E1E]/60">סה״כ</div>
                                <div className="text-lg md:text-xl font-extrabold text-[#B9895B]">{formatILS(safeNumber(cart.totals.total))}</div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {cart.items.map((i) => (
                                <div
                                    key={`${i.kind}:${i.id}:${i.size}`}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-[#B9895B]/12 bg-white/35 px-3 py-2"
                                >
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-[#1E1E1E] truncate">{i.name}</div>
                                        <div className="text-xs text-[#1E1E1E]/65">
                                            {i.kind === "canvas" ? "קאנבס" : "מוצר"} · מידה:{" "}
                                            <span className="font-semibold text-[#1E1E1E]/80">{String(i.size).toUpperCase()}</span> · כמות:{" "}
                                            <span className="font-semibold text-[#1E1E1E]/80">{i.qty}</span>
                                        </div>
                                    </div>

                                    {i.kind === "product" ? (
                                        <div className="text-xs font-semibold text-[#B9895B] whitespace-nowrap">{formatILS(i.price * i.qty)}</div>
                                    ) : (
                                        <div className="text-xs text-[#1E1E1E]/55 whitespace-nowrap">
                                            {i.category === "pair" ? "PAIR" : i.category === "triple" ? "TRIPLE" : "STANDARD"}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 text-xs text-[#1E1E1E]/60">קאנבסים מחושבים סופית בצד השרת לפי כמות. מוצרים לפי המחיר שמופיע בעגלה.</div>
                    </div>

                    <div className="relative p-5 md:p-7">
                        {err && <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-2xl bg-red-50">{err}</div>}

                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">שם מלא</label>
                                    <input
                                        value={form.fullname}
                                        onChange={(e) => setForm((p) => ({ ...p, fullname: e.target.value }))}
                                        className="w-full rounded-xl border border-[#B9895B]/18 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                        placeholder="שם מלא"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">טלפון</label>
                                    <input
                                        value={form.phone}
                                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                        className="w-full rounded-xl border border-[#B9895B]/18 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                        placeholder="טלפון"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">עיר</label>
                                    <input
                                        value={form.city}
                                        onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                                        className="w-full rounded-xl border border-[#B9895B]/18 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                        placeholder="עיר"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">אימייל (אופציונלי)</label>
                                    <input
                                        value={form.email ?? ""}
                                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                        className="w-full rounded-xl border border-[#B9895B]/18 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                        placeholder="אימייל"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">רחוב</label>
                                    <input
                                        value={form.street}
                                        onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))}
                                        className="w-full rounded-xl border border-[#B9895B]/18 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                        placeholder="רחוב"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">מספר בית</label>
                                    <input
                                        value={form.houseNumber}
                                        onChange={(e) => setForm((p) => ({ ...p, houseNumber: e.target.value }))}
                                        className="w-full rounded-xl border border-[#B9895B]/18 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                        placeholder="מספר"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">מיקוד{needsZip ? "" : " (אופציונלי)"}</label>
                                    <input
                                        value={form.zip}
                                        onChange={(e) => setForm((p) => ({ ...p, zip: e.target.value }))}
                                        className="w-full rounded-xl border border-[#B9895B]/18 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                        placeholder="מיקוד"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">הערות (אופציונלי)</label>
                                    <input
                                        value={form.notes ?? ""}
                                        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                                        className="w-full rounded-xl border border-[#B9895B]/18 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                        placeholder="הערות"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={!canSubmit || loading}
                                onClick={submit}
                                className={`mt-2 w-full rounded-xl py-3 font-semibold transition ${!canSubmit || loading
                                        ? "bg-[#B9895B]/35 text-white/85 cursor-not-allowed"
                                        : "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90"
                                    }`}
                            >
                                {loading ? "מעביר לתשלום..." : "המשך לתשלום"}
                            </button>

                            {needsZip && <div className="text-center text-[11px] text-[#1E1E1E]/55">בעגלה יש מוצרים, לכן מיקוד נדרש למשלוח.</div>}

                            <button
                                type="button"
                                onClick={() => navigate("/cart")}
                                className="w-full rounded-xl py-3 font-semibold border border-[#B9895B]/18 text-[#1E1E1E]/75 hover:bg-white/40"
                            >
                                חזרה לעגלה
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
