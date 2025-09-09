// src/Pages/CheckoutPage.tsx
import { useState } from "react";
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

const API = import.meta.env.VITE_API_URL;

export default function CheckoutPage() {
    const cart = useCart();
    const { state, totals, clear } = cart!;
    const navigate = useNavigate();

    const [form, setForm] = useState<Customer>({
        fullname: "",
        phone: "",
        city: "",
        street: "",
        houseNumber: "",
        email: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const canSubmit =
        state.items.length > 0 &&
        form.fullname.trim().length >= 2 &&
        form.phone.trim().length >= 6 &&
        form.city.trim().length >= 2 &&
        form.street.trim().length >= 2 &&
        form.houseNumber.trim().length >= 1;

    const cartPayload = state.items.map(i => ({
        _id: i.id,
        title: i.name,
        size: i.size,
        quantity: i.qty,
        imageUrl: i.image,
        category: i.category,
        price: i.category === "pair" ? 390
            : i.category === "triple" ? 550
                : undefined,
    }));

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        if (!canSubmit) return;
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

            // נקרא את totals מהשרת (אם חישב והחזיר)
            let finalTotal: number | undefined;
            try {
                const data = await res.json();
                finalTotal = data?.totals?.total;
            } catch {
                /* ignore json parse errors */
            }

            clear(); // מנקה עגלה
            setLoading(false);

            alert(
                `תודה! ההזמנה נקלטה ונשלחה למייל של עומר${typeof finalTotal === "number"
                    ? ` (סכום: ₪${Math.round(finalTotal).toLocaleString("he-IL")})`
                    : ""
                }.`
            );

            // חזרה לעמוד הקאנבסים
            navigate("/canvases", { replace: true });
        } catch (e: unknown) {
            console.error(e);
            const errorMessage = typeof e === "object" && e !== null && "message" in e
                ? (e as { message?: string }).message
                : undefined;
            setErr(errorMessage || "שגיאה בשליחת ההזמנה");
            setLoading(false);
        }

    }

    if (state.items.length === 0) {
        return (
            <div dir="rtl" className="max-w-2xl p-4 mx-auto">
                <h1 className="text-2xl font-bold text-[#3B3024]">תשלום</h1>
                <p className="mt-4 text-[#3B3024]/80">העגלה ריקה.</p>
            </div>
        );
    }

    return (
        <div dir="rtl" className="max-w-2xl p-4 mx-auto">
            <h1 className="text-2xl font-bold text-[#3B3024]">פרטי משלוח והזמנה</h1>

            {/* סיכום פריטים */}
            <div className="p-3 mt-4 bg-white border rounded">
                {state.items.map((i) => (
                    <div key={i.id} className="flex justify-between py-1 text-sm">
                        <span>{i.name} — {i.size} × {i.qty}</span>
                    </div>
                ))}
                <div className="flex justify-between mt-2 font-semibold">
                    <span>סכום משוער (לפי חישוב עגלה)</span>
                    <span>₪{totals.total.toLocaleString("he-IL")}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    הסכום הסופי מחושב בשרת ונשלח במייל.
                </div>
            </div>

            {/* טופס */}
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 mt-4">
                <input className="p-2 border rounded" placeholder="שם מלא"
                    value={form.fullname} onChange={e => setForm({ ...form, fullname: e.target.value })} required />
                <input className="p-2 border rounded" placeholder="טלפון"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                <div className="grid grid-cols-2 gap-3">
                    <input className="p-2 border rounded" placeholder="עיר"
                        value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                    <input className="p-2 border rounded" placeholder="רחוב"
                        value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required />
                </div>
                <input className="p-2 border rounded" placeholder="מס' בית"
                    value={form.houseNumber} onChange={e => setForm({ ...form, houseNumber: e.target.value })} required />
                <input className="p-2 border rounded" placeholder="אימייל (אופציונלי)"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <textarea className="p-2 border rounded" placeholder="הערות למשלוח (אופציונלי)"
                    value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

                {err && <div className="text-sm text-red-600">{err}</div>}

                <button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="mt-2 rounded-lg bg-[#8C734A] text-white py-2 disabled:opacity-50"
                >
                    {loading ? "שולח הזמנה…" : "שלח הזמנה"}
                </button>
            </form>
        </div>
    );
}
