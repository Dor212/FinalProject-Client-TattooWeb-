import { useEffect, useMemo, useState } from "react";
import { Check, Expand, X } from "lucide-react";

import { CAT_UI } from "../applySketch.constants";
import type { Cat } from "../applySketch.types";
import { joinUrl } from "../applySketch.utils";

type SketchPickerMobileProps = {
    open: boolean;
    onClose: () => void;
    apiBase: string;
    activeCat: Cat;
    onChangeCat: (cat: Cat) => void;
    availableSketches: string[];
    currentSketch: string | null;
    onSelectSketch: (imgPathOrUrl: string) => void;
};

const SketchPickerMobile = ({
    open,
    onClose,
    apiBase,
    activeCat,
    onChangeCat,
    availableSketches,
    currentSketch,
    onSelectSketch,
}: SketchPickerMobileProps) => {
    const [previewPath, setPreviewPath] = useState<string | null>(null);

    useEffect(() => {
        if (!open) setPreviewPath(null);
    }, [open]);

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

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] lg:hidden">
            <button
                type="button"
                onClick={onClose}
                aria-label="סגור"
                className="absolute inset-0 bg-black/45"
            />

            <div className="absolute inset-x-0 bottom-0 h-[86svh] overflow-hidden rounded-t-[30px] border-t border-[#B9895B]/18 bg-[#F6F1E8] shadow-[0_-18px_70px_rgba(0,0,0,0.22)]">
                <div className="flex flex-col h-full">
                    <div className="border-b border-[#B9895B]/12 bg-[#F6F1E8]/95 px-4 pb-4 pt-3 backdrop-blur">
                        <div className="mx-auto h-1.5 w-14 rounded-full bg-[#B9895B]/25" />

                        <div className="flex items-center justify-between mt-4">
                            <div className="text-base font-extrabold text-[#3B3024]">סקיצות</div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#B9895B]/18 bg-white/70 text-[#3B3024]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-[#B9895B]/14 bg-white/65 p-1">
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
                    </div>

                    {!previewPath ? (
                        <div className="flex-1 min-h-0 px-4 pt-4 pb-6 overflow-y-auto">
                            {availableSketches.length === 0 ? (
                                <div className="grid min-h-[240px] place-items-center rounded-[26px] border border-[#B9895B]/14 bg-white/55">
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
                                                onClick={() => setPreviewPath(imgPath)}
                                                className="overflow-hidden rounded-[24px] border border-[#B9895B]/14 bg-white/70 shadow-sm"
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

                                                    <div className="absolute left-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-[#3B3024] shadow-sm">
                                                        <Expand size={15} />
                                                    </div>

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
                    ) : (
                        <div className="flex-1 min-h-0 px-4 pt-4 pb-6 overflow-y-auto">
                            <div className="rounded-[28px] border border-[#B9895B]/14 bg-white/65 p-4 shadow-sm">
                                <div className="flex min-h-[48svh] items-center justify-center rounded-[22px] bg-[#F8F4EC] p-4">
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="preview sketch"
                                            className="max-h-[44svh] w-full object-contain"
                                            crossOrigin="anonymous"
                                            draggable={false}
                                        />
                                    )}
                                </div>

                                <div className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-[#B9895B]/14 bg-[#F8F4EC] p-1">
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

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewPath(null)}
                                        className="inline-flex items-center justify-center rounded-2xl border border-[#B9895B]/18 bg-white/75 px-4 py-3 text-sm font-extrabold text-[#3B3024]"
                                    >
                                        חזרה
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!previewPath) return;
                                            onSelectSketch(previewPath);
                                        }}
                                        className="inline-flex items-center justify-center rounded-2xl bg-[#B9895B] px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90"
                                    >
                                        השתמש בסקיצה
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SketchPickerMobile;