import { FaShoppingCart } from "react-icons/fa";

type Props = {
    onClick: () => void;
};

const FloatingCartButton = ({ onClick }: Props) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-2xl border border-[#B9895B]/18 bg-[#B9895B] text-white shadow-[0_14px_40px_rgba(30,30,30,0.18)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
            aria-label="פתח עגלה"
            title="Open Cart"
        >
            <FaShoppingCart className="text-[22px]" />
        </button>
    );
};

export default FloatingCartButton;
