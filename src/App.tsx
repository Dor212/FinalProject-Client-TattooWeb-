import { Route, Routes } from "react-router-dom";
import Header from "./components/Layout/Header/Header";
import HomePage from "./Pages/HomePage/HomePage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import { useSelector } from "react-redux";
import { TRootState } from "./Store/BigPie";
import RoutGuard from "./components/Shared/RoutGuard";
import Footer from "./components/Layout/Footer/Footer";
import LoginPage from "./Pages/LoginPage/LoginPage";
import UpdateUserDetails from "./Pages/UpdateUserPage/UpdateUserPage";
import GalleryPage from "./Pages/GalleryPage/GalleryPage";

function App() {
  const user = useSelector((state: TRootState) => state.UserSlice.user);

  return (
    <div className="" >
    <Header />
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/updateUser" element={<RoutGuard user={user!}> <UpdateUserDetails /> </RoutGuard>} />
        <Route path="/gallery/:category" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
