export const SKETCH_CATEGORIES = ["small", "medium", "large"] as const;
export type SketchCategory = (typeof SKETCH_CATEGORIES)[number];

export type AdminTab = "products" | "sketches" | "canvases";

export type CanvasSize = "80×25" | "80×60" | "50×40";

export type CanvasVariant = {
    id: string;
    label?: string;
    color: string;
    imageUrl: string;
};

export type CanvasItem = {
    _id?: string;
    name: string;
    size: CanvasSize;
    imageUrl: string;
    variants?: CanvasVariant[];
};
