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
    const dispatch = useDispatch();
    const nav = useNavigate();
    const initialData = {
        email: "",
        password: "",
    };

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: initialData,
        mode: "onChange",
        resolver: joiResolver(LoginSchema)
    });

    const onSubmit = async (form: typeof initialData) => {
        try {
            const token = await axios.post("http://localhost:8080/users/login", form);
            localStorage.setItem("token", token.data);
            const id = decode(token.data)._id;
            axios.defaults.headers.common["x-auth-token"] = token.data;
            const user = await axios.get("http://localhost:8080/users/" + id);

            dispatch(userActions.login(user.data));

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Login Success",
                showConfirmButton: false,
                timer: 1500
            });

            nav("/home");
        } catch (error) {
            console.log(error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Your email or password is incorrect",
                showConfirmButton: false,
                timer: 1500
            });
        }
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
                <h1 className="mb-6 text-4xl font-extrabold text-center text-[#8C7351]">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    {/* Email Input */}
                    <div className="relative">
                        <FloatingLabel
                            type="email"
                            label="Email"
                            variant="standard"
                            {...register("email")}
                            color={errors.email ? "error" : "success"}
                            className="text-lg text-[#4B4B4B]"
                        />
                        <span className="text-sm text-red-500">{errors.email?.message}</span>
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <FloatingLabel
                            type="password"
                            label="Password"
                            variant="standard"
                            {...register("password")}
                            color={errors.password ? "error" : "success"}
                            className="text-lg text-[#4B4B4B]"
                        />
                        <span className="text-sm text-red-500">{errors.password?.message}</span>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!isValid}
                        className="mt-4 py-3 px-6 bg-[#A68B5B] text-white font-bold rounded-lg hover:bg-[#8C7351] transition duration-300 ease-in-out shadow-md"
                    >
                        Login
                    </Button>
                </form>

                {/* Footer text */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-[#8C7351]">Don't have an account?
                        <Link to="/register" className="text-[#8C7351] font-bold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
