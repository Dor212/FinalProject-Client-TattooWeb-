import { useEffect, useMemo, useState } from "react";
import { Check, Expand, X } from "lucide-react";

import { CAT_UI } from "../applySketch.constants";
import type { Cat } from "../applySketch.types";
import { joinUrl } from "../applySketch.utils";

type SketchPickerDesktopProps = {
    apiBase: string;
    activeCat: Cat;
    onChangeCat: (cat: Cat) => void;
    availableSketches: string[];
    currentSketch: string | null;
    onSelectSketch: (imgPathOrUrl: string) => void;
};

const SketchPickerDesktop = ({
    apiBase,
    activeCat,
    onChangeCat,
    availableSketches,
    currentSketch,
    onSelectSketch,
}: SketchPickerDesktopProps) => {
    const [previewPath, setPreviewPath] = useState<string | null>(null);

    useEffect(() => {
        if (!previewPath) return;
        if (!availableSketches.includes(previewPath)) {
            setPreviewPath(null);
        }
    }, [availableSketches, previewPath]);

    const previewUrl = useMemo(() => {
        if (!previewPath) return null;
        return joinUrl(apiBase, previewPath);
    }, [apiBase, previewPath]);

    return (
        <>
            <div className="rounded-[28px] border border-[#B9895B]/14 bg-white/55 p-3 shadow-[0_18px_60px_rgba(30,30,30,0.08)]">
                <div className="inline-flex w-full items-center justify-center rounded-2xl border border-[#B9895B]/14 bg-[#F8F4EC] p-1">
                    {CAT_UI.map((item) => {
                        const active = item.key === activeCat;

                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => onChangeCat(item.key)}
                                className={[
                                    "flex-1 rounded-2xl px-3 py-2.5 text-sm font-extrabold transition",
                                    active
                                        ? "bg-[#B9895B] text-white shadow-sm"
                                        : "text-[#3B3024]/70",
                                ].join(" ")}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-3 max-h-[70svh] overflow-y-auto pr-1">
                    {availableSketches.length === 0 ? (
                        <div className="grid min-h-[220px] place-items-center rounded-[24px] border border-[#B9895B]/14 bg-[#F8F4EC]">
                            <div className="text-sm font-extrabold text-[#3B3024]">
                                אין סקיצות בגודל הזה
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {availableSketches.map((imgPath, idx) => {
                                const fullUrl = joinUrl(apiBase, imgPath);
                                const isCurrent = currentSketch === fullUrl;

                                return (
                                    <button
                                        key={`${imgPath}-${idx}`}
                                        type="button"
                                        onClick={() => onSelectSketch(imgPath)}
                                        className={[
                                            "overflow-hidden rounded-[22px] border bg-white/75 shadow-sm transition hover:translate-y-[-1px]",
                                            isCurrent
                                                ? "border-[#B9895B] ring-2 ring-[#B9895B]/20"
                                                : "border-[#B9895B]/14",
                                        ].join(" ")}
                                    >
                                        <div className="relative aspect-square bg-[#F8F4EC]">
                                            <img
                                                src={fullUrl}
                                                alt="sketch preview"
                                                className="object-contain w-full h-full p-3"
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                draggable={false}
                                            />

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewPath(imgPath);
                                                }}
                                                className="absolute left-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#B9895B]/14 bg-white/95 text-[#3B3024] shadow-sm"
                                                aria-label="הגדל סקיצה"
                                            >
                                                <Expand size={15} />
                                            </button>

                                            {isCurrent && (
                                                <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-xl bg-[#B9895B] px-2 py-1 text-[11px] font-extrabold text-white shadow-sm">
                                                    <Check size={13} />
                                                    נבחרה
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {previewPath && previewUrl && (
                <div className="fixed inset-0 z-[75] hidden lg:block">
                    <button
                        type="button"
                        onClick={() => setPreviewPath(null)}
                        className="absolute inset-0 bg-black/45"
                        aria-label="סגור"
                    />

                    <div className="absolute inset-x-[8%] top-[7%] bottom-[7%] rounded-[32px] border border-[#B9895B]/18 bg-[#F6F1E8] shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
                        <div className="flex flex-col h-full p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="inline-flex items-center justify-center rounded-2xl border border-[#B9895B]/14 bg-white/65 p-1">
                                    {CAT_UI.map((item) => {
                                        const active = item.key === activeCat;

                                        return (
                                            <button
                                                key={item.key}
                                                type="button"
                                                onClick={() => onChangeCat(item.key)}
                                                className={[
                                                    "min-w-[72px] rounded-2xl px-4 py-2.5 text-sm font-extrabold transition",
                                                    active
                                                        ? "bg-[#B9895B] text-white shadow-sm"
                                                        : "text-[#3B3024]/70",
                                                ].join(" ")}
                                            >
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setPreviewPath(null)}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#B9895B]/18 bg-white/75 text-[#3B3024]"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mt-5 flex min-h-0 flex-1 items-center justify-center rounded-[28px] border border-[#B9895B]/14 bg-white/60 p-6">
                                <img
                                    src={previewUrl}
                                    alt="preview sketch"
                                    className="object-contain max-w-full max-h-full"
                                    crossOrigin="anonymous"
                                    draggable={false}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-5">
                                <button
                                    type="button"
                                    onClick={() => setPreviewPath(null)}
                                    className="rounded-2xl border border-[#B9895B]/18 bg-white/75 px-5 py-3 text-sm font-extrabold text-[#3B3024]"
                                >
                                    חזרה
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelectSketch(previewPath);
                                        setPreviewPath(null);
                                    }}
                                    className="rounded-2xl bg-[#B9895B] px-6 py-3 text-sm font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90"
                                >
                                    השתמש בסקיצה
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SketchPickerDesktop;