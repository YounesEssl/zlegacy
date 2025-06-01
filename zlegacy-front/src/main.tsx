import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/tailwind.css";
import "./styles/theme.css";
import HomePage from "./pages/HomePage";
import { ThemeProvider } from "./contexts/ThemeContext";
import WalletContextProvider from "./contexts/WalletContext";
import UserRegistrationWrapper from "./components/UserRegistrationWrapper";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WalletContextProvider>
      <ThemeProvider>
        <UserRegistrationWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/wills/edit/:willId" element={<HomePage />} />
              <Route path="/wills/:willId" element={<HomePage />} />
              <Route path="/:page" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </UserRegistrationWrapper>
      </ThemeProvider>
    </WalletContextProvider>
  </React.StrictMode>
);
