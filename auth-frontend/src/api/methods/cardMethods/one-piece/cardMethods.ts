import { OPCARD_ENDPOINTS } from "../../../apiEndpoints/card/one-piece/endpoints";
import { api } from "../../../clients/axiosClient";
import type { Card, CardListResponse } from "../../../types/card/opCard/card";

export const CardMethods = {
  listApproved: async (): Promise<CardListResponse> =>
    api.get(OPCARD_ENDPOINTS.list).then((res) => res.data),
  listRejected: async (): Promise<CardListResponse> =>
    api.get(OPCARD_ENDPOINTS.reject).then((res) => res.data),
  create: async (formData: FormData) =>
    api.post(OPCARD_ENDPOINTS.create, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  listPending: async (): Promise<CardListResponse> =>
    api.get(OPCARD_ENDPOINTS.pending).then((res) => res.data),
  listAll: async (params?: { status?: string }): Promise<CardListResponse> =>
    api.get(OPCARD_ENDPOINTS.list, { params }).then((res) => res.data),
  updateStatus: async (id: string, status: "approved" | "rejected") =>
    api.patch(OPCARD_ENDPOINTS.updateStatus(id), { status }),
  rejectCard: async (id: string, rejectionReason: string) => {
    return api.patch(OPCARD_ENDPOINTS.updateStatus(id), {
      status: "rejected",
      rejectionReason,
    });
  },
  getById: async (id: string): Promise<{ card: Card }> =>
    api.get(OPCARD_ENDPOINTS.getById(id)).then((res) => res.data),
  listMyPending: async (): Promise<CardListResponse> =>
    api.get(OPCARD_ENDPOINTS.myPending).then((res) => res.data),

  listMyApproved: async (): Promise<CardListResponse> =>
    api.get(OPCARD_ENDPOINTS.myApproved).then((res) => res.data),

  listMyRejected: async (): Promise<CardListResponse> =>
    api.get(OPCARD_ENDPOINTS.myRejected).then((res) => res.data),
  deleteMyCard: async (id: string) =>
    api.delete(`${OPCARD_ENDPOINTS.myCards}/${id}`),

  deleteCard: async (id: string) =>
    api.delete(`${OPCARD_ENDPOINTS.adminDelete(id)}`),
};
