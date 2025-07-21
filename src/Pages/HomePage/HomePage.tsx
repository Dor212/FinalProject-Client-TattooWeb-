
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SideCart from "../../components/SideCart.tsx";
import mainP from "../../Imges/mainPic.jpg";
import tattoS from "../../Imges/tattooS.jpg";
import tattoM from "../../Imges/tattooM.jpg";
import tattoL from "../../Imges/tattooL.jpg";
import { Product } from "../../Types/TProduct.ts";



const HomePage = () => {
    
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState<{ _id: string; size: string; quantity: number; title: string; price: number; imageUrl: string }[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { VITE_API_URL }= import.meta.env;

    useEffect(() => {
        const fetchMerch = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/products/`);
                setProducts(response.data);
            } catch (err) {
                console.error("Error loading products:", err);
            }
        };
        fetchMerch();
    }, []);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product:Product, size: string, quantity: number) => {
        if (!size) {
            Swal.fire("Select Size", "Please choose a size before adding to cart", "warning", );
            return;
        }
        const existingItem = cart.find(item => item._id === product._id && item.size === size);
        if (existingItem) {
            const updatedCart = cart.map(item =>
                item._id === product._id && item.size === size
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
            setCart(updatedCart);
        } else {
            setCart(prev => [...prev, { ...product, size, quantity }]);
        }
        setIsCartOpen(true);
        Swal.fire({
            title: "Added to cart!",
            text: `${product.title} (${size})`,
            icon: "success",
            timer: 800,
            showConfirmButton: false,
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCart(prev =>
            prev.map(item =>
                item._id === productId ? { ...item, quantity: quantity } : item
            )
        );
    };

    const removeFromCart = (productId: string, size: string) => {
        setCart(prev => prev.filter(item => !(item._id === productId && item.size === size)));
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
            preConfirm: () => ({
                fullname: (document.getElementById("fullname") as HTMLInputElement).value,
                phone: (document.getElementById("phone") as HTMLInputElement).value,
                city: (document.getElementById("city") as HTMLInputElement).value,
                street: (document.getElementById("street") as HTMLInputElement).value,
                houseNumber: (document.getElementById("houseNumber") as HTMLInputElement).value,
                zip: (document.getElementById("zip") as HTMLInputElement).value,
            }),
        }).then(async ({ isConfirmed, value }) => {
            if (isConfirmed) {
                try {
                    await axios.post(`${VITE_API_URL}/users/orders`, { customerDetails: value, cart });
                    Swal.fire("Success", "Your order has been placed!", "success");
                    setCart([]);
                    setIsCartOpen(false);
                } catch {
                    Swal.fire("Error", "There was an issue placing the order", "error");
                }
            }
        });
    };

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

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await axios.post(`${VITE_API_URL}/users/contact`, formData);
            Swal.fire("Message Sent!", "We’ll get back to you soon.", "success");
            setFormData({ name: "", email: "", message: "" });
        } catch (err) {
            Swal.fire("Oops!", "Failed to send message", "error");
        }
    };

    return (
        <div className="w-full min-h-screen pt-20 text-[#3B3024] font-serif"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
                backgroundColor: "#FFFFFF"
            }}>
            <a
                href="https://wa.me/972528787419"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed z-50 flex items-center justify-center text-white bg-green-500 rounded-full shadow-md w-14 h-14 top-20 right-10 hover:bg-green-600"
            >
                <FaWhatsapp className="text-3xl" />
            </a>


            {/* Hero Section */}
            <motion.section id="hero" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}
                viewport={{ once: true }} className="h-[100vh] flex items-center justify-center">
                <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    src="/backgrounds/LogoOmerTattoo_transparent.png"
                    alt="Omer Tattoo Studio Logo"
                    className="max-w-[80%] max-h-[80%]"
                />
            </motion.section>

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
                    {products.map((product:Product, index) => {
                        const totalStock = Object.values(product.stock || {}).reduce((a, b) => a + b, 0);
                        const isOutOfStock = totalStock === 0;

                        return (
                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0px 5px 12px rgba(0,0,0,0.15)" }}
                                transition={{ duration: 0.3 }}
                                key={index}
                                className="relative p-4 bg-[#CBB279] rounded-xl shadow-md w-72"
                            >
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className={`object-cover w-full h-80 rounded-md ${isOutOfStock ? "opacity-40" : ""}`}
                                />
                                {isOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold bg-white/70">
                                        אזל מהמלאי
                                    </div>
                                )}
                                <p className="mt-2 text-xl font-medium">{product.title}</p>
                                <p className="text-lg">{Number(product.price).toFixed(2)} ₪</p>

                                {!isOutOfStock && (
                                    <>
                                        <select
                                            value={selectedSizes[product._id] || ""}
                                            onChange={(e) =>
                                                setSelectedSizes((prev) => ({
                                                    ...prev,
                                                    [product._id]: e.target.value,
                                                }))
                                            }
                                            className="w-full p-2 mt-2 border rounded-md"
                                        >
                                            <option value="">בחר מידה</option>
                                            {Object.entries(product.stock).map(
                                                ([size, qty]) => qty > 0 && <option key={size}>{size}</option>
                                            )}
                                        </select>

                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[product._id] || 1}
                                            onChange={(e) =>
                                                setQuantities((prev) => ({
                                                    ...prev,
                                                    [product._id]: Number(e.target.value),
                                                }))
                                            }
                                            className="w-full p-2 mt-2 border rounded-md"
                                            placeholder="כמות"
                                        />

                                        <button
                                            onClick={() =>
                                                addToCart(
                                                    product,
                                                    selectedSizes[product._id],
                                                    quantities[product._id] || 1
                                                )
                                            }
                                            className="w-full px-4 py-2 mt-4 text-white transition-all duration-300 bg-[#97BE5A] rounded hover:bg-[#7ea649] hover:scale-105"
                                        >
                                            הוסף לסל
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            {/* Courses Section */}
            <motion.section id="courses" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="container flex flex-col items-center justify-center gap-10 px-5 py-20 mx-auto md:flex-row">
                <div className="w-full md:w-1/2">
                    <img src={mainP} alt="main" className="w-[500px] h-[600px] rounded-lg shadow-lg mx-auto" />
                </div>
                <div className="w-full text-center text-[#8C734A] md:w-1/2">
                    <h2 className="mb-4 text-3xl font-semibold">קורס קעקועים אינטימי ומעמיק</h2>
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
            <motion.section id="simulation" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="container px-5 py-20 mx-auto">
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

            {/*Contact us section*/}
            <motion.section
                id="contact"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="container flex justify-center px-6 py-20 mx-auto"
                dir="rtl"
            >
                <div className="w-full max-w-xl px-10 py-16 bg-[#CBB279] rounded-[80px] shadow-md flex flex-col items-center">
                    <h2 className="mb-4 text-2xl font-semibold text-center text-[#3B3024]">
                        צרו קשר
                    </h2>
                    <p className="mb-6 text-center text-[#5A4B36] text-sm">
                        יש לכם שאלות? מלאו את הטופס ונחזור אליכם בהקדם.
                    </p>

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
                className="fixed bottom-6 right-6 z-50 bg-[#97BE5A] hover:bg-[#7ea649] text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
                title="Open Cart"
            >
                <FaShoppingCart className="text-xl" />
            </button>
        </div>
    );
};

export default HomePage;
