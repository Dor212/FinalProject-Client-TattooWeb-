import { Footer as FbFooter } from "flowbite-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <FbFooter
            container
            dir="rtl"
            className="bg-[#F6F1E8] border-t border-[#B9895B]/30"
        >
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-2">
                <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between sm:gap-3">
                    <FbFooter.Copyright
                        href="/"
                        by="Omer Aviv Tattoo Studio"
                        year={year}
                        className="text-[#1E1E1E] opacity-75 text-[11px] sm:text-xs leading-none"
                    />

                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
                        <Link
                            to="/legal"
                            className="text-[11px] sm:text-xs text-[#1E1E1E] opacity-70 hover:opacity-100 hover:text-[#B9895B] transition leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/35 rounded"
                        >
                            הצהרת פרטיות · נגישות · תנאי שימוש
                        </Link>

                        <span className="hidden sm:inline-block h-3 w-px bg-[#B9895B]/30" />

                        <span className="text-[11px] text-[#1E1E1E] opacity-55 leading-none pb-0.5 sm:pb-0 sm:mt-0">
                            Built by{" "}
                            <span className="text-[#B9895B] opacity-90 font-medium">Y.M.A</span>
                        </span>
                    </div>
                </div>
            </div>
        </FbFooter>
    );
};

export default Footer;
