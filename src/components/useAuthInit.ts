import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../Services/axiosInstance";
import { clearToken, decode, getToken, isTokenExpired } from "../Services/tokenServices";
import { userActions } from "../Store/UserSlice";

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    if (isTokenExpired(token)) {
      clearToken();
      dispatch(userActions.logout());
      return;
    }

    let alive = true;

    (async () => {
      try {
        const decoded = decode(token);
        const res = await api.get(`/users/${decoded._id}`);
        if (!alive) return;
        dispatch(userActions.login(res.data));
      } catch {
        if (!alive) return;
        clearToken();
        dispatch(userActions.logout());
      }
    })();

    return () => {
      alive = false;
    };
  }, [dispatch]);
};

export default useAuthInit;
