import { useLocation } from "react-router-dom";
import { useMemo, useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import axios from "../../Services/axiosInstance";
import { Download, Mail, RotateCcw, ChevronDown, ChevronUp, ImagePlus, Sparkles, X } from "lucide-react";
import { animated } from "@react-spring/web";

import type { Env, LocationState, Cat } from "./applySketch.types";
import { CAT_RULES, CAT_UI } from "./applySketch.constants";
import { joinUrl, normalizeCat } from "./applySketch.utils";
import { useIsMobile } from "./hooks/useIsMobile";
import { useSketchGallery } from "./hooks/useSketchGallery";
import { useOverlayController } from "./hooks/useOverlayController";

import DetailsPanel from "./components/DetailsPanel";
import SketchPickerDesktop from "./components/SketchPickerDesktop";
import SketchPickerMobile from "./components/SketchPickerMobile";

const ApplySketchPage = () => {
    const { state } = useLocation() as { state: LocationState | null };
    const { selectedSketch, category } = state ?? {};

    const { VITE_API_URL } = import.meta.env as unknown as Env;

    const [userImage, setUserImage] = useState<string | null>(null);

    const initialCat = useMemo(() => normalizeCat(category), [category]);
    const [activeCat, setActiveCat] = useState<Cat>(initialCat);

    const availableSketches = useSketchGallery(VITE_API_URL, activeCat);

    const [currentSketch, setCurrentSketch] = useState<string | null>(
        selectedSketch ? joinUrl(VITE_API_URL, selectedSketch) : null
    );

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [sketchPickerOpenMobile, setSketchPickerOpenMobile] = useState(false);

    const workAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile(1024);

    const rules = CAT_RULES[activeCat];

    const ready = Boolean(userImage && currentSketch);
    const canSend = Boolean(ready && name.trim() && phone.trim());

    const overlay = useOverlayController({
        ready,
        isMobile,
        activeCat,
        userImage,
        currentSketch,
        scaleMin: rules.scaleMin,
        scaleMax: rules.scaleMax,
        workAreaRef,
    });

    useEffect(() => {
        if (!selectedSketch) return;
        setCurrentSketch(joinUrl(VITE_API_URL, selectedSketch));
        overlay.resetInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSketch, VITE_API_URL]);

    useEffect(() => {
        if (!currentSketch && availableSketches.length > 0) {
            setCurrentSketch(joinUrl(VITE_API_URL, availableSketches[0]));
            overlay.resetInit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableSketches, currentSketch, VITE_API_URL]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUserImage(reader.result as string);
            overlay.resetInit();
        };
        reader.readAsDataURL(file);

        if (isMobile) setSketchPickerOpenMobile(true);
    };

    const onSelectSketch = (imgPathOrUrl: string) => {
        const full = joinUrl(VITE_API_URL, imgPathOrUrl);
        setCurrentSketch(full);
        overlay.resetInit();
        if (isMobile) setSketchPickerOpenMobile(false);
    };

    const captureWorkArea = async () => {
        if (!workAreaRef.current) return null;
        await new Promise((r) => setTimeout(r, 120));

        const sc = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

        const canvas = await html2canvas(workAreaRef.current, {
            useCORS: true,
            allowTaint: false,
            backgroundColor: null,
            scale: sc,
        });

        return canvas;
    };

    const handleSend = async () => {
        if (!canSend) return;

        try {
            const canvas = await captureWorkArea();
            if (!canvas) return;

            const image = canvas.toDataURL("image/png");

            await axios.post(`${VITE_API_URL}/users/send-image`, {
                image,
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim() || undefined,
            });

            alert("נשלח בהצלחה!");
        } catch {
            alert("שליחה נכשלה.");
        }
    };

    const handleDownload = async () => {
        if (!ready) return;

        try {
            const canvas = await captureWorkArea();
            if (!canvas) return;

            const link = document.createElement("a");
            link.download = "tattoo_preview.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch {
            alert("שמירה נכשלה.");
        }
    };

    return (
        <div dir="rtl" className="min-h-[100svh] text-[#1E1E1E]">
            <div className="sticky top-0 z-40 border-b border-[#B9895B]/14 bg-[#F6F1E8]/90 backdrop-blur">
                <div className="px-4 py-4 mx-auto max-w-7xl">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-center lg:text-start">
                                <div className="flex items-center justify-center gap-2 lg:justify-start">
                                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#B9895B]/14 text-[#B9895B]">
                                        <Sparkles size={20} />
                                    </div>
                                    <div className="text-xl sm:text-2xl font-extrabold tracking-wide text-[#3B3024]">
                                        הדמיה מהירה
                                    </div>
                                </div>
                                <div className="mt-1 text-xs sm:text-sm text-[#1E1E1E]/65 max-w-xl mx-auto lg:mx-0">
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
                            <div className="inline-flex items-center justify-center rounded-2xl border border-[#B9895B]/14 bg-white/45 p-1 mx-auto lg:mx-0">
                                {CAT_UI.map((c) => {
                                    const active = c.key === activeCat;
                                    return (
                                        <button
                                            key={c.key}
                                            type="button"
                                            onClick={() => setActiveCat(c.key)}
                                            className={[
                                                "group relative px-4 py-2 rounded-2xl text-sm font-extrabold transition",
                                                active ? "bg-[#B9895B] text-white shadow-sm" : "text-[#1E1E1E]/70 hover:bg-white/60",
                                            ].join(" ")}
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span className="text-base">{c.label}</span>
                                                <span className={active ? "text-white/85" : "text-[#1E1E1E]/55"}>{c.hint}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="items-center hidden gap-2 lg:flex">
                                <label className="inline-flex items-center gap-2 rounded-2xl bg-[#B9895B] px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90 cursor-pointer">
                                    <ImagePlus size={18} />
                                    העלאת תמונה
                                    <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
                                </label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setDetailsOpen((v) => !v)}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/45 px-5 py-3 text-sm font-extrabold text-[#3B3024] hover:bg-white/60"
                                    >
                                        פרטי שליחה
                                        {detailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>

                                    {detailsOpen && (
                                        <div className="absolute z-50 mt-3 right-0 w-[min(420px,calc(100vw-2rem))]">
                                            <DetailsPanel
                                                name={name}
                                                phone={phone}
                                                email={email}
                                                setName={setName}
                                                setPhone={setPhone}
                                                setEmail={setEmail}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-3 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setSketchPickerOpenMobile(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/55 px-4 py-2 text-sm font-extrabold text-[#3B3024] hover:bg-white/70"
                        >
                            בחר סקיצה
                            <ChevronUp size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setDetailsOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/55 px-4 py-2 text-sm font-extrabold text-[#3B3024] hover:bg-white/70"
                        >
                            פרטי שליחה
                            <ChevronUp size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 mx-auto max-w-7xl">
                <div className="grid gap-5 lg:grid-cols-[320px,1fr]">
                    <div className="hidden lg:block">
                        <SketchPickerDesktop
                            apiBase={VITE_API_URL}
                            activeCat={activeCat}
                            availableSketches={availableSketches}
                            currentSketch={currentSketch}
                            userImage={userImage}
                            onSelectSketch={onSelectSketch}
                        />
                    </div>

                    <div className="rounded-[28px] border border-[#B9895B]/14 bg-white/45 backdrop-blur shadow-[0_18px_70px_rgba(30,30,30,0.12)] overflow-hidden">
                        <div className="border-b border-[#B9895B]/14 bg-white/35 px-4 sm:px-6 py-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-center sm:text-start">
                                    <div className="text-lg sm:text-xl font-extrabold text-[#3B3024]">אזור עבודה</div>
                                    <div className="mt-1 text-xs sm:text-sm text-[#1E1E1E]/65 max-w-xl mx-auto sm:mx-0">
                                        גרירה להזזה, צביטה/גלגלת לשינוי גודל. הסקיצה לא זזה לבד.
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={overlay.rotate}
                                        disabled={!ready}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition",
                                            ready
                                                ? "border border-[#B9895B]/18 bg-white/55 text-[#3B3024] hover:bg-white/70"
                                                : "border border-[#B9895B]/10 bg-white/30 text-[#1E1E1E]/40 cursor-not-allowed",
                                        ].join(" ")}
                                    >
                                        <RotateCcw size={18} />
                                        סיבוב
                                    </button>

                                    <button
                                        type="button"
                                        onClick={overlay.reset}
                                        disabled={!ready}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition",
                                            ready
                                                ? "border border-[#B9895B]/18 bg-white/55 text-[#3B3024] hover:bg-white/70"
                                                : "border border-[#B9895B]/10 bg-white/30 text-[#1E1E1E]/40 cursor-not-allowed",
                                        ].join(" ")}
                                    >
                                        Reset
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
                                            <div className="mt-3 text-lg font-extrabold text-[#3B3024]">נתחיל עם תמונה שלך</div>
                                            <div className="mt-2 text-sm text-[#1E1E1E]/70">תמונה חדה באור טוב עושה פלאים.</div>
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
                                    <img
                                        src={userImage}
                                        alt="Uploaded"
                                        className="absolute inset-0 object-contain w-full h-full"
                                        crossOrigin="anonymous"
                                        draggable={false}
                                    />
                                )}

                                {ready && currentSketch && isMobile ? (
                                    <animated.div
                                        {...overlay.bindMobile()}
                                        style={overlay.mobileStyle as never}
                                    >
                                        <img
                                            src={currentSketch}
                                            alt="sketch"
                                            className="object-contain w-full h-full pointer-events-none select-none"
                                            crossOrigin="anonymous"
                                            draggable={false}
                                        />
                                    </animated.div>
                                ) : ready && currentSketch ? (
                                    <div {...overlay.bindDesktop()} style={overlay.desktopStyle}>
                                        <img
                                            src={currentSketch}
                                            alt="sketch"
                                            className="object-contain w-full h-full pointer-events-none select-none"
                                            crossOrigin="anonymous"
                                            draggable={false}
                                        />
                                    </div>
                                ) : null}
                            </div>

                            {userImage && availableSketches.length > 0 && (
                                <div className="mt-4 rounded-[22px] border border-[#B9895B]/14 bg-white/40 backdrop-blur px-3 py-3">
                                    <div className="text-xs font-extrabold text-[#3B3024] text-center">החלפת סקיצה מהירה</div>
                                    <div className="flex justify-start gap-3 pb-1 mt-3 overflow-auto">
                                        {availableSketches.map((imgPath, idx) => {
                                            const fullUrl = joinUrl(VITE_API_URL, imgPath);
                                            const active = currentSketch === fullUrl;
                                            return (
                                                <button
                                                    key={`${imgPath}-strip-${idx}`}
                                                    type="button"
                                                    onClick={() => onSelectSketch(imgPath)}
                                                    className={[
                                                        "shrink-0 relative h-16 w-16 rounded-2xl border bg-white/55 transition",
                                                        active ? "border-[#B9895B] ring-2 ring-[#B9895B]/25" : "border-[#B9895B]/14 hover:border-[#B9895B]/45",
                                                    ].join(" ")}
                                                    title="בחר סקיצה"
                                                >
                                                    <img
                                                        src={fullUrl}
                                                        alt="sketch"
                                                        className="object-contain w-full h-full p-2"
                                                        loading="lazy"
                                                        crossOrigin="anonymous"
                                                        draggable={false}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 mt-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-xs sm:text-sm text-[#1E1E1E]/65 text-center sm:text-start">
                                    {ready ? (
                                        <span className="inline-flex items-center justify-center gap-2 sm:justify-start">
                                            <span className="h-2 w-2 rounded-full bg-[#97BE5A]" />
                                            מוכן.
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center justify-center gap-2 sm:justify-start">
                                            <span className="h-2 w-2 rounded-full bg-[#B9895B]" />
                                            העלה תמונה ואז בחר סקיצה.
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
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
                                        disabled={!canSend}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold transition shadow-sm",
                                            canSend ? "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90" : "bg-[#B9895B]/35 text-white/70 cursor-not-allowed",
                                        ].join(" ")}
                                    >
                                        <Mail size={18} />
                                        שליחה
                                    </button>
                                </div>
                            </div>

                            {ready && !canSend && (
                                <div className="mt-3 text-center text-xs text-[#1E1E1E]/60">
                                    כדי לשלוח לעומר, פתח “פרטי שליחה” ומלא שם וטלפון.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <SketchPickerMobile
                    open={sketchPickerOpenMobile}
                    onClose={() => setSketchPickerOpenMobile(false)}
                    apiBase={VITE_API_URL}
                    availableSketches={availableSketches}
                    currentSketch={currentSketch}
                    onSelectSketch={onSelectSketch}
                />

                {detailsOpen && isMobile && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button type="button" onClick={() => setDetailsOpen(false)} className="absolute inset-0 bg-black/35" aria-label="סגור" />
                        <div className="absolute left-0 right-0 bottom-0 rounded-t-[28px] border-t border-[#B9895B]/18 bg-[#F6F1E8] shadow-[0_-18px_70px_rgba(0,0,0,0.22)]">
                            <div className="px-4 py-4 mx-auto max-w-7xl">
                                <div className="flex items-center justify-between">
                                    <div className="text-base font-extrabold text-[#3B3024]">פרטי שליחה</div>
                                    <button
                                        type="button"
                                        onClick={() => setDetailsOpen(false)}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/55 px-4 py-2 text-sm font-extrabold text-[#3B3024]"
                                    >
                                        סגור
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="mt-3">
                                    <DetailsPanel name={name} phone={phone} email={email} setName={setName} setPhone={setPhone} setEmail={setEmail} />
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
