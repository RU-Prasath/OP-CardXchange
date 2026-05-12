import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";

// Public pages
import MainLayout from "./layouts/MainLayout";
import LoadingScreen from "./components/common/LoadingScreen";
import LeadPopup from "./components/common/LeadPopup";
import WhatsAppButton from "./components/common/WhatsAppButton";

// Admin
import AdminLayout from "./admin/layouts/AdminLayout";
import ProtectedRoute from "./admin/components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Works = lazy(() => import("./pages/Works"));
const Contact = lazy(() => import("./pages/Contact"));

// Admin pages
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const LeadsPage = lazy(() => import("./admin/pages/LeadsPage"));
const EnquiriesPage = lazy(() => import("./admin/pages/EnquiriesPage"));
const ProjectsPage = lazy(() => import("./admin/pages/ProjectsPage"));
const ServicesPage = lazy(() => import("./admin/pages/ServicesPage"));
const TestimonialsPage = lazy(() => import("./admin/pages/TestimonialsPage"));
const TeamPage = lazy(() => import("./admin/pages/TeamPage"));
const GalleryPage = lazy(() => import("./admin/pages/GalleryPage"));
const SettingsPage = lazy(() => import("./admin/pages/SettingsPage"));
const HeroSlidesPage = lazy(() => import("./admin/pages/HeroSlidesPage"));

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <LeadPopup />}
      {!isAdmin && <WhatsAppButton />}
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/works" element={<Works />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/leads" element={<LeadsPage />} />
                <Route path="/admin/enquiries" element={<EnquiriesPage />} />
                <Route path="/admin/projects" element={<ProjectsPage />} />
                <Route path="/admin/services" element={<ServicesPage />} />
                <Route path="/admin/testimonials" element={<TestimonialsPage />} />
                <Route path="/admin/team" element={<TeamPage />} />
                <Route path="/admin/gallery" element={<GalleryPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/hero-slides" element={<HeroSlidesPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}
