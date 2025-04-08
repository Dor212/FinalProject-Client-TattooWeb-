import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import RegisterSchema from "../../Validations/RegisterSchema";
import axios from "axios";
import { Button, FloatingLabel } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const RegisterPage = () => {
    const initialData = {
        name: {
            first: "",
            last: "",
        },
        phone: "",
        email: "",
        password: ""
    };
    const nav = useNavigate();
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: initialData,
        mode: "all",
        resolver: joiResolver(RegisterSchema)
    })

    const onSubmit = async (form: typeof initialData) => {
        try {
            const res = await axios.post(
                "http://localhost:8080/users/register", form,
            );
            if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "Thanks",
                    showConfirmButton: false,
                    timer: 1500
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
                timer: 1500
            });
        };
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-[#CBB279] overflow-hidden">
            <div className="absolute inset-0 bg-[#EAD8A3] opacity-50 rounded-3xl transform scale-125 blur-lg"></div>

            {/* Motion div for the slow entrance animation */}
            <motion.div
                initial={{ opacity: 0, y: -100 }}  // התחל ממקום גבוה עם שקיפות נמוכה
                animate={{ opacity: 1, y: 0 }}  // התפשט לשקיפות מלאה והמקום הנכון
                transition={{ duration: 1.5, ease: "easeOut" }}  // תוצא תנועה איטית עם חצי שניה להחלקה
                className="relative z-10 w-full max-w-md p-8 bg-[#F1F3C2] shadow-2xl rounded-3xl"
            >
                <h1 className="mb-6 text-4xl font-extrabold text-center text-[#8C7351]">Register</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    {/* First Name Input */}
                    <div className="relative">
                        <FloatingLabel
                            className="text-2xl text-[#4B4B4B]"
                            type="text"
                            label="First Name"
                            variant="standard"
                            {...register("name.first")}
                            color={errors.name?.first ? "error" : "success"}
                        />
                        <span className="text-sm text-red-500">{errors.name?.first?.message}</span>
                    </div>

                    {/* Last Name Input */}
                    <div className="relative">
                        <FloatingLabel
                            className="text-2xl text-[#4B4B4B]"
                            type="text"
                            label="Last Name"
                            variant="standard"
                            {...register("name.last")}
                            color={errors.name?.last ? "error" : "success"}
                        />
                        <span className="text-sm text-red-500">{errors.name?.last?.message}</span>
                    </div>

                    {/* Phone Input */}
                    <div className="relative">
                        <FloatingLabel
                            className="text-2xl text-[#4B4B4B]"
                            type="number"
                            label="Phone"
                            variant="standard"
                            {...register("phone")}
                            color={errors.phone ? "error" : "success"}
                        />
                        <span className="text-sm text-red-500">{errors.phone?.message}</span>
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <FloatingLabel
                            className="text-2xl text-[#4B4B4B]"
                            type="email"
                            label="Email"
                            variant="standard"
                            {...register("email")}
                            color={errors.email ? "error" : "success"}
                        />
                        <span className="text-sm text-red-500">{errors.email?.message}</span>
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <FloatingLabel
                            className="text-2xl text-[#4B4B4B]"
                            type="password"
                            label="Password"
                            variant="standard"
                            {...register("password")}
                            color={errors.password ? "error" : "success"}
                        />
                        <span className="text-sm text-red-500">{errors.password?.message}</span>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!isValid}
                        className="mt-4 py-3 px-6 bg-[#A68B5B] text-white font-bold rounded-lg hover:bg-[#8C7351] transition duration-300 ease-in-out shadow-md"
                    >
                        Register
                    </Button>
                </form>

                {/* Footer text */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-[#8C7351]">Already have an account?
                        <Link to="/login" className="text-[#8C7351] font-bold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
