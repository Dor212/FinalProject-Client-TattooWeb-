import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const SkeletonTile = () => (
    <div className="relative overflow-hidden rounded-2xl border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_14px_40px_rgba(30,30,30,0.12)]">
        <div className="w-full aspect-square bg-gradient-to-br from-gray-100/80 to-gray-200/80 animate-pulse" />
        <div className="p-3">
            <div className="w-20 h-3 mx-auto rounded bg-gray-200/80 animate-pulse" />
        </div>
    </div>
);

type ApiImages = string[];

export default function GalleryPage() {
    const { VITE_API_URL } = import.meta.env;
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();

    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const title = useMemo(() => {
        const c = (category || "").toUpperCase();
        if (c === "SMALL") return "Small";
        if (c === "MEDIUM") return "Medium";
        if (c === "LARGE") return "Large";
        return c || "Gallery";
    }, [category]);

    useEffect(() => {
        let alive = true;

        const fetchImages = async () => {
            setLoading(true);
            setError("");
            try {
                const { data } = await axios.get<ApiImages>(`${VITE_API_URL}/gallery/${category}`);
                if (!alive) return;
                setImages(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching images:", err);
                if (!alive) return;
                setError("Failed to load images");
            } finally {
                // eslint-disable-next-line no-unsafe-finally
                if (!alive) return;
                setLoading(false);
            }
        };

        if (category) fetchImages();
        else {
            setImages([]);
            setLoading(false);
        }

        return () => {
            alive = false;
        };
    }, [VITE_API_URL, category]);

    const handleSketchClick = (sketchUrl: string) => {
        navigate("/apply-sketch", { state: { selectedSketch: sketchUrl } });
    };

    return (
        <div dir="rtl" className="min-h-[100svh] pt-28 pb-14 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-[28px] border border-[#B9895B]/18 bg-white/25 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.16)]">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_10%,rgba(185,137,91,0.16),transparent_55%),radial-gradient(circle_at_85%_90%,rgba(232,217,194,0.30),transparent_58%)]" />

                    <div className="relative px-6 sm:px-8 pt-7 pb-6 border-b border-[#B9895B]/15">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-[#1E1E1E]">
                                    {title} Gallery
                                </h1>
                                <p className="mt-2 text-sm sm:text-base text-[#1E1E1E]/70">
                                    בחר סקיצה מתוך הגלריה והתחל לעצב על הגוף שלך
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
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
                                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}
                            >
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <SkeletonTile key={i} />
                                ))}
                            </div>
                        )}

                        {!loading && error && (
                            <div className="p-4 text-center text-red-700 border border-red-200 rounded-2xl bg-red-50/70">
                                {error}
                            </div>
                        )}

                        {!loading && !error && images.length === 0 && (
                            <div className="text-center rounded-2xl border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl p-6 text-[#1E1E1E]/80">
                                עדיין אין סקיצות בקטגוריה הזו.
                            </div>
                        )}

                        {!loading && !error && images.length > 0 && (
                            <div
                                className="grid gap-5"
                                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}
                            >
                                {images.map((img, index) => {
                                    const fullUrl = `${VITE_API_URL}${img}`;
                                    return (
                                        <motion.button
                                            key={`${img}-${index}`}
                                            type="button"
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Math.min(index * 0.03, 0.35) }}
                                            onClick={() => handleSketchClick(fullUrl)}
                                            className="group relative overflow-hidden rounded-2xl border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_14px_40px_rgba(30,30,30,0.12)] transition hover:shadow-[0_22px_70px_rgba(30,30,30,0.16)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                                            aria-label={`בחר סקיצה ${index + 1}`}
                                            title="בחר סקיצה"
                                        >
                                            <div className="relative w-full overflow-hidden aspect-square">
                                                <img
                                                    src={fullUrl}
                                                    alt={`Sketch ${index + 1}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                                                />
                                                <div className="absolute inset-0 transition-colors bg-black/0 group-hover:bg-black/20" />
                                                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 text-xs rounded-full bg-[#B9895B] text-white shadow">
                                                    בחר סקיצה
                                                </div>
                                            </div>

                                            <div className="p-3 text-center">
                                                <div className="text-xs font-semibold text-[#1E1E1E]/85">
                                                    סקיצה {index + 1}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-[#1E1E1E]/55">
                    טיפ: לחיצה על סקיצה תפתח את כלי ההדמיה.
                </div>
            </div>
        </div>
    );
}
