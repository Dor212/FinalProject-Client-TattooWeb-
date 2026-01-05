import { FaShoppingCart } from "react-icons/fa";

type Props = {
    onClick: () => void;
};

const FloatingCartButton = ({ onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 bg-[#9FC87E] hover:bg-[#7ea649] text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
            title="Open Cart"
        >
            <FaShoppingCart className="text-xl" />
        </button>
    );
};

export default FloatingCartButton;
