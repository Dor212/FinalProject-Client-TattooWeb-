import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import SideCart from "../../components/SideCart.tsx";
import mainP from "../../Imges/mainPic.jpg";
import tattoS from "../../Imges/tattooS.jpg";
import tattoM from "../../Imges/tattooM.jpg";
import tattoL from "../../Imges/tattooL.jpg";
import { Product } from "../../Types/TProduct.ts";
import { Element, scroller } from "react-scroll";
import { Helmet } from "react-helmet";
import { trimTransparentPNG } from "../../utils/trimPng.ts";

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
    const VITE_API_URL = import.meta.env.VITE_API_URL as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, SizeKey | "ONE">>({});
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    const location = useLocation();
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
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

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
        setCart((prev) =>
            prev.map((item) => (item._id === productId ? { ...item, quantity: safeQty } : item))
        );
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
                    Swal.showValidationMessage("Please fill full name, phone, city, street, house number and postal code");
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
            } catch (e) {
                Swal.fire("Error", "There was an issue placing the order", "error");
            }
        });
    };

    const [logoSrc, setLogoSrc] = useState("/backgrounds/omerlogo.png");
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const trimmed = await trimTransparentPNG("/backgrounds/omerlogo.png");
                if (mounted) setLogoSrc(trimmed);
            } catch {
                // Ignore errors while trimming PNG
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const imagesSketches = [
        { src: tattoS, title: "small" },
        { src: tattoM, title: "medium" },
        { src: tattoL, title: "large" },
    ];

    const handleSelectCategory = (category: string) => {
        navigate(`/gallery/${category}`);
    };

    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
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
    const getCur = (p: Product, k: SizeKey) => p.stock?.[k]?.current ?? 0;
    const hasAnySizeInStock = (p: Product) =>
        !!p.stock && (getCur(p, "l") + getCur(p, "xl") + getCur(p, "xxl")) > 0;
    const isOutOfStock = (p: Product) => !!p.stock && !hasAnySizeInStock(p);

    return (
        <>
            <Helmet>
                {/* Title & Description */}
                <title>Omer Aviv Tattoo - סטודיו לקעקועים</title>
                <meta
                    name="description"
                    content="סטודיו לקעקועים בעיצוב אישי, באווירה מקצועית וייחודית. הזמנת סשן, הדמיית קעקוע, קורסים ועוד."
                />

                {/* Canonical */}
                <link rel="canonical" href="https://omeravivtattoo.com/" />

                {/* Open Graph (Facebook/WhatsApp) */}
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="he_IL" />
                <meta property="og:title" content="Omer Aviv Tattoo - סטודיו לקעקועים" />
                <meta
                    property="og:description"
                    content="קעקועים ייחודיים, מוצרים, קורסים והדמיות – הכל במקום אחד."
                />
                <meta property="og:url" content="https://omeravivtattoo.com/" />
                <meta property="og:image" content="https://omeravivtattoo.com/preview.jpg" />
                <meta property="og:image:alt" content="Omer Aviv Tattoo Studio" />

                {/* Twitter (X) */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Omer Aviv Tattoo - סטודיו לקעקועים" />
                <meta
                    name="twitter:description"
                    content="קעקועים ייחודיים, מוצרים, קורסים והדמיות – הכל במקום אחד."
                />
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
                <a
                    href="https://wa.me/972528787419"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed z-50 flex items-center justify-center text-white bg-[#9FC87E] rounded-full shadow-md w-14 h-14 top-20 right-10 hover:bg-green-600"
                >
                    <FaWhatsapp className="text-3xl" />
                </a>

                {/* Hero Section */}
                <Element name="logo">
                    <motion.section
                        id="logo"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="h-[100vh] flex flex-col items-center justify-center text-center"
                    >
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2 }}
                            src={logoSrc}
                            alt="Omer Tattoo Studio Logo"
                            className="block max-w-[120%] max-h-[120%]"
                        />

                        <motion.a
                            href="https://wa.me/972528787419"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-8 py-2 mt-4 text-sm font-semibold
             rounded-md from-[#c1aa5f] to-[#97BE5A] text-[#3B3024] border border-transparent shadow-sm
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F0EDE5]
             transition-transform duration-150 transform-gpu will-change-transform"
                            aria-label="שלחו הודעה בוואטסאפ"
                        >
                            <FaWhatsapp className="text-base" />
                            לקביעת תור
                        </motion.a>
                    </motion.section>
                </Element>

                {/* Shop Merch Section */}
                <motion.section
                    id="shop"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="container px-5 py-20 mx-auto text-center"
                    dir="rtl"
                >
                    <div className="flex flex-wrap justify-center gap-10">
                        {products.slice(0, 3).map((product: Product) => {
                            const withSizes = !!product.stock;
                            const outOfStock = isOutOfStock(product);

                            return (
                                <motion.div
                                    whileHover={{ scale: 1.06, rotate: 0.5 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    key={product._id}
                                    className="relative w-72 p-5 rounded-3xl bg-white/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#e4d3a1] transition-all"
                                >
                                    {/* תמונה */}
                                    <div className="overflow-hidden rounded-2xl border border-[#f4e7b4] shadow-inner relative">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className={`object-cover w-full h-56 transition-transform duration-300 hover:scale-105 ${outOfStock ? "opacity-30" : ""
                                                }`}
                                        />
                                        {outOfStock && (
                                            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#7a6b3b] bg-white/70 rounded-2xl">
                                                ❌ אזל מהמלאי
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-[#3a3220]">
                                        <h3 className="text-xl font-bold tracking-tight">{product.title}</h3>
                                        <p className="text-lg font-semibold text-[#8b7c4a]">
                                            {Number(product.price).toFixed(2)} ₪
                                        </p>
                                        {product.description && (
                                            <p className="mt-1 text-sm text-[#5b4c33] line-clamp-2">{product.description}</p>
                                        )}
                                    </div>
                                    {!outOfStock && (
                                        <div className="mt-3">
                                            {withSizes ? (
                                                <>
                                                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                                                        {SIZE_KEYS.map((sizeKey) => {
                                                            const data = product.stock?.[sizeKey];
                                                            const disabled = !data || (data.current ?? 0) === 0;
                                                            const selected = selectedSizes[product._id] === sizeKey;

                                                            return (
                                                                <button
                                                                    key={sizeKey}
                                                                    disabled={disabled}
                                                                    onClick={() =>
                                                                        setSelectedSizes((prev) => ({
                                                                            ...prev,
                                                                            [product._id]: sizeKey,
                                                                        }))
                                                                    }
                                                                    className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${disabled
                                                                            ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                                                            : selected
                                                                                ? "bg-[#97BE5A] text-white border-[#7ea649] shadow-md"
                                                                                : "bg-white/80 text-[#3a3220] border-[#cbb279] hover:bg-[#f6f0d4]"
                                                                        }`}
                                                                >
                                                                    {sizeKey.toUpperCase()}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={quantities[product._id] || 1}
                                                        onChange={(e) =>
                                                            setQuantities((prev) => ({
                                                                ...prev,
                                                                [product._id]: Math.max(1, Number(e.target.value) || 1),
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 mt-2 text-sm bg-white/70 border border-[#d7c793] rounded-xl focus:ring-2 focus:ring-[#bfa63b] outline-none"
                                                        placeholder="כמות"
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            addToCart(
                                                                product,
                                                                selectedSizes[product._id] as SizeKey | undefined,
                                                                quantities[product._id] || 1
                                                            )
                                                        }
                                                        className="w-full mt-4 py-2 text-white font-semibold bg-gradient-to-r from-[#c1aa5f] to-[#97BE5A] rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                                    >
                                                        <span>הוסף לסל</span>
                                                        <motion.span
                                                            initial={{ rotate: 0 }}
                                                            animate={{ rotate: [0, 15, -10, 10, 0] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                        >
                                                        
                                                        </motion.span>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={quantities[product._id] || 1}
                                                        onChange={(e) =>
                                                            setQuantities((prev) => ({
                                                                ...prev,
                                                                [product._id]: Math.max(1, Number(e.target.value) || 1),
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 mt-2 text-sm bg-white/70 border border-[#d7c793] rounded-xl focus:ring-2 focus:ring-[#bfa63b] outline-none"
                                                        placeholder="כמות"
                                                    />
                                                    <button
                                                        onClick={() => addToCart(product, "ONE", quantities[product._id] || 1)}
                                                        className="w-full mt-4 py-2 text-white font-semibold bg-gradient-to-r from-[#c1aa5f] to-[#97BE5A] rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                                    >
                                                        <span>הוסף לסל</span>
                                                        <motion.span
                                                            initial={{ rotate: 0 }}
                                                            animate={{ rotate: [0, 15, -10, 10, 0] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                        >
                                                        </motion.span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* See more */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => navigate("/products")}
                            className="px-5 py-2 rounded-full border border-[#cbb279] text-[#3a3220] bg-white/80 hover:bg-[#f6f0d4] transition"
                        >
                            See more
                        </button>
                    </div>
                </motion.section>

                {/* Courses Section */}
                <motion.section
                    id="courses"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="container flex flex-col items-center justify-center gap-10 px-5 py-20 mx-auto md:flex-row"
                >
                    <div className="w-full md:w-1/2">
                        <img src={mainP} alt="main" className="w-[500px] h-[600px] rounded-lg shadow-lg mx-auto" />
                    </div>
                    <div className="w-full text-center text-[#8C734A] md:w-1/2">
                        <h2 className="mb-4 text-3ל font-semibold">קורס קעקועים אינטימי ומעמיק</h2>
                        <p className="max-w-lg mx-auto mb-8 text-lg leading-relaxed">
                            אם תמיד חלמתם להיכנס לעולם הקעקועים – זה המקום להתחיל בו.
                            בקורס קטן ואינטימי (עד 3 משתתפים בלבד) נצלול לעומק האמנות, באווירה קלילה, אישית ומקצועית.
                            חוויה כיפית ופרקטית, שתיתן לכם את כל הכלים להתחיל לקעקע מהלב, בביטחון ובסטייל
                        </p>

                        <div className="flex justify-center gap-2">
                            {["10/07/2025", "15/08/2025", "20/09/2025"].map((date, index) => {
                                const phoneNumber = "972528787419";
                                const message = `היי, אני מעוניין בפרטים על קורס שמתחיל ב- ${date}`;
                                const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                                return (
                                    <motion.a
                                        key={index}
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 text-sm bg-white border border-gray-400 rounded-md cursor-pointer"
                                        whileHover={{ scale: 1.1, backgroundColor: "#97BE5A", color: "#fff" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {date}
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>

                {/* Simulation Area */}
                <motion.section
                    id="simulation"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="container px-5 py-20 mx-auto"
                >
                    <div className="flex flex-col-reverse items-center gap-6 mx-auto max-w-7xl md:flex-row-reverse">
                        <div className="grid grid-cols-2 gap-2 md:w-2/5 place-items-center">
                            {imagesSketches.map((img, index) => (
                                <div key={index} className={`flex flex-col items-center ${index === 2 ? "col-span-2" : ""}`}>
                                    <motion.img
                                        src={img.src}
                                        alt={img.title}
                                        className="object-cover w-48 h-48 rounded-full shadow-md cursor-pointer"
                                        whileHover={{ scale: 1.15, rotate: 2 }}
                                        transition={{ duration: 0.4 }}
                                        onClick={() => handleSelectCategory(img.title.toLowerCase())}
                                    />
                                    <h2 className="mt-3 text-lg font-semibold text-[#3B3024]">{img.title}</h2>
                                </div>
                            ))}
                        </div>
                        <div className="w-full p-8 text-center md:w-3/5 text-[#8C734A]">
                            <h3 className="mb-5 text-4xl font-semibold">הדמיית קעקוע – לראות לפני שמרגישים</h3>
                            <p className="text-lg leading-relaxed">
                                כדי לעזור לכם לדמיין איך הקעקוע ייראה בדיוק עליכם, יצרנו מערכת נוחה להדמיה.
                                כל מה שצריך לעשות: לבחור את העיצוב שמדבר אליכם, להעלות תמונה איכותית של האזור שבו תרצו למקם את הקעקוע – צילום חד, בגובה העיניים, כשהגוף רפוי (ללא מתיחה או תנוחות לא טבעיות).
                                דרך ההדמיה תוכלו למקם את הקעקוע על התמונה, לשחק עם הגודל ולהתאים אותו בדיוק כמו שתרצו.
                                בסיום, ההדמיה תישלח אליי ישירות למייל – ומשם נמשיך לתיאום תור ולתכנון סופי
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Contact us section */}
                <motion.section
                    id="contact"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="container flex justify-center px-6 py-20 mx-auto"
                    dir="rtl"
                >
                    <div className="w-full max-w-xl px-10 py-16 bg-[#F1F3C2] rounded-[80px] shadow-md flex flex-col items-center">
                        <h2 className="mb-4 text-2xl font-semibold text-center text-[#3B3024]">צרו קשר</h2>
                        <p className="mb-6 text-center text-[#5A4B36] text-sm">יש לכם שאלות? מלאו את הטופס ונחזור אליכם בהקדם.</p>

                        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-4">
                            <div className="w-1/2">
                                <label className="block mb-1 text-sm text-[#3B3024]">שם מלא</label>
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="השם שלך"
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#97BE5A]"
                                />
                            </div>

                            <div className="w-1/2">
                                <label className="block mb-1 text-sm text-[#3B3024]">כתובת אימייל</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="האימייל שלך"
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#97BE5A]"
                                />
                            </div>

                            <div className="w-1/2">
                                <label className="block mb-1 text-sm text-[#3B3024]">הודעה</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="ההודעה שלך"
                                    rows={3}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#97BE5A]"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-1/2 px-4 py-2 mt-2 text-sm text-[#97BE5A] bg-[#FAF4E7] rounded-md shadow-md hover:bg-[#97BE5A] hover:text-[#FAF4E7]"
                            >
                                שלח הודעה
                            </button>
                        </form>
                    </div>
                </motion.section>

                <SideCart
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    handleCheckout={handleCheckout}
                />
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-[#9FC87E] hover:bg-[#7ea649] text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
                    title="Open Cart"
                >
                    <FaShoppingCart className="text-xl" />
                </button>
            </div>
        </>
    );
};

export default HomePage;
