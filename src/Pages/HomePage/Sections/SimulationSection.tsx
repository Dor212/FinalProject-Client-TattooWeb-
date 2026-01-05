import { motion } from "framer-motion";

type Img = {
    src: string;
    title: string;
};

type Props = {
    images: Img[];
    onSelectCategory: (category: string) => void;
};

const SimulationSection = ({ images, onSelectCategory }: Props) => {
    return (
        <motion.section
            id="simulation"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="container px-5 py-20 mx-auto"
        >
            <div className="flex flex-col-reverse items-center gap-6 mx-auto max-w-7xl md:flex-row-reverse">
                <div className="grid grid-cols-2 gap-2 md:w-2/5 place-items-center">
                    {images.map((img, index) => (
                        <div key={index} className={`flex flex-col items-center ${index === 2 ? "col-span-2" : ""}`}>
                            <motion.img
                                src={img.src}
                                alt={img.title}
                                className="object-cover w-48 h-48 rounded-full shadow-md cursor-pointer"
                                whileHover={{ scale: 1.15, rotate: 2 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => onSelectCategory(img.title.toLowerCase())}
                            />
                            <h2 className="mt-3 text-lg font-semibold text-[#3B3024]">{img.title}</h2>
                        </div>
                    ))}
                </div>

                <div className="w-full p-8 text-center md:w-3/5 text-[#8C734A]">
                    <h3 className="mb-5 text-4xl font-semibold">הדמיית קעקוע – לראות לפני שמרגישים</h3>
                    <p className="text-lg leading-relaxed">
                        כדי לעזור לכם לדמיין איך הקעקוע ייראה בדיוק עליכם, יצרנו מערכת נוחה להדמיה. כל מה שצריך לעשות:
                        לבחור את העיצוב שמדבר אליכם, להעלות תמונה איכותית של האזור שבו תרצו למקם את הקעקוע – צילום חד,
                        בגובה העיניים, כשהגוף רפוי (ללא מתיחה או תנוחות לא טבעיות). דרך ההדמיה תוכלו למקם את הקעקוע על
                        התמונה, לשחק עם הגודל ולהתאים אותו בדיוק כמו שתרצו. בסיום, ההדמיה תישלח אליי ישירות למייל – ומשם
                        נמשיך לתיאום תור ולתכנון סופי
                    </p>
                </div>
            </div>
        </motion.section>
    );
};

export default SimulationSection;
