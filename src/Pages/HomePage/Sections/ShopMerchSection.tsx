import { motion } from "framer-motion";
import { Product } from "../../../Types/TProduct.ts";

const SIZE_KEYS = ["l", "xl", "xxl"] as const;
type SizeKey = (typeof SIZE_KEYS)[number];

type Props = {
    products: Product[];
    sizeKeys: readonly SizeKey[];
    selectedSizes: Record<string, SizeKey | "ONE">;
    setSelectedSizes: React.Dispatch<React.SetStateAction<Record<string, SizeKey | "ONE">>>;
    quantities: Record<string, number>;
    setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    addToCart: (product: Product, size: SizeKey | "ONE" | undefined, quantity: number) => void;
    isOutOfStock: (p: Product) => boolean;
    onSeeMore: () => void;
};

const ShopMerchSection = ({
    products,
    sizeKeys,
    selectedSizes,
    setSelectedSizes,
    quantities,
    setQuantities,
    addToCart,
    isOutOfStock,
    onSeeMore,
}: Props) => {
    return (
        <motion.section
            id="shop"
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

            <div className="pointer-events-none absolute top-7 left-1/2 -translate-x-1/2 z-[1] select-none opacity-70">
                <div dir="ltr" className="max-w-[280px] md:max-w-[360px] text-center">
                    <div
                        className="text-[18px] md:text-[22px] lg:text-[26px] leading-[1.15] text-[#F6F1E8]/32 drop-shadow-[0_3px_10px_rgba(30,30,30,0.35)]"
                        style={{ fontFamily: "'Milonga', serif" }}
                    >
                        “Inspiration exists, but it has to find you working.”
                    </div>
                    <div
                        className="mt-1 text-[12px] md:text-[13px] lg:text-[14px] text-right tracking-[0.08em] text-[#F6F1E8]/40 drop-shadow-[0_2px_8px_rgba(30,30,30,0.30)]"
                        style={{ fontFamily: "'Milonga', serif" }}
                    >
                        Pablo Picasso
                    </div>
                </div>
            </div>

            <div className="relative z-[2]">
                <div className="flex flex-wrap justify-center gap-10">
                    {products.slice(0, 3).map((product: Product) => {
                        const withSizes = !!product.stock;
                        const outOfStock = isOutOfStock(product);

                        return (
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                key={product._id}
                                className="relative w-72 p-5 rounded-3xl bg-[#E8D9C2]/70 backdrop-blur-md shadow-md border border-[#1E1E1E]/25 outline outline-1 outline-[#F6F1E8]/55 outline-offset-0 hover:shadow-lg hover:border-[#1E1E1E]/35 transition-all"
                            >
                                <div className="overflow-hidden rounded-2xl border border-[#1E1E1E]/10 shadow-inner relative bg-[#F6F1E8]">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className={`object-cover w-full h-56 transition-transform duration-300 hover:scale-[1.03] ${outOfStock ? "opacity-35" : ""
                                            }`}
                                    />
                                    {outOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#F6F1E8]/70">
                                            <span className="px-3 py-1 text-sm font-semibold rounded-full border border-[#1E1E1E]/15 bg-[#E8D9C2]/70 text-[#1E1E1E]">
                                                אזל מהמלאי
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 text-[#1E1E1E]">
                                    <h3 className="text-xl font-bold tracking-tight">{product.title}</h3>
                                    <p className="text-lg font-semibold text-[#B9895B]">
                                        {Number(product.price).toFixed(2)} ₪
                                    </p>
                                    {product.description && (
                                        <p className="mt-1 text-sm text-[#1E1E1E]/75 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}
                                </div>

                                {!outOfStock && (
                                    <div className="mt-3">
                                        {withSizes ? (
                                            <>
                                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                                    {sizeKeys.map((sizeKey) => {
                                                        const data = product.stock?.[sizeKey];
                                                        const disabled = !data || (data.current ?? 0) === 0;
                                                        const selected = selectedSizes[product._id] === sizeKey;

                                                        return (
                                                            <button
                                                                key={sizeKey}
                                                                disabled={disabled}
                                                                onClick={() =>
                                                                    setSelectedSizes((prev) => ({
                                                                        ...prev,
                                                                        [product._id]: sizeKey,
                                                                    }))
                                                                }
                                                                className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1E8] ${disabled
                                                                        ? "bg-[#F6F1E8]/60 text-[#1E1E1E]/35 border-[#1E1E1E]/10 cursor-not-allowed"
                                                                        : selected
                                                                            ? "bg-[#B9895B] text-[#F6F1E8] border-[#B9895B] shadow-sm"
                                                                            : "bg-[#F6F1E8]/70 text-[#1E1E1E] border-[#1E1E1E]/15 hover:bg-[#E8D9C2]/80 hover:border-[#B9895B]/35"
                                                                    }`}
                                                            >
                                                                {sizeKey.toUpperCase()}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={quantities[product._id] || 1}
                                                    onChange={(e) =>
                                                        setQuantities((prev) => ({
                                                            ...prev,
                                                            [product._id]: Math.max(1, Number(e.target.value) || 1),
                                                        }))
                                                    }
                                                    className="w-full px-3 py-2 mt-3 text-sm bg-[#F6F1E8]/75 border border-[#1E1E1E]/15 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1E8] text-[#1E1E1E]"
                                                    placeholder="כמות"
                                                />

                                                <button
                                                    onClick={() =>
                                                        addToCart(
                                                            product,
                                                            selectedSizes[product._id] as SizeKey | undefined,
                                                            quantities[product._id] || 1
                                                        )
                                                    }
                                                    className="w-full mt-4 py-2 font-semibold rounded-xl bg-[#B9895B] text-[#F6F1E8] shadow-sm hover:shadow-md hover:bg-[#A97A51] transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1E8]"
                                                >
                                                    <span>הוסף לסל</span>
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: [0.35, 0.9, 0.35] }}
                                                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                                        className="inline-block w-1.5 h-1.5 rounded-full bg-[#F6F1E8]"
                                                    />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={quantities[product._id] || 1}
                                                    onChange={(e) =>
                                                        setQuantities((prev) => ({
                                                            ...prev,
                                                            [product._id]: Math.max(1, Number(e.target.value) || 1),
                                                        }))
                                                    }
                                                    className="w-full px-3 py-2 mt-3 text-sm bg-[#F6F1E8]/75 border border-[#1E1E1E]/15 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1E8] text-[#1E1E1E]"
                                                    placeholder="כמות"
                                                />

                                                <button
                                                    onClick={() => addToCart(product, "ONE", quantities[product._id] || 1)}
                                                    className="w-full mt-4 py-2 font-semibold rounded-xl bg-[#B9895B] text-[#F6F1E8] shadow-sm hover:shadow-md hover:bg-[#A97A51] transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1E8]"
                                                >
                                                    <span>הוסף לסל</span>
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: [0.35, 0.9, 0.35] }}
                                                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                                        className="inline-block w-1.5 h-1.5 rounded-full bg-[#F6F1E8]"
                                                    />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={onSeeMore}
                        className="px-5 py-2 rounded-full border border-[#1E1E1E]/15 text-[#1E1E1E] bg-[#F6F1E8]/80 hover:bg-[#E8D9C2]/80 hover:border-[#B9895B]/35 transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1E8]"
                    >
                        See more
                    </button>
                </div>
            </div>
        </motion.section>
    );
};

export default ShopMerchSection;
