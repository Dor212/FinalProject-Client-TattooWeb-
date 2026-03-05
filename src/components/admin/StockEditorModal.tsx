import { useEffect, useMemo, useState } from "react";
import api from "../../Services/axiosInstance";
import { Product } from "../../Types/TProduct";
import { getHttpErrorMessage, toast } from "../../Services/toast";

type Action = "set" | "add" | "subtract" | "reset" | "remove";
type SizeKey = "l" | "xl" | "xxl";

type SetPayload = { initial?: number; current?: number };
type DeltaPayload = { delta: number };
type ResetPayload = { initial?: number };
type EmptyPayload = Record<string, never>;

type SetSizes = Partial<Record<SizeKey, SetPayload>>;
type DeltaSizes = Partial<Record<SizeKey, DeltaPayload>>;
type ResetSizes = Partial<Record<SizeKey, ResetPayload>>;
type EmptySizes = Partial<Record<SizeKey, EmptyPayload>>;

type PatchPayload =
    | { action: "set"; sizes: SetSizes; createStockIfMissing: true }
    | { action: "add"; sizes: DeltaSizes; createStockIfMissing: true }
    | { action: "subtract"; sizes: DeltaSizes; createStockIfMissing: true }
    | { action: "reset"; sizes: ResetSizes; createStockIfMissing: true }
    | { action: "remove"; sizes: EmptySizes; createStockIfMissing: true };

type Props = {
    open: boolean;
    onClose: () => void;
    product: Product;
    onUpdated: (updated: Product) => void;
    apiBase: string;
};

const isPositiveInt = (v: string) => /^\d+$/.test(v);

export default function StockEditorModal({ open, onClose, product, onUpdated }: Props) {
    const [action, setAction] = useState<Action>("set");

    const [useL, setUseL] = useState<boolean>(!!product.stock?.l);
    const [useXL, setUseXL] = useState<boolean>(!!product.stock?.xl);
    const [useXXL, setUseXXL] = useState<boolean>(!!product.stock?.xxl);

    const [lInitial, setLInitial] = useState<string>(product.stock?.l?.initial?.toString() ?? "");
    const [lCurrent, setLCurrent] = useState<string>(product.stock?.l?.current?.toString() ?? "");
    const [xlInitial, setXLInitial] = useState<string>(product.stock?.xl?.initial?.toString() ?? "");
    const [xlCurrent, setXLCurrent] = useState<string>(product.stock?.xl?.current?.toString() ?? "");
    const [xxlInitial, setXXLInitial] = useState<string>(product.stock?.xxl?.initial?.toString() ?? "");
    const [xxlCurrent, setXXLCurrent] = useState<string>(product.stock?.xxl?.current?.toString() ?? "");

    const [lDelta, setLDelta] = useState<string>("");
    const [xlDelta, setXLDelta] = useState<string>("");
    const [xxlDelta, setXXLDelta] = useState<string>("");

    useEffect(() => {
        if (!open) return;

        setAction("set");
        setUseL(!!product.stock?.l);
        setUseXL(!!product.stock?.xl);
        setUseXXL(!!product.stock?.xxl);

        setLInitial(product.stock?.l?.initial?.toString() ?? "");
        setLCurrent(product.stock?.l?.current?.toString() ?? "");
        setXLInitial(product.stock?.xl?.initial?.toString() ?? "");
        setXLCurrent(product.stock?.xl?.current?.toString() ?? "");
        setXXLInitial(product.stock?.xxl?.initial?.toString() ?? "");
        setXXLCurrent(product.stock?.xxl?.current?.toString() ?? "");

        setLDelta("");
        setXLDelta("");
        setXXLDelta("");
    }, [open, product]);

    const disabled = useMemo(() => {
        if (action === "remove") return !(useL || useXL || useXXL);
        if (action === "reset") return !(useL || useXL || useXXL);

        if (action === "add" || action === "subtract") {
            const okL = !useL || (isPositiveInt(lDelta) && +lDelta > 0);
            const okXL = !useXL || (isPositiveInt(xlDelta) && +xlDelta > 0);
            const okXXL = !useXXL || (isPositiveInt(xxlDelta) && +xxlDelta > 0);
            return !(useL || useXL || useXXL) || !(okL && okXL && okXXL);
        }

        const validL = !useL || ((lInitial === "" || isPositiveInt(lInitial)) && (lCurrent === "" || isPositiveInt(lCurrent)));
        const validXL = !useXL || ((xlInitial === "" || isPositiveInt(xlInitial)) && (xlCurrent === "" || isPositiveInt(xlCurrent)));
        const validXXL = !useXXL || ((xxlInitial === "" || isPositiveInt(xxlInitial)) && (xxlCurrent === "" || isPositiveInt(xxlCurrent)));
        return !(useL || useXL || useXXL) || !(validL && validXL && validXXL);
    }, [action, useL, useXL, useXXL, lDelta, xlDelta, xxlDelta, lInitial, lCurrent, xlInitial, xlCurrent, xxlInitial, xxlCurrent]);

    const maybePut = <T extends object>(flag: boolean, key: SizeKey, data: T, target: Partial<Record<SizeKey, T>>): void => {
        if (flag) target[key] = data;
    };

    const buildPayload = (): PatchPayload => {
        if (action === "set") {
            const sizes: SetSizes = {};
            maybePut(
                useL,
                "l",
                {
                    ...(lInitial !== "" ? { initial: Number(lInitial) } : {}),
                    ...(lCurrent !== "" ? { current: Number(lCurrent) } : {}),
                },
                sizes
            );
            maybePut(
                useXL,
                "xl",
                {
                    ...(xlInitial !== "" ? { initial: Number(xlInitial) } : {}),
                    ...(xlCurrent !== "" ? { current: Number(xlCurrent) } : {}),
                },
                sizes
            );
            maybePut(
                useXXL,
                "xxl",
                {
                    ...(xxlInitial !== "" ? { initial: Number(xxlInitial) } : {}),
                    ...(xxlCurrent !== "" ? { current: Number(xxlCurrent) } : {}),
                },
                sizes
            );
            return { action, sizes, createStockIfMissing: true };
        }

        if (action === "add" || action === "subtract") {
            const sizes: DeltaSizes = {};
            if (useL) sizes.l = { delta: Number(lDelta) };
            if (useXL) sizes.xl = { delta: Number(xlDelta) };
            if (useXXL) sizes.xxl = { delta: Number(xxlDelta) };
            return { action, sizes, createStockIfMissing: true };
        }

        if (action === "reset") {
            const sizes: ResetSizes = {};
            if (useL && lInitial !== "") sizes.l = { initial: Number(lInitial) };
            if (useXL && xlInitial !== "") sizes.xl = { initial: Number(xlInitial) };
            if (useXXL && xxlInitial !== "") sizes.xxl = { initial: Number(xxlInitial) };
            return { action, sizes, createStockIfMissing: true };
        }

        const sizes: EmptySizes = {};
        if (useL) sizes.l = {};
        if (useXL) sizes.xl = {};
        if (useXXL) sizes.xxl = {};
        return { action, sizes, createStockIfMissing: true };
    };

    const onSubmit = async () => {
        try {
            const payload = buildPayload();

            const { data } = await api.patch<{ message: string; product: Product }>(`/products/${product._id}/stock`, payload);

            onUpdated(data.product);
            toast.success("עודכן!", undefined, 1200);
            onClose();
        } catch (err: unknown) {
            toast.error("שגיאה", getHttpErrorMessage(err, "Failed to update stock"));
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" dir="rtl">
            <div className="w-full max-w-xl p-6 bg-[#F6F1E8] shadow-xl rounded-2xl border border-[#B9895B]/20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-[#1E1E1E]">ניהול מלאי — {product.title}</h3>
                    <button onClick={onClose} className="px-2 py-1 text-white bg-[#1E1E1E] rounded hover:opacity-90" type="button">
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-3">
                    <label className="col-span-1 text-sm font-medium md:col-span-3 text-[#3B3024]">פעולה</label>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value as Action)}
                        className="p-2 border border-[#B9895B]/25 rounded bg-white/50"
                    >
                        <option value="set">Set (קבע ערכים)</option>
                        <option value="add">Add (הגדלת מלאי)</option>
                        <option value="subtract">Subtract (הפחתת מלאי)</option>
                        <option value="reset">Reset (איפוס current ל־initial)</option>
                        <option value="remove">Remove (מחיקת מידה)</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <fieldset className="p-3 border border-[#B9895B]/20 rounded-lg bg-white/40">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1E1E]">
                            <input type="checkbox" checked={useL} onChange={(e) => setUseL(e.target.checked)} className="accent-[#B9895B]" />
                            L
                        </label>

                        {action === "set" && (
                            <div className="mt-2 space-y-2">
                                <input
                                    placeholder="initial"
                                    value={lInitial}
                                    onChange={(e) => setLInitial(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                                <input
                                    placeholder="current"
                                    value={lCurrent}
                                    onChange={(e) => setLCurrent(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}

                        {(action === "add" || action === "subtract") && (
                            <div className="mt-2">
                                <input
                                    placeholder="delta"
                                    value={lDelta}
                                    onChange={(e) => setLDelta(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}

                        {action === "reset" && (
                            <div className="mt-2">
                                <input
                                    placeholder="initial (אופציונלי)"
                                    value={lInitial}
                                    onChange={(e) => setLInitial(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}
                    </fieldset>

                    <fieldset className="p-3 border border-[#B9895B]/20 rounded-lg bg-white/40">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1E1E]">
                            <input type="checkbox" checked={useXL} onChange={(e) => setUseXL(e.target.checked)} className="accent-[#B9895B]" />
                            XL
                        </label>

                        {action === "set" && (
                            <div className="mt-2 space-y-2">
                                <input
                                    placeholder="initial"
                                    value={xlInitial}
                                    onChange={(e) => setXLInitial(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                                <input
                                    placeholder="current"
                                    value={xlCurrent}
                                    onChange={(e) => setXLCurrent(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}

                        {(action === "add" || action === "subtract") && (
                            <div className="mt-2">
                                <input
                                    placeholder="delta"
                                    value={xlDelta}
                                    onChange={(e) => setXLDelta(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}

                        {action === "reset" && (
                            <div className="mt-2">
                                <input
                                    placeholder="initial (אופציונלי)"
                                    value={xlInitial}
                                    onChange={(e) => setXLInitial(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}
                    </fieldset>

                    <fieldset className="p-3 border border-[#B9895B]/20 rounded-lg bg-white/40">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1E1E]">
                            <input
                                type="checkbox"
                                checked={useXXL}
                                onChange={(e) => setUseXXL(e.target.checked)}
                                className="accent-[#B9895B]"
                            />
                            XXL
                        </label>

                        {action === "set" && (
                            <div className="mt-2 space-y-2">
                                <input
                                    placeholder="initial"
                                    value={xxlInitial}
                                    onChange={(e) => setXXLInitial(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                                <input
                                    placeholder="current"
                                    value={xxlCurrent}
                                    onChange={(e) => setXXLCurrent(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}

                        {(action === "add" || action === "subtract") && (
                            <div className="mt-2">
                                <input
                                    placeholder="delta"
                                    value={xxlDelta}
                                    onChange={(e) => setXXLDelta(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}

                        {action === "reset" && (
                            <div className="mt-2">
                                <input
                                    placeholder="initial (אופציונלי)"
                                    value={xxlInitial}
                                    onChange={(e) => setXXLInitial(e.target.value)}
                                    className="w-full p-2 border border-[#B9895B]/20 rounded bg-white/60"
                                />
                            </div>
                        )}
                    </fieldset>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-1/3 rounded-xl border border-[#B9895B]/25 bg-white/50 py-2.5 font-extrabold text-[#1E1E1E] hover:bg-white/60 active:bg-white/70"
                    >
                        ביטול
                    </button>

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onSubmit}
                        className={`w-2/3 rounded-xl py-2.5 font-extrabold text-white ${disabled ? "bg-[#B9895B]/35 cursor-not-allowed" : "bg-[#B9895B] hover:brightness-95 active:brightness-90"
                            }`}
                    >
                        שמירה
                    </button>
                </div>
            </div>
        </div>
    );
}
