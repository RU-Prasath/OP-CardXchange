export const CARD_ENDPOINTS = {
  list: "/api/cards",
  create: "/api/cards",
  pending: "/api/cards/pending",
  updateStatus: (id: string) => `/api/cards/${id}/status`
};
