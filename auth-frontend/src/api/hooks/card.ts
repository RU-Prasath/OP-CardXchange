// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { CardMethods } from "../methods/cardMethods";
// import { successToast, errorToast } from "../../utils/customToast";

// export const useFetchApprovedCards = () => {
//   return useQuery({ queryKey: ["cards","approved"], queryFn: CardMethods.listApproved });
// };

// export const useCreateCard = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (formData: FormData) => CardMethods.create(formData),
//     onSuccess: () => {
//       successToast("Card submitted for review");
//       qc.invalidateQueries(["cards","approved"]);
//     },
//     onError: (err: any) => errorToast(err.response?.data?.message || "Submit failed"),
//   });
// };

// export const useFetchPendingCards = () => {
//   return useQuery({ queryKey: ["cards","pending"], queryFn: CardMethods.listPending });
// };

// export const useUpdateCardStatus = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, status }: { id: string; status: "approved"|"rejected" }) => CardMethods.updateStatus(id, status),
//     onSuccess: () => {
//       successToast("Updated");
//       qc.invalidateQueries(["cards","pending"]);
//       qc.invalidateQueries(["cards","approved"]);
//     },
//     onError: (err: any) => errorToast(err.response?.data?.message || "Update failed"),
//   });
// };

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardMethods } from "../methods/cardMethods";
import { customToast } from "../../utils/customToast";

export const useFetchApprovedCards = () => {
  return useQuery({ queryKey: ["cards","approved"], queryFn: CardMethods.listApproved });
};

export const useCreateCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => CardMethods.create(formData),
    onSuccess: () => {
      customToast.success("Card submitted for review");
      qc.invalidateQueries({ queryKey: ["cards","approved"] });
    },
    onError: (err: any) => customToast.error(err.response?.data?.message || "Submit failed"),
  });
};

export const useFetchPendingCards = () => {
  return useQuery({ queryKey: ["cards","pending"], queryFn: CardMethods.listPending });
};

export const useUpdateCardStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved"|"rejected" }) => CardMethods.updateStatus(id, status),
    onSuccess: () => {
      customToast.success("Updated");
      qc.invalidateQueries({ queryKey: ["cards","pending"] });
      qc.invalidateQueries({ queryKey: ["cards","approved"] });
    },
    onError: (err: any) => customToast.error(err.response?.data?.message || "Update failed"),
  });
};