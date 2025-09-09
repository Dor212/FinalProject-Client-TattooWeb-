import React, { useState } from "react";
import { useCart } from "../../components/context/CartContext.tsx";

type Customer = {
    fullname: string;
    phone: string;
    city: string;
    street: string;
    houseNumber: string;
    notes?: string;
};

const API = import.meta.env.VITE_API_URL; // למשל: https://api.omeravivart.com

export default function CheckoutPage() {
    const { state, totals } = useCart();
    const [form, setForm] = useState<Customer>({
        fullname: "",
        phone: "",
        city: "",
        street: "",
        houseNumber: "",
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

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        if (!canSubmit) return;
        setLoading(true);

        try {
            // 1) יצירת הזמנה pending
            const createRes = await fetch(`${API}/api/canvas-orders/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: state.items,
                    totals,
                    customer: form,
                }),
            });
            if (!createRes.ok) {
                const t = await createRes.text();
                throw new Error(t || "Create order failed");
            }
            const { orderId } = await createRes.json();
            if (!orderId) throw new Error("Missing orderId");

            // 2) בקשת קישור תשלום
            const checkoutRes = await fetch(`${API}/api/canvas-payments/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });
            if (!checkoutRes.ok) {
                const t = await checkoutRes.text();
                throw new Error(t || "Checkout session failed");
            }
            const { checkoutUrl } = await checkoutRes.json();
            if (!checkoutUrl) throw new Error("Missing checkoutUrl");

            // 3) מעבר לעמוד התשלום
            window.location.href = checkoutUrl;
        } catch (e: unknown) {
            console.error(e);
            const message = typeof e === "object" && e !== null && "message" in e
                ? (e as { message?: string }).message
                : undefined;
            setErr(message || "שגיאה בתהליך התשלום");
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
            <h1 className="text-2xl font-bold text-[#3B3024]">פרטי משלוח ותשלום</h1>

            {/* סיכום פריטים */}
            <div className="p-3 mt-4 bg-white border rounded">
                {state.items.map((i) => (
                    <div key={i.id} className="flex justify-between py-1 text-sm">
                        <span>{i.name} — {i.size} × {i.qty}</span>
                    </div>
                ))}
                <div className="flex justify-between mt-2 font-semibold">
                    <span>סכום לתשלום</span>
                    <span>₪{totals.total.toLocaleString()}</span>
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
                <textarea className="p-2 border rounded" placeholder="הערות למשלוח (אופציונלי)"
                    value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

                {err && <div className="text-sm text-red-600">{err}</div>}

                <button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="mt-2 rounded-lg bg-[#8C734A] text-white py-2 disabled:opacity-50"
                >
                    {loading ? "מעביר לעמוד תשלום…" : "לתשלום"}
                </button>
            </form>

            {/* טיפ: אם תרצה לנקות עגלה אחרי הצלחה (ב־/thank-you), תעשה clear() שם */}
        </div>
    );
}
