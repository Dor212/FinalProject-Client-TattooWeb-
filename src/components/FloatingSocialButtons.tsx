import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";

type Props = {
    phone: string;
    instagramUrl: string;
    tiktokUrl: string;
};

const FloatingSocialButtons = ({ phone, instagramUrl, tiktokUrl }: Props) => {
    const waLink = `https://wa.me/${encodeURIComponent(phone)}`;

    return (
        <div
            className="fixed z-50 flex flex-col gap-3 top-24 left-6"
            aria-label="Social buttons"
        >
            <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid h-14 w-14 place-items-center rounded-2xl border border-[#B9895B]/18 bg-[#B9895B] text-white shadow-[0_14px_40px_rgba(30,30,30,0.18)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                aria-label="WhatsApp"
                title="WhatsApp"
            >
                <FaWhatsapp className="text-[30px]" />
            </a>

            <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid h-14 w-14 place-items-center rounded-2xl border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl text-[#1E1E1E] shadow-[0_14px_40px_rgba(30,30,30,0.14)] transition hover:bg-white/45 active:bg-white/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                aria-label="Instagram"
                title="Instagram"
            >
                <FaInstagram className="text-[28px] text-[#B9895B]" />
            </a>

            <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid h-14 w-14 place-items-center rounded-2xl border border-[#B9895B]/18 bg-white/30 backdrop-blur-xl text-[#1E1E1E] shadow-[0_14px_40px_rgba(30,30,30,0.14)] transition hover:bg-white/45 active:bg-white/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                aria-label="TikTok"
                title="TikTok"
            >
                <FaTiktok className="text-[26px] text-[#1E1E1E]" />
            </a>
        </div>
    );
};

export default FloatingSocialButtons;
