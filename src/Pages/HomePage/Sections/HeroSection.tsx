import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

type Props = { logoSrc: string; phone: string };

const HEADER_H = 72;

// חשוב: לשים URL שמחזיר 200 (לא 301)
const VIDEO_SRC = "https://www.omeravivart.com/movieOmer.mp4";

const HeroSection = ({ logoSrc, phone }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [started, setStarted] = useState(false);

    const startVideo = useCallback(async () => {
        const v = videoRef.current;
        if (!v) return;

        try {
            // כדי שלא תקבל "פליי" תקוע: חייב להתחיל לנגן באמת
            v.muted = true; // מאפשר play יציב באייפון
            v.playsInline = true;

            await v.play();
            setStarted(true);
        } catch {
            // אם עדיין נחסם, הטאץ׳ הבא ינסה שוב
        }
    }, []);

    // נסה autoplay (מושתק). אם זה מצליח, לא תראה שום פליי בכלל.
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const tryAuto = async () => {
            try {
                v.muted = true;
                await v.play();
                setStarted(true);
            } catch {
                // לא נורא, טאץ׳ ראשון יפעיל
            }
        };

        tryAuto();
    }, []);

    return (
        <section
            id="logo"
            className="relative w-full h-[100svh] overflow-hidden bg-[#F6F1E8]"
            style={{ marginTop: -HEADER_H }}
            // טאץ׳/קליק בכל מקום בסקשן = מתחיל וידאו (בלי כפתור פליי)
            onTouchStartCapture={startVideo}
            onMouseDownCapture={startVideo}
            onClickCapture={startVideo}
        >
            {/* וידאו */}
            <video
                ref={videoRef}
                className="absolute inset-0 object-cover w-full h-full"
                src={VIDEO_SRC}
                playsInline
                muted
                loop
                autoPlay
                preload="auto"
                poster={logoSrc} // מבטל "שחור" לפני התחלה
                controls={false}
                disablePictureInPicture
            />

            {/* פייד חום החוצה (לא "נכנס" יותר מדי לתוך הסרטון) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* רדיאלי: מרכז כמעט שקוף, הקצוות חומים */}
                <div className="absolute inset-0 [background:radial-gradient(closest-side,rgba(59,48,36,0)_62%,rgba(59,48,36,0.35)_100%)]" />
                {/* תחתון: כדי לחבר יפה לרקע האתר */}
                <div className="absolute inset-x-0 bottom-0 h-[18svh] bg-gradient-to-b from-transparent to-[#F6F1E8]" />
            </div>

            {/* תוכן מעל */}
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

                {/* אם autoplay נכשל, אין כפתור פליי. פשוט רמז קטן (לא חובה). */}
                {!started && (
                    <div className="mt-3 text-xs text-[#3B3024]/70 select-none">
                        נגיעה במסך תתחיל את הוידאו
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroSection;
