import { Footer as FbFooter } from "flowbite-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <FbFooter container dir="rtl" className="bg-[#F1F3C2]">
            <div className="w-full px-4 py-4 mx-auto max-w-7xl sm:py-3">
                <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:justify-between sm:text-start">
                    <FbFooter.Copyright
                        href="/"
                        by="Omer Aviv Tattoo Studio"
                        year={year}
                        className="text-[#3B3024] opacity-90 text-sm"
                    />

                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
                        <Link
                            to="/legal"
                            className="text-sm text-[#3B3024] opacity-80 hover:opacity-100 hover:underline underline-offset-4 transition"
                        >
                            הצהרת פרטיות · מדיניות נגישות · תנאי שימוש
                        </Link>

                        <span className="text-xs text-[#3B3024] opacity-60 leading-none">
                            Built by Y.M.A
                        </span>
                    </div>
                </div>
            </div>
        </FbFooter>
    );
};

export default Footer;
