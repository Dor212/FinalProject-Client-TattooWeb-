import { useState } from "react";
import { FaPaintBrush, FaPlus, FaTrash } from "react-icons/fa";
import { SKETCH_CATEGORIES, type SketchCategory } from "./types";
import { CardShell, Field, FilePick, PrimaryBtn, cls } from "./ui";

const joinUrl = (base: string, maybeUrl: string) => {
    if (!maybeUrl) return "";
    if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
    const b = base.replace(/\/+$/, "");
    const p = maybeUrl.replace(/^\/+/, "");
    return `${b}/${p}`;
};

const SketchesSection = ({
    apiBase,
    loading,
    imagesByCategory,
    onUpload,
    onDelete,
}: {
    apiBase: string;
    loading: boolean;
    imagesByCategory: Record<SketchCategory, string[]>;
    onUpload: (category: SketchCategory, file: File | null) => Promise<boolean>;
    onDelete: (category: SketchCategory, fileUrl: string) => void | Promise<boolean>;
}) => {
    const [selectedCategory, setSelectedCategory] = useState<SketchCategory>("small");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);

    const submit = async () => {
        if (uploading) return;
        if (!imageFile) return;

        setUploading(true);
        try {
            const ok = await onUpload(selectedCategory, imageFile);
            if (!ok) return;
            setImageFile(null);
        } finally {
            setUploading(false);
        }
    };

    const doDelete = async (cat: SketchCategory, imgUrl: string) => {
        const key = `${cat}::${imgUrl}`;
        setDeletingKey(key);
        try {
            await onDelete(cat, imgUrl);
        } finally {
            setDeletingKey(null);
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
            <CardShell>
                <div className="px-7 pt-7 pb-5 border-b border-[#B9895B]/15">
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-extrabold text-[#1E1E1E]">העלאת סקיצה</div>
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#B9895B]/12 text-[#B9895B]">
                            <FaPaintBrush />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-[#1E1E1E]/65 text-end">בחר קטגוריה, קובץ, והעלה.</div>
                </div>

                <div className="py-6 space-y-4 px-7">
                    <Field label="קטגוריה">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as SketchCategory)}
                            className="w-full rounded-2xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25"
                        >
                            {SKETCH_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="קובץ תמונה">
                        <FilePick value={imageFile?.name} onPick={setImageFile} />
                    </Field>

                    <PrimaryBtn onClick={submit} icon={<FaPlus />} disabled={uploading || !imageFile}>
                        {uploading ? "מעבד..." : "העלה סקיצה"}
                    </PrimaryBtn>
                </div>
            </CardShell>

            <div className="space-y-6">
                {SKETCH_CATEGORIES.map((cat) => (
                    <div key={cat} className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-lg font-extrabold text-[#1E1E1E]">{cat.toUpperCase()}</div>
                            <div className="text-sm text-[#1E1E1E]/60 text-end">{imagesByCategory[cat]?.length || 0} תמונות</div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-white/25 border border-[#B9895B]/14 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                {(imagesByCategory[cat] || []).map((imgUrl) => {
                                    const key = `${cat}::${imgUrl}`;
                                    const isDeleting = deletingKey === key;
                                    return (
                                        <div
                                            key={imgUrl}
                                            className="group relative overflow-hidden rounded-2xl border border-[#B9895B]/14 bg-white/35 backdrop-blur shadow-[0_12px_40px_rgba(30,30,30,0.10)]"
                                        >
                                            <img
                                                src={joinUrl(apiBase, imgUrl)}
                                                alt="sketch"
                                                className={cls("object-cover w-full aspect-square", isDeleting && "opacity-60")}
                                                loading="lazy"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => doDelete(cat, imgUrl)}
                                                disabled={isDeleting}
                                                className={cls(
                                                    "absolute transition top-2 left-2",
                                                    "opacity-0 group-hover:opacity-100",
                                                    isDeleting && "opacity-100"
                                                )}
                                                aria-label="מחיקה"
                                                title="מחיקה"
                                            >
                                                <div
                                                    className={cls(
                                                        "grid w-10 h-10 border place-items-center rounded-2xl",
                                                        isDeleting
                                                            ? "bg-white/55 border-red-200/70 text-red-600 opacity-70 cursor-not-allowed"
                                                            : "bg-white/55 border-red-200/70 text-red-600 hover:bg-white/70"
                                                    )}
                                                >
                                                    <FaTrash />
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SketchesSection;
