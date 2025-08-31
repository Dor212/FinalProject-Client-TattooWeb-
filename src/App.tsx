// src/App.tsx
import { Route, Routes } from "react-router-dom";
import Header from "./components/Layout/Header/Header";
import HomePage from "./Pages/HomePage/HomePage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import Footer from "./components/Layout/Footer/Footer";
import LoginPage from "./Pages/LoginPage/LoginPage";
import GalleryPage from "./Pages/GalleryPage/GalleryPage";
import AdminPage from "./Pages/AdminPage/AdminPage";
import ApplySketchPage from "./Pages/SimulatorPage/SimulatorPage";
import useAuthInit from "./components/useAuthInit";
import AllProductsPage from "./Pages/AllProductsPage/AllProductsPage";
import LegalPage from "./Pages/LegalPage/LegalPage";
import AccessibilityWidget from "./components/accessibility/AccessibilityWidget.tsx";
import { CookieConsentProvider } from "./components/cookies/CookieConsentProvider.tsx";
import CookieBanner from "./components/cookies/CookieBanner.tsx";

function App() {
  useAuthInit();

  return (
    <CookieConsentProvider>
      <div>
        <AccessibilityWidget />
        <CookieBanner />
        <Header />

        <div id="content" tabIndex={-1} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/gallery/:category" element={<GalleryPage />} />
          <Route path="/apply-sketch" element={<ApplySketchPage />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Routes>

        <Footer />
      </div>
    </CookieConsentProvider>
  );
}

export default App;
