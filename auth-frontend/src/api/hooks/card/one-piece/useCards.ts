import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardMethods } from "../../../methods";
import type { Card, CardListResponse } from "../../../types/card/opCard/card";
import { customToast } from "../../../../utils/customToast";

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

// Update card status (approve/reject)
export const useUpdateCardStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected";
    }) => CardMethods.updateStatus(id, status),
    onSuccess: () => {
      customToast.success("Updated");
      qc.invalidateQueries({ queryKey: ["cards", "pending"] });
      qc.invalidateQueries({ queryKey: ["cards", "approved"] });
      qc.invalidateQueries({ queryKey: ["cards", "rejected"] });
    },
    onError: (err: any) =>
      customToast.error(err.response?.data?.message || "Update failed"),
  });
};

export const useFetchCardById = (id: string) =>
  useQuery<{ card: Card }>({
    queryKey: ["cards", id],
    queryFn: () => CardMethods.getById(id),
    enabled: !!id,
    retry: false,
  });
