import {  Navbar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TRootState } from "../../../Store/BigPie";
import { useEffect } from "react";
import axios from "axios";
import { decode } from "../../../Services/tokenServices.ts";
import { userActions } from "../../../Store/UserSlice.ts";   
import { useState } from "react";




const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: TRootState) => state.UserSlice.user);
  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const nav = useNavigate();

  
  const logout = () => {
    dispatch(userActions.logout());
    nav("/") 
  }

  const toggleNavbar = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = decode(token);

        axios.defaults.headers.common["x-auth-token"] = token;

        axios.get(`http://localhost:8080/users/${decoded._id}`)
          .then(res => {
            
            dispatch(userActions.login(res.data));
          })
          .catch(err => {
            console.error("שגיאה בטעינת המשתמש מהשרת:", err);
            localStorage.removeItem("token");
          });
      } catch (err) {
        console.error("טוקן לא תקין:", err);
        localStorage.removeItem("token");
      }
    }
  }, []); useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = decode(token);
        axios.defaults.headers.common["x-auth-token"] = token;

        axios.get(`http://localhost:8080/users/${decoded._id}`)
          .then(res => {
            if (typeof res.data === "object" && res.data._id) {
              console.log("USER FROM SERVER:", res.data);
              dispatch(userActions.login(res.data));
            } else {
              console.error("השרת לא החזיר משתמש תקין:", res.data);
              localStorage.removeItem("token");
            }
          })
          .catch(err => {
            console.error("שגיאה בטעינת המשתמש מהשרת:", err);
            localStorage.removeItem("token");
          });
      } catch (err) {
        console.error("טוקן לא תקין:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <Navbar fluid rounded className="bg-[#F1F3C2] text-gray-800" >
      <Navbar.Toggle onClick={toggleNavbar} />
      <Navbar.Brand as={Link} to="/home">OMER</Navbar.Brand>
      <Navbar.Collapse className={`flex flex-col items-center md:flex-row space-x-4 text-inherit ${isOpen ? 'block' : 'hidden'}`}>
        {!user && <Navbar.Link as={Link} href="/register" to="/register" active={location === "/register" || location === "/"} className="text-2xl">
          Register
        </Navbar.Link>}
        {!user && <Navbar.Link as={Link} href="/login" to="/login" active={location === "/login" || location === "/"} className="text-2xl">
          Login
        </Navbar.Link>}
        {user?.isAdmin && (
          <Navbar.Link as={Link} to="/AdminPage" className="text-2xl">
            AdminPage
          </Navbar.Link>
        )}
        {user && <Navbar.Link as={Link} className="text-2xl" onClick={logout}>
          Logout
        </Navbar.Link>}
        <Navbar.Brand>
        </Navbar.Brand>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;