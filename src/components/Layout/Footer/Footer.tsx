import { Footer as FbFooter } from "flowbite-react"
const Footer = () => {
    return (
        <FbFooter container className=" bg-[#F1F3C2]">
            <div className="flex justify-center w-full">
                <FbFooter.Copyright href="#" by="Dor Refael Ohana" year={2024} className="text-slate-200" />
            </div>
        </FbFooter>
    );
};
export default Footer;