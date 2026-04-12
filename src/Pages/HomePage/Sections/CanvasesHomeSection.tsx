import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "../../../Services/toast";
import { useCart } from "../../../components/context/CartContext";
import { useCanvases } from "../../CanvasesPage/hooks/useCanvases";
import type { CanvasItem } from "../../CanvasesPage/components/types";
import CanvasCard from "../../CanvasesPage/components/CanvasCard";

type Props = {
    onOpenCart: () => void;
};

export default function CanvasesHomeSection({ onOpenCart }: Props) {
    const navigate = useNavigate();
    const cart = useCart();

    const apiBase = import.meta.env.VITE_API_URL as string;
    const { loading, error, filtered } = useCanvases(apiBase);

    const previewItems = useMemo<CanvasItem[]>(() => filtered.slice(0, 2), [filtered]);

    const onAdd = (c: CanvasItem) => {
        const category =
            c.size === "80×25" ? "standard" : c.size === "50×40" ? "pair" : "triple";

        cart.addCanvas(
            {
                id: `canvas|${c._id}`,
                name: c.name,
                size: c.size,
                image: c.imageUrl,
                category,
            },
            1
        );

        onOpenCart();
        toast.success("נוסף", c.name, 850);
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="container relative px-4 pt-24 pb-24 mx-auto overflow-hidden text-center md:px-5 md:pt-28 md:pb-28"
            dir="rtl"
        >
            <div
                className="absolute inset-0 bg-[#B9895B]/60"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
                    maskImage:
                        "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
                }}
            />

            <div className="relative z-[2]">
                <div className="max-w-2xl mx-auto mb-8 md:mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1E1E1E]/10 bg-[#F6F1E8]/75 backdrop-blur-sm shadow-sm text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em] text-[#1E1E1E]/65">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B9895B]" />
                        Canvas Collection
                    </div>

                    <p className="mt-3 max-w-md mx-auto text-[13px] md:text-[14px] leading-[1.35] md:leading-[1.4] text-[#1E1E1E]/72">
                        קאנבסים עם נוכחות נקייה ומדויקת, כאלה שנותנים לתמונה עצמה את המקום
                        הנכון בחלל.
                    </p>

                    <div className="w-20 h-px mx-auto mt-4 bg-gradient-to-r from-transparent via-[#1E1E1E]/35 to-transparent" />
                </div>

                <div className="max-w-6xl mx-auto">
                    {loading && (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-[clamp(320px,48svh,480px)] rounded-[28px] bg-white/18 border border-[#B9895B]/14 animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="py-10 text-sm text-center text-red-600">
                            שגיאה בטעינת קאנבסים
                        </div>
                    )}

                    {!loading && !error && previewItems.length === 0 && (
                        <div className="text-center text-sm text-[#1E1E1E]/70 py-10">
                            אין קאנבסים להצגה כרגע
                        </div>
                    )}

                    {!loading && !error && previewItems.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {previewItems.map((item) => (
                                <div key={item._id} className="min-w-0">
                                    <CanvasCard item={item} onAdd={onAdd} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-10 md:mt-12">
                    <button
                        type="button"
                        onClick={() => navigate("/canvases")}
                        className="px-8 py-2.5 rounded-full border border-[#1E1E1E]/15 text-[#1E1E1E] bg-[#F6F1E8]/80 hover:bg-[#E8D9C2]/80 hover:border-[#B9895B]/35 transition-all duration-200 shadow-sm"
                    >
                        לגלריה המלאה
                    </button>
                </div>
            </div>
        </motion.section>
    );
}