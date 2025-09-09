import React, { createContext, useContext, useMemo, useReducer, useEffect } from "react";

/* ------- Types ------- */
export type CanvasSize = "80×25" | "80×60" | "50×40";
export type CanvasCategory = "standard" | "triple" | "pair";

export type CartItem = {
    id: string;
    name: string;
    size: CanvasSize;
    category: CanvasCategory;
    image: string;
    qty: number;
};

type CartState = { items: CartItem[] };

type Action =
    | { type: "ADD"; payload: CartItem }
    | { type: "REMOVE"; payload: { id: string } }
    | { type: "SET_QTY"; payload: { id: string; qty: number } }
    | { type: "CLEAR" };

export function computeTotals(items: CartItem[]) {
    const standardQty = items.filter(i => i.category === "standard").reduce((s, i) => s + i.qty, 0);

    const standardSubtotal =
        standardQty <= 0 ? 0 :
            standardQty === 1 ? 220 :
                standardQty === 2 ? 400 :
                    standardQty === 3 ? 550 :
                        550 + (standardQty - 3) * 180;

    const pairSubtotal = items.filter(i => i.category === "pair").reduce((s, i) => s + i.qty * 390, 0);
    const tripleSubtotal = items.filter(i => i.category === "triple").reduce((s, i) => s + i.qty * 550, 0);

    const subtotal = standardSubtotal + pairSubtotal + tripleSubtotal;
    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;

    return { standardQty, subtotal, shipping, total };
}

/* ------- Context Type ------- */
export type CartContextType = {
    state: CartState;
    add: (item: Omit<CartItem, "qty">, qty?: number) => void;
    remove: (id: string) => void;
    setQty: (id: string, qty: number) => void;
    clear: () => void;
    totals: ReturnType<typeof computeTotals>;
};

/* ------- Reducer & init ------- */
const initialState: CartState = { items: [] };

function reducer(state: CartState, action: Action): CartState {
    switch (action.type) {
        case "ADD": {
            const idx = state.items.findIndex(i => i.id === action.payload.id);
            if (idx === -1) return { items: [...state.items, action.payload] };
            const items = [...state.items];
            items[idx] = { ...items[idx], qty: items[idx].qty + action.payload.qty };
            return { items };
        }
        case "REMOVE":
            return { items: state.items.filter(i => i.id !== action.payload.id) };
        case "SET_QTY":
            return { items: state.items.map(i => (i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i)) };
        case "CLEAR":
            return { items: [] };
        default:
            return state;
    }
}

function readInitial(): CartState {
    try {
        const raw = localStorage.getItem("cart:v1");
        if (!raw) return initialState;
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items)) return parsed;
    } catch {
        // intentionally ignore errors
    }
    return initialState;
}

function useLocalStorageSync(state: CartState) {
    useEffect(() => {
        try { localStorage.setItem("cart:v1", JSON.stringify(state)); } catch { /* intentionally ignore errors */ }
    }, [state]);
}

/* ------- Context ------- */
const CartCtx = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, undefined, readInitial);
    useLocalStorageSync(state);

    const totals = useMemo(() => computeTotals(state.items), [state.items]);

    const add = (item: Omit<CartItem, "qty">, qty: number = 1) => dispatch({ type: "ADD", payload: { ...item, qty } });
    const remove = (id: string) => dispatch({ type: "REMOVE", payload: { id } });
    const setQty = (id: string, qty: number) => dispatch({ type: "SET_QTY", payload: { id, qty } });
    const clear = () => dispatch({ type: "CLEAR" });

    const value: CartContextType = useMemo(
        () => ({ state, add, remove, setQty, clear, totals }),
        [state, totals]
    );

    return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};

export function useCart(): CartContextType {
    const ctx = useContext(CartCtx);
    if (!ctx) {
        throw new Error("useCart must be used within a <CartProvider>");
    }
    return ctx;
}
