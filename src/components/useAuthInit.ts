import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../Services/axiosInstance";
import { clearToken, getToken, isTokenExpired } from "../Services/tokenServices";
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
        const res = await api.get(`/users/me`);
        if (!alive) return;
        dispatch(userActions.login(res.data.user ?? res.data));
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
