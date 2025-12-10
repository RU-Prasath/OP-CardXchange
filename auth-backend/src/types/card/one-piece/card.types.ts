export interface CreateCardDTO {
  name: string;
  category?: string;
  condition?: string;
  description?: string;
  price: number;
}

export interface CardQueryParams {
  status?: "pending" | "approved" | "rejected";
  category?: string;
  search?: string;
}

export interface UpdateCardStatusDTO {
  status: "approved" | "rejected";
  rejectionReason?: string; // Add this
}