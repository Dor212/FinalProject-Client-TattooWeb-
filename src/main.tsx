import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import bigPie from "./Store/BigPie.ts";
import { CartProvider } from "./components/context/CartContext.tsx";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={bigPie}>
      <BrowserRouter>
        <CartProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </CartProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
