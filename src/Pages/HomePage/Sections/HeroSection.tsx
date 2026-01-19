import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

type Props = {
    logoSrc: string;
    phone: string;
};

const HeroSection = ({ logoSrc, phone }: Props) => {
    return (
        <motion.section
            id="logo"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="relative px-6 pt-16 pb-10  sm:pt-20 sm:pb-14"
        >
            <div
                className="flex flex-col items-center max-w-6xl gap-6 mx-auto text-center  sm:gap-8"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center w-full "
                    style={{
                        height: "clamp(220px, 46vh, 520px)",
                    }}
                >
                    <img
                        src={logoSrc}
                        alt="Omer Tattoo Studio Logo"
                        draggable={false}
                        loading="eager"
                        className="
              block
              h-full
              w-auto
              max-w-[92vw]
              object-contain
              select-none
              pointer-events-none
            "
                    />
                </motion.div>

                <motion.a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="
            inline-flex items-center justify-center gap-2
            px-8 py-3
            text-sm font-semibold
            rounded-xl
            bg-[#E8D9C2]/80 text-[#1E1E1E]
            border border-[#B9895B]/45
            shadow-sm
            hover:bg-[#B9895B] hover:text-[#F6F1E8] hover:border-[#B9895B]
            transition-all duration-150
            transform-gpu will-change-transform
            focus:outline-none focus:ring-2 focus:ring-[#B9895B]/45
            focus:ring-offset-2 focus:ring-offset-transparent
          "
                    aria-label="שלחו הודעה בוואטסאפ"
                >
                    <FaWhatsapp className="text-base" />
                    לקביעת תור
                </motion.a>
            </div>
        </motion.section>
    );
};

export default HeroSection;
