import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import html2canvas from "html2canvas";
import axios from "../../Services/axiosInstance";
import { Download, Mail, RotateCcw, ImagePlus, X } from "lucide-react";

import type { Env, LocationState, Cat } from "./applySketch.types";
import { CAT_RULES, OVERLAY_BASE } from "./applySketch.constants";
import { joinUrl, normalizeCat } from "./applySketch.utils";
import { useIsMobile } from "./hooks/useIsMobile";
import { useSketchGallery } from "./hooks/useSketchGallery";
import { useOverlayController } from "./hooks/useOverlayController";

import DetailsPanel from "./components/DetailsPanel";
import SketchPickerDesktop from "./components/SketchPickerDesktop";
import SketchPickerMobile from "./components/SketchPickerMobile";

type Rect = {
    left: number;
    top: number;
    width: number;
    height: number;
};

const MAX_EXPORT_SIDE = 2200;

const loadImageElement = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = src;
    });

const getContainedRect = (
    containerWidth: number,
    containerHeight: number,
    mediaWidth: number,
    mediaHeight: number
): Rect | null => {
    if (!containerWidth || !containerHeight || !mediaWidth || !mediaHeight) return null;

    const containerRatio = containerWidth / containerHeight;
    const mediaRatio = mediaWidth / mediaHeight;

    if (mediaRatio > containerRatio) {
        const width = containerWidth;
        const height = width / mediaRatio;
        return { left: 0, top: (containerHeight - height) / 2, width, height };
    }

    const height = containerHeight;
    const width = height * mediaRatio;
    return { left: (containerWidth - width) / 2, top: 0, width, height };
};

const fitIntoBox = (
    boxWidth: number,
    boxHeight: number,
    mediaWidth: number,
    mediaHeight: number
) => {
    const rect = getContainedRect(boxWidth, boxHeight, mediaWidth, mediaHeight);
    return rect ?? { left: 0, top: 0, width: boxWidth, height: boxHeight };
};

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
    const desktopDetailsAnchorRef = useRef<HTMLDivElement>(null);

    const [desktopDetailsStyle, setDesktopDetailsStyle] = useState<{
        top: number;
        right: number;
        width: number;
    } | null>(null);

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
    }, [selectedSketch, VITE_API_URL]);

    useEffect(() => {
        if (!currentSketch && availableSketches.length > 0) {
            setCurrentSketch(joinUrl(VITE_API_URL, availableSketches[0]));
        }
    }, [availableSketches, currentSketch, VITE_API_URL]);

    useEffect(() => {
        if (!detailsOpen || isMobile) {
            setDesktopDetailsStyle(null);
            return;
        }

        const updateDesktopDetailsPosition = () => {
            const anchor = desktopDetailsAnchorRef.current;
            if (!anchor) return;

            const rect = anchor.getBoundingClientRect();
            const viewportPadding = 16;
            const gap = 12;
            const width = Math.min(420, Math.max(300, window.innerWidth - viewportPadding * 2));

            let right = window.innerWidth - rect.right;
            right = Math.max(
                viewportPadding,
                Math.min(right, window.innerWidth - viewportPadding - width)
            );

            setDesktopDetailsStyle({
                top: rect.bottom + gap,
                right,
                width,
            });
        };

        updateDesktopDetailsPosition();

        window.addEventListener("resize", updateDesktopDetailsPosition);
        window.addEventListener("scroll", updateDesktopDetailsPosition, true);

        return () => {
            window.removeEventListener("resize", updateDesktopDetailsPosition);
            window.removeEventListener("scroll", updateDesktopDetailsPosition, true);
        };
    }, [detailsOpen, isMobile]);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUserImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        if (isMobile) setSketchPickerOpenMobile(true);
    };

    const onSelectSketch = (imgPathOrUrl: string) => {
        const full = joinUrl(VITE_API_URL, imgPathOrUrl);
        setCurrentSketch(full);
        if (isMobile) setSketchPickerOpenMobile(false);
    };

    const captureWorkArea = async () => {
        if (!workAreaRef.current) return null;
        await new Promise((r) => setTimeout(r, 120));

        const sc = Math.min(
            2,
            typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
        );

        const canvas = await html2canvas(workAreaRef.current, {
            useCORS: true,
            allowTaint: false,
            backgroundColor: null,
            scale: sc,
        });

        return canvas;
    };

    const composeExportCanvas = async () => {
        if (!userImage || !currentSketch || !workAreaRef.current) return null;

        try {
            const [baseImage, sketchImage] = await Promise.all([
                loadImageElement(userImage),
                loadImageElement(currentSketch),
            ]);

            const overlaySnapshot = overlay.getSnapshot();
            const imageRect = overlay.getImageRect();

            if (!imageRect || !workAreaRef.current.clientWidth || !workAreaRef.current.clientHeight) {
                return await captureWorkArea();
            }

            const baseWidth = baseImage.naturalWidth || baseImage.width;
            const baseHeight = baseImage.naturalHeight || baseImage.height;
            if (!baseWidth || !baseHeight) return await captureWorkArea();

            const exportScale = Math.min(1, MAX_EXPORT_SIDE / Math.max(baseWidth, baseHeight));
            const exportWidth = Math.max(1, Math.round(baseWidth * exportScale));
            const exportHeight = Math.max(1, Math.round(baseHeight * exportScale));

            const canvas = document.createElement("canvas");
            canvas.width = exportWidth;
            canvas.height = exportHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return await captureWorkArea();

            ctx.clearRect(0, 0, exportWidth, exportHeight);
            ctx.drawImage(baseImage, 0, 0, exportWidth, exportHeight);

            const centerRelativeX =
                (overlaySnapshot.translate[0] + OVERLAY_BASE / 2 - imageRect.left) / imageRect.width;
            const centerRelativeY =
                (overlaySnapshot.translate[1] + OVERLAY_BASE / 2 - imageRect.top) / imageRect.height;

            const overlayBoxWidth =
                (OVERLAY_BASE * overlaySnapshot.scale * exportWidth) / imageRect.width;
            const overlayBoxHeight =
                (OVERLAY_BASE * overlaySnapshot.scale * exportHeight) / imageRect.height;

            const overlayCenterX = centerRelativeX * exportWidth;
            const overlayCenterY = centerRelativeY * exportHeight;

            const fittedSketch = fitIntoBox(
                overlayBoxWidth,
                overlayBoxHeight,
                sketchImage.naturalWidth || sketchImage.width,
                sketchImage.naturalHeight || sketchImage.height
            );

            ctx.save();
            ctx.translate(overlayCenterX, overlayCenterY);
            ctx.rotate((overlaySnapshot.rotate * Math.PI) / 180);
            ctx.globalAlpha = 0.88;
            ctx.drawImage(
                sketchImage,
                -overlayBoxWidth / 2 + fittedSketch.left,
                -overlayBoxHeight / 2 + fittedSketch.top,
                fittedSketch.width,
                fittedSketch.height
            );
            ctx.restore();

            return canvas;
        } catch {
            return await captureWorkArea();
        }
    };

    const handleSend = async () => {
        if (!canSend) return;

        try {
            const canvas = await composeExportCanvas();
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
            const canvas = await composeExportCanvas();
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
        <div dir="rtl" className="min-h-[100svh] bg-[#F6F1E8] text-[#1E1E1E]">
            <div className="sticky top-0 z-40 border-b border-[#B9895B]/14 bg-[#F6F1E8]/92 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#B9895B] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90">
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
                            onClick={() => setSketchPickerOpenMobile(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/70 px-4 py-2.5 text-sm font-extrabold text-[#3B3024] lg:hidden"
                        >
                            בחר סקיצה
                        </button>

                        {isMobile ? (
                            <button
                                type="button"
                                onClick={() => setDetailsOpen(true)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/70 px-4 py-2.5 text-sm font-extrabold text-[#3B3024]"
                            >
                                פרטי שליחה
                            </button>
                        ) : (
                            <div ref={desktopDetailsAnchorRef}>
                                <button
                                    type="button"
                                    onClick={() => setDetailsOpen((v) => !v)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/70 px-4 py-2.5 text-sm font-extrabold text-[#3B3024]"
                                >
                                    פרטי שליחה
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="hidden text-xs font-bold text-[#1E1E1E]/55 sm:block">
                        {ready ? "מוכן לשמירה או שליחה" : "העלה תמונה ובחר סקיצה"}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-5">
                <div className="grid gap-4 lg:grid-cols-[300px,1fr]">
                    <div className="hidden lg:block">
                        <SketchPickerDesktop
                            apiBase={VITE_API_URL}
                            activeCat={activeCat}
                            onChangeCat={setActiveCat}
                            availableSketches={availableSketches}
                            currentSketch={currentSketch}
                            onSelectSketch={onSelectSketch}
                        />
                    </div>

                    <div className="overflow-hidden rounded-[30px] border border-[#B9895B]/14 bg-white/50 shadow-[0_18px_70px_rgba(30,30,30,0.10)]">
                        <div className="p-4 sm:p-5">
                            <div
                                ref={workAreaRef}
                                className="relative w-full overflow-hidden rounded-[26px] border border-[#B9895B]/14 bg-[#F8F4EC] aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9]"
                                style={{ touchAction: "none" }}
                            >
                                {!userImage && (
                                    <div className="absolute inset-0 grid place-items-center p-6">
                                        <div className="rounded-[24px] border border-[#B9895B]/14 bg-white/75 px-6 py-6 text-center shadow-sm">
                                            <div className="text-base font-extrabold text-[#3B3024]">
                                                העלה תמונה כדי להתחיל
                                            </div>

                                            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#B9895B] px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90">
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
                                        className="absolute inset-0 h-full w-full object-contain"
                                        crossOrigin="anonymous"
                                        draggable={false}
                                    />
                                )}

                                {ready && currentSketch ? (
                                    <div
                                        {...(isMobile ? overlay.bindMobile() : overlay.bindDesktop())}
                                        style={isMobile ? overlay.mobileStyle : overlay.desktopStyle}
                                    >
                                        <img
                                            src={currentSketch}
                                            alt="sketch"
                                            className="h-full w-full pointer-events-none select-none object-contain"
                                            crossOrigin="anonymous"
                                            draggable={false}
                                        />
                                    </div>
                                ) : null}

                                {ready && (
                                    <div className="absolute left-3 top-3 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={overlay.rotate}
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#B9895B]/18 bg-white/80 text-[#3B3024] shadow-sm"
                                            aria-label="סיבוב"
                                        >
                                            <RotateCcw size={18} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={overlay.reset}
                                            className="rounded-2xl border border-[#B9895B]/18 bg-white/80 px-4 py-2 text-sm font-extrabold text-[#3B3024] shadow-sm"
                                        >
                                            איפוס
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-xs font-bold text-[#1E1E1E]/55">
                                    {ready ? "גרור, סובב, שמור או שלח" : "לא נבחרה עדיין סקיצה"}
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        disabled={!ready}
                                        className={[
                                            "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold transition shadow-sm",
                                            ready
                                                ? "border border-[#B9895B]/18 bg-white/80 text-[#3B3024] hover:bg-white"
                                                : "cursor-not-allowed border border-[#B9895B]/10 bg-white/40 text-[#1E1E1E]/35",
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
                                            "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold transition shadow-sm",
                                            canSend
                                                ? "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90"
                                                : "cursor-not-allowed bg-[#B9895B]/35 text-white/70",
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

                {detailsOpen && !isMobile && desktopDetailsStyle && (
                    <div
                        className="fixed z-[70]"
                        style={{
                            top: desktopDetailsStyle.top,
                            right: desktopDetailsStyle.right,
                            width: desktopDetailsStyle.width,
                        }}
                    >
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

                <SketchPickerMobile
                    open={sketchPickerOpenMobile}
                    onClose={() => setSketchPickerOpenMobile(false)}
                    apiBase={VITE_API_URL}
                    activeCat={activeCat}
                    onChangeCat={setActiveCat}
                    availableSketches={availableSketches}
                    currentSketch={currentSketch}
                    onSelectSketch={onSelectSketch}
                />

                {detailsOpen && isMobile && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setDetailsOpen(false)}
                            className="absolute inset-0 bg-black/35"
                            aria-label="סגור"
                        />
                        <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] border-t border-[#B9895B]/18 bg-[#F6F1E8] shadow-[0_-18px_70px_rgba(0,0,0,0.22)]">
                            <div className="mx-auto max-w-7xl px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-base font-extrabold text-[#3B3024]">
                                        פרטי שליחה
                                    </div>

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
                                    <DetailsPanel
                                        name={name}
                                        phone={phone}
                                        email={email}
                                        setName={setName}
                                        setPhone={setPhone}
                                        setEmail={setEmail}
                                    />
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