import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { verifyHypPayment } from "../../api/hypayApi";

type Status = "loading" | "verified" | "not_verified" | "error";

export default function PaymentResultPage({ kind }: { kind: "success" | "failure" | "cancel" }) {
    const location = useLocation();
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState<string>("");

    const title = useMemo(() => {
        if (kind === "cancel") return "התשלום בוטל";
        if (kind === "failure") return "התשלום נכשל";
        return "בודקים את התשלום...";
    }, [kind]);

    useEffect(() => {
        let alive = true;

        async function run() {
            try {
                if (kind === "cancel") {
                    if (!alive) return;
                    setStatus("not_verified");
                    setMessage("העסקה בוטלה על ידי המשתמש.");
                    return;
                }

                const result = await verifyHypPayment(location.search);
                if (!alive) return;

                if (!result.ok) {
                    setStatus("error");
                    setMessage(result.message);
                    return;
                }

                if (result.verified) {
                    setStatus("verified");
                    setMessage("התשלום אומת בהצלחה ✅");
                } else {
                    setStatus("not_verified");
                    setMessage(`התשלום לא אומת. CCode=${result.ccode}`);
                }
            } catch (e) {
                if (!alive) return;
                setStatus("error");
                setMessage(e instanceof Error ? e.message : "Unknown error");
            }
        }

        run();
        return () => {
            alive = false;
        };
    }, [kind, location.search]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl bg-[#F1F3C2] text-[#3B3024] shadow p-6">
                <h1 className="mb-2 text-xl font-semibold">{title}</h1>

                {status === "loading" && <p className="opacity-80">רגע… מאמתים מול הסליקה.</p>}

                {status !== "loading" && (
                    <p className={`${status === "verified" ? "font-semibold" : ""}`}>{message}</p>
                )}

                <div className="flex gap-2 mt-5">
                    <a
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-[#3B3024] text-[#F1F3C2]"
                    >
                        חזרה לדף הבית
                    </a>
                </div>
            </div>
        </div>
    );
}
