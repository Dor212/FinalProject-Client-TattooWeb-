export const cls = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

export const formatILS = (n: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

export const priceForSize = (size: "80×25" | "50×40" | "80×60") => {
    if (size === "80×25") return 220;
    if (size === "50×40") return 390;
    return 550;
};

export const tabLabel = (k: "all" | "80×25" | "50×40" | "80×60") => {
    if (k === "all") return "הכל";
    return k;
};
