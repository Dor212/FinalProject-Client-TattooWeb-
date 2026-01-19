import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../../Types/TProduct";
import StockEditorModal from "../../components/admin/StockEditorModal";
import AdminHeader from "./Sections/AdminHeader";
import AdminKpis from "./Sections/AdminKpis";
import AdminTabs from "./Sections/AdminTabs";
import ProductsSection from "./Sections/ProductsSection";
import SketchesSection from "./Sections/SketchesSection";
import CanvasesSection from "./Sections/CanvasesSection";
import type { AdminTab, CanvasItem, CanvasSize, SketchCategory } from "../AdminPage/Sections/types";
import { SKETCH_CATEGORIES } from "./Sections/types";

const AdminPage = () => {
    const VITE_API_URL = import.meta.env.VITE_API_URL as string;

    const [tab, setTab] = useState<AdminTab>("products");
    const [loading, setLoading] = useState(true);

    const [imagesByCategory, setImagesByCategory] = useState<Record<string, string[]>>({});
    const [selectedCategory, setSelectedCategory] = useState<SketchCategory>("small");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [productTitle, setProductTitle] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productImage, setProductImage] = useState<File | null>(null);
    const [stockL, setStockL] = useState("");
    const [stockXL, setStockXL] = useState("");
    const [stockXXL, setStockXXL] = useState("");
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const [canvasName, setCanvasName] = useState("");
    const [canvasSize, setCanvasSize] = useState<CanvasSize>("80×25");
    const [canvasImage, setCanvasImage] = useState<File | null>(null);
    const [canvases, setCanvases] = useState<CanvasItem[]>([]);

    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const getCur = (p: Product, key: "l" | "xl" | "xxl") => p.stock?.[key]?.current ?? 0;
    const getInit = (p: Product, key: "l" | "xl" | "xxl") => p.stock?.[key]?.initial ?? 0;

    const outOfStockCount = useMemo(() => {
        return allProducts.filter((p) => {
            if (!p.stock) return false;
            const total = getCur(p, "l") + getCur(p, "xl") + getCur(p, "xxl");
            return total === 0;
        }).length;
    }, [allProducts]);

    const totalSketches = useMemo(() => {
        return Object.values(imagesByCategory).reduce((sum, arr) => sum + arr.length, 0);
    }, [imagesByCategory]);

    const refreshAll = async () => {
        try {
            setLoading(true);

            const [productsRes, ...sketchRes] = await Promise.all([
                axios.get<Product[]>(`${VITE_API_URL}/products`),
                ...SKETCH_CATEGORIES.map((cat) => axios.get(`${VITE_API_URL}/gallery/${cat}`)),
            ]);

            const results: Record<string, string[]> = {};
            SKETCH_CATEGORIES.forEach((cat, idx) => {
                const data = sketchRes[idx].data;
                results[cat] = Array.isArray(data) ? data : [];
            });

            setAllProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
            setImagesByCategory(results);

            try {
                const canvasesRes = await axios.get<CanvasItem[]>(`${VITE_API_URL}/canvases`);
                setCanvases(Array.isArray(canvasesRes.data) ? canvasesRes.data : []);
            } catch {
                setCanvases([]);
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "שגיאה",
                text: "נכשל לטעון נתונים",
                timer: 1600,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshAll();
    }, [VITE_API_URL]);

    const openStockEditor = (p: Product) => {
        setSelectedProduct(p);
        setStockModalOpen(true);
    };

    const handleProductPatched = (updated: Product) => {
        setAllProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    };

    const handleUploadSketch = async () => {
        if (!imageFile) {
            Swal.fire({
                icon: "info",
                title: "חסר קובץ",
                text: "בחר תמונה להעלאה",
                timer: 1400,
                showConfirmButton: false,
            });
            return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            await axios.post(`${VITE_API_URL}/gallery/upload/${selectedCategory}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setImageFile(null);

            Swal.fire({
                icon: "success",
                title: "עלה!",
                text: "הסקיצה הועלתה בהצלחה",
                timer: 1400,
                showConfirmButton: false,
            });

            await refreshAll();
        } catch {
            Swal.fire({
                icon: "error",
                title: "שגיאה",
                text: "נכשל להעלות סקיצה",
                timer: 1600,
                showConfirmButton: false,
            });
        }
    };

    const handleDeleteSketch = async (category: string, fileUrl: string) => {
        const filename = fileUrl.split("/").pop();

        const confirmed = await Swal.fire({
            title: "למחוק את הסקיצה?",
            text: "הפעולה בלתי הפיכה.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#c0392b",
            cancelButtonColor: "#999",
            confirmButtonText: "כן, למחוק",
            cancelButtonText: "ביטול",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axios.delete(`${VITE_API_URL}/gallery/${category}/${filename}`);
            setImagesByCategory((prev) => ({
                ...prev,
                [category]: (prev[category] || []).filter((img) => img !== fileUrl),
            }));
            Swal.fire({ icon: "success", title: "נמחק", timer: 1100, showConfirmButton: false });
        } catch {
            Swal.fire({
                icon: "error",
                title: "שגיאה",
                text: "נכשל למחוק סקיצה",
                timer: 1600,
                showConfirmButton: false,
            });
        }
    };

    const handleProductUpload = async () => {
        if (!productTitle.trim() || !productPrice.trim() || !productImage) {
            Swal.fire({
                icon: "info",
                title: "חסר מידע",
                text: "שם מוצר, מחיר ותמונה הם חובה",
                timer: 1600,
                showConfirmButton: false,
            });
            return;
        }

        const formData = new FormData();
        formData.append("title", productTitle.trim());
        formData.append("price", productPrice.trim());
        formData.append("image", productImage);

        if (productDescription.trim() !== "") formData.append("description", productDescription.trim());
        if (stockL !== "") formData.append("stockL", stockL);
        if (stockXL !== "") formData.append("stockXL", stockXL);
        if (stockXXL !== "") formData.append("stockXXL", stockXXL);

        try {
            const res = await axios.post<Product>(`${VITE_API_URL}/products/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProductTitle("");
            setProductPrice("");
            setProductDescription("");
            setStockL("");
            setStockXL("");
            setStockXXL("");
            setProductImage(null);

            setAllProducts((prev) => [res.data, ...prev]);

            Swal.fire({
                icon: "success",
                title: "הועלה!",
                text: "המוצר נוסף בהצלחה",
                timer: 1400,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "שגיאה",
                text: "נכשל להעלות מוצר",
                timer: 1600,
                showConfirmButton: false,
            });
        }
    };

    const handleProductDelete = async (id: string) => {
        const confirmed = await Swal.fire({
            title: "למחוק את המוצר?",
            text: "הפעולה בלתי הפיכה.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#c0392b",
            cancelButtonColor: "#999",
            confirmButtonText: "כן, למחוק",
            cancelButtonText: "ביטול",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axios.delete(`${VITE_API_URL}/products/${id}`);
            setAllProducts((prev) => prev.filter((p) => p._id !== id));
            Swal.fire({ icon: "success", title: "נמחק", timer: 1100, showConfirmButton: false });
        } catch {
            Swal.fire({
                icon: "error",
                title: "שגיאה",
                text: "נכשל למחוק מוצר",
                timer: 1600,
                showConfirmButton: false,
            });
        }
    };

    const handleCanvasUpload = async () => {
        if (!canvasName.trim() || !canvasImage) {
            Swal.fire({
                icon: "info",
                title: "חסר מידע",
                text: "שם קאנבס ותמונה הם חובה",
                timer: 1600,
                showConfirmButton: false,
            });
            return;
        }

        const formData = new FormData();
        formData.append("name", canvasName.trim());
        formData.append("size", canvasSize);
        formData.append("image", canvasImage);

        try {
            const res = await axios.post<CanvasItem>(`${VITE_API_URL}/canvases/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setCanvasName("");
            setCanvasSize("80×25");
            setCanvasImage(null);

            setCanvases((prev) => [res.data, ...prev]);

            Swal.fire({
                icon: "success",
                title: "הועלה!",
                text: "הקאנבס נוסף בהצלחה",
                timer: 1400,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "שגיאה",
                text: "נכשל להעלות קאנבס",
                timer: 1600,
                showConfirmButton: false,
            });
        }
    };

    const handleCanvasDelete = async (id: string) => {
        const confirmed = await Swal.fire({
            title: "למחוק את הקאנבס?",
            text: "הפעולה בלתי הפיכה.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#c0392b",
            cancelButtonColor: "#999",
            confirmButtonText: "כן, למחוק",
            cancelButtonText: "ביטול",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axios.delete(`${VITE_API_URL}/canvases/${id}`);
            setCanvases((prev) => prev.filter((c) => c._id !== id));
            Swal.fire({ icon: "success", title: "נמחק", timer: 1100, showConfirmButton: false });
        } catch {
            Swal.fire({
                icon: "error",
                title: "שגיאה",
                text: "נכשל למחוק קאנבס",
                timer: 1600,
                showConfirmButton: false,
            });
        }
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
                        totalProducts={allProducts.length}
                        outOfStockCount={outOfStockCount}
                        totalSketches={totalSketches}
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
                                products={allProducts}
                                productTitle={productTitle}
                                setProductTitle={setProductTitle}
                                productPrice={productPrice}
                                setProductPrice={setProductPrice}
                                productDescription={productDescription}
                                setProductDescription={setProductDescription}
                                productImage={productImage}
                                setProductImage={setProductImage}
                                stockL={stockL}
                                setStockL={setStockL}
                                stockXL={stockXL}
                                setStockXL={setStockXL}
                                stockXXL={stockXXL}
                                setStockXXL={setStockXXL}
                                onUpload={handleProductUpload}
                                onDelete={handleProductDelete}
                                onOpenStock={openStockEditor}
                                getCur={getCur}
                                getInit={getInit}
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
                                apiBase={VITE_API_URL}
                                loading={loading}
                                imagesByCategory={imagesByCategory}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                imageFile={imageFile}
                                setImageFile={setImageFile}
                                onUpload={handleUploadSketch}
                                onDelete={handleDeleteSketch}
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
                                canvasName={canvasName}
                                setCanvasName={setCanvasName}
                                canvasSize={canvasSize}
                                setCanvasSize={setCanvasSize}
                                canvasImage={canvasImage}
                                setCanvasImage={setCanvasImage}
                                onUpload={handleCanvasUpload}
                                onDelete={handleCanvasDelete}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {selectedProduct && (
                    <StockEditorModal
                        open={stockModalOpen}
                        onClose={() => setStockModalOpen(false)}
                        product={selectedProduct}
                        apiBase={VITE_API_URL}
                        onUpdated={handleProductPatched}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminPage;
