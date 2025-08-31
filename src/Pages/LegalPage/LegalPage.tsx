import React from "react";

// =========================
// LegalPage – עמוד מדיניות מרוכז (פרטיות, תנאי שימוש, נגישות, קוקיז)
// תואם להגדרות ה-CSS שסיפקת: Heebo גלובלי, RTL דרך .hebrew-content,
// ומחזיק את העיצוב בפלטת BG4 / #CBB279 / #F1F3C2 / #97BE5A / #3B3024
// =========================

const BUSINESS = {
    name: import.meta.env.VITE_BUSINESS_NAME || "Y.M.A – אתרים מותאמים אישית",
    website: import.meta.env.VITE_SITE_URL || "https://example.com",
    email: import.meta.env.VITE_CONTACT_EMAIL || "contact@example.com",
    phone: import.meta.env.VITE_CONTACT_PHONE || "+972-50-0000000",
    address: import.meta.env.VITE_CONTACT_ADDRESS || "ישראל",
};

// כרטיסית מקטע – בלי שימוש ב"prose" כדי שלא נדרוש tailwind-typography
const SectionCard: React.FC<React.PropsWithChildren<{ title: string; id: string; tone?: "warm" | "light" }>> = ({ title, id, tone = "light", children }) => (
    <section id={id} aria-labelledby={`${id}-title`} className={`rounded-xl shadow-lg p-6 md:p-8 ${tone === "warm" ? "bg-[#CBB279] text-[#3B3024]" : "bg-[#F1F3C2] text-[#3B3024]"}`}>
        <h2 id={`${id}-title`} className="mb-4 text-2xl font-bold tracking-wide md:text-3xl">{title}</h2>
        <div className="space-y-3">
            {children}
        </div>
    </section>
);

const Anchor: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white transition shadow border border-[#e2d9c3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#97BE5A]"
    >
        {children}
    </a>
);

const LegalPage: React.FC = () => {
    const today = new Date().toLocaleDateString("he-IL", { year: "numeric", month: "2-digit", day: "2-digit" });

    return (
        <main
            id="top"
            role="main"
            aria-label="מסמכי מדיניות האתר"
            dir="rtl"
            className="hebrew-content min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-8 bg-[#FFFFFF] text-[#3B3024]"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="max-w-5xl mx-auto">
                {/* כותרת + תאריך עדכון */}
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">מסמכי מדיניות האתר</h1>
                    <p className="mt-2 opacity-80">עודכן לאחרונה: {today}</p>
                </header>

                {/* ניווט פנימי מהיר */}
                <nav className="sticky z-10 mb-10 top-20" aria-label="ניווט פנימי">
                    <div className="flex flex-wrap justify-center gap-3">
                        <Anchor href="#privacy">הצהרת פרטיות</Anchor>
                        <Anchor href="#terms">תנאי שימוש</Anchor>
                        <Anchor href="#accessibility">הצהרת נגישות</Anchor>
                        <Anchor href="#cookies">מדיניות קוקיז</Anchor>
                    </div>
                </nav>

                <div className="grid gap-8">
                    {/* Privacy Policy */}
                    <SectionCard id="privacy" title="הצהרת פרטיות" tone="warm">
                        <p>
                            פרטיות המשתמשים חשובה לנו. מסמך זה מסביר אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם, עם מי אנו משתפים אותם וכיצד ניתן לממש זכויות על פי הדין החל.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">איזה מידע נאסף?</h3>
                        <ul className="pr-6 space-y-2 list-disc">
                            <li>
                                <strong>מידע שנמסר מרצון:</strong> שם, כתובת דוא"ל, טלפון, תוכן פניות, קבצים שצורפו, פרטי הזמנה/רכישה (ככל שיש חנות באתר).
                            </li>
                            <li>
                                <strong>מידע טכני ושימושי:</strong> כתובת IP, סוג דפדפן ומכשיר, עמודים שנצפו, זמנים, הפניות, מזהי קוקיז/פיקסלים ונתוני ביצועים לצורכי אבטחה, אנליטיקה ושיפור חוויית המשתמש.
                            </li>
                        </ul>
                        <h3 className="mt-4 text-xl font-semibold">למה אנו משתמשים במידע?</h3>
                        <ul className="pr-6 space-y-2 list-disc">
                            <li>לתפעול האתר והענקת השירותים (מענה לפניות, ניהול חשבונות משתמש, הזמנות ותשלומים אם קיימים).</li>
                            <li>לשיפור חוויית השימוש, מדידות סטטיסטיות וניתוחי ביצועים.</li>
                            <li>לשמירת אבטחת מידע, מניעת הונאה ועמידה בדרישות הדין.</li>
                            <li>שיווק והתאמה אישית – בכפוף לקבלת הסכמה היכן שנדרש וכיבוד זכות להתנגד/להסיר.</li>
                        </ul>
                        <h3 className="mt-4 text-xl font-semibold">שיתוף מידע</h3>
                        <p>
                            אנו עשויים לשתף מידע עם ספקים חיצוניים המסייעים לנו בתפעול (אחסון, דוא"ל, אנליטיקה, סליקה, משלוחים), בכפוף להתחייבויות סודיות ואבטחת מידע. מידע יימסר לרשויות כאשר הדבר נדרש על פי דין.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">אבטחת מידע ושמירתו</h3>
                        <p>
                            אנו מיישמים אמצעי אבטחה סבירים להגנה על המידע. משך השמירה ייקבע בהתאם למטרות העיבוד ולחובות החוקיות.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">זכויות משתמשים</h3>
                        <ul className="pr-6 space-y-2 list-disc">
                            <li>זכות עיון, תיקון ומחיקה של מידע אישי, בכפוף לדין.</li>
                            <li>זכות להתנגד לעיבוד מסוים ו/או לבטל הסכמה שניתנה.</li>
                            <li>זכות לניידות מידע במקרים מסוימים.</li>
                        </ul>
                        <h3 className="mt-4 text-xl font-semibold">יצירת קשר בנושא פרטיות</h3>
                        <p>
                            לשאלות/בקשות בנושא פרטיות ניתן לפנות ל-{BUSINESS.name} בכתובת: {BUSINESS.email} | {BUSINESS.phone} | {BUSINESS.address}
                        </p>
                    </SectionCard>

                    {/* Terms of Use */}
                    <SectionCard id="terms" title="תנאי שימוש">
                        <p>
                            השימוש באתר {BUSINESS.website} ובשירותי {BUSINESS.name} כפוף לתנאים שלהלן. גלישה באתר מהווה הסכמה לתנאים.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">שימוש מותר והגבלות</h3>
                        <ul className="pr-6 space-y-2 list-disc">
                            <li>האתר מסופק לשימוש אישי וחוקי בלבד. אין להעתיק, להפיץ, לשנות או לבצע הנדסה לאחור ללא רשות.</li>
                            <li>אין להעלות תכנים בלתי חוקיים, פוגעניים, מפרי זכויות יוצרים או פרטיות.</li>
                            <li>אנו רשאים לחסום גישה/להסיר תכנים לפי שיקול דעתנו כדי לשמור על תקינות האתר והדין.</li>
                        </ul>
                        <h3 className="mt-4 text-xl font-semibold">קניין רוחני</h3>
                        <p>
                            אלא אם צוין אחרת, כל זכויות הקניין הרוחני באתר ובתכניו שייכות ל-{BUSINESS.name} ו/או לבעלי הזכויות הרלוונטיים. סימני מסחר, לוגואים ותמונות מוגנים בדין.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">רכישות ותשלומים (אם קיימים)</h3>
                        <ul className="pr-6 space-y-2 list-disc">
                            <li>מחירים כוללים/אינם כוללים מע"מ – יש לעדכן בהתאם.</li>
                            <li>החזרות/ביטולים כפופים למדיניות החזרות המתפרסמת באתר ולדין החל.</li>
                            <li>התממשקות לספקי סליקה/משלוחים תעשה בכפוף לתנאיהם.</li>
                        </ul>
                        <h3 className="mt-4 text-xl font-semibold">הגבלת אחריות</h3>
                        <p>
                            האתר והשירותים מוצעים "כפי שהם" (AS-IS). אנו שואפים לדיוק וזמינות אך איננו מתחייבים להיעדר תקלות/שגיאות. לא נהיה אחראים לכל נזק עקיף/תוצאתי הנובע מהשימוש באתר, ככל שהדין מאפשר.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">שינויים</h3>
                        <p>
                            אנו רשאים לעדכן את התנאים/המדיניות מעת לעת. המשך שימוש לאחר שינוי מהווה הסכמה לנוסח המעודכן.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">שיפוט ודין</h3>
                        <p>
                            יחולו דיני מדינת ישראל וסמכות השיפוט הבלעדית תהיה בבתי המשפט המוסמכים בישראל.
                        </p>
                    </SectionCard>

                    {/* Accessibility Statement */}
                    <SectionCard id="accessibility" title="הצהרת נגישות" tone="warm">
                        <p>
                            אנו מחויבים להנגשת האתר לכלל המשתמשים, כולל אנשים עם מוגבלויות. שאיפתנו לעמוד בהנחיות תקן הנגישות הבין-לאומי WCAG 2.1 ברמה AA, ובהתאם לחוק שוויון זכויות לאנשים עם מוגבלות והתקנות בישראל.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">מה יישמנו?</h3>
                        <ul className="pr-6 space-y-2 list-disc">
                            <li>תמיכה בניווט מקלדת, היררכיית כותרות ו-ARIA במידת הצורך.</li>
                            <li>ניגודיות צבעים מספקת וטקסטים קריאים.</li>
                            <li>טקסט חלופי לתמונות ותוויות לטפסים.</li>
                            <li>תאימות למכשירים ניידים ויחידות יחסיות.</li>
                        </ul>
                        <h3 className="mt-4 text-xl font-semibold">החרגות/מגבלות ידועות</h3>
                        <p>
                            חלקים מסוימים באתר עשויים להיות עדיין בתהליך הנגשה מתמשך. נשמח לקבל משוב לשיפור.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">דרכי יצירת קשר בנושא נגישות</h3>
                        <p>
                            נתקלתם בבעיה? ספרו לנו ונפעל לתיקון: {BUSINESS.email} | {BUSINESS.phone}. אנא ציינו תיאור הבעיה, הדפדפן ומערכת ההפעלה.
                        </p>
                    </SectionCard>

                    {/* Cookies Policy */}
                    <SectionCard id="cookies" title="מדיניות קוקיז">
                        <p>
                            אנו משתמשים בעוגיות (Cookies) ובטכנולוגיות דומות לצורך תפעול האתר, אבטחה, אנליטיקה, שיפור ביצועים והתאמה אישית. חלק מהקוקיז הכרחיים וחלקם ניתנים לבחירה.
                        </p>
                        <h3 className="mt-4 text-xl font-semibold">סוגי קוקיז</h3>
                        <ul className="pr-6 space-y-2 list-disc">
                            <li><strong>הכרחיים:</strong> מאפשרים תפקוד בסיסי של האתר (אימות, אבטחה, שמירת העדפות בסיסיות).</li>
                            <li><strong>ביצועים ואנליטיקה:</strong> מדידת שימוש וסטטיסטיקות (לדוגמה Google Analytics).</li>
                            <li><strong>שיווק:</strong> פרסונליזציה ורימרקטינג בכפוף להסכמה, אם נדרש.</li>
                        </ul>
                        <h3 className="mt-4 text-xl font-semibold">ניהול העדפות</h3>
                        <p>
                            תוכלו לנהל העדפות דרך דפדפן/מכשיר או דרך מרכז ההעדפות באתר (אם קיים). ניתן להסיר הסכמה לקוקיז לא הכרחיים בכל עת.
                        </p>
                        <p className="mt-2">לשאלות בנושא קוקיז/פרטיות: {BUSINESS.email}</p>
                    </SectionCard>

                    {/* כפתור חזרה למעלה */}
                    <div className="flex justify-center mt-6">
                        <a
                            href="#top"
                            className="px-5 py-2 rounded-xl bg-[#97BE5A] text-white hover:bg-[#7ea649] transition shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#97BE5A]"
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
