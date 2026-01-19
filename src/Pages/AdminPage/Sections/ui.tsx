import { FaCheckCircle, FaImage, FaPlus, FaTrash } from "react-icons/fa";

export const cls = (...s: Array<string | false | null | undefined>) => s.filter(Boolean).join(" ");

export const CardShell = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={cls(
            "relative overflow-hidden rounded-[28px] border border-[#B9895B]/18 bg-white/35 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.18)]",
            className
        )}
    >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(185,137,91,0.14),transparent_52%),radial-gradient(circle_at_80%_90%,rgba(232,217,194,0.30),transparent_55%)]" />
        <div className="relative">{children}</div>
    </div>
);

export const Field = ({
    label,
    children,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    hint?: string;
}) => (
    <div className="space-y-2">
        <div className="text-sm font-bold text-[#1E1E1E] text-end">{label}</div>
        {children}
        {hint && <div className="text-xs text-[#1E1E1E]/60 text-end">{hint}</div>}
    </div>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={cls(
            "w-full rounded-2xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45",
            "focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25 focus:border-[#B9895B]/30",
            props.className
        )}
    />
);

export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className={cls(
            "w-full rounded-2xl border border-[#B9895B]/20 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45",
            "focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25 focus:border-[#B9895B]/30",
            props.className
        )}
    />
);

export const PrimaryBtn = ({
    children,
    onClick,
    disabled,
    icon = <FaPlus />,
    className = "",
    type = "button",
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
    type?: "button" | "submit";
}) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cls(
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
            disabled
                ? "bg-[#B9895B]/35 text-white/85 cursor-not-allowed"
                : "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35",
            className
        )}
    >
        {icon}
        {children}
    </button>
);

export const SoftBtn = ({
    children,
    onClick,
    icon,
    className = "",
}: {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={cls(
            "inline-flex items-center justify-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/35 px-4 py-2 text-sm font-semibold text-[#1E1E1E] transition",
            "hover:bg-white/45 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35",
            className
        )}
    >
        {icon}
        {children}
    </button>
);

export const DangerIconBtn = ({ onClick, title }: { onClick: () => void; title: string }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        className="grid w-10 h-10 text-red-600 transition border place-items-center rounded-2xl bg-white/40 border-red-200/70 hover:bg-white/55 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
    >
        <FaTrash />
    </button>
);

export const FilePick = ({
    value,
    onPick,
}: {
    value?: string;
    onPick: (f: File | null) => void;
}) => (
    <div className="flex items-center gap-3">
        <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#B9895B]/18 bg-white/35 px-4 py-3 text-sm font-semibold text-[#1E1E1E] transition hover:bg-white/45">
            <FaImage className="text-[#B9895B]" />
            בחר קובץ
            <input type="file" className="hidden" onChange={(e) => onPick(e.target.files?.[0] || null)} />
        </label>
        <div className="min-w-[120px] text-xs text-[#1E1E1E]/70 text-end">
            {value || "לא נבחר קובץ"}
        </div>
    </div>
);

export const InfoPill = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#B9895B]/18 bg-white/35 px-3 py-1 text-xs font-semibold text-[#1E1E1E]/80">
        <FaCheckCircle className="text-[#B9895B]" />
        {children}
    </div>
);

export const formatILS = (n: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);
