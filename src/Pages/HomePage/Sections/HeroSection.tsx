import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

type Props = { logoSrc: string; phone: string };

const HeroSection = ({ logoSrc, phone }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const HEADER_H = 72;

    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started) return;
        const v = videoRef.current;
        if (!v) return;

        const run = async () => {
            try {
                v.muted = true;           // תשאיר true אם אתה לא רוצה סאונד
                v.playsInline = true;
                await v.play();
            } catch { /* empty */ }
        };

        // נותן ל-DOM “להתיישב” ואז מנגן
        requestAnimationFrame(() => void run());
    }, [started]);

    const startVideo = () => {
        if (started) return;
        setStarted(true);
    };

    return (
        <section
            id="logo"
            className="relative w-full h-[100svh] overflow-hidden bg-black"
            style={{ marginTop: -HEADER_H }}
        >
            {/* עד הטאץ' הראשון אין VIDEO בכלל -> אין פליי של Safari */}
            {started && (
                <video
                    ref={videoRef}
                    className="absolute inset-0 object-cover w-full h-full"
                    src="https://www.omeravivart.com/movieOmer.mp4"
                    playsInline
                    muted
                    loop
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                />
            )}

            <div className="absolute inset-0 pointer-events-none bg-black/25" />
            <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_140px_rgba(0,0,0,0.55)]" />
            <div className="absolute inset-x-0 bottom-0 h-[22svh] pointer-events-none bg-gradient-to-b from-transparent to-[#F6F1E8]" />

            {/* שכבה שקולטת טאץ' ראשון (בלי להציג שום כפתור) */}
            {!started && (
                <button
                    type="button"
                    onClick={startVideo}
                    onTouchStart={startVideo}
                    className="absolute inset-0 z-20 bg-transparent"
                    aria-label="Start video"
                />
            )}

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
        </section>
    );
};

export default HeroSection;
