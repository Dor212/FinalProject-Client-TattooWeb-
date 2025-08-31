import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Consent = {
    necessary: true;        // תמיד חובה
    analytics: boolean;     // ברירת מחדל נשלטת בבאנר
    marketing: boolean;     // ברירת מחדל נשלטת בבאנר
    date?: string;
};

type Ctx = {
    consent: Consent | null;
    setConsent: (c: Consent) => void;
    ready: boolean;
};

const CookieCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "cookie-consent-v1";

// יוזם Google Analytics רק אם יש אישור לאנליטיקה + קיים VITE_GA_ID
function initAnalyticsIfAllowed(consent: Consent) {
    const gaId = import.meta.env.VITE_GA_ID;
    if (!gaId) return;
    const exists = !!document.getElementById("ga-script");
    if (consent.analytics && !exists) {
        const s1 = document.createElement("script");
        s1.id = "ga-script";
        s1.async = true;
        s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(s1);

        const s2 = document.createElement("script");
        s2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} 
      gtag('js', new Date());
      gtag('config', '${gaId}', { 'anonymize_ip': true });
    `;
        document.head.appendChild(s2);
    }
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
    const [consent, _setConsent] = useState<Consent | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Consent;
            _setConsent(parsed);
            initAnalyticsIfAllowed(parsed);
        }
        setReady(true);
    }, []);

    const setConsent = (c: Consent) => {
        const withDate = { ...c, date: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(withDate));
        _setConsent(withDate);
        initAnalyticsIfAllowed(withDate);
    };

    const value = useMemo(() => ({ consent, setConsent, ready }), [consent, ready]);
    return <CookieCtx.Provider value={value}>{children}</CookieCtx.Provider>;
}

export function useCookieConsent() {
    const ctx = useContext(CookieCtx);
    if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
    return ctx;
}
