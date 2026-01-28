import { TabKey } from "./types";

const cls = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

const tabLabel = (k: TabKey) => {
    if (k === "all") return "הכל";
    return k;
};

export default function CanvasesTabs({
    value,
    onChange,
}: {
    value: TabKey;
    onChange: (v: TabKey) => void;
}) {
    const tabs: TabKey[] = ["all", "80×25", "50×40", "80×60"];

    return (
        <div className="w-full flex flex-wrap justify-center gap-2">
            {tabs.map((t) => {
                const active = t === value;
                return (
                    <button
                        key={t}
                        type="button"
                        onClick={() => onChange(t)}
                        className={cls(
                            "px-4 py-2 rounded-2xl text-[13px] sm:text-sm font-extrabold border transition whitespace-nowrap",
                            active
                                ? "bg-[#B9895B] text-white border-[#B9895B] shadow-[0_14px_38px_rgba(30,30,30,0.14)]"
                                : "bg-[#B9895B]/22 text-[#1E1E1E] border-[#B9895B]/26 hover:bg-[#B9895B]/28"
                        )}
                    >
                        {tabLabel(t)}
                    </button>
                );
            })}
        </div>
    );
}
