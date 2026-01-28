import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CanvasSize = "80×25" | "80×60" | "50×40";
export type CanvasCategory = "standard" | "triple" | "pair";

export type ProductSize = "ONE" | "l" | "xl" | "xxl";

export type CanvasCartItem = {
    kind: "canvas";
    id: string;
    name: string;
    size: CanvasSize;
    category: CanvasCategory;
    image: string;
    qty: number;
};

export type ProductCartItem = {
    kind: "product";
    id: string;
    name: string;
    size: ProductSize;
    price: number;
    image: string;
    qty: number;
};

export type CartItem = CanvasCartItem | ProductCartItem;

type CartState = { items: CartItem[] };

type Action =
    | { type: "ADD"; payload: { item: Omit<CartItem, "qty">; qty: number } }
    | { type: "REMOVE"; payload: { key: string } }
    | { type: "SET_QTY"; payload: { key: string; qty: number } }
    | { type: "CLEAR_ALL" }
    | { type: "CLEAR_KIND"; payload: { kind: CartItem["kind"] } }
    | { type: "SET_STATE"; payload: CartState };

export const CATEGORY_BY_SIZE: Record<CanvasSize, CanvasCategory> = {
    "80×25": "standard",
    "50×40": "pair",
    "80×60": "triple",
};

const STANDARD_PRICE_1 = 220;
const STANDARD_PRICE_2 = 400;
const STANDARD_PRICE_3 = 550;
const STANDARD_PRICE_EACH_AFTER_3 = 180;

const PAIR_PRICE = 390;
const TRIPLE_PRICE = 550;

const STORAGE_V2 = "cart:v2";
const LEGACY_CANVAS_V1 = "cart:v1";
const LEGACY_PRODUCTS = "cart";

function clampInt(n: number, min: number, max: number) {
    const x = Number.isFinite(n) ? Math.floor(n) : min;
    return Math.max(min, Math.min(max, x));
}

function keyOf(item: CartItem) {
    return `${item.kind}:${item.id}:${item.size}`;
}

function standardSubtotalByQty(qty: number) {
    if (qty <= 0) return 0;
    if (qty === 1) return STANDARD_PRICE_1;
    if (qty === 2) return STANDARD_PRICE_2;
    if (qty === 3) return STANDARD_PRICE_3;
    return STANDARD_PRICE_3 + (qty - 3) * STANDARD_PRICE_EACH_AFTER_3;
}

function computeCanvasTotals(items: CartItem[]) {
    const standardQty = items
        .filter((i): i is CanvasCartItem => i.kind === "canvas" && i.category === "standard")
        .reduce((s, i) => s + i.qty, 0);

    const pairSubtotal = items
        .filter((i): i is CanvasCartItem => i.kind === "canvas" && i.category === "pair")
        .reduce((s, i) => s + i.qty * PAIR_PRICE, 0);

    const tripleSubtotal = items
        .filter((i): i is CanvasCartItem => i.kind === "canvas" && i.category === "triple")
        .reduce((s, i) => s + i.qty * TRIPLE_PRICE, 0);

    const standardSubtotal = standardSubtotalByQty(standardQty);
    const subtotal = standardSubtotal + pairSubtotal + tripleSubtotal;

    return {
        standardQty,
        standardSubtotal,
        pairSubtotal,
        tripleSubtotal,
        subtotal,
    };
}

function computeProductTotals(items: CartItem[]) {
    const subtotal = items
        .filter((i): i is ProductCartItem => i.kind === "product")
        .reduce((s, i) => s + i.price * i.qty, 0);

    return { subtotal };
}

export function computeTotals(items: CartItem[]) {
    const canvas = computeCanvasTotals(items);
    const products = computeProductTotals(items);
    const shipping = 0;
    const total = canvas.subtotal + products.subtotal + shipping;

    return {
        canvas,
        products,
        shipping,
        total,
    };
}

type ProductLite = {
    _id: string;
    title: string;
    price: number;
    imageUrl: string;
};

type CanvasAddPayload = {
    id: string;
    name: string;
    size: CanvasSize;
    image: string;
    category?: CanvasCategory;
};

export type MerchPayloadItem = {
    _id: string;
    title: string;
    size: string;
    quantity: number;
    price: number;
    imageUrl: string;
};

export type CanvasPayloadItem = {
    _id: string;
    title: string;
    size: string;
    quantity: number;
    imageUrl: string;
    category: CanvasCategory;
    price?: number;
};

export type CartContextType = {
    add: (item: Omit<CartItem, "qty">, qty?: number) => void;
    state: CartState;
    items: CartItem[];
    total: number;
    totals: ReturnType<typeof computeTotals>;

    addProduct: (p: ProductLite, size: ProductSize, qty?: number) => void;
    addCanvas: (c: CanvasAddPayload, qty?: number) => void;

    remove: (key: string) => void;
    setQty: (key: string, qty: number) => void;

    clear: (kind?: "product" | "canvas") => void;

    getMerchPayload: () => MerchPayloadItem[];
    getCanvasPayload: () => CanvasPayloadItem[];
};


const CartCtx = createContext<CartContextType | undefined>(undefined);

function isCanvasSize(v: unknown): v is CanvasSize {
    return v === "80×25" || v === "50×40" || v === "80×60";
}

function isCanvasCategory(v: unknown): v is CanvasCategory {
    return v === "standard" || v === "pair" || v === "triple";
}

function isProductSize(v: unknown): v is ProductSize {
    return v === "ONE" || v === "l" || v === "xl" || v === "xxl";
}

function sanitizeV2(raw: unknown): CartState {
    if (!raw || typeof raw !== "object") return { items: [] };
    const obj = raw as { items?: unknown };
    if (!Array.isArray(obj.items)) return { items: [] };

    const items: CartItem[] = [];

    for (const it of obj.items) {
        if (!it || typeof it !== "object") continue;

        const x = it as Partial<CartItem> & Record<string, unknown>;
        const kind = x.kind;

        if (kind === "canvas") {
            const id = typeof x.id === "string" ? x.id : "";
            const name = typeof x.name === "string" ? x.name : "";
            const image = typeof x.image === "string" ? x.image : "";
            const size = x.size;

            if (!id || !name || !image) continue;
            if (!isCanvasSize(size)) continue;

            const rawCategory = (x as Partial<CanvasCartItem>).category;
            const category: CanvasCategory = isCanvasCategory(rawCategory)
                ? rawCategory
                : CATEGORY_BY_SIZE[size];

            const qty = clampInt(Number((x as Partial<CanvasCartItem>).qty ?? 1), 1, 99);

            items.push({ kind: "canvas", id, name, image, size, category, qty });
            continue;
        }

        if (kind === "product") {
            const id = typeof x.id === "string" ? x.id : "";
            const name = typeof x.name === "string" ? x.name : "";
            const image = typeof x.image === "string" ? x.image : "";
            const size = x.size;
            const price = Number((x as Partial<ProductCartItem>).price);

            if (!id || !name || !image) continue;
            if (!isProductSize(size)) continue;
            if (!Number.isFinite(price)) continue;

            const qty = clampInt(Number((x as Partial<ProductCartItem>).qty ?? 1), 1, 99);

            items.push({ kind: "product", id, name, image, size, price, qty });
            continue;
        }
    }

    return { items };
}

function sanitizeLegacyCanvasV1(raw: unknown): CartItem[] {
    if (!raw || typeof raw !== "object") return [];
    const obj = raw as { items?: unknown };
    if (!Array.isArray(obj.items)) return [];

    const items: CartItem[] = [];

    for (const it of obj.items) {
        if (!it || typeof it !== "object") continue;
        const x = it as Record<string, unknown>;

        const id = typeof x.id === "string" ? x.id : "";
        const name = typeof x.name === "string" ? x.name : "";
        const image = typeof x.image === "string" ? x.image : "";
        const size = x.size;
        const category = x.category;

        if (!id || !name || !image) continue;
        if (!isCanvasSize(size)) continue;
        if (!isCanvasCategory(category)) continue;

        const qty = clampInt(Number(x.qty ?? 1), 1, 99);

        items.push({ kind: "canvas", id, name, size, category, image, qty });
    }

    return items;
}

function sanitizeLegacyProducts(raw: unknown): CartItem[] {
    if (!Array.isArray(raw)) return [];

    const items: CartItem[] = [];

    for (const it of raw) {
        if (!it || typeof it !== "object") continue;
        const x = it as Record<string, unknown>;

        const id = typeof x._id === "string" ? x._id : "";
        const name = typeof x.title === "string" ? x.title : "";
        const image = typeof x.imageUrl === "string" ? x.imageUrl : "";
        const size = x.size;
        const price = Number(x.price);
        const qty = clampInt(Number(x.quantity ?? 1), 1, 99);

        if (!id || !name || !image) continue;
        if (!isProductSize(size)) continue;
        if (!Number.isFinite(price)) continue;

        items.push({ kind: "product", id, name, size, price, image, qty });
    }

    return items;
}

function mergeByKey(items: CartItem[]) {
    const map = new Map<string, CartItem>();

    for (const it of items) {
        const k = keyOf(it);
        const prev = map.get(k);
        if (!prev) {
            map.set(k, it);
            continue;
        }
        map.set(k, { ...it, qty: clampInt(prev.qty + it.qty, 1, 99) } as CartItem);
    }

    return Array.from(map.values());
}

function readInitial(): CartState {
    try {
        const v2Raw = localStorage.getItem(STORAGE_V2);
        if (v2Raw) return sanitizeV2(JSON.parse(v2Raw));

        const legacyCanvasRaw = localStorage.getItem(LEGACY_CANVAS_V1);
        const legacyProductsRaw = localStorage.getItem(LEGACY_PRODUCTS);

        const legacyCanvas = legacyCanvasRaw ? sanitizeLegacyCanvasV1(JSON.parse(legacyCanvasRaw)) : [];
        const legacyProducts = legacyProductsRaw ? sanitizeLegacyProducts(JSON.parse(legacyProductsRaw)) : [];

        const merged = mergeByKey([...legacyCanvas, ...legacyProducts]);
        const migrated: CartState = { items: merged };

        localStorage.setItem(STORAGE_V2, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_CANVAS_V1);
        localStorage.removeItem(LEGACY_PRODUCTS);

        return migrated;
    } catch {
        return { items: [] };
    }
}

function reducer(state: CartState, action: Action): CartState {
    switch (action.type) {
        case "SET_STATE":
            return action.payload;

        case "ADD": {
            const qty = clampInt(action.payload.qty, 1, 99);
            const key = `${action.payload.item.kind}:${action.payload.item.id}:${action.payload.item.size}`;
            const idx = state.items.findIndex((i) => keyOf(i) === key);

            if (idx === -1) {
                return { items: [...state.items, { ...action.payload.item, qty } as CartItem] };
            }

            const items = [...state.items];
            items[idx] = { ...items[idx], qty: clampInt(items[idx].qty + qty, 1, 99) };
            return { items };
        }

        case "REMOVE":
            return { items: state.items.filter((i) => keyOf(i) !== action.payload.key) };

        case "SET_QTY":
            return {
                items: state.items.map((i) =>
                    keyOf(i) === action.payload.key ? { ...i, qty: clampInt(action.payload.qty, 1, 99) } : i
                ),
            };

        case "CLEAR_KIND":
            return { items: state.items.filter((i) => i.kind !== action.payload.kind) };

        case "CLEAR_ALL":
            return { items: [] };

        default:
            return state;
    }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, undefined, readInitial);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_V2, JSON.stringify(state));
        } catch {
            return;
        }
    }, [state]);

    const totals = useMemo(() => computeTotals(state.items), [state.items]);
    const total = totals.total;

    const addProduct = (p: ProductLite, size: ProductSize, qty: number = 1) => {
        const safeQty = clampInt(Number(qty || 1), 1, 99);

        dispatch({
            type: "ADD",
            payload: {
                item: {
                    kind: "product",
                    id: p._id,
                    name: p.title,
                    size,
                    price: Number(p.price),
                    image: p.imageUrl,
                } as Omit<ProductCartItem, "qty">,
                qty: safeQty,
            },
        });
    };

    const addCanvas = (c: CanvasAddPayload, qty: number = 1) => {
        const safeQty = clampInt(Number(qty || 1), 1, 99);

        dispatch({
            type: "ADD",
            payload: {
                item: {
                    kind: "canvas",
                    id: c.id,
                    name: c.name,
                    size: c.size,
                    category: c.category ?? CATEGORY_BY_SIZE[c.size],
                    image: c.image,
                } as Omit<CanvasCartItem, "qty">,
                qty: safeQty,
            },
        });
    };

    const remove = (key: string) => dispatch({ type: "REMOVE", payload: { key } });

    const setQty = (key: string, qty: number) => dispatch({ type: "SET_QTY", payload: { key, qty } });

    const clear = (kind?: "product" | "canvas") => {
        if (!kind) dispatch({ type: "CLEAR_ALL" });
        else dispatch({ type: "CLEAR_KIND", payload: { kind } });
    };

    const getMerchPayload = (): MerchPayloadItem[] => {
        return state.items
            .filter((i): i is ProductCartItem => i.kind === "product")
            .map((i) => ({
                _id: i.id,
                title: i.name,
                size: String(i.size),
                quantity: i.qty,
                price: i.price,
                imageUrl: i.image,
            }));
    };

    const getCanvasPayload = (): CanvasPayloadItem[] => {
        return state.items
            .filter((i): i is CanvasCartItem => i.kind === "canvas")
            .map((i) => ({
                _id: i.id,
                title: i.name,
                size: String(i.size),
                quantity: i.qty,
                imageUrl: i.image,
                category: i.category,
                price: i.category === "pair" ? 390 : i.category === "triple" ? 550 : undefined,
            }));
    };

    const add = (item: Omit<CartItem, "qty">, qty: number = 1) => {
        dispatch({
            type: "ADD",
            payload: {
                item,
                qty: clampInt(Number(qty || 1), 1, 99),
            },
        });
    };

    const value: CartContextType = useMemo(
        () => ({
            add,
            state,
            items: state.items,
            total,
            totals,
            addProduct,
            addCanvas,
            remove,
            setQty,
            clear,
            getMerchPayload,
            getCanvasPayload,
        }),
        [state, total, totals]
    );

    return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};

export function useCart(): CartContextType {
    const ctx = useContext(CartCtx);
    if (!ctx) throw new Error("useCart must be used within a <CartProvider>");
    return ctx;
}
