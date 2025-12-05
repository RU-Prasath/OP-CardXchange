import { api } from "../config/axiosClient";
import { CARD_ENDPOINTS } from "../apiEndpoints/card";

export const CardMethods = {
  listApproved: async () => api.get(CARD_ENDPOINTS.list),
  create: async (formData: FormData) =>
    api.post(CARD_ENDPOINTS.create, formData, { headers: { "Content-Type": "multipart/form-data" }}),
  listPending: async () => api.get(CARD_ENDPOINTS.pending),
  updateStatus: async (id: string, status: "approved"|"rejected") =>
    api.patch(CARD_ENDPOINTS.updateStatus(id), { status }),
};
