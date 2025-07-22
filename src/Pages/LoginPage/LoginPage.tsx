import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel } from "flowbite-react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../../Validations/LoginSchema";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { userActions } from "../../Store/UserSlice";
import { decode } from "../../Services/tokenServices";
import { motion } from "framer-motion";


const LoginPage = () => {
    const { VITE_API_URL } = import.meta.env;
    const dispatch = useDispatch();
    const nav = useNavigate();
    const initialData = {
        email: "",
        password: "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: initialData,
        mode: "onChange",
        resolver: joiResolver(LoginSchema),
    });
    const onSubmit = async (form: typeof initialData) => {
        try {
            const token = await axios.post(VITE_API_URL +"/users/login", form);
            const tokenStr = token.data.token;
            localStorage.setItem("token", tokenStr);
            const decoded = decode(tokenStr);
            axios.defaults.headers.common["x-auth-token"] = tokenStr;

            const userResponse = await axios.get(`${VITE_API_URL}/users/${decoded._id}`);
            dispatch(userActions.login(userResponse.data));

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Login Success",
                showConfirmButton: false,
                timer: 1500,
            });
            nav("#hero");
        } catch (error) {
            console.log(error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Your email or password is incorrect",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    return (
        <div
            className="min-h-screen pt-20 px-4 flex items-center justify-center bg-[#FFFFFF] font-serif text-[#3B3024]"
            style={{
                backgroundImage: "url('/backgrounds/BG4.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right top",
                backgroundAttachment: "fixed",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="w-full max-w-lg p-8 bg-[#F1F3C2] rounded-3xl shadow-2xl border border-[#CBB279]/50"
            >
                <h1 className="mb-6 text-4xl font-extrabold text-center text-[#8C7351] tracking-wide">
                    Login
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <FloatingLabel
                        label="Email"
                        type="email"
                        variant="standard"
                        className="text-[#4B4B4B]"
                        {...register("email")}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

                    <FloatingLabel
                        label="Password"
                        type="password"
                        variant="standard"
                        className="text-[#4B4B4B]"
                        {...register("password")}
                    />
                    {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

                    <Button
                        type="submit"
                        disabled={!isValid}
                        className="mt-4 bg-[#97BE5A] text-white font-semibold rounded-lg py-2 hover:bg-[#7ea649] transition duration-300"
                    >
                        Login
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-[#5A4B36]">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-[#8C7351] hover:underline">
                        Sign Up
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
