type Props = {
    name: string;
    phone: string;
    email: string;
    setName: (v: string) => void;
    setPhone: (v: string) => void;
    setEmail: (v: string) => void;
};

export default function DetailsPanel({ name, phone, email, setName, setPhone, setEmail }: Props) {
    return (
        <div className="grid gap-3 rounded-[22px] border border-[#B9895B]/14 bg-white/75 backdrop-blur p-4 text-center shadow-[0_18px_70px_rgba(30,30,30,0.12)]">
            <div className="text-sm font-extrabold text-[#3B3024]">פרטים לשליחה</div>

            <div className="grid gap-3 sm:grid-cols-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="שם מלא"
                    className="w-full rounded-2xl border border-[#B9895B]/18 bg-[#F6F1E8]/55 px-4 py-3 text-sm font-semibold text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25 text-center"
                />
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="טלפון"
                    className="w-full rounded-2xl border border-[#B9895B]/18 bg-[#F6F1E8]/55 px-4 py-3 text-sm font-semibold text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25 text-center"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="אימייל (אופציונלי)"
                    className="w-full rounded-2xl border border-[#B9895B]/18 bg-[#F6F1E8]/55 px-4 py-3 text-sm font-semibold text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/25 text-center sm:col-span-2"
                />
            </div>

            <div className="text-xs text-[#1E1E1E]/60 max-w-md mx-auto">שם וטלפון חובה לשליחה. אימייל אופציונלי.</div>
        </div>
    );
}
