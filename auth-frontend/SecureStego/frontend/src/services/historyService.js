import API from "./api.js";

export const historyService = {
  /**
   * Fetch the current user's past hide/reveal operations.
   */
  getHistory: async (limit = 50) => {
    const { data } = await API.get("/history/", { params: { limit } });
    return data;
  },
};