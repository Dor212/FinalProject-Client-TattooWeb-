import { FaBoxOpen, FaLayerGroup, FaPaintBrush } from "react-icons/fa";
import type { AdminTab } from "./types";
import { cls } from "./ui";

const AdminTabs = ({ value, onChange }: { value: AdminTab; onChange: (t: AdminTab) => void }) => {
    const items: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
        { id: "products", label: "מוצרים", icon: <FaBoxOpen /> },
        { id: "sketches", label: "סקיצות", icon: <FaPaintBrush /> },
        { id: "canvases", label: "קאנבסים", icon: <FaLayerGroup /> },
    ];

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {items.map((it) => {
                const active = it.id === value;
                return (
                    <button
                        key={it.id}
                        type="button"
                        onClick={() => onChange(it.id)}
                        className={cls(
                            "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35",
                            active
                                ? "bg-[#B9895B] text-white shadow-[0_14px_40px_rgba(30,30,30,0.16)]"
                                : "bg-white/35 text-[#1E1E1E] border border-[#B9895B]/18 hover:bg-white/45"
                        )}
                    >
                        <span className={cls("text-base", active ? "text-white" : "text-[#B9895B]")}>
                            {it.icon}
                        </span>
                        {it.label}
                    </button>
                );
            })}
        </div>
    );
};

export default AdminTabs;
