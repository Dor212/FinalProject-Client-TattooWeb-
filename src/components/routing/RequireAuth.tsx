import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { TRootState } from "../../Store/BigPie";
import { getToken } from "../../Services/tokenServices";

const RequireAuth = () => {
    const location = useLocation();
    const userState = useSelector((state: TRootState) => state.UserSlice);
    const user = userState.user;
    const token = getToken();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-[#3B3024]">
                טוען...
            </div>
        );
    }

    if (!user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RequireAuth;