import axios from "axios";
import { clearToken, getToken } from "./tokenServices";
import { toastError } from "./authToast";
import store from "../Store/BigPie";
import { userActions } from "../Store/UserSlice";

const { VITE_API_URL } = import.meta.env;

const axiosInstance = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearToken();
      delete axiosInstance.defaults.headers.common["x-auth-token"];
      store.dispatch(userActions.logout());
      toastError("פג תוקף ההתחברות, התחבר מחדש");
    }

    if (status === 403) {
      toastError("אין לך הרשאה לבצע פעולה זו");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
