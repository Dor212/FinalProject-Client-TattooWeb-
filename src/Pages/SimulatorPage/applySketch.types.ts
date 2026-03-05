export type LocationState = {
    selectedSketch?: string;
    category?: "small" | "medium" | "large" | string;
};

export type Env = {
    VITE_API_URL: string;
};

export type Cat = "small" | "medium" | "large";

export type Frame = {
    translate: [number, number];
    rotate: number;
    scale: [number, number];
};

export type CatUiItem = {
    key: Cat;
    label: string;
    title: string;
    hint: string;
};

export type CatRule = {
    initialTargetRatio: number;
    scaleMin: number;
    scaleMax: number;
};

export type CatRules = Record<Cat, CatRule>;
