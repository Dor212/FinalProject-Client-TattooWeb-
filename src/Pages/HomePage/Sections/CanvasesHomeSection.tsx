import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "../../../Services/toast";
import { useCart } from "../../../components/context/CartContext";
import { useCanvases } from "../../CanvasesPage/hooks/useCanvases";
import type { CanvasItem } from "../../CanvasesPage/components/types";
import { formatILS, priceForSize } from "../../CanvasesPage/components/ui";

type Props = {
    onOpenCart: () => void;
};

const cls = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

function ImageStage({ src, size }: { src: string; size: CanvasItem["size"] }) {
    const stageClass =
        size === "80×25" ? "h-[clamp(200px,35svh,320px)]" : "h-[clamp(240px,40svh,360px)]";

    return (
        <div
            className={cls(
                "relative w-full rounded-2xl overflow-hidden border border-[#1E1E1E]/10 bg-[#F6F1E8] shadow-inner",
                stageClass
            )}
        >
            <img
                src={src}
                alt="canvas"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
        </div>
    );
}

function PreviewCard({
    item,
    onAdd,
    onOpen,
}: {
    item: CanvasItem;
    onAdd: (c: CanvasItem) => void;
    onOpen: () => void;
}) {
    const price = priceForSize(item.size);

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full p-5 rounded-3xl bg-[#E8D9C2]/70 backdrop-blur-md shadow-md border border-[#1E1E1E]/25 outline outline-1 outline-[#F6F1E8]/55 outline-offset-0 hover:shadow-lg hover:border-[#1E1E1E]/35 transition-all"
        >
            <ImageStage src={item.imageUrl} size={item.size} />

            <div className="mt-4 text-[#1E1E1E]">
                <h3 className="text-xl font-bold tracking-tight">{item.name}</h3>
                <p className="text-sm font-medium opacity-70">{item.size}</p>
                <p className="text-lg font-semibold text-[#B9895B] mt-1">{formatILS(price)}</p>

                <div className="mt-4 space-y-2">
                    <button
                        type="button"
                        onClick={() => onAdd(item)}
                        className="w-full py-2 font-semibold rounded-xl bg-[#B9895B] text-[#F6F1E8] shadow-sm hover:shadow-md hover:bg-[#A97A51] transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40"
                    >
                        <span>הוסף לסל</span>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.35, 0.9, 0.35] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            className="inline-block w-1.5 h-1.5 rounded-full bg-[#F6F1E8]"
                        />
                    </button>

                    <button
                        type="button"
                        onClick={onOpen}
                        className="w-full py-2 text-sm font-semibold rounded-xl border border-[#1E1E1E]/15 text-[#1E1E1E] bg-[#F6F1E8]/80 hover:bg-[#E8D9C2]/80 transition-all duration-200"
                    >
                        לכל הקאנבסים
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function CanvasesHomeSection({ onOpenCart }: Props) {
    const navigate = useNavigate();
    const cart = useCart();

    const apiBase = import.meta.env.VITE_API_URL as string;
    const { loading, error, filtered } = useCanvases(apiBase);

    const previewItems = useMemo<CanvasItem[]>(
        () => filtered.slice(0, 3),
        [filtered]
    );

    const onAdd = (item: CanvasItem) => {
        cart.addCanvas(
            {
                id: item._id,
                name: item.name,
                size: item.size,
                image: item.imageUrl,
            },
            1
        );
        onOpenCart();
        toast.success("נוסף", item.name, 850);
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="container relative px-5 mx-auto overflow-hidden text-center pt-28 pb-28 md:pt-32 md:pb-32"
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
                <div className="max-w-5xl mx-auto mb-12">
                    <h2
                        className="text-3xl md:text-5xl font-black tracking-tight text-[#1E1E1E] drop-shadow-sm"
                    >
                        קאנבסים
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-[#1E1E1E]/75 max-w-lg mx-auto">
                        בחר קאנבס בעיצוב אישי או מהגלריה שלנו להשלמת האווירה בסטודיו או בבית
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    {loading && (
                        <div className="text-center text-sm text-[#1E1E1E]/70 py-10">טוען קאנבסים...</div>
                    )}

                    {!loading && error && (
                        <div className="py-10 text-sm text-center text-red-600">שגיאה בטעינת קאנבסים</div>
                    )}

                    {!loading && !error && previewItems.length === 0 && (
                        <div className="text-center text-sm text-[#1E1E1E]/70 py-10">אין קאנבסים להצגה כרגע</div>
                    )}

                    {!loading && !error && previewItems.length > 0 && (
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 justify-items-center">
                            {previewItems.map((item) => (
                                <PreviewCard
                                    key={item._id}
                                    item={item}
                                    onAdd={onAdd}
                                    onOpen={() => navigate("/canvases")}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-12">
                    <button
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