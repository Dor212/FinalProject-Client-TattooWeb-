import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Services/axiosInstance";
import { useCart } from "../../components/context/CartContext.tsx";

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

const API = import.meta.env.VITE_API_URL as string;

const formatILS = (n: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

function trim(v: string) {
    return v.trim();
}

function minLen(v: string, n: number) {
    return trim(v).length >= n;
}

export default function CheckoutPage() {
    const cart = useCart();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const productsPayload = useMemo(() => cart.getMerchPayload(), [cart]);
    const canvasesPayload = useMemo(() => cart.getCanvasPayload(), [cart]);

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

        setLoading(true);

        const succeeded: Array<"canvas" | "product"> = [];

        try {
            if (canvasesPayload.length > 0) {
                await axios.post(`${API}/api/orders`, {
                    source: "checkout",
                    section: "/checkout",
                    customerDetails: {
                        fullname: form.fullname,
                        phone: form.phone,
                        email: form.email || null,
                        city: form.city,
                        street: form.street,
                        houseNumber: form.houseNumber,
                        zip: form.zip,
                        notes: form.notes || "",
                    },
                    cart: canvasesPayload,
                });
                succeeded.push("canvas");
            }

            if (productsPayload.length > 0) {
                await axios.post(`${API}/users/orders`, {
                    customerDetails: {
                        fullname: form.fullname,
                        phone: form.phone,
                        email: form.email || null,
                        city: form.city,
                        street: form.street,
                        houseNumber: form.houseNumber,
                        zip: form.zip,
                    },
                    cart: productsPayload,
                });
                succeeded.push("product");
            }

            cart.clear();
            setLoading(false);
            navigate("/", { replace: true });
        } catch (e: unknown) {
            if (succeeded.includes("canvas")) cart.clear("canvas");
            if (succeeded.includes("product")) cart.clear("product");

            const msg =
                typeof e === "object" && e !== null && "message" in e ? String((e as { message?: unknown }).message) : null;

            const tail =
                succeeded.length > 0 ? "חלק מהפריטים נשלחו בהצלחה והוסרו מהעגלה כדי למנוע כפילויות." : "";

            setErr([msg || "שגיאה בשליחת ההזמנה", tail].filter(Boolean).join(" "));
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div dir="rtl" className="max-w-2xl p-4 mx-auto pt-24">
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
                                <p className="mt-1 text-xs md:text-sm text-[#1E1E1E]/65">בדיקה מהירה לפני שליחה</p>
                            </div>

                            <div className="text-left">
                                <div className="text-xs text-[#1E1E1E]/60">סה״כ משוער</div>
                                <div className="text-lg md:text-xl font-extrabold text-[#B9895B]">
                                    {formatILS(cart.totals.total)}
                                </div>
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
                                            <span className="font-semibold text-[#1E1E1E]/80">
                                                {String(i.size).toUpperCase()}
                                            </span>{" "}
                                            · כמות:{" "}
                                            <span className="font-semibold text-[#1E1E1E]/80">{i.qty}</span>
                                        </div>
                                    </div>

                                    {i.kind === "product" ? (
                                        <div className="text-xs font-semibold text-[#B9895B] whitespace-nowrap">
                                            {formatILS(i.price * i.qty)}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-[#1E1E1E]/55 whitespace-nowrap">
                                            {i.category === "pair"
                                                ? "PAIR"
                                                : i.category === "triple"
                                                    ? "TRIPLE"
                                                    : "STANDARD"}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 text-xs text-[#1E1E1E]/60">
                            קאנבסים מחושבים סופית בצד השרת לפי כמות. מוצרים לפי המחיר שמופיע בעגלה.
                        </div>
                    </div>

                    <div className="relative p-5 md:p-7">
                        {err && (
                            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {err}
                            </div>
                        )}

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
                                    <label className="block text-sm font-semibold text-[#1E1E1E]/80">
                                        מיקוד{needsZip ? "" : " (אופציונלי)"}
                                    </label>
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
                                {loading ? "שולח..." : "שלח הזמנה"}
                            </button>

                            {needsZip && (
                                <div className="text-center text-[11px] text-[#1E1E1E]/55">
                                    בעגלה יש מוצרים, לכן מיקוד נדרש למשלוח.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
