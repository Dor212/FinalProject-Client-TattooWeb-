import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

type Props = { logoSrc: string; phone: string };

const HEADER_H = 72;
const VIDEO_SRC = "https://www.omeravivart.com/movieOmer.mp4";
const HERO_BG = "#F6F1E8";

const HeroSection = ({ logoSrc, phone }: Props) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [started, setStarted] = useState(false);
    const startedRef = useRef(false);

    const primeFirstFrame = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;

        try {
            v.muted = true;
            v.playsInline = true;
            v.preload = "auto";
        } catch { /* empty */ }

        const onLoaded = () => {
            try {
                v.currentTime = 0.01;
            } catch { /* empty */ }
        };

        v.addEventListener("loadeddata", onLoaded, { once: true });
        if (v.readyState >= 2) onLoaded();
    }, []);

    const tryPlay = useCallback(async () => {
        const v = videoRef.current;
        if (!v) return;
        try {
            v.muted = true;
            v.playsInline = true;
            await v.play();
        } catch { /* empty */ }
    }, []);

    const startVideo = useCallback(async () => {
        if (startedRef.current) return;
        await tryPlay();
        if (videoRef.current && !videoRef.current.paused) {
            startedRef.current = true;
            setStarted(true);
        }
    }, [tryPlay]);

    useEffect(() => {
        primeFirstFrame();
    }, [primeFirstFrame]);

    useEffect(() => {
        const el = sectionRef.current;
        const v = videoRef.current;
        if (!el || !v) return;

        const io = new IntersectionObserver(
            async ([entry]) => {
                if (!entry) return;

                if (entry.intersectionRatio < 0.55) {
                    try {
                        v.pause();
                    } catch { /* empty */ }
                    return;
                }

                if (startedRef.current) {
                    await tryPlay();
                }
            },
            { threshold: [0, 0.25, 0.55, 0.85, 1] }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [tryPlay]);

    useEffect(() => {
        const onVis = async () => {
            const v = videoRef.current;
            if (!v) return;
            if (!document.hidden && startedRef.current) {
                await tryPlay();
            }
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [tryPlay]);

    return (
        <section
            ref={sectionRef}
            id="logo"
            className="relative w-full h-[100svh] overflow-hidden"
            style={{ marginTop: -HEADER_H, backgroundColor: HERO_BG }}
            onPointerDownCapture={startVideo}
        >
            <div className="relative h-[100svh] overflow-hidden">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover transform-gpu scale-[1.035]"
                    src={VIDEO_SRC}
                    playsInline
                    muted
                    loop
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                />

                <div
                    className="relative z-10 flex h-[100svh] w-full flex-col items-center justify-center px-6 text-center"
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
                            loading="eager"
                            className="block h-full w-auto max-w-[92vw] object-contain select-none pointer-events-none"
                        />
                    </motion.div>

                    <motion.a
                        href={`https://wa.me/${phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-xl bg-white/55 text-[#1E1E1E] border border-white/35 shadow-sm backdrop-blur-md hover:bg-[#B9895B] hover:text-[#F6F1E8] hover:border-[#B9895B] transition-all duration-150 transform-gpu will-change-transform focus:outline-none focus:ring-2 focus:ring-[#B9895B]/45 focus:ring-offset-2 focus:ring-offset-transparent"
                        aria-label="שלחו הודעה בוואטסאפ"
                    >
                        <FaWhatsapp className="text-base" />
                        לקביעת תור
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
