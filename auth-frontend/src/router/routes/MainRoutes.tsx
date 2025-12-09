import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import ResetPassword from "../../pages/auth/ResetPassword";
import MainPage from "../../pages/MainPage";
import AdminPanel from "../../pages/admin/AdminPanel";
import Dashboard from "../../pages/cards/one-piece/landingPage/Dashboard";
import SellPage from "../../pages/cards/one-piece/sellingPage/SellPage";
import CategoryPage from "../../pages/cards/one-piece/categoryPage/Category";
import OnePieceAdmin from "../../pages/admin/cards/OnePiece/OnePieceAdmin";
import CardSection from "../../pages/cards/one-piece/landingPage/CardSection";
import ProductDetail from "../../pages/cards/one-piece/productDetailPage/ProductDetail";
import WishList from "../../pages/cards/one-piece/wishlistPage/WishList";
import AllCards from "../../pages/cards/one-piece/allCards/AllCards";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  adminOnly?: boolean;
}

const routeConfig: RouteConfig[] = [
  { path: "/", element: <MainPage /> },
  { path: "/cards/one-piece", element: <Dashboard /> },
  { path: "/cards/one-piece/cards", element: <CardSection /> },
  { path: "/cards/one-piece/cards/:id", element: <ProductDetail /> },
  { path: "/cards/one-piece/category", element: <CategoryPage /> },
  { path: "/cards/one-piece/wishlist", element: <WishList /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/cards/one-piece/sell", element: <SellPage />, protected: true },
  { path: "/admin", element: <AdminPanel />, protected: true, adminOnly: true },
  {
    path: "/admin/cards/one-piece",
    element: <ProtectedRoute adminOnly>{<OnePieceAdmin />}</ProtectedRoute>,
  },
  {
    path: "/cards/one-piece/all-cards",
    element: <AllCards />,
  },
];

export default function MainRoutes() {
  return (
    <Routes>
      {routeConfig.map(
        ({ path, element, protected: isProtected, adminOnly }, idx) => (
          <Route
            key={idx}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute adminOnly={adminOnly}>{element}</ProtectedRoute>
              ) : (
                element
              )
            }
          />
        )
      )}
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
