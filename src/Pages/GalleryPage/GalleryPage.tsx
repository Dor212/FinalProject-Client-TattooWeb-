import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const GalleryPage = () => {
    const { VITE_API_URL } = import.meta.env;
    const { category } = useParams();
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/gallery/${category}`);
                if (Array.isArray(response.data)) {
                    setImages(response.data);
                } else {
                    throw new Error("Invalid data format");
                }
            } catch (err) {
                console.error("Error fetching images:", err);
                setError("Failed to load images");
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [category]);

    const handleSketchClick = (sketchUrl: string) => {
        navigate("/apply-sketch", { state: { selectedSketch: sketchUrl } });
    };

    return (
        <div className="flex flex-col items-center min-h-screen px-4 pt-28 pb-10 bg-[#CBB279] dark:bg-gray-900 dark:text-white">
       
            <h1 className="mb-2 text-4xl sm:text-5xl md:text-6xl font-bold text-center text-[#F1F3C2]">
                {category?.toUpperCase()} Gallery
            </h1>

       
            <p className="text-[#3B3024] text-lg text-center mb-4">
                בחר סקיצה מתוך הגלריה והתחל לעצב על הגוף שלך
            </p>

      
            <hr className="w-24 h-1 mb-10 bg-[#F1F3C2] rounded-full border-0" />

      
            {loading && <p className="text-lg text-center">טוען תמונות...</p>}
            {error && <p className="text-lg text-center text-red-500">{error}</p>}

            <div
                className="grid w-full max-w-6xl gap-5 px-2 sm:px-4"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}
            >
                {images.map((img, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative flex flex-col items-center p-3 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl group"
                    >
                   
                        <div className="relative w-full overflow-hidden rounded-lg cursor-pointer aspect-square">
                            <img
                                src={`${VITE_API_URL}${img}`}
                                alt={`Sketch ${index}`}
                                onClick={() => handleSketchClick(`${VITE_API_URL}${img}`)}
                                className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-110"
                            />
                        </div>

                        <h2 className="mt-3 text-base font-medium text-[#3B3024]">סקיצה {index + 1}</h2>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GalleryPage;
