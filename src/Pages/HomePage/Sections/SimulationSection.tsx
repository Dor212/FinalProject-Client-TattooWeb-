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
            <div className="flex flex-col-reverse items-center gap-10 mx-auto max-w-7xl md:flex-row-reverse">
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

                <div className="w-full md:w-3/5 text-[#1E1E1E]">
                    <motion.div
                        initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ amount: 0.35, once: false }}
                        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden rounded-3xl border border-[#1E1E1E]/15 bg-[#F6F1E8]/70 backdrop-blur-md shadow-[0_18px_60px_rgba(30,30,30,0.08)]"
                    >
                        <div className="pointer-events-none absolute -top-20 -right-16 w-[340px] h-[340px] rounded-full bg-[#B9895B]/18 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-20 w-[380px] h-[380px] rounded-full bg-[#E8D9C2]/55 blur-3xl" />
                        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#1E1E1E 0.7px, transparent 0.7px)", backgroundSize: "18px 18px" }} />

                        <div className="relative p-7 sm:p-8">
                            <div className="flex items-center justify-center gap-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1 text-[12px] tracking-[0.28em] rounded-full border border-[#1E1E1E]/15 bg-[#E8D9C2]/60 text-[#1E1E1E]/70">
                                    SIMULATION
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B9895B]/70" />
                                </span>
                            </div>

                            <h3 className="mt-4 text-4xl font-semibold text-center text-[#1E1E1E]">
                                לראות לפני שמרגישים
                            </h3>

                            <div className="mx-auto mt-6 max-w-[62ch] text-[15px] md:text-[17px] leading-relaxed text-[#1E1E1E]/80">
                                <p className="text-center">
                                    כדי לעזור לכם לדמיין איך הקעקוע ייראה בדיוק עליכם, יצרנו מערכת נוחה להדמיה.
                                </p>

                                <div className="mt-6 space-y-3">
                                    <div className="flex gap-3">
                                        <div className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1E1E1E]/15 bg-[#F6F1E8]/80 text-sm font-semibold text-[#B9895B]">
                                            1
                                        </div>
                                        <p>
                                            בחרו את העיצוב שמדבר אליכם.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1E1E1E]/15 bg-[#F6F1E8]/80 text-sm font-semibold text-[#B9895B]">
                                            2
                                        </div>
                                        <p>
                                            העלו תמונה איכותית של האזור שבו תרצו למקם את הקעקוע.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1E1E1E]/15 bg-[#F6F1E8]/80 text-sm font-semibold text-[#B9895B]">
                                            3
                                        </div>
                                        <p>
                                            צילום חד, בגובה העיניים, כשהגוף רפוי, ללא מתיחה או תנוחות לא טבעיות.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1E1E1E]/15 bg-[#F6F1E8]/80 text-sm font-semibold text-[#B9895B]">
                                            4
                                        </div>
                                        <p>
                                            מקמו את הקעקוע על התמונה, שחקו עם הגודל והתאימו אותו בדיוק כמו שתרצו.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl border border-[#1E1E1E]/10 bg-[#E8D9C2]/55 p-4">
                                    <p className="text-center text-[#1E1E1E]/75">
                                        בסיום, ההדמיה תישלח אליי ישירות למייל, ומשם נמשיך לתיאום תור ולתכנון סופי.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default SimulationSection;
