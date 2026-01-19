import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";
import { InfoPill, SoftBtn } from "./ui";

const AdminHeader = ({ onRefresh }: { onRefresh: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center"
        >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-[#B9895B] drop-shadow-sm">
                Admin Studio
            </h1>
            <p className="mt-2 text-sm text-[#1E1E1E]/70">
                ניהול מוצרים, סקיצות וקאנבסים, בצורה נקייה ומהירה.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <InfoPill>רענון אחרי פעולות</InfoPill>
                <SoftBtn onClick={onRefresh} icon={<FaSyncAlt className="text-[#B9895B]" />}>
                    רענן
                </SoftBtn>
            </div>
        </motion.div>
    );
};

export default AdminHeader;
