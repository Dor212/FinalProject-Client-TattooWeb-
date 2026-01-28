import { ReactNode } from "react";

export type AdminTab = "products" | "sketches" | "canvases";
export type CanvasSize = "80×25" | "80×60" | "50×40";
export type TabKey = "all" | CanvasSize;

export type CanvasVariant = {
    id: string;
    label?: string;
    color: string;
    imageUrl: string;
};
export type CanvasItem = {
    price: ReactNode;
    _id: string;
    name: string;
    size: CanvasSize;
    imageUrl: string;
    variants?: CanvasVariant[];
    createdAt?: string;
    updatedAt?: string;
};
