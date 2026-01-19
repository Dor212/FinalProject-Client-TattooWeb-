import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import RegisterSchema from "../../Validations/RegisterSchema";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

type RegisterForm = {
    name: {
        first: string;
        last: string;
    };
    phone: string;
    email: string;
    password: string;
};

const RegisterPage = () => {
    const { VITE_API_URL } = import.meta.env;
    const nav = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<RegisterForm>({
        defaultValues: {
            name: { first: "", last: "" },
            phone: "",
            email: "",
            password: "",
        },
        mode: "onChange",
        resolver: joiResolver(RegisterSchema),
    });

    const onSubmit = async (form: RegisterForm) => {
        try {
            const res = await axios.post(`${VITE_API_URL}/users/register`, form);
            if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "Account created",
                    showConfirmButton: false,
                    timer: 1300,
                });
                nav("/login");
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Sorry, something went wrong",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const firstErr = errors.name?.first?.message;
    const lastErr = errors.name?.last?.message;
    const phoneErr = errors.phone?.message;
    const emailErr = errors.email?.message;
    const passErr = errors.password?.message;

    return (
        <div className="min-h-[100svh] pt-24 px-4 flex items-center justify-center font-serif text-[#1E1E1E]">
            <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="relative rounded-[28px] overflow-hidden border border-[#B9895B]/25 bg-white/35 backdrop-blur-xl shadow-[0_18px_70px_rgba(30,30,30,0.18)]">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(185,137,91,0.14),transparent_52%),radial-gradient(circle_at_80%_90%,rgba(232,217,194,0.30),transparent_55%)]" />

                    <div className="relative px-8 pt-8 pb-6 border-b border-[#B9895B]/15">
                        <h1 className="text-3xl font-extrabold tracking-wide text-center text-[#B9895B]">Register</h1>
                        <p className="mt-2 text-center text-sm text-[#1E1E1E]/70">Create an account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="relative px-8 space-y-4 py-7">
                        <div className="space-y-2">
                            <label className="block text-left text-sm font-semibold text-[#1E1E1E]/80">First Name</label>
                            <input
                                type="text"
                                autoComplete="given-name"
                                placeholder="First name"
                                className="w-full rounded-xl border border-[#B9895B]/25 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                {...register("name.first")}
                            />
                            {firstErr && <p className="text-sm text-red-600">{String(firstErr)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-left text-sm font-semibold text-[#1E1E1E]/80">Last Name</label>
                            <input
                                type="text"
                                autoComplete="family-name"
                                placeholder="Last name"
                                className="w-full rounded-xl border border-[#B9895B]/25 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                {...register("name.last")}
                            />
                            {lastErr && <p className="text-sm text-red-600">{String(lastErr)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-left text-sm font-semibold text-[#1E1E1E]/80">Phone</label>
                            <input
                                type="tel"
                                autoComplete="tel"
                                placeholder="Phone number"
                                className="w-full rounded-xl border border-[#B9895B]/25 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                {...register("phone")}
                            />
                            {phoneErr && <p className="text-sm text-red-600">{String(phoneErr)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-left text-sm font-semibold text-[#1E1E1E]/80">Email</label>
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
                            <label className="block text-left text-sm font-semibold text-[#1E1E1E]/80">Password</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-[#B9895B]/25 bg-[#F6F1E8]/55 px-4 py-3 text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:ring-2 focus:ring-[#B9895B]/35 focus:border-[#B9895B]/35"
                                {...register("password")}
                            />
                            {passErr && <p className="text-sm text-red-600">{String(passErr)}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className={`w-full rounded-xl py-3 font-semibold transition ${!isValid || isSubmitting
                                    ? "bg-[#B9895B]/35 text-white/85 cursor-not-allowed"
                                    : "bg-[#B9895B] text-white hover:brightness-95 active:brightness-90"
                                }`}
                        >
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </button>

                        <div className="pt-2 text-center text-sm text-[#1E1E1E]/70">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-[#B9895B] hover:underline">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="mt-4 text-center text-xs text-[#1E1E1E]/55">Protected access, staff only</div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
