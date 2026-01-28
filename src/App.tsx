// App.tsx
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
import CookieBanner from "./components/cookies/CookieBanner";
import CanvasesPage from "./Pages/CanvasesPage/CanvasesPage";
import CheckoutPage from "./Pages/CheckoutPage/CheckoutPage";
import RequireAuth from "./components/routing/RequireAuth";
import PaymentResultPage from "./Pages/PaymentResultPage/PaymentResultPage";

function App() {
  useAuthInit();

  const BASE = import.meta.env.BASE_URL as string;
  const BG_DESKTOP = `${BASE}backgrounds/BG.png`;
  const BG_MOBILE = `${BASE}backgrounds/BGM.png`;

  return (
    <div className="relative min-h-[100svh] text-[#3B3024] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <picture>
          <source media="(min-width: 769px)" srcSet={BG_DESKTOP} />
          <img src={BG_MOBILE} alt="" className="object-cover object-center w-full h-full" draggable={false} />
        </picture>
      </div>

      <Header />

      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/gallery/:category" element={<GalleryPage />} />
          <Route path="/apply-sketch" element={<ApplySketchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/canvases" element={<CanvasesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/AdminPage" element={<AdminPage />} />
          </Route>
          <Route path="/payment/success" element={<PaymentResultPage kind="success" />} />
          <Route path="/payment/failure" element={<PaymentResultPage kind="failure" />} />
          <Route path="/payment/cancel" element={<PaymentResultPage kind="cancel" />} />
        </Routes>

        <CookieBanner />
      </main>

      <Footer />
    </div>
  );
}

export default App;
