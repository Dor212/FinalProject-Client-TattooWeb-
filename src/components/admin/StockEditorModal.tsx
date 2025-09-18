import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Product } from "../../Types/TProduct";

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
    apiBase: string; 
    onUpdated: (updated: Product) => void; 
};

const isPositiveInt = (v: string) => /^\d+$/.test(v);

export default function StockEditorModal({ open, onClose, product, apiBase, onUpdated }: Props) {
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
        
        if (action === "remove") {
            return !(useL || useXL || useXXL);
        }
        if (action === "reset") {
           
            return !(useL || useXL || useXXL);
        }
        if (action === "add" || action === "subtract") {
            const okL = !useL || (useL && isPositiveInt(lDelta) && +lDelta > 0);
            const okXL = !useXL || (useXL && isPositiveInt(xlDelta) && +xlDelta > 0);
            const okXXL = !useXXL || (useXXL && isPositiveInt(xxlDelta) && +xxlDelta > 0);
            return !(useL || useXL || useXXL) || !(okL && okXL && okXXL);
        }
        
        const validL = useL && ((lInitial === "" || isPositiveInt(lInitial)) && (lCurrent === "" || isPositiveInt(lCurrent)));
        const validXL = useXL && ((xlInitial === "" || isPositiveInt(xlInitial)) && (xlCurrent === "" || isPositiveInt(xlCurrent)));
        const validXXL = useXXL && ((xxlInitial === "" || isPositiveInt(xxlInitial)) && (xxlCurrent === "" || isPositiveInt(xxlCurrent)));
        return !(useL || useXL || useXXL) || !(validL || validXL || validXXL);
    }, [action, useL, useXL, useXXL, lDelta, xlDelta, xxlDelta, lInitial, lCurrent, xlInitial, xlCurrent, xxlInitial, xxlCurrent]);

    
    const maybePut = <T extends object>(
        flag: boolean,
        key: SizeKey,
        data: T,
        target: Partial<Record<SizeKey, T>>
    ): void => {
        if (flag) target[key] = data;
    };

    const buildPayload = (): PatchPayload => {
        if (action === "set") {
            const sizes: SetSizes = {};
            maybePut(useL, "l", { ...(lInitial !== "" ? { initial: Number(lInitial) } : {}), ...(lCurrent !== "" ? { current: Number(lCurrent) } : {}) }, sizes);
            maybePut(useXL, "xl", { ...(xlInitial !== "" ? { initial: Number(xlInitial) } : {}), ...(xlCurrent !== "" ? { current: Number(xlCurrent) } : {}) }, sizes);
            maybePut(useXXL, "xxl", { ...(xxlInitial !== "" ? { initial: Number(xxlInitial) } : {}), ...(xxlCurrent !== "" ? { current: Number(xxlCurrent) } : {}) }, sizes);
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

        // remove
        const sizes: EmptySizes = {};
        if (useL) sizes.l = {};
        if (useXL) sizes.xl = {};
        if (useXXL) sizes.xxl = {};
        return { action, sizes, createStockIfMissing: true };
    };

    const onSubmit = async () => {
        try {
            const payload = buildPayload();
            const { data } = await axios.patch<{ message: string; product: Product }>(
                `${apiBase}/products/${product._id}/stock`,
                payload
            );
            onUpdated(data.product);
            Swal.fire({ icon: "success", title: "עודכן!", timer: 1200, showConfirmButton: false });
            onClose();
        } catch (err: unknown) {
            const msg =
                (axios.isAxiosError(err) && err.response?.data && (err.response.data as { error?: string }).error) ||
                "Failed to update stock";
            Swal.fire({ icon: "error", title: "שגיאה", text: msg });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-xl p-6 bg-white shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">ניהול מלאי — {product.title}</h3>
                    <button onClick={onClose} className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700">✕</button>
                </div>

                {/* Action */}
                <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-3">
                    <label className="col-span-1 text-sm font-medium md:col-span-3">פעולה</label>
                    <select value={action} onChange={(e) => setAction(e.target.value as Action)} className="p-2 border rounded">
                        <option value="set">Set (קבע ערכים)</option>
                        <option value="add">Add (הגדלת מלאי)</option>
                        <option value="subtract">Subtract (הפחתת מלאי)</option>
                        <option value="reset">Reset (איפוס current ל־initial)</option>
                        <option value="remove">Remove (מחיקת מידה)</option>
                    </select>
                </div>

                {/* Sizes */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* L */}
                    <fieldset className="p-3 border rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-semibold">
                            <input type="checkbox" checked={useL} onChange={(e) => setUseL(e.target.checked)} />
                            L
                        </label>
                        {action === "set" && (
                            <div className="mt-2 space-y-2">
                                <input placeholder="initial" value={lInitial} onChange={(e) => setLInitial(e.target.value)} className="w-full p-2 border rounded" />
                                <input placeholder="current" value={lCurrent} onChange={(e) => setLCurrent(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                        {(action === "add" || action === "subtract") && (
                            <div className="mt-2">
                                <input placeholder="delta" value={lDelta} onChange={(e) => setLDelta(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                        {action === "reset" && (
                            <div className="mt-2">
                                <input placeholder="initial (אופציונלי)" value={lInitial} onChange={(e) => setLInitial(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                    </fieldset>

                    {/* XL */}
                    <fieldset className="p-3 border rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-semibold">
                            <input type="checkbox" checked={useXL} onChange={(e) => setUseXL(e.target.checked)} />
                            XL
                        </label>
                        {action === "set" && (
                            <div className="mt-2 space-y-2">
                                <input placeholder="initial" value={xlInitial} onChange={(e) => setXLInitial(e.target.value)} className="w-full p-2 border rounded" />
                                <input placeholder="current" value={xlCurrent} onChange={(e) => setXLCurrent(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                        {(action === "add" || action === "subtract") && (
                            <div className="mt-2">
                                <input placeholder="delta" value={xlDelta} onChange={(e) => setXLDelta(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                        {action === "reset" && (
                            <div className="mt-2">
                                <input placeholder="initial (אופציונלי)" value={xlInitial} onChange={(e) => setXLInitial(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                    </fieldset>

                    {/* XXL */}
                    <fieldset className="p-3 border rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-semibold">
                            <input type="checkbox" checked={useXXL} onChange={(e) => setUseXXL(e.target.checked)} />
                            XXL
                        </label>
                        {action === "set" && (
                            <div className="mt-2 space-y-2">
                                <input placeholder="initial" value={xxlInitial} onChange={(e) => setXXLInitial(e.target.value)} className="w-full p-2 border rounded" />
                                <input placeholder="current" value={xxlCurrent} onChange={(e) => setXXLCurrent(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                        {(action === "add" || action === "subtract") && (
                            <div className="mt-2">
                                <input placeholder="delta" value={xxlDelta} onChange={(e) => setXXLDelta(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                        {action === "reset" && (
                            <div className="mt-2">
                                <input placeholder="initial (אופציונלי)" value={xxlInitial} onChange={(e) => setXXLInitial(e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                        )}
                    </fieldset>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 border rounded">בטל</button>
                    <button onClick={onSubmit} disabled={disabled} className={`rounded px-4 py-2 text-white ${disabled ? "bg-gray-400" : "bg-[#97BE5A] hover:bg-[#7ea649]"}`}>
                        שמור
                    </button>
                </div>
            </div>
        </div>
    );
}
