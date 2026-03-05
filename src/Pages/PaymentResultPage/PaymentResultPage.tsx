import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../Services/axiosInstance";
import { useCart } from "../../components/context/CartContext";

type Props = {
    kind: "success" | "failure" | "cancel";
};

export default function PaymentResultPage({ kind }: Props) {
    const location = useLocation();
    const navigate = useNavigate();
    const cart = useCart();

    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        async function confirm() {
            if (kind !== "success") {
                setVerified(false);
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`/api/orders/confirm-payment${location.search}`);

                if (!alive) return;

                const ok = Boolean(res?.data?.verified);
                setVerified(ok);
                setOrderId(res?.data?.orderId || null);

                if (ok) {
                    cart.clear();
                } else {
                    setError("התשלום לא אומת מול חברת הסליקה");
                }
            } catch (e: unknown) {
                if (!alive) return;
                setVerified(false);
                setError("שגיאה באימות התשלום");
            } finally {
                if (alive) setLoading(false);
            }
        }

        confirm();
        return () => {
            alive = false;
        };
    }, [kind, location.search, cart]);

    const title =
        kind === "success"
            ? verified
                ? "התשלום בוצע בהצלחה 🎉"
                : "אימות התשלום נכשל"
            : kind === "failure"
                ? "התשלום נכשל"
                : "התשלום בוטל";

    const subtitle =
        kind === "success"
            ? verified
                ? "ההזמנה נקלטה ונשלחה לעומר"
                : error || "הייתה בעיה באימות התשלום"
            : kind === "failure"
                ? "הכרטיס סורב או שהעסקה נכשלה"
                : "לא בוצע חיוב בכרטיס";

    return (
        <div dir="rtl" className="min-h-[60svh] flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-3xl border border-[#B9895B]/20 bg-white/60 backdrop-blur-xl p-6 text-center shadow-xl">
                <h1 className="text-2xl font-extrabold text-[#3B3024]">{title}</h1>

                <p className="mt-3 text-sm text-[#3B3024]/75">{subtitle}</p>

                {loading && <div className="mt-4 text-sm">בודק תשלום…</div>}

                {!loading && orderId && (
                    <div className="mt-4 text-xs text-[#3B3024]/60">מספר הזמנה: {orderId}</div>
                )}

                <div className="flex flex-col gap-3 mt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full rounded-xl py-3 font-semibold bg-[#B9895B] text-white hover:brightness-95"
                    >
                        חזרה לדף הבית
                    </button>

                    {!verified && kind === "success" && (
                        <button
                            onClick={() => navigate("/checkout")}
                            className="w-full rounded-xl py-3 font-semibold border border-[#B9895B]/30 text-[#3B3024]"
                        >
                            נסה שוב לתשלום
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
