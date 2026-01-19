import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCart } from "../../components/context/CartContext.tsx";

type CanvasSize = "80×25" | "80×60" | "50×40";

type Canvas = {
    name: string;
    size: CanvasSize;
    image: string;
};

const standard: Canvas[] = [
    { name: "מכתב מיפן", size: "80×25", image: "/canvases/JapaneseLetter.jpeg" },
    { name: "סאקורה בזריחה", size: "80×25", image: "/canvases/SakuraSunrise.jpeg" },
    { name: "קווי חיים", size: "80×25", image: "/canvases/Lifelines.jpeg" },
    { name: "מעגלי תנועה", size: "80×25", image: "/canvases/TrafficCircles.jpeg" },
    { name: "סוד של מניפה", size: "80×25", image: "/canvases/FansSecret.jpeg" },
    { name: "אדמונית", size: "80×25", image: "/canvases/Peony.jpeg" },
    { name: "ירוקה", size: "80×25", image: "/canvases/Green.jpeg" },
    { name: "שחורה", size: "80×25", image: "/canvases/Black.jpeg" },
    { name: "כחולה", size: "80×25", image: "/canvases/Blue.jpeg" },
    { name: "הדים מהמזרח", size: "80×25", image: "/canvases/EchoesEast.jpeg" },
    { name: "פריחה שקטה", size: "80×25", image: "/canvases/SilentFlowering.jpeg" },
    { name: "מעבר לעננים 1", size: "80×25", image: "/canvases/BeyondClouds.jpeg" },
    { name: "מעבר לעננים 2", size: "80×25", image: "/canvases/BeyondClouds2.jpeg" },
    { name: "נשימת מצרים", size: "80×25", image: "/canvases/BreathEgypt.jpeg" },
    { name: "פריחת שבתאי", size: "80×25", image: "/canvases/SaturnBloom.jpeg" },
    { name: "בצל הבמבוק", size: "80×25", image: "/canvases/ShadowBamboo.jpeg" },
];

const pairs: Canvas[] = [
    { name: "אדמה", size: "50×40", image: "/canvases/Soil.jpeg" },
    { name: "שערי ערפל", size: "50×40", image: "/canvases/FogGates.jpeg" },
    { name: "מול האופק", size: "50×40", image: "/canvases/Horizon.jpeg" },
    { name: "חמניות לילה", size: "50×40", image: "/canvases/NightSunflower.jpeg" },
    { name: "מסע ורוד", size: "50×40", image: "/canvases/PinkJourney.jpeg" },
];

const triples: Canvas[] = [
    { name: "רוחות ופריחה", size: "80×60", image: "/canvases/WindsBlossoms.jpeg" },
    { name: "מעמקים", size: "80×60", image: "/canvases/Depths.jpeg" },
    { name: "שורשי שמיים", size: "80×60", image: "/canvases/SkyRoots.jpeg" },
];

const pickRow = (names: string[]) =>
    names.map((n) => standard.find((i) => i.name === n)).filter(Boolean) as Canvas[];

const standardRows: Canvas[][] = [
    pickRow(["מכתב מיפן", "סאקורה בזריחה"]),
    pickRow(["קווי חיים", "מעגלי תנועה"]),
    pickRow(["סוד של מניפה", "אדמונית"]),
    pickRow(["ירוקה", "שחורה", "כחולה"]),
    pickRow(["הדים מהמזרח", "פריחה שקטה"]),
    pickRow(["מעבר לעננים 1", "מעבר לעננים 2"]),
    pickRow(["נשימת מצרים", "פריחת שבתאי"]),
    pickRow(["בצל הבמבוק"]),
];

type VariantLabel = "ירוקה" | "שחורה" | "כחולה";
type Variant = {
    label: VariantLabel;
    image: string;
    swatch: string;
};

const formatILS = (n: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

const priceFor = (category: "standard" | "pair" | "triple") => {
    if (category === "standard") return 220;
    if (category === "pair") return 390;
    return 550;
};

function WallCanvasTall({
    src,
    width = 160,
    height = 570,
    borderPadding = 10,
}: {
    src: string;
    width?: number;
    height?: number;
    borderPadding?: number;
}) {
    const innerH = height - borderPadding * 2;
    const innerW = width - borderPadding * 2;

    return (
        <div
            className="relative rounded-3xl overflow-hidden border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.16)]"
            style={{ width, height, padding: borderPadding }}
        >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_12%,rgba(185,137,91,0.16),transparent_52%),radial-gradient(circle_at_86%_92%,rgba(232,217,194,0.38),transparent_58%)]" />
            <div
                className="relative rounded-2xl overflow-hidden bg-[#F6F1E8]/70 ring-1 ring-black/5 shadow-[0_10px_26px_rgba(0,0,0,0.12)]"
                style={{ width: innerW, height: innerH }}
            >
                <img src={src} alt="" className="block object-contain w-full h-full" loading="lazy" decoding="async" />
            </div>
        </div>
    );
}

function WallCanvasRect({
    src,
    width = 260,
    height = 360,
    borderPadding = 12,
    className = "",
}: {
    src: string;
    width?: number;
    height?: number;
    borderPadding?: number;
    className?: string;
}) {
    const innerH = height - borderPadding * 2;
    const innerW = width - borderPadding * 2;

    return (
        <div
            className={`relative rounded-3xl overflow-hidden border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.16)] ${className}`}
            style={{ width, height, padding: borderPadding }}
        >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_12%,rgba(185,137,91,0.16),transparent_52%),radial-gradient(circle_at_86%_92%,rgba(232,217,194,0.38),transparent_58%)]" />
            <div
                className="relative rounded-2xl overflow-hidden bg-[#F6F1E8]/70 ring-1 ring-black/5 shadow-[0_10px_26px_rgba(0,0,0,0.12)]"
                style={{ width: innerW, height: innerH }}
            >
                <img src={src} alt="" className="block object-contain w-full h-full" loading="lazy" decoding="async" />
            </div>
        </div>
    );
}

function CanvasCardShell({
    title,
    subtitle,
    price,
    children,
    onAdd,
}: {
    title: string;
    subtitle: string;
    price: string;
    children: React.ReactNode;
    onAdd: () => void;
}) {
    return (
        <div className="flex flex-col items-center w-[190px] shrink-0">
            <div className="w-full flex justify-center">{children}</div>

            <div className="w-full mt-3 text-center">
                <div className="font-semibold text-[#1E1E1E] truncate">{title}</div>
                <div className="mt-0.5 text-xs text-[#1E1E1E]/65">{subtitle}</div>
                <div className="mt-1 text-sm font-bold text-[#B9895B]">{price}</div>

                <button
                    onClick={onAdd}
                    className="mt-3 w-full rounded-2xl bg-[#B9895B] text-white py-2 font-semibold shadow-[0_14px_40px_rgba(30,30,30,0.16)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                >
                    הוסף לעגלה
                </button>
            </div>
        </div>
    );
}

function ColorSwatch({
    color,
    selected,
    label,
    onClick,
}: {
    color: string;
    selected: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            className={`h-7 w-7 rounded-[10px] border transition ${selected ? "border-[#B9895B] ring-2 ring-offset-2 ring-[#B9895B]/35" : "border-black/10 hover:border-black/20"
                }`}
            style={{ background: color }}
        />
    );
}

function VariantCanvasCard({
    title,
    subtitle,
    price,
    variants,
    onAdd,
}: {
    title: string;
    subtitle: string;
    price: string;
    variants: Variant[];
    onAdd: (variant: Variant) => void;
}) {
    const [index, setIndex] = useState(0);
    const current = variants[index];

    return (
        <div className="flex flex-col items-center w-[190px] shrink-0">
            <div className="w-full flex justify-center">
                <WallCanvasTall src={current.image} width={160} height={570} />
            </div>

            <div className="w-full mt-3 text-center">
                <div className="font-semibold text-[#1E1E1E] truncate">{title}</div>
                <div className="mt-0.5 text-xs text-[#1E1E1E]/65">
                    {subtitle} • צבע: <span className="font-semibold text-[#1E1E1E]/85">{current.label}</span>
                </div>
                <div className="mt-1 text-sm font-bold text-[#B9895B]">{price}</div>

                <div className="mt-3 flex items-center justify-center gap-2">
                    {variants.map((v, i) => (
                        <ColorSwatch
                            key={v.label}
                            color={v.swatch}
                            label={`בחר צבע ${v.label}`}
                            selected={i === index}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>

                <button
                    onClick={() => onAdd(current)}
                    className="mt-3 w-full rounded-2xl bg-[#B9895B] text-white py-2 font-semibold shadow-[0_14px_40px_rgba(30,30,30,0.16)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                >
                    הוסף לעגלה
                </button>
            </div>
        </div>
    );
}

export default function CanvasesPage() {
    const cart = useCart();
    const add = cart?.add;

    const variants: Variant[] = useMemo(
        () => [
            { label: "ירוקה", image: "/canvases/Green.jpeg", swatch: "#2E7D32" },
            { label: "שחורה", image: "/canvases/Black.jpeg", swatch: "#111111" },
            { label: "כחולה", image: "/canvases/Blue.jpeg", swatch: "#1E88E5" },
        ],
        []
    );

    const addItem = (c: Canvas, category: "standard" | "pair" | "triple") => {
        if (!add) return;
        add({ id: `${category}|${c.name}|${c.size}`, name: c.name, size: c.size, image: c.image, category }, 1);
    };

    return (
        <main dir="rtl" className="min-h-[100svh] pt-24 pb-16 px-4 text-[#1E1E1E]">
            <Helmet>
                <title>קאנבסים – Omer Aviv</title>
                <meta name="robots" content="noindex,nofollow" />
                <link rel="canonical" href="https://omeravivart.com/canvases" />
            </Helmet>

            <div className="mx-auto w-full max-w-6xl">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-[34px] sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1E1E1E] leading-[1.08]">
                        קאנבסים לבית
                        <span className="block mt-2 text-[#B9895B] text-[16px] sm:text-lg font-semibold tracking-wide">
                            בוחרים, מוסיפים לעגלה, ומשם ממשיכים להזמנה
                        </span>
                    </h1>
                    <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#1E1E1E]/70">
                        כל יצירה מגיעה כקאנבס איכותי. יש מידות בודדות, זוגות ושלישיות לפי סטים.
                    </p>
                </div>

                <section className="mt-10">
                    <div className="rounded-[28px] overflow-hidden border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.14)]">
                        <div className="relative p-6 sm:p-7">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E] text-center">מחירים ומידות</h2>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border border-[#B9895B]/18 bg-white/45 p-4 sm:p-5">
                                    <div className="text-sm font-bold text-[#B9895B]">סטנדרטי</div>
                                    <div className="mt-1 text-lg font-extrabold text-[#1E1E1E]">80×25</div>
                                    <div className="mt-3 space-y-1 text-sm text-[#1E1E1E]/75">
                                        <div>1 = ₪220</div>
                                        <div>2 = ₪400</div>
                                        <div>3 = ₪550</div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#B9895B]/18 bg-white/45 p-4 sm:p-5">
                                    <div className="text-sm font-bold text-[#B9895B]">זוגות</div>
                                    <div className="mt-1 text-lg font-extrabold text-[#1E1E1E]">50×40</div>
                                    <div className="mt-3 space-y-1 text-sm text-[#1E1E1E]/75">
                                        <div>{formatILS(priceFor("pair"))} לסט</div>
                                        <div className="text-[#1E1E1E]/60">נמכר כסט משלים</div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#B9895B]/18 bg-white/45 p-4 sm:p-5">
                                    <div className="text-sm font-bold text-[#B9895B]">שלישיות</div>
                                    <div className="mt-1 text-lg font-extrabold text-[#1E1E1E]">80×60</div>
                                    <div className="mt-3 space-y-1 text-sm text-[#1E1E1E]/75">
                                        <div>{formatILS(priceFor("triple"))} לסט</div>
                                        <div className="text-[#1E1E1E]/60">נמכר כסט משלים</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-center text-xs text-[#1E1E1E]/55">
                                המחיר הסופי והפרטים המלאים עוברים בהמשך בתהליך ההזמנה.
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-12">
                    <div className="flex items-end justify-between gap-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E]">
                            סטנדרטי <span className="text-[#B9895B]">80×25</span>
                        </h2>
                        <div className="text-sm text-[#1E1E1E]/60">{formatILS(priceFor("standard"))} ליחידה</div>
                    </div>

                    {(() => {
                        const isSharviaRow = (row: Canvas[]) =>
                            row.length >= 2 && row.every((c) => ["ירוקה", "שחורה", "כחולה"].includes(c.name));

                        const sharviaIdx = standardRows.findIndex(isSharviaRow);
                        const singleIdx = standardRows.findIndex((r, i) => r.length === 1 && i !== sharviaIdx);

                        return (
                            <div className="mt-6 space-y-4">
                                {standardRows.map((row, idx) => {
                                    if (idx === singleIdx) return null;

                                    return (
                                        <div
                                            key={idx}
                                            className="flex flex-row gap-3 overflow-x-auto md:overflow-visible pb-2 snap-x snap-mandatory"
                                        >
                                            {idx === sharviaIdx ? (
                                                <>
                                                    <div className="snap-start">
                                                        <VariantCanvasCard
                                                            title="שרביה"
                                                            subtitle="80×25 ס״מ"
                                                            price={formatILS(priceFor("standard"))}
                                                            variants={variants}
                                                            onAdd={(v) =>
                                                                addItem({ name: `שרביה – ${v.label}`, size: "80×25", image: v.image }, "standard")
                                                            }
                                                        />
                                                    </div>

                                                    {singleIdx !== -1 && standardRows[singleIdx]?.[0] && (
                                                        <div className="snap-start">
                                                            <CanvasCardShell
                                                                title={standardRows[singleIdx][0].name}
                                                                subtitle="80×25 ס״מ"
                                                                price={formatILS(priceFor("standard"))}
                                                                onAdd={() => addItem(standardRows[singleIdx][0], "standard")}
                                                            >
                                                                <WallCanvasTall src={standardRows[singleIdx][0].image} width={160} height={570} />
                                                            </CanvasCardShell>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                row.map((c) => (
                                                    <div key={c.name} className="snap-start">
                                                        <CanvasCardShell
                                                            title={c.name}
                                                            subtitle="80×25 ס״מ"
                                                            price={formatILS(priceFor("standard"))}
                                                            onAdd={() => addItem(c, "standard")}
                                                        >
                                                            <WallCanvasTall src={c.image} width={160} height={570} />
                                                        </CanvasCardShell>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </section>

                <section className="mt-14">
                    <div className="flex items-end justify-between gap-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E]">
                            זוגות <span className="text-[#B9895B]">50×40</span>
                        </h2>
                        <div className="text-sm text-[#1E1E1E]/60">{formatILS(priceFor("pair"))} לסט</div>
                    </div>

                    <div className="mt-6 flex flex-row flex-wrap justify-center w-full gap-3 md:justify-start">
                        {pairs.map((c) => (
                            <div key={c.name} className="w-[320px] max-w-[92vw]">
                                <div className="flex flex-col items-center">
                                    <WallCanvasRect src={c.image} width={320} height={360} className="w-full" />
                                    <div className="w-full mt-3 text-center">
                                        <div className="font-semibold text-[#1E1E1E] truncate">{c.name}</div>
                                        <div className="mt-0.5 text-xs text-[#1E1E1E]/65">50×40 ס״מ</div>
                                        <div className="mt-1 text-sm font-bold text-[#B9895B]">{formatILS(priceFor("pair"))}</div>
                                        <button
                                            onClick={() => addItem(c, "pair")}
                                            className="mt-3 w-full rounded-2xl bg-[#B9895B] text-white py-2 font-semibold shadow-[0_14px_40px_rgba(30,30,30,0.16)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                                        >
                                            הוסף לעגלה
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-14">
                    <div className="flex items-end justify-between gap-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E]">
                            שלישיות <span className="text-[#B9895B]">80×60</span>
                        </h2>
                        <div className="text-sm text-[#1E1E1E]/60">{formatILS(priceFor("triple"))} לסט</div>
                    </div>

                    <div className="mt-6 flex flex-row flex-wrap justify-center w-full gap-3 md:justify-start">
                        {triples.map((c) => (
                            <div key={c.name} className="w-[340px] max-w-[94vw]">
                                <div className="flex flex-col items-center">
                                    <WallCanvasRect src={c.image} width={340} height={300} className="w-full" />
                                    <div className="w-full mt-3 text-center">
                                        <div className="font-semibold text-[#1E1E1E] truncate">{c.name}</div>
                                        <div className="mt-0.5 text-xs text-[#1E1E1E]/65">80×60 ס״מ</div>
                                        <div className="mt-1 text-sm font-bold text-[#B9895B]">{formatILS(priceFor("triple"))}</div>
                                        <button
                                            onClick={() => addItem(c, "triple")}
                                            className="mt-3 w-full rounded-2xl bg-[#B9895B] text-white py-2 font-semibold shadow-[0_14px_40px_rgba(30,30,30,0.16)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                                        >
                                            הוסף לעגלה
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {!add && (
                    <div className="mt-10 rounded-2xl border border-red-300 bg-red-50 p-4 text-center text-sm text-red-700">
                        נראה שהעגלה לא זמינה כרגע. ודא שהעמוד עטוף ב-CartProvider.
                    </div>
                )}
            </div>
        </main>
    );
}
