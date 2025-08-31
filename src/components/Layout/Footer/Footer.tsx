import { Footer as FbFooter } from "flowbite-react";

const Footer = () => {
    return (
        <FbFooter container className="bg-[#F1F3C2]">
            <div className="flex flex-col items-center w-full gap-3">
                <FbFooter.Copyright
                    href="#"
                    by="Y.M.A"
                    year={2025}
                    className="text-[#3B3024]"
                />
                <FbFooter.LinkGroup className="justify-center">
                    <FbFooter.Link
                        href="/legal"
                        className="text-[#3B3024] hover:underline"
                    >
                        הצהרת פרטיות · מדיניות נגישות · תנאי שימוש
                    </FbFooter.Link>
                </FbFooter.LinkGroup>
            </div>
        </FbFooter>
    );
};

export default Footer;
