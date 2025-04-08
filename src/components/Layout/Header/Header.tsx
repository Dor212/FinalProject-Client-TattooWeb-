import {  Navbar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TRootState } from "../../../Store/BigPie";
import { userActions } from "../../../Store/UserSlice";

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
        {user?.isBusiness && <Navbar.Link as={Link} href="/updateUser" to="/updateUser" active={location === "/updateUser" || location === "/"} className="text-2xl">
          Porfile
        </Navbar.Link>}
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