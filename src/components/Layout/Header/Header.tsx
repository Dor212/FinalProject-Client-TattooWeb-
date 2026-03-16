import { Navbar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TRootState } from "../../../Store/BigPie";
import { useEffect, useState } from "react";
import { clearToken } from "../../../Services/tokenServices.ts";
import { userActions } from "../../../Store/UserSlice.ts";
import axios from "../../../Services/axiosInstance";

const Header = () => {
  const BASE = import.meta.env.BASE_URL as string;
  const API = import.meta.env.VITE_API_URL as string;
  const LOGO_SRC = `${BASE}LogoOme.png`;

  const [isOpen, setIsOpen] = useState(false);
  const [hasProducts, setHasProducts] = useState<boolean>(false);
  const [hasCanvases, setHasCanvases] = useState<boolean>(false);

  const userState = useSelector((state: TRootState) => state.UserSlice);
  const user = userState.user;
  const isLoggedIn = userState.isLoggedIn || Boolean(user);

  const location = useLocation();
  const pathname = location.pathname;

  const dispatch = useDispatch();
  const nav = useNavigate();

  const HIDE_HEADER_ROUTES = ["/simulator", "/apply-sketch", "/ApplySketch"];
  const shouldHideHeader = HIDE_HEADER_ROUTES.some((p) => pathname.startsWith(p));

  const HOME_PATH = "/";
  const HOME_LOGO_SECTION_ID = "logo";

  const logout = () => {
    clearToken();
    dispatch(userActions.logout());
    nav("/");
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    const loadNavAvailability = async () => {
      try {
        const [productsRes, canvasesRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/canvases`),
        ]);

        if (cancelled) return;

        setHasProducts(Array.isArray(productsRes.data) && productsRes.data.length > 0);
        setHasCanvases(Array.isArray(canvasesRes.data) && canvasesRes.data.length > 0);
      } catch {
        if (cancelled) return;
        setHasProducts(false);
        setHasCanvases(false);
      }
    };

    loadNavAvailability();

    return () => {
      cancelled = true;
    };
  }, [API]);

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

  if (shouldHideHeader) return null;

  return (
    <Navbar
      fluid
      rounded
      className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-xl border-b border-[#B9895B]/15 shadow-[0_10px_35px_rgba(30,30,30,0.08)]"
    >
      <Navbar.Brand onClick={scrollToHomeLogo} className="cursor-pointer select-none">
        <img src={LOGO_SRC} className="h-10 mr-3 sm:h-12" alt="Logo" draggable={false} />
      </Navbar.Brand>

      <div className="flex gap-2 md:order-2">
        {user?.isAdmin && (
          <Link
            to="/AdminPage"
            className="rounded-xl px-3 py-2 text-sm font-bold text-[#1E1E1E]/80 hover:text-[#B9895B] hover:bg-white/50 transition"
          >
            Admin
          </Link>
        )}

        {isLoggedIn ? (
          <button
            onClick={logout}
            className="rounded-xl px-3 py-2 text-sm font-bold text-white bg-[#B9895B] hover:bg-[#a67952] transition"
          >
            התנתק
          </button>
        ) : (
          <Link
            to="/login"
            className="rounded-xl px-3 py-2 text-sm font-bold text-white bg-[#B9895B] hover:bg-[#a67952] transition"
          >
            התחברות
          </Link>
        )}

        <Navbar.Toggle onClick={() => setIsOpen((v) => !v)} />
      </div>

      <Navbar.Collapse className={isOpen ? "block" : "hidden md:block"}>
        {hasCanvases && (
          <Link
            to="/canvases"
            className="block px-3 py-2 rounded-xl text-sm font-bold text-[#1E1E1E]/75 hover:text-[#B9895B] hover:bg-white/40 transition"
          >
            קאנבסים
          </Link>
        )}

        {hasProducts && (
          <Link
            to="/products"
            className="block px-3 py-2 rounded-xl text-sm font-bold text-[#1E1E1E]/75 hover:text-[#B9895B] hover:bg-white/40 transition"
          >
            מוצרים
          </Link>
        )}

        <Link
          to="/apply-sketch"
          className="block px-3 py-2 rounded-xl text-sm font-bold text-[#1E1E1E]/75 hover:text-[#B9895B] hover:bg-white/40 transition"
        >
          הדמיה
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;