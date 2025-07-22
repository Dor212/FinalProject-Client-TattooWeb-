import { Navbar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TRootState } from "../../../Store/BigPie";
import { useEffect, useState } from "react";
import axios from "axios";
import { decode } from "../../../Services/tokenServices.ts";
import { userActions } from "../../../Store/UserSlice.ts";

const Header = () => {
  const { VITE_API_URL } = import.meta.env;
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: TRootState) => state.UserSlice.user);
  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const nav = useNavigate();

  const logout = () => {
    
    dispatch(userActions.logout());
    nav("/");
  };

  const toggleNavbar = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = decode(token);
        axios.defaults.headers.common["x-auth-token"] = token;

        axios.get(VITE_API_URL +`/users/${decoded._id}`)
          .then(res => {
            if (res.data && res.data._id) {
              dispatch(userActions.login(res.data));
            } else {
              localStorage.removeItem("token");
            }
          })
          .catch(() => localStorage.removeItem("token"));
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, [VITE_API_URL, dispatch]);

  console.log("user", user);
  return (
    <Navbar
      fluid
      rounded
      className="fixed top-0 left-0 z-50 w-full bg-[#F1F3C2]/90 backdrop-blur-md shadow-md text-[#3B3024]"
    >
      <Navbar.Brand as={Link} to="#hero" className="flex items-center gap-3">
        <img
          src="/backgrounds/LogoOmerTattoo_transparent.png"
          alt="Omer Logo"
          className="w-auto h-10 transition-transform duration-300 hover:scale-105"
        />
      </Navbar.Brand>

      <Navbar.Toggle onClick={toggleNavbar} />

      <Navbar.Collapse
        className={`${isOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 text-lg`}
      >
        {!user && (
          <>
            <Navbar.Link
              as={Link}
              to="/register"
              className={`hover:underline hover:text-[#97BE5A] ${location === "/register" ? "font-bold" : ""
                }`}
            >
              הרשמה
            </Navbar.Link>
            <Navbar.Link
              as={Link}
              to="/login"
              className={`hover:underline hover:text-[#97BE5A] ${location === "/login" ? "font-bold" : ""
                }`}
            >
              התחבר
            </Navbar.Link>
          </>
        )}

        {user?.isAdmin && (
          <Navbar.Link
            as={Link}
            to="/AdminPage"
            className={`hover:underline hover:text-[#97BE5A] ${location === "/AdminPage" ? "font-bold" : ""
              }`}
          >
            Admin
          </Navbar.Link>
        )}

        {user && (
          <Navbar.Link
            as={Link}
            to="#"
            onClick={logout}
            className="hover:underline hover:text-red-500"
          >
            התנתק
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
