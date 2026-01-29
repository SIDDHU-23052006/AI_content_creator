import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeProvider from "./context/ThemeContext";

import Loader from "./components/Loader";

import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Sign from "./pages/Sign";
import Dashboard from "./pages/Dashboard";

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}

      <Routes>
        <Route
  path="/"
  element={
    localStorage.getItem("isLoggedIn") ? <Home /> : <Intro />
  }
/>

        <Route
  path="/home"
  element={
    localStorage.getItem("isLoggedIn") ? <Home /> : <Sign />
  }
/>

        <Route path="/sign" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
