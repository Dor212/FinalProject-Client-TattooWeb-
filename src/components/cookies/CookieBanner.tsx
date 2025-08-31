import { useEffect, useState } from "react";
import { Consent, useCookieConsent } from "./CookieConsentProvider";

export default function CookieBanner() {
    const { consent, setConsent, ready } = useCookieConsent();
    const [open, setOpen] = useState(false);
    const [prefsOpen, setPrefsOpen] = useState(false);
    const [analytics, setAnalytics] = useState(true);
    const [marketing, setMarketing] = useState(false);

    useEffect(() => {
        if (!ready) return;
        if (!consent) setOpen(true);
    }, [ready, consent]);

    function acceptAll() {
        const c: Consent = { necessary: true, analytics: true, marketing: true };
        setConsent(c);
        setOpen(false);
        setPrefsOpen(false);
    }
    function rejectNonEssential() {
        const c: Consent = { necessary: true, analytics: false, marketing: false };
        setConsent(c);
        setOpen(false);
        setPrefsOpen(false);
    }
    function savePrefs() {
        const c: Consent = { necessary: true, analytics, marketing };
        setConsent(c);
        setOpen(false);
        setPrefsOpen(false);
    }

    if (!open) return null;

    return (
        <>
            {/* Banner */}
            <div className="fixed inset-x-0 bottom-0 z-[98]">
                <div className="mx-auto max-w-5xl m-3 rounded-2xl border border-[#e4d3a1] bg-[#F1F3C2]/95 backdrop-blur shadow-xl p-4 hebrew-content">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="text-sm text-[#3B3024]">
                            אנו משתמשים בעוגיות לשיפור חוויית הגלישה, ניתוח שימוש ומטרות שיווק (בכפוף להסכמה). ניתן לנהל העדפות.
                        </div>
                        <div className="flex gap-2 md:ml-auto">
                            <button
                                className="px-3 py-2 rounded-lg border border-[#e4d3a1] bg-white/80 hover:bg-white text-[#3B3024]"
                                onClick={() => setPrefsOpen(true)}
                            >
                                נהל העדפות
                            </button>
                            <button
                                className="px-3 py-2 rounded-lg bg-white/80 hover:bg-white border border-[#e4d3a1] text-[#3B3024]"
                                onClick={rejectNonEssential}
                            >
                                דחה לא חיוניות
                            </button>
                            <button
                                className="px-3 py-2 rounded-lg bg-[#3B3024] text-[#F1F3C2] hover:opacity-90"
                                onClick={acceptAll}
                            >
                                אשר הכול
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences Modal */}
            {prefsOpen && (
                <div className="fixed inset-0 z-[99] bg-black/30 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e4d3a1] shadow-xl p-5 hebrew-content">
                        <h3 className="text-lg font-semibold mb-3 text-[#3B3024]">העדפות עוגיות</h3>
                        <div className="space-y-3 text-sm text-[#3B3024]">
                            <div className="p-3 border border-[#e4d3a1] rounded-lg">
                                <div className="font-medium">חיוניות (חובה)</div>
                                <div className="opacity-80">נדרשות לפעולה תקינה של האתר ואינן ניתנות לכיבוי.</div>
                            </div>
                            <label className="p-3 border border-[#e4d3a1] rounded-lg flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-5 w-5 accent-[#3B3024]"
                                    checked={analytics}
                                    onChange={(e) => setAnalytics(e.target.checked)}
                                />
                                <div>
                                    <div className="font-medium">אנליטיקה</div>
                                    <div className="opacity-80">עוזרות לנו להבין שימוש ולשפר חוויית משתמש.</div>
                                </div>
                            </label>
                            <label className="p-3 border border-[#e4d3a1] rounded-lg flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-5 w-5 accent-[#3B3024]"
                                    checked={marketing}
                                    onChange={(e) => setMarketing(e.target.checked)}
                                />
                                <div>
                                    <div className="font-medium">שיווק</div>
                                    <div className="opacity-80">התאמת תכנים/מדידה במערכות פרסום.</div>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-2 mt-5">
                            <button
                                className="px-3 py-2 rounded-lg border border-[#e4d3a1] bg-white/80 hover:bg-white text-[#3B3024]"
                                onClick={() => setPrefsOpen(false)}
                            >
                                ביטול
                            </button>
                            <button
                                className="px-3 py-2 rounded-lg bg-white/80 hover:bg-white border border-[#e4d3a1] text-[#3B3024]"
                                onClick={rejectNonEssential}
                            >
                                דחה לא חיוניות
                            </button>
                            <button
                                className="ml-auto px-3 py-2 rounded-lg bg-[#3B3024] text-[#F1F3C2] hover:opacity-90"
                                onClick={savePrefs}
                            >
                                שמור העדפות
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
