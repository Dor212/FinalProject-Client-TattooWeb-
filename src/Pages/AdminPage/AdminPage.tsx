import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../../Types/TProduct";
import StockEditorModal from "../../components/admin/StockEditorModal";
import AdminHeader from "./Sections/AdminHeader";
import AdminKpis from "./Sections/AdminKpis";
import AdminTabs from "./Sections/AdminTabs";
import ProductsSection from "./Sections/ProductsSection";
import CanvasesSection from "./Sections/CanvasesSection";
import SketchesSection from "./Sections/SketchesSection";
import type { AdminTab, SketchCategory } from "./Sections/types";
import { SKETCH_CATEGORIES } from "./Sections/types";
import { useAdminPanel } from "./hooks/useAdminPanel";

const AdminPage = () => {
    const apiBase = import.meta.env.VITE_API_URL as string;

    const [tab, setTab] = useState<AdminTab>("products");
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const {
        loading,
        products,
        canvases,
        sketchesByCategory,
        refreshAll,
        uploadCanvas,
        deleteCanvas,
        uploadSketch,
        deleteSketch,
    } = useAdminPanel(apiBase);

    const openStockEditor = (p: Product) => {
        setSelectedProduct(p);
        setStockModalOpen(true);
    };

    const sketchesCount = useMemo(() => {
        return SKETCH_CATEGORIES.reduce((sum, cat) => sum + (sketchesByCategory?.[cat]?.length || 0), 0);
    }, [sketchesByCategory]);

    return (
        <div
            dir="rtl"
            className="min-h-[100svh] pt-24 pb-16 px-4 font-serif text-[#1E1E1E]"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="mx-auto max-w-7xl">
                <AdminHeader onRefresh={refreshAll} />

                <div className="grid gap-4 mt-10 sm:grid-cols-3">
                    <AdminKpis
                        productsCount={products.length}
                        productsRevenueILS={products.reduce((sum, p) => sum + (p.price || 0), 0)}
                        sketchesCount={sketchesCount}
                        canvasesCount={canvases.length}
                    />
                </div>

                <div className="mt-8">
                    <AdminTabs value={tab} onChange={setTab} />
                </div>

                <AnimatePresence mode="wait">
                    {tab === "products" && (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 14 }}
                            transition={{ duration: 0.35 }}
                            className="mt-8"
                        >
                            <ProductsSection
                                loading={loading}
                                products={products}
                                onUpload={() => Promise.resolve({ ok: false })}
                                onDelete={() => Promise.resolve(false)}
                                onOpenStock={openStockEditor}
                            />
                        </motion.div>
                    )}

                    {tab === "sketches" && (
                        <motion.div
                            key="sketches"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 14 }}
                            transition={{ duration: 0.35 }}
                            className="mt-8"
                        >
                            <SketchesSection
                                apiBase={apiBase}
                                loading={loading}
                                imagesByCategory={sketchesByCategory as Record<SketchCategory, string[]>}
                                onUpload={uploadSketch}
                                onDelete={deleteSketch}
                            />
                        </motion.div>
                    )}

                    {tab === "canvases" && (
                        <motion.div
                            key="canvases"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 14 }}
                            transition={{ duration: 0.35 }}
                            className="mt-8"
                        >
                            <CanvasesSection
                                loading={loading}
                                canvases={canvases}
                                onUpload={uploadCanvas}
                                onDelete={deleteCanvas}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {selectedProduct && (
                    <StockEditorModal
                        open={stockModalOpen}
                        onClose={() => setStockModalOpen(false)}
                        product={selectedProduct}
                        apiBase={apiBase}
                        onUpdated={() => {
                            refreshAll();
                            setStockModalOpen(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminPage;
