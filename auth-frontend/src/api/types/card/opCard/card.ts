export interface Card {
  _id: string;
  name: string;
  category: string;
  condition: string;
  description: string;
  images: string[];
  price?: number;
  seller: {
    _id: string;
    fullName: string;
    email: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface CardListResponse {
  data: any;
  cards: Card[];
}
