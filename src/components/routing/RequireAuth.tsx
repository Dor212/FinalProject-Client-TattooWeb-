import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { decode } from "../../Services/tokenServices";

const RequireAuth = () => {
    const location = useLocation();
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    try {
        const decoded = decode(token);
        const now = Date.now() / 1000;
        if (decoded?.exp && decoded.exp < now) {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["x-auth-token"];
            return <Navigate to="/login" replace state={{ from: location }} />;
        }
    } catch {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["x-auth-token"];
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    axios.defaults.headers.common["x-auth-token"] = token;

    return <Outlet />;
};

export default RequireAuth;
