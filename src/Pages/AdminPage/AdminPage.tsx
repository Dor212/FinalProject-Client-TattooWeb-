import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaBoxOpen, FaExclamationTriangle, FaPaintBrush } from "react-icons/fa";
import { Product } from "../../Types/TProduct";
import StockEditorModal from "../../components/admin/StockEditorModal";

const categories = ["small", "medium", "large"];

const AdminPage = () => {
    const VITE_API_URL = import.meta.env.VITE_API_URL as string;

    // Sketches
    const [imagesByCategory, setImagesByCategory] = useState<Record<string, string[]>>({});
    const [selectedCategory, setSelectedCategory] = useState("small");
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Products
    const [productTitle, setProductTitle] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDescription, setProductDescription] = useState(""); 
    const [productImage, setProductImage] = useState<File | null>(null);

    // סטוק למידות החדשות (אופציונלי)
    const [stockL, setStockL] = useState("");
    const [stockXL, setStockXL] = useState("");
    const [stockXXL, setStockXXL] = useState("");

    const [allProducts, setAllProducts] = useState<Product[]>([]);

    // Modal
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openStockEditor = (p: Product) => {
        setSelectedProduct(p);
        setStockModalOpen(true);
    };
    const handleProductPatched = (updated: Product) => {
        setAllProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    };

    useEffect(() => {
        const fetchAllImages = async () => {
            try {
                const results: Record<string, string[]> = {};
                for (const category of categories) {
                    const res = await axios.get(`${VITE_API_URL}/gallery/${category}`);
                    results[category] = Array.isArray(res.data) ? res.data : [];
                }
                setImagesByCategory(results);
            } catch {
                Swal.fire("Error", "Failed to load sketches", "error");
            }
        };

        const fetchProducts = async () => {
            try {
                const res = await axios.get<Product[]>(`${VITE_API_URL}/products`);
                setAllProducts(res.data);
            } catch {
                Swal.fire("Error", "Failed to load products", "error");
            }
        };

        fetchAllImages();
        fetchProducts();
    }, [VITE_API_URL]);

    const handleUploadSketch = async () => {
        if (!imageFile) return;
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            await axios.post(`${VITE_API_URL}/gallery/upload/${selectedCategory}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Success", "Sketch uploaded and processed", "success").then(() =>
                window.location.reload()
            );
        } catch {
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
        } catch {
            Swal.fire("Error", "Failed to delete sketch", "error");
        }
    };

    const handleProductUpload = async () => {
        if (!productTitle || !productPrice || !productImage) {
            Swal.fire("Validation", "Please fill title, price and choose an image", "info");
            return;
        }

        const formData = new FormData();
        formData.append("title", productTitle);
        formData.append("price", productPrice);
        formData.append("image", productImage);

       
        if (productDescription.trim() !== "") {
            formData.append("description", productDescription.trim());
        }

        // מידות אופציונליות — נשלח רק אם מולאו
        if (stockL !== "") formData.append("stockL", stockL);
        if (stockXL !== "") formData.append("stockXL", stockXL);
        if (stockXXL !== "") formData.append("stockXXL", stockXXL);

        try {
            const res = await axios.post<Product>(`${VITE_API_URL}/products/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // אפס שדות
            setProductTitle("");
            setProductPrice("");
            setProductDescription(""); 
            setStockL("");
            setStockXL("");
            setStockXXL("");
            setProductImage(null);

            setAllProducts((prev) => [res.data, ...prev]);

            Swal.fire({
                title: "Success",
                text: "Product uploaded successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({
                title: "Error",
                text: "Failed to upload product",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
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
            setAllProducts((prev) => prev.filter((p) => p._id !== id));
            Swal.fire({
                title: "Success",
                text: "Product deleted successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({
                title: "Error",
                text: "Failed to delete product",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    // עזרי תצוגה למלאי
    const getCur = (p: Product, key: "l" | "xl" | "xxl") => p.stock?.[key]?.current ?? 0;
    const getInit = (p: Product, key: "l" | "xl" | "xxl") => p.stock?.[key]?.initial ?? 0;

    const outOfStockCount = allProducts.filter((p) => {
        if (!p.stock) return false; // מוצרים ללא מידות לא נחשבים Out of Stock
        const total = getCur(p, "l") + getCur(p, "xl") + getCur(p, "xxl");
        return total === 0;
    }).length;

    const totalSketches = Object.values(imagesByCategory).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div
            className="min-h-screen pt-20 font-serif text-[#3B3024] bg-[#FFFFFF]"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
            }}
        >
            <h1 className="mb-10 text-4xl font-bold text-center">Admin Dashboard</h1>

            {/* KPIs */}
            <div className="grid grid-cols-1 gap-6 mx-auto mb-10 sm:grid-cols-3 max-w-7xl">
                <div className="bg-[#CBB279] text-center rounded-xl p-6 shadow-lg">
                    <FaBoxOpen className="mx-auto mb-2 text-3xl" />
                    <p className="text-xl font-semibold">{allProducts.length}</p>
                    <p className="text-sm">Total Products</p>
                </div>
                <div className="bg-[#F1F3C2] text-center rounded-xl p-6 shadow-lg">
                    <FaExclamationTriangle className="mx-auto mb-2 text-3xl text-red-600" />
                    <p className="text-xl font-semibold">{outOfStockCount}</p>
                    <p className="text-sm">Out of Stock (size-based)</p>
                </div>
                <div className="bg-[#97BE5A] text-white text-center rounded-xl p-6 shadow-lg">
                    <FaPaintBrush className="mx-auto mb-2 text-3xl" />
                    <p className="text-xl font-semibold">{totalSketches}</p>
                    <p className="text-sm">Total Sketches</p>
                </div>
            </div>

            {/* Upload Product */}
            <section className="bg-[#CBB279] text-[#3B3024] p-6 rounded-xl mb-12 max-w-3xl mx-auto shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-center">Add New Product</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                        type="text"
                        value={productTitle}
                        onChange={(e) => setProductTitle(e.target.value)}
                        placeholder="Product Title"
                        className="p-3 border rounded"
                    />
                    <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="Price"
                        className="p-3 border rounded"
                        min={0}
                    />

                    {/* חדש — תיאור המוצר */}
                    <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Product Description (optional)"
                        className="p-3 border rounded md:col-span-2 min-h-24"
                    />

                    {/* מידות אופציונליות */}
                    <input
                        type="number"
                        placeholder="Stock L (optional)"
                        value={stockL}
                        onChange={(e) => setStockL(e.target.value)}
                        className="p-3 border rounded"
                        min={0}
                    />
                    <input
                        type="number"
                        placeholder="Stock XL (optional)"
                        value={stockXL}
                        onChange={(e) => setStockXL(e.target.value)}
                        className="p-3 border rounded"
                        min={0}
                    />
                    <input
                        type="number"
                        placeholder="Stock XXL (optional)"
                        value={stockXXL}
                        onChange={(e) => setStockXXL(e.target.value)}
                        className="p-3 border rounded"
                        min={0}
                    />

                    <input
                        type="file"
                        onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                        className="p-2 border rounded"
                    />
                </div>
                <button
                    onClick={handleProductUpload}
                    className="w-full mt-4 bg-[#97BE5A] text-white py-2 px-4 rounded hover:bg-[#7ea649] transition"
                >
                    Upload Product
                </button>
            </section>

            {/* Product List */}
            <section className="max-w-6xl mx-auto mb-20">
                <h2 className="mb-6 text-3xl font-bold text-center">Product List</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {allProducts.map((product) => {
                        const total = product.stock
                            ? getCur(product, "l") + getCur(product, "xl") + getCur(product, "xxl")
                            : -1;
                        const isOutOfStock = product.stock ? total === 0 : false;

                        return (
                            <div key={product._id} className="bg-white text-[#3B3024] p-4 rounded-lg shadow relative">
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className={`w-full h-48 object-cover rounded-md mb-4 ${isOutOfStock ? "opacity-40" : ""}`}
                                />
                                <h3 className="mb-1 text-xl font-semibold">{product.title}</h3>
                                <p className="text-lg">{Number(product.price).toFixed(2)} ₪</p>

                                {/* תיאור (אם קיים) */}
                                {product.description && (
                                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                )}

                                {/* מציגים מלאי רק אם יש stock */}
                                {product.stock ? (
                                    <p className="mt-1 text-sm">
                                        Stock:&nbsp;
                                        L({getCur(product, "l")}/{getInit(product, "l")}),{" "}
                                        XL({getCur(product, "xl")}/{getInit(product, "xl")}),{" "}
                                        XXL({getCur(product, "xxl")}/{getInit(product, "xxl")})
                                    </p>
                                ) : (
                                    <p className="mt-1 text-sm italic opacity-80">No size-based stock</p>
                                )}

                                {isOutOfStock && <p className="mt-2 font-bold text-red-600">Out of Stock</p>}

                                <div className="absolute flex gap-2 top-2 right-2">
                                    <button
                                        onClick={() => openStockEditor(product)}
                                        className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                                        title="Edit stock"
                                    >
                                        מלאי
                                    </button>
                                    <button
                                        onClick={() => handleProductDelete(product._id)}
                                        className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-800"
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Upload Sketches */}
            <section className="bg-[#CBB279] text-[#3B3024] p-6 rounded-xl mb-12 max-w-3xl mx-auto shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-center">Upload Sketch</h2>
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white text-[#3B3024] px-4 py-2 rounded border w-full md:w-auto"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.toUpperCase()}
                            </option>
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
                                <img
                                    src={`${VITE_API_URL}/${imgUrl}`}
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

            {/* Stock Editor Modal */}
            {selectedProduct && (
                <StockEditorModal
                    open={stockModalOpen}
                    onClose={() => setStockModalOpen(false)}
                    product={selectedProduct}
                    apiBase={VITE_API_URL}
                    onUpdated={handleProductPatched}
                />
            )}
        </div>
    );
};

export default AdminPage;
