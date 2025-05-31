import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/tailwind.css";
import "./styles/theme.css";
import HomePage from "./pages/HomePage";
import { ThemeProvider } from "./contexts/ThemeContext";
import WalletContextProvider from "./contexts/WalletContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WalletContextProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/wills/edit/:willId" element={<HomePage />} />
            <Route path="/wills/:willId" element={<HomePage />} />
            <Route path="/:page" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </WalletContextProvider>
  </React.StrictMode>
);
