import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { decode } from "../Services/tokenServices";
import { userActions } from "../Store/UserSlice";

const { VITE_API_URL } = import.meta.env;

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = decode(token); 
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
  console.warn("🔒 Token expired");
  localStorage.removeItem("token");
  return;
}

      axios.defaults.headers.common["x-auth-token"] = token;

      axios.get(`${VITE_API_URL}/users/${decoded._id}`)
        .then(res => {
          dispatch(userActions.login(res.data));
        })
        .catch(err => {
          console.warn("❌ Failed to validate token on server", err);
          localStorage.removeItem("token");
        });

    } catch (err) {
      console.warn("❌ Invalid token format", err);
      localStorage.removeItem("token");
    }
  }, []);
};

export default useAuthInit;
