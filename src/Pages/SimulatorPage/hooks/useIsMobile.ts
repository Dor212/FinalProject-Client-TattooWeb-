import { useEffect, useState } from "react";

export function useIsMobile(maxWidthPx = 1024) {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(`(max-width: ${maxWidthPx}px)`).matches;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`);
        const handler = () => setIsMobile(mq.matches);
        handler();
        mq.addEventListener?.("change", handler);
        return () => mq.removeEventListener?.("change", handler);
    }, [maxWidthPx]);

    return isMobile;
}
