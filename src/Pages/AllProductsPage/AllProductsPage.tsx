import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import type { Product } from "../../Types/TProduct";

const SkeletonCard = () => (
    <div className="relative flex flex-col items-center p-3 rounded-2xl border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_14px_40px_rgba(30,30,30,0.12)]">
        <div className="w-full rounded-xl aspect-square bg-gradient-to-br from-gray-100/80 to-gray-200/80 animate-pulse" />
        <div className="h-4 mt-3 rounded bg-gray-200/80 w-28 animate-pulse" />
        <div className="w-20 h-3 mt-2 rounded bg-gray-200/70 animate-pulse" />
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
        <div dir="rtl" className="min-h-[100svh] pt-28 pb-14">
            <div className="max-w-6xl px-4 mx-auto">
                <div className="relative overflow-hidden rounded-[28px] border border-[#B9895B]/18 bg-white/25 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.16)]">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_10%,rgba(185,137,91,0.16),transparent_55%),radial-gradient(circle_at_85%_90%,rgba(232,217,194,0.30),transparent_58%)]" />

                    <div className="relative px-6 sm:px-8 pt-7 pb-6 border-b border-[#B9895B]/15">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-[#1E1E1E]">
                                    כל המוצרים
                                </h1>
                                <p className="mt-2 text-sm sm:text-base text-[#1E1E1E]/70">
                                    כל המוצרים של עומר, בחרו מוצר ולחצו לרכישה
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 text-sm rounded-xl border border-[#B9895B]/20 bg-white/35 backdrop-blur-md text-[#1E1E1E] shadow-sm transition hover:bg-white/50 active:bg-white/45 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                                >
                                    חזרה
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="px-4 py-2 text-sm rounded-xl border border-[#B9895B]/18 bg-[#B9895B] text-white shadow-sm transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                                >
                                    דף הבית
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <div className="h-[3px] w-24 rounded-full bg-[#B9895B]/70" />
                        </div>
                    </div>

                    <div className="relative px-5 sm:px-8 py-7">
                        {loading && (
                            <div
                                className="grid gap-5"
                                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}
                            >
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        )}

                        {!loading && error && (
                            <div className="p-4 text-center text-red-700 border border-red-200 rounded-2xl bg-red-50/70">
                                {error}
                            </div>
                        )}

                        {!loading && !error && !hasProducts && (
                            <div className="text-center rounded-2xl border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl p-6 text-[#1E1E1E]/80">
                                עדיין אין מוצרים להצגה.
                            </div>
                        )}

                        {!loading && !error && hasProducts && (
                            <div
                                className="grid gap-5"
                                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}
                            >
                                {products.map((p, index) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(index * 0.035, 0.35) }}
                                        className="group relative overflow-hidden rounded-2xl border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_14px_40px_rgba(30,30,30,0.12)] transition hover:shadow-[0_22px_70px_rgba(30,30,30,0.16)]"
                                    >
                                        <div className="relative w-full overflow-hidden aspect-square">
                                            <img
                                                src={p.imageUrl}
                                                alt={p.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                            />

                                            <div className="absolute inset-0 transition-colors bg-black/0 group-hover:bg-black/20" />

                                            <motion.button
                                                type="button"
                                                onClick={() => navigate("/", { state: { scrollTo: "shop" } })}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.99 }}
                                                className="absolute left-1/2 -translate-x-1/2 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 text-sm rounded-full bg-[#B9895B] text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                                            >
                                                לרכישה
                                            </motion.button>
                                        </div>

                                        <div className="p-4 text-center">
                                            <h2 className="text-sm font-semibold text-[#1E1E1E]">
                                                {p.title}
                                            </h2>
                                            <p className="mt-1 text-xs text-[#1E1E1E]/70">
                                                {Number(p.price).toLocaleString("he-IL")} ₪
                                            </p>

                                            {p.description && (
                                                <p className="mt-2 text-xs text-[#1E1E1E]/70 line-clamp-2">
                                                    {p.description}
                                                </p>
                                            )}

                                            <div className="flex justify-center mt-3">
                                                <div className="h-px w-16 bg-[#B9895B]/30" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-[#1E1E1E]/55">
                    התמונות והמחירים מוצגים בהתאם למלאי הזמין.
                </div>
            </div>
        </div>
    );
};

export default AllProductsPage;
