import React from "react";
import { useCart } from "../context/CartContext.tsx";

export default function CartButton({ onClick }: { onClick: () => void }) {
    const cart = useCart();
    const count = cart?.state
        ? cart.state.items.reduce((s, i) => s + i.qty, 0)
        : 0;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#8C734A] text-white px-4 py-2 shadow-lg hover:opacity-90"
            aria-label="עגלה"
        >
          
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>עגלה</span>
            {count > 0 && (
                <span className="px-2 ml-1 text-sm rounded-full bg-white/20">{count}</span>
            )}
        </button>
    );
}
