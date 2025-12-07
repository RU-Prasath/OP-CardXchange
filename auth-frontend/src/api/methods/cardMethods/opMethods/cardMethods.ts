import { CARD_ENDPOINTS } from "../../../apiEndpoints/card";
import { api } from "../../../config/axiosClient";
import type { Card, CardListResponse } from "../../../types/card/opCard/card";

export const CardMethods = {
  listApproved: async (): Promise<CardListResponse> =>
    api.get(CARD_ENDPOINTS.list).then((res) => res.data),
  listRejected: async (): Promise<CardListResponse> =>
    api.get(CARD_ENDPOINTS.reject).then((res) => res.data),
  create: async (formData: FormData) =>
    api.post(CARD_ENDPOINTS.create, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  listPending: async (): Promise<CardListResponse> =>
    api.get(CARD_ENDPOINTS.pending).then((res) => res.data),
  listAll: async (params?: { status?: string }): Promise<CardListResponse> =>
    api.get(CARD_ENDPOINTS.list, { params }).then((res) => res.data),
  updateStatus: async (id: string, status: "approved" | "rejected") =>
    api.patch(CARD_ENDPOINTS.updateStatus(id), { status }),
  getById: async (id: string): Promise<{ card: Card }> =>
    api.get(CARD_ENDPOINTS.getById(id)).then((res) => res.data),
};
