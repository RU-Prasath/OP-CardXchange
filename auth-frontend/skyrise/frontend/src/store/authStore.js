// Simple pub-sub store using localStorage
let listeners = [];
const notify = () => listeners.forEach((fn) => fn());

const state = {
  token: localStorage.getItem("skyrise_admin_token") || null,
  admin: JSON.parse(localStorage.getItem("skyrise_admin") || "null"),
};

export const authStore = {
  getState: () => state,
  subscribe: (fn) => {
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  },
  login: (token, admin) => {
    state.token = token;
    state.admin = admin;
    localStorage.setItem("skyrise_admin_token", token);
    localStorage.setItem("skyrise_admin", JSON.stringify(admin));
    notify();
  },
  logout: () => {
    state.token = null;
    state.admin = null;
    localStorage.removeItem("skyrise_admin_token");
    localStorage.removeItem("skyrise_admin");
    notify();
  },
  isAuthenticated: () => !!state.token,
};

export default authStore;
