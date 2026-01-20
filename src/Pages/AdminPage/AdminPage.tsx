import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../../Types/TProduct";
import StockEditorModal from "../../components/admin/StockEditorModal";
import AdminHeader from "./Sections/AdminHeader";
import AdminKpis from "./Sections/AdminKpis";
import AdminTabs from "./Sections/AdminTabs";
import ProductsSection from "./Sections/ProductsSection";
import SketchesSection from "./Sections/SketchesSection";
import CanvasesSection from "./Sections/CanvasesSection";
import type { AdminTab } from "./Sections/types";
import { useAdminPanel } from "./hooks/useAdminPanel";

const AdminPage = () => {
    const apiBase = import.meta.env.VITE_API_URL as string;

    const [tab, setTab] = useState<AdminTab>("products");
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const {
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
    } = useAdminPanel(apiBase);

    const openStockEditor = (p: Product) => {
        setSelectedProduct(p);
        setStockModalOpen(true);
    };

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
                        productsCount={metrics.productsCount}
                        productsRevenueILS={metrics.productsRevenueILS}
                        sketchesCount={metrics.sketchesCount}
                        canvasesCount={metrics.canvasesCount}
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
                                onUpload={uploadProduct}
                                onDelete={deleteProduct}
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
                                imagesByCategory={imagesByCategory}
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
                        onUpdated={patchProductInState}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminPage;
