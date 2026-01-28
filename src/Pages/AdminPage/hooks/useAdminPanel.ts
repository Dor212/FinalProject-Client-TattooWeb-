import { useCallback, useEffect, useState } from "react";
import axios from "../../../Services/axiosInstance";
import type { Product } from "../../../Types/TProduct";
import type { CanvasItem, CanvasSize, SketchCategory } from "../Sections/types";
import { SKETCH_CATEGORIES } from "../Sections/types";

type UploadCanvasVariant = {
    id: string;
    color: string;
    label?: string;
    image: File | null;
};

type SketchesMap = Record<SketchCategory, string[]>;

const emptySketches = (): SketchesMap => ({
    small: [],
    medium: [],
    large: [],
});

export function useAdminPanel(apiBase: string) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [canvases, setCanvases] = useState<CanvasItem[]>([]);
    const [sketchesByCategory, setSketchesByCategory] = useState<SketchesMap>(emptySketches());

    const refreshAll = useCallback(async () => {
        setLoading(true);
        try {
            const [productsRes, canvasesRes, sketchesRes] = await Promise.all([
                axios.get<Product[]>(`${apiBase}/products`),
                axios.get<CanvasItem[]>(`${apiBase}/canvases`),
                axios.get<SketchesMap>(`${apiBase}/sketches`),
            ]);

            setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
            setCanvases(Array.isArray(canvasesRes.data) ? canvasesRes.data : []);
            setSketchesByCategory(() => {
                const data = sketchesRes.data || ({} as SketchesMap);
                const normalized: SketchesMap = emptySketches();
                for (const cat of SKETCH_CATEGORIES) {
                    normalized[cat] = Array.isArray(data[cat]) ? data[cat] : [];
                }
                return normalized;
            });
        } finally {
            setLoading(false);
        }
    }, [apiBase]);

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    const uploadProduct = useCallback(
        async (payload: {
            title: string;
            price: string;
            description?: string;
            image: File | null;
            stockL?: string;
            stockXL?: string;
            stockXXL?: string;
        }) => {
            try {
                const fd = new FormData();
                fd.append("title", payload.title);
                fd.append("price", payload.price);
                if (payload.description) fd.append("description", payload.description);
                if (payload.image) fd.append("image", payload.image);
                if (payload.stockL) fd.append("stockL", payload.stockL);
                if (payload.stockXL) fd.append("stockXL", payload.stockXL);
                if (payload.stockXXL) fd.append("stockXXL", payload.stockXXL);

                const res = await axios.post<Product>(`${apiBase}/products`, fd);
                setProducts((prev) => [res.data, ...prev]);
                return { ok: true as const };
            } catch {
                alert("שגיאה בהעלאת מוצר");
                return { ok: false as const };
            }
        },
        [apiBase],
    );

    const deleteProduct = useCallback(
        async (id: string) => {
            try {
                await axios.delete(`${apiBase}/products/${id}`);
                setProducts((prev) => prev.filter((p) => p._id !== id));
                return true;
            } catch {
                alert("שגיאה במחיקת מוצר");
                return false;
            }
        },
        [apiBase],
    );
    const uploadCanvas = useCallback(
        async (payload: { name: string; size: CanvasSize; image: File | null; variants?: UploadCanvasVariant[] }) => {
            const formData = new FormData();
            formData.append("name", payload.name);
            formData.append("size", payload.size);
            if (payload.image) formData.append("image", payload.image);

            const rawVariants = (payload.variants ?? [])
                .filter((v) => Boolean(v?.id) && Boolean(v?.color) && Boolean(v?.image))
                .map((v) => ({ id: v.id, color: v.color, label: v.label ?? "" }));

            if (rawVariants.length > 0) {
                const variantImageIds = rawVariants.map((v) => v.id);

                formData.append("variants", JSON.stringify(rawVariants));
                formData.append("variantImageIds", JSON.stringify(variantImageIds));

                for (const v of payload.variants ?? []) {
                    if (!v.image) continue;
                    if (!variantImageIds.includes(v.id)) continue;
                    formData.append("variantImages", v.image);
                }
            }

            try {
                const res = await axios.post<CanvasItem>(`${apiBase}/canvases/upload`, formData);
                setCanvases((prev) => [res.data, ...prev]);
                return { ok: true as const };
            } catch {
                alert("שגיאה בהעלאת קאנבס");
                return { ok: false as const };
            }
        },
        [apiBase],
    );

    const deleteCanvas = useCallback(
        async (id: string) => {
            try {
                await axios.delete(`${apiBase}/canvases/${id}`);
                setCanvases((prev) => prev.filter((c) => c._id !== id));
                return true;
            } catch {
                alert("שגיאה במחיקת קאנבס");
                return false;
            }
        },
        [apiBase],
    );
    const uploadSketch = useCallback(
        async (category: SketchCategory, file: File | null) => {
            if (!file) return false;
            try {
                const fd = new FormData();
                fd.append("image", file);
                const res = await axios.post<{ ok: boolean; fileUrl?: string }>(`${apiBase}/sketches/${category}`, fd);
                if (!res.data?.ok) return false;

                await refreshAll();
                return true;
            } catch {
                alert("שגיאה בהעלאת סקיצה");
                return false;
            }
        },
        [apiBase, refreshAll],
    );

    const deleteSketch = useCallback(
        async (category: SketchCategory, fileUrl: string) => {
            try {
                await axios.delete(`${apiBase}/sketches/${category}`, { data: { fileUrl } });
                setSketchesByCategory((prev) => ({
                    ...prev,
                    [category]: (prev[category] || []).filter((u) => u !== fileUrl),
                }));
                return true;
            } catch {
                alert("שגיאה במחיקת סקיצה");
                return false;
            }
        },
        [apiBase],
    );

    return {
        loading,
        products,
        canvases,
        sketchesByCategory,
        refreshAll,
        uploadProduct,
        deleteProduct,
        uploadCanvas,
        deleteCanvas,
        uploadSketch,
        deleteSketch,
    };
}
