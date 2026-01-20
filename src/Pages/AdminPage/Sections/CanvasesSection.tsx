import { useState } from "react";
import { FaLayerGroup, FaPlus } from "react-icons/fa";
import type { CanvasItem, CanvasSize } from "./types";
import { CardShell, DangerIconBtn, Field, FilePick, Input, PrimaryBtn } from "./ui";

const CanvasesSection = ({
    loading,
    canvases,
    onUpload,
    onDelete,
}: {
    loading: boolean;
    canvases: CanvasItem[];
    onUpload: (payload: { name: string; size: CanvasSize; image: File | null }) => Promise<{ ok: boolean }>;
    onDelete: (id: string) => void | Promise<boolean>;
}) => {
    const [canvasName, setCanvasName] = useState("");
    const [canvasSize, setCanvasSize] = useState<CanvasSize>("80×25");
    const [canvasImage, setCanvasImage] = useState<File | null>(null);

    const submit = async () => {
        const res = await onUpload({ name: canvasName, size: canvasSize, image: canvasImage });
        if (!res.ok) return;
        setCanvasName("");
        setCanvasSize("80×25");
        setCanvasImage(null);
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
                </div>

                <div className="py-6 space-y-4 px-7">
                    <Field label="שם קאנבס">
                        <Input value={canvasName} onChange={(e) => setCanvasName(e.target.value)} placeholder="לדוגמה: סאקורה בזריחה" />
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

                    <Field label="תמונה">
                        <FilePick value={canvasImage?.name} onPick={setCanvasImage} />
                    </Field>

                    <PrimaryBtn onClick={submit} icon={<FaPlus />}>
                        העלה קאנבס
                    </PrimaryBtn>
                </div>
            </CardShell>

            <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="text-xl font-extrabold text-[#1E1E1E]">קאנבסים בשרת</div>
                    <div className="text-sm text-[#1E1E1E]/65 text-end">ניהול ומחיקה.</div>
                </div>

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[250px] rounded-[26px] bg-white/25 border border-[#B9895B]/14 animate-pulse" />
                        ))}
                    </div>
                ) : canvases.length === 0 ? (
                    <div className="rounded-[26px] border border-[#B9895B]/16 bg-white/35 backdrop-blur p-6 text-end text-sm text-[#1E1E1E]/70">
                        עדיין אין קאנבסים בשרת.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {canvases.map((c) => (
                            <div
                                key={c._id}
                                className="relative overflow-hidden rounded-[26px] border border-[#B9895B]/16 bg-white/35 backdrop-blur shadow-[0_14px_55px_rgba(30,30,30,0.12)]"
                            >
                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(185,137,91,0.12),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(232,217,194,0.26),transparent_55%)]" />
                                <div className="relative p-4">
                                    <div className="relative overflow-hidden rounded-2xl border border-[#B9895B]/12 bg-white/40">
                                        <img src={c.imageUrl} alt={c.name} className="object-cover w-full h-44" loading="lazy" />
                                    </div>

                                    <div className="flex items-start justify-between gap-3 mt-3">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-extrabold text-[#1E1E1E] text-end">{c.name}</div>
                                            <div className="mt-1 text-xs font-semibold text-[#B9895B] text-end">{c.size}</div>
                                        </div>

                                        <DangerIconBtn onClick={() => onDelete(c._id)} title="מחיקה" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasesSection;
