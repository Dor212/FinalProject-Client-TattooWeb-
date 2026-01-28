import { FaBoxOpen, FaLayerGroup, FaPaintBrush } from "react-icons/fa";
import type { AdminTab } from "./types";
import { cls } from "./ui";

const tabs: Array<{ key: AdminTab; label: string; icon: JSX.Element }> = [
    { key: "products", label: "מוצרים", icon: <FaBoxOpen /> },
    { key: "sketches", label: "סקיצות", icon: <FaPaintBrush /> },
    { key: "canvases", label: "קאנבסים", icon: <FaLayerGroup /> },
];

const AdminTabs = ({
    value,
    onChange,
}: {
    value: AdminTab;
    onChange: (v: AdminTab) => void;
}) => {
    return (
        <div className="rounded-[26px] border border-[#B9895B]/16 bg-white/30 backdrop-blur p-2 shadow-[0_14px_55px_rgba(30,30,30,0.10)]">
            <div className="grid grid-cols-3 gap-2">
                {tabs.map((t) => {
                    const active = value === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => onChange(t.key)}
                            className={cls(
                                "flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-extrabold transition",
                                active
                                    ? "bg-[#B9895B] text-white shadow-[0_14px_35px_rgba(30,30,30,0.14)]"
                                    : "bg-white/20 text-[#1E1E1E]/75 border border-[#B9895B]/14 hover:bg-white/28",
                            )}
                        >
                            <span className={cls("text-base", active ? "text-white" : "text-[#B9895B]")}>
                                {t.icon}
                            </span>
                            <span>{t.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminTabs;
