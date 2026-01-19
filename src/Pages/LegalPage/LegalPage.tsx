import React, { useMemo } from "react";

const BUSINESS = {
    name: import.meta.env.VITE_BUSINESS_NAME || "Y.M.A – אתרים מותאמים אישית",
    website: import.meta.env.VITE_SITE_URL || "https://example.com",
    email: import.meta.env.VITE_CONTACT_EMAIL || "contact@example.com",
    phone: import.meta.env.VITE_CONTACT_PHONE || "+972-50-0000000",
    address: import.meta.env.VITE_CONTACT_ADDRESS || "ישראל",
};

type Tone = "warm" | "light";

type SectionCardProps = React.PropsWithChildren<{
    title: string;
    id: string;
    tone?: Tone;
    subtitle?: string;
}>;

const SectionCard: React.FC<SectionCardProps> = ({ title, id, tone = "light", subtitle, children }) => {
    const base =
        "relative overflow-hidden rounded-[22px] border shadow-[0_16px_60px_rgba(30,30,30,0.10)] backdrop-blur-xl";
    const warm = "border-[#B9895B]/22 bg-white/40 text-[#1E1E1E]";
    const light = "border-[#B9895B]/16 bg-white/30 text-[#1E1E1E]";

    return (
        <section id={id} aria-labelledby={`${id}-title`} className={`${base} ${tone === "warm" ? warm : light}`}>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_10%,rgba(185,137,91,0.12),transparent_55%),radial-gradient(circle_at_90%_90%,rgba(232,217,194,0.26),transparent_55%)]" />
            <div className="relative p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id={`${id}-title`} className="text-2xl md:text-3xl font-extrabold tracking-wide text-[#B9895B]">
                            {title}
                        </h2>
                        {subtitle && <p className="mt-2 text-sm md:text-base text-[#1E1E1E]/70">{subtitle}</p>}
                    </div>
                    <div className="hidden md:block h-10 w-10 rounded-full border border-[#B9895B]/20 bg-white/30" />
                </div>

                <div className="mt-5 space-y-4 leading-relaxed text-[#1E1E1E]/85">{children}</div>
            </div>
        </section>
    );
};

type AnchorProps = {
    href: string;
    children: React.ReactNode;
};

const Anchor: React.FC<AnchorProps> = ({ href, children }) => (
    <a
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 hover:bg-white/55 transition shadow-sm border border-[#B9895B]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
    >
        <span className="text-sm font-semibold text-[#1E1E1E]/80">{children}</span>
    </a>
);

const H3: React.FC<React.PropsWithChildren> = ({ children }) => (
    <h3 className="mt-6 text-lg md:text-xl font-bold text-[#1E1E1E]">{children}</h3>
);

const List: React.FC<React.PropsWithChildren> = ({ children }) => (
    <ul className="pr-6 space-y-2 list-disc marker:text-[#B9895B]">{children}</ul>
);

const LegalPage: React.FC = () => {
    const today = useMemo(
        () => new Date().toLocaleDateString("he-IL", { year: "numeric", month: "2-digit", day: "2-digit" }),
        []
    );

    return (
        <main
            id="top"
            role="main"
            aria-label="מסמכי מדיניות האתר"
            dir="rtl"
            className="hebrew-content min-h-[100svh] pt-24 pb-20 px-4 sm:px-6 md:px-8 text-[#1E1E1E]"
        >
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 text-center">
                    <div className="mx-auto inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#B9895B]/20 bg-white/30 backdrop-blur">
                        <span className="text-xs md:text-sm text-[#1E1E1E]/70">עודכן לאחרונה: {today}</span>
                    </div>

                    <h1 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-wide text-[#B9895B]">
                        מסמכי מדיניות האתר
                    </h1>

                    <p className="mt-3 text-sm md:text-base text-[#1E1E1E]/75">
                        כאן תמצא את כל המסמכים החשובים במקום אחד, בצורה ברורה וקריאה.
                    </p>
                </header>

                <nav className="sticky z-10 mb-10 top-20" aria-label="ניווט פנימי">
                    <div className="max-w-5xl mx-auto">
                        <div className="rounded-[18px] border border-[#B9895B]/18 bg-white/25 backdrop-blur-xl shadow-sm px-3 py-3">
                            <div className="flex flex-wrap justify-center gap-3">
                                <Anchor href="#privacy">הצהרת פרטיות</Anchor>
                                <Anchor href="#terms">תנאי שימוש</Anchor>
                                <Anchor href="#accessibility">הצהרת נגישות</Anchor>
                                <Anchor href="#cookies">מדיניות קוקיז</Anchor>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="grid gap-8">
                    <SectionCard
                        id="privacy"
                        title="הצהרת פרטיות"
                        tone="warm"
                        subtitle="איך אנחנו אוספים מידע, למה אנחנו משתמשים בו, ואיך אפשר לממש זכויות."
                    >
                        <p>
                            פרטיות המשתמשים חשובה לנו. מסמך זה מסביר אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם, עם מי אנו משתפים אותם
                            וכיצד ניתן לממש זכויות על פי הדין החל.
                        </p>

                        <H3>איזה מידע נאסף?</H3>
                        <List>
                            <li>
                                <strong className="text-[#1E1E1E]">מידע שנמסר מרצון:</strong> שם, כתובת דוא"ל, טלפון, תוכן פניות, קבצים
                                שצורפו, פרטי הזמנה/רכישה (ככל שיש חנות באתר).
                            </li>
                            <li>
                                <strong className="text-[#1E1E1E]">מידע טכני ושימושי:</strong> כתובת IP, סוג דפדפן ומכשיר, עמודים שנצפו,
                                זמנים, הפניות, מזהי קוקיז/פיקסלים ונתוני ביצועים לצורכי אבטחה, אנליטיקה ושיפור חוויית המשתמש.
                            </li>
                        </List>

                        <H3>למה אנו משתמשים במידע?</H3>
                        <List>
                            <li>לתפעול האתר והענקת השירותים (מענה לפניות, ניהול חשבונות משתמש, הזמנות ותשלומים אם קיימים).</li>
                            <li>לשיפור חוויית השימוש, מדידות סטטיסטיות וניתוחי ביצועים.</li>
                            <li>לשמירת אבטחת מידע, מניעת הונאה ועמידה בדרישות הדין.</li>
                            <li>שיווק והתאמה אישית, בכפוף להסכמה היכן שנדרש וכיבוד זכות להתנגד/להסיר.</li>
                        </List>

                        <H3>שיתוף מידע</H3>
                        <p>
                            אנו עשויים לשתף מידע עם ספקים חיצוניים המסייעים לנו בתפעול (אחסון, דוא"ל, אנליטיקה, סליקה, משלוחים), בכפוף
                            להתחייבויות סודיות ואבטחת מידע. מידע יימסר לרשויות כאשר הדבר נדרש על פי דין.
                        </p>

                        <H3>אבטחת מידע ושמירתו</H3>
                        <p>אנו מיישמים אמצעי אבטחה סבירים להגנה על המידע. משך השמירה ייקבע בהתאם למטרות העיבוד ולחובות החוקיות.</p>

                        <H3>זכויות משתמשים</H3>
                        <List>
                            <li>זכות עיון, תיקון ומחיקה של מידע אישי, בכפוף לדין.</li>
                            <li>זכות להתנגד לעיבוד מסוים ו/או לבטל הסכמה שניתנה.</li>
                            <li>זכות לניידות מידע במקרים מסוימים.</li>
                        </List>

                        <H3>יצירת קשר בנושא פרטיות</H3>
                        <p>
                            לשאלות/בקשות בנושא פרטיות ניתן לפנות ל-{BUSINESS.name} בכתובת:{" "}
                            <span className="font-semibold text-[#1E1E1E]">{BUSINESS.email}</span> |{" "}
                            <span className="font-semibold text-[#1E1E1E]">{BUSINESS.phone}</span> |{" "}
                            <span className="font-semibold text-[#1E1E1E]">{BUSINESS.address}</span>
                        </p>
                    </SectionCard>

                    <SectionCard
                        id="terms"
                        title="תנאי שימוש"
                        tone="light"
                        subtitle="המסגרת המשפטית לשימוש באתר והשירותים, כולל אחריות, זכויות ותשלומים (אם קיימים)."
                    >
                        <p>
                            השימוש באתר {BUSINESS.website} ובשירותי {BUSINESS.name} כפוף לתנאים שלהלן. גלישה באתר מהווה הסכמה לתנאים.
                        </p>

                        <H3>שימוש מותר והגבלות</H3>
                        <List>
                            <li>האתר מסופק לשימוש אישי וחוקי בלבד. אין להעתיק, להפיץ, לשנות או לבצע הנדסה לאחור ללא רשות.</li>
                            <li>אין להעלות תכנים בלתי חוקיים, פוגעניים, מפרי זכויות יוצרים או פרטיות.</li>
                            <li>אנו רשאים לחסום גישה/להסיר תכנים לפי שיקול דעתנו כדי לשמור על תקינות האתר והדין.</li>
                        </List>

                        <H3>קניין רוחני</H3>
                        <p>
                            אלא אם צוין אחרת, כל זכויות הקניין הרוחני באתר ובתכניו שייכות ל-{BUSINESS.name} ו/או לבעלי הזכויות
                            הרלוונטיים. סימני מסחר, לוגואים ותמונות מוגנים בדין.
                        </p>

                        <H3>רכישות ותשלומים (אם קיימים)</H3>
                        <List>
                            <li>מחירים כוללים/אינם כוללים מע"מ, בהתאם למופיע בתהליך הרכישה.</li>
                            <li>החזרות/ביטולים כפופים למדיניות החזרות המתפרסמת באתר ולדין החל.</li>
                            <li>התממשקות לספקי סליקה/משלוחים תעשה בכפוף לתנאיהם.</li>
                        </List>

                        <H3>הגבלת אחריות</H3>
                        <p>
                            האתר והשירותים מוצעים "כפי שהם" (AS-IS). אנו שואפים לדיוק וזמינות אך איננו מתחייבים להיעדר תקלות/שגיאות. לא
                            נהיה אחראים לכל נזק עקיף/תוצאתי הנובע מהשימוש באתר, ככל שהדין מאפשר.
                        </p>

                        <H3>שינויים</H3>
                        <p>אנו רשאים לעדכן את התנאים/המדיניות מעת לעת. המשך שימוש לאחר שינוי מהווה הסכמה לנוסח המעודכן.</p>

                        <H3>שיפוט ודין</H3>
                        <p>יחולו דיני מדינת ישראל וסמכות השיפוט הבלעדית תהיה בבתי המשפט המוסמכים בישראל.</p>
                    </SectionCard>

                    <SectionCard
                        id="accessibility"
                        title="הצהרת נגישות"
                        tone="warm"
                        subtitle="המחויבות שלנו לנגישות, מה יושם באתר, ואיך ליצור קשר במידת הצורך."
                    >
                        <p>
                            אנו מחויבים להנגשת האתר לכלל המשתמשים, כולל אנשים עם מוגבלויות. שאיפתנו לעמוד בהנחיות תקן הנגישות הבין-לאומי
                            WCAG 2.1 ברמה AA, ובהתאם לחוק שוויון זכויות לאנשים עם מוגבלות והתקנות בישראל.
                        </p>

                        <H3>מה יישמנו?</H3>
                        <List>
                            <li>תמיכה בניווט מקלדת, היררכיית כותרות ו-ARIA במידת הצורך.</li>
                            <li>ניגודיות צבעים מספקת וטקסטים קריאים.</li>
                            <li>טקסט חלופי לתמונות ותוויות לטפסים.</li>
                            <li>תאימות למכשירים ניידים ויחידות יחסיות.</li>
                        </List>

                        <H3>החרגות/מגבלות ידועות</H3>
                        <p>חלקים מסוימים באתר עשויים להיות עדיין בתהליך הנגשה מתמשך. נשמח לקבל משוב לשיפור.</p>

                        <H3>דרכי יצירת קשר בנושא נגישות</H3>
                        <p>
                            נתקלתם בבעיה? ספרו לנו ונפעל לתיקון:{" "}
                            <span className="font-semibold text-[#1E1E1E]">{BUSINESS.email}</span> |{" "}
                            <span className="font-semibold text-[#1E1E1E]">{BUSINESS.phone}</span>. אנא ציינו תיאור הבעיה, הדפדפן
                            ומערכת ההפעלה.
                        </p>
                    </SectionCard>

                    <SectionCard
                        id="cookies"
                        title="מדיניות קוקיז"
                        tone="light"
                        subtitle="למה יש קוקיז, אילו סוגים יש, ואיך אפשר לנהל העדפות."
                    >
                        <p>
                            אנו משתמשים בעוגיות (Cookies) ובטכנולוגיות דומות לצורך תפעול האתר, אבטחה, אנליטיקה, שיפור ביצועים והתאמה
                            אישית. חלק מהקוקיז הכרחיים וחלקם ניתנים לבחירה.
                        </p>

                        <H3>סוגי קוקיז</H3>
                        <List>
                            <li>
                                <strong className="text-[#1E1E1E]">הכרחיים:</strong> מאפשרים תפקוד בסיסי של האתר (אימות, אבטחה, שמירת
                                העדפות בסיסיות).
                            </li>
                            <li>
                                <strong className="text-[#1E1E1E]">ביצועים ואנליטיקה:</strong> מדידת שימוש וסטטיסטיקות (לדוגמה Google
                                Analytics).
                            </li>
                            <li>
                                <strong className="text-[#1E1E1E]">שיווק:</strong> פרסונליזציה ורימרקטינג בכפוף להסכמה, אם נדרש.
                            </li>
                        </List>

                        <H3>ניהול העדפות</H3>
                        <p>
                            תוכלו לנהל העדפות דרך דפדפן/מכשיר או דרך מרכז ההעדפות באתר (אם קיים). ניתן להסיר הסכמה לקוקיז לא הכרחיים בכל
                            עת.
                        </p>
                        <p className="mt-2">
                            לשאלות בנושא קוקיז/פרטיות: <span className="font-semibold text-[#1E1E1E]">{BUSINESS.email}</span>
                        </p>
                    </SectionCard>

                    <div className="flex justify-center mt-6">
                        <a
                            href="#top"
                            className="px-5 py-2 rounded-xl bg-[#B9895B] text-white hover:brightness-95 active:brightness-90 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9895B]/35"
                        >
                            חזרה לראש העמוד
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LegalPage;
