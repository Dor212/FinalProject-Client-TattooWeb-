import CanvasCard from "./CanvasCard";
import type { CanvasItem } from "./types";


export default function CanvasesGrid({
    items,
    onAdd,
}: {
    items: CanvasItem[];
    onAdd: (item: CanvasItem) => void;
}) {
    return (
        <div className="w-full overflow-x-hidden">
            <div className="grid items-stretch grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((c) => (
                    <div key={c._id} className="min-w-0">
                        <CanvasCard item={c} onAdd={onAdd} />
                    </div>
                ))}
            </div>
        </div>
    );
}
