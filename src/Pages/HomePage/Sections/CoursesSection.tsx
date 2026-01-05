import { motion } from "framer-motion";

type Props = {
    imageSrc: string;
    phone: string;
    dates: string[];
};

const CoursesSection = ({ imageSrc, phone, dates }: Props) => {
    return (
        <motion.section
            id="courses"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="container flex flex-col items-center justify-center gap-10 px-5 py-20 mx-auto md:flex-row"
        >
            <div className="w-full md:w-1/2">
                <img src={imageSrc} alt="main" className="w-[500px] h-[600px] rounded-lg shadow-lg mx-auto" />
            </div>

            <div className="w-full text-center text-[#8C734A] md:w-1/2">
                <h2 className="mb-4 text-3ל font-semibold">קורס קעקועים אינטימי ומעמיק</h2>
                <p className="max-w-lg mx-auto mb-8 text-lg leading-relaxed">
                    אם תמיד חלמתם להיכנס לעולם הקעקועים – זה המקום להתחיל בו. בקורס קטן ואינטימי (עד 3 משתתפים בלבד)
                    נצלול לעומק האמנות, באווירה קלילה, אישית ומקצועית. חוויה כיפית ופרקטית, שתיתן לכם את כל הכלים
                    להתחיל לקעקע מהלב, בביטחון ובסטייל
                </p>

                <div className="flex justify-center gap-2">
                    {dates.map((date, index) => {
                        const message = `היי, אני מעוניין בפרטים על קורס שמתחיל ב- ${date}`;
                        const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

                        return (
                            <motion.a
                                key={index}
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-sm bg-white border border-gray-400 rounded-md cursor-pointer"
                                whileHover={{ scale: 1.1, backgroundColor: "#97BE5A", color: "#fff" }}
                                transition={{ duration: 0.2 }}
                            >
                                {date}
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
};

export default CoursesSection;
