import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import type { Product } from "../../../Types/TProduct";
import { SKETCH_CATEGORIES } from "../Sections/types";
import type { CanvasItem, SketchCategory, CanvasSize } from "../Sections/types";

const toast = (icon: "success" | "error" | "info", title: string, text?: string, timer = 1500) =>
    Swal.fire({ icon, title, text, timer, showConfirmButton: false });

const confirmDanger = async (title: string, text: string) => {
    const res = await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c0392b",
        cancelButtonColor: "#999",
        confirmButtonText: "כן, למחוק",
        cancelButtonText: "ביטול",
    });
    return res.isConfirmed;
};

const getCur = (p: Product, key: "l" | "xl" | "xxl") => p.stock?.[key]?.current ?? 0;
const getInit = (p: Product, key: "l" | "xl" | "xxl") => p.stock?.[key]?.initial ?? 0;

function calcProductsRevenueILS(products: Product[]) {
    let soldUnits = 0;
    let revenue = 0;

    for (const p of products) {
        if (!p.stock) continue;
        const keys: Array<"l" | "xl" | "xxl"> = ["l", "xl", "xxl"];
        const soldForProduct = keys.reduce((sum, k) => {
            const init = getInit(p, k);
            const cur = getCur(p, k);
            return sum + Math.max(0, init - cur);
        }, 0);

        soldUnits += soldForProduct;
        const price = Number(p.price) || 0;
        revenue += soldForProduct * price;
    }

    return { soldUnits, revenue };
}

export function useAdminPanel(apiBase: string) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [imagesByCategory, setImagesByCategory] = useState<Record<string, string[]>>({});
    const [canvases, setCanvases] = useState<CanvasItem[]>([]);

    const refreshAll = useCallback(async () => {
        try {
            setLoading(true);

            const [productsRes, ...sketchRes] = await Promise.all([
                axios.get<Product[]>(`${apiBase}/products`),
                ...SKETCH_CATEGORIES.map((cat) => axios.get(`${apiBase}/gallery/${cat}`)),
            ]);

            const results: Record<string, string[]> = {};
            SKETCH_CATEGORIES.forEach((cat, idx) => {
                const data = sketchRes[idx].data;
                results[cat] = Array.isArray(data) ? data : [];
            });

            setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
            setImagesByCategory(results);

            try {
                const canvasesRes = await axios.get<CanvasItem[]>(`${apiBase}/canvases`);
                setCanvases(Array.isArray(canvasesRes.data) ? canvasesRes.data : []);
            } catch {
                setCanvases([]);
            }
        } catch {
            toast("error", "שגיאה", "נכשל לטעון נתונים", 1600);
        } finally {
            setLoading(false);
        }
    }, [apiBase]);

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    const uploadSketch = useCallback(
        async (category: SketchCategory, file: File | null) => {
            if (!file) {
                toast("info", "חסר קובץ", "בחר תמונה להעלאה", 1400);
                return false;
            }

            const formData = new FormData();
            formData.append("image", file);

            try {
                await axios.post(`${apiBase}/gallery/upload/${category}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast("success", "עלה!", "הסקיצה הועלתה בהצלחה", 1400);
                await refreshAll();
                return true;
            } catch {
                toast("error", "שגיאה", "נכשל להעלות סקיצה", 1600);
                return false;
            }
        },
        [apiBase, refreshAll]
    );

    const deleteSketch = useCallback(
        async (category: string, fileUrl: string) => {
            const filename = fileUrl.split("/").pop();
            const ok = await confirmDanger("למחוק את הסקיצה?", "הפעולה בלתי הפיכה.");
            if (!ok) return false;

            try {
                await axios.delete(`${apiBase}/gallery/${category}/${filename}`);
                setImagesByCategory((prev) => ({
                    ...prev,
                    [category]: (prev[category] || []).filter((img) => img !== fileUrl),
                }));
                toast("success", "נמחק", undefined, 1100);
                return true;
            } catch {
                toast("error", "שגיאה", "נכשל למחוק סקיצה", 1600);
                return false;
            }
        },
        [apiBase]
    );

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
            const { title, price, description, image, stockL, stockXL, stockXXL } = payload;

            if (!title.trim() || !price.trim() || !image) {
                toast("info", "חסר מידע", "שם מוצר, מחיר ותמונה הם חובה", 1600);
                return { ok: false as const };
            }

            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("price", price.trim());
            formData.append("image", image);

            if (description?.trim()) formData.append("description", description.trim());
            if (stockL !== undefined && stockL !== "") formData.append("stockL", stockL);
            if (stockXL !== undefined && stockXL !== "") formData.append("stockXL", stockXL);
            if (stockXXL !== undefined && stockXXL !== "") formData.append("stockXXL", stockXXL);

            try {
                const res = await axios.post<Product>(`${apiBase}/products/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setProducts((prev) => [res.data, ...prev]);
                toast("success", "הועלה!", "המוצר נוסף בהצלחה", 1400);
                return { ok: true as const, product: res.data };
            } catch {
                toast("error", "שגיאה", "נכשל להעלות מוצר", 1600);
                return { ok: false as const };
            }
        },
        [apiBase]
    );

    const deleteProduct = useCallback(
        async (id: string) => {
            const ok = await confirmDanger("למחוק את המוצר?", "הפעולה בלתי הפיכה.");
            if (!ok) return false;

            try {
                await axios.delete(`${apiBase}/products/${id}`);
                setProducts((prev) => prev.filter((p) => p._id !== id));
                toast("success", "נמחק", undefined, 1100);
                return true;
            } catch {
                toast("error", "שגיאה", "נכשל למחוק מוצר", 1600);
                return false;
            }
        },
        [apiBase]
    );

    const uploadCanvas = useCallback(
        async (payload: { name: string; size: CanvasSize; image: File | null }) => {
            const { name, size, image } = payload;

            if (!name.trim() || !image) {
                toast("info", "חסר מידע", "שם קאנבס ותמונה הם חובה", 1600);
                return { ok: false as const };
            }

            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("size", size);
            formData.append("image", image);

            try {
                const res = await axios.post<CanvasItem>(`${apiBase}/canvases/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setCanvases((prev) => [res.data, ...prev]);
                toast("success", "הועלה!", "הקאנבס נוסף בהצלחה", 1400);
                return { ok: true as const, canvas: res.data };
            } catch {
                toast("error", "שגיאה", "נכשל להעלות קאנבס", 1600);
                return { ok: false as const };
            }
        },
        [apiBase]
    );

    const deleteCanvas = useCallback(
        async (id: string) => {
            const ok = await confirmDanger("למחוק את הקאנבס?", "הפעולה בלתי הפיכה.");
            if (!ok) return false;

            try {
                await axios.delete(`${apiBase}/canvases/${id}`);
                setCanvases((prev) => prev.filter((c) => c._id !== id));
                toast("success", "נמחק", undefined, 1100);
                return true;
            } catch {
                toast("error", "שגיאה", "נכשל למחוק קאנבס", 1600);
                return false;
            }
        },
        [apiBase]
    );

    const patchProductInState = useCallback((updated: Product) => {
        setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    }, []);

    const outOfStockCount = useMemo(() => {
        return products.filter((p) => {
            if (!p.stock) return false;
            const total = getCur(p, "l") + getCur(p, "xl") + getCur(p, "xxl");
            return total === 0;
        }).length;
    }, [products]);

    const totalSketches = useMemo(() => Object.values(imagesByCategory).reduce((sum, arr) => sum + arr.length, 0), [imagesByCategory]);

    const revenue = useMemo(() => calcProductsRevenueILS(products), [products]);

    const metrics = useMemo(
        () => ({
            productsCount: products.length,
            sketchesCount: totalSketches,
            canvasesCount: canvases.length,
            outOfStockCount,
            productsSoldUnits: revenue.soldUnits,
            productsRevenueILS: revenue.revenue,
        }),
        [products.length, totalSketches, canvases.length, outOfStockCount, revenue]
    );

    return {
        loading,
        products,
        imagesByCategory,
        canvases,
        refreshAll,
        uploadSketch,
        deleteSketch,
        uploadProduct,
        deleteProduct,
        uploadCanvas,
        deleteCanvas,
        patchProductInState,
        metrics,
    };
}
