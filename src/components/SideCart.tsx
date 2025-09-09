import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useEffect } from "react";

interface CartItem {
    _id: string;
    title: string;
    price?: number;        // אופציונלי להצגה
    quantity: number;
    size: string;
    imageUrl: string;
}

interface SideCartProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string, size: string) => void;
    handleCheckout: () => void;
    totalsILS?: number;    // סכום סופי מדויק (מומלץ להעביר)
}

const formatILS = (n: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

const SideCart = ({
    isOpen,
    onClose,
    cart,
    updateQuantity,
    removeFromCart,
    handleCheckout,
    totalsILS,
}: SideCartProps) => {
    // נועל גלילת רקע כשהעגלה פתוחה (נוח במובייל)
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    const handleQtyChange = (id: string, raw: string | number) => {
        const num = typeof raw === "string" ? parseInt(raw, 10) : raw;
        const next = Math.max(1, Number.isFinite(num) ? num : 1);
        updateQuantity(id, next);
    };

    const derivedTotal =
        typeof totalsILS === "number"
            ? totalsILS
            : cart.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 left-0 z-50 flex flex-col h-full p-6 overflow-y-auto bg-white shadow-lg w-80"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="עגלה"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Your Cart</h2>
                            <button onClick={onClose} aria-label="Close cart">
                                <FaTimes className="text-2xl text-gray-600" />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p className="mt-10 text-center text-gray-500">Your cart is empty.</p>
                        ) : (
                            <>
                                <div className="flex flex-col flex-1 gap-4">
                                    {cart.map((item) => (
                                        <div key={item._id} className="flex items-center gap-3 pb-3 border-b">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="object-cover w-16 h-16 rounded"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.title}</h3>
                                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        inputMode="numeric"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQtyChange(item._id, e.target.value)}
                                                        className="w-16 p-1 border rounded"
                                                        aria-label={`quantity for ${item.title}`}
                                                    />
                                                    {typeof item.price === "number" && (
                                                        <p className="text-sm text-gray-600">{formatILS(item.price)}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id, item.size)}
                                                className="text-lg text-red-500"
                                                aria-label={`Remove ${item.title}`}
                                                title="Remove item"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <p className="mb-1 text-lg font-bold">
                                        Total: {formatILS(derivedTotal)}
                                    </p>
                                    {/* אופציונלי: להזכיר שהסטנדרטי מדורג */}
                                    {/* <p className="text-xs text-gray-500">* פריטי 80×25 מחושבים לפי מדרגות בקופה</p> */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={cart.length === 0}
                                        className="w-full mt-4 py-2 text-white font-semibold bg-gradient-to-r from-[#c1aa5f] to-[#97BE5A] rounded-full shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
                                        aria-label="Proceed to checkout"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SideCart;
