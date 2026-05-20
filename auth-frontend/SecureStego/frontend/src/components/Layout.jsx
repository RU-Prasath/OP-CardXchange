import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-950 bg-dot-grid">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
