import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import axios from "../../Services/axiosInstance";
import { Download, Mail, RotateCcw, ChevronDown, ChevronUp, ImagePlus, Sparkles } from "lucide-react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

type LocationState = {
    selectedSketch?: string;
    category?: "small" | "medium" | "large" | string;
};

type Frame = {
    translate: [number, number];
    rotate: number;
    scale: [number, number];
};

type Env = {
    VITE_API_URL: string;
};

type Cat = "small" | "medium" | "large";

const normalizeCat = (c?: string): Cat => {
    const v = (c || "").toLowerCase();
    if (v === "medium") return "medium";
    if (v === "large") return "large";
    return "small";
};

const joinUrl = (base: string, maybeUrl: string) => {
    if (!maybeUrl) return "";
    if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
    const b = base.endsWith("/") ? base.slice(0, -1) : base;
    const p = maybeUrl.startsWith("/") ? maybeUrl : `/${maybeUrl}`;
    return `${b}${p}`;
};

const CAT_UI: { key: Cat; label: string; title: string; hint: string }[] = [
    { key: "small", label: "S", title: "Small", hint: "קטן ועדין" },
    { key: "medium", label: "M", title: "Medium", hint: "בינוני מאוזן" },
    { key: "large", label: "L", title: "Large", hint: "גדול ונוכח" },
];

const CAT_RULES: Record<
    Cat,
    {
        initialTargetRatio: number;
        scaleMin: number;
        scaleMax: number;
    }
> = {
    small: { initialTargetRatio: 0.18, scaleMin: 0.78, scaleMax: 1.12 },
    medium: { initialTargetRatio: 0.24, scaleMin: 0.82, scaleMax: 1.18 },
    large: { initialTargetRatio: 0.3, scaleMin: 0.86, scaleMax: 1.22 },
};

const OVERLAY_BASE = 150;

const ApplySketchPage = () => {
    const { state } = useLocation() as { state: LocationState | null };
    const { selectedSketch, category } = state ?? {};

    const { VITE_API_URL } = import.meta.env as unknown as Env;

    const [userImage, setUserImage] = useState<string | null>(null);

    const initialCat = useMemo(() => normalizeCat(category), [category]);
    const [activeCat, setActiveCat] = useState<Cat>(initialCat);

    const [availableSketches, setAvailableSketches] = useState<string[]>([]);
    const [currentSketch, setCurrentSketch] = useState<string | null>(
        selectedSketch ? joinUrl(VITE_API_URL, selectedSketch) : null,
    );

    const [frame, setFrame] = useState<Frame>({
        translate: [200, 200],
        rotate: 0,
        scale: [1, 1],
    });

    const frameRef = useRef<Frame>(frame);
    useEffect(() => {
        frameRef.current = frame;
    }, [frame]);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [sketchPickerOpenMobile, setSketchPickerOpenMobile] = useState(false);

    const workAreaRef = useRef<HTMLDivElement>(null);

    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches;

    const rules = CAT_RULES[activeCat];

    const [{ x, y, scale, rotateZ }, api] = useSpring(() => ({
        x: 200,
        y: 200,
        scale: 1,
        rotateZ: 0,
    }));

    const centerAndInitScale = (cat: Cat) => {
        if (!workAreaRef.current) return;

        const rect = workAreaRef.current.getBoundingClientRect();
        const base = Math.min(rect.width, rect.height);
        const targetPx = base * CAT_RULES[cat].initialTargetRatio;
        const initialScale = Math.max(
            CAT_RULES[cat].scaleMin,
            Math.min(CAT_RULES[cat].scaleMax, targetPx / OVERLAY_BASE),
        );

        const cx = Math.max(14, rect.width / 2 - OVERLAY_BASE / 2);
        const cy = Math.max(14, rect.height / 2 - OVERLAY_BASE / 2);

        if (isMobile) {
            api.start({ x: cx, y: cy, scale: initialScale, rotateZ: 0 });
        } else {
            setFrame({ translate: [cx, cy], rotate: 0, scale: [initialScale, initialScale] });
        }
    };

    const bindMobile = useGesture(
        {
            onDrag: ({ offset: [dx, dy] }) => api.start({ x: dx, y: dy }),
            onPinch: ({ offset: [s, a] }) => {
                const clamped = Math.max(rules.scaleMin, Math.min(rules.scaleMax, s));
                api.start({ scale: clamped, rotateZ: a });
            },
        },
        {
            drag: { from: () => [x.get(), y.get()] },
            pinch: {
                from: () => [scale.get(), rotateZ.get()],
                scaleBounds: { min: rules.scaleMin, max: rules.scaleMax },
                rubberband: true,
                preventDefault: true,
            },
            eventOptions: { passive: false },
        },
    );

    const bindDesktop = useGesture(
        {
            onDrag: ({ offset: [dx, dy] }) => {
                setFrame((prev) => ({ ...prev, translate: [dx, dy] }));
            },
            onWheel: ({ event, delta: [, dy] }) => {
                event.preventDefault();
                setFrame((prev) => {
                    const factor = Math.exp(-dy / 320);
                    const next = prev.scale[0] * factor;
                    const clamped = Math.max(rules.scaleMin, Math.min(rules.scaleMax, next));
                    return { ...prev, scale: [clamped, clamped] };
                });
            },
            onPinch: ({ offset: [s, a] }) => {
                setFrame((prev) => {
                    const clamped = Math.max(rules.scaleMin, Math.min(rules.scaleMax, s));
                    return { ...prev, scale: [clamped, clamped], rotate: a };
                });
            },
        },
        {
            drag: { from: () => frameRef.current.translate },
            eventOptions: { passive: false },
        },
    );

    useEffect(() => {
        const fetchSketches = async () => {
            try {
                const response = await axios.get<string[]>(`${VITE_API_URL}/gallery/${activeCat}`);
                setAvailableSketches(Array.isArray(response.data) ? response.data : []);
            } catch {
                setAvailableSketches([]);
            }
        };

        fetchSketches();
    }, [activeCat, VITE_API_URL]);

    useEffect(() => {
        if (!selectedSketch) return;
        setCurrentSketch(joinUrl(VITE_API_URL, selectedSketch));
    }, [selectedSketch, VITE_API_URL]);

    useEffect(() => {
        if (!currentSketch && availableSketches.length > 0) {
            setCurrentSketch(joinUrl(VITE_API_URL, availableSketches[0]));
        }
    }, [availableSketches, currentSketch, VITE_API_URL]);

    useEffect(() => {
        const t = setTimeout(() => centerAndInitScale(activeCat), 0);
        return () => clearTimeout(t);
    }, [activeCat]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setUserImage(reader.result as string);
        reader.readAsDataURL(file);
        if (isMobile) setSketchPickerOpenMobile(true);
    };

    const handleSend = async () => {
        if (!workAreaRef.current) return;
        await new Promise((r) => setTimeout(r, 250));
        const canvas = await html2canvas(workAreaRef.current, {
            useCORS: true,
            backgroundColor: null,
        });
        const image = canvas.toDataURL("image/png");
        try {
            await axios.post(`${VITE_API_URL}/users/send-image`, {
                image,
                name,
                phone,
            });
            alert("נשלח בהצלחה!");
        } catch {
            alert("שליחה נכשלה.");
        }
    };

    const handleDownload = async () => {
        if (!workAreaRef.current) return;
        const canvas = await html2canvas(workAreaRef.current, {
            useCORS: true,
            backgroundColor: null,
        });
        const link = document.createElement("a");
        link.download = "tattoo_preview.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const onSelectSketch = (imgPathOrUrl: string) => {
        const full = joinUrl(VITE_API_URL, imgPathOrUrl);
        setCurrentSketch(full);
        setTimeout(() => centerAndInitScale(activeCat), 0);
    };

    const rotateSketch = () => {
        if (isMobile) {
            api.start({ rotateZ: (rotateZ.get() + 90) % 360 });
        } else {
            setFrame((prev) => ({ ...prev, rotate: (prev.rotate + 90) % 360 }));
        }
    };

    const handleReset = () => {
        centerAndInitScale(activeCat);
    };

    const ready = Boolean(userImage && currentSketch);

    return (
        <div dir="rtl" className="min-h-[100svh] text-[#1E1E1E]">
            <div className="sticky top-0 z-40 border-b border-[#B9895B]/14 bg-[#F6F1E8]/90 backdrop-blur">
                <div className="px-4 py-4 mx-auto max-w-7xl">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#B9895B]/14 text-[#B9895B]">
                                        <Sparkles size={20} />
                                    </div>
                                    <div className="text-xl sm:text-2xl font-extrabold tracking-wide text-[#3B3024]">
                                        הדמיה מהירה
                                    </div>
                                </div>
                                <div className="mt-1 text-xs sm:text-sm text-[#1E1E1E]/65">
                                    העלה תמונה, בחר סקיצה, כוון בעדינות, ושמור או שלח.
                                </div>
                            </div>

                            <label className="inline-flex lg:hidden items-center gap-2 rounded-2xl bg-[#B9895B] px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90 cursor-pointer">
                                <ImagePlus size={18} />
                                העלאת תמונה
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
                            <div className="inline-flex items-center justify-center rounded-2xl border border-[#B9895B]/14 bg-white/45 p-1">
                                {CAT_UI.map((c) => {
                                    const active = c.key === activeCat;
                                    return (
                                        <button
                                            key={c.key}
                                            type="button"
                                            onClick={() => setActiveCat(c.key)}
                                            className={[
                                                "group relative px-4 py-2 rounded-2xl text-sm font-extrabold transition",
                                                active
                                                    ? "bg-[#B9895B] text-white shadow-sm"
                                                    : "text-[#1E1E1E]/70 hover:bg-white/60",
                                            ].join(" ")}
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span className="text-base">{c.label}</span>
                                                <span className={active ? "text-white/85" : "text-[#1E1E1E]/55"}>
                                                    {c.hint}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="items-center hidden gap-2 lg:flex">
                                <label className="inline-flex items-center gap-2 rounded-2xl bg-[#B9895B] px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90 cursor-pointer">
                                    <ImagePlus size={18} />
                                    העלאת תמונה
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setDetailsOpen((v) => !v)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/45 px-5 py-3 text-sm font-extrabold text-[#3B3024] hover:bg-white/60"
                                >
                                    פרטי שליחה
                                    {detailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {detailsOpen && (
                        <div className="mt-4 grid gap-3 rounded-[26px] border border-[#B9895B]/14 bg-white/45 p-4 sm:p-5">
                            <div className="text-sm font-extrabold text-[#3B3024] text-end">פרטים לשליחה (אופציונלי)</div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="שם מלא"
                                    className="w-full rounded-2xl border border-[#B9895B]/18 bg-[#F6F1E8]/50 px-4 py-3 text-sm font-semibold text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="טלפון"
                                    className="w-full rounded-2xl border border-[#B9895B]/18 bg-[#F6F1E8]/50 px-4 py-3 text-sm font-semibold text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                                />
                            </div>
                            <div className="text-xs text-[#1E1E1E]/60 text-end">
                                אם תשאיר פרטים, ההדמיה תישלח עם השם והטלפון כדי שנוכל לחזור אליך מהר.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-4 py-6 mx-auto max-w-7xl">
                <div className="grid gap-5 lg:grid-cols-[320px,1fr]">
                    <div className="hidden lg:block">
                        <div className="rounded-[26px] border border-[#B9895B]/14 bg-white/45 backdrop-blur p-4">
                            <div className="flex items-end justify-between gap-3">
                                <div className="text-base font-extrabold text-[#3B3024] text-end">בחר סקיצה</div>
                                <div className="text-xs font-semibold text-[#1E1E1E]/55 text-end">
                                    {availableSketches.length} זמינות
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-4 gap-3 max-h-[520px] overflow-auto pr-1">
                                {availableSketches.map((imgPath, idx) => {
                                    const fullUrl = joinUrl(VITE_API_URL, imgPath);
                                    const active = currentSketch === fullUrl;
                                    return (
                                        <button
                                            key={`${imgPath}-${idx}`}
                                            type="button"
                                            onClick={() => onSelectSketch(imgPath)}
                                            className={[
                                                "relative aspect-square overflow-hidden rounded-2xl border bg-white/50 transition",
                                                active
                                                    ? "border-[#B9895B] ring-2 ring-[#B9895B]/25 shadow-[0_16px_40px_rgba(30,30,30,0.14)]"
                                                    : "border-[#B9895B]/14 hover:border-[#B9895B]/45 hover:bg-white/70",
                                            ].join(" ")}
                                            title="בחר סקיצה"
                                        >
                                            <img
                                                src={fullUrl}
                                                alt="sketch"
                                                className="object-contain w-full h-full p-2"
                                                loading="lazy"
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            {!userImage && (
                                <div className="mt-4 rounded-2xl border border-[#B9895B]/14 bg-[#F6F1E8]/45 p-4 text-sm text-[#1E1E1E]/75 text-end">
                                    טיפ קטן: קודם העלה תמונה, ואז כיף לשחק בין סקיצות בלי לאבד את התמונה.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#B9895B]/14 bg-white/45 backdrop-blur shadow-[0_18px_70px_rgba(30,30,30,0.12)] overflow-hidden">
                        <div className="border-b border-[#B9895B]/14 bg-white/35 px-4 sm:px-6 py-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-end">
                                    <div className="text-lg sm:text-xl font-extrabold text-[#3B3024]">
                                        אזור עבודה
                                    </div>
                                    <div className="mt-1 text-xs sm:text-sm text-[#1E1E1E]/65">
                                        גרירה להזזה, צביטה/גלגלת לשינוי גודל (עדין ומוגבל לפי מידה).
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={rotateSketch}
                                        disabled={!currentSketch}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition",
                                            currentSketch
                                                ? "border border-[#B9895B]/18 bg-white/55 text-[#3B3024] hover:bg-white/70"
                                                : "border border-[#B9895B]/10 bg-white/30 text-[#1E1E1E]/40 cursor-not-allowed",
                                        ].join(" ")}
                                    >
                                        <RotateCcw size={18} />
                                        סיבוב
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        disabled={!currentSketch}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition",
                                            currentSketch
                                                ? "border border-[#B9895B]/18 bg-white/55 text-[#3B3024] hover:bg-white/70"
                                                : "border border-[#B9895B]/10 bg-white/30 text-[#1E1E1E]/40 cursor-not-allowed",
                                        ].join(" ")}
                                    >
                                        Reset
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSketchPickerOpenMobile(true)}
                                        className="inline-flex lg:hidden items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/55 px-4 py-2 text-sm font-extrabold text-[#3B3024] hover:bg-white/70"
                                    >
                                        בחר סקיצה
                                        <ChevronUp size={18} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setDetailsOpen((v) => !v)}
                                        className="inline-flex lg:hidden items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/55 px-4 py-2 text-sm font-extrabold text-[#3B3024] hover:bg-white/70"
                                    >
                                        פרטי שליחה
                                        {detailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div
                                ref={workAreaRef}
                                className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9] rounded-[26px] border border-[#B9895B]/14 bg-[#F6F1E8]/55 overflow-hidden"
                                style={{ touchAction: "none" }}
                            >
                                {!userImage && (
                                    <div className="absolute inset-0 grid p-6 place-items-center">
                                        <div className="w-full max-w-md rounded-[26px] border border-[#B9895B]/14 bg-white/55 backdrop-blur p-6 text-center shadow-sm">
                                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#B9895B]/14 text-[#B9895B]">
                                                <ImagePlus size={22} />
                                            </div>
                                            <div className="mt-3 text-lg font-extrabold text-[#3B3024]">
                                                נתחיל עם תמונה שלך
                                            </div>
                                            <div className="mt-2 text-sm text-[#1E1E1E]/70">
                                                עדיף תמונה חדה, בגובה העיניים, באור טוב, בלי מתיחות.
                                            </div>
                                            <label className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#B9895B] px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90 cursor-pointer">
                                                <ImagePlus size={18} />
                                                העלאת תמונה
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="environment"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {userImage && (
                                    <img src={userImage} alt="Uploaded" className="absolute inset-0 object-contain w-full h-full" />
                                )}

                                {currentSketch && isMobile ? (
                                    <animated.div
                                        {...bindMobile()}
                                        style={{
                                            x,
                                            y,
                                            scale,
                                            rotateZ,
                                            position: "absolute",
                                            width: OVERLAY_BASE,
                                            height: OVERLAY_BASE,
                                            backgroundImage: `url(${encodeURI(currentSketch)})`,
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            mixBlendMode: "multiply",
                                            opacity: 0.6,
                                            touchAction: "none",
                                            willChange: "transform",
                                            transformOrigin: "center center",
                                        }}
                                    />
                                ) : currentSketch ? (
                                    <div
                                        {...bindDesktop()}
                                        style={{
                                            position: "absolute",
                                            transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg) scale(${frame.scale[0]}, ${frame.scale[1]})`,
                                            transformOrigin: "center center",
                                            width: OVERLAY_BASE,
                                            height: OVERLAY_BASE,
                                            backgroundImage: `url(${encodeURI(currentSketch)})`,
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            mixBlendMode: "multiply",
                                            opacity: 0.6,
                                            cursor: "grab",
                                            userSelect: "none",
                                            willChange: "transform",
                                            touchAction: "none",
                                        }}
                                    />
                                ) : null}
                            </div>

                            <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-xs sm:text-sm text-[#1E1E1E]/65 text-end">
                                    {ready ? (
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-[#97BE5A]" />
                                            מוכן. אפשר לשמור או לשלוח.
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-[#B9895B]" />
                                            העלה תמונה ובחר סקיצה כדי להתחיל.
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        disabled={!ready}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold transition shadow-sm",
                                            ready
                                                ? "bg-white/70 text-[#3B3024] border border-[#B9895B]/18 hover:bg-white/80"
                                                : "bg-white/35 text-[#1E1E1E]/40 border border-[#B9895B]/10 cursor-not-allowed",
                                        ].join(" ")}
                                    >
                                        <Download size={18} />
                                        שמירה
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={!ready}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold transition shadow-sm",
                                            ready
                                                ? "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90"
                                                : "bg-[#B9895B]/35 text-white/70 cursor-not-allowed",
                                        ].join(" ")}
                                    >
                                        <Mail size={18} />
                                        שליחה
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {sketchPickerOpenMobile && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setSketchPickerOpenMobile(false)}
                            className="absolute inset-0 bg-black/35"
                            aria-label="סגור"
                        />
                        <div className="absolute left-0 right-0 bottom-0 rounded-t-[28px] border-t border-[#B9895B]/18 bg-[#F6F1E8] shadow-[0_-18px_70px_rgba(0,0,0,0.22)]">
                            <div className="px-4 py-4 mx-auto max-w-7xl">
                                <div className="flex items-center justify-between">
                                    <div className="text-base font-extrabold text-[#3B3024]">בחר סקיצה</div>
                                    <button
                                        type="button"
                                        onClick={() => setSketchPickerOpenMobile(false)}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/55 px-4 py-2 text-sm font-extrabold text-[#3B3024]"
                                    >
                                        סגור
                                        <ChevronDown size={18} />
                                    </button>
                                </div>

                                <div className="mt-3 grid grid-cols-5 gap-3 max-h-[46vh] overflow-auto pb-4">
                                    {availableSketches.map((imgPath, idx) => {
                                        const fullUrl = joinUrl(VITE_API_URL, imgPath);
                                        const active = currentSketch === fullUrl;
                                        return (
                                            <button
                                                key={`${imgPath}-${idx}`}
                                                type="button"
                                                onClick={() => {
                                                    onSelectSketch(imgPath);
                                                    setSketchPickerOpenMobile(false);
                                                }}
                                                className={[
                                                    "relative aspect-square overflow-hidden rounded-2xl border bg-white/55 transition",
                                                    active
                                                        ? "border-[#B9895B] ring-2 ring-[#B9895B]/25 shadow-[0_16px_40px_rgba(30,30,30,0.14)]"
                                                        : "border-[#B9895B]/14 hover:border-[#B9895B]/45",
                                                ].join(" ")}
                                                title="בחר סקיצה"
                                            >
                                                <img src={fullUrl} alt="sketch" className="object-contain w-full h-full p-2" loading="lazy" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplySketchPage;
