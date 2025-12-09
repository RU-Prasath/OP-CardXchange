import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/common/layout/Navbar";
import AuthProvider from "../context/AuthContext";
import MainRoutes from "./routes/MainRoutes";
import Footer from "../components/common/layout/Footer";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <MainRoutes />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
