import API from "./api.js";

export const authService = {
  register: async (name, email, password) => {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password,
    });
    return data;
  },

  login: async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    return data;
  },

  logout: async () => {
    const { data } = await API.post("/auth/logout");
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await API.get("/auth/me");
    return data;
  },
};