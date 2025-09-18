import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import type { Product } from "../../Types/TProduct";

const SkeletonCard = () => (
    <div className="relative flex flex-col items-center p-3 bg-white/70 rounded-xl border border-[#e4d3a1] shadow-sm">
        <div className="w-full rounded-lg aspect-square bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        <div className="h-4 mt-3 bg-gray-200 rounded w-28 animate-pulse" />
    </div>
);

const AllProductsPage = () => {
    const { VITE_API_URL } = import.meta.env;
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError("");
            try {
                const { data } = await axios.get<Product[]>(`${VITE_API_URL}/products`);
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("❌ Failed to fetch products:", err);
                setError("נכשל לטעון מוצרים");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [VITE_API_URL]);

    const hasProducts = useMemo(() => products.length > 0, [products]);

    return (
        <div
            className="min-h-screen pb-12 pt-28"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="max-w-6xl px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F1F3C2] drop-shadow">
                        ALL PRODUCTS
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-3 py-2 text-sm rounded-lg bg-white/80 text-[#3B3024] border border-[#e4d3a1] hover:bg-white transition"
                        >
                            חזרה
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-3 py-2 text-sm rounded-lg bg-[#F1F3C2] text-[#3B3024] border border-transparent hover:opacity-90 transition"
                        >
                            דף הבית
                        </button>
                    </div>
                </div>

                {/* Subtitle */}
                <p className="text-[#3B3024] text-base sm:text-lg text-center mb-6">
                    כל המוצרים של עומר – בחרו מוצר ולחצו לרכישה
                </p>

                {/* Divider */}
                <hr className="w-24 h-1 mx-auto mb-10 bg-[#F1F3C2] rounded-full border-0" />

                {/* States */}
                {loading && (
                    <div
                        className="grid gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
                    >
                        {Array.from({ length: 9 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="p-4 text-center text-red-700 border border-red-200 bg-red-50/70 rounded-xl">
                        {error}
                    </div>
                )}

                {!loading && !error && !hasProducts && (
                    <div className="text-center text-[#3B3024] bg-white/70 border border-[#e4d3a1] rounded-xl p-6">
                        עדיין אין מוצרים להצגה.
                    </div>
                )}

                
                {!loading && !error && hasProducts && (
                    <div
                        className="grid gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
                    >
                        {products.map((p, index) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                className="group relative flex flex-col items-center p-3 bg-white/80 rounded-xl border border-[#e4d3a1] shadow-sm hover:shadow-lg transition"
                            >
                                <div className="relative w-full overflow-hidden rounded-lg aspect-square">
                                    <img
                                        src={p.imageUrl}
                                        alt={p.title}
                                        loading="lazy"
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Overlay + CTA */}
                                    <div className="absolute inset-0 transition-colors bg-black/0 group-hover:bg-black/15" />
                                    <motion.button
                                        onClick={() => navigate("/", { state: { scrollTo: "shop" } })}
                                        whileHover={{ scale: 1.04 }}
                                        className="absolute left-1/2 -translate-x-1/2 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-sm rounded-full bg-[#97BE5A] text-white shadow"
                                    >
                                        לרכישה
                                    </motion.button>
                                </div>

                                {/* Caption */}
                                <h2 className="mt-3 text-sm font-semibold text-[#3B3024] text-center">
                                    {p.title}
                                </h2>
                                <p className="text-xs text-[#8b7c4a] mt-1">{Number(p.price).toFixed(2)} ₪</p>
                                {p.description && (
                                    <p className="text-xs text-[#5b4c33] mt-1 line-clamp-2 text-center">
                                        {p.description}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProductsPage;
