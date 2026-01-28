// src/Pages/LoginPage/LoginPage.tsx
import { joiResolver } from "@hookform/resolvers/joi";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import axios from "../../Services/axiosInstance";
import { userActions } from "../../Store/UserSlice";
import { decode, isTokenExpired, setToken } from "../../Services/tokenServices";
import { LoginSchema } from "../../Validations/LoginSchema";

type LoginForm = {
    email: string;
    password: string;
};

type JwtPayload = {
    _id: string;
    exp?: number;
};

type LocationState = {
    from?: {
        pathname?: string;
    };
};

const LoginPage = () => {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const location = useLocation();
    const [rememberMe, setRememberMe] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<LoginForm>({
        defaultValues: { email: "", password: "" },
        mode: "onChange",
        resolver: joiResolver(LoginSchema),
    });

    const emailErr = errors.email?.message;
    const passErr = errors.password?.message;

    const onSubmit = async (form: LoginForm) => {
        try {
            const { data } = await axios.post<{ token: string }>(`/users/login`, form);
            const tokenStr = data.token;

            if (isTokenExpired(tokenStr)) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "ההתחברות פגה, נסה שוב",
                    showConfirmButton: false,
                    timer: 1600,
                });
                return;
            }

            setToken(tokenStr, rememberMe);

            const decoded = decode(tokenStr) as JwtPayload;
            const userResponse = await axios.get(`/users/${decoded._id}`);
            dispatch(userActions.login(userResponse.data));

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "התחברת בהצלחה",
                showConfirmButton: false,
                timer: 1200,
            });

            const st = location.state as LocationState | null;
            const redirectTo = st?.from?.pathname || "/AdminPage";
            nav(redirectTo, { replace: true });
        } catch (error: unknown) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "אימייל או סיסמה לא נכונים",
                showConfirmButton: false,
                timer: 1600,
            });
        }
    };

    const title = useMemo(() => "התחברות", []);
    const subtitle = useMemo(() => "כניסה לניהול האתר", []);

    return (
        <div className="min-h-[100svh] pt-24 px-4 flex items-center justify-center font-serif text-[#1E1E1E]" dir="rtl">
            <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="relative rounded-[28px] overflow-hidden border border-[#B9895B]/25 bg-white/35 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.18)]">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(185,137,91,0.14),transparent_52%),radial-gradient(circle_at_80%_90%,rgba(232,217,194,0.30),transparent_55%)]" />

                    <div className="relative px-8 pt-8 pb-6 border-b border-[#B9895B]/15 text-center">
                        <h1 className="text-3xl font-extrabold tracking-wide text-[#B9895B]">{title}</h1>
                        <p className="mt-2 text-sm text-[#1E1E1E]/70">{subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="relative px-8 space-y-4 py-7">
                        <div className="space-y-2">
                            <label className="block text-right text-sm font-semibold text-[#1E1E1E]/80">אימייל</label>
                            <input
                                type="email"
                                autoComplete="email"
                                placeholder="name@email.com"
                                className="w-full rounded-xl border border-[#B9895B]/25 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                {...register("email")}
                            />
                            {emailErr && <p className="text-sm text-red-600">{String(emailErr)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-right text-sm font-semibold text-[#1E1E1E]/80">סיסמה</label>
                            <input
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-[#B9895B]/25 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                {...register("password")}
                            />
                            {passErr && <p className="text-sm text-red-600">{String(passErr)}</p>}
                        </div>

                        <label className="flex items-center justify-between text-sm text-[#1E1E1E]/75 select-none">
                            <span>זכור אותי</span>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 accent-[#B9895B]"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className={`w-full rounded-xl py-3 font-semibold transition ${!isValid || isSubmitting
                                    ? "bg-[#B9895B]/35 text-white/85 cursor-not-allowed"
                                    : "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90"
                                }`}
                        >
                            {isSubmitting ? "מתחבר..." : "התחבר"}
                        </button>

                        <div className="pt-2 text-center text-sm text-[#1E1E1E]/70">
                            אין לך משתמש?{" "}
                            <Link to="/register" className="font-semibold text-[#B9895B] hover:underline">
                                הרשמה
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="mt-4 text-center text-xs text-[#1E1E1E]/55">גישה מוגנת, צוות בלבד</div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
