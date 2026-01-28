import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCart } from "../../components/context/CartContext.tsx";
import { useCanvases } from "./hooks/useCanvases";
import CanvasesGrid from "./components/CanvasGrid.tsx";
import CanvasesTabs from "./components/CanvasTabs.tsx";
import PricesInline from "./components/PricesInline.tsx";
import { CanvasItem } from "./components/types.ts";

export default function CanvasesPage() {
    const apiBase = import.meta.env.VITE_API_URL as string;

    const cart = useCart();

    const { loading, error, filtered, tab, setTab } = useCanvases(apiBase);

    const [pricesOpen, setPricesOpen] = useState(false);

    const addItem = (c: CanvasItem) => {
        const category = c.size === "80×25" ? "standard" : c.size === "50×40" ? "pair" : "triple";

        cart.addCanvas(
            {
                id: `canvas|${c._id}`,
                name: c.name,
                size: c.size,
                image: c.imageUrl,
                category,
            },
            1
        );
    };

    return (
        <main dir="rtl" className="min-h-[100svh] pt-16 sm:pt-20 pb-14 px-4 text-[#1E1E1E] overflow-x-hidden">
            <Helmet>
                <title>קאנבסים – Omer Aviv</title>
                <meta name="robots" content="noindex,nofollow" />
                <link rel="canonical" href="https://omeravivart.com/canvases" />
            </Helmet>

            <div className="w-full max-w-6xl mx-auto">
                <header className="max-w-3xl mx-auto text-center">
                    <h1 className="text-[30px] sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.08] text-[#1E1E1E]">
                        קאנבסים לבית
                        <span className="block mt-2 text-[#B9895B] text-[14px] sm:text-lg font-semibold tracking-wide">
                            בחרו קאנבס, הוסיפו לעגלה, וממשיכים להזמנה
                        </span>
                    </h1>
                </header>

                <section className="mt-8">
                    <div className="flex justify-center">
                        <CanvasesTabs value={tab} onChange={setTab} />
                    </div>

                    <div className="mt-4">
                        <PricesInline open={pricesOpen} onToggle={() => setPricesOpen((v) => !v)} />
                    </div>
                </section>

                <section className="mt-6 sm:mt-8">
                    {loading ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-[clamp(320px,48svh,480px)] rounded-[28px] bg-white/18 border border-[#B9895B]/14 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="rounded-[24px] border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">
                            {error}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-[24px] border border-[#B9895B]/16 bg-white/24 backdrop-blur p-6 text-center text-sm text-[#1E1E1E]/70">
                            אין קאנבסים להציג כרגע.
                        </div>
                    ) : (
                        <CanvasesGrid items={filtered} onAdd={addItem} />
                    )}
                </section>
            </div>
        </main>
    );
}
