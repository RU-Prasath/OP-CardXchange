export const CARD_ENDPOINTS = {
  list: "/api/cards",
  create: "/api/cards",
  pending: "/api/cards/pending",
  reject: "/api/cards/rejected",
  updateStatus: (id: string) => `/api/cards/${id}/status`,
  getById: (id: string) => `/api/cards/${id}`,
};
