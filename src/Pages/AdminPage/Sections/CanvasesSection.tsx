import { useMemo, useState } from "react";
import { FaLayerGroup, FaPlus, FaTrash } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import type { CanvasItem, CanvasSize } from "./types";
import { CardShell, DangerIconBtn, Field, FilePick, Input, PrimaryBtn, cls } from "./ui";

type ColorVariantDraft = {
    id: string;
    color: string;
    image: File | null;
};

type UploadVariant = {
    id: string;
    color: string;
    image: File | null;
};


const CanvasesSection = ({
    loading,
    canvases,
    onUpload,
    onDelete,
}: {
    loading: boolean;
    canvases: CanvasItem[];
    onUpload: (payload: {
        name: string;
        size: CanvasSize;
        image: File | null;
        variants?: UploadVariant[];
    }) => Promise<{ ok: boolean }>;
    onDelete: (id: string) => void | Promise<boolean>;
}) => {
    const [canvasName, setCanvasName] = useState("");
    const [canvasSize, setCanvasSize] = useState<CanvasSize>("80×25");
    const [canvasImage, setCanvasImage] = useState<File | null>(null);

    const [colorsOpen, setColorsOpen] = useState(false);
    const [variants, setVariants] = useState<ColorVariantDraft[]>([]);

    const hasColors = variants.length > 0;

    const canSubmit = useMemo(() => {
        if (!canvasName.trim()) return false;
        if (!canvasImage) return false;
        if (!hasColors) return true;
        return variants.every((v) => Boolean(v.color) && Boolean(v.image));
    }, [canvasName, canvasImage, hasColors, variants]);

    const addVariant = () => {
        setVariants((prev) => [...prev, { id: crypto.randomUUID(), color: "#000000", image: null }]);
        setColorsOpen(true);
    };

    const updateVariant = (id: string, patch: Partial<ColorVariantDraft>) => {
        setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    };

    const removeVariant = (id: string) => {
        setVariants((prev) => prev.filter((v) => v.id !== id));
    };

    const resetColors = () => {
        setVariants([]);
        setColorsOpen(false);
    };

    const submit = async () => {
        if (!canSubmit) return;

        const payload = {
            name: canvasName.trim(),
            size: canvasSize,
            image: canvasImage,
            variants: hasColors
                ? variants.map<UploadVariant>((v) => ({
                    id: v.id,
                    color: v.color,
                    image: v.image,
                }))
                : undefined,
        };

        const res = await onUpload(payload);
        if (!res.ok) return;

        setCanvasName("");
        setCanvasSize("80×25");
        setCanvasImage(null);
        resetColors();
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
            <CardShell>
                <div className="px-7 pt-7 pb-5 border-b border-[#B9895B]/15">
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-extrabold text-[#1E1E1E]">העלאת קאנבס</div>
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#B9895B]/12 text-[#B9895B]">
                            <FaLayerGroup />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-[#1E1E1E]/65 text-end">שם + מידה + תמונה ראשית חובה. צבעים נוספים אופציונלי.</div>
                </div>

                <div className="py-6 space-y-4 px-7">
                    <Field label="שם קאנבס">
                        <Input value={canvasName} onChange={(e) => setCanvasName(e.target.value)} placeholder="לדוגמה: Canvas Wave" />
                    </Field>

                    <Field label="מידה">
                        <select
                            value={canvasSize}
                            onChange={(e) => setCanvasSize(e.target.value as CanvasSize)}
                            className="w-full rounded-2xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                        >
                            <option value="80×25">80×25</option>
                            <option value="50×40">50×40</option>
                            <option value="80×60">80×60</option>
                        </select>
                    </Field>

                    <Field label="תמונה ראשית">
                        <FilePick value={canvasImage?.name} onPick={setCanvasImage} />
                    </Field>
                    <button
                        type="button"
                        onClick={() => setColorsOpen((s) => !s)}
                        className={cls(
                            "w-full rounded-2xl border border-[#B9895B]/14 bg-white/25 px-4 py-3",
                            "flex items-center justify-between gap-3",
                        )}
                    >
                        <div className="text-end">
                            <div className="text-sm font-extrabold text-[#1E1E1E]">קיימים עוד צבעים?</div>
                            <div className="mt-0.5 text-xs text-[#1E1E1E]/60">
                                {hasColors ? `${variants.length} צבעים מוגדרים` : "לא חובה. פתח כדי להוסיף וריאציות צבע"}
                            </div>
                        </div>

                        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/35 border border-[#B9895B]/14 text-[#1E1E1E]/80">
                            {colorsOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </button>

                    {colorsOpen && (
                        <div className="space-y-3">
                            {!hasColors ? (
                                <div className="rounded-2xl border border-[#B9895B]/14 bg-white/18 p-4 text-sm text-[#1E1E1E]/70 text-end">
                                    עדיין אין צבעים. לחץ “הוסף צבע” כדי להוסיף תמונה נוספת לפי צבע.
                                </div>
                            ) : null}

                            {variants.map((v, idx) => (
                                <div key={v.id} className="rounded-2xl border border-[#B9895B]/16 bg-white/22 p-4">
                                    <div className="grid gap-3 sm:grid-cols-[140px,1fr,42px] sm:items-center">
                                        <div className="rounded-2xl border border-[#B9895B]/14 bg-white/25 p-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-xs font-extrabold text-[#1E1E1E]/80">צבע #{idx + 1}</div>

                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-8 w-10 rounded-xl border border-[#B9895B]/20"
                                                        style={{ background: v.color }}
                                                        aria-hidden
                                                    />
                                                    <input
                                                        type="color"
                                                        value={v.color}
                                                        onChange={(e) => updateVariant(v.id, { color: e.target.value })}
                                                        className={cls(
                                                            "h-8 w-10 cursor-pointer rounded-xl border border-[#B9895B]/20 bg-transparent p-0",
                                                            "appearance-none overflow-hidden",
                                                        )}
                                                        title="בחר צבע"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-2 text-[11px] text-[#1E1E1E]/55 text-end">{v.color}</div>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-extrabold text-[#1E1E1E]/70 text-end mb-1">תמונה לצבע</div>
                                            <FilePick
                                                value={v.image?.name}
                                                onPick={(file) => updateVariant(v.id, { image: file })}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeVariant(v.id)}
                                            className="grid text-red-700 border h-11 w-11 place-items-center rounded-2xl border-red-200/70 bg-white/55 hover:bg-white/70"
                                            title="הסר צבע"
                                            aria-label="הסר צבע"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="grid gap-2 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="w-full rounded-2xl border border-[#B9895B]/18 bg-[#B9895B]/10 px-4 py-3 text-sm font-extrabold text-[#1E1E1E] hover:bg-[#B9895B]/12 active:bg-[#B9895B]/14"
                                >
                                    הוסף צבע
                                </button>
                                {hasColors && (
                                    <button
                                        type="button"
                                        onClick={resetColors}
                                        className="w-full rounded-2xl border border-[#B9895B]/18 bg-white/18 px-4 py-3 text-sm font-extrabold text-[#1E1E1E]/80 hover:bg-white/22 active:bg-white/26"
                                    >
                                        נקה צבעים
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <PrimaryBtn onClick={submit} icon={<FaPlus />} disabled={!canSubmit}>
                        העלה קאנבס
                    </PrimaryBtn>
                </div>
            </CardShell>

            <div className="space-y-4">
                <div className="flex items-end justify-between gap-3">
                    <div className="text-xl font-extrabold text-[#1E1E1E]">רשימת קאנבסים</div>
                    <div className="text-sm text-[#1E1E1E]/65 text-end">לחיצה על צבע מחליפה תמונה.</div>
                </div>

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[260px] rounded-[26px] bg-white/25 border border-[#B9895B]/14 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {canvases.map((c) => (
                            <CanvasCard key={String(c._id ?? c.name)} canvas={c} onDelete={onDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CanvasCard = ({ canvas, onDelete }: { canvas: CanvasItem; onDelete: (id: string) => void | Promise<boolean> }) => {
    const [active, setActive] = useState<string>(canvas.imageUrl);

    const variants = Array.isArray(canvas.variants) ? canvas.variants : [];
    const swatches = [
        { key: "main", color: "#E8D9C2", url: canvas.imageUrl, title: "ראשי" },
        ...variants.map((v) => ({ key: v.id, color: v.color, url: v.imageUrl, title: v.label || v.color })),
    ];

    return (
        <div className="relative overflow-hidden rounded-[26px] border border-[#B9895B]/16 bg-white/35 backdrop-blur shadow-[0_14px_55px_rgba(30,30,30,0.12)]">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(185,137,91,0.12),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(232,217,194,0.26),transparent_55%)]" />

            <div className="relative p-4">
                <div className="relative overflow-hidden rounded-2xl border border-[#B9895B]/12 bg-white/40">
                    <img src={active} alt={canvas.name} className="object-cover w-full h-44" loading="lazy" />
                </div>

                <div className="flex items-start justify-between gap-3 mt-3">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold text-[#1E1E1E] text-end">{canvas.name}</div>
                        <div className="mt-1 text-xs font-semibold text-[#1E1E1E]/65 text-end">{canvas.size}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        {canvas._id ? <DangerIconBtn onClick={() => onDelete(canvas._id!)} title="מחיקה" /> : null}
                    </div>
                </div>

                {swatches.length > 1 && (
                    <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
                        {swatches.map((s) => (
                            <button
                                key={s.key}
                                type="button"
                                onClick={() => setActive(s.url)}
                                className={cls(
                                    "h-7 w-7 rounded-xl border border-[#B9895B]/18",
                                    active === s.url ? "ring-2 ring-[#B9895B]/40" : "hover:ring-2 hover:ring-[#B9895B]/25",
                                )}
                                style={{ background: s.color }}
                                title={s.title}
                                aria-label={`בחר צבע: ${s.title}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasesSection;
