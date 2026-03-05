import type { Cat } from "../applySketch.types";
import { joinUrl } from "../applySketch.utils";

type Props = {
    apiBase: string;
    activeCat: Cat;
    availableSketches: string[];
    currentSketch: string | null;
    userImage: string | null;
    onSelectSketch: (imgPath: string) => void;
};

export default function SketchPickerDesktop({
    apiBase,
    availableSketches,
    currentSketch,
    userImage,
    onSelectSketch,
}: Props) {
    return (
        <div className="rounded-[26px] border border-[#B9895B]/14 bg-white/45 backdrop-blur p-4">
            <div className="flex items-end justify-between gap-3">
                <div className="text-base font-extrabold text-[#3B3024] text-center w-full">בחר סקיצה</div>
            </div>

            <div className="mt-2 text-xs font-semibold text-[#1E1E1E]/55 text-center">{availableSketches.length} סקיצות</div>

            <div className="mt-4 grid grid-cols-4 gap-3 max-h-[520px] overflow-auto pr-1">
                {availableSketches.map((imgPath, idx) => {
                    const fullUrl = joinUrl(apiBase, imgPath);
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
                                crossOrigin="anonymous"
                                draggable={false}
                            />
                        </button>
                    );
                })}
            </div>

            {!userImage && (
                <div className="mt-4 rounded-2xl border border-[#B9895B]/14 bg-[#F6F1E8]/45 p-4 text-sm text-[#1E1E1E]/75 text-center">
                    קודם העלה תמונה, ואז בחר סקיצה.
                </div>
            )}
        </div>
    );
}
