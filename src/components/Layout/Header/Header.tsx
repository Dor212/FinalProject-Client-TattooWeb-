import { Navbar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TRootState } from "../../../Store/BigPie";
import { useEffect, useMemo, useState } from "react";
import axios from "../../../Services/axiosInstance";
import { decode } from "../../../Services/tokenServices.ts";
import { userActions } from "../../../Store/UserSlice.ts";

const Header = () => {
  const { VITE_API_URL } = import.meta.env;
  const BASE = import.meta.env.BASE_URL as string;
  const LOGO_SRC = `${BASE}LogoOme.png`;

  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: TRootState) => state.UserSlice.user);

  const location = useLocation();
  const pathname = location.pathname;

  const dispatch = useDispatch();
  const nav = useNavigate();

  const CANVAS_ROUTES = useMemo(
    () => ["/canvas", "/canvases", "/simulator", "/ApplySketch"],
    []
  );
  const isCanvasPage = CANVAS_ROUTES.some((p) => pathname.startsWith(p));
  const SHOW_MINIMAL_LOGO_ONLY = true;

  const HOME_PATH = "/";
  const HOME_LOGO_SECTION_ID = "logo";

  const logout = () => {
    dispatch(userActions.logout());
    nav("/");
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  const scrollToHomeLogo = () => {
    const tryScroll = () => {
      const el = document.getElementById(HOME_LOGO_SECTION_ID);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    if (pathname === HOME_PATH) {
      if (!tryScroll()) window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    nav(HOME_PATH);

    let tries = 0;
    const maxTries = 40;

    const tick = () => {
      if (tryScroll()) return;
      tries += 1;
      if (tries >= maxTries) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const baseLink =
    "px-3 py-2 rounded-xl transition-colors duration-200 text-[#1E1E1E] hover:text-[#B9895B] hover:underline hover:decoration-[#B9895B] hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40";
  const active =
    "font-semibold text-[#B9895B] underline decoration-[#B9895B] decoration-2 underline-offset-4";

  if (isCanvasPage && !SHOW_MINIMAL_LOGO_ONLY) return null;

  const glassClass =
    "fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-md border-b border-white/10 text-[#1E1E1E] shadow-[0_8px_30px_rgba(0,0,0,0.08)]";

  if (isCanvasPage && SHOW_MINIMAL_LOGO_ONLY) {
    return (
      <header className={glassClass}>
        <div className="flex items-center justify-center w-full py-2 mx-auto max-w-7xl">
          <button
            type="button"
            onClick={scrollToHomeLogo}
            className="select-none rounded-xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40"
            aria-label="Go to logo section"
          >
            <img
              src={LOGO_SRC}
              alt="Omer Logo"
              className="block w-auto h-12"
              draggable={false}
            />
          </button>
        </div>
      </header>
    );
  }

  return (
    <Navbar fluid rounded dir="ltr" className={glassClass}>
      <div className="flex items-center w-full mx-auto max-w-7xl">
        <button
          type="button"
          onClick={scrollToHomeLogo}
          className="flex items-center !p-0 !m-0 select-none rounded-xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40"
          aria-label="Go to home logo section"
        >
          <img
            src={LOGO_SRC}
            alt="Omer Logo"
            className="block w-auto h-12"
            draggable={false}
          />
        </button>

        <div className="flex items-center gap-2 ms-auto">
          <Navbar.Toggle
            onClick={() => setIsOpen((p) => !p)}
            className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40"
          />
        </div>
      </div>

      <Navbar.Collapse
        dir="rtl"
        className={`${isOpen ? "block" : "hidden"} md:flex md:items-center md:gap-2 md:ms-auto text-base`}
      >
        <div className="p-2 mt-2 border shadow-sm md:mt-0 rounded-2xl md:rounded-none bg-white/40 md:bg-transparent md:p-0 md:shadow-none border-white/20 md:border-0">
          {!user && (
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
              <Navbar.Link
                as={Link as typeof Link}
                to="/register"
                onClick={() => setIsOpen(false)}
                className={`${baseLink} ${pathname === "/register" ? active : ""}`}
              >
                הרשמה
              </Navbar.Link>
              <Navbar.Link
                as={Link as typeof Link}
                to="/login"
                onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
              className={`${baseLink} ${pathname === "/AdminPage" ? active : ""}`}
            >
              Admin
            </Navbar.Link>
          )}

          {user && (
            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl transition-colors duration-200 text-[#1E1E1E] hover:text-[#8B2C2C] hover:underline hover:decoration-[#8B2C2C] hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9895B]/40"
            >
              התנתק
            </button>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
