import { FaPaintBrush, FaPlus } from "react-icons/fa";
import { SKETCH_CATEGORIES, type SketchCategory } from "./types";
import { CardShell, Field, FilePick, PrimaryBtn } from "./ui";
import { FaTrash } from "react-icons/fa";

const SketchesSection = ({
    apiBase,
    loading,
    imagesByCategory,
    selectedCategory,
    setSelectedCategory,
    imageFile,
    setImageFile,
    onUpload,
    onDelete,
}: {
    apiBase: string;
    loading: boolean;
    imagesByCategory: Record<string, string[]>;
    selectedCategory: SketchCategory;
    setSelectedCategory: React.Dispatch<React.SetStateAction<SketchCategory>>;
    imageFile: File | null;
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
    onUpload: () => void;
    onDelete: (category: string, fileUrl: string) => void;
}) => {
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

                    <PrimaryBtn onClick={onUpload} icon={<FaPlus />}>
                        העלה סקיצה
                    </PrimaryBtn>
                </div>
            </CardShell>

            <div className="space-y-6">
                {SKETCH_CATEGORIES.map((cat) => (
                    <div key={cat} className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-lg font-extrabold text-[#1E1E1E]">{cat.toUpperCase()}</div>
                            <div className="text-sm text-[#1E1E1E]/60 text-end">
                                {imagesByCategory[cat]?.length || 0} תמונות
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-white/25 border border-[#B9895B]/14 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                {(imagesByCategory[cat] || []).map((imgUrl) => (
                                    <div
                                        key={imgUrl}
                                        className="group relative overflow-hidden rounded-2xl border border-[#B9895B]/14 bg-white/35 backdrop-blur shadow-[0_12px_40px_rgba(30,30,30,0.10)]"
                                    >
                                        <img
                                            src={`${apiBase}/${imgUrl}`}
                                            alt="sketch"
                                            className="object-cover w-full aspect-square"
                                            loading="lazy"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => onDelete(cat, imgUrl)}
                                            className="absolute transition opacity-0 top-2 left-2 group-hover:opacity-100"
                                            aria-label="מחיקה"
                                            title="מחיקה"
                                        >
                                            <div className="grid w-10 h-10 text-red-600 border place-items-center rounded-2xl bg-white/55 border-red-200/70 hover:bg-white/70">
                                                <FaTrash />
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SketchesSection;
