type FormData = {
    name: string;
    email: string;
    message: string;
};

type Props = {
    formData: FormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: { preventDefault: () => void }) => void;
};

const ContactSection = ({ formData, onChange, onSubmit }: Props) => {
    return (
        <motion.section
            id="contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="container flex justify-center px-6 py-20 mx-auto"
            dir="rtl"
        >
            <div className="w-full max-w-xl px-10 py-16 bg-[#F1F3C2] rounded-[80px] shadow-md flex flex-col items-center">
                <h2 className="mb-4 text-2xl font-semibold text-center text-[#3B3024]">צרו קשר</h2>
                <p className="mb-6 text-center text-[#5A4B36] text-sm">
                    יש לכם שאלות? מלאו את הטופס ונחזור אליכם בהקדם.
                </p>

                <form onSubmit={onSubmit} className="flex flex-col items-center w-full gap-4">
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm text-[#3B3024]">שם מלא</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={onChange}
                            placeholder="השם שלך"
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#97BE5A]"
                        />
                    </div>

                    <div className="w-1/2">
                        <label className="block mb-1 text-sm text-[#3B3024]">כתובת אימייל</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="האימייל שלך"
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#97BE5A]"
                        />
                    </div>

                    <div className="w-1/2">
                        <label className="block mb-1 text-sm text-[#3B3024]">הודעה</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={onChange}
                            placeholder="ההודעה שלך"
                            rows={3}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#97BE5A]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-1/2 px-4 py-2 mt-2 text-sm text-[#97BE5A] bg-[#FAF4E7] rounded-md shadow-md hover:bg-[#97BE5A] hover:text-[#FAF4E7]"
                    >
                        שלח הודעה
                    </button>
                </form>
            </div>
        </motion.section>
    );
};

import { motion } from "framer-motion";
export default ContactSection;
