import { ChevronDown } from "lucide-react";
import { joinUrl } from "../applySketch.utils";

type Props = {
    open: boolean;
    onClose: () => void;
    apiBase: string;
    availableSketches: string[];
    currentSketch: string | null;
    onSelectSketch: (imgPath: string) => void;
};

export default function SketchPickerMobile({ open, onClose, apiBase, availableSketches, currentSketch, onSelectSketch }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" onClick={onClose} className="absolute inset-0 bg-black/35" aria-label="סגור" />
            <div className="absolute left-0 right-0 bottom-0 rounded-t-[28px] border-t border-[#B9895B]/18 bg-[#F6F1E8] shadow-[0_-18px_70px_rgba(0,0,0,0.22)]">
                <div className="px-4 py-4 mx-auto max-w-7xl">
                    <div className="flex items-center justify-between">
                        <div className="text-base font-extrabold text-[#3B3024]">בחר סקיצה</div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/55 px-4 py-2 text-sm font-extrabold text-[#3B3024]"
                        >
                            סגור
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-5 gap-3 max-h-[46vh] overflow-auto pb-4">
                        {availableSketches.map((imgPath, idx) => {
                            const fullUrl = joinUrl(apiBase, imgPath);
                            const active = currentSketch === fullUrl;
                            return (
                                <button
                                    key={`${imgPath}-${idx}`}
                                    type="button"
                                    onClick={() => onSelectSketch(imgPath)}
                                    className={[
                                        "relative aspect-square overflow-hidden rounded-2xl border bg-white/55 transition",
                                        active
                                            ? "border-[#B9895B] ring-2 ring-[#B9895B]/25 shadow-[0_16px_40px_rgba(30,30,30,0.14)]"
                                            : "border-[#B9895B]/14 hover:border-[#B9895B]/45",
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
            </div>
        </div>
    );
}
