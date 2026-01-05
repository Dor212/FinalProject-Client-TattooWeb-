import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { Element, scroller } from "react-scroll";
import { Helmet } from "react-helmet-async";
import SideCart from "../../components/SideCart.tsx";
import mainP from "../../Imges/mainPic.jpg";
import tattoS from "../../Imges/tattooS.jpg";
import tattoM from "../../Imges/tattooM.jpg";
import tattoL from "../../Imges/tattooL.jpg";
import { Product } from "../../Types/TProduct.ts";
import { trimTransparentPNG } from "../../utils/trimPng.ts";
import FloatingCartButton from "../../components/FloatingCartButton.tsx";
import FloatingWhatsAppButton from "../../components/FloatingWhatsAppButton.tsx";
import ContactSection from "./Sections/ContactSection.tsx";
import CoursesSection from "./Sections/CoursesSection.tsx";
import HeroSection from "./Sections/HeroSection.tsx";
import ShopMerchSection from "./Sections/ShopMerchSection.tsx";
import SimulationSection from "./Sections/SimulationSection.tsx";



type CartItem = {
    _id: string;
    size: string;
    quantity: number;
    title: string;
    price: number;
    imageUrl: string;
};

const SIZE_KEYS = ["l", "xl", "xxl"] as const;
type SizeKey = (typeof SIZE_KEYS)[number];

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const VITE_API_URL = import.meta.env.VITE_API_URL as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, SizeKey | "ONE">>({});
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [logoSrc, setLogoSrc] = useState("/backgrounds/omerlogo.png");
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

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
        const savedCart = localStorage.getItem("cart");
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const trimmed = await trimTransparentPNG("/backgrounds/omerlogo.png");
                if (mounted) setLogoSrc(trimmed);
            } catch { /* empty */ }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const getCur = (p: Product, k: SizeKey) => p.stock?.[k]?.current ?? 0;
    const hasAnySizeInStock = (p: Product) =>
        !!p.stock && getCur(p, "l") + getCur(p, "xl") + getCur(p, "xxl") > 0;
    const isOutOfStock = (p: Product) => !!p.stock && !hasAnySizeInStock(p);

    const addToCart = (product: Product, size: SizeKey | "ONE" | undefined, quantity: number) => {
        const hasSizes = !!product.stock;
        const finalSize: SizeKey | "ONE" = hasSizes ? (size as SizeKey) : "ONE";

        if (hasSizes && !finalSize) {
            Swal.fire("Select Size", "Please choose a size before adding to cart", "warning");
            return;
        }

        const safeQty = Math.max(1, Number(quantity) || 1);
        const existingItem = cart.find((item) => item._id === product._id && item.size === finalSize);

        if (existingItem) {
            const updatedCart = cart.map((item) =>
                item._id === product._id && item.size === finalSize
                    ? { ...item, quantity: item.quantity + safeQty }
                    : item
            );
            setCart(updatedCart);
        } else {
            setCart((prev) => [
                ...prev,
                {
                    _id: product._id,
                    size: finalSize,
                    quantity: safeQty,
                    title: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl,
                },
            ]);
        }

        setIsCartOpen(true);
        Swal.fire({
            title: "Added to cart!",
            text: `${product.title}${hasSizes ? ` (${finalSize.toUpperCase()})` : ""}`,
            icon: "success",
            timer: 800,
            showConfirmButton: false,
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        const safeQty = Math.max(1, Number(quantity) || 1);
        setCart((prev) => prev.map((item) => (item._id === productId ? { ...item, quantity: safeQty } : item)));
    };

    const removeFromCart = (productId: string, size: string) => {
        setCart((prev) => prev.filter((item) => !(item._id === productId && item.size === size)));
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            Swal.fire("Cart is empty", "Please add products before checkout", "warning");
            return;
        }

        Swal.fire({
            title: "Shipping Details",
            html: `
        <input id="fullname" class="swal2-input" placeholder="Full Name">
        <input id="phone" class="swal2-input" placeholder="Phone Number">
        <input id="city" class="swal2-input" placeholder="City">
        <input id="street" class="swal2-input" placeholder="Street">
        <input id="houseNumber" class="swal2-input" placeholder="House Number">
        <input id="zip" class="swal2-input" placeholder="Postal Code">
      `,
            confirmButtonText: "Place Order",
            showCancelButton: true,
            focusConfirm: false,
            customClass: {
                confirmButton:
                    "bg-gradient-to-r from-[#c1aa5f] to-[#97BE5A] text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300",
                cancelButton:
                    "bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg ml-2 hover:bg-gray-400 transition-all duration-200",
            },
            buttonsStyling: false,
            preConfirm: () => {
                const val = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim();
                const data = {
                    fullname: val("fullname"),
                    phone: val("phone"),
                    city: val("city"),
                    street: val("street"),
                    houseNumber: val("houseNumber"),
                    zip: val("zip"),
                    email: val("email") || null,
                };
                if (!data.fullname || !data.phone || !data.city || !data.street || !data.houseNumber || !data.zip) {
                    Swal.showValidationMessage(
                        "Please fill full name, phone, city, street, house number and postal code"
                    );
                    return;
                }
                return data;
            },
        }).then(async ({ isConfirmed, value }) => {
            if (!isConfirmed || !value) return;

            try {
                await axios.post(`${VITE_API_URL}/users/orders`, {
                    customerDetails: value,
                    cart,
                });
                Swal.fire("Success", "Your order has been placed!", "success");
                setCart([]);
                setIsCartOpen(false);
            } catch {
                Swal.fire("Error", "There was an issue placing the order", "error");
            }
        });
    };

    const handleSelectCategory = (category: string) => {
        navigate(`/gallery/${category}`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            await axios.post(`${VITE_API_URL}/users/contact`, formData);
            Swal.fire("Message Sent!", "We’ll get back to you soon.", "success");
            setFormData({ name: "", email: "", message: "" });
        } catch {
            Swal.fire("Oops!", "Failed to send message", "error");
        }
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

            <div
                className="w-full min-h-screen pt-20 text-[#3B3024]"
                style={{
                    backgroundImage: "url('/backgrounds/BG4.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "right top",
                    backgroundAttachment: "fixed",
                    backgroundColor: "#FFFFFF",
                }}
            >
                <FloatingWhatsAppButton phone="972528787419" />

                <Element name="logo">
                    <HeroSection logoSrc={logoSrc} phone="972528787419" />
                </Element>

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

                <CoursesSection imageSrc={mainP} phone="972528787419" dates={["10/07/2025", "15/08/2025", "20/09/2025"]} />

                <SimulationSection images={imagesSketches} onSelectCategory={handleSelectCategory} />

                <ContactSection formData={formData} onChange={handleChange} onSubmit={handleSubmit} />

                <SideCart
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    handleCheckout={handleCheckout}
                />

                <FloatingCartButton onClick={() => setIsCartOpen(true)} />
            </div>
        </>
    );
};

export default HomePage;
