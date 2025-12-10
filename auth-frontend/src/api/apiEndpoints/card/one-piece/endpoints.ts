// export const OPCARD_ENDPOINTS = {
//   list: "/api/cards",
//   create: "/api/cards",
//   pending: "/api/cards/pending",
//   reject: "/api/cards/rejected",
//   updateStatus: (id: string) => `/api/cards/${id}/status`,
//   getById: (id: string) => `/api/cards/${id}`,
// };

// apiEndpoints/card/one-piece/endpoints.ts
export const OPCARD_ENDPOINTS = {
  // Public endpoints
  list: "/api/cards",
  stats: "/api/cards/stats",
  getById: (id: string) => `/api/cards/${id}`,
  
  // Seller endpoints (protected)
  create: "/api/cards",
  myPending: "/api/cards/my/pending",
  myApproved: "/api/cards/my/approved",
  myRejected: "/api/cards/my/rejected",
  myCards: "/api/cards/my",
  
  // Admin endpoints (protected + admin)
  listAll: "/api/cards/all",
  pending: "/api/cards/pending",
  reject: "/api/cards/rejected",
  updateStatus: (id: string) => `/api/cards/${id}/status`,
  adminDelete: (id: string) => `/api/cards/${id}`,
};