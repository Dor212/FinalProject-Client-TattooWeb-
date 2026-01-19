import type { Product } from "../../../Types/TProduct";
import { CardShell, DangerIconBtn, Field, FilePick, Input, PrimaryBtn, TextArea, cls, formatILS } from "./ui";
import { FaPlus } from "react-icons/fa";

const ProductsSection = ({
    loading,
    products,
    productTitle,
    setProductTitle,
    productPrice,
    setProductPrice,
    productDescription,
    setProductDescription,
    productImage,
    setProductImage,
    stockL,
    setStockL,
    stockXL,
    setStockXL,
    stockXXL,
    setStockXXL,
    onUpload,
    onDelete,
    onOpenStock,
    getCur,
    getInit,
}: {
    loading: boolean;
    products: Product[];
    productTitle: string;
    setProductTitle: React.Dispatch<React.SetStateAction<string>>;
    productPrice: string;
    setProductPrice: React.Dispatch<React.SetStateAction<string>>;
    productDescription: string;
    setProductDescription: React.Dispatch<React.SetStateAction<string>>;
    productImage: File | null;
    setProductImage: React.Dispatch<React.SetStateAction<File | null>>;
    stockL: string;
    setStockL: React.Dispatch<React.SetStateAction<string>>;
    stockXL: string;
    setStockXL: React.Dispatch<React.SetStateAction<string>>;
    stockXXL: string;
    setStockXXL: React.Dispatch<React.SetStateAction<string>>;
    onUpload: () => void;
    onDelete: (id: string) => void;
    onOpenStock: (p: Product) => void;
    getCur: (p: Product, key: "l" | "xl" | "xxl") => number;
    getInit: (p: Product, key: "l" | "xl" | "xxl") => number;
}) => {
    return (
        <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
            <CardShell>
                <div className="px-7 pt-7 pb-5 border-b border-[#B9895B]/15">
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-extrabold text-[#1E1E1E]">העלאת מוצר חדש</div>
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#B9895B]/12 text-[#B9895B]">
                            <FaPlus />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-[#1E1E1E]/65 text-end">
                        שם + מחיר + תמונה חובה. תיאור ומלאי מידות אופציונליים.
                    </div>
                </div>

                <div className="py-6 space-y-4 px-7">
                    <Field label="שם מוצר">
                        <Input value={productTitle} onChange={(e) => setProductTitle(e.target.value)} placeholder="לדוגמה: חולצת סטודיו" />
                    </Field>

                    <Field label="מחיר">
                        <Input type="number" min={0} value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="לדוגמה: 220" />
                    </Field>

                    <Field label="תיאור (אופציונלי)">
                        <TextArea rows={3} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="כמה מילים קצרות…" />
                    </Field>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <Field label="מלאי L (אופציונלי)">
                            <Input type="number" min={0} value={stockL} onChange={(e) => setStockL(e.target.value)} placeholder="0" />
                        </Field>
                        <Field label="מלאי XL (אופציונלי)">
                            <Input type="number" min={0} value={stockXL} onChange={(e) => setStockXL(e.target.value)} placeholder="0" />
                        </Field>
                        <Field label="מלאי XXL (אופציונלי)">
                            <Input type="number" min={0} value={stockXXL} onChange={(e) => setStockXXL(e.target.value)} placeholder="0" />
                        </Field>
                    </div>

                    <Field label="תמונה">
                        <FilePick value={productImage?.name} onPick={setProductImage} />
                    </Field>

                    <PrimaryBtn onClick={onUpload} icon={<FaPlus />}>
                        העלה מוצר
                    </PrimaryBtn>
                </div>
            </CardShell>

            <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="text-xl font-extrabold text-[#1E1E1E]">רשימת מוצרים</div>
                    <div className="text-sm text-[#1E1E1E]/65 text-end">“מלאי” לעריכה, או מחיקה.</div>
                </div>

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[260px] rounded-[26px] bg-white/25 border border-[#B9895B]/14 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((p) => {
                            const total = p.stock ? getCur(p, "l") + getCur(p, "xl") + getCur(p, "xxl") : -1;
                            const isOut = p.stock ? total === 0 : false;

                            return (
                                <div
                                    key={p._id}
                                    className="relative overflow-hidden rounded-[26px] border border-[#B9895B]/16 bg-white/35 backdrop-blur shadow-[0_14px_55px_rgba(30,30,30,0.12)]"
                                >
                                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(185,137,91,0.12),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(232,217,194,0.26),transparent_55%)]" />

                                    <div className="relative p-4">
                                        <div className="relative overflow-hidden rounded-2xl border border-[#B9895B]/12 bg-white/40">
                                            <img
                                                src={p.imageUrl}
                                                alt={p.title}
                                                className={cls("h-44 w-full object-cover", isOut && "opacity-40")}
                                                loading="lazy"
                                            />
                                            {isOut && (
                                                <div className="absolute inset-0 grid place-items-center">
                                                    <div className="px-4 py-1 text-xs font-extrabold text-red-700 border border-red-200 rounded-full bg-white/70">
                                                        אזל מהמלאי
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-start justify-between gap-3 mt-3">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-extrabold text-[#1E1E1E] text-end">{p.title}</div>
                                                <div className="mt-1 text-sm font-semibold text-[#B9895B] text-end">
                                                    {formatILS(Number(p.price) || 0)}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onOpenStock(p)}
                                                    className="inline-flex items-center justify-center rounded-2xl bg-[#B9895B] px-3 py-2 text-xs font-extrabold text-white shadow-[0_14px_35px_rgba(30,30,30,0.14)] hover:brightness-95 active:brightness-90"
                                                    title="עריכת מלאי"
                                                >
                                                    מלאי
                                                </button>
                                                <DangerIconBtn onClick={() => onDelete(p._id)} title="מחיקה" />
                                            </div>
                                        </div>

                                        {p.description && (
                                            <div className="mt-2 text-xs text-[#1E1E1E]/70 line-clamp-2 text-end">{p.description}</div>
                                        )}

                                        <div className="mt-3 rounded-2xl border border-[#B9895B]/14 bg-white/35 p-3 text-xs text-[#1E1E1E]/75">
                                            {p.stock ? (
                                                <div className="grid gap-1 text-end">
                                                    <div>
                                                        L: {getCur(p, "l")}/{getInit(p, "l")}
                                                    </div>
                                                    <div>
                                                        XL: {getCur(p, "xl")}/{getInit(p, "xl")}
                                                    </div>
                                                    <div>
                                                        XXL: {getCur(p, "xxl")}/{getInit(p, "xxl")}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="italic text-end">אין מלאי לפי מידות</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsSection;
