import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import AuthProvider from "../context/AuthContext";
import MainRoutes from "../routes/MainRoutes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <MainRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
