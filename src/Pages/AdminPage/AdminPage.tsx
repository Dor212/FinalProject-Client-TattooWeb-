import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const categories = ["small", "medium", "large"];

const AdminPage = () => {
    const [imagesByCategory, setImagesByCategory] = useState<Record<string, string[]>>({});
    const [selectedCategory, setSelectedCategory] = useState("small");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productTitle, setProductTitle] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productImage, setProductImage] = useState<File | null>(null);
    const [stockSmall, setStockSmall] = useState("");
    const [stockMedium, setStockMedium] = useState("");
    const [stockLarge, setStockLarge] = useState("");
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchAllImages = async () => {
            try {
                const results: Record<string, string[]> = {};
                for (const category of categories) {
                    const res = await axios.get(`http://localhost:8080/gallery/${category}`);
                    results[category] = Array.isArray(res.data) ? res.data : [];
                }
                setImagesByCategory(results);
            } catch (err) {
                Swal.fire("Error", "Failed to load sketches", "error");
            }
        };

        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/products");
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
            await axios.post(`http://localhost:8080/gallery/upload/${selectedCategory}`, formData, {
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
            await axios.delete(`http://localhost:8080/gallery/${category}/${filename}`);
            setImagesByCategory((prev) => ({
                ...prev,
                [category]: prev[category].filter((img) => img !== fileUrl),
            }));
            Swal.fire({
                title: "Success",
                text: "Product uploaded successfully",
                icon: "success",
                timer: 1000,
                showConfirmButton: false
            });

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
            await axios.post("http://localhost:8080/products/upload", formData, {
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
            await axios.delete(`http://localhost:8080/products/${id}`);
            setAllProducts((prev) => prev.filter((p: any) => p._id !== id));
            Swal.fire({
                title: "Success",
                text: "Product uploaded successfully",
                icon: "success",
                timer: 1000,
                showConfirmButton: false
            });

        } catch (err) {
            Swal.fire("Error", "Failed to delete product", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#CBB279] p-6 text-[#F1F3C2]">
            <h1 className="mb-6 text-4xl font-bold text-center">Admin Dashboard</h1>

            {/* Upload Product Section */}
            <div className="bg-[#5A4634] p-6 rounded-lg mb-10 max-w-3xl mx-auto shadow-lg">
                <h2 className="text-2xl mb-4 font-semibold text-center text-[#F1F3C2]">Add New Product</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input type="text" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} placeholder="Product Title" className="p-3 rounded bg-white text-[#5A4634] border" />
                    <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Price" className="p-3 rounded bg-white text-[#5A4634] border" />
                    <input type="number" placeholder="Stock S" value={stockSmall} onChange={(e) => setStockSmall(e.target.value)} className="p-3 rounded bg-white text-[#5A4634] border" />
                    <input type="number" placeholder="Stock M" value={stockMedium} onChange={(e) => setStockMedium(e.target.value)} className="p-3 rounded bg-white text-[#5A4634] border" />
                    <input type="number" placeholder="Stock L" value={stockLarge} onChange={(e) => setStockLarge(e.target.value)} className="p-3 rounded bg-white text-[#5A4634] border" />
                    <input type="file" onChange={(e) => setProductImage(e.target.files?.[0] || null)} className="text-[#5A4634] bg-white border p-2 rounded" />
                </div>
                <button onClick={handleProductUpload} className="w-full mt-4 bg-[#F1F3C2] text-[#5A4634] py-2 px-4 rounded hover:bg-[#e6db9c] transition">
                    Upload Product
                </button>
            </div>

            {/* Product List */}
            <div className="max-w-6xl mx-auto mb-20">
                <h2 className="mb-6 text-3xl font-bold text-center">Product List</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {allProducts.map((product: any) => {
                        const total = (product.stock?.small || 0) + (product.stock?.medium || 0) + (product.stock?.large || 0);
                        const isOutOfStock = total === 0;

                        return (
                            <div key={product._id} className="bg-white text-[#5A4634] p-4 rounded-lg shadow relative">
                                <img src={`http://localhost:8080${product.imageUrl}`} alt={product.title} className={`w-full h-48 object-cover rounded-md mb-4 ${isOutOfStock ? "opacity-40" : ""}`} />
                                <h3 className="mb-1 text-xl font-semibold">{product.title}</h3>
                                <p className="mb-2">Price: ${product.price}</p>
                                <p className="text-sm">Stock: S({product.stock?.small || 0}), M({product.stock?.medium || 0}), L({product.stock?.large || 0})</p>
                                {isOutOfStock && <p className="mt-2 font-bold text-red-600">Out of Stock</p>}
                                <button onClick={() => handleProductDelete(product._id)} className="absolute px-2 py-1 text-white bg-red-600 rounded top-2 right-2 hover:bg-red-800">✕</button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upload Sketches Section */}
            <div className="bg-[#5A4634] p-6 rounded-lg mb-10 max-w-3xl mx-auto shadow-lg">
                <h2 className="text-2xl mb-4 font-semibold text-center text-[#F1F3C2]">Upload Sketch</h2>
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white text-[#5A4634] px-4 py-2 rounded border w-full md:w-auto"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                    </select>
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="text-[#5A4634] px-4 py-2 rounded border bg-white w-full md:w-auto"
                    />
                    <button
                        onClick={handleUploadSketch}
                        className="bg-[#F1F3C2] text-[#5A4634] px-4 py-2 rounded hover:bg-[#e6db9c] transition w-full md:w-auto"
                    >
                        Upload Sketch
                    </button>
                </div>
            </div>

            {/* Sketches Display */}
            {categories.map((category) => (
                <div key={category} className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-[#F1F3C2] pb-2">{category.toUpperCase()}</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                        {Array.isArray(imagesByCategory[category]) &&
                            imagesByCategory[category].map((imgUrl) => (
                                <motion.div key={imgUrl} className="relative group overflow-hidden rounded shadow-lg border border-[#F1F3C2]" whileHover={{ scale: 1.05 }}>
                                    <img src={`http://localhost:8080${imgUrl}`} alt="sketch" className="object-cover w-full h-40" />
                                    <motion.button onClick={() => handleDeleteSketch(category, imgUrl)} className="absolute p-1 text-white transition bg-red-700 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100" title="Delete" whileHover={{ scale: 1.2 }}>
                                        ✕
                                    </motion.button>
                                </motion.div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminPage;