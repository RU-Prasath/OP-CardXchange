import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardMethods } from "../../../methods";
import type { Card, CardListResponse } from "../../../types/card/opCard/card";
import { customToast } from "../../../../utils/customToast";
import { api } from "../../../clients/axiosClient";

// Approved cards
export const useFetchApprovedCards = () =>
  useQuery<CardListResponse>({
    queryKey: ["cards", "approved"],
    queryFn: CardMethods.listApproved,
  });

// Pending cards
export const useFetchPendingCards = () =>
  useQuery<CardListResponse>({
    queryKey: ["cards", "pending"],
    queryFn: CardMethods.listPending,
  });

// Rejected cards
export const useFetchRejectedCards = () =>
  useQuery<CardListResponse>({
    queryKey: ["cards", "rejected"],
    queryFn: CardMethods.listRejected,
  });

// Create card
export const useCreateCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => CardMethods.create(formData),
    onSuccess: () => {
      customToast.success("Card submitted for review");
      qc.invalidateQueries({ queryKey: ["cards", "approved"] });
    },
    onError: (err: any) =>
      customToast.error(err.response?.data?.message || "Submit failed"),
  });
};

// 11/12 10:52
// export const useUpdateCardStatus = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       id,
//       status,
//     }: {
//       id: string;
//       status: "approved" | "rejected";
//     }) => CardMethods.updateStatus(id, status),
//     onSuccess: () => {
//       customToast.success("Updated");
//       qc.invalidateQueries({ queryKey: ["cards", "pending"] });
//       qc.invalidateQueries({ queryKey: ["cards", "approved"] });
//       qc.invalidateQueries({ queryKey: ["cards", "rejected"] });
//     },
//     onError: (err: any) =>
//       customToast.error(err.response?.data?.message || "Update failed"),
//   });
// };

// hooks/card/one-piece/useCards.ts
export const useUpdateCardStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: "approved" | "rejected";
      rejectionReason?: string;
    }) => {
      const payload: any = { status };

      if (status === "rejected") {
        if (!rejectionReason) {
          throw new Error("Rejection reason is required");
        }
        payload.rejectionReason = rejectionReason;
      }

      return api.patch(`/api/cards/${id}/status`, payload);
    },
    onSuccess: () => {
      customToast.success("Updated");
      qc.invalidateQueries({ queryKey: ["cards", "pending"] });
      qc.invalidateQueries({ queryKey: ["cards", "approved"] });
      qc.invalidateQueries({ queryKey: ["cards", "rejected"] });
    },
    onError: (err: any) => {
      console.error("Update status error:", err);
      customToast.error(err.response?.data?.message || "Update failed");
    },
  });
};

export const useFetchCardById = (id: string) =>
  useQuery<{ card: Card }>({
    queryKey: ["cards", id],
    queryFn: () => CardMethods.getById(id),
    enabled: !!id,
    retry: false,
  });

export const useFetchMyPendingCards = () =>
  useQuery<CardListResponse>({
    queryKey: ["cards", "my", "pending"],
    queryFn: CardMethods.listMyPending,
  });

export const useFetchMyApprovedCards = () =>
  useQuery<CardListResponse>({
    queryKey: ["cards", "my", "approved"],
    queryFn: CardMethods.listMyApproved,
  });

export const useFetchMyRejectedCards = () =>
  useQuery<CardListResponse>({
    queryKey: ["cards", "my", "rejected"],
    queryFn: CardMethods.listMyRejected,
  });

export const useDeleteMyCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CardMethods.deleteMyCard(id),
    onSuccess: () => {
      customToast.success("Card deleted successfully");
      qc.invalidateQueries({ queryKey: ["cards", "my"] });
      qc.invalidateQueries({ queryKey: ["cards", "my", "pending"] });
      qc.invalidateQueries({ queryKey: ["cards", "my", "approved"] });
      qc.invalidateQueries({ queryKey: ["cards", "my", "rejected"] });
    },
    onError: (err: any) => {
      customToast.error(err.response?.data?.message || "Failed to delete card");
    },
  });
};

// Delete card (admin deletes any card)
export const useDeleteCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CardMethods.deleteCard(id),
    onSuccess: () => {
      customToast.success("Card deleted successfully");
      qc.invalidateQueries({ queryKey: ["cards", "pending"] });
      qc.invalidateQueries({ queryKey: ["cards", "approved"] });
      qc.invalidateQueries({ queryKey: ["cards", "rejected"] });
      qc.invalidateQueries({ queryKey: ["cards", "all"] });
    },
    onError: (err: any) => {
      customToast.error(err.response?.data?.message || "Failed to delete card");
    },
  });
};