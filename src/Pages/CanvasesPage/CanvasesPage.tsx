import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../components/context/CartContext.tsx";
import SideCart from "../../components/SideCart";

type Canvas = {
    name: string;
    size: "80×25" | "80×60" | "50×40";
    image: string;
};

/* ---------- נתונים ---------- */
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
    names.map(n => standard.find(i => i.name === n)).filter(Boolean) as Canvas[];

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

/* ---------- קומפוננטות קטנות ---------- */
function WallCanvasTall({ src, width = 160, height = 570, borderPadding = 8 }: {
    src: string; width?: number; height?: number; borderPadding?: number;
}) {
    const innerH = height - borderPadding * 2;
    const innerW = width - borderPadding * 2;
    return (
        <div className="relative shadow-lg rounded-2xl ring-1 ring-black/5"
            style={{ width, height, background: "linear-gradient(180deg,#faf9f5,#f1efe7)", padding: borderPadding }}>
            <div className="rounded-xl overflow-hidden bg-white shadow-[0_8px_22px_rgba(0,0,0,0.15)]"
                style={{ width: innerW, height: innerH }}>
                <img src={src} alt="" className="block object-contain w-full h-full" loading="lazy" />
            </div>
        </div>
    );
}

function WallCanvasRect({
    src, width = 260, height = 360, borderPadding = 10, className = "",
}: {
    src: string; width?: number; height?: number; borderPadding?: number; className?: string;
}) {
    const innerH = height - borderPadding * 2;
    const innerW = width - borderPadding * 2;
    return (
        <div
            className={`relative shadow-lg rounded-2xl ring-1 ring-black/5 ${className}`}
            style={{ width, height, background: "linear-gradient(180deg,#faf9f5,#f1efe7)", padding: borderPadding }}
        >
            <div
                className="rounded-xl overflow-hidden bg-white shadow-[0_8px_22px_rgba(0,0,0,0.15)]"
                style={{ width: innerW, height: innerH }}
            >
                <img src={src} alt="" className="block object-contain w-full h-full" loading="lazy" />
            </div>
        </div>
    );
}

function CanvasCardShell({
    title, subtitle, children, onAdd,
}: { title: string; subtitle: string; children: React.ReactNode; onAdd?: () => void; }) {
    return (
        <div className="flex flex-col items-center">
            {children}
            <div className="w-full mt-2 text-center">
                <div className="font-semibold text-[#3B3024] truncate">{title}</div>
                <div className="text-xs text-[#3B3024]/70">{subtitle}</div>
                {onAdd && (
                    <button onClick={onAdd} className="mt-2 w-full rounded-lg bg-[#8C734A] text-white py-1.5 hover:opacity-95">
                        הוסף לעגלה
                    </button>
                )}
            </div>
        </div>
    );
}

/* ---------- עמוד ---------- */
export default function CanvasesPage() {
    const cart = useCart();
    const add = cart?.add ?? (() => { });
    const { state, setQty, remove, totals } = cart!;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const addItem = (c: Canvas, category: "standard" | "triple" | "pair") => {
        add({ id: `${c.name}|${c.size}`, name: c.name, size: c.size, image: c.image, category }, 1);
        setOpen(true);
    };

    // מיפוי לפרמט של SideCart
    const cartForSideCart = state.items.map(i => ({
        _id: i.id,
        title: i.name,
        price: i.category === "pair" ? 390
            : i.category === "triple" ? 550
                : undefined, // סטנדרטי 80×25 – תמחור מדורג, לא פר-פריט
        quantity: i.qty,
        size: i.size,
        imageUrl: i.image,
    }));

    const updateQuantity = (productId: string, quantity: number) => {
        setQty(productId, Math.max(1, Number(quantity) || 1));
    };

    const removeFromCart = (productId: string /*, size: string */) => {
        remove(productId);
    };

    const handleCheckout = () => {
        setOpen(false);
        navigate("/checkout");
    };

    return (
        <div dir="rtl" className="min-h-screen bg-[#F1F3C5] text-[#1a1a1a]">
            <Helmet>
                <title>קאנבסים – Omer Aviv</title>
                <meta name="robots" content="noindex,nofollow" />
                <link rel="canonical" href="https://omeravivart.com/canvases" />
            </Helmet>

            {/* לוגו */}
            <section
                id="logo"
                className="flex items-center justify-center pt-10 pb-6 md:pt-14 md:pb-8"
            >
                <img
                    src="/backgrounds/ome-artL.png"
                    alt="Omer"
                    className="block w-auto h-48 m-0 select-none md:h-60 lg:h-72"
                    draggable={false}
                />
            </section>

            {/* קופסת מחירים */}
            <section id="sizes" className="max-w-6xl px-4 py-6 mx-auto">
                <div className="p-6 rounded-2xl bg-white/90 ring-1 ring-black/5">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#3B3024] text-center">קאנבסים ומידות</h2>
                    <div className="grid gap-4 mt-6 md:grid-cols-3">
                        <div className="rounded-xl border border-[#CBB279]/50 bg-white p-4">
                            <h3 className="font-semibold text-[#8C734A]">מידה סטנדרטית</h3>
                            <p className="text-[#3B3024]/80 mt-1">80×25 (80 אורך × 25 רוחב)</p>
                            <div className="mt-2 text-sm text-[#3B3024] space-y-1">
                                <div>1 = ₪220</div>
                                <div>2 = ₪400</div>
                                <div>3 = ₪550</div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-[#CBB279]/50 bg-white p-4">
                            <h3 className="font-semibold text-[#8C734A]">זוגות — 50×40 ס״מ</h3>
                            <p className="text-[#3B3024]/80 mt-1">(50 אורך × 40 רוחב)</p>
                            <div className="mt-2 text-sm text-[#3B3024] space-y-1">
                                <div>₪390 לסט</div>
                                <div className="text-[#3B3024]/70">נמכרים כסט זוגי משלים</div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-[#CBB279]/50 bg-white p-4">
                            <h3 className="font-semibold text-[#8C734A]">שלישיות — 80×60 ס״מ</h3>
                            <p className="text-[#3B3024]/80 mt-1">(80 אורך × 60 רוחב)</p>
                            <div className="mt-2 text-sm text-[#3B3024] space-y-1">
                                <div>₪550 לסט</div>
                                <div className="text-[#3B3024]/70">נמכרות כסט משלים</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* סטנדרטי */}
            <section className="max-w-6xl px-4 py-8 mx-auto">
                <h2 className="mb-4 text-2xl font-bold text-[#8C734A]">סטנדרטי 80×25</h2>
                <div className="space-y-3">
                    {standardRows.map((row, idx) => (
                        <div key={idx} className="flex flex-row gap-2 overflow-x-auto md:overflow-visible snap-x">
                            {row.map((c) => (
                                <div key={c.name} className="snap-start">
                                    <CanvasCardShell title={c.name} subtitle="80×25 ס״מ" onAdd={() => addItem(c, "standard")}>
                                        <WallCanvasTall src={c.image} width={160} height={570} />
                                    </CanvasCardShell>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
            
            {/* זוגות */}
            <section className="max-w-6xl px-4 pt-8 pb-16 mx-auto">
                <h2 className="mb-4 text-2xl font-bold text-[#8C734A]">זוגות 50×40</h2>
                <div className="flex flex-row flex-wrap gap-3">
                    {pairs.map((c) => (
                        <CanvasCardShell key={c.name} title={c.name} subtitle="50×40 ס״מ" onAdd={() => addItem(c, "pair")}>
                            <WallCanvasRect src={c.image} width={260} height={360} />
                        </CanvasCardShell>
                    ))}
                </div>
            </section>

            {/* שלישיות */}
            <section className="max-w-6xl px-4 py-8 mx-auto">
                <h2 className="mb-4 text-2xl font-bold text-[#8C734A]">שלישיות 80×60</h2>
                <div className="flex flex-row flex-wrap gap-3">
                    {triples.map((c) => (
                        <CanvasCardShell key={c.name} title={c.name} subtitle="80×60 ס״מ" onAdd={() => addItem(c, "triple")}>
                            {/* טיפה יותר גדול במובייל, רגיל מ־md ומעלה */}
                            <WallCanvasRect src={c.image} width={260} height={360} className="scale-[1.06] md:scale-100 origin-top" />
                        </CanvasCardShell>
                    ))}
                </div>
            </section>


            {/* SideCart */}
            <SideCart
                isOpen={open}
                onClose={() => setOpen(false)}
                cart={cartForSideCart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                handleCheckout={handleCheckout}
                totalsILS={totals.total} // אם SideCart תומך בפרופ הזה
            />

            {/* כפתור ירקרק לפתיחת עגלה (כמו בעמוד הבית) */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-[#9FC87E] hover:bg-[#7ea649] text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
                title="Open Cart"
            >
                <FaShoppingCart className="text-xl" />
            </button>
        </div>
    );
}
