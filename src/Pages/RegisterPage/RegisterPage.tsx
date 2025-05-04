import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import RegisterSchema from "../../Validations/RegisterSchema";
import axios from "axios";
import { Button, FloatingLabel } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const RegisterPage = () => {
    const { VITE_API_URL } = import.meta.env;
    const initialData = {
        name: {
            first: "",
            last: "",
        },
        phone: "",
        email: "",
        password: "",
    };
    const nav = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: initialData,
        mode: "all",
        resolver: joiResolver(RegisterSchema),
    });

    const onSubmit = async (form: typeof initialData) => {
        try {
            const res = await axios.post(VITE_API_URL + "/users/register", form);
            if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "Thanks",
                    showConfirmButton: false,
                    timer: 1500,
                });
                nav("/login");
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Sorry something went wrong",
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
                    Register
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <FloatingLabel
                        label="First Name"
                        type="text"
                        variant="standard"
                        className="text-[#4B4B4B]"
                        {...register("name.first")}
                    />
                    {errors.name?.first && <p className="text-sm text-red-600">{errors.name.first.message}</p>}

                    <FloatingLabel
                        label="Last Name"
                        type="text"
                        variant="standard"
                        className="text-[#4B4B4B]"
                        {...register("name.last")}
                    />
                    {errors.name?.last && <p className="text-sm text-red-600">{errors.name.last.message}</p>}

                    <FloatingLabel
                        label="Phone"
                        type="text"
                        variant="standard"
                        className="text-[#4B4B4B]"
                        {...register("phone")}
                    />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}

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
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-[#5A4B36]">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-[#8C7351] hover:underline">
                        Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
