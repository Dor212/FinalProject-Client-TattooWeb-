// Header.tsx
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
  const pathname = useLocation().pathname; // <-- שם ברור
  const dispatch = useDispatch();
  const nav = useNavigate();

  // --------- הגדרה: באילו נתיבים להחיל את מצב "קאנבס" ---------
  // ערוך/הסר/הוסף לפי הנתיב האמיתי שלך
  const CANVAS_ROUTES = ["/canvas", "/canvases", "/simulator", "/ApplySketch"];
  const isCanvasPage = CANVAS_ROUTES.some((p) => pathname.startsWith(p));

  // בחר מצב:
  const SHOW_MINIMAL_LOGO_ONLY = true;  // true = רק לוגו; false = להסתיר לגמרי

  const logout = () => {
    dispatch(userActions.logout());
    nav("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = decode(token);
      axios.defaults.headers.common["x-auth-token"] = token;

      axios
        .get(`${VITE_API_URL}/users/${decoded._id}`)
        .then((res) => {
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
  }, [VITE_API_URL, dispatch]);

  const baseLink =
    "px-3 py-2 rounded-lg transition hover:underline hover:text-[#97BE5A]";
  const active = "font-bold";

  // --------- מצב "קאנבס": הסתרה מוחלטת ---------
  if (isCanvasPage && !SHOW_MINIMAL_LOGO_ONLY) {
    return null;
  }

  // --------- מצב "קאנבס": רק לוגו לא־לחיץ ---------
  if (isCanvasPage && SHOW_MINIMAL_LOGO_ONLY) {
    return (
      <header
        dir="ltr"
        className="fixed top-0 left-0 z-50 w-full bg-[#F1F3C5]/90 backdrop-blur-md shadow-md"
      >
        <div className="flex items-center justify-center w-full py-2 mx-auto max-w-7xl">
          {/* לוגו בלבד, ללא Link */}
          <div className="flex items-center gap-3 select-none">
            <img
              src="/backgrounds/LogoOmerTattoo_transparent.png"
              alt="Omer Logo"
              className="w-auto h-10"
              draggable={false}
            />
          </div>
        </div>
      </header>
    );
  }

  // --------- מצב רגיל: ההאדר המלא ---------
  return (
    <Navbar
      fluid
      rounded
      dir="ltr"
      className="fixed top-0 left-0 z-50 w-full bg-[#F1F3C5]/90 backdrop-blur-md shadow-md text-[#3B3024]"
    >
      <div className="flex items-center w-full mx-auto max-w-7xl">
        <Navbar.Brand
          as={Link as typeof Link}
          to="/"
          className="!p-0 !m-0 flex items-center"
        >
          <img
            src="/backgrounds/omerlogo.png"
            alt="Omer Logo"
            className="w-auto h-30"
          />
        </Navbar.Brand>

        <div className="flex items-center gap-2 ms-auto">
          <Navbar.Toggle onClick={() => setIsOpen((p) => !p)} />
        </div>
      </div>

      <Navbar.Collapse
        className={`${isOpen ? "block" : "hidden"} md:flex md:items-center md:gap-3 md:ms-auto text-lg`}
      >
        {!user && (
          <div className="flex items-center gap-3">
            <Navbar.Link
              as={Link as typeof Link}
              to="/register"
              className={`${baseLink} ${pathname === "/register" ? active : ""}`}
            >
              הרשמה
            </Navbar.Link>
            <Navbar.Link
              as={Link as typeof Link}
              to="/login"
              className={`${baseLink} ${pathname === "/login" ? active : ""}`}
            >
              התחבר
            </Navbar.Link>
          </div>
        )}

        {user?.isAdmin && (
          <Navbar.Link
            as={Link as typeof Link}
            to="/AdminPage"
            className={`${baseLink} ${pathname === "/AdminPage" ? active : ""}`}
          >
            Admin
          </Navbar.Link>
        )}

        {user && (
          <button
            onClick={logout}
            className="px-3 py-2 transition rounded-lg hover:underline hover:text-red-500"
          >
            התנתק
          </button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
