import type { CatRules, CatUiItem } from "./applySketch.types";

export const CAT_UI: CatUiItem[] = [
    { key: "small", label: "S", title: "Small", hint: "קטן ועדין" },
    { key: "medium", label: "M", title: "Medium", hint: "בינוני מאוזן" },
    { key: "large", label: "L", title: "Large", hint: "גדול ונוכח" },
];

export const CAT_RULES: CatRules = {
    small: { initialTargetRatio: 0.18, scaleMin: 0.18, scaleMax: 2.2 },
    medium: { initialTargetRatio: 0.24, scaleMin: 0.22, scaleMax: 2.35 },
    large: { initialTargetRatio: 0.3, scaleMin: 0.26, scaleMax: 2.5 },
};

export const OVERLAY_BASE = 150;