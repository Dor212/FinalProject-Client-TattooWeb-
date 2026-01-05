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
            className="container px-5 py-20 mx-auto text-center"
            dir="rtl"
        >
            <div className="flex flex-wrap justify-center gap-10">
                {products.slice(0, 3).map((product: Product) => {
                    const withSizes = !!product.stock;
                    const outOfStock = isOutOfStock(product);

                    return (
                        <motion.div
                            whileHover={{ scale: 1.06, rotate: 0.5 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            key={product._id}
                            className="relative w-72 p-5 rounded-3xl bg-white/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#e4d3a1] transition-all"
                        >
                            <div className="overflow-hidden rounded-2xl border border-[#f4e7b4] shadow-inner relative">
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className={`object-cover w-full h-56 transition-transform duration-300 hover:scale-105 ${outOfStock ? "opacity-30" : ""
                                        }`}
                                />
                                {outOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#7a6b3b] bg-white/70 rounded-2xl">
                                        ❌ אזל מהמלאי
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 text-[#3a3220]">
                                <h3 className="text-xl font-bold tracking-tight">{product.title}</h3>
                                <p className="text-lg font-semibold text-[#8b7c4a]">{Number(product.price).toFixed(2)} ₪</p>
                                {product.description && (
                                    <p className="mt-1 text-sm text-[#5b4c33] line-clamp-2">{product.description}</p>
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
                                                            className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${disabled
                                                                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                                                    : selected
                                                                        ? "bg-[#97BE5A] text-white border-[#7ea649] shadow-md"
                                                                        : "bg-white/80 text-[#3a3220] border-[#cbb279] hover:bg-[#f6f0d4]"
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
                                                className="w-full px-3 py-2 mt-2 text-sm bg-white/70 border border-[#d7c793] rounded-xl focus:ring-2 focus:ring-[#bfa63b] outline-none"
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
                                                className="w-full mt-4 py-2 text-white font-semibold bg-gradient-to-r from-[#c1aa5f] to-[#97BE5A] rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <span>הוסף לסל</span>
                                                <motion.span
                                                    initial={{ rotate: 0 }}
                                                    animate={{ rotate: [0, 15, -10, 10, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
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
                                                className="w-full px-3 py-2 mt-2 text-sm bg-white/70 border border-[#d7c793] rounded-xl focus:ring-2 focus:ring-[#bfa63b] outline-none"
                                                placeholder="כמות"
                                            />

                                            <button
                                                onClick={() => addToCart(product, "ONE", quantities[product._id] || 1)}
                                                className="w-full mt-4 py-2 text-white font-semibold bg-gradient-to-r from-[#c1aa5f] to-[#97BE5A] rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <span>הוסף לסל</span>
                                                <motion.span
                                                    initial={{ rotate: 0 }}
                                                    animate={{ rotate: [0, 15, -10, 10, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
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

            <div className="flex justify-center mt-8">
                <button
                    onClick={onSeeMore}
                    className="px-5 py-2 rounded-full border border-[#cbb279] text-[#3a3220] bg-white/80 hover:bg-[#f6f0d4] transition"
                >
                    See more
                </button>
            </div>
        </motion.section>
    );
};

export default ShopMerchSection;
