import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { formatILS } from "./ui";

const cls = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

export default function PricesInline({ open, onToggle }: { open: boolean; onToggle: () => void }) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="rounded-2xl border border-[#B9895B]/14 bg-[#F6F1E8]/55 backdrop-blur-xl shadow-[0_14px_50px_rgba(30,30,30,0.08)] px-4 py-3">
                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-[#B9895B]/14 border border-[#B9895B]/18 text-[12px] font-extrabold text-[#1E1E1E]">
                        מחירים
                    </div>

                    <div className="flex items-center justify-center w-full gap-2 overflow-x-auto flex-nowrap sm:w-auto sm:overflow-visible">
                        <span className="shrink-0 px-3 py-1.5 rounded-full bg-white/55 border border-[#B9895B]/14 text-[12px] font-semibold text-[#1E1E1E]/75">
                            80×25 {formatILS(220)}
                        </span>
                        <span className="shrink-0 px-3 py-1.5 rounded-full bg-white/55 border border-[#B9895B]/14 text-[12px] font-semibold text-[#1E1E1E]/75">
                            50×40 {formatILS(390)}
                        </span>
                        <span className="shrink-0 px-3 py-1.5 rounded-full bg-white/55 border border-[#B9895B]/14 text-[12px] font-semibold text-[#1E1E1E]/75">
                            80×60 {formatILS(550)}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={open ? "סגור פירוט מחירים" : "פתח פירוט מחירים"}
                        className={cls(
                            "mt-1 sm:mt-0 h-10 w-10 rounded-full border transition grid place-items-center",
                            open ? "bg-[#1E1E1E]/6 border-[#1E1E1E]/10" : "bg-white/45 border-[#B9895B]/14 hover:bg-white/60",
                        )}
                    >
                        <span className="text-[#1E1E1E]/70 text-[20px] leading-none transition">
                            {open ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                    </button>
                </div>

                {open && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-3 text-[12.5px] text-[#1E1E1E]/72">
                        <div className="rounded-xl border border-[#B9895B]/12 bg-white/55 px-3 py-2 text-center">
                            <div className="font-extrabold text-[#B9895B]">80×25</div>
                            <div className="mt-1">1 = {formatILS(220)}</div>
                            <div>2 = {formatILS(400)}</div>
                            <div>3 = {formatILS(550)}</div>
                        </div>

                        <div className="rounded-xl border border-[#B9895B]/12 bg-white/55 px-3 py-2 text-center">
                            <div className="font-extrabold text-[#B9895B]">50×40</div>
                            <div className="mt-1">{formatILS(390)} ליחידה</div>
                            <div className="text-[#1E1E1E]/55">נמכר כסט משלים</div>
                        </div>

                        <div className="rounded-xl border border-[#B9895B]/12 bg-white/55 px-3 py-2 text-center">
                            <div className="font-extrabold text-[#B9895B]">80×60</div>
                            <div className="mt-1">{formatILS(550)} ליחידה</div>
                            <div className="text-[#1E1E1E]/55">נמכר כסט משלים</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
