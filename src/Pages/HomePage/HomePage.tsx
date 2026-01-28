import { useEffect, useState } from "react";
import axios from "../../Services/axiosInstance";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { Element, scroller } from "react-scroll";
import { Helmet } from "react-helmet-async";
import SideCart from "../../components/SideCart.tsx";
import tattoS from "../../Imges/S.png";
import tattoM from "../../Imges/M.png";
import tattoL from "../../Imges/L.png";
import { Product } from "../../Types/TProduct.ts";
import { trimTransparentPNG } from "../../utils/trimPng.ts";
import FloatingCartButton from "../../components/FloatingCartButton.tsx";
import HeroSection from "./Sections/HeroSection.tsx";
import ShopMerchSection from "./Sections/ShopMerchSection.tsx";
import SimulationSection from "./Sections/SimulationSection.tsx";
import OpinionsSection from "./Sections/OpinionsSection.tsx";
import FloatingSocialButtons from "../../components/FloatingSocialButtons.tsx";
import { useCart } from "../../components/context/CartContext";
import CanvasesHomeSection from "./Sections/CanvasesHomeSection.tsx";


const SIZE_KEYS = ["l", "xl", "xxl"] as const;
type SizeKey = (typeof SIZE_KEYS)[number];

type SketchCategory = "small" | "medium" | "large";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const VITE_API_URL = import.meta.env.VITE_API_URL as string;

    const cart = useCart();

    const BASE = import.meta.env.BASE_URL as string;
    const LOGO_PATH = `${BASE}LogoOme.png`;

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, SizeKey | "ONE">>({});
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [logoSrc, setLogoSrc] = useState(LOGO_PATH);

    useEffect(() => {
        if (location.state?.scrollTo) {
            scroller.scrollTo(location.state.scrollTo, {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
            });
        }
    }, [location]);

    useEffect(() => {
        const fetchMerch = async () => {
            try {
                const response = await axios.get<Product[]>(`${VITE_API_URL}/products/`);
                setProducts(response.data);
            } catch (err) {
                console.error("Error loading products:", err);
            }
        };
        fetchMerch();
    }, [VITE_API_URL]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const trimmed = await trimTransparentPNG(LOGO_PATH);
                if (mounted) setLogoSrc(trimmed);
            } catch {
                setLogoSrc(LOGO_PATH);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [LOGO_PATH]);

    const getCur = (p: Product, k: SizeKey) => p.stock?.[k]?.current ?? 0;
    const hasAnySizeInStock = (p: Product) => !!p.stock && getCur(p, "l") + getCur(p, "xl") + getCur(p, "xxl") > 0;
    const isOutOfStock = (p: Product) => !!p.stock && !hasAnySizeInStock(p);

    const addToCart = (product: Product, size: SizeKey | "ONE" | undefined, quantity: number) => {
        const hasSizes = !!product.stock;
        const finalSize: SizeKey | "ONE" = hasSizes ? (size as SizeKey) : "ONE";

        if (hasSizes && !finalSize) {
            Swal.fire("Select Size", "Please choose a size before adding to cart", "warning");
            return;
        }

        const safeQty = Math.max(1, Number(quantity) || 1);

        cart.addProduct(
            { _id: product._id, title: product.title, price: product.price, imageUrl: product.imageUrl },
            finalSize === "ONE" ? "ONE" : finalSize,
            safeQty
        );

        setIsCartOpen(true);
        Swal.fire({
            title: "Added to cart!",
            text: `${product.title}${hasSizes ? ` (${String(finalSize).toUpperCase()})` : ""}`,
            icon: "success",
            timer: 800,
            showConfirmButton: false,
        });
    };

    const handleSelectCategory = (category: SketchCategory) => {
        navigate("/apply-sketch", { state: { category } });
    };

    const imagesSketches = [
        { src: tattoS, title: "small" },
        { src: tattoM, title: "medium" },
        { src: tattoL, title: "large" },
    ];

    return (
        <>
            <Helmet>
                <title>Omer Aviv Tattoo - סטודיו לקעקועים</title>
                <meta
                    name="description"
                    content="סטודיו לקעקועים בעיצוב אישי, באווירה מקצועית וייחודית. הזמנת סשן, הדמיית קעקוע, קורסים ועוד."
                />
                <link rel="canonical" href="https://omeravivtattoo.com/" />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="he_IL" />
                <meta property="og:title" content="Omer Aviv Tattoo - סטודיו לקעקועים" />
                <meta property="og:description" content="קעקועים ייחודיים, מוצרים, קורסים והדמיות – הכל במקום אחד." />
                <meta property="og:url" content="https://omeravivtattoo.com/" />
                <meta property="og:image" content="https://omeravivtattoo.com/preview.jpg" />
                <meta property="og:image:alt" content="Omer Aviv Tattoo Studio" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Omer Aviv Tattoo - סטודיו לקעקועים" />
                <meta name="twitter:description" content="קעקועים ייחודיים, מוצרים, קורסים והדמיות – הכל במקום אחד." />
                <meta name="twitter:image" content="https://omeravivtattoo.com/preview.jpg" />
            </Helmet>

            <div className="relative isolate w-full min-h-screen text-[#3B3024]">
                <FloatingSocialButtons
                    phone={"972528787419"}
                    instagramUrl={"https://www.instagram.com/omeraviv_tattoo/"}
                    tiktokUrl={"https://www.tiktok.com/@omeraviv_tattoo"}
                />
               
                <Element name="logo">
                    <div id="home-logo">
                        <HeroSection logoSrc={logoSrc} phone="972528787419" />
                    </div>
                </Element>

                <div className="pt-20">
                    <ShopMerchSection
                        products={products}
                        sizeKeys={SIZE_KEYS}
                        selectedSizes={selectedSizes}
                        setSelectedSizes={setSelectedSizes}
                        quantities={quantities}
                        setQuantities={setQuantities}
                        addToCart={addToCart}
                        isOutOfStock={isOutOfStock}
                        onSeeMore={() => navigate("/products")}
                    />

                    <CanvasesHomeSection onOpenCart={() => setIsCartOpen(true)} />

                    <SimulationSection images={imagesSketches} onSelectCategory={handleSelectCategory} />

                    <OpinionsSection />

                    <SideCart
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                        onCheckout={() => {
                            setIsCartOpen(false);
                            navigate("/checkout");
                        }}
                    />

                    <FloatingCartButton onClick={() => setIsCartOpen(true)} />
                </div>
            </div>
        </>
    );
};

export default HomePage;
