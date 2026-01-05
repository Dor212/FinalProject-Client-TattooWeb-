import { FaWhatsapp } from "react-icons/fa";

type Props = {
    phone: string;
};

const FloatingWhatsAppButton = ({ phone }: Props) => {
    return (
        <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed z-50 flex items-center justify-center text-white bg-[#9FC87E] rounded-full shadow-md w-14 h-14 top-20 right-10 hover:bg-green-600"
            aria-label="WhatsApp"
        >
            <FaWhatsapp className="text-3xl" />
        </a>
    );
};

export default FloatingWhatsAppButton;
