// src/pages/LegalPage.tsx
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const business = {
    name: "Omer Aviv Tattoo",
    domain: "https://example.com",
    email: "contact@example.com",
    phone: "050-0000000",
    address: "רח' הדוגמה 1, תל-אביב",
    lastUpdated: "08.2025",
};

const cardCls =
    "relative p-4 sm:p-5 bg-white/80 rounded-xl border border-[#e4d3a1] shadow-sm text-[#3B3024]";

const SectionCard: React.FC<React.PropsWithChildren<{ id: string; title: string }>> = ({
    id,
    title,
    children,
}) => (
    <motion.section
        id={id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.5 }}
        className={cardCls}
    >
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#3B3024]">{title}</h2>
        <div className="prose max-w-none prose-p:leading-relaxed prose-li:leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-ul:pr-5 prose-ol:pr-5">
            {children}
        </div>
    </motion.section>
);

export default function LegalPage() {
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.dir = "rtl";
    }, []);

    const navItems = useMemo(
        () => [
            { id: "privacy", label: "הצהרת פרטיות" },
            { id: "accessibility", label: "מדיניות נגישות" },
            { id: "terms", label: "תנאי שימוש" },
        ],
        []
    );

    return (
        <div
            className="min-h-screen pb-12 pt-28"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
                backgroundColor: "#CBB279",
            }}
        >
            <div className="max-w-5xl px-4 mx-auto hebrew-content">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F1F3C2] drop-shadow">
                        מסמך משפטי אחוד
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-3 py-2 text-sm rounded-lg bg-white/80 text-[#3B3024] border border-[#e4d3a1] hover:bg-white transition"
                        >
                            חזרה
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-3 py-2 text-sm rounded-lg bg-[#F1F3C2] text-[#3B3024] border border-transparent hover:opacity-90 transition"
                        >
                            דף הבית
                        </button>
                    </div>
                </div>

                {/* Subtitle */}
                <p className="text-[#3B3024] text-base sm:text-lg text-center mb-3">
                    {business.name} · {business.domain}
                </p>
                <p className="text-[#3B3024]/80 text-xs text-center mb-6">
                    עודכן לאחרונה: {business.lastUpdated}
                </p>

                {/* Pills nav */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    {navItems.map((it) => (
                        <a
                            key={it.id}
                            href={`#${it.id}`}
                            className="px-3 py-1.5 text-sm rounded-full bg-white/80 text-[#3B3024] border border-[#e4d3a1] hover:bg-white transition"
                        >
                            {it.label}
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <hr className="w-24 h-1 mx-auto mb-8 bg-[#F1F3C2] rounded-full border-0" />

                <div className="grid gap-5">
                    {/* Privacy */}
                    <SectionCard id="privacy" title="הצהרת פרטיות">
                        <p>
                            אנו ב־{business.name} מכבדים את פרטיות המשתמשים באתר {business.domain}. הצהרה זו מסבירה אילו נתונים
                            נאספים, כיצד אנו משתמשים בהם ומהן זכויותיך. המסמך הינו כללי ואינו ייעוץ משפטי.
                        </p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">אילו נתונים אנו אוספים</h3>
                        <ul>
                            <li>נתונים שסיפקת מרצון (פרטי קשר בטפסים, קבצים שצורפו, הודעות).</li>
                            <li>נתונים טכניים (IP, סוג דפדפן, רזולוציה, דפים נצפים, הפניות).</li>
                            <li>עוגיות (Cookies) ומזהים דומים לתפקוד האתר, אנליטיקה ושיווק (בכפוף להסכמה).</li>
                        </ul>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">כיצד אנו משתמשים בנתונים</h3>
                        <ul>
                            <li>מתן שירותים, טיפול בפניות ותמיכה.</li>
                            <li>שיפור חוויית המשתמש ותפקודיות.</li>
                            <li>סטטיסטיקות אנונימיות (רק אם אושרה אנליטיקה).</li>
                            <li>שיווק ומדידה (רק אם אושרו עוגיות שיווק).</li>
                        </ul>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">שיתוף עם צדדים שלישיים</h3>
                        <p>ייתכן שימוש בספקי משנה (אחסון, אנליטיקה, תשלומים) במידה הנדרשת בלבד.</p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">אבטחה ושמירת מידע</h3>
                        <p>
                            אנו מיישמים אמצעי הגנה סבירים. נתונים נשמרים לפרק הזמן הדרוש למטרות איסופם ובהתאם לדין. אין בטחון
                            מוחלט ברשת האינטרנט.
                        </p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">זכויות משתמש</h3>
                        <p>
                            ניתן לפנות אלינו לבקשת עיון/תיקון/מחיקה בכפוף לדין:{" "}
                            <a className="underline" href={`mailto:${business.email}`}>
                                {business.email}
                            </a>
                            .
                        </p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">יצירת קשר</h3>
                        <p>
                            דוא"ל:{" "}
                            <a className="underline" href={`mailto:${business.email}`}>
                                {business.email}
                            </a>{" "}
                            · טלפון: {business.phone} · כתובת: {business.address}
                        </p>
                    </SectionCard>

                    {/* Accessibility */}
                    <SectionCard id="accessibility" title="מדיניות נגישות">
                        <p>
                            {business.name} מחויב/ת להנגשת האתר לכלל הציבור, לרבות אנשים עם מוגבלויות, ופועל/ת לשיפור מתמיד של
                            החוויה בהתאם לעקרונות מקובלים.
                        </p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">מאפייני נגישות באתר</h3>
                        <ul>
                            <li>ניווט מלא במקלדת לרכיבים עיקריים.</li>
                            <li>טקסט חלופי לתמונות משמעותיות.</li>
                            <li>יחסי ניגודיות תקינים ברכיבים מרכזיים.</li>
                            <li>תוויות ושיוכים לטפסים.</li>
                            <li>כפתור נגישות עם: טקסט גדול, ניגודיות גבוהה, קו תחתון לקישורים, ביטול אנימציות ועוד.</li>
                        </ul>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">תקלות ושיפור מתמשך</h3>
                        <p>
                            אם נתקלתם בבעיה — אנא פנו אלינו עם פרטי המכשיר/דפדפן, תיאור קצר וקישור לעמוד, כדי שנוכל לתקן במהירות.
                        </p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">פרטי קשר לרכז/ת נגישות</h3>
                        <p>
                            {business.name} ·{" "}
                            <a className="underline" href={`mailto:${business.email}`}>
                                {business.email}
                            </a>{" "}
                            · {business.phone}
                        </p>
                    </SectionCard>

                    {/* Terms */}
                    <SectionCard id="terms" title="תנאי שימוש">
                        <p>
                            השימוש באתר {business.domain} כפוף לתנאים אלה; השימוש מעיד על הסכמה. אם אינך מסכים/ה — הימנע/י משימוש
                            באתר.
                        </p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">שימוש מותר</h3>
                        <ul>
                            <li>שימוש חוקי ובהתאם לדין.</li>
                            <li>אין לבצע איסוף אוטומטי, חדירה למערכות או פגיעה בזכויות.</li>
                        </ul>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">קניין רוחני</h3>
                        <p>
                            אלא אם נאמר אחרת, הזכויות בתכנים ובסימני המסחר שמורות ל־{business.name} או לבעלי הזכויות. אין להעתיק
                            או להפיץ בלי הרשאה.
                        </p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">אחריות</h3>
                        <p>
                            האתר והתכנים מוצעים "כפי שהם". ייתכנו שגיאות/אי-דיוקים/אי-זמינות. לא נישא באחריות לנזקים עקיפים או
                            תוצאתיים.
                        </p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">קישורים חיצוניים</h3>
                        <p>קישורים לאתרים חיצוניים ניתנים לנוחות בלבד — אנו לא אחראים לתכניהם או לנגישותם.</p>

                        <h3 className="mt-4 mb-1 text-lg font-semibold">שינויים ודין</h3>
                        <p>
                            אנו רשאים לעדכן את התנאים מעת לעת. הדין החל: דיני מדינת ישראל; סמכות השיפוט — בתי המשפט במחוז
                            תל-אביב–יפו.
                        </p>

                        <p className="mt-4 text-xs opacity-70">*מסמך תבניתי להמחשה בלבד ואינו מהווה ייעוץ משפטי.</p>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}
