import { useEffect, useState } from "react";

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 hebrew-content"
        >
            <div className="bg-white text-[#3B3024] rounded-xl shadow-lg max-w-md w-full p-6 text-center mx-4">
                <h2 className="mb-3 text-xl font-bold">מדיניות קוקיז</h2>
                <p className="mb-5 text-sm leading-relaxed">
                    האתר משתמש בקוקיז (Cookies) כדי לשפר את חוויית הגלישה, למדוד ביצועים
                    ולהציע תוכן מותאם. באפשרותך לבחור אם לאשר או לדחות את השימוש בקוקיז.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleAccept}
                        className="px-5 py-2 rounded-lg bg-[#97BE5A] text-white hover:bg-[#7ea649] transition"
                    >
                        מאשר
                    </button>
                    <button
                        onClick={handleDecline}
                        className="px-5 py-2 rounded-lg bg-[#CBB279] text-[#3B3024] hover:bg-[#b39a5f] transition"
                    >
                        לא מסכים
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
