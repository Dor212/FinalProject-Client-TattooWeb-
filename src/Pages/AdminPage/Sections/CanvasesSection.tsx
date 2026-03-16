import { useEffect, useMemo, useState } from "react";
import { FaImages, FaLayerGroup, FaPaintBrush, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import type { CanvasItem, CanvasSize } from "./types";
import { CardShell, DangerIconBtn, Field, Input, PrimaryBtn, cls } from "./ui";

type ColorVariantDraft = {
    id: string;
    color: string;
    image: File | null;
};

type UploadVariant = {
    id: string;
    color: string;
    label?: string;
    image: File | null;
};

type UploadCanvasPayload = {
    id?: string;
    name: string;
    size: CanvasSize;
    images: File[];
    variants?: UploadVariant[];
};

const createId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const uniqueStrings = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

const MainImagesPick = ({
    files,
    onPick,
    buttonText = "בחר תמונות",
}: {
    files: File[];
    onPick: (files: File[]) => void;
    buttonText?: string;
}) => (
    <div className="space-y-2">
        <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/35 px-4 py-3 text-sm font-semibold text-[#1E1E1E] transition hover:bg-white/45">
            <FaImages className="text-[#B9895B]" />
            {buttonText}
            <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => onPick(Array.from(e.target.files || []))}
            />
        </label>

        <div className="text-xs text-[#1E1E1E]/70 text-end">
            {files.length ? `${files.length} קבצים נבחרו` : "לא נבחרו קבצים"}
        </div>

        {files.length > 0 && (
            <div className="rounded-2xl border border-[#B9895B]/14 bg-white/22 p-3">
                <div className="space-y-1 text-xs text-[#1E1E1E]/75 text-end">
                    {files.slice(0, 5).map((file, idx) => (
                        <div key={`${file.name}-${idx}`} className="truncate">
                            {file.name}
                        </div>
                    ))}
                    {files.length > 5 ? <div>+{files.length - 5} נוספים</div> : null}
                </div>
            </div>
        )}
    </div>
);

const VariantEditor = ({
    variant,
    index,
    onChange,
    onRemove,
}: {
    variant: ColorVariantDraft;
    index: number;
    onChange: (patch: Partial<ColorVariantDraft>) => void;
    onRemove: () => void;
}) => {
    return (
        <div className="rounded-2xl border border-[#B9895B]/16 bg-white/22 p-4">
            <div className="grid gap-3 sm:grid-cols-[140px,1fr,42px] sm:items-center">
                <div className="rounded-2xl border border-[#B9895B]/14 bg-white/25 p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-xs font-extrabold text-[#1E1E1E]/80">צבע #{index + 1}</div>

                        <div className="flex items-center gap-2">
                            <div
                                className="h-8 w-10 rounded-xl border border-[#B9895B]/20"
                                style={{ background: variant.color }}
                                aria-hidden
                            />
                            <input
                                type="color"
                                value={variant.color}
                                onChange={(e) => onChange({ color: e.target.value })}
                                className={cls(
                                    "h-8 w-10 cursor-pointer rounded-xl border border-[#B9895B]/20 bg-transparent p-0",
                                    "appearance-none overflow-hidden"
                                )}
                                title="בחר צבע"
                            />
                        </div>
                    </div>

                    <div className="mt-2 text-[11px] text-[#1E1E1E]/55 text-end">{variant.color}</div>
                </div>

                <div className="min-w-0">
                    <div className="mb-1 text-xs font-extrabold text-[#1E1E1E]/70 text-end">תמונה לצבע</div>
                    <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/35 px-4 py-3 text-sm font-semibold text-[#1E1E1E] transition hover:bg-white/45">
                        <FaPaintBrush className="text-[#B9895B]" />
                        בחר תמונה
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => onChange({ image: e.target.files?.[0] || null })}
                        />
                    </label>
                    <div className="mt-2 text-xs text-[#1E1E1E]/70 text-end">
                        {variant.image?.name || "לא נבחר קובץ"}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onRemove}
                    className="grid text-red-700 border h-11 w-11 place-items-center rounded-2xl border-red-200/70 bg-white/55 hover:bg-white/70"
                    title="הסר צבע"
                    aria-label="הסר צבע"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

const CanvasesSection = ({
    loading,
    canvases,
    onUpload,
    onDelete,
}: {
    loading: boolean;
    canvases: CanvasItem[];
    onUpload: (payload: UploadCanvasPayload) => Promise<{ ok: boolean }>;
    onDelete: (id: string) => void | Promise<boolean>;
}) => {
    const [canvasName, setCanvasName] = useState("");
    const [canvasSize, setCanvasSize] = useState<CanvasSize>("80×25");
    const [canvasImages, setCanvasImages] = useState<File[]>([]);

    const [colorsOpen, setColorsOpen] = useState(false);
    const [variants, setVariants] = useState<ColorVariantDraft[]>([]);

    const hasColors = variants.length > 0;

    const canSubmit = useMemo(() => {
        if (!canvasName.trim()) return false;
        if (!canvasImages.length) return false;
        if (!hasColors) return true;
        return variants.every((v) => Boolean(v.color) && Boolean(v.image));
    }, [canvasImages.length, canvasName, hasColors, variants]);

    const addVariant = () => {
        setVariants((prev) => [...prev, { id: createId(), color: "#000000", image: null }]);
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

        const payload: UploadCanvasPayload = {
            name: canvasName.trim(),
            size: canvasSize,
            images: canvasImages,
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
        setCanvasImages([]);
        resetColors();
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[440px,1fr]">
            <CardShell>
                <div className="border-b border-[#B9895B]/15 px-7 pb-5 pt-7">
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-extrabold text-[#1E1E1E]">העלאת קאנבס</div>
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#B9895B]/12 text-[#B9895B]">
                            <FaLayerGroup />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-[#1E1E1E]/65 text-end">
                        שם + מידה + לפחות תמונה ראשית אחת. אפשר להוסיף כמה תמונות וכמה צבעים.
                    </div>
                </div>

                <div className="py-6 space-y-4 px-7">
                    <Field label="שם קאנבס">
                        <Input
                            value={canvasName}
                            onChange={(e) => setCanvasName(e.target.value)}
                            placeholder="לדוגמה: Canvas Wave"
                        />
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

                    <Field label="תמונות ראשיות" hint="אפשר להעלות כמה זוויות צילום כבר בהעלאה הראשונית">
                        <MainImagesPick files={canvasImages} onPick={setCanvasImages} buttonText="בחר תמונות ראשיות" />
                    </Field>

                    <button
                        type="button"
                        onClick={() => setColorsOpen((s) => !s)}
                        className={cls(
                            "flex w-full items-center justify-between gap-3 rounded-2xl border border-[#B9895B]/14 bg-white/25 px-4 py-3"
                        )}
                    >
                        <div className="text-end">
                            <div className="text-sm font-extrabold text-[#1E1E1E]">קיימים עוד צבעים?</div>
                            <div className="mt-0.5 text-xs text-[#1E1E1E]/60">
                                {hasColors ? `${variants.length} צבעים מוגדרים` : "פתח כדי להוסיף וריאציות צבע"}
                            </div>
                        </div>

                        <div className="grid h-9 w-9 place-items-center rounded-2xl border border-[#B9895B]/14 bg-white/35 text-[#1E1E1E]/80">
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
                                <VariantEditor
                                    key={v.id}
                                    variant={v}
                                    index={idx}
                                    onChange={(patch) => updateVariant(v.id, patch)}
                                    onRemove={() => removeVariant(v.id)}
                                />
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
                    <div className="text-sm text-[#1E1E1E]/65 text-end">
                        אפשר להחליף תמונה, לעבור בין צבעים, ולערוך כל קאנבס קיים.
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[320px] animate-pulse rounded-[26px] border border-[#B9895B]/14 bg-white/25" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {canvases.map((c) => (
                            <CanvasCard
                                key={String(c._id ?? c.name)}
                                canvas={c}
                                onUpload={onUpload}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CanvasCard = ({
    canvas,
    onUpload,
    onDelete,
}: {
    canvas: CanvasItem;
    onUpload: (payload: UploadCanvasPayload) => Promise<{ ok: boolean }>;
    onDelete: (id: string) => void | Promise<boolean>;
}) => {
    const gallery = useMemo(
        () => uniqueStrings([...(canvas.imageUrls || []), canvas.imageUrl]),
        [canvas.imageUrl, canvas.imageUrls]
    );

    const variants = Array.isArray(canvas.variants) ? canvas.variants : [];
    const [active, setActive] = useState<string>(gallery[0] || canvas.imageUrl || "");
    const [editOpen, setEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editName, setEditName] = useState(canvas.name);
    const [editSize, setEditSize] = useState<CanvasSize>(canvas.size);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [variantsToAdd, setVariantsToAdd] = useState<ColorVariantDraft[]>([]);

    useEffect(() => {
        const first = gallery[0] || canvas.imageUrl || variants[0]?.imageUrl || "";
        setActive((prev) => {
            const all = uniqueStrings([
                ...gallery,
                ...variants.map((v) => v.imageUrl),
            ]);
            return all.includes(prev) ? prev : first;
        });
    }, [canvas.imageUrl, gallery, variants]);

    useEffect(() => {
        setEditName(canvas.name);
        setEditSize(canvas.size);
        setNewImages([]);
        setVariantsToAdd([]);
        setEditOpen(false);
    }, [canvas._id, canvas.name, canvas.size]);

    const addVariantDraft = () => {
        setVariantsToAdd((prev) => [...prev, { id: createId(), color: "#000000", image: null }]);
        setEditOpen(true);
    };

    const updateVariantDraft = (id: string, patch: Partial<ColorVariantDraft>) => {
        setVariantsToAdd((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    };

    const removeVariantDraft = (id: string) => {
        setVariantsToAdd((prev) => prev.filter((v) => v.id !== id));
    };

    const hasNewVariantDrafts = variantsToAdd.length > 0;
    const validNewVariants = variantsToAdd.every((v) => Boolean(v.color) && Boolean(v.image));

    const isDirty =
        editName.trim() !== canvas.name ||
        editSize !== canvas.size ||
        newImages.length > 0 ||
        variantsToAdd.length > 0;

    const canSave = Boolean(canvas._id && editName.trim() && isDirty && validNewVariants);

    const saveChanges = async () => {
        if (!canvas._id || !canSave || saving) return;

        setSaving(true);
        try {
            const res = await onUpload({
                id: canvas._id,
                name: editName.trim(),
                size: editSize,
                images: newImages,
                variants: hasNewVariantDrafts
                    ? variantsToAdd.map((v) => ({
                        id: v.id,
                        color: v.color,
                        image: v.image,
                    }))
                    : undefined,
            });

            if (!res.ok) return;

            setNewImages([]);
            setVariantsToAdd([]);
            setEditOpen(false);
        } finally {
            setSaving(false);
        }
    };

    const allThumbs = uniqueStrings([
        ...gallery,
        ...variants.map((v) => v.imageUrl),
    ]);

    return (
        <div className="relative overflow-hidden rounded-[26px] border border-[#B9895B]/16 bg-white/35 backdrop-blur shadow-[0_14px_55px_rgba(30,30,30,0.12)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(185,137,91,0.12),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(232,217,194,0.26),transparent_55%)]" />

            <div className="relative p-4">
                <div className="relative overflow-hidden rounded-2xl border border-[#B9895B]/12 bg-white/40">
                    <img src={active} alt={canvas.name} className="object-cover w-full h-48" loading="lazy" />
                </div>

                {allThumbs.length > 1 && (
                    <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
                        {gallery.map((url, idx) => (
                            <button
                                key={`${url}-${idx}`}
                                type="button"
                                onClick={() => setActive(url)}
                                className={cls(
                                    "h-12 w-12 overflow-hidden rounded-xl border border-[#B9895B]/16 bg-white/65",
                                    active === url ? "ring-2 ring-[#B9895B]/40" : "hover:ring-2 hover:ring-[#B9895B]/25"
                                )}
                                title={`תמונה ${idx + 1}`}
                                aria-label={`תמונה ${idx + 1}`}
                            >
                                <img src={url} alt="" className="object-cover w-full h-full" loading="lazy" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-start justify-between gap-3 mt-3">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold text-[#1E1E1E] text-end">{canvas.name}</div>
                        <div className="mt-1 text-xs font-semibold text-[#1E1E1E]/65 text-end">{canvas.size}</div>
                        <div className="mt-1 text-[11px] text-[#1E1E1E]/50 text-end">
                            {gallery.length} תמונות ראשיות · {variants.length} צבעים
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {canvas._id ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setEditOpen((s) => !s)}
                                    className="grid h-10 w-10 place-items-center rounded-2xl border border-[#B9895B]/18 bg-white/40 text-[#1E1E1E] transition hover:bg-white/55"
                                    title="עריכה"
                                    aria-label="עריכה"
                                >
                                    <FaPen />
                                </button>
                                <DangerIconBtn onClick={() => onDelete(canvas._id!)} title="מחיקה" />
                            </>
                        ) : null}
                    </div>
                </div>

                {variants.length > 0 && (
                    <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
                        {variants.map((v) => (
                            <button
                                key={v.id}
                                type="button"
                                onClick={() => setActive(v.imageUrl)}
                                className={cls(
                                    "h-7 w-7 rounded-xl border border-[#B9895B]/18",
                                    active === v.imageUrl ? "ring-2 ring-[#B9895B]/40" : "hover:ring-2 hover:ring-[#B9895B]/25"
                                )}
                                style={{ background: v.color }}
                                title={v.label || v.color}
                                aria-label={`בחר צבע: ${v.label || v.color}`}
                            />
                        ))}
                    </div>
                )}

                {editOpen && canvas._id && (
                    <div className="mt-4 space-y-4 rounded-[22px] border border-[#B9895B]/16 bg-white/28 p-4">
                        <div className="text-sm font-extrabold text-[#1E1E1E] text-end">עריכת קאנבס</div>

                        <Field label="שם">
                            <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </Field>

                        <Field label="מידה">
                            <select
                                value={editSize}
                                onChange={(e) => setEditSize(e.target.value as CanvasSize)}
                                className="w-full rounded-2xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                            >
                                <option value="80×25">80×25</option>
                                <option value="50×40">50×40</option>
                                <option value="80×60">80×60</option>
                            </select>
                        </Field>

                        <Field label="הוסף עוד תמונות ראשיות">
                            <MainImagesPick files={newImages} onPick={setNewImages} buttonText="בחר תמונות נוספות" />
                        </Field>

                        <div className="space-y-3 rounded-2xl border border-[#B9895B]/14 bg-white/18 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={addVariantDraft}
                                    className="rounded-2xl border border-[#B9895B]/18 bg-[#B9895B]/10 px-4 py-2.5 text-sm font-extrabold text-[#1E1E1E] hover:bg-[#B9895B]/12"
                                >
                                    הוסף צבע
                                </button>
                                <div className="text-sm font-extrabold text-[#1E1E1E] text-end">הוסף צבעים חדשים</div>
                            </div>

                            {variantsToAdd.length === 0 ? (
                                <div className="text-xs text-[#1E1E1E]/60 text-end">
                                    עדיין לא נוספו צבעים חדשים בעריכה הזאת
                                </div>
                            ) : (
                                variantsToAdd.map((variant, idx) => (
                                    <VariantEditor
                                        key={variant.id}
                                        variant={variant}
                                        index={idx}
                                        onChange={(patch) => updateVariantDraft(variant.id, patch)}
                                        onRemove={() => removeVariantDraft(variant.id)}
                                    />
                                ))
                            )}
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditName(canvas.name);
                                    setEditSize(canvas.size);
                                    setNewImages([]);
                                    setVariantsToAdd([]);
                                    setEditOpen(false);
                                }}
                                className="w-full rounded-2xl border border-[#B9895B]/18 bg-white/22 px-4 py-3 text-sm font-extrabold text-[#1E1E1E]/80 hover:bg-white/28"
                            >
                                ביטול
                            </button>

                            <PrimaryBtn
                                onClick={saveChanges}
                                icon={<FaPlus />}
                                disabled={!canSave || saving}
                                className="!w-full"
                            >
                                {saving ? "שומר..." : "שמור שינויים"}
                            </PrimaryBtn>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasesSection;