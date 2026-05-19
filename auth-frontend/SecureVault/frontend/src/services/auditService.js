import API from "./api.js";

export const auditService = {
  getMyLogs: async (params = {}) => {
    const { data } = await API.get("/audit", { params });
    return data;
  },

  getStats: async () => {
    const { data } = await API.get("/audit/stats");
    return data;
  },
};