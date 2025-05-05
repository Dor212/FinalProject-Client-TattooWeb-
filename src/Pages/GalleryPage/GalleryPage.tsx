import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
        <div className="flex flex-col items-center min-h-screen p-10 bg-[#CBB279] dark:bg-gray-900 dark:text-white">
            <h1 className="mb-10 text-7xl font-bold text-center text-[#F1F3C2]">{category?.toUpperCase()} Gallery</h1>

            {loading && <p className="text-center">Loading images...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="flex flex-wrap justify-center max-w-6xl gap-8 mx-auto">
                {images.map((img, index) => (
                    <div key={index} className="flex flex-col items-center p-4 transition duration-300 transform bg-white shadow-lg rounded-2xl hover:scale-105 hover:shadow-2xl">
                        <img
                            src={`${VITE_API_URL}${img}`}
                            alt={`Sketch ${index}`}
                            className="object-cover w-56 h-56 transition duration-300 transform rounded-lg cursor-pointer hover:scale-110"
                            onClick={() => handleSketchClick(`${VITE_API_URL}${img}`)}

                        />
                        <h2 className="mt-4 text-lg font-semibold text-[#3B3024]">Sketch {index + 1}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryPage;
