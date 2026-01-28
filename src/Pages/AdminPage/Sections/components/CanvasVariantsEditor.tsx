import { CanvasVariant } from "../types";

type Props = {
    value: CanvasVariant[];
    onChange: (v: CanvasVariant[]) => void;
};

export default function CanvasVariantsEditor({ value, onChange }: Props) {
    const addVariant = () => {
        onChange([
            ...value,
            {
                id: crypto.randomUUID(),
                label: "",
                color: "#000000",
                imageUrl: "",
            },
        ]);
    };

    const update = (i: number, patch: Partial<CanvasVariant>) => {
        const next = [...value];
        next[i] = { ...next[i], ...patch };
        onChange(next);
    };

    const remove = (i: number) => {
        const next = [...value];
        next.splice(i, 1);
        onChange(next);
    };

    return (
        <div className="mt-4 space-y-4">
            {value.map((v, i) => (
                <div key={v.id} className="rounded-xl border border-[#B9895B]/20 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={v.color}
                            onChange={(e) => update(i, { color: e.target.value })}
                            className="h-10 w-14 cursor-pointer"
                        />

                        <input
                            type="text"
                            placeholder="Color name (optional)"
                            value={v.label || ""}
                            onChange={(e) => update(i, { label: e.target.value })}
                            className="flex-1 rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Image URL"
                        value={v.imageUrl}
                        onChange={(e) => update(i, { imageUrl: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    />

                    <button
                        type="button"
                        onClick={() => remove(i)}
                        className="text-xs text-red-600"
                    >
                        הסר צבע
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addVariant}
                className="rounded-lg bg-[#B9895B] px-4 py-2 text-sm font-bold text-white"
            >
                הוסף צבע
            </button>
        </div>
    );
}
