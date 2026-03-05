import type { Cat } from "./applySketch.types";

export const normalizeCat = (c?: string): Cat => {
    const v = (c || "").toLowerCase();
    if (v === "medium") return "medium";
    if (v === "large") return "large";
    return "small";
};

export const joinUrl = (base: string, maybeUrl: string) => {
    if (!maybeUrl) return "";
    if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
    const b = base.endsWith("/") ? base.slice(0, -1) : base;
    const p = maybeUrl.startsWith("/") ? maybeUrl : `/${maybeUrl}`;
    return `${b}${p}`;
};
