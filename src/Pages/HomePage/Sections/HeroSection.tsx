import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

type Props = { logoSrc: string; phone: string };

const HEADER_H = 72;

const HeroSection = ({ logoSrc, phone }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [started, setStarted] = useState(false);
    const [primed, setPrimed] = useState(false);

    const startVideo = async () => {
        if (started) return;
        setStarted(true);

        const v = videoRef.current;
        if (!v) return;

        try {
            v.muted = true;          // בלי סאונד
            v.playsInline = true;
            await v.play();          // טאצ’ אמיתי → אין Play overlay
        } catch { /* empty */ }
    };

    return (
        <section
            id="logo"
            className="relative w-full h-[100svh] overflow-hidden"
            style={{ marginTop: -HEADER_H }}
        >
            {/* VIDEO */}
            <video
                ref={videoRef}
                className="absolute inset-0 z-0 object-cover w-full h-full"
                src="https://www.omeravivart.com/movieOmer.mp4"
                playsInline
                muted
                loop
                preload="auto"
                controls={false}
                onLoadedData={() => {
                    const v = videoRef.current;
                    if (!v || primed) return;

                    // “Prime” כדי שיצויר פריים ראשון גם בלי לנגן
                    try {
                        v.pause();
                        v.currentTime = 0.01;
                    } catch { /* empty */ }
                    setPrimed(true);
                }}
            />


            {/* FADE חום – יוצא מהווידאו החוצה (לא נכנס אליו) */}
            <div className="absolute inset-x-0 bottom-0 z-10 h-[18svh] pointer-events-none
                bg-gradient-to-b from-transparent to-[#F6F1E8]" />

            {/* OVERLAY כהה עדין (לא חובה אבל היה לך) */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-black/20" />

            {/* שכבת טאצ’ ראשונה – בלי כפתור */}
            {!started && (
                <div
                    onTouchStart={startVideo}
                    onClick={startVideo}
                    className="absolute inset-0 z-20"
                />
            )}

            {/* CONTENT */}
            <div
                className="relative z-30 flex h-[100svh] w-full flex-col items-center justify-center px-6 text-center"
                style={{ paddingTop: HEADER_H }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9 }}
                    className="flex items-center justify-center w-full"
                    style={{ height: "clamp(210px, 44vh, 520px)" }}
                >
                    <img
                        src={logoSrc}
                        alt="Omer Tattoo Studio Logo"
                        draggable={false}
                        className="block h-full w-auto max-w-[92vw] object-contain select-none"
                    />
                </motion.div>

                <motion.a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 inline-flex items-center gap-2 px-8 py-3
                        rounded-xl bg-white/55 text-[#1E1E1E]
                        border border-white/35 backdrop-blur-md"
                >
                    <FaWhatsapp />
                    לקביעת תור
                </motion.a>
            </div>
        </section>
    );
};

export default HeroSection;
