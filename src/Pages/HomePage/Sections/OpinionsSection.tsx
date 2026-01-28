import { useEffect, useMemo, useState } from "react";
import {
    createOpinion,
    deleteOpinion,
    getOpinions,
    getOpinionErrorMessage,
    type Opinion,
} from "../../../Services/opinionApi.ts";

const MAX_TEXT = 220;

const readAuthToken = (): string => {
    const keys = ["token", "authToken", "accessToken", "jwt"];
    for (const k of keys) {
        const v = localStorage.getItem(k);
        if (v && v.trim()) return v.trim();
    }
    return "";
};

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
    try {
        const part = token.split(".")[1];
        if (!part) return null;

        const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

        const json = decodeURIComponent(
            atob(padded)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        const parsed = JSON.parse(json) as unknown;
        if (!parsed || typeof parsed !== "object") return null;
        return parsed as Record<string, unknown>;
    } catch {
        return null;
    }
};

const isAdminFromToken = (token: string): boolean => {
    if (!token) return false;
    const p = parseJwtPayload(token);
    if (!p) return false;

    const isAdmin = p.isAdmin === true;
    if (isAdmin) return true;

    const role = typeof p.role === "string" ? p.role : "";
    if (role === "admin") return true;

    const roles = Array.isArray(p.roles) ? p.roles : [];
    if (roles.some((x) => x === "admin")) return true;

    const permissions = Array.isArray(p.permissions) ? p.permissions : [];
    if (permissions.some((x) => x === "admin")) return true;

    return false;
};

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className={filled ? "fill-[#B9895B]" : "fill-[#1E1E1E]/14"}
        aria-hidden="true"
    >
        <path d="M12 17.3 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const StarsPicker = ({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) => (
    <div className="flex items-center justify-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((i) => (
            <button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                className="grid place-items-center rounded-lg p-1 transition hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/30"
                aria-label={`דירוג ${i}`}
                title={`דירוג ${i}`}
            >
                <StarIcon filled={i <= value} />
            </button>
        ))}
    </div>
);

const StarsDisplay = ({ value }: { value: number }) => (
    <div className="flex items-center justify-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="inline-flex" aria-hidden="true">
                <StarIcon filled={i <= value} />
            </span>
        ))}
    </div>
);

const ReviewCard = ({
    op,
    canDelete,
    deleting,
    onDelete,
}: {
    op: Opinion;
    canDelete: boolean;
    deleting: boolean;
    onDelete: (id: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const text = (op.text || "").trim();
    const hasText = text.length > 0;
    const shouldClamp = hasText && text.length > 92;
    const shown = !hasText ? "" : open || !shouldClamp ? text : `${text.slice(0, 92)}…`;

    return (
        <article className="relative">
            <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[28px] opacity-70 blur-2xl bg-[radial-gradient(circle_at_30%_25%,rgba(185,137,91,0.25),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(232,217,194,0.40),transparent_60%)]" />

            {canDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(op._id)}
                    disabled={deleting}
                    className={`absolute top-2 right-2 z-10 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${deleting
                            ? "bg-[#1E1E1E]/10 text-[#1E1E1E]/55 cursor-not-allowed"
                            : "bg-white/55 backdrop-blur border border-[#B9895B]/25 text-[#3B3024] hover:bg-white/70"
                        }`}
                    aria-label="מחק חוות דעת"
                    title="מחק חוות דעת"
                >
                    {deleting ? "מוחק..." : "מחק"}
                </button>
            )}

            <div className="relative flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full p-[1px] bg-[#1E1E1E]/12 shadow-[0_10px_30px_rgba(30,30,30,0.12)]">
                    <div className="h-full w-full rounded-full bg-[#F6F1E8] p-[2px]">
                        <img
                            src={op.imageUrl}
                            alt={`קעקוע של ${op.firstName}`}
                            className="object-cover w-full h-full rounded-full"
                            loading="lazy"
                            draggable={false}
                        />
                    </div>
                </div>

                <div className="mt-2">
                    <StarsDisplay value={op.rating} />
                </div>

                <div className="mt-1 text-sm font-extrabold tracking-wide text-[#1E1E1E]">
                    {op.firstName}
                </div>

                {hasText && (
                    <div className="mt-1 max-w-[22ch] text-sm leading-relaxed text-[#1E1E1E]/80">
                        {shown}
                        {shouldClamp && (
                            <button
                                type="button"
                                onClick={() => setOpen((p) => !p)}
                                className="ms-2 text-[#B9895B] underline underline-offset-4 opacity-90 hover:opacity-100 transition"
                            >
                                {open ? "סגור" : "פתח עוד"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

const OpinionsSection = () => {
    const [opinions, setOpinions] = useState<Opinion[]>([]);
    const [loading, setLoading] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [consent, setConsent] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);

    const [isAdmin, setIsAdmin] = useState(false);

    const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : ""), [image]);

    useEffect(() => {
        if (!previewUrl) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    useEffect(() => {
        const t = readAuthToken();
        setIsAdmin(isAdminFromToken(t));

        const onStorage = () => {
            const nt = readAuthToken();
            setIsAdmin(isAdminFromToken(nt));
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const data = await getOpinions(24);
                if (mounted) setOpinions(data);
            } catch (error: unknown) {
                if (mounted) setErr(getOpinionErrorMessage(error));
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const canSubmit = useMemo(() => {
        const n = firstName.trim();
        return n.length >= 2 && n.length <= 30 && !!image && rating >= 1 && rating <= 5 && consent;
    }, [firstName, image, rating, consent]);

    const onPickImage = (f?: File) => {
        if (!f) return;
        setImage(f);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setOk(null);

        if (!canSubmit || !image) return;

        try {
            setSubmitting(true);
            const created = await createOpinion({
                firstName: firstName.trim(),
                rating,
                text: text.trim().slice(0, MAX_TEXT),
                consent,
                image,
            });

            setOpinions((prev) => [created, ...prev].slice(0, 24));
            setFirstName("");
            setRating(5);
            setText("");
            setImage(null);
            setConsent(false);
            setOk("עלה! תודה על זה 🙏");
        } catch (error: unknown) {
            setErr(getOpinionErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    const onDelete = async (id: string) => {
        setErr(null);
        setOk(null);

        if (!isAdmin) return;

        const confirmed = window.confirm("למחוק את חוות הדעת הזו?");
        if (!confirmed) return;

        const token = readAuthToken();
        if (!token) {
            setErr("חסר טוקן אדמין");
            return;
        }

        try {
            setDeletingId(id);
            await deleteOpinion(id, token);
            setOpinions((prev) => prev.filter((x) => x._id !== id));
            setOk("נמחק ✅");
        } catch (error: unknown) {
            setErr(getOpinionErrorMessage(error));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section className="w-full" dir="rtl">
            <div className="px-4 mx-auto max-w-7xl py-14 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-[32px] sm:text-4xl font-extrabold tracking-tight text-[#1E1E1E] leading-[1.12]">
                        ספרו לנו איך היה
                    </h2>

                    <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-[#3B3024]/80">
                        מעלים תמונה של הקעקוע, נותנים דירוג, ואם בא לכם גם משפט קצר.
                        <br />
                        זה עוזר לאחרים להבין את הסטייל לפני שקובעים.
                    </p>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[420px,1fr] lg:items-start">
                    <form
                        onSubmit={submit}
                        className="relative overflow-hidden rounded-[28px] border border-[#B9895B]/20 bg-white/30 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.16)]"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(185,137,91,0.16),transparent_52%),radial-gradient(circle_at_80%_90%,rgba(232,217,194,0.34),transparent_56%)]" />

                        <div className="relative grid gap-4 px-6 py-6">
                            <div className="space-y-2">
                                <label className="block text-right text-sm font-semibold text-[#1E1E1E]/80">
                                    שם פרטי
                                </label>
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    maxLength={30}
                                    placeholder="לדוגמה: דנה"
                                    className="w-full rounded-2xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/30 focus:border-[#B9895B]/30"
                                />
                            </div>

                            <div className="rounded-2xl border border-[#B9895B]/15 bg-white/35 p-4">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="text-sm font-bold text-[#1E1E1E]">תמונה של הקעקוע</div>
                                    <div className="text-xs text-[#1E1E1E]/65">מומלץ תמונה קרובה וברורה</div>

                                    <div className="flex items-center gap-3 mt-1">
                                        <label className="inline-flex cursor-pointer items-center rounded-2xl bg-[#B9895B] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(185,137,91,0.22)] transition hover:brightness-95 active:brightness-90">
                                            העלה תמונה
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="hidden"
                                                onChange={(e) => onPickImage(e.target.files?.[0])}
                                            />
                                        </label>

                                        {image && (
                                            <div className="h-12 w-12 rounded-full p-[1px] bg-[#1E1E1E]/12">
                                                <div className="h-full w-full rounded-full bg-[#F6F1E8] p-[2px]">
                                                    <img
                                                        src={previewUrl}
                                                        alt="תצוגה מקדימה"
                                                        className="object-cover w-full h-full rounded-full"
                                                        draggable={false}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!image && (
                                        <div className="text-xs text-[#B9895B] opacity-90">
                                            כדי לשתף צריך להעלות תמונה
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#B9895B]/15 bg-white/35 p-4">
                                <div className="text-right text-sm font-bold text-[#1E1E1E]/85">דירוג</div>
                                <div className="mt-2">
                                    <StarsPicker value={rating} onChange={setRating} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-right text-sm font-semibold text-[#1E1E1E]/80">
                                    כמה מילים (אופציונלי)
                                </label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
                                    rows={3}
                                    maxLength={MAX_TEXT}
                                    placeholder="רק אם בא לך... 😉"
                                    className="w-full resize-none rounded-2xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/30 focus:border-[#B9895B]/30"
                                />
                                <div className="text-end text-xs text-[#1E1E1E]/55">
                                    {text.length}/{MAX_TEXT}
                                </div>
                            </div>

                            <label className="flex cursor-pointer items-start gap-2 text-sm text-[#1E1E1E]/80">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    className="mt-1"
                                />
                                <span>אני מאשר/ת לפרסם את התמונה והביקורת באתר</span>
                            </label>

                            {err && <div className="text-sm text-right text-red-600/85">{err}</div>}
                            {ok && <div className="text-right text-sm text-[#1E1E1E]/70">{ok}</div>}

                            <button
                                type="submit"
                                disabled={!canSubmit || submitting}
                                className={`w-full rounded-2xl py-3 font-semibold transition ${!canSubmit || submitting
                                        ? "bg-[#B9895B]/35 text-white/85 cursor-not-allowed"
                                        : "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90"
                                    }`}
                            >
                                {submitting ? "שולח..." : "שתף"}
                            </button>
                        </div>
                    </form>

                    <div className="relative">
                        {err && !loading && (
                            <div className="mb-4 rounded-2xl bg-white/35 backdrop-blur border border-[#B9895B]/15 p-4 text-center text-red-600/85">
                                {err}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="h-[170px] rounded-[28px] bg-white/25 animate-pulse" />
                                ))}
                            </div>
                        ) : opinions.length === 0 ? (
                            <div className="rounded-[28px] bg-white/30 backdrop-blur border border-[#B9895B]/15 p-8 text-center text-[#1E1E1E]/70">
                                עדיין אין ביקורות. תהיה/י הראשון/ה 🙂
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                                {opinions.map((op) => (
                                    <ReviewCard
                                        key={op._id}
                                        op={op}
                                        canDelete={isAdmin}
                                        deleting={deletingId === op._id}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OpinionsSection;
