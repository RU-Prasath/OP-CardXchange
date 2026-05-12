import axios from "axios";

const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Auth token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skyrise_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("skyrise_admin_token");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

// ── Public API ──────────────────────────────────────────────
export const publicApi = {
  getServices: () => api.get("/services"),
  getServiceBySlug: (slug) => api.get(`/services/${slug}`),
  getProjects: (params) => api.get("/projects", { params }),
  getTestimonials: () => api.get("/testimonials"),
  getTeam: () => api.get("/team"),
  getGallery: (params) => api.get("/gallery", { params }),
  getSettings: () => api.get("/settings"),
  getHeroSlides: () => api.get("/hero-slides"),
  submitContact: (data) => api.post("/contact", data),
  submitLead: (data) => api.post("/leads", data),
};

// ── Admin API ────────────────────────────────────────────────
export const adminApi = {
  login: (data) => api.post("/admin/login", data),
  getProfile: () => api.get("/admin/profile"),
  getDashboard: () => api.get("/admin/dashboard"),

  // Leads
  getLeads: (params) => api.get("/leads", { params }),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  exportLeads: () => api.get("/leads/export", { responseType: "blob" }),

  // Contacts
  getContacts: (params) => api.get("/contact", { params }),
  updateContact: (id, data) => api.put(`/contact/${id}`, data),
  deleteContact: (id) => api.delete(`/contact/${id}`),

  // Projects
  getProjects: (params) => api.get("/projects", { params }),
  createProject: (data) => api.post("/projects", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProject: (id, data) => api.put(`/projects/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Services
  getServices: () => api.get("/services"),
  createService: (data) => api.post("/services", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateService: (id, data) => api.put(`/services/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Testimonials
  getTestimonials: () => api.get("/testimonials"),
  createTestimonial: (data) => api.post("/testimonials", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Team
  getTeam: () => api.get("/team"),
  createTeamMember: (data) => api.post("/team", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateTeamMember: (id, data) => api.put(`/team/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteTeamMember: (id) => api.delete(`/team/${id}`),

  // Gallery
  getGallery: (params) => api.get("/gallery", { params }),
  addGalleryItem: (data) => api.post("/gallery", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateGalleryItem: (id, data) => api.put(`/gallery/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteGalleryItem: (id) => api.delete(`/gallery/${id}`),

  // Settings
  getSettings: () => api.get("/settings"),
  updateSettings: (data) => api.put("/settings/bulk", { settings: data }),
  uploadLogo: (data) => api.post("/settings/logo", data, { headers: { "Content-Type": "multipart/form-data" } }),
  uploadAboutImage: (data) => api.post("/settings/about-image", data, { headers: { "Content-Type": "multipart/form-data" } }),

  // Hero Slides
  getHeroSlides: () => api.get("/hero-slides/all"),
  createHeroSlide: (data) => api.post("/hero-slides", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateHeroSlide: (id, data) => api.put(`/hero-slides/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteHeroSlide: (id) => api.delete(`/hero-slides/${id}`),
};

export default api;
