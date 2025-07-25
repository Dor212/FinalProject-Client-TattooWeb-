import { Route, Routes } from "react-router-dom";
import Header from "./components/Layout/Header/Header";
import HomePage from "./Pages/HomePage/HomePage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import Footer from "./components/Layout/Footer/Footer";
import LoginPage from "./Pages/LoginPage/LoginPage";
import GalleryPage from "./Pages/GalleryPage/GalleryPage";
import AdminPage from "./Pages/AdminPage/AdminPage"
import ApplySketchPage from "./Pages/SimulatorPage/SimulatorPage"
import useAuthInit from "./components/useAuthInit";


function App() {
  useAuthInit();
  
  return (
    <div className="" >
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/gallery/:category" element={<GalleryPage />} />
        <Route path="/apply-sketch" element={<ApplySketchPage />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;