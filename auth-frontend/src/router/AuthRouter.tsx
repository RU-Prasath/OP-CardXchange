import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/sell" element={<SellCard />} />
        <Route path="/wishlist" element={<WishList />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
