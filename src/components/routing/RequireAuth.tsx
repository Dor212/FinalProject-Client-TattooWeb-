import { Navigate, Outlet, useLocation } from "react-router-dom";
import { clearToken, getToken, isTokenExpired } from "../../Services/tokenServices";

const RequireAuth = () => {
    const location = useLocation();
    const token = getToken();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (isTokenExpired(token)) {
        clearToken();
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default RequireAuth;
