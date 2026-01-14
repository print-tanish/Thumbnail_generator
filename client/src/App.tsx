import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import HomePage from "./pages/HomePage";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LenisScroll from "./components/LenisScroll";
import { AuthProvider } from "./context/AuthContext";

import "./globals.css";

export default function App() {
  const location = useLocation();

  // ✅ Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <>
      <AuthProvider>
        <LenisScroll />
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/generate/:id" element={<Generate />} />
          <Route path="/my-generation" element={<MyGeneration />} />
          <Route path="/preview/:id" element={<YtPreview />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </>
  );
}
