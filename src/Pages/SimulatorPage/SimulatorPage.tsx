import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import Moveable from "react-moveable";
import html2canvas from "html2canvas";
import axios from "axios";
import { Mail } from "lucide-react";

const ApplySketchPage = () => {
    
    const location = useLocation();
    const { selectedSketch } = location.state || {};
    const [userImage, setUserImage] = useState<string | null>(null);
    const [frame, setFrame] = useState({ translate: [200, 200], rotate: 0, scale: [1, 1] });
    const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const workAreaRef = useRef<HTMLDivElement>(null);

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
            allowTaint: true,
            backgroundColor: null,
        });
        const image = canvas.toDataURL("image/png");
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/users/send-image`, { image, name, phone });
            alert("Sent to tattoo artist via email!");
        } catch (err) {
            console.error("Error sending:", err);
            alert("Failed to send. Try again later.");
        }
    };

    const handleReset = () => {
        setFrame({ translate: [200, 200], rotate: 0, scale: [1, 1] });
    };

    return (
        <div
            className="min-h-screen pt-20 px-6 bg-[#FFFFFF] text-[#3B3024] font-serif"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
            }}
        >
            <h1 className="mb-10 text-4xl text-[#8C734A] font-bold text-center">Tattoo Sketch Preview</h1>

            <div className="flex flex-col items-center gap-6">
                <label
                    htmlFor="upload"
                    className="px-6 py-2 text-sm font-medium bg-[#F1F3C2] text-gray-800 rounded cursor-pointer hover:brightness-110 transition"
                >
                    Upload Your Image
                </label>
                <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />

                <div className="flex flex-col w-full max-w-md gap-4 text-left">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#97BE5A]"
                    />
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your Phone Number"
                        className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#97BE5A]"
                    />
                </div>

                <div className="flex flex-col w-full gap-6 lg:flex-row max-w-7xl">
                    <div className="flex flex-col w-full gap-4 p-4 bg-white shadow-xl lg:max-w-xs rounded-xl">
                        <h2 className="text-xl font-semibold text-center text-gray-700">Selected Sketch</h2>
                        {selectedSketch && (
                            <img src={selectedSketch} alt="Selected Sketch" className="w-full h-auto rounded" />
                        )}
                    </div>

                    <div
                        ref={workAreaRef}
                        className="relative w-full h-[500px] sm:h-[700px] lg:w-[950px] lg:h-[800px] bg-white border shadow-xl rounded-xl overflow-hidden"
                    >
                        {userImage && (
                            <img
                                src={userImage}
                                alt="Uploaded"
                                className="absolute object-contain w-full h-full"
                            />
                        )}

                        {selectedSketch && (
                            <>
                                <div
                                    ref={setTargetRef}
                                    style={{
                                        position: "absolute",
                                        transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg) scale(${frame.scale[0]}, ${frame.scale[1]})`,
                                        transformOrigin: "center center",
                                        width: "150px",
                                        height: "150px",
                                        backgroundImage: `url(${encodeURI(selectedSketch)})`,
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        mixBlendMode: "multiply",
                                        opacity: 0.6,
                                        cursor: "move",
                                    }}
                                />

                                {targetRef && (
                                    <Moveable
                                        target={targetRef}
                                        draggable
                                        resizable
                                        rotatable
                                        onDrag={({ beforeTranslate }) => {
                                            setFrame({ ...frame, translate: beforeTranslate });
                                        }}
                                        onResize={({ width, height, drag }) => {
                                            if (targetRef) {
                                                targetRef.style.width = `${width}px`;
                                                targetRef.style.height = `${height}px`;
                                                setFrame({
                                                    ...frame,
                                                    translate: drag.beforeTranslate,
                                                    scale: [width / 150, height / 150],
                                                });
                                            }
                                        }}
                                        onRotate={({ beforeRotate }) => {
                                            setFrame({ ...frame, rotate: beforeRotate });
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                {userImage && selectedSketch && (
                    <div className="flex flex-col gap-4 mt-6 sm:flex-row">
                        <button
                            onClick={handleSend}
                            className="flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white rounded-xl hover:bg-[#d3a85b] transition"
                            style={{ backgroundColor: "#E8B86D" }}
                        >
                            <Mail size={20} />
                            Send to Email
                        </button>

                        <button
                            onClick={handleReset}
                            className="px-6 py-2 font-semibold text-gray-800 transition bg-white border border-gray-500 rounded-xl hover:bg-gray-200"
                        >
                            Reset Sketch
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplySketchPage;
