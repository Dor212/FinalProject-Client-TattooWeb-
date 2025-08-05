import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import { Mail, RotateCcw, Download } from "lucide-react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

const ApplySketchPage = () => {
    const location = useLocation();
    const { selectedSketch, category = "small" } = location.state || {};
    const { VITE_API_URL } = import.meta.env;

    const [userImage, setUserImage] = useState<string | null>(null);
    const [availableSketches, setAvailableSketches] = useState<string[]>([]);
    const [currentSketch, setCurrentSketch] = useState<string | null>(selectedSketch || null);
    const [frame, setFrame] = useState({
        translate: [200, 200],
        rotate: 0,
        scale: [1, 1],
    });
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const workAreaRef = useRef<HTMLDivElement>(null);

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

    const [{ x, y, scale, rotateZ }, api] = useSpring(() => ({
        x: 200,
        y: 200,
        scale: 1,
        rotateZ: 0,
    }));

    const bind = useGesture(
        {
            onDrag: ({ offset: [dx, dy] }) => api.start({ x: dx, y: dy }),
            onPinch: ({ offset: [d, a] }) => api.start({ scale: d / 100, rotateZ: a }),
        },
        {
            drag: { from: () => [x.get(), y.get()] },
            pinch: { scaleBounds: { min: 0.5, max: 3 }, rubberband: true },
        }
    );

    useEffect(() => {
        const fetchSketches = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/gallery/${category}`);
                if (Array.isArray(response.data)) {
                    setAvailableSketches(response.data);
                }
            } catch (err) {
                console.error("שגיאה בטעינת סקיצות:", err);
            }
        };
        fetchSketches();
    }, [category]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setUserImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSend = async () => {
        if (!workAreaRef.current) return;
        await new Promise((r) => setTimeout(r, 300));
        const canvas = await html2canvas(workAreaRef.current, {
            useCORS: true,
            backgroundColor: null,
        });
        const image = canvas.toDataURL("image/png");
        try {
            await axios.post(`${VITE_API_URL}/users/send-image`, {
                image,
                name,
                phone,
            });
            alert("נשלח בהצלחה!");
        } catch (err) {
            console.error("שגיאת שליחה:", err);
            alert("שליחה נכשלה.");
        }
    };

    const handleDownload = async () => {
        if (!workAreaRef.current) return;
        const canvas = await html2canvas(workAreaRef.current, {
            useCORS: true,
            backgroundColor: null,
        });
        const link = document.createElement("a");
        link.download = "tattoo_preview.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const rotateSketch = () => {
        setFrame((prev) => ({
            ...prev,
            rotate: (prev.rotate + 90) % 360,
        }));
    };

    const handleReset = () => {
        setFrame({ translate: [200, 200], rotate: 0, scale: [1, 1] });
    };

    return (
        <div
            className="min-h-screen pt-20 px-4 bg-[#FFFFFF] text-[#3B3024] font-serif"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
            }}
        >
            <h1 className="mb-6 text-3xl sm:text-4xl font-bold text-center text-[#8C734A]">
                Tattoo Sketch Preview
            </h1>

            <div className="flex flex-col items-center gap-4 sm:gap-6">
                <label htmlFor="upload" className="px-6 py-2 text-sm font-medium bg-[#F1F3C2] text-gray-800 rounded cursor-pointer hover:brightness-110 transition">
                    Upload Your Image
                </label>
                <input id="upload" type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />

                <div className="flex flex-col w-full max-w-md gap-4 text-left">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#97BE5A]" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your Phone Number" className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#97BE5A]" />
                </div>

                <div className="flex flex-col-reverse w-full gap-6 lg:flex-row max-w-7xl">
                    <div className="w-full lg:w-[180px] p-4 flex flex-row lg:flex-col gap-4 bg-white shadow-lg rounded-xl">
                        {availableSketches.map((imgPath, idx) => {
                            const fullUrl = `${VITE_API_URL}${imgPath}`;
                            return (
                                <img
                                    key={idx}
                                    src={fullUrl}
                                    onClick={() => setCurrentSketch(fullUrl)}
                                    className={`w-16 h-16 object-contain border rounded cursor-pointer transition hover:scale-105 ${currentSketch === fullUrl ? "border-[#97BE5A] shadow-md" : "border-gray-300"
                                        }`}
                                />
                            );
                        })}
                    </div>

                    <div ref={workAreaRef} className="relative w-full h-[500px] sm:h-[650px] lg:h-[800px] bg-white border shadow-xl rounded-xl overflow-hidden">
                        {userImage && <img src={userImage} alt="Uploaded" className="absolute object-contain w-full h-full" />}

                        {currentSketch && isMobile ? (
                            <animated.div
                                {...bind()}
                                style={{
                                    x,
                                    y,
                                    scale,
                                    rotateZ,
                                    position: "absolute",
                                    width: 150,
                                    height: 150,
                                    backgroundImage: `url(${encodeURI(currentSketch)})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    mixBlendMode: "multiply",
                                    opacity: 0.6,
                                    touchAction: "none",
                                }}
                            />
                        ) : currentSketch && (
                            <div
                                style={{
                                    position: "absolute",
                                    transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg) scale(${frame.scale[0]}, ${frame.scale[1]})`,
                                    transformOrigin: "center center",
                                    width: "150px",
                                    height: "150px",
                                    backgroundImage: `url(${encodeURI(currentSketch)})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    mixBlendMode: "multiply",
                                    opacity: 0.6,
                                    cursor: "move",
                                }}
                            />
                        )}
                    </div>
                </div>

                {userImage && currentSketch && (
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <button onClick={handleSend} className="flex items-center gap-2 px-6 py-2 font-semibold text-white rounded-xl hover:bg-[#d3a85b] transition" style={{ backgroundColor: "#E8B86D" }}>
                            <Mail size={20} />
                            Send to Email
                        </button>

                        <button onClick={rotateSketch} className="flex items-center gap-2 px-5 py-2 text-gray-800 bg-white border rounded-xl hover:bg-gray-100">
                            <RotateCcw size={18} />
                            Rotate 90°
                        </button>

                        <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2 text-gray-800 bg-white border rounded-xl hover:bg-gray-100">
                            <Download size={18} />
                            Save Image
                        </button>

                        <button onClick={handleReset} className="px-6 py-2 font-semibold text-gray-800 transition bg-white border border-gray-500 rounded-xl hover:bg-gray-200">
                            Reset Sketch
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplySketchPage;