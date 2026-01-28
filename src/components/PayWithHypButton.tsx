import { useState } from "react";
import { createHypPayment } from "../api/hypayApi";

export default function PayWithHypButton({
    amount,
    orderId,
    customer,
}: {
    amount: number;
    orderId: string;
    customer?: {
        userId?: string;
        clientName?: string;
        clientLName?: string;
        email?: string;
        phone?: string;
        cell?: string;
        street?: string;
        city?: string;
        zip?: string;
    };
}) {
    const [loading, setLoading] = useState(false);

    async function onPay() {
        setLoading(true);
        try {
            const res = await createHypPayment({
                amount,
                orderId,
                info: `Omer Aviv order ${orderId}`,
                pageLang: "HEB",
                coin: 1,
                tmp: 1,
                ...customer,
            });

            if (!res.ok) {
                alert(res.message);
                return;
            }

            window.location.href = res.paymentUrl;
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={onPay}
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 bg-[#3B3024] text-[#F1F3C2] disabled:opacity-60"
        >
            {loading ? "מעביר לתשלום…" : "לתשלום מאובטח"}
        </button>
    );
}
