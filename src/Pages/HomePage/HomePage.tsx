import { useSelector } from "react-redux";
import { TRootState } from "../../Store/BigPie";
import { useEffect, useState } from "react";
import axios from "axios";
import product1 from "../../Imges/bamboo-background-texture.jpg";
import mainP from "../../Imges/mainPic.jpg";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import tattoS from "../../Imges/tattooS.jpg";
import tattoM from "../../Imges/tattooM.jpg";
import tattoL from "../../Imges/tattooL.jpg";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
    const user = useSelector((state: TRootState) => state.UserSlice);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchMerch = async () => {
            try {
                const response = await axios.get("http://localhost:8080/products");
                setProducts(response.data);
            } catch (err) {
                console.error("שגיאה בטעינת מוצרים:", err);
            }
        };

        fetchMerch();
    }, []);

    const imagesSketches = [
        { src: tattoS, title: "small" },
        { src: tattoM, title: "medium" },
        { src: tattoL, title: "large" },
    ];

    const handleSelectCategory = (category: string) => {
        navigate(`/gallery/${category}`);
    };

    return (
        <div className="w-full min-h-screen text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-white">
            {/* כפתור וואטסאפ */}
            <a
                href="https://wa.me/your-number"
                className="fixed z-50 flex items-center justify-center text-white bg-green-500 rounded-full shadow-md w-14 h-14 top-20 right-10 hover:bg-green-600"
            >
                <FaWhatsapp className="text-3xl" />
            </a>

            {/* Hero Section */}
            <section
                className="relative h-[120vh] flex flex-col items-center justify-center text-center bg-cover bg-center"
                style={{ backgroundImage: `url(${product1})` }}
            ></section>

            {/* Shop Merch Section */}
            <section className="px-5 py-20 text-center bg-[#F1F3C2]">
                <h2 className="mb-6 text-3xl font-semibold text-[#E8B86D]">Shop Merch</h2>
                <div className="flex flex-wrap justify-center gap-10">
                    {products.map((product, index) => {
                        const totalStock =
                            (product.stock?.small || 0) +
                            (product.stock?.medium || 0) +
                            (product.stock?.large || 0);
                        const isOutOfStock = totalStock === 0;

                        return (
                            <div
                                key={index}
                                className="relative p-4 bg-[#CBB279] rounded-xl shadow-md w-72 dark:bg-gray-800"
                            >
                                <div className="relative">
                                    <img
                                        src={`http://localhost:8080${product.imageUrl}`}
                                        alt={product.title}
                                        className={`object-cover w-full h-80 rounded-md ${isOutOfStock ? "opacity-40" : ""
                                            }`}
                                    />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-red-700 rounded-md bg-white/70">
                                            אזל מהמלאי
                                        </div>
                                    )}
                                </div>

                                <p className="mt-2 text-xl font-medium">{product.title}</p>
                                <p className="text-lg text-white">${Number(product.price).toFixed(2)}</p>

                                {!isOutOfStock && (
                                    <>
                                        <div className="flex gap-2 mt-4">
                                            <select className="w-1/2 p-2 text-gray-800 border rounded-md dark:text-white dark:bg-gray-800 dark:border-gray-600">
                                                {product.stock?.small > 0 && <option value="small">Small</option>}
                                                {product.stock?.medium > 0 && <option value="medium">Medium</option>}
                                                {product.stock?.large > 0 && <option value="large">Large</option>}
                                            </select>
                                            <input
                                                type="number"
                                                min="1"
                                                defaultValue="1"
                                                className="w-1/2 p-2 text-gray-800 border rounded-md dark:text-white dark:bg-gray-800 dark:border-gray-600"
                                            />
                                        </div>

                                        <button className="px-4 py-2 mt-8 text-[#97BE5A] bg-[#F1F3C2] rounded-md hover:bg-[#97BE5A] hover:text-[#F1F3C2] transition">
                                            Buy Now
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Courses Section */}
            <section className="flex flex-col items-center justify-center gap-10 px-5 py-10 bg-[#F1F3C2] md:flex-row dark:bg-gray-800">
                <div className="w-full md:w-1/2">
                    <img
                        src={mainP}
                        alt="main"
                        className="w-[500px] h-[600px] rounded-lg shadow-lg mx-auto"
                    />
                </div>
                <div className="w-full text-center text-[#E8B86D] md:w-1/2 dark:text-gray-300">
                    <h2 className="mb-4 text-3xl font-semibold">Courses</h2>
                    <p className="max-w-lg mx-auto mb-8 text-lg leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
                        cupiditate quas porro sapiente voluptate.
                    </p>
                    <div className="flex justify-center gap-2">
                        {["10/04/2025", "15/05/2025", "20/06/2025"].map((date, index) => (
                            <motion.div
                                key={index}
                                className="px-3 py-1 text-sm text-[#97BE5A] transition-all bg-white border border-gray-400 rounded-md cursor-pointer dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                whileHover={{ scale: 1.1, boxShadow: "0px 3px 8px rgba(0,0,0,0.2)" }}
                            >
                                {date}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Simulation Area */}
            <section className="bg-[#F1F3C2] px-5 py-10">
                <div className="flex flex-col-reverse items-center gap-6 mx-auto max-w-7xl md:flex-row-reverse">
                    <div className="grid grid-cols-2 gap-2 md:w-2/5 place-items-center">
                        {imagesSketches.map((img, index) => (
                            <div
                                key={index}
                                className={`flex flex-col items-center ${index === 2 ? "col-span-2" : ""}`}
                            >
                                <motion.img
                                    src={img.src}
                                    alt={img.title}
                                    className="object-cover w-48 h-48 rounded-full shadow-md"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleSelectCategory(img.title.toLowerCase())}
                                />
                                <h2 className="mt-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    {img.title}
                                </h2>
                            </div>
                        ))}
                    </div>
                    <div className="w-full p-8 text-center bg-[#F1F3C2] text-[#E8B86D] md:w-3/5">
                        <h3 className="mb-5 text-4xl font-semibold">Simulation Area</h3>
                        <p className="text-lg leading-relaxed">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
                            in dolor, natus aliquid itaque fugiat dolorem explicabo...
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="flex justify-center px-6 py-16 md:px-12 bg-[#F1F3C2] dark:bg-gray-800">
                <div className="w-full max-w-3xl p-8 bg-[#CBB279] rounded-lg shadow-md dark:bg-gray-700">
                    <h2 className="mb-4 text-3xl font-semibold text-center text-gray-800 dark:text-white">
                        Contact Us
                    </h2>
                    <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                        Have questions? Fill out the form and we’ll get back to you soon.
                    </p>
                    <form className="space-y-4">
                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-3 text-gray-800 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full p-3 text-gray-800 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Message</label>
                            <textarea
                                placeholder="Your Message"
                                className="w-full p-3 text-gray-800 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 mt-4 text-[#97BE5A] bg-[#F1F3C2] rounded-md shadow-md hover:bg-[#97BE5A] hover:text-[#F1F3C2]"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
