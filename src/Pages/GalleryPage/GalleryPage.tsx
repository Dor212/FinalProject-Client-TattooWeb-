import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GalleryPage = () => {
    const { category } = useParams();
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/gallery/${category}`);
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
        <div className="flex flex-col items-center min-h-screen p-10 text-gray-800 bg-[#CBB279] dark:bg-gray-900 dark:text-white">
            <h1 className="mb-10 text-7xl font-bold text-center text-[#F1F3C2]">{category?.toUpperCase()} Gallery</h1>

            {loading && <p className="text-center">Loading images...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="flex flex-wrap justify-center max-w-6xl gap-4 mx-auto">
                {images.map((img, index) => (
                    <div key={index} className="flex flex-col items-center p-3 bg-white shadow-lg rounded-2xl">
                        <img
                            src={`http://localhost:8080${img}`}
                            alt={`Sketch ${index}`}
                            className="object-cover w-48 h-48 rounded-lg cursor-pointer"
                            onClick={() => handleSketchClick(`http://localhost:8080${img}`)}  // שולח את כתובת הסקיצה
                        />
                        <h2 className="mt-2 text-lg font-semibold text-gray-700">Sketch {index + 1}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryPage;
