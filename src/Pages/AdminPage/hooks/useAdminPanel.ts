import { useCallback, useEffect, useState } from "react";
import axios from "../../../Services/axiosInstance";
import type { Product } from "../../../Types/TProduct";
import type { CanvasItem, CanvasSize, SketchCategory } from "../Sections/types";
import { SKETCH_CATEGORIES } from "../Sections/types";
import { toast, getHttpErrorMessage } from "../../../Services/toast";

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

const extractFilenameFromUrl = (url: string) => {
    const clean = String(url || "").split("?")[0];
    const parts = clean.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "";
};

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
                const normalized: SketchesMap = emptySketches();
                const data = sketchesRes.data;

                for (const cat of SKETCH_CATEGORIES) {
                    normalized[cat] = Array.isArray(data?.[cat]) ? data[cat] : [];
                }

                return normalized;
            });
        } catch (err: unknown) {
            toast.error("שגיאה בטעינת נתונים", getHttpErrorMessage(err, "נסה לרענן"));
            setProducts([]);
            setCanvases([]);
            setSketchesByCategory(emptySketches());
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

      const res = await axios.post<Product>(`${apiBase}/products/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts((prev) => [res.data, ...prev]);
      toast.success("המוצר הועלה", undefined, 1200);
      return { ok: true as const };
    } catch (err: unknown) {
      toast.error("שגיאה בהעלאת מוצר", getHttpErrorMessage(err, "נסה שוב"));
      return { ok: false as const };
    }
  },
  [apiBase]
);

    const deleteProduct = useCallback(
        async (id: string) => {
            try {
                await axios.delete(`${apiBase}/products/${id}`);
                setProducts((prev) => prev.filter((p) => p._id !== id));
                toast.success("המוצר נמחק", undefined, 1100);
                return true;
            } catch (err: unknown) {
                toast.error("שגיאה במחיקת מוצר", getHttpErrorMessage(err, "נסה שוב"));
                return false;
            }
        },
        [apiBase]
    );

   const uploadCanvas = useCallback(
  async (payload: {
    name: string;
    size: CanvasSize;
    image: File | null;
    variants?: UploadCanvasVariant[];
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("size", payload.size);
      if (payload.image) formData.append("image", payload.image);

      const variantsMeta: Array<{ id: string; color: string; label?: string }> = [];
      const variantImageIds: string[] = [];

      if (payload.variants?.length) {
        for (const v of payload.variants) {
          if (!v.image) continue;

          formData.append("variantImages", v.image);
          variantsMeta.push({
            id: v.id,
            color: v.color,
            label: v.label || "",
          });
          variantImageIds.push(v.id);
        }
      }

      if (variantsMeta.length > 0) {
        formData.append("variants", JSON.stringify(variantsMeta));
        formData.append("variantImageIds", JSON.stringify(variantImageIds));
      }

      const res = await axios.post<CanvasItem>(`${apiBase}/canvases/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCanvases((prev) => [res.data, ...prev]);
      toast.success("הקאנבס הועלה", undefined, 1200);
      return { ok: true as const };
    } catch (err: unknown) {
      toast.error("שגיאה בהעלאת קאנבס", getHttpErrorMessage(err, "נסה שוב"));
      return { ok: false as const };
    }
  },
  [apiBase]
);

    const deleteCanvas = useCallback(
        async (id: string) => {
            try {
                await axios.delete(`${apiBase}/canvases/${id}`);
                setCanvases((prev) => prev.filter((c) => c._id !== id));
                toast.success("הקאנבס נמחק", undefined, 1100);
                return true;
            } catch (err: unknown) {
                toast.error("שגיאה במחיקת קאנבס", getHttpErrorMessage(err, "נסה שוב"));
                return false;
            }
        },
        [apiBase]
    );

    const uploadSketch = useCallback(
        async (category: SketchCategory, file: File | null): Promise<boolean> => {
            try {
                if (!file) return false;

                const fd = new FormData();
                fd.append("image", file);

                const res = await axios.post<{ ok: boolean; imageUrl: string }>(`${apiBase}/sketches/${category}`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                const url = res.data?.imageUrl;
                if (!url) return false;

                setSketchesByCategory((prev) => ({
                    ...prev,
                    [category]: [url, ...(prev[category] || [])],
                }));

                toast.success("הסקיצה הועלתה", undefined, 1200);
                return true;
            } catch (err: unknown) {
                toast.error("שגיאה בהעלאת סקיצה", getHttpErrorMessage(err, "נסה שוב"));
                return false;
            }
        },
        [apiBase]
    );

    const deleteSketch = useCallback(
        async (category: SketchCategory, fileUrl: string): Promise<boolean> => {
            try {
                const filename = extractFilenameFromUrl(fileUrl);
                if (!filename) {
                    toast.error("שם קובץ לא תקין");
                    return false;
                }

                await axios.delete(`${apiBase}/sketches/${category}/${encodeURIComponent(filename)}`);

                setSketchesByCategory((prev) => ({
                    ...prev,
                    [category]: (prev[category] || []).filter((u) => u !== fileUrl),
                }));

                toast.success("הסקיצה נמחקה", undefined, 1100);
                return true;
            } catch (err: unknown) {
                toast.error("שגיאה במחיקת סקיצה", getHttpErrorMessage(err, "נסה שוב"));
                return false;
            }
        },
        [apiBase]
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
