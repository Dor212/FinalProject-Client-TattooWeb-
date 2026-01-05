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
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-[100vh] flex flex-col items-center justify-center text-center"
        >
            <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                src={logoSrc}
                alt="Omer Tattoo Studio Logo"
                className="block max-w-[120%] max-h-[120%]"
            />

            <motion.a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-2 mt-4 text-sm font-semibold rounded-md from-[#c1aa5f] to-[#97BE5A] text-[#3B3024] border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F0EDE5] transition-transform duration-150 transform-gpu will-change-transform"
                aria-label="שלחו הודעה בוואטסאפ"
            >
                <FaWhatsapp className="text-base" />
                לקביעת תור
            </motion.a>
        </motion.section>
    );
};

export default HeroSection;
