
import { useCart } from "../context/CartContext.tsx";

export default function CartDrawer({
    open,
    onClose,
    onCheckout,
}: {
    open: boolean;
    onClose: () => void;
    onCheckout: () => void;
}) {
    const cart = useCart();
    if (!cart) {
        return null;
    }
    const { state, setQty, remove, totals } = cart;

    return (
        <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* רקע */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />
            {/* פאנל */}
            <aside
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"
                    }`}
                dir="rtl"
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-[#3B3024]">העגלה שלי</h3>
                    <button onClick={onClose} className="p-2 rounded hover:bg-black/5">✕</button>
                </div>

                <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[calc(100%-200px)]">
                    {state.items.length === 0 ? (
                        <div className="text-center text-[#3B3024]/70">העגלה ריקה</div>
                    ) : (
                        state.items.map(item => (
                            <div key={item.id} className="flex gap-3 p-2 border rounded-lg">
                                <img src={item.image} alt="" className="object-cover w-20 h-20 rounded" />
                                <div className="flex-1">
                                    <div className="font-medium text-[#3B3024]">{item.name}</div>
                                    <div className="text-xs text-[#3B3024]/70">{item.size}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <label className="text-sm">כמות</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.qty}
                                            onChange={e => setQty(item.id, Math.max(1, Number(e.target.value) || 1))}
                                            className="w-16 px-2 py-1 border rounded"
                                        />
                                        <button onClick={() => remove(item.id)} className="ml-auto text-red-600 hover:underline">
                                            הסרה
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* סיכומים */}
                <div className="p-4 border-t bg-[#faf9f5]">
                    <div className="flex justify-between text-sm text-[#3B3024]">
                        <span>סה״כ ביניים</span>
                        <span>₪{totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#3B3024]/70">
                        <span>משלוח</span>
                        <span>{totals.shipping === 0 ? "חינם" : `₪${totals.shipping}`}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-lg font-bold text-[#3B3024]">
                        <span>לתשלום</span>
                        <span>₪{totals.total.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={onCheckout}
                        disabled={state.items.length === 0}
                        className="mt-3 w-full rounded-lg bg-[#8C734A] text-white py-2 disabled:opacity-50"
                    >
                        לתשלום
                    </button>
                </div>
            </aside>
        </div>
    );
}
