import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface SideCartProps {
    isOpen: boolean;
    onClose: () => void;
    cart: any[];
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string, size: string) => void;
    handleCheckout: () => void;
}

const SideCart = ({
    isOpen,
    onClose,
    cart,
    updateQuantity,
    removeFromCart,
    handleCheckout,
}: SideCartProps) => {
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 p-6 flex flex-col overflow-y-auto"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Your Cart</h2>
                            <button onClick={onClose}>
                                <FaTimes className="text-2xl text-gray-600" />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
                        ) : (
                            <>
                                <div className="flex flex-col gap-4 flex-1">
                                    {cart.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 border-b pb-3">
                                            <img
                                                src={`http://localhost:8080${item.imageUrl}`}
                                                alt={item.title}
                                                className="w-16 h-16 rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.title}</h3>
                                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateQuantity(item._id, Number(e.target.value))
                                                        }
                                                        className="w-16 p-1 border rounded"
                                                    />
                                                    <p className="text-sm text-gray-600">${item.price}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id, item.size)}
                                                className="text-red-500 text-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <p className="text-lg font-bold mb-4">
                                        Total: ${totalPrice.toFixed(2)}
                                    </p>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
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
