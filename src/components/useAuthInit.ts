import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { userActions } from "../Store/UserSlice";
import { decode } from "../Services/tokenServices";
 

const { VITE_API_URL } = import.meta.env;

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = decode(token);
        axios.defaults.headers.common["x-auth-token"] = token;

        axios.get(`${VITE_API_URL}/users/${decoded._id}`)
          .then(res => {
            dispatch(userActions.login(res.data));
          })
          .catch(() => {
            localStorage.removeItem("token");
          });
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);
};

export default useAuthInit;
