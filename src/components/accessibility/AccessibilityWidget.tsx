import { useEffect, useState } from "react";

type Toggles = {
    bigText: boolean;
    highContrast: boolean;
    underlineLinks: boolean;
    grayscale: boolean;
    reduceMotion: boolean;
};

const STORAGE_KEY = "accessibility-toggles-v1";

export default function AccessibilityWidget() {
    const [open, setOpen] = useState(false);
    const [toggles, setToggles] = useState<Toggles>({
        bigText: false,
        highContrast: false,
        underlineLinks: false,
        grayscale: false,
        reduceMotion: false,
    });

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved) as Toggles;
            setToggles(parsed);
            applyClasses(parsed);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toggles));
        applyClasses(toggles);
    }, [toggles]);

    function applyClasses(t: Toggles) {
        const html = document.documentElement;
        html.classList.toggle("accessibility-big-text", t.bigText);
        html.classList.toggle("accessibility-high-contrast", t.highContrast);
        html.classList.toggle("accessibility-underline-links", t.underlineLinks);
        html.classList.toggle("accessibility-grayscale", t.grayscale);
        html.classList.toggle("accessibility-reduce-motion", t.reduceMotion);
    }

    const Row = ({
        id, label, checked, onChange,
    }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) => (
        <label htmlFor={id} className="flex items-center justify-between py-2">
            <span className="text-sm text-[#3B3024]">{label}</span>
            <input
                id={id}
                type="checkbox"
                className="h-5 w-5 accent-[#3B3024]"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                aria-checked={checked}
            />
        </label>
    );

    return (
        <>
            {/* קישור דילוג לתוכן */}
            <a
                href="#content"
                className="fixed right-3 top-3 z-[100] bg-[#F1F3C2]/90 shadow rounded-full px-3 py-1 text-sm text-[#3B3024] border border-[#e4d3a1] hover:bg-[#F1F3C2]"
            >
                דלג לתוכן
            </a>

            {/* כפתור עגול קבוע */}
            <div className="fixed right-4 bottom-4 z-[99]">
                <button
                    aria-label="פתח/י תפריט נגישות"
                    onClick={() => setOpen((v) => !v)}
                    className="rounded-full shadow-lg border border-[#e4d3a1] bg-[#F1F3C2] text-[#3B3024] w-14 h-14 text-2xl hover:scale-105 transition"
                    title="נגישות"
                >
                    ♿
                </button>

                {open && (
                    <div
                        role="dialog"
                        aria-label="תפריט נגישות"
                        className="mt-3 w-72 max-w-[90vw] bg-white/90 backdrop-blur border border-[#e4d3a1] rounded-2xl shadow-xl p-4"
                    >
                        <h3 className="text-base font-semibold mb-2 text-[#3B3024]">אפשרויות נגישות</h3>
                        <div className="divide-y divide-[#e4d3a1]">
                            <Row id="acc-big" label="טקסט גדול" checked={toggles.bigText} onChange={(v) => setToggles({ ...toggles, bigText: v })} />
                            <Row id="acc-contrast" label="ניגודיות גבוהה" checked={toggles.highContrast} onChange={(v) => setToggles({ ...toggles, highContrast: v })} />
                            <Row id="acc-underline" label="קו תחתון לקישורים" checked={toggles.underlineLinks} onChange={(v) => setToggles({ ...toggles, underlineLinks: v })} />
                            <Row id="acc-gray" label="גווני אפור" checked={toggles.grayscale} onChange={(v) => setToggles({ ...toggles, grayscale: v })} />
                            <Row id="acc-reduce" label="ביטול אנימציות" checked={toggles.reduceMotion} onChange={(v) => setToggles({ ...toggles, reduceMotion: v })} />
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                className="px-3 py-2 rounded-lg border border-[#e4d3a1] bg-white/80 hover:bg-white text-[#3B3024]"
                                onClick={() =>
                                    setToggles({
                                        bigText: false,
                                        highContrast: false,
                                        underlineLinks: false,
                                        grayscale: false,
                                        reduceMotion: false,
                                    })
                                }
                            >
                                איפוס
                            </button>
                            <button
                                className="ml-auto px-3 py-2 rounded-lg bg-[#3B3024] text-[#F1F3C2] hover:opacity-90"
                                onClick={() => setOpen(false)}
                            >
                                סגור
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
