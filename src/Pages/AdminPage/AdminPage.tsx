import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {  FaBoxOpen, FaExclamationTriangle, FaPaintBrush } from "react-icons/fa";



const categories = ["small", "medium", "large"];

const AdminPage = () => {
    const { VITE_API_URL } = import.meta.env;
    const [imagesByCategory, setImagesByCategory] = useState<Record<string, string[]>>({});
    const [selectedCategory, setSelectedCategory] = useState("small");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productTitle, setProductTitle] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productImage, setProductImage] = useState<File | null>(null);
    const [stockSmall, setStockSmall] = useState("");
    const [stockMedium, setStockMedium] = useState("");
    const [stockLarge, setStockLarge] = useState("");
    const [allProducts, setAllProducts] = useState<{ _id: string; title: string; price: number; imageUrl: string; stock?: { small: number; medium: number; large: number } }[]>([]);

    useEffect(() => {
        const fetchAllImages = async () => {
            try {
                const results: Record<string, string[]> = {};
                for (const category of categories) {
                    const res = await axios.get(`${VITE_API_URL}/gallery/${category}`);
                    results[category] = Array.isArray(res.data) ? res.data : [];
                }
                setImagesByCategory(results);
            } catch (err) {
                Swal.fire("Error", "Failed to load sketches", "error");
            }
        };

        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${VITE_API_URL}/products`);
                setAllProducts(res.data);
            } catch (err) {
                Swal.fire("Error", "Failed to load products", "error");
            }
        };

        fetchAllImages();
        fetchProducts();
    }, []);

    const handleUploadSketch = async () => {
        if (!imageFile) return;
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            await axios.post(`${VITE_API_URL}/gallery/upload/${selectedCategory}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Success", "Sketch uploaded and processed", "success").then(() => window.location.reload());
        } catch (err) {
            Swal.fire("Error", "Failed to upload sketch", "error");
        }
    };

    const handleDeleteSketch = async (category: string, fileUrl: string) => {
        const filename = fileUrl.split("/").pop();
        const confirmed = await Swal.fire({
            title: "Are you sure?",
            text: "This image will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axios.delete(`${VITE_API_URL}/gallery/${category}/${filename}`);
            setImagesByCategory((prev) => ({
                ...prev,
                [category]: prev[category].filter((img) => img !== fileUrl),
            }));
            Swal.fire("Success", "Sketch deleted successfully", "success");
        } catch (err) {
            Swal.fire("Error", "Failed to delete sketch", "error");
        }
    };

    const handleProductUpload = async () => {
        if (!productTitle || !productPrice || !productImage) return;

        const formData = new FormData();
        formData.append("title", productTitle);
        formData.append("price", productPrice);
        formData.append("image", productImage);
        formData.append("stockSmall", stockSmall);
        formData.append("stockMedium", stockMedium);
        formData.append("stockLarge", stockLarge);

        try {
            await axios.post(VITE_API_URL + "/products/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProductTitle("");
            setProductPrice("");
            setProductImage(null);
            setStockSmall("");
            setStockMedium("");
            setStockLarge("");

            Swal.fire("Success", "Product uploaded successfully", "success");
        } catch (err) {
            Swal.fire("Error", "Failed to upload product", "error");
        }
    };

    const handleProductDelete = async (id: string) => {
        const confirmed = await Swal.fire({
            title: "Are you sure?",
            text: "This product will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axios.delete(`${VITE_API_URL}/products/${id}`);
            setAllProducts((prev) => prev.filter((p: { _id: string }) => p._id !== id));
            Swal.fire("Success", "Product deleted successfully", "success");
        } catch (err) {
            Swal.fire("Error", "Failed to delete product", "error");
        }
    };
   /*  const totalStock = allProducts.reduce((sum, p) => sum + (p.stock?.small || 0) + (p.stock?.medium || 0) + (p.stock?.large || 0), 0); */
    const outOfStockCount = allProducts.filter((p) => ((p.stock?.small || 0) + (p.stock?.medium || 0) + (p.stock?.large || 0)) === 0).length;
    const totalSketches = Object.values(imagesByCategory).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div className="min-h-screen pt-20 font-serif text-[#3B3024] bg-[#FFFFFF]" style={{ backgroundImage: "url('/backgrounds/BG4.png')", backgroundRepeat: "no-repeat", backgroundSize: "contain", backgroundPosition: "right top", backgroundAttachment: "fixed" }}>
            <h1 className="mb-10 text-4xl font-bold text-center">Admin Dashboard</h1>

            <div className="grid grid-cols-1 gap-6 mx-auto mb-10 sm:grid-cols-3 max-w-7xl">
                <div className="bg-[#CBB279] text-center rounded-xl p-6 shadow-lg">
                    <FaBoxOpen className="mx-auto mb-2 text-3xl" />
                    <p className="text-xl font-semibold">{allProducts.length}</p>
                    <p className="text-sm">Total Products</p>
                </div>
                <div className="bg-[#F1F3C2] text-center rounded-xl p-6 shadow-lg">
                    <FaExclamationTriangle className="mx-auto mb-2 text-3xl text-red-600" />
                    <p className="text-xl font-semibold">{outOfStockCount}</p>
                    <p className="text-sm">Out of Stock</p>
                </div>
                <div className="bg-[#97BE5A] text-white text-center rounded-xl p-6 shadow-lg">
                    <FaPaintBrush className="mx-auto mb-2 text-3xl" />
                    <p className="text-xl font-semibold">{totalSketches}</p>
                    <p className="text-sm">Total Sketches</p>
                </div>
            </div>

            {/* Upload Product Section */}
            <section className="bg-[#CBB279] text-[#3B3024] p-6 rounded-xl mb-12 max-w-3xl mx-auto shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-center">Add New Product</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input type="text" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} placeholder="Product Title" className="p-3 border rounded" />
                    <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Price" className="p-3 border rounded" />
                    <input type="number" placeholder="Stock S" value={stockSmall} onChange={(e) => setStockSmall(e.target.value)} className="p-3 border rounded" />
                    <input type="number" placeholder="Stock M" value={stockMedium} onChange={(e) => setStockMedium(e.target.value)} className="p-3 border rounded" />
                    <input type="number" placeholder="Stock L" value={stockLarge} onChange={(e) => setStockLarge(e.target.value)} className="p-3 border rounded" />
                    <input type="file" onChange={(e) => setProductImage(e.target.files?.[0] || null)} className="p-2 border rounded" />
                </div>
                <button onClick={handleProductUpload} className="w-full mt-4 bg-[#97BE5A] text-white py-2 px-4 rounded hover:bg-[#7ea649] transition">
                    Upload Product
                </button>
            </section>

            {/* Product List */}
            <section className="max-w-6xl mx-auto mb-20">
                <h2 className="mb-6 text-3xl font-bold text-center">Product List</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {allProducts.map((product) => {
                        const total = (product.stock?.small || 0) + (product.stock?.medium || 0) + (product.stock?.large || 0);
                        const isOutOfStock = total === 0;

                        return (
                            <div key={product._id} className="bg-white text-[#3B3024] p-4 rounded-lg shadow relative">
                                <img src={`${VITE_API_URL}${product.imageUrl}`} alt={product.title} className={`w-full h-48 object-cover rounded-md mb-4 ${isOutOfStock ? "opacity-40" : ""}`} />
                                <h3 className="mb-1 text-xl font-semibold">{product.title}</h3>
                                <p className="mb-2">Price: ${product.price}</p>
                                <p className="text-sm">Stock: S({product.stock?.small || 0}), M({product.stock?.medium || 0}), L({product.stock?.large || 0})</p>
                                {isOutOfStock && <p className="mt-2 font-bold text-red-600">Out of Stock</p>}
                                <button onClick={() => handleProductDelete(product._id)} className="absolute px-2 py-1 text-white bg-red-600 rounded top-2 right-2 hover:bg-red-800">✕</button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Upload Sketches Section */}
            <section className="bg-[#CBB279] text-[#3B3024] p-6 rounded-xl mb-12 max-w-3xl mx-auto shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-center">Upload Sketch</h2>
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white text-[#3B3024] px-4 py-2 rounded border w-full md:w-auto"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                    </select>
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="text-[#3B3024] px-4 py-2 rounded border bg-white w-full md:w-auto"
                    />
                    <button
                        onClick={handleUploadSketch}
                        className="bg-[#97BE5A] text-white px-4 py-2 rounded hover:bg-[#7ea649] transition w-full md:w-auto"
                    >
                        Upload Sketch
                    </button>
                </div>
            </section>
            {/* Sketches Display */}
            {categories.map((category) => (
                <section key={category} className="px-4 mb-20 sm:px-6">
                    <h2 className="text-2xl font-semibold text-[#8C734A] mb-6 border-b border-[#8C734A]/50 pb-2 tracking-wide">
                        {category.toUpperCase()} SKETCHES
                    </h2>
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                        {imagesByCategory[category]?.map((imgUrl) => (
                            <motion.div
                                key={imgUrl}
                                className="relative group bg-white rounded-xl overflow-hidden border border-[#e2d9c3] shadow transition-all hover:shadow-lg"
                                whileHover={{ scale: 1.03 }}
                            >
                                <img src={`${VITE_API_URL}${imgUrl}`}
                                    alt="sketch"
                                    className="object-cover w-full h-full aspect-square"
                                />
                                <motion.button
                                    onClick={() => handleDeleteSketch(category, imgUrl)}
                                    className="absolute p-1 text-white transition rounded-full opacity-0 top-2 right-2 bg-red-600/90 group-hover:opacity-100"
                                    title="Delete"
                                    whileHover={{ scale: 1.2 }}
                                >
                                    ✕
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </section>
            ))}

        </div>
    );
};

export default AdminPage;
