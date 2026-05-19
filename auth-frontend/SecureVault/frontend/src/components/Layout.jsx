import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Subtle background pattern */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-lg h-128 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-lg h-128 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
