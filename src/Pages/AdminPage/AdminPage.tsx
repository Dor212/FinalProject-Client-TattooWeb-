import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAdminPanel } from "./hooks/useAdminPanel";
import ProductsSection from "./Sections/ProductsSection";
import CanvasesSection from "./Sections/CanvasesSection";
import SketchesSection from "./Sections/SketchesSection";
import type { SketchCategory } from "./Sections/types";
import { SKETCH_CATEGORIES } from "./Sections/types";
import { Product } from "../../Types/TProduct";

type Env = {
    VITE_API_URL: string;
};

const AdminPage = () => {
    const { VITE_API_URL } = import.meta.env as unknown as Env;
    const apiBase = VITE_API_URL;

    const {
        loading,
        products,
        canvases,
        sketchesByCategory,
        uploadProduct,
        deleteProduct,
        uploadCanvas,
        deleteCanvas,
        uploadSketch,
        deleteSketch,
        refreshAll,
    } = useAdminPanel(apiBase);

    const [activeTab, setActiveTab] = useState<"products" | "canvases" | "sketches">("products");

    const normalizedSketches = useMemo(() => {
        const out: Record<SketchCategory, string[]> = { small: [], medium: [], large: [] };
        for (const c of SKETCH_CATEGORIES) out[c] = sketchesByCategory?.[c] ?? [];
        return out;
    }, [sketchesByCategory]);

    const onUploadSketch = async (category: SketchCategory, file: File | null): Promise<boolean> => {
        return await uploadSketch(category, file);
    };

    const onDeleteSketch = async (category: SketchCategory, fileUrl: string): Promise<boolean> => {
        return await deleteSketch(category, fileUrl);
    };

    return (
        <div dir="rtl" className="min-h-[100svh] bg-[#F6F1E8] text-[#1E1E1E]">
            <Helmet>
                <title>Admin Panel</title>
            </Helmet>

            <div className="px-4 py-8 mx-auto max-w-7xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center sm:text-start">
                        <div className="text-2xl font-extrabold text-[#3B3024]">Admin Panel</div>
                        <div className="mt-1 text-sm text-[#1E1E1E]/65">
                            ניהול מוצרים, קאנבסים וסקיצות.
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={refreshAll}
                        className="inline-flex items-center justify-center rounded-2xl border border-[#B9895B]/18 bg-white/55 px-5 py-3 text-sm font-extrabold text-[#3B3024] hover:bg-white/70"
                    >
                        רענון
                    </button>
                </div>

                <div className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-[#B9895B]/14 bg-white/40 p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab("products")}
                        className={[
                            "w-full rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                            activeTab === "products" ? "bg-[#B9895B] text-white" : "text-[#1E1E1E]/70 hover:bg-white/60",
                        ].join(" ")}
                    >
                        מוצרים
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("canvases")}
                        className={[
                            "w-full rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                            activeTab === "canvases" ? "bg-[#B9895B] text-white" : "text-[#1E1E1E]/70 hover:bg-white/60",
                        ].join(" ")}
                    >
                        קאנבסים
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("sketches")}
                        className={[
                            "w-full rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                            activeTab === "sketches" ? "bg-[#B9895B] text-white" : "text-[#1E1E1E]/70 hover:bg-white/60",
                        ].join(" ")}
                    >
                        סקיצות
                    </button>
                </div>

                <div className="mt-6">
                    {activeTab === "products" && (
                        <ProductsSection
                            loading={loading}
                            products={products}
                            onUpload={uploadProduct}
                            onDelete={deleteProduct}
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onOpenStock={(_p: Product) => {
                                throw new Error("Function not implemented.");
                            } }                        />
                    )}

                    {activeTab === "canvases" && (
                        <CanvasesSection
                            loading={loading}
                            canvases={canvases}
                            onUpload={uploadCanvas}
                            onDelete={deleteCanvas}
                        />
                    )}

                    {activeTab === "sketches" && (
                        <SketchesSection
                            loading={loading}
                            imagesByCategory={normalizedSketches}
                            onUpload={onUploadSketch}
                            onDelete={onDeleteSketch}
                            apiBase={apiBase}                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
