import { useSelector } from "react-redux";
import { TRootState } from "../../Store/BigPie";
import { useEffect } from "react";
import product1 from "../../Imges/bamboo-background-texture.jpg";
import merch1 from "../../Imges/merch1.jpg";
import merch2 from "../../Imges/merch2.jpg";
import merch3 from "../../Imges/merch3.jpg";
import mainP from "../../Imges/mainPic.jpg";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import tattoS from "../../Imges/tattooS.jpg";
import tattoM from "../../Imges/tattooM.jpg";
import tattoL from "../../Imges/tattooL.jpg";
import { useNavigate } from "react-router-dom";



const HomePage = () => {
    const user = useSelector((state: TRootState) => state.UserSlice);

    useEffect(() => {
        
    }, []);
    
    const imagesSketches = [
        { src: tattoS, title: "small" },
        { src: tattoM, title: "medium" },
        { src: tattoL, title: "large" }
    ];

    const navigate = useNavigate();

    const handleSelectCategory = (category: string) => {
        navigate(`/gallery/${category}`);
    };


    return (
        <div className="w-full min-h-screen text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-white">
            {user.isLoggedIn && (
                <p className="mt-5 text-lg text-gray-700 dark:text-white">
                    Welcome {user.user?.name?.first}
                </p>
            )}
            <a href="https://wa.me/your-number"
                className="fixed z-50 flex items-center justify-center text-white bg-green-500 rounded-full shadow-md w-14 h-14 top-20 right-10 hover:bg-green-600">
                <FaWhatsapp className="text-3xl" />
            </a>

            {/* bgc Section */}
            <section className="relative h-[120vh] flex flex-col items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${product1})` }}>
                
                
            </section>
            {/* {shop section} */}
            <section className="px-5 py-20 text-center bg-[#F1F3C2]">
                <h2 className="mb-6 text-3xl font-semibold text-[#E8B86D]">Shop Merch</h2>
                <div className="flex flex-wrap justify-center gap-10">
                    {[
                        { image: merch1, price: 29.99, title: "Shirt" },
                        { image: merch2, price: 24.99, title: "Hat" },
                        { image: merch3, price: 39.99, title: "Hoodie" },
                    ].map((product, index) => (
                        <div
                            key={index}
                            className="p-4 bg-[#CBB279] rounded-xl shadow-md w-72 dark:bg-gray-800"
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="object-cover w-full rounded-md h-80"
                            />
                            <p className="mt-2 text-xl font-medium">{product.title}</p>
                            <p className="text-lg text-white">${product.price.toFixed(2)}</p>
                            <div className="flex gap-2 mt-4">
                                <select className="w-1/2 p-2 text-gray-800 border rounded-md dark:text-white dark:bg-gray-800 dark:border-gray-600">
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    className="w-1/2 p-2 text-gray-800 border rounded-md dark:text-white dark:bg-gray-800 dark:border-gray-600"
                                />
                            </div>
                            <button className="px-4 py-2 mt-8 text-[#97BE5A] bg-[#F1F3C2] rounded-md hover:bg-[#97BE5A] hover:text-[#F1F3C2]">
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>
            </section>


            {/* Courses Section */}
            <section className="flex flex-col items-center justify-center gap-10 px-5 py-10 bg-[#F1F3C2] md:flex-row dark:bg-gray-800">
                {/* תמונה בצד שמאל */}
                <div className="w-full md:w-1/2">
                    <img
                        src={mainP}
                        alt={mainP}
                        className="w-[500px] h-[600px]  rounded-lg shadow-lg mx-auto"
                    />
                </div>

                {/* תוכן בצד ימין */}
                <div className="w-full text-center text-[#E8B86D] md:w-1/2 dark:text-gray-300">
                    <h2 className="mb-4 text-3xl font-semibold">Courses</h2>
                    <p className="max-w-lg mx-auto mb-8 text-lg leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus cupiditate quas porro sapiente similique voluptate doloribus magni modi mollitia voluptates unde qui ratione veniam, neque libero molestias aut cumque accusantium inventore rerum vel facilis nobis ut blanditiis! Quisquam ipsam distinctio, officiis nesciunt, facere beatae odit molestias minima aliquid et earum?
                    </p>

                    {/* שלושה תאריכים - קטנים יותר */}
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

                    {/* תמונות בצד ימין - 40% */}
                    <div className="grid grid-cols-2 gap-2 md:w-2/5 place-items-center">
                        {imagesSketches.map((img, index) => (
                            <div key={index} className={`flex flex-col items-center ${index === 2 ? "col-span-2" : ""}`}>
                                <motion.img
                                    src={img.src}
                                    alt={img.title}
                                    className="object-cover w-48 h-48 rounded-full shadow-md"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleSelectCategory(img.title.toLowerCase().replace(" ", "-"))}
                                />
                                <h2 className="mt-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    {img.title}
                                </h2>
                            </div>
                        ))}
                    </div>

                    {/* טקסט בצד שמאל - 60% */}
                    <div className="w-full p-8 text-center bg-[#F1F3C2] text-[#E8B86D] md:w-3/5">
                        <h3 className="mb-5 text-4xl font-semibold">Simulation Area</h3>
                        <p className="text-lg leading-relaxed">
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt in dolor, natus aliquid itaque fugiat dolorem explicabo, consequatur nisi quo, perferendis voluptas corrupti pariatur asperiores alias obcaecati nihil sit eius sint? Facere, quisquam harum? Magnam nesciunt, perspiciatis consequatur saepe enim nobis velit ea quidem dolor optio nihil, esse ad quo distinctio architecto impedit iste harum incidunt earum minus voluptates. Fugit vel nesciunt, nostrum harum saepe quia eveniet? Inventore eaque provident unde beatae commodi, repellat laboriosam quos assumenda, quasi voluptates ullam, cupiditate expedita nobis rem quibusdam enim autem optio aspernatur quaerat porro. Corrupti, ut dolore. Ea ipsam fugiat vitae nihil quisquam maiores excepturi officiis odio soluta nemo cumque esse, cum, dolor perferendis voluptates quod rerum! Error, repellendus minus, officiis quam odio ea atque recusandae beatae quaerat quo fugit ipsam commodi! Saepe id pariatur dolor, debitis nihil optio necessitatibus dolorum nemo cupiditate fugiat odio aspernatur quia, eligendi voluptates vitae ducimus sit sapiente perspiciatis distinctio autem quis est porro deleniti aperiam. Veniam reprehenderit animi repudiandae, natus delectus saepe unde corrupti alias neque autem, earum, eos aliquid molestiae ducimus velit minima sit perferendis! Eos, illo, veritatis vero obcaecati atque odio neque quo debitis adipisci totam minus, tempora facere magni deleniti odit! Nesciunt, ad voluptatem?
                        </p>
                    </div>

                </div>
            </section>

            

            {/* Contact Section */}
            <section className="flex justify-center px-6 py-16  md:px-12 bg-[#F1F3C2] dark:bg-gray-800">
                <div className="w-full max-w-3xl p-8 bg-[#CBB279] rounded-lg shadow-md dark:bg-gray-700">
                    <h2 className="mb-4 text-3xl font-semibold text-center text-gray-800 dark:text-white">Contact Us</h2>
                    <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                        Have questions? Fill out the form and we’ll get back to you soon.
                    </p>

                    <form className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" placeholder="Your Name"
                                className="w-full p-3 text-gray-800 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                            <input type="email" placeholder="Your Email"
                                className="w-full p-3 text-gray-800 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Message</label>
                            <textarea placeholder="Your Message"
                                className="w-full p-3 text-gray-800 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>

                        {/* Submit Button */}
                        <button type="submit"
                            className="w-full px-4 py-2 mt-4 text-[#97BE5A] bg-[#F1F3C2] rounded-md shadow-md hover:bg-[#97BE5A] hover:text-[#F1F3C2]">
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
